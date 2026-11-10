/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface SystemPermission {
  id: string;
  label: string;
  category: 'Administration' | 'HR' | 'Clinical' | 'Operations' | 'Marketing';
  description: string;
}

export const ALL_SYSTEM_PERMISSIONS: SystemPermission[] = [
  { id: 'hr_portal', label: 'HR Portal Access (/hrthings)', category: 'HR', description: 'Full access to employee records, leaves, recruitment & payroll' },
  { id: 'manage_partners', label: 'Partner Verification & Network', category: 'Operations', description: 'Approve, suspend, and audit clinic/lab partners' },
  { id: 'view_enquiries', label: 'Corporate Enquiries & B2B', category: 'Operations', description: 'Manage corporate tie-ups and healthcare SLAs' },
  { id: 'manage_services', label: 'Services Grid & Pricing', category: 'Administration', description: 'Edit doorstep healthcare offerings, fees, and priority' },
  { id: 'guest_bookings', label: 'Patient Bookings & Appointments', category: 'Clinical', description: 'Dispatch phlebotomists, nurses, and view patient appointments' },
  { id: 'vital_scans', label: 'VitalLens Diagnostic Scans', category: 'Clinical', description: 'Review biometric scans, heart rate & pulse wave data' },
  { id: 'marketing_ads', label: 'Promotions & Banner Ads', category: 'Marketing', description: 'Manage homepage banners, discounts, and carousel ads' },
  { id: 'push_notifications', label: 'Push Notification Engine', category: 'Marketing', description: 'Draft and blast push notifications to app users' },
  { id: 'api_webhooks', label: 'API Gateway & Webhook Hub', category: 'Administration', description: 'Manage confidential partner developer APIs and webhooks' },
  { id: 'subadmin_control', label: 'Sub-Admin & User Role Management', category: 'Administration', description: 'Create and assign permissions to other staff members' },
];

export interface RoleShiftEntry {
  fromRole: string;
  toRole: string;
  shiftedAt: string;
  shiftedBy: string;
  reason?: string;
}

export interface StaffLoginLog {
  id: string;
  timestamp: string;
  date: string;
  time: string;
  device?: string;
}

export interface StaffWorkRecord {
  id: string;
  date: string;
  taskDescription: string;
  hoursWorked: number;
  status: 'Logged' | 'Reviewed' | 'Approved';
  adminNotes?: string;
}

export interface StaffAccount {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: 'HR' | 'SubAdmin' | 'DoctorCoordinator' | 'OperationsLead' | 'FinanceExecutive' | 'CustomerSupport' | 'PartnerOnboarding';
  department: string;
  status: 'Active' | 'Inactive' | 'Hold' | 'Disabled';
  holdReason?: string;
  loginEnabled: boolean;
  permissions: string[];
  createdAt: string;
  lastLogin?: string;
  notes?: string;
  approvalStatus?: 'Approved' | 'PendingApproval' | 'Rejected';
  requestedBy?: string;
  requestedAt?: string;
  adminNotes?: string;
  roleShiftHistory?: RoleShiftEntry[];
  loginLogs?: StaffLoginLog[];
  loginFrequency?: number;
  totalActiveWorkMinutes?: number;
  workRecords?: StaffWorkRecord[];
}

