import React, { useState, useMemo } from 'react';
import {
  QrCode,
  Lock,
  Unlock,
  ShieldCheck,
  KeyRound,
  Eye,
  EyeOff,
  CheckCircle2,
  AlertCircle,
  Copy,
  Sparkles,
  Stethoscope,
  X,
  RefreshCw,
  Share2
} from 'lucide-react';
import { generateQrMatrix } from '../utils/secureQrToken';
import {
  getStoredVaultPasskey,
  setStoredVaultPasskey,
  getVaultTokenId,
  getStoredVaultRecords
} from '../utils/vaultRecordsStorage';
import { VaultReadOnlyPortalModal } from './VaultReadOnlyPortalModal';

interface UnifiedVaultQrCardProps {
  patientId: string;
  patientName: string;
  patientPhone: string;
  isDark?: boolean;
}

export const UnifiedVaultQrCard: React.FC<UnifiedVaultQrCardProps> = ({
  patientId,
  patientName,
  patientPhone,
  isDark = false,
}) => {
  // Vault Passkey & Unlock States
  const [passkey, setPasskey] = useState<string>(() => getStoredVaultPasskey(patientId));
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [showUnlockModal, setShowUnlockModal] = useState(false);
  const [showChangePasskeyModal, setShowChangePasskeyModal] = useState(false);
  const [showReadOnlyModal, setShowReadOnlyModal] = useState(false);

  // Input states for Unlock Modal
  const [enteredPasskey, setEnteredPasskey] = useState('');
  const [unlockError, setUnlockError] = useState('');
  const [showEnteredText, setShowEnteredText] = useState(false);

  // Input states for Change Passkey Modal
  const [oldPasskeyInput, setOldPasskeyInput] = useState('');
  const [newPasskeyInput, setNewPasskeyInput] = useState('');
  const [confirmPasskeyInput, setConfirmPasskeyInput] = useState('');
  const [changePasskeyError, setChangePasskeyError] = useState('');
  const [changePasskeySuccess, setChangePasskeySuccess] = useState(false);

  // Feedback states
  const [copiedToken, setCopiedToken] = useState(false);

  const vaultTokenId = useMemo(() => getVaultTokenId(patientId), [patientId]);
  const qrMatrix = useMemo(() => generateQrMatrix(vaultTokenId), [vaultTokenId]);
  const matrixSize = qrMatrix.length;

  const recordsCount = useMemo(() => getStoredVaultRecords(patientId).length, [patientId]);

  // Handle Unlock attempt
  const handleVerifyAndUnlock = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (enteredPasskey.trim() === passkey.trim()) {
      setIsUnlocked(true);
      setShowUnlockModal(false);
      setEnteredPasskey('');
      setUnlockError('');
    } else {
      setUnlockError('Incorrect Passkey. Please verify and try again.');
    }
  };

  // Handle Save New Passkey
  const handleSaveNewPasskey = (e: React.FormEvent) => {
    e.preventDefault();
    setChangePasskeyError('');
    if (oldPasskeyInput.trim() !== passkey.trim()) {
      setChangePasskeyError('Current passkey does not match.');
      return;
    }
    if (newPasskeyInput.trim().length < 4) {
      setChangePasskeyError('New passkey must be at least 4 characters.');
      return;
    }
    if (newPasskeyInput !== confirmPasskeyInput) {
      setChangePasskeyError('New passkeys do not match.');
      return;
    }

    setStoredVaultPasskey(patientId, newPasskeyInput.trim());
    setPasskey(newPasskeyInput.trim());
    setChangePasskeySuccess(true);
    setTimeout(() => {
      setShowChangePasskeyModal(false);
      setChangePasskeySuccess(false);
      setOldPasskeyInput('');
      setNewPasskeyInput('');
      setConfirmPasskeyInput('');
    }, 1500);
  };

  return (
    <>
      {/* Central Unified Medical Vault QR Code Banner */}
      <div
        className={`rounded-3xl border-2 p-5 sm:p-7 shadow-md relative overflow-hidden transition-all ${
          isDark
            ? 'bg-gradient-to-br from-[#00172d] via-[#00223f] to-[#001124] border-cyan-500/50 text-white'
            : 'bg-gradient-to-br from-teal-50/90 via-white to-cyan-50/70 border-teal-500/40 text-slate-800'
        }`}
      >
        {/* Ambient Top Glow */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          {/* Left Side: Information, Security Credentials & Passkey Controls */}
          <div className="space-y-3.5 max-w-xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-teal-500/20 text-[#008080] dark:text-cyan-300 border border-teal-500/30">
                <ShieldCheck className="w-4 h-4 text-teal-600 dark:text-cyan-400" />
                <span>Unified Medical Vault QR Code</span>
              </span>
              <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-slate-200/60 dark:bg-white/10 text-slate-700 dark:text-slate-300 border border-slate-300/60 dark:border-white/10">
                {recordsCount} Clinical Documents Encrypted
              </span>
              {isUnlocked ? (
                <span className="inline-flex items-center gap-1 text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border border-emerald-400/30">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  Unlocked (Active)
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-800 dark:text-amber-300 border border-amber-400/30">
                  <Lock className="w-3 h-3 text-amber-600" />
                  Passkey Protected
                </span>
              )}
            </div>

            <div>
              <h3 className={`text-xl sm:text-2xl font-black tracking-tight ${isDark ? 'text-white' : 'text-[#002b49]'}`}>
                One-Scan Patient Health Vault
              </h3>
              <p className={`text-xs sm:text-sm leading-relaxed mt-1 ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                Present this single, centralized QR code to authorized hospitals, doctors, or clinics. When scanned, it renders a strict <strong>Read-Only View</strong> of your medical history with <strong>zero edit, delete, or download permissions</strong>.
              </p>
            </div>

            {/* Passkey Info Pill & Quick Actions */}
            <div className="flex flex-wrap items-center gap-3 pt-1">
              <div className={`px-3 py-1.5 rounded-xl border text-xs flex items-center gap-2 ${
                isDark ? 'bg-black/30 border-cyan-800/40 text-slate-300' : 'bg-white border-teal-200 text-slate-700'
              }`}>
                <KeyRound className="w-3.5 h-3.5 text-[#008080] dark:text-cyan-400 shrink-0" />
                <span>
                  Vault Passkey: <strong className="font-mono text-[#008080] dark:text-cyan-300">••••</strong>
                </span>
                <button
                  type="button"
                  onClick={() => setShowChangePasskeyModal(true)}
                  className="text-[11px] font-bold text-teal-600 dark:text-cyan-400 hover:underline cursor-pointer ml-1"
                >
                  Change Passkey
                </button>
              </div>

              {isUnlocked && (
                <button
                  type="button"
                  onClick={() => setIsUnlocked(false)}
                  className="px-3 py-1.5 rounded-xl bg-slate-200/80 hover:bg-slate-300 dark:bg-white/10 dark:hover:bg-white/20 text-xs font-bold text-slate-700 dark:text-slate-200 flex items-center gap-1.5 cursor-pointer transition-colors"
                  title="Lock Vault QR Code immediately"
                >
                  <Lock className="w-3.5 h-3.5" />
                  <span>Lock QR</span>
                </button>
              )}

              {/* Action to preview / simulate external doctor read-only scan */}
              <button
                type="button"
                onClick={() => setShowReadOnlyModal(true)}
                className="px-3.5 py-1.5 rounded-xl bg-[#008080] hover:bg-[#006666] text-white text-xs font-bold shadow-xs flex items-center gap-1.5 cursor-pointer transition-all active:scale-95"
                title="Preview external doctor scan view"
              >
                <Stethoscope className="w-3.5 h-3.5 text-teal-200" />
                <span>Preview Doctor Read-Only Scan</span>
              </button>
            </div>

            <div className={`text-[11px] flex items-center gap-1.5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
              <span>Token ID: <strong className="font-mono">{vaultTokenId}</strong> (Includes Prescriptions, Labs &amp; Discharges)</span>
            </div>
          </div>

          {/* Right Side: QR Code Area (Locked vs. Unlocked) */}
          <div className="flex flex-col items-center justify-center shrink-0 self-center lg:self-auto">
            {isUnlocked ? (
              /* UNLOCKED: High-Definition Unified Vault QR Code */
              <div className="bg-white p-4 rounded-3xl shadow-xl border-2 border-teal-500/40 flex flex-col items-center text-center space-y-2 animate-in zoom-in-95 duration-200">
                <div className="p-2 bg-white rounded-2xl border border-slate-100 shadow-inner">
                  <svg
                    viewBox={`0 0 ${matrixSize} ${matrixSize}`}
                    className="w-40 h-40 sm:w-48 sm:h-48"
                    shapeRendering="crispEdges"
                  >
                    <rect width={matrixSize} height={matrixSize} fill="#ffffff" />
                    {qrMatrix.map((row, rIdx) =>
                      row.map((isDarkModule, cIdx) =>
                        isDarkModule ? (
                          <rect
                            key={`${rIdx}-${cIdx}`}
                            x={cIdx}
                            y={rIdx}
                            width="1"
                            height="1"
                            fill="#002b49"
                          />
                        ) : null
                      )
                    )}
                  </svg>
                </div>

                <div className="w-full text-center">
                  <span className="text-[10px] font-black uppercase tracking-wider text-teal-700 bg-teal-50 px-2 py-0.5 rounded-full border border-teal-200">
                    Vault Unlocked
                  </span>
                  <div className="text-[11px] font-mono font-bold text-slate-700 mt-1">
                    {vaultTokenId}
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-1 w-full">
                  <button
                    type="button"
                    onClick={() => {
                      navigator.clipboard?.writeText(vaultTokenId);
                      setCopiedToken(true);
                      setTimeout(() => setCopiedToken(false), 2000);
                    }}
                    className="flex-1 py-1.5 px-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-bold flex items-center justify-center gap-1 cursor-pointer transition-colors"
                  >
                    <Copy className="w-3 h-3 text-[#008080]" />
                    <span>{copiedToken ? 'Copied' : 'Copy Token'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setIsUnlocked(false)}
                    className="py-1.5 px-3 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-800 text-[11px] font-bold flex items-center gap-1 cursor-pointer transition-colors border border-amber-200"
                    title="Lock QR code"
                  >
                    <Lock className="w-3 h-3" />
                    <span>Lock</span>
                  </button>
                </div>
              </div>
            ) : (
              /* LOCKED: Security Vault Shield Card */
              <div
                onClick={() => setShowUnlockModal(true)}
                className="bg-white/95 dark:bg-[#00172d]/90 p-6 rounded-3xl shadow-lg border-2 border-dashed border-teal-500/50 hover:border-teal-500 flex flex-col items-center justify-center text-center w-56 sm:w-64 h-64 sm:h-72 cursor-pointer group transition-all hover:scale-105 active:scale-95"
                title="Click to Unlock Vault QR Code with Passkey"
              >
                <div className="w-16 h-16 rounded-2xl bg-amber-500/15 border border-amber-500/30 text-amber-600 dark:text-amber-400 flex items-center justify-center mb-3 group-hover:bg-amber-500 group-hover:text-white transition-all shadow-sm">
                  <Lock className="w-8 h-8" />
                </div>

                <span className="text-xs font-black uppercase tracking-wider text-[#002b49] dark:text-white">
                  Vault QR Locked
                </span>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 max-w-[180px] leading-snug">
                  Protected with your personal Passkey to safeguard confidential records.
                </p>

                <div className="mt-4 px-4 py-2 rounded-xl bg-[#008080] text-white text-xs font-bold shadow-md flex items-center gap-1.5 group-hover:bg-[#006666]">
                  <Unlock className="w-3.5 h-3.5 text-teal-200" />
                  <span>Enter Passkey to View</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 1. PASSKEY UNLOCK MODAL */}
      {showUnlockModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-sm p-6 text-slate-800 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-teal-500/20 text-[#008080] flex items-center justify-center font-bold">
                  <KeyRound className="w-4 h-4" />
                </div>
                <h4 className="text-base font-black text-[#002b49]">Unlock Vault QR Code</h4>
              </div>
              <button
                type="button"
                onClick={() => {
                  setShowUnlockModal(false);
                  setEnteredPasskey('');
                  setUnlockError('');
                }}
                className="text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              Enter your patient security passkey to decrypt and display your unified records QR code.
            </p>

            <form onSubmit={handleVerifyAndUnlock} className="space-y-3">
              <div className="relative">
                <input
                  type={showEnteredText ? 'text' : 'password'}
                  autoFocus
                  maxLength={12}
                  value={enteredPasskey}
                  onChange={(e) => {
                    setEnteredPasskey(e.target.value);
                    setUnlockError('');
                  }}
                  placeholder="Enter 4-digit passkey..."
                  className="w-full text-center text-lg font-mono font-black tracking-widest px-4 py-3 rounded-2xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#008080] bg-slate-50"
                />
                <button
                  type="button"
                  onClick={() => setShowEnteredText(!showEnteredText)}
                  className="absolute right-3.5 top-3.5 text-slate-400 hover:text-slate-600 cursor-pointer"
                  tabIndex={-1}
                >
                  {showEnteredText ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              {unlockError && (
                <div className="text-xs text-rose-600 font-bold flex items-center gap-1.5">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{unlockError}</span>
                </div>
              )}

              <div className="text-[11px] text-slate-400 text-center">
                Default Passkey: <span className="font-mono font-bold text-slate-600">{passkey}</span>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowUnlockModal(false);
                    setEnteredPasskey('');
                    setUnlockError('');
                  }}
                  className="flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-100 text-xs font-bold transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-[#008080] hover:bg-[#006666] text-white text-xs font-bold shadow-sm transition-all cursor-pointer"
                >
                  Unlock QR Code
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 2. CHANGE / UPDATE PASSKEY MODAL */}
      {showChangePasskeyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-sm p-6 text-slate-800 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-teal-500/20 text-[#008080] flex items-center justify-center font-bold">
                  <KeyRound className="w-4 h-4" />
                </div>
                <h4 className="text-base font-black text-[#002b49]">Update Vault Passkey</h4>
              </div>
              <button
                type="button"
                onClick={() => setShowChangePasskeyModal(false)}
                className="text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {changePasskeySuccess ? (
              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-center space-y-2">
                <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
                <h5 className="text-sm font-bold text-emerald-900">Passkey Updated Successfully!</h5>
                <p className="text-xs text-emerald-700">Your Unified Vault QR code is now secured with your new passkey.</p>
              </div>
            ) : (
              <form onSubmit={handleSaveNewPasskey} className="space-y-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Current Passkey</label>
                  <input
                    type="password"
                    required
                    value={oldPasskeyInput}
                    onChange={(e) => setOldPasskeyInput(e.target.value)}
                    placeholder="Enter current passkey..."
                    className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-1 focus:ring-[#008080]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">New Passkey (min 4 chars)</label>
                  <input
                    type="password"
                    required
                    value={newPasskeyInput}
                    onChange={(e) => setNewPasskeyInput(e.target.value)}
                    placeholder="Enter new 4-digit passkey..."
                    className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-1 focus:ring-[#008080]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Confirm New Passkey</label>
                  <input
                    type="password"
                    required
                    value={confirmPasskeyInput}
                    onChange={(e) => setConfirmPasskeyInput(e.target.value)}
                    placeholder="Re-type new passkey..."
                    className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-1 focus:ring-[#008080]"
                  />
                </div>

                {changePasskeyError && (
                  <div className="text-xs text-rose-600 font-bold flex items-center gap-1.5">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{changePasskeyError}</span>
                  </div>
                )}

                <div className="flex items-center gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowChangePasskeyModal(false)}
                    className="flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-100 text-xs font-bold transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2.5 rounded-xl bg-[#008080] hover:bg-[#006666] text-white text-xs font-bold shadow-sm transition-all cursor-pointer"
                  >
                    Save New Passkey
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* 3. EXTERNAL DOCTOR / HOSPITAL READ-ONLY SCAN VIEW MODAL */}
      <VaultReadOnlyPortalModal
        isOpen={showReadOnlyModal}
        onClose={() => setShowReadOnlyModal(false)}
        patientName={patientName}
        patientPhone={patientPhone}
        patientId={patientId}
      />
    </>
  );
};
