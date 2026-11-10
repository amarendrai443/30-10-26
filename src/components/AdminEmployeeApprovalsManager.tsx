import React, { useState, useEffect } from 'react';
import {
  Users,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  Clock,
  AlertTriangle,
  Search,
  Check,
  X,
  Mail,
  Phone,
  Building2,
  Briefcase,
  KeyRound,
  UserPlus,
  RefreshCw,
  Sparkles,
  Lock,
  Unlock,
  ShieldAlert,
  PauseCircle,
  Edit,
  Play,
  FileText,
  Trash2,
  Calendar,
  Award,
  ChevronRight,
  TrendingUp,
  Activity,
  Plus
} from 'lucide-react';
import {
  StaffAccount,
  StaffWorkRecord,
  StaffLoginLog,
  getStoredStaffAccounts,
  approveStaffRequest,
  rejectStaffRequest,
  toggleStaffLoginAccess,
  deleteStaffAccount,
  submitHrStaffRequest,
  shiftStaffRole,
  setStaffAccountStatus,
  addOrUpdateWorkRecord,
  deleteWorkRecord,
  updateStaffAccount
} from '../utils/staffAccessStorage';

export const AdminEmployeeApprovalsManager: React.FC = () => {
  const [accounts, setAccounts] = useState<StaffAccount[]>(() => getStoredStaffAccounts());
  const [mainView, setMainView] = useState<'directory' | 'activity'>('directory');
  const [filter, setFilter] = useState<'All' | 'PendingApproval' | 'Approved' | 'Hold' | 'Inactive'>('PendingApproval');
  const [search, setSearch] = useState('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  
  // Rejection modal
  const [rejectModalAccount, setRejectModalAccount] = useState<StaffAccount | null>(null);
  const [rejectReason, setRejectReason] = useState('Missing verified clinical license / internal compliance review');

  // Direct HR Role Onboarding Modal
  const [showAddModal, setShowAddModal] = useState(false);
  const [newName, setNewName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [newRole, setNewRole] = useState<StaffAccount['role']>('DoctorCoordinator');
  const [newDepartment, setNewDepartment] = useState('Clinical Operations & Telehealth');
  const [newNotes, setNewNotes] = useState('');

  // Hold Status Modal
  const [holdModalAccount, setHoldModalAccount] = useState<StaffAccount | null>(null);
  const [holdReasonInput, setHoldReasonInput] = useState('Administrative compliance review in progress.');

  // Shift Role Modal
  const [shiftRoleAccount, setShiftRoleAccount] = useState<StaffAccount | null>(null);
  const [targetRole, setTargetRole] = useState<StaffAccount['role']>('OperationsLead');
  const [shiftReason, setShiftReason] = useState('Operational restructuring and workload balancing.');

  // Edit Employee Modal
  const [editAccount, setEditAccount] = useState<StaffAccount | null>(null);
  const [editName, setEditName] = useState('');
  const [editEmail, setEditEmail] = useState('');
  const [editPhone, setEditPhone] = useState('');
  const [editDept, setEditDept] = useState('');
  const [editNotes, setEditNotes] = useState('');

  // Work Records & Activity Modal
  const [activityModalAccount, setActivityModalAccount] = useState<StaffAccount | null>(null);
  const [showAddWorkModal, setShowAddWorkModal] = useState(false);
  const [workDate, setWorkDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [workDescription, setWorkDescription] = useState('');
  const [workHours, setWorkHours] = useState('6.0');
  const [workAdminNotes, setWorkAdminNotes] = useState('');
  const [editingWorkRecordId, setEditingWorkRecordId] = useState<string | null>(null);

  const refreshAccounts = () => {
    const list = getStoredStaffAccounts();
    setAccounts(list);
    if (activityModalAccount) {
      const refreshedActive = list.find((a) => a.id === activityModalAccount.id);
      if (refreshedActive) setActivityModalAccount(refreshedActive);
    }
  };

  useEffect(() => {
    const handleSync = () => refreshAccounts();
    window.addEventListener('nhealth_staff_accounts_updated', handleSync);
    window.addEventListener('storage', handleSync);
    return () => {
      window.removeEventListener('nhealth_staff_accounts_updated', handleSync);
      window.removeEventListener('storage', handleSync);
    };
  }, [activityModalAccount]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleApprove = (account: StaffAccount) => {
    approveStaffRequest(account.id, account.permissions, 'Approved by Master Administrator');
    refreshAccounts();
    showToast(`✅ ${account.name} approved! Status is now Live/Active with full workspace access.`);
  };

  const handleRejectConfirm = () => {
    if (!rejectModalAccount) return;
    rejectStaffRequest(rejectModalAccount.id, rejectReason);
    refreshAccounts();
    showToast(`❌ Registration request for ${rejectModalAccount.name} has been rejected.`);
    setRejectModalAccount(null);
  };

  const handleSetStatus = (id: string, status: 'Active' | 'Inactive' | 'Hold' | 'Disabled', reason?: string) => {
    setStaffAccountStatus(id, status, reason);
    refreshAccounts();
    showToast(`Updated employee status to ${status}.`);
  };

  const handleHoldConfirm = () => {
    if (!holdModalAccount) return;
    handleSetStatus(holdModalAccount.id, 'Hold', holdReasonInput);
    setHoldModalAccount(null);
  };

  const handleShiftRoleConfirm = () => {
    if (!shiftRoleAccount) return;
    shiftStaffRole(shiftRoleAccount.id, targetRole, 'Master Administrator', shiftReason);
    refreshAccounts();
    showToast(`Shifted ${shiftRoleAccount.name}'s role to ${targetRole}.`);
    setShiftRoleAccount(null);
  };

  const handleEditSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editAccount) return;
    updateStaffAccount(editAccount.id, {
      name: editName.trim(),
      email: editEmail.trim(),
      phone: editPhone.trim(),
      department: editDept.trim(),
      notes: editNotes.trim(),
    });
    refreshAccounts();
    showToast(`Updated records for ${editName}.`);
    setEditAccount(null);
  };

  const openEditModal = (acc: StaffAccount) => {
    setEditAccount(acc);
    setEditName(acc.name);
    setEditEmail(acc.email);
    setEditPhone(acc.phone || '');
    setEditDept(acc.department);
    setEditNotes(acc.notes || '');
  };

  const handleDelete = (id: string, name: string) => {
    if (window.confirm(`Are you sure you want to permanently remove ${name} from the system?`)) {
      deleteStaffAccount(id);
      refreshAccounts();
      showToast(`Removed employee ${name}`);
    }
  };

  const handleCreateEmployee = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim() || !newEmail.trim()) return;

    submitHrStaffRequest(
      {
        name: newName.trim(),
        email: newEmail.trim(),
        phone: newPhone.trim(),
        role: newRole,
        department: newDepartment.trim(),
        notes: newNotes.trim(),
      },
      'Master Admin / HR Lead'
    );

    refreshAccounts();
    setShowAddModal(false);
    setNewName('');
    setNewEmail('');
    setNewPhone('');
    setNewNotes('');
    showToast(`Registered ${newName} with role ${newRole}. Queued for verification.`);
  };

  const handleSaveWorkRecord = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activityModalAccount || !workDescription.trim()) return;

    const hours = parseFloat(workHours) || 1.0;
    addOrUpdateWorkRecord(activityModalAccount.id, {
      id: editingWorkRecordId || undefined,
      date: workDate,
      taskDescription: workDescription.trim(),
      hoursWorked: hours,
      status: 'Approved',
      adminNotes: workAdminNotes.trim() || 'Reviewed & verified by Master Administrator',
    });

    refreshAccounts();
    setShowAddWorkModal(false);
    setEditingWorkRecordId(null);
    setWorkDescription('');
    setWorkAdminNotes('');
    showToast('Work record logged successfully.');
  };

  const handleDeleteWorkRecord = (recordId: string) => {
    if (!activityModalAccount) return;
    if (window.confirm('Delete this logged work record?')) {
      deleteWorkRecord(activityModalAccount.id, recordId);
      refreshAccounts();
      showToast('Deleted work record.');
    }
  };

  const pendingList = accounts.filter((a) => a.approvalStatus === 'PendingApproval');
  const activeList = accounts.filter((a) => a.approvalStatus === 'Approved' && a.status === 'Active' && a.loginEnabled);
  const holdList = accounts.filter((a) => a.status === 'Hold');
  const inactiveList = accounts.filter((a) => a.status === 'Inactive' || (a.status === 'Disabled' && a.approvalStatus !== 'PendingApproval'));

  const filteredAccounts = accounts.filter((acc) => {
    if (filter === 'PendingApproval' && acc.approvalStatus !== 'PendingApproval') return false;
    if (filter === 'Approved' && (acc.approvalStatus !== 'Approved' || acc.status !== 'Active' || !acc.loginEnabled)) return false;
    if (filter === 'Hold' && acc.status !== 'Hold') return false;
    if (filter === 'Inactive' && acc.status !== 'Inactive' && (acc.status !== 'Disabled' || acc.approvalStatus === 'PendingApproval')) return false;

    if (search.trim()) {
      const q = search.toLowerCase();
      return (
        acc.name.toLowerCase().includes(q) ||
        acc.email.toLowerCase().includes(q) ||
        acc.role.toLowerCase().includes(q) ||
        acc.department.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-24 right-6 z-50 p-4 rounded-2xl bg-slate-900 text-white border border-teal-500 shadow-2xl animate-in slide-in-from-top-4 flex items-center gap-3">
          <Sparkles className="w-5 h-5 text-teal-400 shrink-0" />
          <span className="text-sm font-semibold">{toastMessage}</span>
        </div>
      )}

      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-[#002b49] to-[#008080] p-6 rounded-3xl border border-teal-500/30 text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-teal-500/20 border border-teal-400/40 flex items-center justify-center text-teal-300 shadow-lg">
            <ShieldCheck className="w-8 h-8 text-teal-300" />
          </div>
          <div>
            <div className="flex items-center gap-2.5">
              <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                Employee Registrations &amp; Admin Approvals
              </h2>
              <span className="text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full bg-teal-500/30 text-teal-200 border border-teal-400/40">
                Live Status Gate
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl">
              HR assigns operational roles during onboarding. Employees remain in <strong>"Pending Approval"</strong> with workspace access locked until you approve them into <strong>"Live / Active"</strong> status.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={() => refreshAccounts()}
            className="p-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
            title="Refresh List"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-teal-500 to-emerald-600 hover:brightness-110 text-white text-xs font-bold shadow-md transition-all cursor-pointer flex items-center gap-2"
          >
            <UserPlus className="w-4 h-4" />
            <span>Onboard New Employee</span>
          </button>
        </div>
      </div>

      {/* Main View Switcher: Directory vs Work & Activity Tracking */}
      <div className="flex items-center justify-between border-b border-slate-200 pb-2">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setMainView('directory')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
              mainView === 'directory'
                ? 'bg-[#002b49] text-white shadow-xs'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Staff Directory &amp; Status Controls</span>
          </button>

          <button
            type="button"
            onClick={() => setMainView('activity')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
              mainView === 'activity'
                ? 'bg-[#008080] text-white shadow-xs'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
            }`}
          >
            <Activity className="w-4 h-4" />
            <span>Work &amp; Login Activity Metrics ({accounts.length})</span>
          </button>
        </div>

        <span className="text-[11px] text-slate-500 font-medium hidden sm:inline">
          Admin privileges: Status, Role-Shifting, Work Duration &amp; Record Editing
        </span>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 text-white shadow-sm">
          <span className="text-xs text-slate-400 font-bold block">Total Registered Staff</span>
          <span className="text-2xl font-black text-white mt-1 block">{accounts.length}</span>
          <span className="text-[10px] text-slate-500 mt-0.5 block">Nhealth system accounts</span>
        </div>

        <div className="p-4 rounded-2xl bg-amber-950/40 border border-amber-500/50 text-white shadow-sm">
          <span className="text-xs text-amber-300 font-bold flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-amber-400" />
            <span>Pending Approvals</span>
          </span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-black text-amber-400">{pendingList.length}</span>
            {pendingList.length > 0 && (
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500 text-slate-950 animate-pulse">
                Action Required
              </span>
            )}
          </div>
          <span className="text-[10px] text-amber-200/80 mt-0.5 block">Gated from workspace access</span>
        </div>

        <div className="p-4 rounded-2xl bg-emerald-950/40 border border-emerald-500/50 text-white shadow-sm">
          <span className="text-xs text-emerald-300 font-bold flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            <span>Live / Active Staff</span>
          </span>
          <span className="text-2xl font-black text-emerald-400 mt-1 block">{activeList.length}</span>
          <span className="text-[10px] text-emerald-200/80 mt-0.5 block">Granted full workspace rights</span>
        </div>

        <div className="p-4 rounded-2xl bg-rose-950/30 border border-rose-500/40 text-white shadow-sm">
          <span className="text-xs text-rose-300 font-bold flex items-center gap-1.5">
            <PauseCircle className="w-3.5 h-3.5 text-rose-400" />
            <span>On Hold / Inactive</span>
          </span>
          <span className="text-2xl font-black text-rose-400 mt-1 block">{holdList.length + inactiveList.length}</span>
          <span className="text-[10px] text-rose-200/80 mt-0.5 block">Administrative hold or inactive</span>
        </div>
      </div>

      {/* VIEW 1: DIRECTORY & STATUS CONTROLS */}
      {mainView === 'directory' && (
        <>
          {/* Filter & Search Bar */}
          <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-1.5 w-full sm:w-auto">
              <button
                type="button"
                onClick={() => setFilter('PendingApproval')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                  filter === 'PendingApproval'
                    ? 'bg-amber-600 text-white shadow-xs'
                    : 'bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200'
                }`}
              >
                <Clock className="w-3.5 h-3.5" />
                <span>Pending Approvals ({pendingList.length})</span>
              </button>

              <button
                type="button"
                onClick={() => setFilter('Approved')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                  filter === 'Approved'
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border border-emerald-200'
                }`}
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Live Active ({activeList.length})</span>
              </button>

              <button
                type="button"
                onClick={() => setFilter('Hold')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                  filter === 'Hold'
                    ? 'bg-rose-600 text-white shadow-xs'
                    : 'bg-rose-50 hover:bg-rose-100 text-rose-900 border border-rose-200'
                }`}
              >
                <PauseCircle className="w-3.5 h-3.5" />
                <span>On Hold ({holdList.length})</span>
              </button>

              <button
                type="button"
                onClick={() => setFilter('Inactive')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                  filter === 'Inactive'
                    ? 'bg-slate-700 text-white shadow-xs'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                }`}
              >
                <span>Inactive ({inactiveList.length})</span>
              </button>

              <button
                type="button"
                onClick={() => setFilter('All')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  filter === 'All'
                    ? 'bg-[#002b49] text-white shadow-xs'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                }`}
              >
                <span>All ({accounts.length})</span>
              </button>
            </div>

            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search by name, role, email..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 rounded-xl border border-slate-200 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>
          </div>

          {/* Employee List Grid */}
          {filteredAccounts.length === 0 ? (
            <div className="p-12 text-center rounded-3xl bg-white border border-slate-200 text-slate-500 space-y-2">
              <Users className="w-10 h-10 text-slate-300 mx-auto" />
              <h4 className="font-bold text-slate-700 text-sm">No employee accounts found</h4>
              <p className="text-xs text-slate-400">
                {filter === 'PendingApproval' ? 'No registrations waiting for approval.' : 'Try adjusting your search or filters.'}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredAccounts.map((acc) => {
                const isPending = acc.approvalStatus === 'PendingApproval';
                const isHold = acc.status === 'Hold';
                const isInactive = acc.status === 'Inactive' || (acc.status === 'Disabled' && !isPending);
                const isLive = acc.approvalStatus === 'Approved' && acc.status === 'Active' && acc.loginEnabled;
                const workHoursTotal = ((acc.totalActiveWorkMinutes || 0) / 60).toFixed(1);

                return (
                  <div
                    key={acc.id}
                    className={`p-5 rounded-2xl border transition-all shadow-xs flex flex-col justify-between ${
                      isPending
                        ? 'bg-amber-950/20 border-amber-500/60 ring-1 ring-amber-500/30'
                        : isHold
                        ? 'bg-rose-950/15 border-rose-400/60'
                        : isLive
                        ? 'bg-white border-slate-200 hover:border-teal-400'
                        : 'bg-slate-50 border-slate-200 opacity-90'
                    }`}
                  >
                    <div>
                      {/* Top Header */}
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <h4 className="font-bold text-slate-900 text-base">{acc.name}</h4>
                            {isPending && (
                              <span className="px-2 py-0.5 rounded-full bg-amber-500 text-slate-950 text-[10px] font-black uppercase tracking-wider animate-pulse">
                                Pending Approval
                              </span>
                            )}
                            {isLive && (
                              <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300 text-[10px] font-bold uppercase tracking-wider">
                                Live / Active
                              </span>
                            )}
                            {isHold && (
                              <span className="px-2 py-0.5 rounded-full bg-rose-100 text-rose-800 border border-rose-300 text-[10px] font-bold uppercase tracking-wider flex items-center gap-1">
                                <PauseCircle className="w-3 h-3" />
                                On Hold
                              </span>
                            )}
                            {isInactive && (
                              <span className="px-2 py-0.5 rounded-full bg-slate-200 text-slate-700 text-[10px] font-bold uppercase tracking-wider">
                                Inactive / Frozen
                              </span>
                            )}
                          </div>

                          <div className="text-xs text-[#008080] font-semibold flex items-center gap-1.5 mt-1">
                            <Mail className="w-3.5 h-3.5 text-slate-400" />
                            <span>{acc.email}</span>
                          </div>

                          {acc.phone && (
                            <div className="text-xs text-slate-500 flex items-center gap-1.5 mt-0.5">
                              <Phone className="w-3.5 h-3.5 text-slate-400" />
                              <span>{acc.phone}</span>
                            </div>
                          )}
                        </div>

                        <span className="px-2.5 py-1 rounded-xl bg-teal-50 border border-teal-200 text-[#008080] text-xs font-bold uppercase tracking-wider shrink-0">
                          {acc.role}
                        </span>
                      </div>

                      {/* Details Box */}
                      <div className="mt-3.5 p-3 rounded-xl bg-slate-50 border border-slate-200/80 text-xs space-y-1.5 text-slate-700">
                        <div className="flex justify-between">
                          <span className="text-slate-500">Department:</span>
                          <strong className="text-slate-900">{acc.department}</strong>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-500">Assigned by HR:</span>
                          <span className="font-semibold text-slate-800">{acc.requestedBy || 'HR Dept'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-500">Last Login:</span>
                          <span className="font-medium text-slate-900">{acc.lastLogin || 'No recorded login'}</span>
                        </div>
                        {acc.holdReason && (
                          <div className="pt-1.5 border-t border-rose-200 text-[11px] text-rose-700 font-medium">
                            <strong>Hold Reason:</strong> {acc.holdReason}
                          </div>
                        )}
                        {acc.notes && (
                          <div className="pt-1 border-t border-slate-200 text-[11px] text-slate-600">
                            <strong>Remarks:</strong> {acc.notes}
                          </div>
                        )}
                        {acc.adminNotes && (
                          <div className="pt-1 border-t border-slate-200 text-[11px] text-teal-800">
                            <strong>Admin Note:</strong> {acc.adminNotes}
                          </div>
                        )}
                      </div>

                      {/* Work & Login Activity Summary Chips */}
                      <div className="mt-3 grid grid-cols-3 gap-2">
                        <div className="p-2 rounded-xl bg-teal-50/70 border border-teal-200/60 text-center">
                          <span className="text-[10px] text-teal-700 block font-bold">Login Frequency</span>
                          <span className="text-sm font-black text-teal-900 block mt-0.5">{acc.loginFrequency || 0} logins</span>
                        </div>
                        <div className="p-2 rounded-xl bg-blue-50/70 border border-blue-200/60 text-center">
                          <span className="text-[10px] text-blue-700 block font-bold">Active Work</span>
                          <span className="text-sm font-black text-blue-900 block mt-0.5">{workHoursTotal} hrs</span>
                        </div>
                        <div className="p-2 rounded-xl bg-purple-50/70 border border-purple-200/60 text-center">
                          <span className="text-[10px] text-purple-700 block font-bold">Logged Tasks</span>
                          <span className="text-sm font-black text-purple-900 block mt-0.5">{(acc.workRecords || []).length} records</span>
                        </div>
                      </div>
                    </div>

                    {/* Action Controls Toolbar */}
                    <div className="mt-4 pt-3 border-t border-slate-200 space-y-2">
                      {isPending ? (
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => handleApprove(acc)}
                            className="flex-1 py-2 px-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:brightness-110 text-white font-bold text-xs shadow-xs transition-all cursor-pointer flex items-center justify-center gap-1.5"
                          >
                            <Check className="w-4 h-4" />
                            <span>Approve &amp; Activate Live</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => setRejectModalAccount(acc)}
                            className="py-2 px-3 rounded-xl bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 font-bold text-xs transition-colors cursor-pointer flex items-center gap-1"
                          >
                            <X className="w-3.5 h-3.5" />
                            <span>Reject</span>
                          </button>
                        </div>
                      ) : (
                        <>
                          {/* Row 1: Status Controls: Active / Inactive / Hold */}
                          <div className="flex items-center justify-between gap-1.5 bg-slate-100 p-1 rounded-xl">
                            <span className="text-[10px] font-bold text-slate-500 uppercase px-2">Set Status:</span>
                            <div className="flex items-center gap-1">
                              <button
                                type="button"
                                onClick={() => handleSetStatus(acc.id, 'Active')}
                                className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                                  acc.status === 'Active'
                                    ? 'bg-emerald-600 text-white shadow-2xs'
                                    : 'text-emerald-800 hover:bg-emerald-100'
                                }`}
                                title="Activate employee workspace login"
                              >
                                Active
                              </button>

                              <button
                                type="button"
                                onClick={() => {
                                  setHoldModalAccount(acc);
                                  setHoldReasonInput(acc.holdReason || 'Administrative compliance review in progress.');
                                }}
                                className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                                  acc.status === 'Hold'
                                    ? 'bg-rose-600 text-white shadow-2xs'
                                    : 'text-rose-800 hover:bg-rose-100'
                                }`}
                                title="Place account on administrative hold with notice"
                              >
                                Hold
                              </button>

                              <button
                                type="button"
                                onClick={() => handleSetStatus(acc.id, 'Inactive')}
                                className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                                  acc.status === 'Inactive'
                                    ? 'bg-slate-700 text-white shadow-2xs'
                                    : 'text-slate-700 hover:bg-slate-200'
                                }`}
                                title="Freeze account access"
                              >
                                Inactive
                              </button>
                            </div>
                          </div>

                          {/* Row 2: Management Controls: Shift Role, Edit, Work Records, Delete */}
                          <div className="flex items-center justify-between gap-2 pt-1">
                            <div className="flex items-center gap-1.5 flex-wrap">
                              <button
                                type="button"
                                onClick={() => {
                                  setShiftRoleAccount(acc);
                                  setTargetRole(acc.role);
                                }}
                                className="px-2.5 py-1 rounded-lg bg-teal-50 hover:bg-teal-100 text-teal-800 border border-teal-200 text-xs font-semibold cursor-pointer transition-colors"
                                title="Shift employee operational role"
                              >
                                Shift Role
                              </button>

                              <button
                                type="button"
                                onClick={() => openEditModal(acc)}
                                className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold cursor-pointer transition-colors"
                                title="Edit employee details"
                              >
                                Edit
                              </button>

                              <button
                                type="button"
                                onClick={() => setActivityModalAccount(acc)}
                                className="px-2.5 py-1 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-800 border border-indigo-200 text-xs font-bold cursor-pointer transition-colors flex items-center gap-1"
                                title="View login logs and edit work tasks"
                              >
                                <FileText className="w-3 h-3" />
                                <span>Work &amp; Logs</span>
                              </button>
                            </div>

                            <button
                              type="button"
                              onClick={() => handleDelete(acc.id, acc.name)}
                              className="text-xs text-slate-400 hover:text-red-600 transition-colors cursor-pointer p-1"
                              title="Delete employee account"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </>
      )}

      {/* VIEW 2: DEDICATED WORK & LOGIN ACTIVITY METRICS DASHBOARD */}
      {mainView === 'activity' && (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-5 border-b border-slate-200 bg-slate-50 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                <Activity className="w-5 h-5 text-teal-600" />
                <span>Employee Activity &amp; Work Duration Dashboard</span>
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Inspect login timestamps, active work duration, and manage logged task records with full Admin editing rights.
              </p>
            </div>

            <button
              type="button"
              onClick={() => refreshAccounts()}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 cursor-pointer shadow-2xs"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Refresh Metrics</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-700">
              <thead className="bg-slate-100/80 text-slate-600 uppercase text-[10px] font-black tracking-wider border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4">Employee</th>
                  <th className="py-3 px-4">Role &amp; Department</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Login Frequency</th>
                  <th className="py-3 px-4">Last Login Timestamp</th>
                  <th className="py-3 px-4">Total Active Work</th>
                  <th className="py-3 px-4">Logged Work Tasks</th>
                  <th className="py-3 px-4 text-right">Admin Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {accounts.map((acc) => {
                  const hoursTotal = ((acc.totalActiveWorkMinutes || 0) / 60).toFixed(1);
                  return (
                    <tr key={acc.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3 px-4 font-bold text-slate-900">
                        <div>{acc.name}</div>
                        <div className="text-[11px] text-teal-700 font-normal">{acc.email}</div>
                      </td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-0.5 rounded-lg bg-teal-50 text-teal-800 font-bold text-[10px]">
                          {acc.role}
                        </span>
                        <div className="text-[11px] text-slate-500 mt-0.5">{acc.department}</div>
                      </td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          acc.status === 'Active'
                            ? 'bg-emerald-100 text-emerald-800'
                            : acc.status === 'Hold'
                            ? 'bg-rose-100 text-rose-800'
                            : 'bg-slate-100 text-slate-700'
                        }`}>
                          {acc.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-bold text-slate-900">
                        {acc.loginFrequency || 0} logins
                      </td>
                      <td className="py-3 px-4 text-slate-600 font-mono text-[11px]">
                        {acc.lastLogin || 'No recorded login'}
                      </td>
                      <td className="py-3 px-4">
                        <span className="font-black text-indigo-700">{hoursTotal} hrs</span>
                        <span className="text-[10px] text-slate-400 block">({acc.totalActiveWorkMinutes || 0} mins)</span>
                      </td>
                      <td className="py-3 px-4">
                        <span className="font-semibold text-slate-800">{(acc.workRecords || []).length} tasks</span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <button
                          type="button"
                          onClick={() => setActivityModalAccount(acc)}
                          className="px-3 py-1.5 rounded-xl bg-teal-50 hover:bg-teal-100 text-[#008080] border border-teal-200 text-xs font-bold transition-colors cursor-pointer"
                        >
                          Inspect &amp; Edit Work
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* MODAL 1: HOLD STATUS REASON MODAL */}
      {holdModalAccount && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="font-bold text-slate-900 text-base flex items-center gap-2 text-rose-700">
                <PauseCircle className="w-5 h-5 text-rose-600" />
                <span>Place Account on Hold</span>
              </h3>
              <button
                type="button"
                onClick={() => setHoldModalAccount(null)}
                className="text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-600">
              Placing <strong>{holdModalAccount.name}</strong> ({holdModalAccount.role}) on hold will temporarily suspend login access. The message entered below will be shown on the login screen if they attempt to sign in.
            </p>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Hold Notice / Reason</label>
              <textarea
                rows={3}
                value={holdReasonInput}
                onChange={(e) => setHoldReasonInput(e.target.value)}
                placeholder="e.g. Annual clinical KYC audit in progress. Contact Admin."
                className="w-full p-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-rose-500"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setHoldModalAccount(null)}
                className="px-4 py-2 rounded-xl bg-slate-100 text-xs font-bold text-slate-700 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleHoldConfirm}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-xs font-bold text-white cursor-pointer"
              >
                Confirm Hold Status
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: SHIFT ROLE MODAL */}
      {shiftRoleAccount && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-[#008080]" />
                <span>Shift Employee Operational Role</span>
              </h3>
              <button
                type="button"
                onClick={() => setShiftRoleAccount(null)}
                className="text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-600">
              Shift operational role for <strong>{shiftRoleAccount.name}</strong>. Current Role: <span className="font-bold text-teal-700">{shiftRoleAccount.role}</span>.
            </p>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">New Operational Role</label>
              <select
                value={targetRole}
                onChange={(e) => setTargetRole(e.target.value as StaffAccount['role'])}
                className="w-full p-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-teal-500"
              >
                <option value="DARTeam">Data Acquisition &amp; Research Team (DAR TEAM)</option>
                <option value="DoctorCoordinator">Doctor / Clinical Coordinator</option>
                <option value="OperationsLead">Operations &amp; Fleet Lead</option>
                <option value="CustomerSupport">Customer Support &amp; Grievance</option>
                <option value="FinanceExecutive">Finance Executive</option>
                <option value="PartnerOnboarding">Partner Onboarding</option>
                <option value="HR">HR Executive</option>
                <option value="SubAdmin">Sub-Administrator</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Reason for Role Shift</label>
              <textarea
                rows={2}
                value={shiftReason}
                onChange={(e) => setShiftReason(e.target.value)}
                placeholder="e.g. Transferred to coordinate acute home visits & telehealth OPDs."
                className="w-full p-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-teal-500"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShiftRoleAccount(null)}
                className="px-4 py-2 rounded-xl bg-slate-100 text-xs font-bold text-slate-700 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleShiftRoleConfirm}
                className="px-4 py-2 rounded-xl bg-[#008080] hover:bg-teal-700 text-xs font-bold text-white cursor-pointer"
              >
                Confirm Shift &amp; Notify
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 3: EDIT EMPLOYEE MODAL */}
      {editAccount && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-lg w-full shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
                <Edit className="w-5 h-5 text-teal-600" />
                <span>Edit Employee Profile</span>
              </h3>
              <button
                type="button"
                onClick={() => setEditAccount(null)}
                className="text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleEditSave} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-teal-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Work Email</label>
                  <input
                    type="email"
                    required
                    value={editEmail}
                    onChange={(e) => setEditEmail(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-teal-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Phone</label>
                  <input
                    type="tel"
                    value={editPhone}
                    onChange={(e) => setEditPhone(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-teal-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Department</label>
                <input
                  type="text"
                  value={editDept}
                  onChange={(e) => setEditDept(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-teal-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Internal Notes &amp; Scope</label>
                <textarea
                  rows={2}
                  value={editNotes}
                  onChange={(e) => setEditNotes(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-teal-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setEditAccount(null)}
                  className="px-4 py-2 rounded-xl bg-slate-100 text-xs font-bold text-slate-700 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-[#008080] hover:bg-teal-700 text-xs font-bold text-white cursor-pointer"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 4: WORK RECORDS & ACTIVITY LOGS MANAGER (FULL ADMIN PRIVILEGES) */}
      {activityModalAccount && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="bg-white rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-hidden shadow-2xl border border-slate-200 flex flex-col">
            {/* Modal Header */}
            <div className="p-5 border-b border-slate-200 bg-gradient-to-r from-slate-900 to-[#002b49] text-white flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-black text-lg text-white">{activityModalAccount.name}</h3>
                  <span className="px-2 py-0.5 rounded-full bg-teal-500/30 text-teal-200 border border-teal-400/40 text-[10px] font-bold uppercase">
                    {activityModalAccount.role}
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-bold uppercase">
                    {activityModalAccount.status}
                  </span>
                </div>
                <p className="text-xs text-slate-300 mt-0.5">
                  Full Admin View &amp; Edit Privileges for Logged Work Tasks &amp; Timestamped Logins
                </p>
              </div>

              <button
                type="button"
                onClick={() => {
                  setActivityModalAccount(null);
                  setShowAddWorkModal(false);
                }}
                className="text-slate-400 hover:text-white cursor-pointer p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Content Scrollable */}
            <div className="p-6 overflow-y-auto space-y-6 flex-1">
              {/* Activity Metric Highlights */}
              <div className="grid grid-cols-3 gap-3">
                <div className="p-3.5 rounded-2xl bg-teal-50 border border-teal-200 text-center">
                  <span className="text-xs font-bold text-teal-700 block">Total Active Work</span>
                  <span className="text-2xl font-black text-teal-900 block mt-1">
                    {((activityModalAccount.totalActiveWorkMinutes || 0) / 60).toFixed(1)} hrs
                  </span>
                  <span className="text-[10px] text-teal-600 mt-0.5 block">
                    {activityModalAccount.totalActiveWorkMinutes || 0} active minutes
                  </span>
                </div>

                <div className="p-3.5 rounded-2xl bg-blue-50 border border-blue-200 text-center">
                  <span className="text-xs font-bold text-blue-700 block">Total Login Frequency</span>
                  <span className="text-2xl font-black text-blue-900 block mt-1">
                    {activityModalAccount.loginFrequency || 0}
                  </span>
                  <span className="text-[10px] text-blue-600 mt-0.5 block">Recorded sign-ins</span>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-100 border border-slate-200 text-center">
                  <span className="text-xs font-bold text-slate-600 block">Last Active Session</span>
                  <span className="text-xs font-black text-slate-900 block mt-2">
                    {activityModalAccount.lastLogin || 'Never'}
                  </span>
                  <span className="text-[10px] text-slate-500 mt-1 block">Auto-timeout: 30 mins</span>
                </div>
              </div>

              {/* Section 1: Logged Work Records (Admin Edit Privileges) */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-black text-slate-900 flex items-center gap-1.5">
                    <FileText className="w-4 h-4 text-teal-600" />
                    <span>Logged Work Records &amp; Tasks (Admin View &amp; Edit)</span>
                  </h4>

                  <button
                    type="button"
                    onClick={() => {
                      setEditingWorkRecordId(null);
                      setWorkDate(new Date().toISOString().split('T')[0]);
                      setWorkDescription('');
                      setWorkHours('6.0');
                      setWorkAdminNotes('');
                      setShowAddWorkModal(true);
                    }}
                    className="inline-flex items-center gap-1 text-xs font-bold px-3 py-1.5 rounded-xl bg-[#008080] hover:bg-teal-700 text-white cursor-pointer shadow-xs"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Work Record</span>
                  </button>
                </div>

                {/* Sub-form to Add or Edit Work Record */}
                {showAddWorkModal && (
                  <form onSubmit={handleSaveWorkRecord} className="p-4 rounded-2xl bg-teal-50/70 border border-teal-200 space-y-3 animate-in fade-in">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-teal-900">
                        {editingWorkRecordId ? 'Edit Work Record' : 'Log New Work Record for Employee'}
                      </span>
                      <button
                        type="button"
                        onClick={() => setShowAddWorkModal(false)}
                        className="text-xs text-slate-400 hover:text-slate-700 cursor-pointer"
                      >
                        Cancel
                      </button>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-[11px] font-bold text-slate-700 mb-1">Date</label>
                        <input
                          type="date"
                          required
                          value={workDate}
                          onChange={(e) => setWorkDate(e.target.value)}
                          className="w-full p-2 rounded-xl bg-white border border-teal-300 text-xs"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-slate-700 mb-1">Hours Worked</label>
                        <input
                          type="number"
                          step="0.5"
                          required
                          value={workHours}
                          onChange={(e) => setWorkHours(e.target.value)}
                          className="w-full p-2 rounded-xl bg-white border border-teal-300 text-xs"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">Task / Work Description</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Conducted 6 patient tele-triage consultations and coordinated phlebotomy slots"
                        value={workDescription}
                        onChange={(e) => setWorkDescription(e.target.value)}
                        className="w-full p-2 rounded-xl bg-white border border-teal-300 text-xs"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">Admin Audit Notes</label>
                      <input
                        type="text"
                        placeholder="e.g. Verified clinical hours against call dispatch logs"
                        value={workAdminNotes}
                        onChange={(e) => setWorkAdminNotes(e.target.value)}
                        className="w-full p-2 rounded-xl bg-white border border-teal-300 text-xs"
                      />
                    </div>

                    <div className="flex justify-end gap-2 pt-1">
                      <button
                        type="button"
                        onClick={() => setShowAddWorkModal(false)}
                        className="px-3 py-1.5 rounded-xl bg-slate-200 text-xs font-semibold text-slate-700 cursor-pointer"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-3.5 py-1.5 rounded-xl bg-[#002b49] hover:bg-[#003d66] text-white text-xs font-bold cursor-pointer shadow-xs"
                      >
                        Save Work Record
                      </button>
                    </div>
                  </form>
                )}

                {/* Work Records Table */}
                {(!activityModalAccount.workRecords || activityModalAccount.workRecords.length === 0) ? (
                  <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 text-center text-xs text-slate-400">
                    No work records logged yet. Click "Add Work Record" above to log work sessions.
                  </div>
                ) : (
                  <div className="rounded-2xl border border-slate-200 overflow-hidden">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-slate-100 text-slate-600 font-bold text-[10px] uppercase">
                        <tr>
                          <th className="py-2.5 px-3">Date</th>
                          <th className="py-2.5 px-3">Task Description</th>
                          <th className="py-2.5 px-3">Hours</th>
                          <th className="py-2.5 px-3">Admin Notes</th>
                          <th className="py-2.5 px-3 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {activityModalAccount.workRecords.map((wr) => (
                          <tr key={wr.id} className="hover:bg-slate-50">
                            <td className="py-2.5 px-3 font-semibold text-slate-800 whitespace-nowrap">{wr.date}</td>
                            <td className="py-2.5 px-3 text-slate-700">{wr.taskDescription}</td>
                            <td className="py-2.5 px-3 font-bold text-teal-800">{wr.hoursWorked} hrs</td>
                            <td className="py-2.5 px-3 text-[11px] text-slate-500">{wr.adminNotes || '—'}</td>
                            <td className="py-2.5 px-3 text-right space-x-1.5 whitespace-nowrap">
                              <button
                                type="button"
                                onClick={() => {
                                  setEditingWorkRecordId(wr.id);
                                  setWorkDate(wr.date);
                                  setWorkDescription(wr.taskDescription);
                                  setWorkHours(String(wr.hoursWorked));
                                  setWorkAdminNotes(wr.adminNotes || '');
                                  setShowAddWorkModal(true);
                                }}
                                className="text-xs text-teal-700 hover:underline cursor-pointer font-semibold"
                              >
                                Edit
                              </button>
                              <button
                                type="button"
                                onClick={() => handleDeleteWorkRecord(wr.id)}
                                className="text-xs text-rose-600 hover:underline cursor-pointer"
                              >
                                Delete
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>

              {/* Section 2: Timestamped Login History */}
              <div className="space-y-3 pt-2 border-t border-slate-200">
                <h4 className="text-sm font-black text-slate-900 flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-teal-600" />
                  <span>Login History &amp; Timestamps (Date &amp; Time Log)</span>
                </h4>

                {(!activityModalAccount.loginLogs || activityModalAccount.loginLogs.length === 0) ? (
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-center text-xs text-slate-400">
                    No login timestamps recorded yet.
                  </div>
                ) : (
                  <div className="rounded-2xl border border-slate-200 overflow-hidden max-h-48 overflow-y-auto">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-slate-100 text-slate-600 font-bold text-[10px] uppercase">
                        <tr>
                          <th className="py-2 px-3">Date</th>
                          <th className="py-2 px-3">Time</th>
                          <th className="py-2 px-3">Device / Channel</th>
                          <th className="py-2 px-3">Timestamp</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {activityModalAccount.loginLogs.map((log) => (
                          <tr key={log.id} className="hover:bg-slate-50 font-mono text-[11px]">
                            <td className="py-2 px-3 text-slate-800">{log.date}</td>
                            <td className="py-2 px-3 text-slate-600">{log.time}</td>
                            <td className="py-2 px-3 text-slate-600">{log.device || 'Nhealth Workstation'}</td>
                            <td className="py-2 px-3 text-teal-700 font-semibold">{log.timestamp}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-slate-200 bg-slate-50 flex justify-end">
              <button
                type="button"
                onClick={() => setActivityModalAccount(null)}
                className="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold cursor-pointer"
              >
                Close Inspector
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 5: REJECT MODAL */}
      {rejectModalAccount && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="font-bold text-slate-900 text-base">Reject Registration Request</h3>
              <button
                type="button"
                onClick={() => setRejectModalAccount(null)}
                className="text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-600">
              Rejecting <strong>{rejectModalAccount.name}</strong> ({rejectModalAccount.role}). Please provide a reason that will display on their status gate.
            </p>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Rejection Reason</label>
              <textarea
                rows={3}
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-300 text-xs focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setRejectModalAccount(null)}
                className="px-4 py-2 rounded-xl bg-slate-100 text-xs font-bold text-slate-700 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleRejectConfirm}
                className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-xs font-bold text-white cursor-pointer"
              >
                Confirm Rejection
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 6: ADMIN QUICK ONBOARD MODAL */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-lg w-full shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
                <UserPlus className="w-5 h-5 text-[#008080]" />
                <span>Onboard Employee with Role Assignment</span>
              </h3>
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateEmployee} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Ramesh Chandra"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="w-full p-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-teal-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Work Email</label>
                  <input
                    type="email"
                    required
                    placeholder="ramesh@nhealth.in"
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                    className="w-full p-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-teal-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Phone</label>
                  <input
                    type="tel"
                    placeholder="+91 98480 00112"
                    value={newPhone}
                    onChange={(e) => setNewPhone(e.target.value)}
                    className="w-full p-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-teal-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Operational Role</label>
                  <select
                    value={newRole}
                    onChange={(e) => {
                      const r = e.target.value as StaffAccount['role'];
                      setNewRole(r);
                      if (r === 'DoctorCoordinator') setNewDepartment('Clinical Operations & Telehealth');
                      if (r === 'OperationsLead') setNewDepartment('Field Logistics & Fleet');
                      if (r === 'CustomerSupport') setNewDepartment('24/7 Patient Grievance & SOS');
                      if (r === 'DARTeam') setNewDepartment('Data Acquisition & Research Team (DAR TEAM)');
                      if (r === 'HR') setNewDepartment('Human Resources & Talent Management');
                      if (r === 'SubAdmin') setNewDepartment('Regional System Operations');
                    }}
                    className="w-full p-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-teal-500"
                  >
                    <option value="DARTeam">Data Acquisition &amp; Research Team (DAR TEAM)</option>
                    <option value="DoctorCoordinator">Doctor / Clinical Coordinator</option>
                    <option value="OperationsLead">Operations &amp; Fleet Lead</option>
                    <option value="CustomerSupport">Customer Support &amp; Grievance</option>
                    <option value="FinanceExecutive">Finance Executive</option>
                    <option value="PartnerOnboarding">Partner Onboarding</option>
                    <option value="HR">HR Executive</option>
                    <option value="SubAdmin">Sub-Administrator</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Department</label>
                  <input
                    type="text"
                    value={newDepartment}
                    onChange={(e) => setNewDepartment(e.target.value)}
                    className="w-full p-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-teal-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Scope / Remarks</label>
                <textarea
                  rows={2}
                  placeholder="e.g. Granted patient triage escalation & tele-consult scheduling permissions."
                  value={newNotes}
                  onChange={(e) => setNewNotes(e.target.value)}
                  className="w-full p-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-teal-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 text-xs font-bold text-slate-700 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-[#008080] hover:bg-teal-700 text-xs font-bold text-white cursor-pointer"
                >
                  Submit Registration
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