export const DEFAULT_STAFF_ACCOUNTS: StaffAccount[] = [
  {
    id: 'staff-hr-01',
    name: 'Priya Sharma',
    email: 'hr@nhealth.in',
    phone: '+91 98480 12345',
    role: 'HR',
    department: 'Human Resources & Talent',
    status: 'Active',
    loginEnabled: true,
    permissions: ['hr_portal', 'view_enquiries'],
    createdAt: '2026-01-15',
    lastLogin: '2026-11-09 09:30 AM',
    notes: 'Head of People Operations. Access to clinician onboarding and HR portal.',
    approvalStatus: 'Approved',
    loginFrequency: 42,
    totalActiveWorkMinutes: 1840,
    loginLogs: [
      { id: 'log-1', timestamp: '2026-11-09 09:30 AM', date: '2026-11-09', time: '09:30 AM', device: 'Desktop Chrome / Workstation' },
      { id: 'log-2', timestamp: '2026-11-08 08:55 AM', date: '2026-11-08', time: '08:55 AM', device: 'Desktop Chrome / Workstation' },
      { id: 'log-3', timestamp: '2026-11-07 09:12 AM', date: '2026-11-07', time: '09:12 AM', device: 'Mobile Chrome / SOS Hotline' },
    ],
    workRecords: [
      { id: 'wr-1', date: '2026-11-09', taskDescription: 'Conducted 4 clinician interviews and verified phlebotomy medical licenses', hoursWorked: 6.5, status: 'Approved', adminNotes: 'Verified against NABH checklist' },
      { id: 'wr-2', date: '2026-11-08', taskDescription: 'Processed monthly payroll reconciliation and emergency shift compensations', hoursWorked: 7.0, status: 'Approved' },
    ],
  },
  {
    id: 'staff-subadmin-01',
    name: 'Vikram Rao',
    email: 'vikram.ops@nhealth.in',
    phone: '+91 94401 67890',
    role: 'SubAdmin',
    department: 'Clinical Operations & Fleet',
    status: 'Active',
    loginEnabled: true,
    permissions: ['manage_partners', 'view_enquiries', 'manage_services', 'guest_bookings', 'vital_scans'],
    createdAt: '2026-02-01',
    lastLogin: '2026-11-09 08:15 AM',
    notes: 'Senior Operations Sub-Admin overseeing phlebotomy dispatch & partner clinics.',
    approvalStatus: 'Approved',
    loginFrequency: 68,
    totalActiveWorkMinutes: 2950,
    loginLogs: [
      { id: 'log-4', timestamp: '2026-11-09 08:15 AM', date: '2026-11-09', time: '08:15 AM', device: 'Ops Console / Chrome' },
      { id: 'log-5', timestamp: '2026-11-08 07:45 AM', date: '2026-11-08', time: '07:45 AM', device: 'Ops Console / Chrome' },
    ],
    workRecords: [
      { id: 'wr-3', date: '2026-11-09', taskDescription: 'Dispatched 18 phlebotomy home visits with 99.4% on-time GPS SLA', hoursWorked: 8.0, status: 'Approved', adminNotes: 'Zero escalation day' },
      { id: 'wr-4', date: '2026-11-08', taskDescription: 'Onboarded 2 new NABL diagnostic labs in South Hyderabad hub', hoursWorked: 7.5, status: 'Approved' },
    ],
  },
  {
    id: 'staff-subadmin-02',
    name: 'Ananya Reddy',
    email: 'ananya.clinical@nhealth.in',
    phone: '+91 91234 56789',
    role: 'DoctorCoordinator',
    department: 'Doctor Coordination & Telehealth',
    status: 'Active',
    loginEnabled: true,
    permissions: ['guest_bookings', 'vital_scans'],
    createdAt: '2026-03-10',
    lastLogin: '2026-11-09 10:10 AM',
    notes: 'Physician scheduler and OPD home-visit coordinator.',
    approvalStatus: 'Approved',
    loginFrequency: 31,
    totalActiveWorkMinutes: 1320,
    loginLogs: [
      { id: 'log-6', timestamp: '2026-11-09 10:10 AM', date: '2026-11-09', time: '10:10 AM', device: 'iPad / Clinical Telehealth' },
    ],
    workRecords: [
      { id: 'wr-5', date: '2026-11-09', taskDescription: 'Scheduled 14 home-visit doctor slots & 8 telemedicine escalations', hoursWorked: 6.0, status: 'Approved' },
    ],
  },
  {
    id: 'staff-hr-02',
    name: 'Kavita Menon',
    email: 'kavita.hr@nhealth.in',
    phone: '+91 97000 44556',
    role: 'HR',
    department: 'Talent Acquisition & Compliance',
    status: 'Hold',
    holdReason: 'Annual compliance certificate renewal under administrative review.',
    loginEnabled: false,
    permissions: ['hr_portal'],
    createdAt: '2026-04-12',
    lastLogin: '2026-11-05 11:20 AM',
    notes: 'Account temporarily placed on administrative hold pending KYC refresh.',
    approvalStatus: 'Approved',
    loginFrequency: 19,
    totalActiveWorkMinutes: 890,
  },
  {
    id: 'staff-req-01',
    name: 'Harish Varma',
    email: 'harish.support@nhealth.in',
    phone: '+91 98480 99887',
    role: 'CustomerSupport',
    department: '24/7 Patient Helpdesk & SOS',
    status: 'Disabled',
    loginEnabled: false,
    permissions: ['view_enquiries', 'guest_bookings'],
    createdAt: '2026-10-29',
    approvalStatus: 'PendingApproval',
    requestedBy: 'Priya Sharma (HR Dept)',
    requestedAt: '2026-10-29 10:15 AM',
    notes: 'Replacement for patient grievance and emergency assistance hotline dispatch.',
  },
  {
    id: 'staff-ops-03',
    name: 'Rohan Deshmukh',
    email: 'rohan.support@nhealth.in',
    phone: '+91 98888 22331',
    role: 'CustomerSupport',
    department: 'Grievance & Support Desk',
    status: 'Inactive',
    loginEnabled: false,
    permissions: ['view_enquiries'],
    createdAt: '2026-05-18',
    lastLogin: '2026-09-14 02:10 PM',
    notes: 'Account deactivated during staff rotation.',
    approvalStatus: 'Approved',
  },
];

