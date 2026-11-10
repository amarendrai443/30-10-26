import React, { useState, useEffect } from 'react';
import {
  X,
  Lock,
  Mail,
  User,
  Phone,
  Building2,
  Briefcase,
  CheckCircle2,
  Clock,
  AlertTriangle,
  ArrowRight,
  ShieldCheck,
  Sparkles,
  Search,
  Eye,
  EyeOff,
  UserPlus,
  LogIn,
  PauseCircle,
  History
} from 'lucide-react';
import {
  StaffAccount,
  getStoredStaffAccounts,
  submitHrStaffRequest,
  setHrSession,
  recordStaffLogin
} from '../utils/staffAccessStorage';

interface EmployeeAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (account: StaffAccount, targetRoute: string) => void;
  timeoutNotice?: string | null;
}

export const EmployeeAuthModal: React.FC<EmployeeAuthModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess,
  timeoutNotice,
}) => {
  const [activeTab, setActiveTab] = useState<'login' | 'register' | 'status'>('login');
  
  // Login Form State
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);
  const [gatedAccount, setGatedAccount] = useState<StaffAccount | null>(null);
  const [holdAccount, setHoldAccount] = useState<StaffAccount | null>(null);
  const [roleShiftNotice, setRoleShiftNotice] = useState<{
    role: string;
    fromRole: string;
    shiftedAt: string;
    shiftedBy: string;
    reason?: string;
  } | null>(null);

  // Registration Form State (HR Role Assignment)
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regRole, setRegRole] = useState<StaffAccount['role']>('DoctorCoordinator');
  const [regDepartment, setRegDepartment] = useState('Clinical Operations & Telehealth');
  const [regAssignedBy, setRegAssignedBy] = useState('Priya Sharma (HR Talent Lead)');
  const [regNotes, setRegNotes] = useState('');
  const [regSubmitted, setRegSubmitted] = useState<StaffAccount | null>(null);

  // Status Lookup State
  const [searchEmail, setSearchEmail] = useState('');
  const [searchedAccount, setSearchedAccount] = useState<StaffAccount | null>(null);
  const [hasSearched, setHasSearched] = useState(false);

  // Refresh accounts on open
  useEffect(() => {
    if (isOpen) {
      setLoginError(null);
      setGatedAccount(null);
      setHoldAccount(null);
      setRoleShiftNotice(null);
      setRegSubmitted(null);
      setSearchedAccount(null);
      setHasSearched(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);
    setGatedAccount(null);
    setHoldAccount(null);

    const emailTrim = loginEmail.trim().toLowerCase();
    const accounts = getStoredStaffAccounts();
    const matched = accounts.find(
      (a) => a.email.toLowerCase() === emailTrim || a.id.toLowerCase() === emailTrim
    );

    if (!matched) {
      setLoginError('No employee record found with this Email/ID. Please verify or register below.');
      return;
    }

    // 1. Administrative HOLD Check
    if (matched.status === 'Hold') {
      setHoldAccount(matched);
      return;
    }

    // 2. Frozen / Inactive Check
    if (matched.status === 'Inactive' || (matched.status === 'Disabled' && matched.approvalStatus !== 'PendingApproval')) {
      setLoginError(`🔒 Account Frozen / Inactive: This employee profile has been placed on Inactive status by Administration. Please contact HR or System Administrator.`);
      return;
    }

    // 3. Live Status Gate Check (Pending Admin Approval)
    if (matched.approvalStatus === 'PendingApproval' || !matched.loginEnabled) {
      setGatedAccount(matched);
      return;
    }

    // 4. Rejected Check
    if (matched.approvalStatus === 'Rejected') {
      setLoginError(`Registration Request Rejected: ${matched.adminNotes || 'Please contact HR compliance.'}`);
      return;
    }

    // 5. Role Shift Notice Notification
    if (matched.roleShiftHistory && matched.roleShiftHistory.length > 0) {
      const latestShift = matched.roleShiftHistory[0];
      setRoleShiftNotice({
        role: matched.role,
        fromRole: latestShift.fromRole,
        shiftedAt: latestShift.shiftedAt,
        shiftedBy: latestShift.shiftedBy,
        reason: latestShift.reason,
      });
    }

    // 6. Record login activity (timestamp & frequency)
    const trackedAccount = recordStaffLogin(matched.id, 'Nhealth Web Portal') || matched;

    // Successful Authentication
    setHrSession(trackedAccount);
    
    // Determine Target Workspace
    let target = '/dashboard';
    if (trackedAccount.role === 'DARTeam' || trackedAccount.permissions.includes('dar_portal')) {
      target = '/dar-team';
    } else if (trackedAccount.role === 'HR' || trackedAccount.permissions.includes('hr_portal')) {
      target = '/hrthings';
    } else if (trackedAccount.role === 'SubAdmin' || trackedAccount.role === 'OperationsLead') {
      target = '/command-center';
    }

    onLoginSuccess(trackedAccount, target);
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!regName.trim() || !regEmail.trim()) return;

    const newStaff = submitHrStaffRequest(
      {
        name: regName.trim(),
        email: regEmail.trim(),
        phone: regPhone.trim(),
        role: regRole,
        department: regDepartment.trim(),
        notes: regNotes.trim(),
        suggestedPermissions: regRole === 'DARTeam'
          ? ['dar_portal', 'manage_partners']
          : regRole === 'HR' 
          ? ['hr_portal', 'view_enquiries'] 
          : regRole === 'SubAdmin' 
          ? ['manage_partners', 'view_enquiries', 'guest_bookings']
          : ['view_enquiries', 'guest_bookings'],
      },
      regAssignedBy.trim()
    );

    setRegSubmitted(newStaff);
  };

  const handleStatusSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setHasSearched(true);
    const emailTrim = searchEmail.trim().toLowerCase();
    const accounts = getStoredStaffAccounts();
    const matched = accounts.find(
      (a) => a.email.toLowerCase() === emailTrim || a.id.toLowerCase() === emailTrim
    );
    setSearchedAccount(matched || null);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-[3000] flex items-center justify-center bg-black/75 backdrop-blur-sm p-4 overflow-y-auto animate-in fade-in duration-200"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-xl bg-[#00172b] text-white rounded-3xl border border-teal-500/30 shadow-2xl overflow-hidden relative animate-in zoom-in-95 duration-200 my-auto"
      >
        {/* Header Bar */}
        <div className="bg-gradient-to-r from-[#002b49] via-[#003c66] to-[#008080] p-5 sm:p-6 border-b border-teal-500/30 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-teal-500/20 border border-teal-400/40 flex items-center justify-center text-teal-300 shadow-xs">
              <ShieldCheck className="w-5 h-5 text-teal-400" />
            </div>
            <div>
              <h3 className="text-lg font-black text-white tracking-tight flex items-center gap-2">
                <span>Nhealth Employee Portal</span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-teal-500/20 text-teal-300 border border-teal-400/30">
                  Staff Workspace
                </span>
              </h3>
              <p className="text-xs text-slate-300">Role-based credentials, HR assignment &amp; Admin verification</p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-800 bg-[#001222] p-1.5 gap-1.5 text-xs font-bold">
          <button
            type="button"
            onClick={() => { setActiveTab('login'); setGatedAccount(null); }}
            className={`flex-1 py-2 px-3 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
              activeTab === 'login'
                ? 'bg-[#008080] text-white shadow-xs'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <LogIn className="w-3.5 h-3.5" />
            <span>Employee Login</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('register')}
            className={`flex-1 py-2 px-3 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
              activeTab === 'register'
                ? 'bg-[#008080] text-white shadow-xs'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>HR Role Onboarding</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('status')}
            className={`flex-1 py-2 px-3 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
              activeTab === 'status'
                ? 'bg-[#008080] text-white shadow-xs'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>Live Status Gate</span>
          </button>
        </div>

        {/* TAB 1: EMPLOYEE LOGIN */}
        {activeTab === 'login' && (
          <div className="p-5 sm:p-6 space-y-4">
            {/* 30-Minute Inactivity Session Timeout Notice */}
            {timeoutNotice && (
              <div className="p-3.5 rounded-2xl bg-amber-500/20 border border-amber-400 text-amber-200 text-xs flex items-center gap-2.5 animate-in slide-in-from-top-2">
                <Clock className="w-4 h-4 text-amber-400 shrink-0" />
                <span className="font-semibold">{timeoutNotice}</span>
              </div>
            )}

            {/* Role Shift Notice Display */}
            {roleShiftNotice && (
              <div className="p-3.5 rounded-2xl bg-cyan-950/80 border border-cyan-400/60 text-cyan-200 text-xs flex items-start gap-2.5 animate-in slide-in-from-top-2">
                <Sparkles className="w-4 h-4 text-cyan-300 shrink-0 mt-0.5" />
                <div className="space-y-0.5">
                  <div className="font-bold text-white flex items-center gap-2">
                    <span>Role Update Notice: Shifted to {roleShiftNotice.role}</span>
                  </div>
                  <p className="text-[11px] text-cyan-200/90 leading-tight">
                    Operational role updated from <strong>{roleShiftNotice.fromRole}</strong> by <strong>{roleShiftNotice.shiftedBy}</strong> on {roleShiftNotice.shiftedAt}. {roleShiftNotice.reason && `Reason: ${roleShiftNotice.reason}`}
                  </p>
                </div>
              </div>
            )}

            {/* Administrative HOLD Status Display */}
            {holdAccount ? (
              <div className="p-4 rounded-2xl bg-rose-950/80 border border-rose-500/80 space-y-3 animate-in fade-in">
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-xl bg-rose-500/20 text-rose-400 border border-rose-500/40 shrink-0 mt-0.5">
                    <PauseCircle className="w-5 h-5 animate-pulse" />
                  </div>
                  <div>
                    <h4 className="font-bold text-rose-300 text-sm flex items-center gap-2">
                      <span>Account Placed on Administrative Hold</span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-rose-500 text-white font-black">
                        ON HOLD
                      </span>
                    </h4>
                    <p className="text-xs text-rose-100/90 mt-1 leading-relaxed">
                      Employee account <strong>{holdAccount.name}</strong> ({holdAccount.email}) is currently placed on <strong>Administrative Hold</strong>.
                    </p>
                    <div className="mt-2 p-2.5 rounded-xl bg-slate-900 border border-rose-500/30 text-xs text-rose-200">
                      <strong>Hold Reason:</strong> {holdAccount.holdReason || 'Administrative / Compliance review under progress. Please contact System Admin.'}
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-between pt-1">
                  <button
                    type="button"
                    onClick={() => { setHoldAccount(null); setLoginEmail(''); }}
                    className="text-xs text-rose-300 hover:text-white underline cursor-pointer"
                  >
                    Try another account
                  </button>
                  <button
                    type="button"
                    onClick={() => { setActiveTab('status'); setSearchEmail(holdAccount.email); }}
                    className="text-xs font-bold px-3 py-1.5 rounded-xl bg-rose-500 hover:bg-rose-400 text-white transition-colors cursor-pointer"
                  >
                    Check Account Status
                  </button>
                </div>
              </div>
            ) : gatedAccount ? (
              <div className="p-4 rounded-2xl bg-amber-950/70 border border-amber-500/60 space-y-3 animate-in fade-in">
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30 shrink-0 mt-0.5">
                    <Clock className="w-5 h-5 animate-pulse" />
                  </div>
                  <div>
                    <h4 className="font-bold text-amber-300 text-sm flex items-center gap-2">
                      <span>Status: Pending Admin Approval</span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500 text-slate-950 font-black">
                        GATE LOCKED
                      </span>
                    </h4>
                    <p className="text-xs text-amber-100/90 mt-1 leading-relaxed">
                      Hello <strong>{gatedAccount.name}</strong>, your employee registration has been submitted and assigned the role of <strong className="text-white bg-amber-900/80 px-1.5 py-0.5 rounded">{gatedAccount.role}</strong> by <strong>{gatedAccount.requestedBy || 'HR'}</strong>.
                    </p>
                    <p className="text-xs text-amber-200/80 mt-1.5">
                      Per Nhealth security governance, employees remain gated until the Master Administrator reviews and approves the profile inside the Admin Command Center. Once approved, your status turns <strong className="text-emerald-400">Live/Active</strong>.
                    </p>
                  </div>
                </div>

                <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-700/60 text-xs flex items-center justify-between">
                  <span className="text-slate-400">Department: <strong className="text-white">{gatedAccount.department}</strong></span>
                  <span className="text-slate-400">Submitted: <strong className="text-white">{gatedAccount.createdAt}</strong></span>
                </div>

                <div className="flex items-center justify-between pt-1">
                  <button
                    type="button"
                    onClick={() => { setGatedAccount(null); setLoginEmail(''); }}
                    className="text-xs text-amber-300 hover:text-white underline cursor-pointer"
                  >
                    Try another account
                  </button>
                  <button
                    type="button"
                    onClick={() => { setActiveTab('status'); setSearchEmail(gatedAccount.email); }}
                    className="text-xs font-bold px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 transition-colors cursor-pointer"
                  >
                    Track Live Gate Status
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleLoginSubmit} className="space-y-4">
                {loginError && (
                  <div className="p-3 rounded-xl bg-red-950/80 border border-red-500/50 text-red-200 text-xs flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" />
                    <span>{loginError}</span>
                  </div>
                )}

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5">
                    Official Work Email / Staff ID <span className="text-teal-400">*</span>
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      required
                      placeholder="e.g. hr@nhealth.in or vikram.ops@nhealth.in"
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#00223f] border border-slate-700 text-white text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 placeholder-slate-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5">
                    Password / Access Code <span className="text-teal-400">*</span>
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      placeholder="••••••••••••"
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-[#00223f] border border-slate-700 text-white text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 placeholder-slate-500"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white cursor-pointer"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-[#008080] to-teal-600 hover:brightness-110 text-white font-bold text-xs sm:text-sm shadow-lg transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  <LogIn className="w-4 h-4" />
                  <span>Authenticate &amp; Open Workspace</span>
                </button>

                {/* Instant Demo Accounts Bar */}
                <div className="pt-3 border-t border-slate-800 text-left">
                  <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-teal-400" />
                    <span>Quick Click-to-Test Employee Logins</span>
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                    <button
                      type="button"
                      onClick={() => { setLoginEmail('hr@nhealth.in'); setLoginPassword('hr123'); }}
                      className="p-2 rounded-xl bg-slate-900/90 border border-slate-800 hover:border-teal-500/40 text-left cursor-pointer transition-colors"
                    >
                      <div className="font-bold text-teal-300">Priya Sharma (HR Lead)</div>
                      <div className="text-[10px] text-slate-400">hr@nhealth.in • Approved / Active</div>
                    </button>

                    <button
                      type="button"
                      onClick={() => { setLoginEmail('vikram.ops@nhealth.in'); setLoginPassword('admin123'); }}
                      className="p-2 rounded-xl bg-slate-900/90 border border-slate-800 hover:border-teal-500/40 text-left cursor-pointer transition-colors"
                    >
                      <div className="font-bold text-teal-300">Vikram Rao (Sub-Admin Ops)</div>
                      <div className="text-[10px] text-slate-400">vikram.ops@nhealth.in • Approved / Active</div>
                    </button>

                    <button
                      type="button"
                      onClick={() => { setLoginEmail('ananya.clinical@nhealth.in'); setLoginPassword('clin123'); }}
                      className="p-2 rounded-xl bg-slate-900/90 border border-slate-800 hover:border-teal-500/40 text-left cursor-pointer transition-colors"
                    >
                      <div className="font-bold text-teal-300">Ananya Reddy (Doctor Coord)</div>
                      <div className="text-[10px] text-slate-400">ananya.clinical@nhealth.in • Approved / Active</div>
                    </button>

                    <button
                      type="button"
                      onClick={() => { setLoginEmail('harish.support@nhealth.in'); setLoginPassword('help123'); }}
                      className="p-2 rounded-xl bg-amber-950/40 border border-amber-500/40 hover:border-amber-400 text-left cursor-pointer transition-colors"
                    >
                      <div className="font-bold text-amber-300">Harish Varma (Pending Gate)</div>
                      <div className="text-[10px] text-amber-200/80">harish.support@nhealth.in • Waiting Admin Approval</div>
                    </button>

                    <button
                      type="button"
                      onClick={() => { setLoginEmail('dar@nhealth.in'); setLoginPassword('dar123'); }}
                      className="p-2 rounded-xl bg-teal-950/50 border border-teal-500/60 hover:border-teal-400 text-left cursor-pointer transition-colors sm:col-span-2"
                    >
                      <div className="font-bold text-teal-300 flex items-center justify-between">
                        <span>Ananya Deshmukh (DAR Team Lead)</span>
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-teal-500/20 text-teal-200 border border-teal-400/30">DAR WORKSPACE</span>
                      </div>
                      <div className="text-[10px] text-teal-200/80">dar@nhealth.in • Data Acquisition &amp; Research Team Dashboard</div>
                    </button>
                  </div>
                </div>
              </form>
            )}
          </div>
        )}

        {/* TAB 2: HR ROLE ONBOARDING / REGISTRATION */}
        {activeTab === 'register' && (
          <div className="p-5 sm:p-6 space-y-4">
            {regSubmitted ? (
              <div className="p-5 rounded-2xl bg-emerald-950/70 border border-emerald-500/60 text-center space-y-3 animate-in fade-in">
                <div className="w-12 h-12 rounded-full bg-emerald-500/20 border border-emerald-500 flex items-center justify-center text-emerald-400 mx-auto">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h4 className="font-bold text-white text-base">Employee Role Assigned &amp; Queued</h4>
                <p className="text-xs text-emerald-200/90 leading-relaxed max-w-md mx-auto">
                  Registration for <strong>{regSubmitted.name}</strong> has been submitted with the operational role of <strong>{regSubmitted.role}</strong>.
                </p>
                <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 text-xs text-left space-y-1 max-w-sm mx-auto">
                  <div><span className="text-slate-400">Assigned Role:</span> <strong className="text-teal-300">{regSubmitted.role}</strong></div>
                  <div><span className="text-slate-400">Department:</span> <strong className="text-white">{regSubmitted.department}</strong></div>
                  <div><span className="text-slate-400">Current Gate:</span> <strong className="text-amber-400">Pending Admin Approval</strong></div>
                  <div><span className="text-slate-400">Assigned By:</span> <strong className="text-white">{regSubmitted.requestedBy}</strong></div>
                </div>
                <div className="flex items-center justify-center gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setRegSubmitted(null);
                      setRegName('');
                      setRegEmail('');
                      setRegPhone('');
                      setRegNotes('');
                    }}
                    className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-white transition-colors cursor-pointer"
                  >
                    Register Another
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setActiveTab('status');
                      setSearchEmail(regSubmitted.email);
                    }}
                    className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-xs font-bold text-white transition-colors cursor-pointer"
                  >
                    View Status Gate
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleRegisterSubmit} className="space-y-3.5">
                <div className="p-3 rounded-xl bg-teal-950/50 border border-teal-500/40 text-xs text-teal-200">
                  <p className="font-bold flex items-center gap-1.5 text-teal-300">
                    <ShieldCheck className="w-4 h-4" />
                    <span>HR Role Assignment Protocol</span>
                  </p>
                  <p className="text-[11px] text-teal-100/80 mt-0.5">
                    HR initiates the employee onboarding and selects the precise operational role. Once submitted, the profile is placed in "Pending Approval" until master admin verification.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">
                      Employee Full Name <span className="text-teal-400">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Meera Nair"
                      value={regName}
                      onChange={(e) => setRegName(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-[#00223f] border border-slate-700 text-white text-xs focus:outline-none focus:ring-2 focus:ring-teal-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">
                      Official Work Email <span className="text-teal-400">*</span>
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="e.g. meera.nair@nhealth.in"
                      value={regEmail}
                      onChange={(e) => setRegEmail(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-[#00223f] border border-slate-700 text-white text-xs focus:outline-none focus:ring-2 focus:ring-teal-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">
                      Contact Phone <span className="text-teal-400">*</span>
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="+91 98765 43210"
                      value={regPhone}
                      onChange={(e) => setRegPhone(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-[#00223f] border border-slate-700 text-white text-xs focus:outline-none focus:ring-2 focus:ring-teal-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">
                      Assign Operational Role <span className="text-teal-400">*</span>
                    </label>
                    <select
                      value={regRole}
                      onChange={(e) => {
                        const r = e.target.value as StaffAccount['role'];
                        setRegRole(r);
                        if (r === 'DoctorCoordinator') setRegDepartment('Clinical Operations & Telehealth');
                        if (r === 'OperationsLead') setRegDepartment('Field Fleet & Phlebotomy Logistics');
                        if (r === 'CustomerSupport') setRegDepartment('24/7 Patient Helpdesk & SOS');
                        if (r === 'FinanceExecutive') setRegDepartment('Billing & Claims Processing');
                        if (r === 'PartnerOnboarding') setRegDepartment('Provider Network & Hospital Relations');
                        if (r === 'DARTeam') setRegDepartment('Data Acquisition & Research Team (DAR TEAM)');
                        if (r === 'HR') setRegDepartment('Human Resources & Talent Management');
                        if (r === 'SubAdmin') setRegDepartment('System Operations Command');
                      }}
                      className="w-full px-3 py-2 rounded-xl bg-[#00223f] border border-slate-700 text-white text-xs focus:outline-none focus:ring-2 focus:ring-teal-500"
                    >
                      <option value="DARTeam">Data Acquisition &amp; Research Team (DAR TEAM)</option>
                      <option value="DoctorCoordinator">Doctor / Clinical Coordinator</option>
                      <option value="OperationsLead">Operations &amp; Fleet Lead</option>
                      <option value="CustomerSupport">Patient Grievance &amp; Support</option>
                      <option value="FinanceExecutive">Finance &amp; Claims Executive</option>
                      <option value="PartnerOnboarding">Partner Onboarding Specialist</option>
                      <option value="HR">HR People Operations</option>
                      <option value="SubAdmin">Regional Sub-Admin</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">
                      Department / Wing
                    </label>
                    <input
                      type="text"
                      value={regDepartment}
                      onChange={(e) => setRegDepartment(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-[#00223f] border border-slate-700 text-white text-xs focus:outline-none focus:ring-2 focus:ring-teal-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">
                      Assigned By (HR Personnel)
                    </label>
                    <input
                      type="text"
                      value={regAssignedBy}
                      onChange={(e) => setRegAssignedBy(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-[#00223f] border border-slate-700 text-white text-xs focus:outline-none focus:ring-2 focus:ring-teal-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    Onboarding Remarks / Scope of Access
                  </label>
                  <textarea
                    rows={2}
                    placeholder="e.g. Verified medical credentials and assigned tele-consultation dispatch permissions."
                    value={regNotes}
                    onChange={(e) => setRegNotes(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-[#00223f] border border-slate-700 text-white text-xs focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-teal-600 to-[#008080] hover:brightness-110 text-white font-bold text-xs sm:text-sm shadow-lg transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  <UserPlus className="w-4 h-4" />
                  <span>Assign Role &amp; Submit for Admin Approval</span>
                </button>
              </form>
            )}
          </div>
        )}

        {/* TAB 3: LIVE STATUS GATE TRACKER */}
        {activeTab === 'status' && (
          <div className="p-5 sm:p-6 space-y-4">
            <form onSubmit={handleStatusSearch} className="flex gap-2">
              <input
                type="text"
                placeholder="Enter registered work email (e.g. harish.support@nhealth.in)"
                value={searchEmail}
                onChange={(e) => setSearchEmail(e.target.value)}
                className="flex-1 px-3.5 py-2.5 rounded-xl bg-[#00223f] border border-slate-700 text-white text-xs focus:outline-none focus:ring-2 focus:ring-teal-500 placeholder-slate-500"
              />
              <button
                type="submit"
                className="px-4 py-2.5 rounded-xl bg-[#008080] hover:bg-teal-600 text-white font-bold text-xs transition-colors cursor-pointer flex items-center gap-1.5"
              >
                <Search className="w-3.5 h-3.5" />
                <span>Check</span>
              </button>
            </form>

            {hasSearched && (
              searchedAccount ? (
                <div className="p-4 rounded-2xl bg-slate-900 border border-slate-700/80 space-y-3 animate-in fade-in">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                    <div>
                      <h4 className="font-bold text-white text-sm">{searchedAccount.name}</h4>
                      <p className="text-xs text-slate-400">{searchedAccount.email}</p>
                    </div>

                    {searchedAccount.approvalStatus === 'Approved' && searchedAccount.loginEnabled ? (
                      <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-xs font-bold flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Live / Active</span>
                      </span>
                    ) : searchedAccount.approvalStatus === 'Rejected' ? (
                      <span className="px-3 py-1 rounded-full bg-red-500/20 text-red-300 border border-red-500/40 text-xs font-bold flex items-center gap-1">
                        <X className="w-3.5 h-3.5" />
                        <span>Rejected</span>
                      </span>
                    ) : (
                      <span className="px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 text-xs font-bold flex items-center gap-1 animate-pulse">
                        <Clock className="w-3.5 h-3.5" />
                        <span>Pending Approval</span>
                      </span>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="p-2 rounded-lg bg-slate-800/60">
                      <span className="text-slate-400 block text-[10px] uppercase font-bold">Assigned Role</span>
                      <span className="font-bold text-teal-300">{searchedAccount.role}</span>
                    </div>
                    <div className="p-2 rounded-lg bg-slate-800/60">
                      <span className="text-slate-400 block text-[10px] uppercase font-bold">Department</span>
                      <span className="font-bold text-white truncate block">{searchedAccount.department}</span>
                    </div>
                  </div>

                  <div className="text-xs text-slate-300 p-2.5 rounded-xl bg-[#00172b] border border-slate-800">
                    {searchedAccount.approvalStatus === 'Approved' && searchedAccount.loginEnabled ? (
                      <p className="text-emerald-300">
                        ✅ Full workspace access is <strong>Live &amp; Active</strong>. You can log in directly.
                      </p>
                    ) : (
                      <p className="text-amber-200">
                        ⏳ Live Gate Locked: Requested by <strong>{searchedAccount.requestedBy || 'HR'}</strong> on {searchedAccount.requestedAt || searchedAccount.createdAt}. Awaiting master admin approval in Command Center.
                      </p>
                    )}
                  </div>

                  {searchedAccount.approvalStatus === 'Approved' && searchedAccount.loginEnabled && (
                    <button
                      type="button"
                      onClick={() => {
                        setActiveTab('login');
                        setLoginEmail(searchedAccount.email);
                      }}
                      className="w-full py-2.5 rounded-xl bg-[#008080] hover:bg-teal-600 text-white font-bold text-xs transition-colors cursor-pointer flex items-center justify-center gap-1.5"
                    >
                      <LogIn className="w-3.5 h-3.5" />
                      <span>Proceed to Log In</span>
                    </button>
                  )}
                </div>
              ) : (
                <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 text-center text-xs text-slate-400">
                  No record found for <strong className="text-white">{searchEmail}</strong>. Please check the spelling or submit a registration under HR Role Onboarding.
                </div>
              )
            )}
          </div>
        )}
      </div>
    </div>
  );
};
