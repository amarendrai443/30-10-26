/**
 * Centralized SPA Routing, Router State Tracker, Strict History Stack & Modal Navigation
 */

export interface ModalEntry {
  id: string;
  name: string;
  onClose: () => void;
}

class NavigationHistoryManager {
  private modalStack: ModalEntry[] = [];
  private isProgrammaticBack = false;
  private lastBackPressTime = 0;
  private exitPromptListeners: Array<(show: boolean) => void> = [];
  private historyStack: string[] = [];
  private routeChangeListeners: Array<(route: string) => void> = [];

  constructor() {
    if (typeof window !== 'undefined') {
      window.addEventListener('popstate', this.handlePopState);
      try {
        const stored = sessionStorage.getItem('nhealth_router_history_stack');
        if (stored) {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed) && parsed.length > 0) {
            this.historyStack = parsed;
          }
        }
      } catch {}
    }
  }

  // Synchronize initial stack if empty
  public initStack(initialRoute: string): void {
    if (this.historyStack.length === 0) {
      this.historyStack = [initialRoute];
      this.persistStack();
    }
  }

  // Push new route to router history tracker
  public pushRoute(route: string, urlPath?: string): void {
    const current = this.historyStack[this.historyStack.length - 1];
    if (current !== route) {
      this.historyStack.push(route);
      this.persistStack();
      this.notifyRoute(route);
    }
    if (typeof window !== 'undefined') {
      const path = urlPath || (route === 'home' ? '/' : `/${route}`);
      window.history.pushState({ route }, '', path);
    }
  }

  // Ensure logical hierarchy for service details: ['services', serviceRoute]
  public pushServiceRoute(serviceRoute: string, urlPath?: string): void {
    // Filter out redundant occurrences
    this.historyStack = this.historyStack.filter((r) => r !== serviceRoute && r !== 'services');
    this.historyStack.push('services');
    this.historyStack.push(serviceRoute);
    this.persistStack();
    this.notifyRoute(serviceRoute);

    if (typeof window !== 'undefined') {
      const path = urlPath || `/${serviceRoute}`;
      window.history.pushState({ route: serviceRoute }, '', path);
    }
  }

  // Strictly pop one step backward and return the target route
  public popStep(): string | null {
    if (this.historyStack.length > 1) {
      this.historyStack.pop();
      const prev = this.historyStack[this.historyStack.length - 1] || null;
      this.persistStack();
      if (prev) this.notifyRoute(prev);
      return prev;
    }
    return null;
  }

  // Peek the immediate previous route
  public peekPrevious(): string | null {
    if (this.historyStack.length > 1) {
      return this.historyStack[this.historyStack.length - 2];
    }
    return null;
  }

  // Get current history stack
  public getHistoryStack(): string[] {
    return [...this.historyStack];
  }

  // Set or replace history stack
  public setHistoryStack(stack: string[]): void {
    this.historyStack = [...stack];
    this.persistStack();
  }

  private persistStack(): void {
    if (typeof window !== 'undefined') {
      try {
        sessionStorage.setItem('nhealth_router_history_stack', JSON.stringify(this.historyStack));
      } catch {}
    }
  }

  public onRoute(listener: (route: string) => void): () => void {
    this.routeChangeListeners.push(listener);
    return () => {
      this.routeChangeListeners = this.routeChangeListeners.filter((l) => l !== listener);
    };
  }

  private notifyRoute(route: string): void {
    this.routeChangeListeners.forEach((l) => l(route));
  }

  // Register an open modal/popup/overlay
  public pushModal(id: string, name: string, onClose: () => void): () => void {
    if (typeof window === 'undefined') return () => {};

    // Prevent duplicates
    this.modalStack = this.modalStack.filter((m) => m.id !== id);
    this.modalStack.push({ id, name, onClose });

    try {
      window.history.pushState(
        { isModal: true, modalId: id, modalName: name },
        '',
        window.location.href
      );
    } catch {}

    return () => this.popModal(id);
  }

  // Called when closed via UI button ("X" or backdrop)
  public popModal(id: string): void {
    if (typeof window === 'undefined') return;

    const idx = this.modalStack.findIndex((m) => m.id === id);
    if (idx !== -1) {
      this.modalStack.splice(idx, 1);
      if (window.history.state?.isModal) {
        this.isProgrammaticBack = true;
        window.history.back();
      }
    }
  }

  // Check if any modal is currently active
  public hasOpenModals(): boolean {
    return this.modalStack.length > 0;
  }

  // Close the topmost modal
  public closeTopModal(): boolean {
    const top = this.modalStack.pop();
    if (top) {
      try {
        top.onClose();
      } catch (err) {
        console.error('Error closing modal on back:', err);
      }
      return true;
    }
    return false;
  }

  // Close all open modals without altering underlying page
  public closeAllModals(): boolean {
    if (this.modalStack.length === 0) return false;
    while (this.modalStack.length > 0) {
      const top = this.modalStack.pop();
      if (top) {
        try {
          top.onClose();
        } catch {}
      }
    }
    return true;
  }

  // Gradual exit check: returns true if user should exit, or false to trigger prompt
  public handleRootBackPress(): boolean {
    const now = Date.now();
    if (now - this.lastBackPressTime < 2500) {
      return true; // Confirmed exit
    }
    this.lastBackPressTime = now;
    this.notifyExitPrompt(true);
    setTimeout(() => this.notifyExitPrompt(false), 2500);
    return false;
  }

  public onExitPrompt(listener: (show: boolean) => void): () => void {
    this.exitPromptListeners.push(listener);
    return () => {
      this.exitPromptListeners = this.exitPromptListeners.filter((l) => l !== listener);
    };
  }

  private notifyExitPrompt(show: boolean) {
    this.exitPromptListeners.forEach((l) => l(show));
  }

  private handlePopState = (e: PopStateEvent) => {
    if (this.isProgrammaticBack) {
      this.isProgrammaticBack = false;
      return;
    }

    // 1. POPUP / MODAL BACK-BUTTON BEHAVIOR:
    if (this.hasOpenModals()) {
      this.closeTopModal();
      return;
    }

    // 2. Strict stack alignment on popstate
    if (this.historyStack.length > 1) {
      this.historyStack.pop();
      this.persistStack();
    }
  };
}

export const navHistory = new NavigationHistoryManager();
