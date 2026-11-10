import React, { useState, useEffect } from 'react';
import {
  DAR_DEPARTMENTS,
  DarDepartment,
  DarStatus,
  DarRecord,
} from '../types/darTeam';
import {
  loadDarRecords,
  saveDarRecord,
  loadGoogleSheetsConfig,
  GoogleSheetsConfig,
  triggerGoogleSheetsAppend,
} from '../utils/darTeamStorage';
import { StaffAccount } from '../utils/staffAccessStorage';
import {
  Building2,
  FileSpreadsheet,
  CheckCircle2,
  Clock,
  AlertTriangle,
  XCircle,
  RotateCw,
  Search,
  Filter,
  Plus,
  Send,
  Database,
  ExternalLink,
  MapPin,
  Phone,
  User,
  ShieldCheck,
  ChevronDown,
  RefreshCw,
} from 'lucide-react';

interface DarTeamDashboardProps {
  currentUser?: StaffAccount | null;
  onLogout?: () => void;
  onNavigateHome?: () => void;
}

export const DarTeamDashboard: React.FC<DarTeamDashboardProps> = ({
  currentUser,
  onLogout,
  onNavigateHome,
}) => {
  const [selectedDept, setSelectedDept] = useState<DarDepartment>('Doctors');
  const [records, setRecords] = useState<DarRecord[]>([]);
  const [sheetsConfig, setSheetsConfig] = useState<GoogleSheetsConfig>(loadGoogleSheetsConfig());
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccessMsg, setSaveSuccessMsg] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [activeTab, setActiveTab] = useState<'form' | 'submissions'>('form');

  // Form State
  const [formState, setFormState] = useState({
    organisationName: '',
    designation: '',
    personName: '',
    alternateNumber: '',
    status: 'Pending' as DarStatus,
    rejectionReason: '',
    city: '',
    state: '',
    pincode: '',
    numberOfCenters: '',
    location: '',
    address: '',
    remarks: '',
  });

  useEffect(() => {
    setRecords(loadDarRecords());
    setSheetsConfig(loadGoogleSheetsConfig());
  }, []);

  const nextSlNo = records.length > 0 ? Math.max(...records.map((r) => r.slNo)) + 1 : 1;

  const handleInputChange = (field: string, value: string) => {
    setFormState((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formState.organisationName.trim()) {
      alert('Please enter the Organisation Name.');
      return;
    }
    if (formState.status === 'Rejected' && !formState.rejectionReason.trim()) {
      alert('Please provide the Rejection Reason as this record is marked as Rejected.');
      return;
    }

    setIsSaving(true);
    setSaveSuccessMsg(null);

    try {
      const saved = saveDarRecord({
        department: selectedDept,
        organisationName: formState.organisationName.trim(),
        designation: formState.designation.trim() || 'N/A',
        personName: formState.personName.trim() || 'N/A',
        alternateNumber: formState.alternateNumber.trim() || 'N/A',
        status: formState.status,
        rejectionReason: formState.status === 'Rejected' ? formState.rejectionReason.trim() : undefined,
        city: formState.city.trim() || 'N/A',
        state: formState.state.trim() || 'N/A',
        pincode: formState.pincode.trim() || 'N/A',
        numberOfCenters: formState.numberOfCenters.trim() || '1',
        location: formState.location.trim() || 'N/A',
        address: formState.address.trim() || 'N/A',
        remarks: formState.remarks.trim() || 'None',
        createdByName: currentUser?.name || 'DAR Associate',
        createdByEmail: currentUser?.email || 'dar@nhealth.in',
      });

      // Update local view
      const updatedList = loadDarRecords();
      setRecords(updatedList);

      setSaveSuccessMsg(
        `✓ Record #${saved.slNo} saved and synced to Google Sheets (${sheetsConfig.sheetName})`
      );

      // Reset form fields
      setFormState({
        organisationName: '',
        designation: '',
        personName: '',
        alternateNumber: '',
        status: 'Pending',
        rejectionReason: '',
        city: '',
        state: '',
        pincode: '',
        numberOfCenters: '',
        location: '',
        address: '',
        remarks: '',
      });

      setTimeout(() => {
        setSaveSuccessMsg(null);
      }, 5000);
    } catch (err) {
      console.error(err);
      alert('Failed to save record.');
    } finally {
      setIsSaving(false);
    }
  };

  const filteredRecords = records.filter((r) => {
    const matchesDept = activeTab === 'form' ? true : true;
    const matchesQuery =
      r.organisationName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.personName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.department.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === 'all' ? true : r.status === filterStatus;
    return matchesDept && matchesQuery && matchesStatus;
  });

  const getStatusBadge = (status: DarStatus) => {
    switch (status) {
      case 'Accepted':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <CheckCircle2 className="w-3.5 h-3.5" /> 2. Accepted
          </span>
        );
      case 'Pending':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
            <Clock className="w-3.5 h-3.5" /> 1. Pending
          </span>
        );
      case 'Recall':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200">
            <RotateCw className="w-3.5 h-3.5" /> 3. Recall
          </span>
        );
      case 'Rejected':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200">
            <XCircle className="w-3.5 h-3.5" /> 4. Rejected
          </span>
        );
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">
      {/* Top Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-teal-600 to-emerald-500 flex items-center justify-center text-white shadow-md shadow-emerald-500/20 font-bold">
              DAR
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-bold text-slate-900 tracking-tight">
                  Data Acquisition &amp; Research Team
                </h1>
                <span className="text-xs px-2 py-0.5 bg-emerald-100 text-emerald-800 font-medium rounded-full">
                  DAR Workspace
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Healthcare Vendor, Doctor &amp; Facility Onboarding Network
              </p>
            </div>
          </div>

          {/* User info & Actions */}
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-slate-100 rounded-lg text-xs">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="font-medium text-slate-700">
                {currentUser?.name || 'Ananya Deshmukh (DAR Lead)'}
              </span>
              <span className="text-slate-400">|</span>
              <span className="text-slate-500">{currentUser?.email || 'dar@nhealth.in'}</span>
            </div>

            {onNavigateHome && (
              <button
                onClick={onNavigateHome}
                className="text-xs font-medium text-slate-600 hover:text-slate-900 px-3 py-1.5 border border-slate-200 rounded-lg hover:bg-slate-100 transition"
              >
                Public Site
              </button>
            )}

            {onLogout && (
              <button
                onClick={onLogout}
                className="text-xs font-medium text-rose-600 hover:text-rose-700 px-3 py-1.5 border border-rose-200 rounded-lg hover:bg-rose-50 transition"
              >
                Logout
              </button>
            )}
          </div>
        </div>

        {/* Live Google Sheets Connection Bar */}
        <div className="bg-emerald-900 text-emerald-100 px-4 sm:px-6 py-2 text-xs flex flex-wrap items-center justify-between gap-2 border-t border-emerald-800">
          <div className="flex items-center gap-2">
            <FileSpreadsheet className="w-4 h-4 text-emerald-300" />
            <span className="font-semibold text-emerald-200">Google Sheets Sync:</span>
            <span className="bg-emerald-800/80 px-2 py-0.5 rounded text-white font-mono text-[11px]">
              {sheetsConfig.sheetName}
            </span>
            <span className="hidden md:inline text-emerald-300/80">
              (Automated Webhook row-append active)
            </span>
          </div>

          <div className="flex items-center gap-3">
            <a
              href={sheetsConfig.sheetUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-emerald-200 hover:text-white flex items-center gap-1 font-semibold underline text-[11px]"
            >
              <ExternalLink className="w-3 h-3" />
              <span>View Tracking Sheet</span>
            </a>
            <span className="flex items-center gap-1.5 text-emerald-200">
              <Database className="w-3.5 h-3.5" />
              <span>{records.length} Total Records</span>
            </span>
            <span className="bg-emerald-500/20 text-emerald-200 border border-emerald-400/30 px-2 py-0.5 rounded-full flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span> Live Connected
            </span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Navigation Tabs */}
        <div className="flex items-center justify-between border-b border-slate-200 pb-3 mb-6">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('form')}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition flex items-center gap-2 ${
                activeTab === 'form'
                  ? 'bg-teal-700 text-white shadow-sm'
                  : 'text-slate-600 hover:bg-slate-200'
              }`}
            >
              <Plus className="w-4 h-4" /> New Acquisition Entry
            </button>
            <button
              onClick={() => setActiveTab('submissions')}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition flex items-center gap-2 ${
                activeTab === 'submissions'
                  ? 'bg-teal-700 text-white shadow-sm'
                  : 'text-slate-600 hover:bg-slate-200'
              }`}
            >
              <Database className="w-4 h-4" /> All Acquisitions Log ({records.length})
            </button>
          </div>

          <div className="text-xs text-slate-500 hidden sm:block">
            Next Entry Serial No:{' '}
            <span className="font-bold font-mono text-teal-700 bg-teal-50 px-2 py-1 rounded border border-teal-200">
              #{nextSlNo}
            </span>
          </div>
        </div>

        {/* Success Toast */}
        {saveSuccessMsg && (
          <div className="mb-6 p-4 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-900 flex items-center justify-between shadow-sm animate-fade-in">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              <div>
                <p className="font-medium text-sm">{saveSuccessMsg}</p>
                <p className="text-xs text-emerald-700">
                  Data has been backed up locally and instantly appended to the connected Google Sheets database.
                </p>
              </div>
            </div>
            <button
              onClick={() => setSaveSuccessMsg(null)}
              className="text-emerald-700 hover:text-emerald-900 text-sm font-bold ml-4"
            >
              &times;
            </button>
          </div>
        )}

        {/* TAB 1: FORM */}
        {activeTab === 'form' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Form Left/Main Column (2 cols) */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="p-5 bg-gradient-to-r from-teal-50/70 to-emerald-50/70 border-b border-slate-200 flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                      <Building2 className="w-5 h-5 text-teal-600" />
                      Dynamic Data Acquisition Form
                    </h2>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Select target department to load appropriate acquisition parameters
                    </p>
                  </div>

                  {/* DEPARTMENT DROPDOWN */}
                  <div className="flex items-center gap-2">
                    <label className="text-xs font-semibold text-slate-700">Department:</label>
                    <div className="relative">
                      <select
                        value={selectedDept}
                        onChange={(e) => setSelectedDept(e.target.value as DarDepartment)}
                        className="appearance-none bg-white font-semibold text-sm text-teal-900 border-2 border-teal-500 rounded-xl pl-3 pr-8 py-1.5 focus:outline-none focus:ring-2 focus:ring-teal-500 shadow-sm cursor-pointer"
                      >
                        {DAR_DEPARTMENTS.map((dept) => (
                          <option key={dept} value={dept}>
                            {dept}
                          </option>
                        ))}
                      </select>
                      <ChevronDown className="w-4 h-4 text-teal-700 absolute right-2.5 top-2.5 pointer-events-none" />
                    </div>
                  </div>
                </div>

                <form onSubmit={handleSave} className="p-6 space-y-6">
                  {/* Top Meta info */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-xs">
                    <div>
                      <span className="text-slate-500 block">Sl. No. (Auto):</span>
                      <span className="font-bold font-mono text-slate-800 text-sm">#{nextSlNo}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block">Selected Department:</span>
                      <span className="font-bold text-teal-700 text-sm">{selectedDept}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block">Automatic Timestamp:</span>
                      <span className="font-mono text-slate-700 text-xs">
                        {new Date().toLocaleString()}
                      </span>
                    </div>
                  </div>

                  {/* Primary Fields */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Organisation Name */}
                    <div className="md:col-span-2">
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Organisation Name <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={formState.organisationName}
                        onChange={(e) => handleInputChange('organisationName', e.target.value)}
                        placeholder={`e.g. Apex Diagnostics & Imaging, Apollo Hospital, Dr. Mehta Clinic`}
                        className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none"
                      />
                    </div>

                    {/* Person Name */}
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Person Name <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={formState.personName}
                        onChange={(e) => handleInputChange('personName', e.target.value)}
                        placeholder="e.g. Dr. Rajesh Khanna / Rajesh Kumar"
                        className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none"
                      />
                    </div>

                    {/* Designation */}
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Designation
                      </label>
                      <input
                        type="text"
                        value={formState.designation}
                        onChange={(e) => handleInputChange('designation', e.target.value)}
                        placeholder="e.g. Director, Chief Radiologist, Head of Operations"
                        className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none"
                      />
                    </div>

                    {/* Alternate Number */}
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Alternate Number
                      </label>
                      <input
                        type="text"
                        value={formState.alternateNumber}
                        onChange={(e) => handleInputChange('alternateNumber', e.target.value)}
                        placeholder="+91 98450 12345 / 080 2345 6789"
                        className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none"
                      />
                    </div>

                    {/* Status Dropdown */}
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Status / Action <span className="text-rose-500">*</span>
                      </label>
                      <select
                        value={formState.status}
                        onChange={(e) => handleInputChange('status', e.target.value)}
                        className="w-full px-3.5 py-2 text-sm font-medium border border-slate-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none bg-white cursor-pointer"
                      >
                        <option value="Pending">1. Pending</option>
                        <option value="Accepted">2. Accepted</option>
                        <option value="Recall">3. Recall</option>
                        <option value="Rejected">4. Rejected</option>
                      </select>
                    </div>
                  </div>

                  {/* CONDITIONAL REJECTION REASON BOX */}
                  {formState.status === 'Rejected' && (
                    <div className="p-4 bg-rose-50 border-2 border-rose-300 rounded-xl space-y-2 animate-fade-in">
                      <div className="flex items-center gap-2 text-rose-800 text-xs font-bold">
                        <AlertTriangle className="w-4 h-4 text-rose-600" />
                        Rejection Explanation / Note Required:
                      </div>
                      <textarea
                        required
                        rows={2}
                        value={formState.rejectionReason}
                        onChange={(e) => handleInputChange('rejectionReason', e.target.value)}
                        placeholder="State why this organisation or partner was rejected (e.g. refused door-step SLA, failed licensing check, non-compliant fees)..."
                        className="w-full px-3 py-2 text-xs border border-rose-300 rounded-lg focus:ring-2 focus:ring-rose-500 outline-none bg-white text-slate-800"
                      />
                    </div>
                  )}

                  {/* Location & Address fields */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        City
                      </label>
                      <input
                        type="text"
                        value={formState.city}
                        onChange={(e) => handleInputChange('city', e.target.value)}
                        placeholder="e.g. Bengaluru, Delhi, Hyderabad"
                        className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-teal-500 outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        State
                      </label>
                      <input
                        type="text"
                        value={formState.state}
                        onChange={(e) => handleInputChange('state', e.target.value)}
                        placeholder="e.g. Karnataka, Delhi, Maharashtra"
                        className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-teal-500 outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Pincode
                      </label>
                      <input
                        type="text"
                        value={formState.pincode}
                        onChange={(e) => handleInputChange('pincode', e.target.value)}
                        placeholder="e.g. 560034"
                        className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-teal-500 outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Number of Centers Associated (if any)
                      </label>
                      <input
                        type="text"
                        value={formState.numberOfCenters}
                        onChange={(e) => handleInputChange('numberOfCenters', e.target.value)}
                        placeholder="e.g. 1, 5, or 12 branches"
                        className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-teal-500 outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Location / Landmark
                      </label>
                      <input
                        type="text"
                        value={formState.location}
                        onChange={(e) => handleInputChange('location', e.target.value)}
                        placeholder="e.g. Koramangala 4th Block, Near Sony World Signal"
                        className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-teal-500 outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Full Address
                    </label>
                    <textarea
                      rows={2}
                      value={formState.address}
                      onChange={(e) => handleInputChange('address', e.target.value)}
                      placeholder="e.g. Door No. 42, 80 Feet Main Road, Industrial Layout..."
                      className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-teal-500 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Remarks / Meeting Minutes
                    </label>
                    <textarea
                      rows={2}
                      value={formState.remarks}
                      onChange={(e) => handleInputChange('remarks', e.target.value)}
                      placeholder="e.g. Discussion completed with Dr. Verma; agreed for 10% pilot commission; will provide doctor roster on Monday..."
                      className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-teal-500 outline-none"
                    />
                  </div>

                  {/* Actions & Submit */}
                  <div className="pt-4 border-t border-slate-200 flex flex-wrap items-center justify-between gap-4">
                    <div className="flex items-center gap-2 text-xs text-slate-500">
                      <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
                      <span>Direct append to Google Sheets enabled</span>
                    </div>

                    <button
                      type="submit"
                      disabled={isSaving}
                      className="px-6 py-2.5 bg-gradient-to-r from-teal-600 to-emerald-600 text-white font-semibold text-sm rounded-xl shadow-md hover:shadow-lg hover:from-teal-700 hover:to-emerald-700 transition flex items-center gap-2 disabled:opacity-50"
                    >
                      {isSaving ? (
                        <>
                          <RefreshCw className="w-4 h-4 animate-spin" /> Saving &amp; Syncing...
                        </>
                      ) : (
                        <>
                          <Send className="w-4 h-4" /> Save &amp; Sync to Google Sheets
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>

            {/* Right Column: Google Sheets Sync Widget & Recent Acquisitions */}
            <div className="space-y-6">
              {/* Google Sheets Live Panel */}
              <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                    <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
                    Google Sheets Database
                  </h3>
                  <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                    Live Connected
                  </span>
                </div>

                <div className="space-y-2.5 text-xs text-slate-600 mb-4 bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                  <div>
                    <span className="text-slate-400 block text-[10px]">Connected Sheet Name</span>
                    <span className="font-semibold text-slate-800 font-mono">
                      {sheetsConfig.sheetName}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">Sheet ID</span>
                    <span className="font-mono text-slate-700 text-[11px] truncate block">
                      {sheetsConfig.sheetId}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">Sync Protocol</span>
                    <span className="text-emerald-700 font-medium">
                      Immediate Double-Write (Local + Webhook Append)
                    </span>
                  </div>
                </div>

                <div className="text-xs text-slate-500 space-y-1">
                  <p className="flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                    Data backups persist across reloads
                  </p>
                  <p className="flex items-center gap-1.5">
                    <Database className="w-3.5 h-3.5 text-teal-600" />
                    Admins can inspect all entries live
                  </p>
                </div>

                <div className="pt-3 mt-3 border-t border-slate-100">
                  <a
                    href={sheetsConfig.sheetUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 border border-emerald-200"
                  >
                    <ExternalLink className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Open Designated Google Sheet</span>
                  </a>
                </div>
              </div>

              {/* Quick Summary of 14 Departments */}
              <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5">
                <h3 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
                  <Filter className="w-4 h-4 text-teal-600" />
                  Target Departments (14)
                </h3>
                <div className="flex flex-wrap gap-1.5">
                  {DAR_DEPARTMENTS.map((dept) => {
                    const count = records.filter((r) => r.department === dept).length;
                    const isSelected = selectedDept === dept;
                    return (
                      <button
                        key={dept}
                        onClick={() => setSelectedDept(dept)}
                        className={`text-xs px-2.5 py-1 rounded-lg transition flex items-center gap-1.5 ${
                          isSelected
                            ? 'bg-teal-700 text-white font-semibold shadow-sm'
                            : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                        }`}
                      >
                        <span>{dept}</span>
                        <span
                          className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                            isSelected ? 'bg-teal-900 text-white' : 'bg-slate-200 text-slate-600'
                          }`}
                        >
                          {count}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: ALL SUBMISSIONS TABLE */}
        {activeTab === 'submissions' && (
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="p-4 sm:p-5 border-b border-slate-200 bg-slate-50 flex flex-wrap items-center justify-between gap-4">
              <div>
                <h2 className="text-base font-bold text-slate-900">
                  DAR Master Acquisition Records ({filteredRecords.length})
                </h2>
                <p className="text-xs text-slate-500">
                  Full registry synced with Google Sheets database
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                {/* Search */}
                <div className="relative">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search org, person, city..."
                    className="pl-8 pr-3 py-1.5 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none w-48 sm:w-60 bg-white"
                  />
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
                </div>

                {/* Filter */}
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="px-2.5 py-1.5 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none bg-white cursor-pointer"
                >
                  <option value="all">All Statuses</option>
                  <option value="Pending">Pending</option>
                  <option value="Accepted">Accepted</option>
                  <option value="Recall">Recall</option>
                  <option value="Rejected">Rejected</option>
                </select>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-600">
                <thead className="bg-slate-100 text-slate-700 font-semibold border-b border-slate-200 uppercase tracking-wider text-[11px]">
                  <tr>
                    <th className="py-3 px-3">Sl. No.</th>
                    <th className="py-3 px-3">Department</th>
                    <th className="py-3 px-3">Organisation</th>
                    <th className="py-3 px-3">Contact Person</th>
                    <th className="py-3 px-3">Status</th>
                    <th className="py-3 px-3">Location &amp; City</th>
                    <th className="py-3 px-3">Centers</th>
                    <th className="py-3 px-3">Timestamp</th>
                    <th className="py-3 px-3">Sheets Sync</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {filteredRecords.length === 0 ? (
                    <tr>
                      <td colSpan={9} className="py-8 text-center text-slate-400 text-xs">
                        No acquisitions found matching criteria.
                      </td>
                    </tr>
                  ) : (
                    filteredRecords.map((r) => (
                      <tr key={r.id} className="hover:bg-slate-50 transition">
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
                              Reason: {r.rejectionReason}
                            </div>
                          )}
                        </td>
                        <td className="py-3 px-3">
                          <div className="text-slate-800 font-medium">{r.location}</div>
                          <div className="text-[11px] text-slate-500">
                            {r.city}, {r.state} - {r.pincode}
                          </div>
                        </td>
                        <td className="py-3 px-3 font-semibold text-slate-700">
                          {r.numberOfCenters || '1'}
                        </td>
                        <td className="py-3 px-3 text-[11px] text-slate-500 whitespace-nowrap">
                          {new Date(r.timestamp).toLocaleDateString()}
                          <br />
                          {new Date(r.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </td>
                        <td className="py-3 px-3">
                          <span className="inline-flex items-center gap-1 text-[11px] text-emerald-700 font-medium bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Synced
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};
export default DarTeamDashboard;