const STORAGE_KEY = 'nhealth_staff_accounts';
const CURRENT_HR_SESSION_KEY = 'nhealth_hr_session_user';

export function getStoredStaffAccounts(): StaffAccount[] {
  if (typeof window === 'undefined') return DEFAULT_STAFF_ACCOUNTS;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_STAFF_ACCOUNTS));
      return DEFAULT_STAFF_ACCOUNTS;
    }
    return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to parse staff accounts from storage:', e);
    return DEFAULT_STAFF_ACCOUNTS;
  }
}

export function saveStoredStaffAccounts(accounts: StaffAccount[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(accounts));
    window.dispatchEvent(new CustomEvent('nhealth_staff_accounts_updated', { detail: accounts }));
  } catch (e) {
    console.error('Failed to save staff accounts:', e);
  }
}

export function addStaffAccount(account: Omit<StaffAccount, 'id' | 'createdAt'>): StaffAccount {
  const accounts = getStoredStaffAccounts();
  const newAccount: StaffAccount = {
    ...account,
    id: `staff-${Date.now()}`,
    createdAt: new Date().toISOString().split('T')[0],
    approvalStatus: account.approvalStatus || 'Approved',
  };
  const updated = [newAccount, ...accounts];
  saveStoredStaffAccounts(updated);
  return newAccount;
}

/**
 * HR Personnel Submits Team Credential Request for Admin Approval
 */
export function submitHrStaffRequest(
  data: {
    name: string;
    email: string;
    phone: string;
    role: StaffAccount['role'];
    department: string;
    notes?: string;
    suggestedPermissions?: string[];
  },
  hrRequesterName = 'HR Department'
): StaffAccount {
  const accounts = getStoredStaffAccounts();
  const newRequest: StaffAccount = {
    id: `staff-req-${Date.now()}`,
    name: data.name,
    email: data.email,
    phone: data.phone,
    role: data.role,
    department: data.department,
    status: 'Disabled', // disabled until Admin approves
    loginEnabled: false, // strictly blocked until Admin approval
    permissions: data.suggestedPermissions || ['view_enquiries'],
    createdAt: new Date().toISOString().split('T')[0],
    approvalStatus: 'PendingApproval',
    requestedBy: hrRequesterName,
    requestedAt: new Date().toLocaleString([], { dateStyle: 'short', timeStyle: 'short' }),
    notes: data.notes,
  };

  const updated = [newRequest, ...accounts];
  saveStoredStaffAccounts(updated);
  return newRequest;
}

/**
 * Main Admin approves HR-submitted team request
 */
export function approveStaffRequest(id: string, customPermissions?: string[], adminNotes?: string): void {
  const accounts = getStoredStaffAccounts();
  const updated = accounts.map((acc) => {
    if (acc.id === id) {
      return {
        ...acc,
        approvalStatus: 'Approved' as const,
        loginEnabled: true,
        status: 'Active' as const,
        permissions: customPermissions || acc.permissions,
        adminNotes: adminNotes || 'Approved by Master Administrator',
      };
    }
    return acc;
  });
  saveStoredStaffAccounts(updated);
}

