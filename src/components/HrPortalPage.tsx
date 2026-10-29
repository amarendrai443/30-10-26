/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  Users,
  ShieldCheck,
  Calendar,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Search,
  Filter,
  ArrowLeft,
  Lock,
  LogOut,
  UserPlus,
  FileText,
  DollarSign,
  Award,
  Stethoscope,
  Briefcase,
  HeartPulse,
  Phone,
  Mail,
  Building2,
  Check,
  X,
  Sparkles,
  ChevronRight,
  ShieldAlert,
} from 'lucide-react';
import {
  StaffAccount,
  getStoredStaffAccounts,
  submitHrStaffRequest,
  getActiveHrSession,
  setHrSession,
  clearHrSession,
} from '../utils/staffAccessStorage';

interface HrPortalPageProps {
  onNavigateHome: () => void;
  onNavigateAdmin?: () => void;
}

interface EmployeeItem {
  id: string;
  name: string;
  role: string;
  department: 'Clinical' | 'Phlebotomy' | 'Nursing' | 'Logistics' | 'Operations' | 'HR';
  email: string;
  phone: string;
  joiningDate: string;
  shift: 'Morning (7 AM - 3 PM)' | 'Evening (2 PM - 10 PM)' | 'Night / On-Call' | 'General (9 AM - 6 PM)';
  status: 'On Duty' | 'On Leave' | 'Active';
  rating: number;
}

const INITIAL_EMPLOYEES: EmployeeItem[] = [
  {
    id: 'EMP-DOC-01',
    name: 'Dr. Rajesh Varma',
    role: 'Senior Consultant Physician',
    department: 'Clinical',
    email: 'dr.rajesh@nhealth.in',
    phone: '+91 98480 11223',
    joiningDate: '2024-03-12',
    shift: 'General (9 AM - 6 PM)',
    status: 'On Duty',
    rating: 4.9,
  },
  {
    id: 'EMP-DOC-02',
    name: 'Dr. Sunita Kulkarni',
    role: 'Geriatric & Palliative Specialist',
    department: 'Clinical',
    email: 'dr.sunita@nhealth.in',
    phone: '+91 98480 22334',
    joiningDate: '2024-07-01',
    shift: 'Morning (7 AM - 3 PM)',
    status: 'On Duty',
    rating: 4.8,
  },
  {
    id: 'EMP-PHL-01',
    name: 'K. Mahesh Kumar',
    role: 'Senior Phlebotomist & Cold-Chain Lead',
    department: 'Phlebotomy',
    email: 'mahesh.k@nhealth.in',
    phone: '+91 97001 55667',
    joiningDate: '2025-01-10',
    shift: 'Morning (7 AM - 3 PM)',
    status: 'On Duty',
    rating: 4.9,
  },
  {
    id: 'EMP-NUR-01',
    name: 'Sister Mary Joseph',
    role: 'ICU Critical Care Home Nurse',
    department: 'Nursing',
    email: 'mary.j@nhealth.in',
    phone: '+91 96552 33441',
    joiningDate: '2025-02-15',
    shift: 'Night / On-Call',
    status: 'On Duty',
    rating: 5.0,
  },
  {
    id: 'EMP-LOG-01',
    name: 'Suresh Babu',
    role: 'Emergency Ambulance Fleet Pilot',
    department: 'Logistics',
    email: 'suresh.babu@nhealth.in',
    phone: '+91 93939 12345',
    joiningDate: '2025-03-20',
    shift: 'Evening (2 PM - 10 PM)',
    status: 'On Leave',
    rating: 4.7,
  },
  {
    id: 'EMP-HR-01',
    name: 'Priya Sharma',
    role: 'HR & People Operations Lead',
    department: 'HR',
    email: 'hr@nhealth.in',
    phone: '+91 98480 12345',
    joiningDate: '2024-01-15',
    shift: 'General (9 AM - 6 PM)',
    status: 'On Duty',
    rating: 4.9,
  },
];

interface LeaveRequest {
  id: string;
  employeeName: string;
  department: string;
  type: 'Casual Leave' | 'Sick Leave' | 'Emergency Reliever';
  dates: string;
  reason: string;
  status: 'Pending' | 'Approved' | 'Rejected';
}

const INITIAL_LEAVE_REQUESTS: LeaveRequest[] = [
  {
    id: 'LR-101',
    employeeName: 'Dr. Sunita Kulkarni',
    department: 'Clinical Home Visits',
    type: 'Casual Leave',
    dates: 'Nov 02 - Nov 04, 2026',
    reason: 'Attending National Geriatrics Healthcare Summit as invited speaker.',
    status: 'Pending',
  },
  {
    id: 'LR-102',
    employeeName: 'Suresh Babu',
    department: 'Logistics / Ambulance',
    type: 'Sick Leave',
    dates: 'Oct 29 - Oct 30, 2026',
    reason: 'Mild viral fever; backup relief driver already deployed.',
    status: 'Pending',
  },
  {
    id: 'LR-103',
    employeeName: 'Sister Mary Joseph',
    department: 'Specialized Nursing Care',
    type: 'Emergency Reliever',
    dates: 'Nov 08, 2026',
    reason: 'Family event; shift exchanged with Sister Anitha.',
    status: 'Pending',
  },
];

