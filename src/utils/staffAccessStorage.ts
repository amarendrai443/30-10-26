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

export interface StaffAccount {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: 'HR' | 'SubAdmin' | 'DoctorCoordinator' | 'OperationsLead' | 'FinanceExecutive' | 'CustomerSupport' | 'PartnerOnboarding';
  department: string;
  status: 'Active' | 'Disabled';
  loginEnabled: boolean;
  permissions: string[];
  createdAt: string;
  lastLogin?: string;
  notes?: string;
  approvalStatus?: 'Approved' | 'PendingApproval' | 'Rejected';
  requestedBy?: string;
  requestedAt?: string;
  adminNotes?: string;
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
    lastLogin: '2026-10-29 09:30 AM',
    notes: 'Head of People Operations. Access to clinician onboarding and HR portal.',
    approvalStatus: 'Approved',
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
    lastLogin: '2026-10-28 04:15 PM',
    notes: 'Senior Operations Sub-Admin overseeing phlebotomy dispatch & partner clinics.',
    approvalStatus: 'Approved',
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
    lastLogin: '2026-10-29 08:45 AM',
    notes: 'Physician scheduler and OPD home-visit coordinator.',
    approvalStatus: 'Approved',
  },
  {
    id: 'staff-hr-02',
    name: 'Kavita Menon',
    email: 'kavita.hr@nhealth.in',
    phone: '+91 97000 44556',
    role: 'HR',
    department: 'Talent Acquisition & Compliance',
    status: 'Active',
    loginEnabled: true,
    permissions: ['hr_portal'],
    createdAt: '2026-04-12',
    lastLogin: '2026-10-27 11:20 AM',
    notes: 'Nurse and attendant background verification lead.',
    approvalStatus: 'Approved',
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
    status: 'Disabled',
    loginEnabled: false,
    permissions: ['view_enquiries'],
    createdAt: '2026-05-18',
    lastLogin: '2026-09-14 02:10 PM',
    notes: 'Account temporarily suspended by Admin for security rotation.',
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
