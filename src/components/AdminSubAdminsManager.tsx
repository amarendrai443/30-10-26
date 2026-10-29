/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  ShieldAlert,
  UserPlus,
  KeyRound,
  CheckCircle2,
  XCircle,
  ToggleLeft,
  ToggleRight,
  Search,
  Lock,
  Unlock,
  Trash2,
  Edit,
  Mail,
  Phone,
  Building2,
  Users,
  Check,
  X,
  AlertTriangle,
  Clock,
  Sliders,
  Sparkles,
} from 'lucide-react';
import {
  StaffAccount,
  SystemPermission,
  ALL_SYSTEM_PERMISSIONS,
  getStoredStaffAccounts,
  addStaffAccount,
  updateStaffAccount,
  toggleStaffLoginAccess,
  deleteStaffAccount,
  approveStaffRequest,
  rejectStaffRequest,
} from '../utils/staffAccessStorage';

export const AdminSubAdminsManager: React.FC = () => {
  const [accounts, setAccounts] = useState<StaffAccount[]>(() => getStoredStaffAccounts());
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('All');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingAccount, setEditingAccount] = useState<StaffAccount | null>(null);

  // Approval Pipeline Modals & State
  const [modifyModalAccount, setModifyModalAccount] = useState<StaffAccount | null>(null);
  const [modifyPermissions, setModifyPermissions] = useState<string[]>([]);
  const [modifyAdminNotes, setModifyAdminNotes] = useState('');

  const [rejectModalAccount, setRejectModalAccount] = useState<StaffAccount | null>(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [actionSuccessMsg, setActionSuccessMsg] = useState<string | null>(null);

  // Create/Edit Form State
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState<StaffAccount['role']>('SubAdmin');
  const [department, setDepartment] = useState('Operations & Telehealth');
  const [notes, setNotes] = useState('');
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([
    'manage_partners',
    'guest_bookings',
  ]);

  useEffect(() => {
    const handleSync = () => setAccounts(getStoredStaffAccounts());
    window.addEventListener('nhealth_staff_accounts_updated', handleSync);
    return () => window.removeEventListener('nhealth_staff_accounts_updated', handleSync);
  }, []);

  const showNotification = (msg: string) => {
    setActionSuccessMsg(msg);
    setTimeout(() => setActionSuccessMsg(null), 4000);
  };

  const handleToggleLogin = (id: string, name: string, currentState: boolean) => {
    const newState = toggleStaffLoginAccess(id);
    setAccounts(getStoredStaffAccounts());
    showNotification(`Login access for "${name}" has been ${newState ? 'ENABLED' : 'DISABLED'}.`);
  };

  const handleDelete = (id: string, name: string) => {
    if (window.confirm(`Are you sure you want to delete staff account for "${name}"?`)) {
      deleteStaffAccount(id);
      setAccounts(getStoredStaffAccounts());
      showNotification(`Account for "${name}" has been removed.`);
    }
  };

  // Admin Direct Approval
  const handleQuickApprove = (acc: StaffAccount) => {
    approveStaffRequest(acc.id, acc.permissions, 'Approved by Master Administrator');
    setAccounts(getStoredStaffAccounts());
    showNotification(`Team credential request for "${acc.name}" APPROVED. Login access is now active.`);
  };

  // Open Modify & Approve Modal
  const openModifyModal = (acc: StaffAccount) => {
    setModifyModalAccount(acc);
    setModifyPermissions([...acc.permissions]);
    setModifyAdminNotes(acc.adminNotes || 'Custom rights configured and approved by Master Admin');
  };

  const handleConfirmModifyApprove = (e: React.FormEvent) => {
    e.preventDefault();
    if (!modifyModalAccount) return;

    approveStaffRequest(modifyModalAccount.id, modifyPermissions, modifyAdminNotes);
    setAccounts(getStoredStaffAccounts());
    showNotification(`Custom permissions saved and credential for "${modifyModalAccount.name}" APPROVED.`);
    setModifyModalAccount(null);
  };

  // Open Reject Modal
  const openRejectModal = (acc: StaffAccount) => {
    setRejectModalAccount(acc);
    setRejectionReason('Insufficient documentation or role quota filled for this operational department.');
  };

  const handleConfirmReject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!rejectModalAccount) return;

    rejectStaffRequest(rejectModalAccount.id, rejectionReason);
    setAccounts(getStoredStaffAccounts());
    showNotification(`Team credential request for "${rejectModalAccount.name}" has been REJECTED.`);
    setRejectModalAccount(null);
  };

  const handleTogglePermission = (permId: string) => {
    setSelectedPermissions((prev) =>
      prev.includes(permId) ? prev.filter((p) => p !== permId) : [...prev, permId]
    );
  };

  const handleToggleModifyPermission = (permId: string) => {
    setModifyPermissions((prev) =>
      prev.includes(permId) ? prev.filter((p) => p !== permId) : [...prev, permId]
    );
  };

  const handleSelectAllPermissions = () => {
    setSelectedPermissions(ALL_SYSTEM_PERMISSIONS.map((p) => p.id));
  };

  const handleClearPermissions = () => {
    setSelectedPermissions([]);
  };

  const openCreateModal = () => {
    setEditingAccount(null);
    setName('');
    setEmail('');
    setPhone('');
    setRole('SubAdmin');
    setDepartment('Operations & Dispatch');
    setNotes('');
    setSelectedPermissions(['manage_partners', 'guest_bookings', 'view_enquiries']);
    setIsCreateModalOpen(true);
  };

  const openEditModal = (acc: StaffAccount) => {
    setEditingAccount(acc);
    setName(acc.name);
    setEmail(acc.email);
    setPhone(acc.phone);
    setRole(acc.role);
    setDepartment(acc.department);
    setNotes(acc.notes || '');
    setSelectedPermissions([...acc.permissions]);
    setIsCreateModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email) return;

    if (editingAccount) {
      updateStaffAccount(editingAccount.id, {
        name,
        email,
        phone,
        role,
        department,
        notes,
        permissions: selectedPermissions,
      });
      showNotification(`Updated rights for "${name}".`);
    } else {
      addStaffAccount({
        name,
        email,
        phone,
        role,
        department,
        status: 'Active',
        loginEnabled: true,
        permissions: selectedPermissions,
        notes,
        approvalStatus: 'Approved',
      });
      showNotification(`Created and authorized Sub-Admin "${name}".`);
    }

    setAccounts(getStoredStaffAccounts());
    setIsCreateModalOpen(false);
  };

  const pendingRequests = accounts.filter((a) => a.approvalStatus === 'PendingApproval');

  const filteredAccounts = accounts.filter((acc) => {
    const matchesSearch =
      acc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      acc.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      acc.department.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === 'All' || acc.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {actionSuccessMsg && (
        <div className="p-4 rounded-xl bg-emerald-950/80 border border-emerald-500/50 flex items-center gap-2.5 text-xs text-emerald-200 shadow-xl animate-fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span className="font-semibold">{actionSuccessMsg}</span>
        </div>
      )}

      {/* Header Banner */}
      <div className="p-5 sm:p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-800 to-teal-950/70 border border-teal-500/30 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/10 text-teal-300 border border-teal-500/30 text-xs font-semibold">
              <KeyRound className="w-3.5 h-3.5" />
              Main Administrator Security &amp; Permissions Center
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              Sub-Admin &amp; Team Login Governance
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
              Full control over all system modules. Create Sub-Admins, assign granular rights, review HR credential requests in the approval pipeline, and dynamically <strong className="text-teal-300 font-semibold">enable or disable any HR or team login access</strong> at any time.
            </p>
          </div>

          <button
            onClick={openCreateModal}
            className="px-4 py-2.5 bg-teal-600 hover:bg-teal-500 text-white rounded-xl text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 shadow-lg shadow-teal-900/40 transition-all shrink-0 cursor-pointer"
          >
            <UserPlus className="w-4 h-4" />
            Create Sub-Admin / Staff
          </button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-5 border-t border-slate-700/60 text-xs">
          <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-700/50">
            <span className="text-slate-400 block text-[11px]">Total Accounts In System</span>
            <span className="text-xl font-bold text-white mt-0.5 block">{accounts.length}</span>
          </div>

          <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-700/50">
            <span className="text-slate-400 block text-[11px]">Active Logins Enabled</span>
            <span className="text-xl font-bold text-emerald-400 mt-0.5 block">
              {accounts.filter((a) => a.loginEnabled && a.approvalStatus !== 'PendingApproval').length}
            </span>
          </div>

          <div className="p-3 rounded-xl bg-amber-950/40 border border-amber-500/40">
            <span className="text-amber-300 block text-[11px] font-semibold">Pending HR Approvals</span>
            <span className="text-xl font-bold text-amber-400 mt-0.5 block flex items-center gap-1.5">
              {pendingRequests.length}
              {pendingRequests.length > 0 && (
                <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-amber-500 text-slate-950 font-black animate-pulse">
                  ACTION NEEDED
                </span>
              )}
            </span>
          </div>

          <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-700/50">
            <span className="text-slate-400 block text-[11px]">HR Portal (/hrthings) Accounts</span>
            <span className="text-xl font-bold text-teal-400 mt-0.5 block">
              {accounts.filter((a) => a.role === 'HR' || a.permissions.includes('hr_portal')).length}
            </span>
          </div>
        </div>
      </div>

      {/* ADMIN APPROVAL PIPELINE: PENDING HR TEAM CREDENTIALS */}
      {pendingRequests.length > 0 && (
        <div className="p-5 rounded-2xl bg-amber-950/30 border border-amber-500/50 shadow-xl space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-amber-500/30 pb-3">
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-500/30">
                <Clock className="w-5 h-5 text-amber-400" />
              </span>
              <div>
                <h3 className="font-bold text-white text-base flex items-center gap-2">
                  <span>Pending HR Credential Approval Pipeline</span>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-amber-500 text-slate-950 font-extrabold">
                    {pendingRequests.length} Waiting Review
                  </span>
                </h3>
                <p className="text-xs text-amber-200/80">
                  HR personnel have requested new team logins. Staff cannot log in until you explicitly approve or customize permissions.
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {pendingRequests.map((req) => (
              <div
                key={req.id}
                className="p-4 rounded-xl bg-slate-900/90 border border-amber-500/40 shadow-lg space-y-3"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h4 className="font-bold text-white text-sm">{req.name}</h4>
                    <div className="text-xs text-teal-300 flex items-center gap-1 mt-0.5">
                      <Mail className="w-3.5 h-3.5 text-slate-400" />
                      {req.email}
                    </div>
                    <div className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                      <Phone className="w-3.5 h-3.5 text-slate-400" />
                      {req.phone}
                    </div>
                  </div>

                  <span className="px-2.5 py-1 rounded-md bg-amber-950/80 text-amber-300 border border-amber-500/30 text-[10px] font-bold uppercase tracking-wider">
                    {req.role}
                  </span>
                </div>

                <div className="p-2.5 rounded-lg bg-slate-800/80 border border-slate-700/60 text-xs space-y-1">
                  <div className="text-slate-300">
                    <strong className="text-white">Department:</strong> {req.department}
                  </div>
                  <div className="text-slate-300">
                    <strong className="text-white">Requested By:</strong> {req.requestedBy || 'HR Dept'} ({req.requestedAt || req.createdAt})
                  </div>
                  {req.notes && (
                    <div className="text-amber-200/90 text-[11px] pt-1 border-t border-slate-700">
                      <strong>HR Note:</strong> {req.notes}
                    </div>
                  )}
                </div>

                <div className="flex flex-wrap items-center gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => handleQuickApprove(req)}
                    className="flex-1 px-3 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer shadow-md shadow-emerald-950/40 transition-colors"
                  >
                    <Check className="w-3.5 h-3.5" />
                    Approve &amp; Grant Login
                  </button>

                  <button
                    type="button"
                    onClick={() => openModifyModal(req)}
                    className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-teal-300 hover:text-white border border-teal-500/30 rounded-xl text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition-colors"
                    title="Customize granular rights before approving"
                  >
                    <Sliders className="w-3.5 h-3.5" />
                    Modify Rights
                  </button>

                  <button
                    type="button"
                    onClick={() => openRejectModal(req)}
                    className="px-3 py-2 bg-red-950/60 hover:bg-red-900 text-red-300 border border-red-500/30 rounded-xl text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition-colors"
                  >
                    <X className="w-3.5 h-3.5" />
                    Reject
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2 flex-1 max-w-md">
          <div className="relative w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by name, work email, or department..."
              className="w-full bg-slate-800/80 border border-slate-700 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-teal-500"
            />
          </div>

          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="bg-slate-800/80 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-300 focus:outline-none focus:ring-1 focus:ring-teal-500"
          >
            <option value="All">All Roles</option>
            <option value="SubAdmin">Sub-Admin</option>
            <option value="HR">HR Executive</option>
            <option value="CustomerSupport">Customer Support Staff</option>
            <option value="OperationsLead">Operations Lead</option>
            <option value="PartnerOnboarding">Partner Onboarding</option>
            <option value="DoctorCoordinator">Doctor Coordinator</option>
            <option value="FinanceExecutive">Finance Executive</option>
          </select>
        </div>

        <div className="text-[11px] text-slate-400 flex items-center gap-1.5 self-center sm:self-auto">
          <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />
          Clicking the access switch immediately revokes or reinstates system authorization.
        </div>
      </div>

      {/* Staff & Sub-Admins Table */}
      <div className="bg-slate-800/70 border border-slate-700/80 rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-900/80 border-b border-slate-700 text-slate-400 uppercase tracking-wider text-[11px]">
              <tr>
                <th className="px-4 py-3.5">Staff Name &amp; Contact</th>
                <th className="px-4 py-3.5">Role &amp; Department</th>
                <th className="px-4 py-3.5 text-center">Governance Status</th>
                <th className="px-4 py-3.5">Module Permissions</th>
                <th className="px-4 py-3.5 text-center">Login Access</th>
                <th className="px-4 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700/60">
              {filteredAccounts.map((acc) => {
                const isPending = acc.approvalStatus === 'PendingApproval';
                const isRejected = acc.approvalStatus === 'Rejected';

                return (
                  <tr
                    key={acc.id}
                    className={`hover:bg-slate-800/40 transition-colors ${
                      isPending ? 'bg-amber-950/15' : !acc.loginEnabled ? 'bg-red-950/10' : ''
                    }`}
                  >
                    {/* Name & Contact */}
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-2.5">
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs shrink-0 ${
                            isPending
                              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                              : acc.loginEnabled
                              ? 'bg-teal-500/20 text-teal-300 border border-teal-500/30'
                              : 'bg-red-500/20 text-red-400 border border-red-500/30'
                          }`}
                        >
                          {acc.name.charAt(0)}
                        </div>
                        <div>
                          <div className="font-bold text-white flex items-center gap-1.5">
                            {acc.name}
                            {!acc.loginEnabled && !isPending && (
                              <span className="text-[9px] px-1.5 py-0.2 rounded bg-red-950 text-red-400 border border-red-500/30 uppercase">
                                Access Disabled
                              </span>
                            )}
                          </div>
                          <div className="text-[11px] text-slate-400 flex items-center gap-1">
                            <Mail className="w-3 h-3 text-slate-500" />
                            {acc.email}
                          </div>
                          <div className="text-[10px] text-slate-500 mt-0.5">
                            Created: {acc.createdAt} • Last: {acc.lastLogin || 'Never'}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Role & Dept */}
                    <td className="px-4 py-4">
                      <div className="font-semibold text-slate-200">{acc.role}</div>
                      <div className="text-[11px] text-slate-400 mt-0.5 flex items-center gap-1">
                        <Building2 className="w-3 h-3 text-slate-500" />
                        {acc.department}
                      </div>
                    </td>

                    {/* Governance Status */}
                    <td className="px-4 py-4 text-center">
                      {isPending && (
                        <span className="px-2 py-0.5 rounded-full bg-amber-950/80 text-amber-300 border border-amber-500/40 text-[10px] font-bold">
                          Pending Admin Review
                        </span>
                      )}
                      {isRejected && (
                        <span className="px-2 py-0.5 rounded-full bg-red-950/80 text-red-300 border border-red-500/40 text-[10px] font-bold">
                          Rejected by Admin
                        </span>
                      )}
                      {!isPending && !isRejected && (
                        <span className="px-2 py-0.5 rounded-full bg-emerald-950/80 text-emerald-300 border border-emerald-500/40 text-[10px] font-bold">
                          Admin Approved
                        </span>
                      )}
                    </td>

                    {/* Permissions Badges */}
                    <td className="px-4 py-4 max-w-xs">
                      <div className="flex flex-wrap gap-1">
                        {acc.permissions.map((pId) => {
                          const perm = ALL_SYSTEM_PERMISSIONS.find((p) => p.id === pId);
                          const isHr = pId === 'hr_portal';
                          return (
                            <span
                              key={pId}
                              title={perm?.description}
                              className={`px-2 py-0.5 rounded-md text-[10px] font-medium ${
                                isHr
                                  ? 'bg-amber-950/70 text-amber-300 border border-amber-500/30 font-bold'
                                  : 'bg-slate-900/80 text-teal-300 border border-slate-700'
                              }`}
                            >
                              {perm?.label || pId}
                            </span>
                          );
                        })}
                        {acc.permissions.length === 0 && (
                          <span className="text-slate-500 text-[10px] italic">No rights assigned</span>
                        )}
                      </div>
                    </td>

                    {/* Dynamic Enable/Disable Toggle */}
                    <td className="px-4 py-4 text-center">
                      {isPending ? (
                        <button
                          onClick={() => handleQuickApprove(acc)}
                          className="px-2.5 py-1 bg-amber-600 hover:bg-amber-500 text-slate-950 font-black rounded-lg text-[10px] transition-colors cursor-pointer"
                        >
                          Review &amp; Approve
                        </button>
                      ) : (
                        <div className="inline-flex flex-col items-center gap-1">
                          <button
                            type="button"
                            onClick={() => handleToggleLogin(acc.id, acc.name, acc.loginEnabled)}
                            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-sm ${
                              acc.loginEnabled
                                ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-900/30'
                                : 'bg-red-950/80 hover:bg-red-900 text-red-200 border border-red-500/40'
                            }`}
                            title={
                              acc.loginEnabled
                                ? 'Click to instantly DISABLE login access'
                                : 'Click to RE-ENABLE login access'
                            }
                          >
                            {acc.loginEnabled ? (
                              <>
                                <Unlock className="w-3.5 h-3.5" />
                                Login Enabled
                              </>
                            ) : (
                              <>
                                <Lock className="w-3.5 h-3.5 text-red-400" />
                                Access Disabled
                              </>
                            )}
                          </button>
                          <span className="text-[10px] text-slate-500">
                            {acc.loginEnabled ? 'Access active' : 'Login blocked'}
                          </span>
                        </div>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="px-4 py-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => openEditModal(acc)}
                          className="p-1.5 rounded-lg bg-slate-700/60 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
                          title="Edit Permissions & Rights"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(acc.id, acc.name)}
                          className="p-1.5 rounded-lg bg-red-950/40 hover:bg-red-900/60 text-red-400 hover:text-red-300 border border-red-500/20 transition-colors cursor-pointer"
                          title="Delete Account"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modify Permissions & Approve Modal */}
      {modifyModalAccount && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-800 border border-slate-700 rounded-2xl max-w-xl w-full p-6 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-700 mb-4">
              <div>
                <h3 className="font-bold text-white text-base flex items-center gap-2">
                  <Sliders className="w-5 h-5 text-teal-400" />
                  Customize Rights &amp; Approve Team Member
                </h3>
                <p className="text-xs text-slate-400">
                  Candidate: <strong className="text-white">{modifyModalAccount.name}</strong> ({modifyModalAccount.email})
                </p>
              </div>
              <button
                onClick={() => setModifyModalAccount(null)}
                className="p-1 rounded-lg hover:bg-slate-700 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleConfirmModifyApprove} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Select Custom Module Permissions</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 p-3 bg-slate-900/80 border border-slate-700/80 rounded-xl max-h-48 overflow-y-auto">
                  {ALL_SYSTEM_PERMISSIONS.map((perm) => {
                    const isChecked = modifyPermissions.includes(perm.id);
                    return (
                      <label
                        key={perm.id}
                        className={`p-2 rounded-lg border flex items-start gap-2.5 cursor-pointer transition-colors ${
                          isChecked
                            ? 'bg-teal-950/40 border-teal-500/40 text-teal-200'
                            : 'bg-slate-800/40 border-slate-700/60 text-slate-400 hover:bg-slate-800/70'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => handleToggleModifyPermission(perm.id)}
                          className="mt-0.5 rounded border-slate-600 text-teal-500 focus:ring-0"
                        />
                        <div>
                          <div className="font-semibold text-white leading-tight">{perm.label}</div>
                          <div className="text-[10px] text-slate-400 mt-0.5">{perm.description}</div>
                        </div>
                      </label>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Admin Approval Record / Notes</label>
                <input
                  type="text"
                  value={modifyAdminNotes}
                  onChange={(e) => setModifyAdminNotes(e.target.value)}
                  placeholder="e.g. Cleared for operations fleet dispatch hotline..."
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white"
                />
              </div>

              <div className="pt-2 flex gap-2">
                <button
                  type="button"
                  onClick={() => setModifyModalAccount(null)}
                  className="flex-1 py-2.5 rounded-xl bg-slate-700 text-slate-300 hover:bg-slate-600 font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold shadow-lg shadow-emerald-950/40 cursor-pointer"
                >
                  Confirm &amp; Activate Login
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Reject Request Modal */}
      {rejectModalAccount && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-800 border border-slate-700 rounded-2xl max-w-md w-full p-6 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-700 mb-4">
              <div>
                <h3 className="font-bold text-white text-base flex items-center gap-2">
                  <XCircle className="w-5 h-5 text-red-400" />
                  Reject Team Credential Request
                </h3>
                <p className="text-xs text-slate-400">Candidate: {rejectModalAccount.name}</p>
              </div>
              <button
                onClick={() => setRejectModalAccount(null)}
                className="p-1 rounded-lg hover:bg-slate-700 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleConfirmReject} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Reason for Administrative Rejection *</label>
                <textarea
                  rows={3}
                  required
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  placeholder="State why this staff credential request is rejected..."
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-white"
                />
              </div>

              <div className="p-3 rounded-xl bg-red-950/40 border border-red-500/30 text-[11px] text-red-200">
                This account will be marked as Rejected. Login access will remain permanently disabled unless re-approved later.
              </div>

              <div className="pt-2 flex gap-2">
                <button
                  type="button"
                  onClick={() => setRejectModalAccount(null)}
                  className="flex-1 py-2.5 rounded-xl bg-slate-700 text-slate-300 hover:bg-slate-600 font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-semibold cursor-pointer"
                >
                  Confirm Rejection
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Create / Edit Sub-Admin Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-800 border border-slate-700 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-slate-700 mb-4">
              <div>
                <h3 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-teal-400" />
                  {editingAccount ? 'Edit Sub-Admin / Staff Account' : 'Create New Sub-Admin / Staff Member'}
                </h3>
                <p className="text-xs text-slate-400">
                  Assign role, official details, and customize granular permissions across all system modules.
                </p>
              </div>
              <button
                onClick={() => setIsCreateModalOpen(false)}
                className="p-1 rounded-lg hover:bg-slate-700 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Full Name *</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Ramesh Varma"
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Work Email Address *</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="ramesh@nhealth.in"
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Contact Phone</label>
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 98480 12345"
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Department</label>
                  <input
                    type="text"
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    placeholder="e.g. Clinical Dispatch & Ops"
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Assigned Role</label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value as StaffAccount['role'])}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white"
                >
                  <option value="SubAdmin">Sub-Admin (Operational Management)</option>
                  <option value="HR">HR Manager (/hrthings portal access)</option>
                  <option value="CustomerSupport">Support Staff (SOS / Helpdesk)</option>
                  <option value="OperationsLead">Operations &amp; Fleet Lead</option>
                  <option value="PartnerOnboarding">Partner Onboarding &amp; Audit</option>
                  <option value="DoctorCoordinator">Doctor / Teleconsult Coordinator</option>
                  <option value="FinanceExecutive">Finance &amp; Payout Executive</option>
                </select>
              </div>

              {/* Granular Permissions Section */}
              <div className="pt-2">
                <div className="flex items-center justify-between mb-2">
                  <label className="text-slate-200 font-bold uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                    <KeyRound className="w-3.5 h-3.5 text-teal-400" />
                    Granular Module Rights &amp; Access Permissions
                  </label>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={handleSelectAllPermissions}
                      className="text-teal-400 hover:text-teal-300 text-[11px] underline"
                    >
                      Select All
                    </button>
                    <span className="text-slate-600">•</span>
                    <button
                      type="button"
                      onClick={handleClearPermissions}
                      className="text-slate-400 hover:text-slate-300 text-[11px] underline"
                    >
                      Clear
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 p-3 bg-slate-900/80 border border-slate-700/80 rounded-xl max-h-56 overflow-y-auto">
                  {ALL_SYSTEM_PERMISSIONS.map((perm) => {
                    const isChecked = selectedPermissions.includes(perm.id);
                    return (
                      <label
                        key={perm.id}
                        className={`p-2 rounded-lg border flex items-start gap-2.5 cursor-pointer transition-colors ${
                          isChecked
                            ? 'bg-teal-950/40 border-teal-500/40 text-teal-200'
                            : 'bg-slate-800/40 border-slate-700/60 text-slate-400 hover:bg-slate-800/70'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => handleTogglePermission(perm.id)}
                          className="mt-0.5 rounded border-slate-600 text-teal-500 focus:ring-0"
                        />
                        <div>
                          <div className="font-semibold text-white leading-tight">{perm.label}</div>
                          <div className="text-[10px] text-slate-400 mt-0.5">{perm.description}</div>
                        </div>
                      </label>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Administrative Notes</label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="e.g. Authorized to oversee phlebotomy cold chain and clinic tie-up validation..."
                  rows={2}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-white placeholder-slate-500"
                />
              </div>

              <div className="pt-3 border-t border-slate-700 flex gap-2">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="flex-1 py-2.5 rounded-xl bg-slate-700 text-slate-300 hover:bg-slate-600 font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-semibold shadow-lg shadow-teal-900/40 cursor-pointer"
                >
                  {editingAccount ? 'Update Rights & Account' : 'Create & Authorize Account'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
