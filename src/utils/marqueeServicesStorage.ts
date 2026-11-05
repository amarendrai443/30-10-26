export interface MarqueeServiceItem {
  id: string;
  name: string;
  directUrl: string;
  localFile?: string;
  pageUrl?: string;
  tagline: string;
  description?: string;
  category: string;
  iconName?: string;
  gradient?: string;
  aspectRatio?: string; // Strict 3:2 aspect ratio setting
  active?: boolean;
}

export const DEFAULT_MARQUEE_SERVICES: MarqueeServiceItem[] = [
  {
    id: 'physiotherapy',
    name: 'Physiotherapy',
    directUrl: 'https://i.ibb.co/5Xtqm8Gt/physiotherapy.png',
    localFile: '/physiotherapy.png',
    pageUrl: '/services?id=physiotherapy-at-home',
    tagline: 'Home Rehabilitation & Mobility Care',
    category: 'Therapy',
    iconName: 'Activity',
    gradient: 'from-[#002b49] to-[#008080]',
    active: true,
  },
  {
    id: 'care-ride',
    name: 'Nhealth Care Ride',
    directUrl: 'https://i.ibb.co/3Yp4Nzcg/nhealth-care-ride.png',
    localFile: '/nhealth%20care%20ride.png',
    pageUrl: '/services?id=nhealth-care-ride',
    tagline: 'Assisted Non-Emergency Medical Transit',
    category: 'Transit',
    iconName: 'Car',
    gradient: 'from-[#003e6b] to-[#0d9488]',
    active: true,
  },
  {
    id: 'teleconsult',
    name: 'Online Doctor Consultations',
    directUrl: 'https://i.ibb.co/FkYFbF5z/online-doctor-consultations.png',
    localFile: '/online%20doctor%20consultations.png',
    pageUrl: '/online-consultation',
    tagline: 'Instant Specialist Video & E-Prescription',
    category: 'Tele-Health',
    iconName: 'Video',
    gradient: 'from-[#002b49] to-[#0284c7]',
    active: true,
  },
  {
    id: 'care-assist',
    name: 'Care Assist',
    directUrl: 'https://i.ibb.co/pB2BJ6HL/nhealth-care-assist.png',
    localFile: '/nhealth%20care%20assist.png',
    pageUrl: '/services?id=nhealth-careassist',
    tagline: 'Trained Home Attendants & Daily Support',
    category: 'Personal Care',
    iconName: 'HeartHandshake',
    gradient: 'from-[#0a3d66] to-[#0f766e]',
    active: true,
  },
  {
    id: 'home-xray',
    name: 'Home X-Ray Services',
    directUrl: 'https://i.ibb.co/FbqnTB6P/home-X-ray-Services.png',
    localFile: '/home%20X-ray%20Services.png',
    pageUrl: '/services?id=xray-portable-diagnostics',
    tagline: 'Portable Digital Radiography At Doorstep',
    category: 'Imaging',
    iconName: 'Layers',
    gradient: 'from-[#0f172a] to-[#008080]',
    active: true,
  },
  {
    id: 'bedside',
    name: 'Bedside Assistance',
    directUrl: 'https://i.ibb.co/jZJ9f2Jq/bedside-assistance.png',
    localFile: '/bedside%20assistance.png',
    pageUrl: '/services?id=bedside-assistance',
    tagline: 'Compassionate Post-Hospitalization Care',
    category: 'Nursing',
    iconName: 'HeartPulse',
    gradient: 'from-[#002b49] to-[#059669]',
    active: true,
  },
  {
    id: 'premium-opd',
    name: 'Premium OPD Services',
    directUrl: 'https://i.ibb.co/MkH7GfxQ/premium-opd-services.png',
    localFile: '/premium%20opd%20services.png',
    pageUrl: '/services?id=priority-opd-specialist-checkin',
    tagline: 'Priority Zero-Wait Specialist Clinic Access',
    category: 'Priority Care',
    iconName: 'Award',
    gradient: 'from-[#1e293b] to-[#0d9488]',
    active: true,
  },
  {
    id: 'pharmacy',
    name: 'Pharmacy Delivery',
    directUrl: 'https://i.ibb.co/7NgLgBCz/Pharmacy-to-home.png',
    localFile: '/Pharmacy%20to%20home.png',
    pageUrl: '/doorstep-pharmacy',
    tagline: 'Direct Temperature-Controlled Medicines',
    category: 'Pharmacy',
    iconName: 'Pill',
    gradient: 'from-[#002b49] to-[#10b981]',
    active: true,
  },
  {
    id: 'prebook-opd',
    name: 'Pre-Booking OPD',
    directUrl: 'https://i.ibb.co/21LnqVFL/pre-booking-opd-services.png',
    localFile: '/pre%20booking%20opd%20services.png',
    pageUrl: '/services?id=priority-opd-specialist-checkin',
    tagline: 'Guaranteed Consult Slots & Express Tokens',
    category: 'Scheduling',
    iconName: 'CalendarCheck',
    gradient: 'from-[#00385e] to-[#0284c7]',
    active: true,
  },
];

