import React, { useState } from 'react';
import {
  KeyRound,
  ShieldCheck,
  Smartphone,
  Lock,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  X,
  UserCheck,
  Eye,
  EyeOff,
  RotateCcw
} from 'lucide-react';
import {
  initiateAccountRecovery,
  verifyRecoveryOtp,
  completeAccountReset
} from '../utils/passkeyAuthStorage';

interface AccountRecoveryModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultIdentifier?: string;
  onRecoverySuccess?: (newUsername: string) => void;
}

export const AccountRecoveryModal: React.FC<AccountRecoveryModalProps> = ({
  isOpen,
  onClose,
  defaultIdentifier = '',
  onRecoverySuccess,
}) => {
  const [step, setStep] = useState<'enter_phone' | 'verify_otp' | 'reset_credentials' | 'success'>('enter_phone');
  const [identifier, setIdentifier] = useState(defaultIdentifier);
  const [otp, setOtp] = useState('482910');
  const [newUsername, setNewUsername] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [infoMsg, setInfoMsg] = useState('');

  if (!isOpen) return null;

  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    if (!identifier.trim()) {
      setErrorMsg('Please enter your registered mobile number or email ID.');
      return;
    }
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      const res = initiateAccountRecovery(identifier);
      if (res.success) {
        setOtp(res.otp);
        setInfoMsg(res.message);
        setStep('verify_otp');
      } else {
        setErrorMsg('Unable to initiate recovery. Please check your input.');
      }
    }, 400);
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    if (!otp.trim()) {
      setErrorMsg('Please enter the 6-digit verification code.');
      return;
    }
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      if (verifyRecoveryOtp(otp)) {
        // Pre-fill username if available
        setNewUsername(identifier.includes('@') ? identifier.split('@')[0] : 'Recovered User');
        setStep('reset_credentials');
      } else {
        setErrorMsg('Invalid verification code. Please check and retry.');
      }
    }, 350);
  };

  const handleResetCredentials = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    if (newPassword && newPassword.length < 6) {
      setErrorMsg('New password must be at least 6 characters.');
      return;
    }
    if (newPassword && newPassword !== confirmPassword) {
      setErrorMsg('Passwords do not match.');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      const result = completeAccountReset({
        identifier,
        newUsername: newUsername.trim() || undefined,
        newPassword: newPassword.trim() || undefined,
      });

      if (result.success) {
        setStep('success');
        if (onRecoverySuccess) {
          onRecoverySuccess(newUsername || identifier);
        }
      } else {
        setErrorMsg(result.message);
      }
    }, 450);
  };

  const handleResetModal = () => {
    setStep('enter_phone');
    setIdentifier('');
    setOtp('482910');
    setNewUsername('');
    setNewPassword('');
    setConfirmPassword('');
    setErrorMsg('');
    setInfoMsg('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-md p-6 text-slate-800 space-y-4">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-teal-500/20 text-[#008080] flex items-center justify-center font-bold">
              <KeyRound className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-black text-[#002b49]">
                Account Recovery (Patient &amp; Partner)
              </h3>
              <p className="text-[11px] text-slate-400">
                Secure OTP verification &amp; credentials reset
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleResetModal}
            className="text-slate-400 hover:text-slate-700 cursor-pointer p-1 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step Indicator */}
        <div className="flex items-center justify-between gap-1 text-[11px] font-bold text-slate-400 px-1">
          <span className={step === 'enter_phone' ? 'text-[#008080] font-black' : ''}>1. Enter Mobile</span>
          <span>→</span>
          <span className={step === 'verify_otp' ? 'text-[#008080] font-black' : ''}>2. Verify OTP</span>
          <span>→</span>
          <span className={step === 'reset_credentials' || step === 'success' ? 'text-[#008080] font-black' : ''}>3. Reset Password</span>
        </div>

        {/* Alerts */}
        {errorMsg && (
          <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {infoMsg && step === 'verify_otp' && (
          <div className="p-3 rounded-xl bg-teal-50 border border-teal-200 text-teal-800 text-xs font-medium flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0" />
            <span className="leading-snug">{infoMsg}</span>
          </div>
        )}

        {/* STEP 1: Enter Mobile / Email */}
        {step === 'enter_phone' && (
          <form onSubmit={handleSendOtp} className="space-y-4 pt-1">
            <p className="text-xs text-slate-600 leading-relaxed">
              Enter your registered mobile number or healthcare partner email. We will send a secure one-time verification code (OTP) to verify identity.
            </p>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700">
                Registered Mobile Number / Partner Email <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Smartphone className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="text"
                  required
                  autoFocus
                  placeholder="e.g. 9876543210 or partner@nhealth.in"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#008080]"
                />
              </div>
            </div>

            <div className="flex items-center gap-2 pt-2">
              <button
                type="button"
                onClick={handleResetModal}
                className="flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-100 text-xs font-bold transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="flex-1 py-2.5 rounded-xl bg-[#008080] hover:bg-[#006666] text-white text-xs font-bold shadow-sm transition-all cursor-pointer flex items-center justify-center gap-1.5"
              >
                <span>{isLoading ? 'Sending OTP...' : 'Send Secure OTP'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </form>
        )}

        {/* STEP 2: Verify OTP */}
        {step === 'verify_otp' && (
          <form onSubmit={handleVerifyOtp} className="space-y-4 pt-1">
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700">
                Enter 6-Digit OTP Verification Code <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                maxLength={6}
                autoFocus
                required
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                placeholder="e.g. 482910"
                className="w-full tracking-widest text-center text-lg font-mono font-bold py-2.5 px-4 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#008080] bg-slate-50"
              />
              <p className="text-[11px] text-slate-400 text-center">
                Pre-filled with test recovery code for instant verification.
              </p>
            </div>

            <div className="flex items-center gap-2 pt-2">
              <button
                type="button"
                onClick={() => setStep('enter_phone')}
                className="flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-100 text-xs font-bold transition-colors cursor-pointer"
              >
                Back
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="flex-1 py-2.5 rounded-xl bg-[#008080] hover:bg-[#006666] text-white text-xs font-bold shadow-sm transition-all cursor-pointer flex items-center justify-center gap-1.5"
              >
                <span>{isLoading ? 'Verifying...' : 'Verify OTP'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </form>
        )}

        {/* STEP 3: Reset Username & Password */}
        {step === 'reset_credentials' && (
          <form onSubmit={handleResetCredentials} className="space-y-3 pt-1">
            <p className="text-xs text-slate-600">
              Identity verified! You can now update your display username and configure a new account password.
            </p>

            <div className="space-y-1">
              <label className="block text-[11px] font-bold text-slate-700">Account Username / Display Name</label>
              <input
                type="text"
                value={newUsername}
                onChange={(e) => setNewUsername(e.target.value)}
                placeholder="Enter preferred username..."
                className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs focus:outline-none focus:ring-1 focus:ring-[#008080]"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-[11px] font-bold text-slate-700">New Password (min 6 characters) <span className="text-red-500">*</span></label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Enter new strong password"
                  className="w-full px-3.5 py-2 pr-10 rounded-xl border border-slate-300 text-xs focus:outline-none focus:ring-1 focus:ring-[#008080]"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-2 text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="space-y-1">
              <label className="block text-[11px] font-bold text-slate-700">Confirm New Password <span className="text-red-500">*</span></label>
              <input
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Re-type new password"
                className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs focus:outline-none focus:ring-1 focus:ring-[#008080]"
              />
            </div>

            <div className="flex items-center gap-2 pt-2">
              <button
                type="button"
                onClick={handleResetModal}
                className="flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-100 text-xs font-bold transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="flex-1 py-2.5 rounded-xl bg-[#008080] hover:bg-[#006666] text-white text-xs font-bold shadow-sm transition-all cursor-pointer flex items-center justify-center gap-1.5"
              >
                <span>{isLoading ? 'Saving...' : 'Save & Update Credentials'}</span>
                <CheckCircle2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </form>
        )}

        {/* STEP 4: Success Message */}
        {step === 'success' && (
          <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-center space-y-3">
            <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
            <h4 className="text-base font-black text-emerald-950">Credentials Reset Successfully!</h4>
            <p className="text-xs text-emerald-800 leading-relaxed">
              Your password and username have been securely updated. You can now log into your patient or partner account with your new credentials.
            </p>
            <button
              type="button"
              onClick={handleResetModal}
              className="w-full py-2.5 rounded-xl bg-[#002b49] hover:bg-[#00172b] text-white text-xs font-bold shadow-xs cursor-pointer"
            >
              Back to Login Screen
            </button>
          </div>
        )}

      </div>
    </div>
  );
};