/**
 * Main Admin rejects HR-submitted team request
 */
export function rejectStaffRequest(id: string, rejectionReason: string): void {
  const accounts = getStoredStaffAccounts();
  const updated = accounts.map((acc) => {
    if (acc.id === id) {
      return {
        ...acc,
        approvalStatus: 'Rejected' as const,
        loginEnabled: false,
        status: 'Disabled' as const,
        adminNotes: rejectionReason,
      };
    }
    return acc;
  });
  saveStoredStaffAccounts(updated);
}

export function updateStaffAccount(id: string, updates: Partial<StaffAccount>): void {
  const accounts = getStoredStaffAccounts();
  const updated = accounts.map((acc) => (acc.id === id ? { ...acc, ...updates } : acc));
  saveStoredStaffAccounts(updated);
}

export function toggleStaffLoginAccess(id: string): boolean {
  const accounts = getStoredStaffAccounts();
  let newState = false;
  const updated = accounts.map((acc) => {
    if (acc.id === id) {
      // Cannot toggle into active if rejected
      if (acc.approvalStatus === 'Rejected') {
        return acc;
      }
      newState = !acc.loginEnabled;
      return {
        ...acc,
        loginEnabled: newState,
        status: (newState ? 'Active' : 'Disabled') as 'Active' | 'Disabled',
      };
    }
    return acc;
  });
  saveStoredStaffAccounts(updated);
  return newState;
}

export function deleteStaffAccount(id: string): void {
  const accounts = getStoredStaffAccounts();
  const updated = accounts.filter((acc) => acc.id !== id);
  saveStoredStaffAccounts(updated);
}

/**
 * Record a successful employee login with timestamp and frequency tracking
 */
export function recordStaffLogin(id: string, device = 'Web Browser'): StaffAccount | null {
  const accounts = getStoredStaffAccounts();
  let found: StaffAccount | null = null;
  const now = new Date();
  const timestamp = now.toLocaleString([], { dateStyle: 'short', timeStyle: 'short' });
  const dateStr = now.toISOString().split('T')[0];
  const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  const updated = accounts.map((acc) => {
    if (acc.id === id) {
      const logs = acc.loginLogs || [];
      const newLog: StaffLoginLog = {
        id: `log-${Date.now()}`,
        timestamp,
        date: dateStr,
        time: timeStr,
        device,
      };
      const freq = (acc.loginFrequency || 0) + 1;
      const updatedAccount: StaffAccount = {
        ...acc,
        lastLogin: timestamp,
        loginFrequency: freq,
        loginLogs: [newLog, ...logs].slice(0, 50),
      };
      found = updatedAccount;
      return updatedAccount;
    }
    return acc;
  });

  if (found) {
    saveStoredStaffAccounts(updated);
  }
  return found;
}

/**
 * Log work duration for an employee session
 */
export function recordStaffWorkSession(id: string, additionalMinutes: number): void {
  const accounts = getStoredStaffAccounts();
  const updated = accounts.map((acc) => {
    if (acc.id === id) {
      return {
        ...acc,
        totalActiveWorkMinutes: (acc.totalActiveWorkMinutes || 0) + additionalMinutes,
      };
    }
    return acc;
  });
  saveStoredStaffAccounts(updated);
}

/**
 * Admin role shift control with audit trail
 */
export function shiftStaffRole(
  id: string,
  newRole: StaffAccount['role'],
  adminName = 'Master Administrator',
  reason?: string
): StaffAccount | null {
  const accounts = getStoredStaffAccounts();
  let shifted: StaffAccount | null = null;
  const now = new Date().toLocaleString([], { dateStyle: 'short', timeStyle: 'short' });

  const updated = accounts.map((acc) => {
    if (acc.id === id) {
      const history = acc.roleShiftHistory || [];
      const entry: RoleShiftEntry = {
        fromRole: acc.role,
        toRole: newRole,
        shiftedAt: now,
        shiftedBy: adminName,
        reason: reason || 'Operational restructuring by Administration',
      };
      shifted = {
        ...acc,
        role: newRole,
        roleShiftHistory: [entry, ...history],
        adminNotes: `Role shifted from ${acc.role} to ${newRole} on ${now} by ${adminName}.`,
      };
      return shifted;
    }
    return acc;
  });

  if (shifted) {
    saveStoredStaffAccounts(updated);
  }
  return shifted;
}

