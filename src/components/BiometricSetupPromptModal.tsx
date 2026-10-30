import React, { useState } from 'react';
import { Fingerprint, CheckCircle2, ShieldCheck, X, AlertCircle } from 'lucide-react';
import { UserAccount } from '../types/serviceBooking';
import { registerNativeBiometric, setBiometricPromptDismissed } from '../utils/biometricAuthStorage';

interface BiometricSetupPromptModalProps {
  isOpen: boolean;
  user: UserAccount | null;
  onProceed: () => void;
  onDismiss: () => void;
}

export const BiometricSetupPromptModal: React.FC<BiometricSetupPromptModalProps> = ({
  isOpen,
  user,
  onProceed,
  onDismiss,
}) => {
  const [status, setStatus] = useState<'idle' | 'registering' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  if (!isOpen || !user) return null;

  const handleCancel = () => {
    if (user) {
      setBiometricPromptDismissed(user.phone || user.email || user.id);
    }
    onDismiss();
  };

  const handleRegisterBiometric = async () => {
    setStatus('registering');
    setErrorMessage('');

    try {
      const res = await registerNativeBiometric({
        id: user.id,
        name: user.name,
        phone: user.phone,
        email: user.email,
        role: user.role || user.accountType || 'Patient',
      });

      if (res.success) {
        setStatus('success');
        setTimeout(() => {
          onProceed();
        }, 1200);
      } else {
        setStatus('error');
        setErrorMessage(res.error || 'Biometric registration failed. You can set it up anytime later.');
      }
    } catch {
      setStatus('error');
      setErrorMessage('Could not complete biometric enrollment on this device.');
    }
  };

  return (
    <div
      className="fixed inset-0 z-[99999] flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-200"
      onClick={handleCancel}
    >
      <div
        className="bg-white rounded-3xl max-w-sm sm:max-w-md w-full p-6 sm:p-7 shadow-2xl border border-teal-500/30 relative overflow-hidden animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Decorative Top Accent */}
        <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-teal-500 via-cyan-500 to-[#002b49]" />

        {/* Close button */}
        <button
          type="button"
          onClick={handleCancel}
          disabled={status === 'registering'}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 p-1 rounded-full hover:bg-slate-100 transition-colors cursor-pointer"
          aria-label="Close"
        >
          <X className="w-4 h-4" />
        </button>

        {status === 'success' ? (
          <div className="text-center py-4 space-y-3">
            <div className="w-16 h-16 rounded-full bg-teal-50 text-teal-600 border-2 border-teal-200 flex items-center justify-center mx-auto shadow-sm">
              <CheckCircle2 className="w-9 h-9" />
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-[#002b49]">
              Biometric Setup Complete!
            </h3>
            <p className="text-xs sm:text-sm text-slate-600">
              Fingerprint &amp; Face ID recognition enabled for <strong>{user.name}</strong>. Future logins will be instant and secure.
            </p>
          </div>
        ) : (
          <div className="text-center space-y-4">
            {/* Biometric Icon */}
            <div className="w-16 h-16 rounded-full bg-teal-50 text-[#008080] border-2 border-teal-200 flex items-center justify-center mx-auto shadow-sm relative">
              <Fingerprint className={`w-8 h-8 ${status === 'registering' ? 'animate-pulse text-cyan-600' : ''}`} />
              {status === 'registering' && (
                <span className="absolute inset-0 rounded-full border-2 border-cyan-400 animate-ping opacity-75" />
              )}
            </div>

            {/* Title */}
            <div>
              <h3 className="text-lg sm:text-xl font-black text-[#002b49]">
                Setup Login with Biometric?
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 mt-1.5 leading-relaxed">
                Enable instant, secure access with your device&apos;s fingerprint sensor or facial recognition (Touch ID / Face ID / Windows Hello).
              </p>
            </div>

            {/* User Account Info Chip */}
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-left text-xs flex items-center justify-between">
              <div className="truncate mr-2">
                <span className="font-bold text-slate-800 block truncate">{user.name}</span>
                <span className="text-[11px] text-slate-500 font-mono">{user.phone || user.email}</span>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-teal-100 text-teal-800 shrink-0">
                {user.role || user.accountType || 'Active'}
              </span>
            </div>

            {status === 'error' && (
              <div className="p-2.5 bg-red-50 border border-red-200 rounded-xl text-red-700 text-xs flex items-start gap-2 text-left">
                <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Action Buttons: [OK] and [Cancel] */}
            <div className="pt-2 flex items-center gap-3">
              <button
                type="button"
                onClick={handleCancel}
                disabled={status === 'registering'}
                className="flex-1 py-2.5 px-4 rounded-xl border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs sm:text-sm font-bold transition-all cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleRegisterBiometric}
                disabled={status === 'registering'}
                className="flex-1 py-2.5 px-4 rounded-xl bg-gradient-to-r from-[#008080] to-[#006666] hover:from-[#006666] hover:to-[#004d4d] text-white text-xs sm:text-sm font-bold shadow-md hover:shadow-lg transition-all cursor-pointer flex items-center justify-center gap-1.5"
              >
                {status === 'registering' ? (
                  <>
                    <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Verifying...</span>
                  </>
                ) : (
                  <>
                    <ShieldCheck className="w-4 h-4" />
                    <span>OK</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
