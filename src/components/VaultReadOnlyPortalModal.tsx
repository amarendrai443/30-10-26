import React, { useState } from 'react';
import {
  ShieldCheck,
  Lock,
  Eye,
  X,
  FileText,
  AlertTriangle,
  Stethoscope,
  TestTube2,
  HeartPulse,
  Clock,
  Building2,
  CheckCircle2,
  UserCheck,
  Search,
  Filter,
  Info,
  Ban
} from 'lucide-react';
import { UnifiedVaultRecord, getStoredVaultRecords } from '../utils/vaultRecordsStorage';

interface VaultReadOnlyPortalModalProps {
  isOpen: boolean;
  onClose: () => void;
  patientName: string;
  patientPhone: string;
  patientId: string;
}

export const VaultReadOnlyPortalModal: React.FC<VaultReadOnlyPortalModalProps> = ({
  isOpen,
  onClose,
  patientName,
  patientPhone,
  patientId,
}) => {
  const [records] = useState<UnifiedVaultRecord[]>(() => getStoredVaultRecords(patientId));
  const [selectedRecord, setSelectedRecord] = useState<UnifiedVaultRecord | null>(null);
  const [filterCategory, setFilterCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [blockedNotice, setBlockedNotice] = useState<string | null>(null);

  if (!isOpen) return null;

  const categories = ['All', 'Discharge Summary', 'Lab Report', 'Prescription', 'Vital Lens', 'Clinical Notes'];

  const filteredRecords = records.filter((r) => {
    const matchesCat = filterCategory === 'All' || r.category === filterCategory;
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !q ||
      r.title.toLowerCase().includes(q) ||
      r.summary.toLowerCase().includes(q) ||
      r.issuedBy.toLowerCase().includes(q) ||
      r.facility.toLowerCase().includes(q);
    return matchesCat && matchesSearch;
  });

  const handleProhibitedAction = (actionName: string) => {
    setBlockedNotice(`Permission Denied: "${actionName}" is strictly prohibited by patient privacy policy. This authorized external consultation session is 100% READ-ONLY.`);
    setTimeout(() => setBlockedNotice(null), 4500);
  };

  const activeRecord = selectedRecord || filteredRecords[0];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-5xl max-h-[92vh] flex flex-col overflow-hidden text-slate-800">
        
        {/* Top Header: Clinician Read-Only Security Banner */}
        <div className="bg-gradient-to-r from-[#002b49] via-[#003859] to-[#001f35] text-white p-4 sm:p-5 flex items-center justify-between gap-3 shrink-0 border-b border-cyan-500/20">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-teal-500/20 border border-teal-400/40 flex items-center justify-center text-teal-300 shrink-0">
              <ShieldCheck className="w-6 h-6 text-teal-300" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm sm:text-base font-black tracking-tight text-white">
                  Authorized Clinical Partner Vault Access
                </span>
                <span className="inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Passkey Verified
                </span>
              </div>
              <p className="text-[11px] text-slate-300">
                Patient: <strong className="text-white">{patientName}</strong> • ID: <strong className="font-mono text-cyan-300">{patientId}</strong> • Verified Phone: <strong>{patientPhone}</strong>
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-9 h-9 rounded-xl bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
            title="Close Read-Only Session"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Security & Access Restriction Compliance Notice */}
        <div className="bg-amber-50 border-b border-amber-200/80 px-4 py-2.5 flex items-center justify-between gap-2 shrink-0 text-xs text-amber-900">
          <div className="flex items-center gap-2">
            <Lock className="w-4 h-4 text-amber-700 shrink-0" />
            <span className="font-semibold">
              🔒 STRICT READ-ONLY ENFORCEMENT: Editing, record deletion, and file downloading are disabled to safeguard patient data privacy.
            </span>
          </div>
          <div className="hidden md:flex items-center gap-3 text-[11px] text-amber-700 font-medium">
            <span>ABDM / HIPAA Audited</span>
            <span>•</span>
            <span>Session ID: SES-{Math.floor(100000 + Math.random() * 900000)}</span>
          </div>
        </div>

        {/* Temporary Permission Denied Alert */}
        {blockedNotice && (
          <div className="bg-rose-600 text-white px-4 py-2 text-xs font-bold flex items-center justify-between gap-2 shrink-0 animate-in slide-in-from-top-2">
            <div className="flex items-center gap-2">
              <Ban className="w-4 h-4 text-white shrink-0" />
              <span>{blockedNotice}</span>
            </div>
            <button
              type="button"
              onClick={() => setBlockedNotice(null)}
              className="text-white/80 hover:text-white text-xs font-black"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Main Body: 2-Column Clinical Layout */}
        <div className="flex-1 flex flex-col md:flex-row min-h-0 overflow-hidden">
          
          {/* Left Column: Records Index & Category Filter */}
          <div className="w-full md:w-80 lg:w-96 border-r border-slate-200 flex flex-col shrink-0 bg-slate-50/60">
            {/* Search & Filter Header */}
            <div className="p-3.5 border-b border-slate-200 space-y-2.5">
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Filter vault clinical records..."
                  className="w-full pl-8 pr-3 py-1.5 rounded-xl border border-slate-300 text-xs bg-white focus:outline-none focus:ring-1 focus:ring-[#008080]"
                />
              </div>

              {/* Category Pills */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar text-[11px]">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setFilterCategory(cat)}
                    className={`px-2.5 py-1 rounded-lg font-bold whitespace-nowrap transition-all cursor-pointer ${
                      filterCategory === cat
                        ? 'bg-[#002b49] text-white'
                        : 'bg-white text-slate-600 hover:bg-slate-200 border border-slate-200'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Records List Scrollable */}
            <div className="flex-1 overflow-y-auto p-3 space-y-2">
              {filteredRecords.map((rec) => {
                const isSelected = activeRecord?.id === rec.id;
                return (
                  <button
                    key={rec.id}
                    type="button"
                    onClick={() => setSelectedRecord(rec)}
                    className={`w-full text-left p-3 rounded-2xl border transition-all cursor-pointer flex flex-col gap-1.5 ${
                      isSelected
                        ? 'bg-teal-50/80 border-[#008080] shadow-xs'
                        : 'bg-white border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-1 text-[10px]">
                      <span className="font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-teal-100/70 text-teal-800">
                        {rec.category}
                      </span>
                      <span className="font-mono text-slate-400 font-semibold">{rec.date}</span>
                    </div>

                    <h4 className="font-bold text-xs text-[#002b49] line-clamp-1 leading-snug">
                      {rec.title}
                    </h4>

                    <p className="text-[11px] text-slate-500 line-clamp-1">
                      {rec.facility}
                    </p>
                  </button>
                );
              })}

              {filteredRecords.length === 0 && (
                <div className="p-6 text-center text-xs text-slate-400">
                  No records match your search filter.
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Detailed Clinical Viewer (Strictly Read-Only) */}
          <div className="flex-1 flex flex-col min-h-0 bg-white overflow-y-auto p-4 sm:p-6 space-y-5">
            {activeRecord ? (
              <>
                {/* Active Record Clinical Heading */}
                <div className="pb-4 border-b border-slate-200 flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-teal-50 text-[#008080] border border-teal-200">
                        {activeRecord.documentType}
                      </span>
                      <span className="text-xs font-mono text-slate-400">Ref: {activeRecord.id}</span>
                    </div>
                    <h3 className="text-lg sm:text-xl font-black text-[#002b49] leading-snug">
                      {activeRecord.title}
                    </h3>
                    <p className="text-xs text-slate-500 mt-1">
                      Issued by: <strong className="text-slate-800">{activeRecord.issuedBy}</strong> • {activeRecord.facility}
                    </p>
                  </div>

                  {/* Blocked Controls with Informative Tooltips */}
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={() => handleProhibitedAction('Download Document')}
                      className="px-3 py-1.5 rounded-xl border border-slate-300 text-slate-400 text-xs font-semibold hover:bg-slate-50 transition-colors flex items-center gap-1.5 cursor-not-allowed opacity-70"
                      title="Downloading disabled by patient security policy"
                    >
                      <Lock className="w-3.5 h-3.5 text-slate-400" />
                      <span>Download Disabled</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleProhibitedAction('Edit / Delete')}
                      className="px-3 py-1.5 rounded-xl border border-slate-300 text-slate-400 text-xs font-semibold hover:bg-slate-50 transition-colors flex items-center gap-1.5 cursor-not-allowed opacity-70"
                      title="Editing disabled for read-only vault"
                    >
                      <Ban className="w-3.5 h-3.5 text-slate-400" />
                      <span>Edit Prohibited</span>
                    </button>
                  </div>
                </div>

                {/* Clinical Summary */}
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1">
                  <h5 className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                    Clinical Impression / Summary
                  </h5>
                  <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-medium">
                    {activeRecord.summary}
                  </p>
                </div>

                {/* Diagnoses & Allergies Tags */}
                {activeRecord.clinicalDetails.diagnoses && (
                  <div className="space-y-2">
                    <h5 className="text-[11px] font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                      <Stethoscope className="w-3.5 h-3.5 text-teal-600" />
                      <span>Documented Clinical Diagnoses</span>
                    </h5>
                    <div className="flex flex-wrap gap-2">
                      {activeRecord.clinicalDetails.diagnoses.map((diag, idx) => (
                        <span
                          key={idx}
                          className="px-3 py-1 rounded-xl bg-teal-50 text-[#002b49] border border-teal-200 text-xs font-bold"
                        >
                          {diag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Prescribed Medications Table (if any) */}
                {activeRecord.clinicalDetails.medications && activeRecord.clinicalDetails.medications.length > 0 && (
                  <div className="space-y-2">
                    <h5 className="text-[11px] font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                      <FileText className="w-3.5 h-3.5 text-teal-600" />
                      <span>Active Medications &amp; Dosages</span>
                    </h5>
                    <div className="rounded-2xl border border-slate-200 overflow-hidden">
                      <table className="w-full text-xs text-left">
                        <thead className="bg-slate-100 text-slate-600 font-bold uppercase text-[10px]">
                          <tr>
                            <th className="p-2.5">Medication Name</th>
                            <th className="p-2.5">Dosage</th>
                            <th className="p-2.5">Frequency / Timing</th>
                            <th className="p-2.5">Course Duration</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {activeRecord.clinicalDetails.medications.map((med, idx) => (
                            <tr key={idx} className="hover:bg-slate-50">
                              <td className="p-2.5 font-bold text-[#002b49]">{med.name}</td>
                              <td className="p-2.5 font-mono">{med.dosage}</td>
                              <td className="p-2.5 text-slate-600">{med.frequency}</td>
                              <td className="p-2.5 font-semibold text-teal-700">{med.duration}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {/* Laboratory Parameters (if any) */}
                {activeRecord.clinicalDetails.labParameters && activeRecord.clinicalDetails.labParameters.length > 0 && (
                  <div className="space-y-2">
                    <h5 className="text-[11px] font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                      <TestTube2 className="w-3.5 h-3.5 text-teal-600" />
                      <span>Biomarkers &amp; Lab Parameters</span>
                    </h5>
                    <div className="rounded-2xl border border-slate-200 overflow-hidden">
                      <table className="w-full text-xs text-left">
                        <thead className="bg-slate-100 text-slate-600 font-bold uppercase text-[10px]">
                          <tr>
                            <th className="p-2.5">Test Name</th>
                            <th className="p-2.5">Observed Value</th>
                            <th className="p-2.5">Units</th>
                            <th className="p-2.5">Biological Ref Interval</th>
                            <th className="p-2.5">Status</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {activeRecord.clinicalDetails.labParameters.map((param, idx) => (
                            <tr key={idx} className="hover:bg-slate-50">
                              <td className="p-2.5 font-semibold text-slate-800">{param.test}</td>
                              <td className="p-2.5 font-mono font-bold text-[#002b49]">{param.result}</td>
                              <td className="p-2.5 font-mono text-slate-500">{param.unit}</td>
                              <td className="p-2.5 text-slate-600 font-mono text-[11px]">{param.referenceRange}</td>
                              <td className="p-2.5">
                                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                  param.status === 'Normal'
                                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                    : 'bg-rose-50 text-rose-700 border border-rose-200'
                                }`}>
                                  {param.status}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {/* Clinical Remarks & Attending Notes */}
                {activeRecord.clinicalDetails.doctorRemarks && (
                  <div className="p-4 rounded-2xl bg-teal-50/60 border border-teal-200 space-y-1">
                    <h5 className="text-[11px] font-bold uppercase tracking-wider text-teal-800 flex items-center gap-1.5">
                      <UserCheck className="w-3.5 h-3.5 text-teal-700" />
                      <span>Doctor / Specialist Clinical Remarks</span>
                    </h5>
                    <p className="text-xs text-slate-700 leading-relaxed font-medium">
                      {activeRecord.clinicalDetails.doctorRemarks}
                    </p>
                  </div>
                )}

                {/* Documented Allergies */}
                {activeRecord.clinicalDetails.allergies && activeRecord.clinicalDetails.allergies.length > 0 && (
                  <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 space-y-1">
                    <h5 className="text-[11px] font-black uppercase tracking-wider text-rose-800 flex items-center gap-1.5">
                      <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
                      <span>Drug Sensitivities &amp; Critical Allergies</span>
                    </h5>
                    <div className="flex flex-wrap gap-2 pt-0.5">
                      {activeRecord.clinicalDetails.allergies.map((allergy, idx) => (
                        <span
                          key={idx}
                          className="px-2.5 py-0.5 rounded-lg bg-white border border-rose-300 text-rose-700 text-xs font-bold"
                        >
                          {allergy}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className="h-full flex items-center justify-center text-slate-400 text-xs">
                Select a medical record from the left column to view clinical details.
              </div>
            )}
          </div>
        </div>

        {/* Footer Audit Bar */}
        <div className="bg-slate-100 p-3 sm:p-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500 shrink-0">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-teal-600" />
            <span>Digital Vault Integrity Validated · Zero Data Mutation Allowed</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-full sm:w-auto px-5 py-2 rounded-xl bg-[#002b49] hover:bg-[#00172b] text-white font-bold text-xs cursor-pointer shadow-xs"
          >
            Finish &amp; Close Session
          </button>
        </div>
      </div>
    </div>
  );
};
