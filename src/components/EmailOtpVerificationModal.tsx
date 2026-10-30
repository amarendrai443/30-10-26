import React, { useState, useEffect } from 'react';
import { Mail, ShieldCheck, RefreshCw, CheckCircle2, AlertCircle, ArrowRight, X, Lock } from 'lucide-react';

interface EmailOtpVerificationModalProps {
  isOpen: boolean;
  email: string;
  userType: 'Patient' | 'Partner';
  generatedOtp: string;
  onVerifySuccess: () => void;
  onResendOtp: () => string; // returns new OTP
  onClose: () => void;
}

export const EmailOtpVerificationModal: React.FC<EmailOtpVerificationModalProps> = ({
  isOpen,
  email,
  userType,
  generatedOtp,
  onVerifySuccess,
  onResendOtp,
  onClose,
}) => {
  const [currentOtp, setCurrentOtp] = useState(generatedOtp);
  const [enteredOtp, setEnteredOtp] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(30);
  const [resendSuccess, setResendSuccess] = useState(false);

  useEffect(() => {
    setCurrentOtp(generatedOtp);
    setEnteredOtp('');
    setErrorMsg('');
    setResendCooldown(30);
  }, [generatedOtp, isOpen]);

  useEffect(() => {
    if (!isOpen || resendCooldown <= 0) return;
    const timer = setInterval(() => {
      setResendCooldown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [isOpen, resendCooldown]);

  if (!isOpen) return null;

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    const cleanInput = enteredOtp.trim();
    if (!cleanInput) {
      setErrorMsg('Please enter the 6-digit verification OTP sent to your email.');
      return;
    }

    if (cleanInput.length !== 6) {
      setErrorMsg('Verification OTP must be 6 digits.');
      return;
    }

    setIsVerifying(true);
    setTimeout(() => {
      setIsVerifying(false);
      // Valid if it matches the current generated OTP, standard demo code, or test bypass
      if (cleanInput === currentOtp || cleanInput === '482910' || cleanInput === '123456') {
        onVerifySuccess();
      } else {
        setErrorMsg('Invalid verification code. Please check your email or click "Resend OTP".');
      }
    }, 450);
  };

  const handleResend = () => {
    if (resendCooldown > 0) return;
    const newCode = onResendOtp();
    setCurrentOtp(newCode);
    setResendCooldown(30);
    setResendSuccess(true);
    setErrorMsg('');
    setTimeout(() => setResendSuccess(false), 4000);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#002b49] via-[#003859] to-[#002b49] p-5 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-teal-500/20 border border-teal-400/30 flex items-center justify-center text-teal-300">
              <Mail className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white leading-tight">Verify Your Email ID</h3>
              <p className="text-xs text-teal-200/90 font-medium">{userType} Registration Security Check</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-5">
          <div className="text-center space-y-1.5">
            <p className="text-xs text-slate-600">
              A 6-digit email verification OTP has been generated and sent to:
            </p>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-100 border border-slate-200 rounded-full text-xs font-mono font-bold text-[#002b49]">
              <Mail className="w-3.5 h-3.5 text-[#008080]" />
              <span className="truncate max-w-[240px]">{email}</span>
            </div>
          </div>

          {/* Simulated Email Dispatch Banner with Demo Code */}
          <div className="p-3 bg-teal-50 border border-teal-200 rounded-xl text-teal-900 text-xs flex items-start gap-2.5">
            <ShieldCheck className="w-4 h-4 text-[#008080] shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="font-bold text-[11px] text-teal-950">Email Dispatch Simulated</p>
              <p className="text-[11px] text-teal-800 mt-0.5">
                Check inbox at <span className="font-semibold">{email}</span>. Demo OTP:{' '}
                <span className="font-mono font-bold bg-teal-100/90 text-teal-900 px-1.5 py-0.5 rounded border border-teal-300">
                  {currentOtp}
                </span>
              </p>
            </div>
          </div>

          {resendSuccess && (
            <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs flex items-center gap-2 animate-in fade-in">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>New verification code sent to your email!</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleVerify} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5 text-center">
                Enter 6-Digit Email OTP <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="text"
                  maxLength={6}
                  autoFocus
                  required
                  placeholder="• • • • • •"
                  value={enteredOtp}
                  onChange={(e) => {
                    setEnteredOtp(e.target.value.replace(/\D/g, ''));
                    setErrorMsg('');
                  }}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 text-center font-mono text-xl tracking-[0.4em] font-bold text-[#002b49] focus:outline-none focus:ring-2 focus:ring-[#008080]"
                />
              </div>
            </div>

            {errorMsg && (
              <p className="text-xs text-red-600 font-medium flex items-center justify-center gap-1.5">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                <span>{errorMsg}</span>
              </p>
            )}

            <button
              type="submit"
              disabled={isVerifying || enteredOtp.length !== 6}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-[#008080] to-[#009b9b] hover:from-[#006666] hover:to-[#008080] disabled:opacity-50 text-white font-bold text-sm shadow-md transition-all active:scale-[0.99] cursor-pointer flex items-center justify-center gap-2"
            >
              <span>{isVerifying ? 'Verifying OTP & Creating Account...' : 'Verify Email & Create Account'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Resend OTP & Options */}
          <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
            <span className="text-slate-500">Didn't receive email code?</span>
            <button
              type="button"
              onClick={handleResend}
              disabled={resendCooldown > 0}
              className={`font-bold flex items-center gap-1 cursor-pointer transition-colors ${
                resendCooldown > 0
                  ? 'text-slate-400 cursor-not-allowed'
                  : 'text-[#008080] hover:text-[#006666] hover:underline'
              }`}
            >
              <RefreshCw className={`w-3 h-3 ${resendCooldown > 0 ? '' : 'hover:rotate-180 transition-transform'}`} />
              <span>{resendCooldown > 0 ? `Resend OTP in ${resendCooldown}s` : 'Resend OTP'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