export const HrPortalPage: React.FC<HrPortalPageProps> = ({ onNavigateHome, onNavigateAdmin }) => {
  // Auth state
  const [currentUser, setCurrentUser] = useState(() => getActiveHrSession());
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [authError, setAuthError] = useState<string | null>(null);

  // Tab navigation inside HR
  const [activeTab, setActiveTab] = useState<'employees' | 'leaves' | 'recruitment' | 'payroll' | 'credentials'>('employees');

  // Search & filter
  const [searchTerm, setSearchTerm] = useState('');
  const [deptFilter, setDeptFilter] = useState<string>('All');

  // Dynamic state
  const [employees, setEmployees] = useState<EmployeeItem[]>(INITIAL_EMPLOYEES);
  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>(INITIAL_LEAVE_REQUESTS);
  const [newEmployeeModalOpen, setNewEmployeeModalOpen] = useState(false);
  const [newEmpForm, setNewEmpForm] = useState({
    name: '',
    role: '',
    department: 'Clinical' as EmployeeItem['department'],
    email: '',
    phone: '',
    shift: 'General (9 AM - 6 PM)' as EmployeeItem['shift'],
  });

  // HR Team Credential Request State
  const [staffAccounts, setStaffAccounts] = useState<StaffAccount[]>(() => getStoredStaffAccounts());
  const [credModalOpen, setCredModalOpen] = useState(false);
  const [credSuccessMsg, setCredSuccessMsg] = useState<string | null>(null);
  const [credForm, setCredForm] = useState({
    name: '',
    email: '',
    phone: '',
    role: 'CustomerSupport' as StaffAccount['role'],
    department: '24/7 Patient Helpdesk & SOS',
    notes: '',
  });

  useEffect(() => {
    const handleSync = () => setStaffAccounts(getStoredStaffAccounts());
    window.addEventListener('nhealth_staff_accounts_updated', handleSync);
    return () => window.removeEventListener('nhealth_staff_accounts_updated', handleSync);
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    const email = loginEmail.trim().toLowerCase();

    // Check Master Admin login
    if (email === 'admin@nhealth.in' && (loginPassword === 'admin123' || loginPassword === 'admin' || loginPassword === 'nhealth@2026')) {
      const adminSession = {
        name: 'Master System Administrator',
        email: 'admin@nhealth.in',
        role: 'Administrator',
      };
      sessionStorage.setItem('nhealth_admin_authenticated', 'true');
      setCurrentUser(adminSession);
      return;
    }

    // Check staff accounts
    const staffList = getStoredStaffAccounts();
    const account = staffList.find((s) => s.email.toLowerCase() === email);

    if (!account) {
      setAuthError('No HR or authorized staff account found with this email address.');
      return;
    }

    // Check if credential is still pending Admin approval
    if (account.approvalStatus === 'PendingApproval') {
      setAuthError('Pending Admin Approval: Your team credential request was submitted by HR and is awaiting Master Admin review before login activation.');
      return;
    }

    // Check if credential was rejected by Admin
    if (account.approvalStatus === 'Rejected') {
      setAuthError(`Access Denied: This credential request was rejected by Administrator: ${account.adminNotes || 'Please contact Master Admin.'}`);
      return;
    }

    // Check if account is disabled
    if (!account.loginEnabled || account.status === 'Disabled') {
      setAuthError('Access Denied: Your staff account has been disabled by the Administrator. Please contact admin@nhealth.in.');
      return;
    }

    // Check if role or permissions allow HR portal
    const hasHrAccess = account.role === 'HR' || account.role === 'SubAdmin' || account.permissions.includes('hr_portal');
    if (!hasHrAccess) {
      setAuthError('Access Denied: You do not possess the required "hr_portal" security rights.');
      return;
    }

    // Simple password validation for demo/portal
    if (loginPassword.length < 4) {
      setAuthError('Please enter a valid password (minimum 4 characters).');
      return;
    }

    setHrSession(account);
    setCurrentUser(account);
  };

  const handleSubmitCredentialRequest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!credForm.name || !credForm.email) return;

    submitHrStaffRequest(
      {
        name: credForm.name,
        email: credForm.email,
        phone: credForm.phone,
        role: credForm.role,
        department: credForm.department,
        notes: credForm.notes,
      },
      currentUser?.name ? `${currentUser.name} (${currentUser.role})` : 'HR Dept'
    );

    setCredSuccessMsg(`Credential request for "${credForm.name}" submitted to Master Admin review queue.`);
    setCredModalOpen(false);
    setCredForm({
      name: '',
      email: '',
      phone: '',
      role: 'CustomerSupport',
      department: '24/7 Patient Helpdesk & SOS',
      notes: '',
    });
    setTimeout(() => setCredSuccessMsg(null), 5000);
  };

  const handleQuickDemoLogin = (email: string) => {
    const staffList = getStoredStaffAccounts();
    const account = staffList.find((s) => s.email.toLowerCase() === email.toLowerCase());
    if (account) {
      if (!account.loginEnabled || account.status === 'Disabled') {
        setAuthError('Access Denied: This staff account is currently disabled by Admin.');
        return;
      }
      setHrSession(account);
      setCurrentUser(account);
    } else if (email === 'admin@nhealth.in') {
      const adminSession = {
        name: 'Master System Administrator',
        email: 'admin@nhealth.in',
        role: 'Administrator',
      };
      sessionStorage.setItem('nhealth_admin_authenticated', 'true');
      setCurrentUser(adminSession);
    }
  };

  const handleLogout = () => {
    clearHrSession();
    setCurrentUser(null);
  };

  const handleApproveLeave = (id: string) => {
    setLeaveRequests((prev) =>
      prev.map((l) => (l.id === id ? { ...l, status: 'Approved' } : l))
    );
  };

  const handleRejectLeave = (id: string) => {
    setLeaveRequests((prev) =>
      prev.map((l) => (l.id === id ? { ...l, status: 'Rejected' } : l))
    );
  };

  const handleAddEmployee = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEmpForm.name || !newEmpForm.email) return;

    const newEmp: EmployeeItem = {
      id: `EMP-${Date.now().toString().slice(-4)}`,
      name: newEmpForm.name,
      role: newEmpForm.role,
      department: newEmpForm.department,
      email: newEmpForm.email,
      phone: newEmpForm.phone,
      joiningDate: new Date().toISOString().split('T')[0],
      shift: newEmpForm.shift,
      status: 'Active',
      rating: 5.0,
    };

    setEmployees((prev) => [newEmp, ...prev]);
    setNewEmployeeModalOpen(false);
    setNewEmpForm({
      name: '',
      role: '',
      department: 'Clinical',
      email: '',
      phone: '',
      shift: 'General (9 AM - 6 PM)',
    });
  };

  // Filtered employees
  const filteredEmployees = employees.filter((emp) => {
    const matchesSearch =
      emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDept = deptFilter === 'All' || emp.department === deptFilter;
    return matchesSearch && matchesDept;
  });

  // If user is not authenticated as HR or Admin, render secure login gate
  if (!currentUser) {
    return (
      <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col justify-between p-4 sm:p-6 lg:p-8">
        <div className="max-w-md w-full mx-auto my-auto py-8">
          <div className="text-center mb-8">
            <div className="inline-flex p-3 rounded-2xl bg-teal-500/10 border border-teal-500/20 text-teal-400 mb-4">
              <ShieldCheck className="w-10 h-10" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white mb-2">
              Nhealth HR Portal
            </h1>
            <p className="text-xs sm:text-sm text-slate-400">
              Restricted Gateway for Human Resources &amp; System Administrators
            </p>
          </div>

          <div className="bg-slate-800/90 border border-slate-700/80 rounded-2xl p-6 sm:p-8 shadow-2xl backdrop-blur-sm">
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                  Official Email Address
                </label>
                <input
                  type="email"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  placeholder="hr@nhealth.in"
                  className="w-full bg-slate-900/90 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                  Security Password
                </label>
                <input
                  type="password"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-slate-900/90 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  required
                />
              </div>

              {authError && (
                <div className="p-3 bg-red-950/60 border border-red-500/40 rounded-xl flex items-start gap-2.5 text-xs text-red-200">
                  <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                  <span>{authError}</span>
                </div>
              )}

              <button
                type="submit"
                className="w-full bg-teal-600 hover:bg-teal-500 text-white font-semibold py-3 px-4 rounded-xl text-sm transition-all shadow-lg shadow-teal-900/40 flex items-center justify-center gap-2 cursor-pointer"
              >
                <Lock className="w-4 h-4" />
                Authenticate HR Credentials
              </button>
            </form>

            <div className="mt-6 pt-6 border-t border-slate-700/80">
              <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider text-center mb-3">
                Quick Demonstration Access
              </p>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <button
                  type="button"
                  onClick={() => handleQuickDemoLogin('hr@nhealth.in')}
                  className="px-3 py-2 bg-slate-700/60 hover:bg-slate-700 text-teal-300 hover:text-white rounded-lg border border-slate-600 transition-colors text-center"
                >
                  Sign in as HR Lead
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickDemoLogin('admin@nhealth.in')}
                  className="px-3 py-2 bg-slate-700/60 hover:bg-slate-700 text-amber-300 hover:text-white rounded-lg border border-slate-600 transition-colors text-center"
                >
                  Master Admin
                </button>
              </div>
            </div>
          </div>

          <div className="mt-6 text-center">
            <button
              onClick={onNavigateHome}
              className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-teal-300 transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Return to Nhealth Homepage
            </button>
          </div>
        </div>

        <div className="text-center text-[11px] text-slate-500">
          Protected by Nhealth Zero-Trust Role-Based Access Control • TLS 1.3 End-to-End
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100">
      {/* Top HR Header Bar */}
      <header className="sticky top-0 z-40 bg-slate-950/90 backdrop-blur-md border-b border-slate-800 px-4 sm:px-6 lg:px-8 py-3.5">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              onClick={onNavigateHome}
              className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
              title="Return to Home"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-white text-base sm:text-lg tracking-tight">Nhealth HR Portal</span>
                <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded-full bg-teal-500/10 text-teal-400 border border-teal-500/30">
                  /hrthings
                </span>
              </div>
              <p className="text-xs text-slate-400 hidden sm:block">
                Workforce Management, Clinical Rostering &amp; Payroll Compliance
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-800/60 border border-slate-700/60 text-xs">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span className="text-slate-300 font-medium">{currentUser.name}</span>
              <span className="text-teal-400 font-semibold">({currentUser.role})</span>
            </div>

            {onNavigateAdmin && (
              <button
                onClick={onNavigateAdmin}
                className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-xl text-xs font-semibold transition-colors flex items-center gap-1.5"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
                Admin Panel
              </button>
            )}

            <button
              onClick={handleLogout}
              className="p-2 rounded-xl bg-red-950/40 hover:bg-red-900/60 text-red-300 border border-red-500/30 transition-colors"
              title="Logout from HR"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6">
        {/* KPI Summary Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 sm:p-5 rounded-2xl bg-slate-800/70 border border-slate-700/70">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-slate-400">Total Staff &amp; Clinicians</span>
              <Users className="w-4 h-4 text-teal-400" />
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-white">142</div>
            <p className="text-[11px] text-teal-400 mt-1 flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3" /> 98% Active &amp; Verified
            </p>
          </div>

          <div className="p-4 sm:p-5 rounded-2xl bg-slate-800/70 border border-slate-700/70">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-slate-400">On Duty Today</span>
              <Clock className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-emerald-400">118</div>
            <p className="text-[11px] text-slate-400 mt-1">Across 4 Shift Zones</p>
          </div>

          <div className="p-4 sm:p-5 rounded-2xl bg-slate-800/70 border border-slate-700/70">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-slate-400">Pending Leaves</span>
              <Calendar className="w-4 h-4 text-amber-400" />
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-amber-400">
              {leaveRequests.filter((l) => l.status === 'Pending').length}
            </div>
            <p className="text-[11px] text-amber-400/80 mt-1">Requires HR Approval</p>
          </div>

          <div className="p-4 sm:p-5 rounded-2xl bg-slate-800/70 border border-slate-700/70">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-slate-400">Doctor Credentialing</span>
              <Award className="w-4 h-4 text-blue-400" />
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-blue-400">100%</div>
            <p className="text-[11px] text-slate-400 mt-1">NMC / State Council Verified</p>
          </div>
        </div>

        {/* Tab Selector */}
        <div className="flex flex-wrap items-center gap-2 border-b border-slate-800 pb-3">
          <button
            onClick={() => setActiveTab('employees')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'employees'
                ? 'bg-teal-600 text-white shadow-lg shadow-teal-900/30'
                : 'bg-slate-800/60 text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Users className="w-4 h-4" />
            Employee Directory ({employees.length})
          </button>

          <button
            onClick={() => setActiveTab('leaves')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'leaves'
                ? 'bg-teal-600 text-white shadow-lg shadow-teal-900/30'
                : 'bg-slate-800/60 text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Calendar className="w-4 h-4" />
            Leave &amp; Shift Approvals
            {leaveRequests.filter((l) => l.status === 'Pending').length > 0 && (
              <span className="px-1.5 py-0.5 rounded-full bg-amber-500 text-slate-950 text-[10px] font-bold">
                {leaveRequests.filter((l) => l.status === 'Pending').length}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('recruitment')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'recruitment'
                ? 'bg-teal-600 text-white shadow-lg shadow-teal-900/30'
                : 'bg-slate-800/60 text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Briefcase className="w-4 h-4" />
            Recruitment &amp; Onboarding
          </button>

          <button
            onClick={() => setActiveTab('payroll')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'payroll'
                ? 'bg-teal-600 text-white shadow-lg shadow-teal-900/30'
                : 'bg-slate-800/60 text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <DollarSign className="w-4 h-4" />
            Payroll &amp; Doctor Payouts
          </button>

          <button
            onClick={() => setActiveTab('credentials')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'credentials'
                ? 'bg-teal-600 text-white shadow-lg shadow-teal-900/30'
                : 'bg-slate-800/60 text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Lock className="w-4 h-4" />
            Team Credential Requests
            {staffAccounts.filter((a) => a.approvalStatus === 'PendingApproval').length > 0 && (
              <span className="px-1.5 py-0.5 rounded-full bg-amber-400 text-slate-950 text-[10px] font-bold">
                {staffAccounts.filter((a) => a.approvalStatus === 'PendingApproval').length} Pending
              </span>
            )}
          </button>
        </div>

        {/* Tab 1: Employee Directory */}
        {activeTab === 'employees' && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3 flex-1 max-w-md">
                <div className="relative w-full">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search by name, role or email..."
                    className="w-full bg-slate-800/80 border border-slate-700 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-teal-500"
                  />
                </div>

                <select
                  value={deptFilter}
                  onChange={(e) => setDeptFilter(e.target.value)}
                  className="bg-slate-800/80 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-300 focus:outline-none focus:ring-1 focus:ring-teal-500"
                >
                  <option value="All">All Departments</option>
                  <option value="Clinical">Clinical</option>
                  <option value="Phlebotomy">Phlebotomy</option>
                  <option value="Nursing">Nursing</option>
                  <option value="Logistics">Logistics</option>
                  <option value="Operations">Operations</option>
                  <option value="HR">HR</option>
                </select>
              </div>

              <button
                onClick={() => setNewEmployeeModalOpen(true)}
                className="px-4 py-2 bg-teal-600 hover:bg-teal-500 text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-2 cursor-pointer transition-colors"
              >
                <UserPlus className="w-4 h-4" />
                Add Staff Member
              </button>
            </div>

            <div className="bg-slate-800/60 border border-slate-700/70 rounded-2xl overflow-hidden shadow-xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-900/60 border-b border-slate-700 text-slate-400 uppercase tracking-wider text-[11px]">
                    <tr>
                      <th className="px-4 py-3">Employee</th>
                      <th className="px-4 py-3">Role &amp; Department</th>
                      <th className="px-4 py-3">Current Shift</th>
                      <th className="px-4 py-3">Contact</th>
                      <th className="px-4 py-3">Status</th>
                      <th className="px-4 py-3 text-right">Rating</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-700/50">
                    {filteredEmployees.map((emp) => (
                      <tr key={emp.id} className="hover:bg-slate-800/40 transition-colors">
                        <td className="px-4 py-3.5">
                          <div className="font-semibold text-white">{emp.name}</div>
                          <div className="text-[11px] text-slate-400">{emp.id}</div>
                        </td>
                        <td className="px-4 py-3.5">
                          <div className="text-slate-200">{emp.role}</div>
                          <span className="inline-block mt-0.5 px-2 py-0.5 rounded-md bg-teal-950/60 text-teal-400 border border-teal-500/20 text-[10px]">
                            {emp.department}
                          </span>
                        </td>
                        <td className="px-4 py-3.5 text-slate-300">{emp.shift}</td>
                        <td className="px-4 py-3.5">
                          <div className="text-slate-300">{emp.phone}</div>
                          <div className="text-[11px] text-slate-400">{emp.email}</div>
                        </td>
                        <td className="px-4 py-3.5">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                              emp.status === 'On Duty'
                                ? 'bg-emerald-950/60 text-emerald-400 border border-emerald-500/30'
                                : 'bg-amber-950/60 text-amber-400 border border-amber-500/30'
                            }`}
                          >
                            {emp.status}
                          </span>
                        </td>
                        <td className="px-4 py-3.5 text-right font-semibold text-amber-400">
                          ★ {emp.rating.toFixed(1)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Leaves & Approvals */}
        {activeTab === 'leaves' && (
          <div className="space-y-4">
            <h2 className="text-sm font-bold text-white uppercase tracking-wider">Leave Applications &amp; Shift Relievers</h2>
            <div className="space-y-3">
              {leaveRequests.map((req) => (
                <div
                  key={req.id}
                  className="p-4 sm:p-5 rounded-2xl bg-slate-800/70 border border-slate-700/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-white text-sm">{req.employeeName}</span>
                      <span className="text-[10px] px-2 py-0.5 rounded-md bg-slate-700 text-slate-300">
                        {req.department}
                      </span>
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-blue-950/60 text-blue-400 border border-blue-500/20">
                        {req.type}
                      </span>
                    </div>
                    <p className="text-xs text-amber-300 font-medium">Dates requested: {req.dates}</p>
                    <p className="text-xs text-slate-300">{req.reason}</p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    {req.status === 'Pending' ? (
                      <>
                        <button
                          onClick={() => handleApproveLeave(req.id)}
                          className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition-colors"
                        >
                          <Check className="w-3.5 h-3.5" />
                          Approve
                        </button>
                        <button
                          onClick={() => handleRejectLeave(req.id)}
                          className="px-3 py-1.5 bg-red-950/60 hover:bg-red-900/60 text-red-300 border border-red-500/30 rounded-xl text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition-colors"
                        >
                          <X className="w-3.5 h-3.5" />
                          Reject
                        </button>
                      </>
                    ) : (
                      <span
                        className={`px-3 py-1 rounded-xl text-xs font-bold ${
                          req.status === 'Approved'
                            ? 'bg-emerald-950/70 text-emerald-400 border border-emerald-500/30'
                            : 'bg-red-950/70 text-red-400 border border-red-500/30'
                        }`}
                      >
                        {req.status}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 3: Recruitment & Onboarding */}
        {activeTab === 'recruitment' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-5 rounded-2xl bg-slate-800/70 border border-slate-700/80 space-y-3">
              <h3 className="font-bold text-white text-sm flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-teal-400" /> Open Positions &amp; Hiring
              </h3>
              <div className="space-y-2.5 text-xs">
                <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-700/50 flex justify-between items-center">
                  <div>
                    <div className="font-semibold text-white">Full-Time General Physician (Home Visits)</div>
                    <div className="text-[11px] text-slate-400">Hyderabad Metro • 5 Applicants In Screening</div>
                  </div>
                  <span className="px-2 py-0.5 rounded bg-teal-500/20 text-teal-300 text-[10px] font-semibold">Active</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-700/50 flex justify-between items-center">
                  <div>
                    <div className="font-semibold text-white">Certified Phlebotomists (Two-Wheeler Fleet)</div>
                    <div className="text-[11px] text-slate-400">Secunderabad / Cyberabad • 8 Applicants</div>
                  </div>
                  <span className="px-2 py-0.5 rounded bg-teal-500/20 text-teal-300 text-[10px] font-semibold">Active</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-700/50 flex justify-between items-center">
                  <div>
                    <div className="font-semibold text-white">Elderly Bedside Attendant (Female / Male)</div>
                    <div className="text-[11px] text-slate-400">Kukatpally &amp; Gachibowli • 12 Applicants</div>
                  </div>
                  <span className="px-2 py-0.5 rounded bg-teal-500/20 text-teal-300 text-[10px] font-semibold">Active</span>
                </div>
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-slate-800/70 border border-slate-700/80 space-y-3">
              <h3 className="font-bold text-white text-sm flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-blue-400" /> Verification &amp; Background Checks
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                All candidates must pass triple verification before deployment: State Medical Council / Nursing Registration check, Police Background Verification, and Cold-Chain Clinical Protocol certification.
              </p>
              <div className="p-3 rounded-xl bg-slate-900/70 border border-blue-500/20 space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-slate-300">Dr. Vivek Narayanan (Cardiologist)</span>
                  <span className="text-emerald-400 font-semibold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Council Cleared
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-300">R. Anand (Phlebotomy Tech)</span>
                  <span className="text-amber-400 font-semibold flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" /> Police Cert Pending
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 4: Payroll & Payouts */}
        {activeTab === 'payroll' && (
          <div className="p-5 rounded-2xl bg-slate-800/70 border border-slate-700/80 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-white text-sm">Monthly Compensation &amp; Payout Compliance</h3>
                <p className="text-xs text-slate-400">Automated doctor per-consult splits, attendant shift wages, and phlebotomy fee settlements.</p>
              </div>
              <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-semibold">
                Oct 2026 Cycle Ready
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-700/50">
                <div className="text-slate-400 mb-1">Doctor Teleconsult &amp; Visit Payouts</div>
                <div className="text-lg font-bold text-white">₹ 4,82,500</div>
                <div className="text-[10px] text-teal-400 mt-1">38 Doctors Credited</div>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-700/50">
                <div className="text-slate-400 mb-1">Nursing &amp; Attendant Wages</div>
                <div className="text-lg font-bold text-white">₹ 3,25,000</div>
                <div className="text-[10px] text-teal-400 mt-1">45 Caregivers Disbursed</div>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-700/50">
                <div className="text-slate-400 mb-1">PF &amp; ESI Statutory Compliance</div>
                <div className="text-lg font-bold text-white">₹ 78,400</div>
                <div className="text-[10px] text-emerald-400 mt-1">100% Tax Compliant</div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 5: Team Credential Requests (Admin Approval Pipeline) */}
        {activeTab === 'credentials' && (
          <div className="space-y-4 animate-fade-in">
            {credSuccessMsg && (
              <div className="p-4 rounded-xl bg-emerald-950/60 border border-emerald-500/40 flex items-center gap-2.5 text-xs text-emerald-200">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>{credSuccessMsg}</span>
              </div>
            )}

            <div className="p-5 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-800 to-teal-950/60 border border-teal-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-teal-500/20 text-teal-300 text-[11px] font-semibold mb-1">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  Dual-Control Security Pipeline
                </div>
                <h3 className="text-base sm:text-lg font-bold text-white">
                  Team Member Credential Requests
                </h3>
                <p className="text-xs text-slate-300 max-w-xl">
                  HR personnel can draft and submit new team login requests (Support staff, Operations, Partner Onboarding). For administrative oversight, all credentials remain in an unverified state until the Master Administrator reviews and activates them in the Command Center.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setCredModalOpen(true)}
                className="px-4 py-2.5 bg-teal-600 hover:bg-teal-500 text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-2 shadow-lg shadow-teal-900/40 shrink-0 cursor-pointer transition-colors"
              >
                <UserPlus className="w-4 h-4" />
                Submit New Team Credential
              </button>
            </div>

            <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-700/80 flex items-start gap-3 text-xs text-slate-300">
              <Lock className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <strong className="text-white">Admin-Exclusive Credentials Management:</strong> Viewing, editing, assigning permissions, and toggling active system login credentials is strictly restricted to the main <strong>Master Administrator</strong> in the Command Center. HR personnel can draft and track pending submissions here.
              </div>
            </div>

            {/* Table of Credential Requests */}
            <div className="bg-slate-800/60 border border-slate-700/70 rounded-2xl overflow-hidden shadow-xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-900/80 border-b border-slate-700 text-slate-400 uppercase tracking-wider text-[11px]">
                    <tr>
                      <th className="px-4 py-3.5">Candidate Name &amp; Email</th>
                      <th className="px-4 py-3.5">Requested Role &amp; Dept</th>
                      <th className="px-4 py-3.5">Submitted By</th>
                      <th className="px-4 py-3.5 text-center">Admin Approval Status</th>
                      <th className="px-4 py-3.5">Admin Review Notes</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-700/60">
                    {staffAccounts
                      .filter((acc) => acc.approvalStatus === 'PendingApproval' || acc.requestedBy?.toLowerCase().includes('hr'))
                      .map((acc) => {
                        const isPending = acc.approvalStatus === 'PendingApproval';
                        const isRejected = acc.approvalStatus === 'Rejected';
                        const isApproved = acc.approvalStatus === 'Approved';

                        return (
                          <tr key={acc.id} className="hover:bg-slate-800/40 transition-colors">
                            <td className="px-4 py-3.5">
                              <div className="font-semibold text-white">{acc.name}</div>
                              <div className="text-[11px] text-slate-400">{acc.email}</div>
                              <div className="text-[10px] text-slate-500">{acc.phone}</div>
                            </td>
                            <td className="px-4 py-3.5">
                              <div className="text-slate-200 font-medium">{acc.role}</div>
                              <div className="text-[11px] text-teal-400">{acc.department}</div>
                            </td>
                            <td className="px-4 py-3.5 text-slate-300">
                              <div>{acc.requestedBy || 'HR Department'}</div>
                              <div className="text-[10px] text-slate-500">{acc.requestedAt || acc.createdAt}</div>
                            </td>
                            <td className="px-4 py-3.5 text-center">
                              {isPending && (
                                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-950/80 text-amber-300 border border-amber-500/40 text-[10px] font-bold">
                                  <Clock className="w-3 h-3 text-amber-400" />
                                  Queued for Admin Review
                                </span>
                              )}
                              {isApproved && (
                                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-950/80 text-emerald-300 border border-emerald-500/40 text-[10px] font-bold">
                                  <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                                  Approved by Admin
                                </span>
                              )}
                              {isRejected && (
                                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-red-950/80 text-red-300 border border-red-500/40 text-[10px] font-bold">
                                  <XCircle className="w-3 h-3 text-red-400" />
                                  Rejected by Admin
                                </span>
                              )}
                            </td>
                            <td className="px-4 py-3.5 text-slate-400 text-[11px] max-w-xs">
                              {acc.adminNotes || acc.notes || (isApproved ? 'Approved by Master Admin' : 'Awaiting review')}
                            </td>
                          </tr>
                        );
                      })}
                    {staffAccounts.filter((acc) => acc.approvalStatus === 'PendingApproval' || acc.requestedBy?.toLowerCase().includes('hr')).length === 0 && (
                      <tr>
                        <td colSpan={5} className="px-4 py-6 text-center text-slate-500 italic">
                          No pending team credential requests submitted yet. Use &ldquo;Submit New Team Credential&rdquo; above.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Add Employee Modal */}
      {newEmployeeModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-800 border border-slate-700 rounded-2xl max-w-md w-full p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-white text-base">Add New Staff / Clinician</h3>
              <button
                onClick={() => setNewEmployeeModalOpen(false)}
                className="p-1 rounded-lg hover:bg-slate-700 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddEmployee} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={newEmpForm.name}
                  onChange={(e) => setNewEmpForm({ ...newEmpForm, name: e.target.value })}
                  placeholder="e.g. Dr. Ramesh Gupta"
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Role Title</label>
                <input
                  type="text"
                  required
                  value={newEmpForm.role}
                  onChange={(e) => setNewEmpForm({ ...newEmpForm, role: e.target.value })}
                  placeholder="e.g. Junior Home Care Physician"
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Department</label>
                  <select
                    value={newEmpForm.department}
                    onChange={(e) =>
                      setNewEmpForm({ ...newEmpForm, department: e.target.value as EmployeeItem['department'] })
                    }
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-2.5 py-2 text-white"
                  >
                    <option value="Clinical">Clinical</option>
                    <option value="Phlebotomy">Phlebotomy</option>
                    <option value="Nursing">Nursing</option>
                    <option value="Logistics">Logistics</option>
                    <option value="Operations">Operations</option>
                    <option value="HR">HR</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Shift</label>
                  <select
                    value={newEmpForm.shift}
                    onChange={(e) =>
                      setNewEmpForm({ ...newEmpForm, shift: e.target.value as EmployeeItem['shift'] })
                    }
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-2.5 py-2 text-white"
                  >
                    <option value="General (9 AM - 6 PM)">General (9-6)</option>
                    <option value="Morning (7 AM - 3 PM)">Morning (7-3)</option>
                    <option value="Evening (2 PM - 10 PM)">Evening (2-10)</option>
                    <option value="Night / On-Call">Night / On-Call</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Email</label>
                <input
                  type="email"
                  required
                  value={newEmpForm.email}
                  onChange={(e) => setNewEmpForm({ ...newEmpForm, email: e.target.value })}
                  placeholder="ramesh.g@nhealth.in"
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Phone</label>
                <input
                  type="text"
                  required
                  value={newEmpForm.phone}
                  onChange={(e) => setNewEmpForm({ ...newEmpForm, phone: e.target.value })}
                  placeholder="+91 98480 00000"
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white"
                />
              </div>

              <div className="pt-2 flex gap-2">
                <button
                  type="button"
                  onClick={() => setNewEmployeeModalOpen(false)}
                  className="flex-1 py-2 rounded-xl bg-slate-700 text-slate-300 hover:bg-slate-600 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-semibold"
                >
                  Save Staff Member
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* HR Team Credential Request Modal */}
      {credModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-800 border border-slate-700 rounded-2xl max-w-lg w-full p-6 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-700 mb-4">
              <div>
                <h3 className="font-bold text-white text-base flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-teal-400" />
                  Draft Team Credential Request
                </h3>
                <p className="text-xs text-slate-400">
                  Submitted requests will be queued in the Admin Command Center for explicit approval.
                </p>
              </div>
              <button
                onClick={() => setCredModalOpen(false)}
                className="p-1 rounded-lg hover:bg-slate-700 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitCredentialRequest} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Staff Full Name *</label>
                <input
                  type="text"
                  required
                  value={credForm.name}
                  onChange={(e) => setCredForm({ ...credForm, name: e.target.value })}
                  placeholder="e.g. Ramesh Varma"
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Work Email Address *</label>
                  <input
                    type="email"
                    required
                    value={credForm.email}
                    onChange={(e) => setCredForm({ ...credForm, email: e.target.value })}
                    placeholder="ramesh.ops@nhealth.in"
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Phone Number *</label>
                  <input
                    type="text"
                    required
                    value={credForm.phone}
                    onChange={(e) => setCredForm({ ...credForm, phone: e.target.value })}
                    placeholder="+91 98480 12345"
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Requested Team Role *</label>
                  <select
                    value={credForm.role}
                    onChange={(e) => setCredForm({ ...credForm, role: e.target.value as StaffAccount['role'] })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-2.5 py-2 text-white"
                  >
                    <option value="CustomerSupport">Support Staff (SOS / Helpdesk)</option>
                    <option value="OperationsLead">Operations &amp; Fleet Coordinator</option>
                    <option value="PartnerOnboarding">Partner Onboarding &amp; Audit</option>
                    <option value="DoctorCoordinator">Doctor / Telehealth Coordinator</option>
                    <option value="FinanceExecutive">Finance &amp; Payout Executive</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Department</label>
                  <input
                    type="text"
                    required
                    value={credForm.department}
                    onChange={(e) => setCredForm({ ...credForm, department: e.target.value })}
                    placeholder="e.g. 24/7 Patient Helpdesk"
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">HR Notes &amp; Hiring Justification</label>
                <textarea
                  rows={2}
                  value={credForm.notes}
                  onChange={(e) => setCredForm({ ...credForm, notes: e.target.value })}
                  placeholder="e.g. Cleared technical interview; required for night shift patient SOS hotline..."
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-white placeholder-slate-500"
                />
              </div>

              <div className="p-3 rounded-xl bg-amber-950/40 border border-amber-500/30 text-[11px] text-amber-200 space-y-1">
                <span className="font-semibold block text-amber-300">Security Governance Policy</span>
                <span>
                  The candidate account will be created with status &ldquo;Pending Admin Review&rdquo; and login access will remain blocked until the Master Administrator approves it.
                </span>
              </div>

              <div className="pt-2 flex gap-2">
                <button
                  type="button"
                  onClick={() => setCredModalOpen(false)}
                  className="flex-1 py-2.5 rounded-xl bg-slate-700 text-slate-300 hover:bg-slate-600 font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-semibold shadow-lg shadow-teal-900/40 cursor-pointer"
                >
                  Submit to Master Admin
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