/**
 * Admin sets account status: Active, Inactive, Hold, Disabled
 */
export function setStaffAccountStatus(
  id: string,
  status: 'Active' | 'Inactive' | 'Hold' | 'Disabled',
  holdReason?: string
): StaffAccount | null {
  const accounts = getStoredStaffAccounts();
  let updatedAcc: StaffAccount | null = null;

  const updated = accounts.map((acc) => {
    if (acc.id === id) {
      const isLoginOk = status === 'Active' && acc.approvalStatus === 'Approved';
      updatedAcc = {
        ...acc,
        status,
        loginEnabled: isLoginOk,
        holdReason: status === 'Hold' ? holdReason || 'Account placed on Administrative Hold' : undefined,
      };
      return updatedAcc;
    }
    return acc;
  });

  if (updatedAcc) {
    saveStoredStaffAccounts(updated);
  }
  return updatedAcc;
}

/**
 * Full Admin view and edit privileges for work records
 */
export function addOrUpdateWorkRecord(
  staffId: string,
  record: {
    id?: string;
    date: string;
    taskDescription: string;
    hoursWorked: number;
    status?: 'Logged' | 'Reviewed' | 'Approved';
    adminNotes?: string;
  }
): void {
  const accounts = getStoredStaffAccounts();
  const updated = accounts.map((acc) => {
    if (acc.id === staffId) {
      const current = acc.workRecords || [];
      const recordId = record.id || `wr-${Date.now()}`;
      const existingIdx = current.findIndex((r) => r.id === recordId);
      const newEntry: StaffWorkRecord = {
        id: recordId,
        date: record.date,
        taskDescription: record.taskDescription,
        hoursWorked: record.hoursWorked,
        status: record.status || 'Approved',
        adminNotes: record.adminNotes,
      };

      let newRecords: StaffWorkRecord[];
      if (existingIdx >= 0) {
        newRecords = [...current];
        newRecords[existingIdx] = newEntry;
      } else {
        newRecords = [newEntry, ...current];
      }

      // Recalculate total work minutes
      const totalMinutes = Math.round(newRecords.reduce((sum, r) => sum + (r.hoursWorked || 0) * 60, 0));

      return {
        ...acc,
        workRecords: newRecords,
        totalActiveWorkMinutes: totalMinutes,
      };
    }
    return acc;
  });
  saveStoredStaffAccounts(updated);
}

export function deleteWorkRecord(staffId: string, recordId: string): void {
  const accounts = getStoredStaffAccounts();
  const updated = accounts.map((acc) => {
    if (acc.id === staffId) {
      const current = acc.workRecords || [];
      const filtered = current.filter((r) => r.id !== recordId);
      const totalMinutes = Math.round(filtered.reduce((sum, r) => sum + (r.hoursWorked || 0) * 60, 0));
      return {
        ...acc,
        workRecords: filtered,
        totalActiveWorkMinutes: totalMinutes,
      };
    }
    return acc;
  });
  saveStoredStaffAccounts(updated);
}

export function getActiveHrSession(): StaffAccount | { name: string; email: string; role: string } | null {
  if (typeof window === 'undefined') return null;
  try {
    const isAdmin = sessionStorage.getItem('nhealth_admin_authenticated') === 'true';
    if (isAdmin) {
      return {
        name: 'Master System Administrator',
        email: 'admin@nhealth.in',
        role: 'Administrator',
      };
    }
    const raw = sessionStorage.getItem(CURRENT_HR_SESSION_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function setHrSession(user: StaffAccount): void {
  if (typeof window === 'undefined') return;
  sessionStorage.setItem(CURRENT_HR_SESSION_KEY, JSON.stringify(user));
}

export function clearHrSession(): void {
  if (typeof window === 'undefined') return;
  sessionStorage.removeItem(CURRENT_HR_SESSION_KEY);
}
