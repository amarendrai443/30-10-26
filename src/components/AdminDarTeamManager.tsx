import React, { useState, useEffect } from 'react';
import {
  DAR_DEPARTMENTS,
  DarDepartment,
  DarStatus,
  DarRecord,
} from '../types/darTeam';
import {
  loadDarRecords,
  updateDarRecord,
  deleteDarRecord,
  loadGoogleSheetsConfig,
  saveGoogleSheetsConfig,
  GoogleSheetsConfig,
  triggerGoogleSheetsAppend,
} from '../utils/darTeamStorage';
import {
  Building2,
  FileSpreadsheet,
  CheckCircle2,
  Clock,
  RotateCw,
  XCircle,
  Search,
  Filter,
  Trash2,
  RefreshCw,
  ExternalLink,
  MapPin,
  Calendar,
  AlertTriangle,
  Database,
  Download,
  Eye,
  X,
  Settings,
  Copy,
  Check,
} from 'lucide-react';

export const AdminDarTeamManager: React.FC = () => {
  const [records, setRecords] = useState<DarRecord[]>([]);
  const [sheetsConfig, setSheetsConfig] = useState<GoogleSheetsConfig>(loadGoogleSheetsConfig());
  const [search, setSearch] = useState('');
  const [deptFilter, setDeptFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedRecord, setSelectedRecord] = useState<DarRecord | null>(null);
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const [isSyncing, setIsSyncing] = useState(false);
  const [copiedUrl, setCopiedUrl] = useState(false);
  const [showConfigModal, setShowConfigModal] = useState(false);
  const [configForm, setConfigForm] = useState<GoogleSheetsConfig>(loadGoogleSheetsConfig());

  useEffect(() => {
    setRecords(loadDarRecords());
    setSheetsConfig(loadGoogleSheetsConfig());
  }, []);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 4000);
  };

  const handleCopyLink = () => {
    try {
      navigator.clipboard.writeText(sheetsConfig.sheetUrl);
      setCopiedUrl(true);
      setTimeout(() => setCopiedUrl(false), 2500);
      showToast('✓ Google Sheet URL copied to clipboard');
    } catch {
      showToast('Sheet URL: ' + sheetsConfig.sheetUrl);
    }
  };

  const handleSaveConfig = (e: React.FormEvent) => {
    e.preventDefault();
    const saved = saveGoogleSheetsConfig(configForm);
    setSheetsConfig(saved);
    setShowConfigModal(false);
    showToast('✓ Google Sheets tracking link and webhook configuration updated');
  };

  const handleStatusChange = (record: DarRecord, newStatus: DarStatus) => {
    let rejectionReason = record.rejectionReason;
    if (newStatus === 'Rejected' && !rejectionReason) {
      const reason = window.prompt('Enter reason for rejection:');
      if (!reason) return;
      rejectionReason = reason;
    }

    const updated = updateDarRecord(record.id, {
      status: newStatus,
      rejectionReason: newStatus === 'Rejected' ? rejectionReason : undefined,
    });
    setRecords(updated);
    if (selectedRecord?.id === record.id) {
      setSelectedRecord(updated.find((r) => r.id === record.id) || null);
    }
    showToast(`Status updated to ${newStatus} for #${record.slNo} (${record.organisationName})`);
  };

  const handleDelete = (id: string, name: string) => {
    if (window.confirm(`Are you sure you want to delete #${name}? This removes it from the local mirror.`)) {
      const updated = deleteDarRecord(id);
      setRecords(updated);
      if (selectedRecord?.id === id) setSelectedRecord(null);
      showToast(`Record removed.`);
    }
  };

  const handleResyncAll = async () => {
    setIsSyncing(true);
    let count = 0;
    for (const r of records) {
      await triggerGoogleSheetsAppend(r);
      count++;
    }
    setIsSyncing(false);
    showToast(`✓ Successfully re-verified and synced ${count} DAR records to Google Sheets`);
  };

  const handleExportCsv = () => {
    if (records.length === 0) {
      alert('No records to export');
      return;
    }
    const headers = [
      'Sl No',
      'Department',
      'Organisation Name',
      'Designation',
      'Person Name',
      'Alternate Number',
      'Status',
      'Rejection Reason',
      'City',
      'State',
      'Pincode',
      'Number of Centers',
      'Location',
      'Address',
      'Remarks',
      'Timestamp',
      'Logged By',
    ];

    const rows = records.map((r) => [
      r.slNo,
      `"${r.department}"`,
      `"${r.organisationName.replace(/"/g, '""')}"`,
      `"${r.designation.replace(/"/g, '""')}"`,
      `"${r.personName.replace(/"/g, '""')}"`,
      `"${r.alternateNumber}"`,
      `"${r.status}"`,
      `"${(r.rejectionReason || '').replace(/"/g, '""')}"`,
      `"${r.city}"`,
      `"${r.state}"`,
      `"${r.pincode}"`,
      `"${r.numberOfCenters}"`,
      `"${r.location.replace(/"/g, '""')}"`,
      `"${r.address.replace(/"/g, '""')}"`,
      `"${r.remarks.replace(/"/g, '""')}"`,
      `"${r.timestamp}"`,
      `"${r.createdByName || ''}"`,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `DAR_Team_Acquisitions_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filtered = records.filter((r) => {
    const matchesDept = deptFilter === 'all' || r.department === deptFilter;
    const matchesStatus = statusFilter === 'all' || r.status === statusFilter;
    const q = search.toLowerCase();
    const matchesSearch =
      !q ||
      r.organisationName.toLowerCase().includes(q) ||
      r.personName.toLowerCase().includes(q) ||
      r.city.toLowerCase().includes(q) ||
      r.department.toLowerCase().includes(q) ||
      r.location.toLowerCase().includes(q);
    return matchesDept && matchesStatus && matchesSearch;
  });

  const getStatusBadge = (status: DarStatus) => {
    switch (status) {
      case 'Accepted':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
            <CheckCircle2 className="w-3.5 h-3.5" /> 2. Accepted
          </span>
        );
      case 'Pending':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-300">
            <Clock className="w-3.5 h-3.5" /> 1. Pending
          </span>
        );
      case 'Recall':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-100 text-blue-800 border border-blue-300">
            <RotateCw className="w-3.5 h-3.5" /> 3. Recall
          </span>
        );
      case 'Rejected':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-100 text-rose-800 border border-rose-300">
            <XCircle className="w-3.5 h-3.5" /> 4. Rejected
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Toast Alert */}
      {toastMsg && (
        <div className="p-4 bg-emerald-600 text-white rounded-xl shadow-lg flex items-center justify-between animate-fade-in text-sm font-medium">
          <span>{toastMsg}</span>
          <button onClick={() => setToastMsg(null)} className="font-bold text-lg leading-none ml-3">
            &times;
          </button>
        </div>
      )}

      {/* Header Bar */}
      <div className="bg-gradient-to-r from-teal-900 via-slate-900 to-[#00223f] text-white p-6 rounded-3xl border border-teal-500/30 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-teal-500/20 text-teal-300 flex items-center justify-center border border-teal-500/30 shrink-0">
            <Database className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-teal-500/20 text-teal-300 border border-teal-400/30">
                Admin Control Panel
              </span>
              <span className="text-xs text-slate-400 font-mono">Google Sheets Double-Write</span>
            </div>
            <h3 className="text-xl font-black text-white mt-0.5">
              Data Acquisition &amp; Research Team (DAR) Master Records
            </h3>
            <p className="text-xs text-slate-300">
              Direct oversight and verification of healthcare provider networks across all 14 operational wings.
            </p>
          </div>
        </div>

        {/* Sync & Export CTA Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={handleExportCsv}
            className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold transition flex items-center gap-1.5 border border-slate-700"
          >
            <Download className="w-4 h-4 text-teal-400" />
            <span>Export CSV</span>
          </button>

          <button
            type="button"
            disabled={isSyncing}
            onClick={handleResyncAll}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-500 hover:to-emerald-500 text-white text-xs font-bold transition flex items-center gap-1.5 shadow-md disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${isSyncing ? 'animate-spin' : ''}`} />
            <span>{isSyncing ? 'Syncing...' : 'Sync to Google Sheets'}</span>
          </button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
            Total Acquisitions
          </span>
          <span className="text-2xl font-black text-slate-900 mt-1 block">{records.length}</span>
          <span className="text-[10px] text-teal-600 font-medium">Across 14 wings</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-[11px] font-bold text-emerald-700 uppercase tracking-wider block">
            Accepted
          </span>
          <span className="text-2xl font-black text-emerald-600 mt-1 block">
            {records.filter((r) => r.status === 'Accepted').length}
          </span>
          <span className="text-[10px] text-slate-500 font-medium">Ready for onboarding</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-[11px] font-bold text-amber-700 uppercase tracking-wider block">
            Pending / Recall
          </span>
          <span className="text-2xl font-black text-amber-600 mt-1 block">
            {records.filter((r) => r.status === 'Pending' || r.status === 'Recall').length}
          </span>
          <span className="text-[10px] text-slate-500 font-medium">In discussion</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-[11px] font-bold text-emerald-700 uppercase tracking-wider block">
            Google Sheets Status
          </span>
          <span className="text-sm font-bold text-slate-800 mt-1.5 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>{sheetsConfig.sheetName}</span>
          </span>
          <span className="text-[10px] text-emerald-600 font-medium">Auto double-write active</span>
        </div>
      </div>

      {/* Live Google Sheet Tracking Banner & Admin Link Mapping */}
      <div className="bg-gradient-to-r from-emerald-950 via-teal-950 to-slate-900 text-white p-5 rounded-2xl border border-emerald-500/40 shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1.5 max-w-2xl">
          <div className="flex items-center gap-2">
            <FileSpreadsheet className="w-5 h-5 text-emerald-400" />
            <span className="font-bold text-sm text-emerald-300">Designated Google Sheet Database</span>
            <span className="text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 px-2 py-0.5 rounded-full font-bold">
              Automated Webhook Active
            </span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            All acquisition submissions across all 14 wings automatically map and append into this connected Google Sheet in real time.
          </p>
          <div className="flex items-center gap-2 pt-1 text-xs">
            <span className="text-slate-400 font-medium shrink-0">Live URL:</span>
            <a
              href={sheetsConfig.sheetUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-emerald-300 hover:text-emerald-200 underline font-mono text-xs truncate max-w-sm sm:max-w-lg"
            >
              {sheetsConfig.sheetUrl}
            </a>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <a
            href={sheetsConfig.sheetUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 rounded-xl text-xs font-black transition flex items-center gap-1.5 shadow-sm"
          >
            <ExternalLink className="w-4 h-4" />
            <span>Open Live Google Sheet</span>
          </a>

          <button
            type="button"
            onClick={handleCopyLink}
            className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-bold transition flex items-center gap-1.5 border border-slate-700 cursor-pointer"
          >
            {copiedUrl ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4 text-teal-400" />}
            <span>{copiedUrl ? 'Copied!' : 'Copy Link'}</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setConfigForm(sheetsConfig);
              setShowConfigModal(true);
            }}
            className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-bold transition flex items-center gap-1.5 border border-slate-700 cursor-pointer"
            title="Configure Sheet URL & Webhook Endpoint"
          >
            <Settings className="w-4 h-4 text-teal-400" />
            <span>Sheet Settings</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          {/* Department Filter */}
          <div className="flex items-center gap-1.5">
            <label className="text-xs font-semibold text-slate-600">Department:</label>
            <select
              value={deptFilter}
              onChange={(e) => setDeptFilter(e.target.value)}
              className="text-xs bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-1.5 text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-teal-500 cursor-pointer"
            >
              <option value="all">All 14 Departments</option>
              {DAR_DEPARTMENTS.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-1.5">
            <label className="text-xs font-semibold text-slate-600">Status:</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="text-xs bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-1.5 text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-teal-500 cursor-pointer"
            >
              <option value="all">All Statuses</option>
              <option value="Pending">1. Pending</option>
              <option value="Accepted">2. Accepted</option>
              <option value="Recall">3. Recall</option>
              <option value="Rejected">4. Rejected</option>
            </select>
          </div>
        </div>

        {/* Search input */}
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search organisation, contact, city..."
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 text-slate-800"
          />
        </div>
      </div>

      {/* Records Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-50 text-slate-700 font-semibold border-b border-slate-200 uppercase tracking-wider text-[11px]">
              <tr>
                <th className="py-3 px-3">Sl. No.</th>
                <th className="py-3 px-3">Department</th>
                <th className="py-3 px-3">Organisation</th>
                <th className="py-3 px-3">Contact Person</th>
                <th className="py-3 px-3">Status / Action</th>
                <th className="py-3 px-3">Location &amp; City</th>
                <th className="py-3 px-3">Centers</th>
                <th className="py-3 px-3">Timestamp</th>
                <th className="py-3 px-3 text-right">Admin Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-10 text-center text-slate-400">
                    No acquisition records found.
                  </td>
                </tr>
              ) : (
                filtered.map((r) => (
                  <tr key={r.id} className="hover:bg-slate-50/80 transition">
                    <td className="py-3 px-3 font-mono font-bold text-teal-800">#{r.slNo}</td>
                    <td className="py-3 px-3">
                      <span className="font-semibold text-slate-800 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                        {r.department}
                      </span>
                    </td>
                    <td className="py-3 px-3">
                      <div className="font-bold text-slate-900">{r.organisationName}</div>
                      <div className="text-[11px] text-slate-500 truncate max-w-xs">{r.address}</div>
                    </td>
                    <td className="py-3 px-3">
                      <div className="font-medium text-slate-800">{r.personName}</div>
                      <div className="text-[11px] text-slate-500">
                        {r.designation} &bull; {r.alternateNumber}
                      </div>
                    </td>
                    <td className="py-3 px-3">
                      {getStatusBadge(r.status)}
                      {r.status === 'Rejected' && r.rejectionReason && (
                        <div className="text-[10px] text-rose-600 mt-1 italic max-w-xs">
                          {r.rejectionReason}
                        </div>
                      )}
                    </td>
                    <td className="py-3 px-3">
                      <div className="text-slate-800 font-medium">{r.location}</div>
                      <div className="text-[11px] text-slate-500">
                        {r.city}, {r.state} - {r.pincode}
                      </div>
                    </td>
                    <td className="py-3 px-3 font-semibold text-slate-700">{r.numberOfCenters || '1'}</td>
                    <td className="py-3 px-3 text-[11px] text-slate-500 whitespace-nowrap">
                      {new Date(r.timestamp).toLocaleDateString()}
                    </td>
                    <td className="py-3 px-3 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          type="button"
                          onClick={() => setSelectedRecord(r)}
                          className="p-1.5 rounded-lg text-slate-600 hover:text-teal-700 hover:bg-teal-50 transition"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>

                        {/* Quick Status Dropdown */}
                        <select
                          value={r.status}
                          onChange={(e) => handleStatusChange(r, e.target.value as DarStatus)}
                          className="text-[11px] border border-slate-300 rounded px-1.5 py-1 bg-white cursor-pointer"
                        >
                          <option value="Pending">Pending</option>
                          <option value="Accepted">Accept</option>
                          <option value="Recall">Recall</option>
                          <option value="Rejected">Reject</option>
                        </select>

                        <button
                          type="button"
                          onClick={() => handleDelete(r.id, r.organisationName)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition"
                          title="Delete Record"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Record Detail Modal */}
      {selectedRecord && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 shadow-2xl border border-slate-200 relative my-auto animate-fade-in text-slate-800">
            <div className="flex items-start justify-between border-b border-slate-200 pb-3 mb-4">
              <div>
                <span className="text-xs font-mono font-bold text-teal-700 bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
                  Sl. No. #{selectedRecord.slNo}
                </span>
                <h3 className="text-lg font-bold text-slate-900 mt-1">
                  {selectedRecord.organisationName}
                </h3>
                <span className="text-xs font-semibold text-slate-500">
                  Department: <strong className="text-slate-800">{selectedRecord.department}</strong>
                </span>
              </div>
              <button
                onClick={() => setSelectedRecord(null)}
                className="text-slate-400 hover:text-slate-700 p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4 text-xs mb-4">
              <div className="p-3 bg-slate-50 rounded-xl">
                <span className="text-slate-500 block">Contact Person</span>
                <span className="font-bold text-slate-800 text-sm">{selectedRecord.personName}</span>
                <span className="text-slate-600 block">{selectedRecord.designation}</span>
                <span className="text-slate-600 font-mono mt-0.5 block">{selectedRecord.alternateNumber}</span>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl">
                <span className="text-slate-500 block">Status &amp; Verification</span>
                <div className="mt-1">{getStatusBadge(selectedRecord.status)}</div>
                {selectedRecord.status === 'Rejected' && selectedRecord.rejectionReason && (
                  <p className="mt-1.5 text-rose-700 font-medium text-[11px] bg-rose-50 p-2 rounded border border-rose-200">
                    Rejection Reason: {selectedRecord.rejectionReason}
                  </p>
                )}
              </div>
            </div>

            <div className="space-y-3 text-xs mb-6">
              <div className="p-3 bg-slate-50 rounded-xl">
                <span className="text-slate-500 block">Location &amp; Address</span>
                <div className="font-semibold text-slate-800">{selectedRecord.location}</div>
                <div className="text-slate-600">{selectedRecord.address}</div>
                <div className="text-slate-500 mt-1">
                  {selectedRecord.city}, {selectedRecord.state} - {selectedRecord.pincode} &bull; Centers:{' '}
                  <strong>{selectedRecord.numberOfCenters}</strong>
                </div>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl">
                <span className="text-slate-500 block">Remarks &amp; Minutes</span>
                <p className="text-slate-700 whitespace-pre-wrap">{selectedRecord.remarks || 'No remarks added.'}</p>
              </div>

              <div className="flex items-center justify-between text-[11px] text-slate-500 pt-2 border-t border-slate-200">
                <span>Submitted by: {selectedRecord.createdByName || 'DAR Team'}</span>
                <span>Date: {new Date(selectedRecord.timestamp).toLocaleString()}</span>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setSelectedRecord(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Admin Google Sheet & Webhook Configuration Modal */}
      {showConfigModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 overflow-y-auto animate-fade-in">
          <div className="bg-[#00172b] text-white rounded-3xl max-w-xl w-full p-6 shadow-2xl border border-teal-500/30 relative my-auto">
            <div className="flex items-center justify-between border-b border-slate-700 pb-3 mb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-teal-500/20 text-teal-400 flex items-center justify-center border border-teal-500/30">
                  <Settings className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">Google Sheet &amp; Webhook Integration</h3>
                  <p className="text-[11px] text-slate-400">Configure tracking sheet and automated row append endpoint</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowConfigModal(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveConfig} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-bold mb-1">
                  Designated Google Sheet URL (View / Edit Link) <span className="text-teal-400">*</span>
                </label>
                <input
                  type="url"
                  required
                  value={configForm.sheetUrl}
                  onChange={(e) => setConfigForm({ ...configForm, sheetUrl: e.target.value })}
                  placeholder="https://docs.google.com/spreadsheets/d/.../edit?usp=sharing"
                  className="w-full px-3 py-2 rounded-xl bg-[#00223f] border border-slate-700 text-white font-mono text-xs focus:ring-2 focus:ring-teal-500 outline-none"
                />
                <span className="text-[10.5px] text-slate-400 mt-1 block">
                  This exact link is displayed in the Admin Dashboard for instant live access and auditing.
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-bold mb-1">Sheet Tab Name</label>
                  <input
                    type="text"
                    required
                    value={configForm.sheetName}
                    onChange={(e) => setConfigForm({ ...configForm, sheetName: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-[#00223f] border border-slate-700 text-white font-mono text-xs focus:ring-2 focus:ring-teal-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-bold mb-1">Google Sheet ID</label>
                  <input
                    type="text"
                    required
                    value={configForm.sheetId}
                    onChange={(e) => setConfigForm({ ...configForm, sheetId: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-[#00223f] border border-slate-700 text-white font-mono text-xs focus:ring-2 focus:ring-teal-500 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">
                  Google Apps Script / Backend Webhook URL <span className="text-teal-400">*</span>
                </label>
                <input
                  type="url"
                  required
                  value={configForm.webhookUrl}
                  onChange={(e) => setConfigForm({ ...configForm, webhookUrl: e.target.value })}
                  placeholder="https://script.google.com/macros/s/.../exec"
                  className="w-full px-3 py-2 rounded-xl bg-[#00223f] border border-slate-700 text-white font-mono text-xs focus:ring-2 focus:ring-teal-500 outline-none"
                />
                <span className="text-[10.5px] text-slate-400 mt-1 block">
                  Receives the automated HTTP POST payload with all form fields upon DAR submission.
                </span>
              </div>

              <div className="p-3 bg-teal-950/40 rounded-xl border border-teal-500/30 text-[11px] text-teal-200 space-y-1">
                <span className="font-bold flex items-center gap-1.5 text-teal-300">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  Automated Append Protocol Active
                </span>
                <p>
                  Every time a DAR team member clicks "Save", a new row is constructed with all 17 fields and instantly dispatched to this endpoint.
                </p>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-700">
                <button
                  type="button"
                  onClick={() => setShowConfigModal(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-gradient-to-r from-teal-500 to-emerald-500 hover:brightness-110 text-slate-950 rounded-xl text-xs font-black shadow-md cursor-pointer"
                >
                  Save Configuration
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
export default AdminDarTeamManager;