const STORAGE_KEY = 'nhealth_marquee_services';
export const MARQUEE_SERVICES_UPDATED_EVENT = 'nhealth_marquee_services_updated';

const INTERNAL_SERVICE_ROUTING_MAP: Record<string, string> = {
  'physiotherapy': '/services?id=physiotherapy-at-home',
  'care-ride': '/services?id=nhealth-care-ride',
  'nhealth care ride': '/services?id=nhealth-care-ride',
  'teleconsult': '/online-consultation',
  'online doctor consultations': '/online-consultation',
  'care-assist': '/services?id=nhealth-careassist',
  'care assist': '/services?id=nhealth-careassist',
  'home-xray': '/services?id=xray-portable-diagnostics',
  'home x-ray services': '/services?id=xray-portable-diagnostics',
  'bedside': '/services?id=bedside-assistance',
  'bedside assistance': '/services?id=bedside-assistance',
  'bedside-assistance': '/services?id=bedside-assistance',
  'premium-opd': '/services?id=priority-opd-specialist-checkin',
  'premium opd services': '/services?id=priority-opd-specialist-checkin',
  'pharmacy': '/doorstep-pharmacy',
  'pharmacy delivery': '/doorstep-pharmacy',
  'prebook-opd': '/services?id=priority-opd-specialist-checkin',
  'pre-booking opd': '/services?id=priority-opd-specialist-checkin',
};

const VERIFIED_CDN_URL_MAP: Record<string, string> = {
  'pre-booking opd': 'https://i.ibb.co/21LnqVFL/pre-booking-opd-services.png',
  'prebook-opd': 'https://i.ibb.co/21LnqVFL/pre-booking-opd-services.png',
  'pre booking opd': 'https://i.ibb.co/21LnqVFL/pre-booking-opd-services.png',
  'physiotherapy': 'https://i.ibb.co/5Xtqm8Gt/physiotherapy.png',
  'nhealth care ride': 'https://i.ibb.co/3Yp4Nzcg/nhealth-care-ride.png',
  'care-ride': 'https://i.ibb.co/3Yp4Nzcg/nhealth-care-ride.png',
  'online doctor consultations': 'https://i.ibb.co/FkYFbF5z/online-doctor-consultations.png',
  'teleconsult': 'https://i.ibb.co/FkYFbF5z/online-doctor-consultations.png',
  'care assist': 'https://i.ibb.co/pB2BJ6HL/nhealth-care-assist.png',
  'care-assist': 'https://i.ibb.co/pB2BJ6HL/nhealth-care-assist.png',
  'home x-ray services': 'https://i.ibb.co/FbqnTB6P/home-X-ray-Services.png',
  'home-xray': 'https://i.ibb.co/FbqnTB6P/home-X-ray-Services.png',
  'bedside assistance': 'https://i.ibb.co/jZJ9f2Jq/bedside-assistance.png',
  'bedside': 'https://i.ibb.co/jZJ9f2Jq/bedside-assistance.png',
  'bedside-assistance': 'https://i.ibb.co/jZJ9f2Jq/bedside-assistance.png',
  'premium opd services': 'https://i.ibb.co/MkH7GfxQ/premium-opd-services.png',
  'premium-opd': 'https://i.ibb.co/MkH7GfxQ/premium-opd-services.png',
  'pharmacy delivery': 'https://i.ibb.co/7NgLgBCz/Pharmacy-to-home.png',
  'pharmacy': 'https://i.ibb.co/7NgLgBCz/Pharmacy-to-home.png',
};

export const getStoredMarqueeServices = (): MarqueeServiceItem[] => {
  if (typeof window === 'undefined') return DEFAULT_MARQUEE_SERVICES;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_MARQUEE_SERVICES));
      return DEFAULT_MARQUEE_SERVICES;
    }
    let parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      let needsUpdate = false;
      parsed = parsed.map((item: MarqueeServiceItem) => {
        const idKey = (item.id || '').toLowerCase();
        const nameKey = (item.name || '').toLowerCase();
        const verifiedUrl = VERIFIED_CDN_URL_MAP[idKey] || VERIFIED_CDN_URL_MAP[nameKey];
        const internalRoute = INTERNAL_SERVICE_ROUTING_MAP[idKey] || INTERNAL_SERVICE_ROUTING_MAP[nameKey];
        let updatedItem = { ...item };

        if (verifiedUrl && updatedItem.directUrl !== verifiedUrl) {
          needsUpdate = true;
          updatedItem.directUrl = verifiedUrl;
        }

        // Sanitize any legacy external pageUrls to strictly internal Nhealth routes
        if (!updatedItem.pageUrl || updatedItem.pageUrl.includes('ibb.co') || updatedItem.pageUrl.startsWith('http')) {
          if (internalRoute) {
            needsUpdate = true;
            updatedItem.pageUrl = internalRoute;
          }
        }

        return updatedItem;
      });
      if (needsUpdate) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(parsed));
      }
      return parsed;
    }
    return DEFAULT_MARQUEE_SERVICES;
  } catch {
    return DEFAULT_MARQUEE_SERVICES;
  }
};

export const saveStoredMarqueeServices = (items: MarqueeServiceItem[]): void => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    window.dispatchEvent(new CustomEvent(MARQUEE_SERVICES_UPDATED_EVENT, { detail: items }));
  } catch (err) {
    console.error('Failed to save marquee services to localStorage:', err);
  }
};

export const addMarqueeService = (
  item: Omit<MarqueeServiceItem, 'id'> & { id?: string }
): MarqueeServiceItem => {
  const current = getStoredMarqueeServices();
  const newItem: MarqueeServiceItem = {
    ...item,
    id: item.id || `srv-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 5)}`,
    active: item.active !== false,
  };
  const updated = [newItem, ...current];
  saveStoredMarqueeServices(updated);
  return newItem;
};

export const updateMarqueeService = (
  id: string,
  updates: Partial<MarqueeServiceItem>
): void => {
  const current = getStoredMarqueeServices();
  const updated = current.map((s) => (s.id === id ? { ...s, ...updates } : s));
  saveStoredMarqueeServices(updated);
};

export const deleteMarqueeService = (id: string): void => {
  const current = getStoredMarqueeServices();
  const updated = current.filter((s) => s.id !== id);
  saveStoredMarqueeServices(updated.length > 0 ? updated : DEFAULT_MARQUEE_SERVICES);
};

export const toggleMarqueeServiceActive = (id: string): void => {
  const current = getStoredMarqueeServices();
  const updated = current.map((s) => (s.id === id ? { ...s, active: !s.active } : s));
  saveStoredMarqueeServices(updated);
};

export const resetMarqueeServices = (): void => {
  saveStoredMarqueeServices(DEFAULT_MARQUEE_SERVICES);
};
