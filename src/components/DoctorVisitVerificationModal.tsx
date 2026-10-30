import React, { useState, useEffect } from 'react';
import {
  X,
  MapPin,
  ShieldCheck,
  Smartphone,
  Navigation,
  CheckCircle2,
  AlertTriangle,
  QrCode,
  ScanLine,
  RefreshCw,
  Clock,
  Sparkles,
  ArrowRight,
} from 'lucide-react';
import {
  GpsCoordinates,
  getLiveGpsCoordinates,
  calculateHaversineDistance,
  requestPatientVisitOtp,
  verifyPhysicalDoctorVisit,
  saveVerifiedVisit,
  PROXIMITY_THRESHOLD_METERS,
} from '../utils/gpsVerification';
import { navHistory } from '../utils/navigationHistory';

interface DoctorVisitVerificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  doctorName?: string;
  doctorId?: string;
  defaultToken?: string;
  defaultPatientName?: string;
  defaultPatientPhone?: string;
  defaultPatientCoords?: { latitude: number; longitude: number };
  onVerificationComplete?: () => void;
}

export const DoctorVisitVerificationModal: React.FC<DoctorVisitVerificationModalProps> = ({
  isOpen,
  onClose,
  doctorName = 'Dr. Suresh Reddy (MD)',
  doctorId = 'DOC-8821',
  defaultToken = '',
  defaultPatientName = '',
  defaultPatientPhone = '',
  defaultPatientCoords,
  onVerificationComplete,
}) => {
  const [step, setStep] = useState<'input' | 'otp' | 'success'>('input');
  const [tokenInput, setTokenInput] = useState(defaultToken || 'NHT-DHV-D1-8421');
  const [patientName, setPatientName] = useState(defaultPatientName || 'Ramesh Kumar');
  const [patientPhone, setPatientPhone] = useState(defaultPatientPhone || '9876543210');
  const [patientCoords, setPatientCoords] = useState<GpsCoordinates>(
    defaultPatientCoords || { latitude: 17.43993, longitude: 78.39084 }
  );

  const [doctorCoords, setDoctorCoords] = useState<GpsCoordinates | null>(null);
  const [isLocating, setIsLocating] = useState(false);
  const [generatedOtp, setGeneratedOtp] = useState<string>('');
  const [enteredOtp, setEnteredOtp] = useState<string>('');
  const [errorMsg, setErrorMsg] = useState<string>('');
  const [distanceMeters, setDistanceMeters] = useState<number | null>(null);
  const [isScanningSimulated, setIsScanningSimulated] = useState(false);

  // Register with modal history stack
  useEffect(() => {
    if (!isOpen) return;
    return navHistory.pushModal('doctor-visit-verification', 'Doctor Visit Verification', onClose);
  }, [isOpen, onClose]);

  // Acquire doctor coordinates on mount
  useEffect(() => {
    if (isOpen) {
      fetchDoctorLocation();
    }
  }, [isOpen]);

  const fetchDoctorLocation = async () => {
    setIsLocating(true);
    setErrorMsg('');
    try {
      const coords = await getLiveGpsCoordinates();
      setDoctorCoords(coords);
      const dist = calculateHaversineDistance(
        coords.latitude,
        coords.longitude,
        patientCoords.latitude,
        patientCoords.longitude
      );
      setDistanceMeters(dist);
    } catch {
      setErrorMsg('Unable to retrieve high-precision GPS coordinates.');
    } finally {
      setIsLocating(false);
    }
  };

  const handleSimulateQrScan = () => {
    setIsScanningSimulated(true);
    setTimeout(() => {
      setTokenInput('NHT-DHV-D1-8421');
      setIsScanningSimulated(false);
    }, 700);
  };

  const handleTriggerOtp = () => {
    if (!tokenInput.trim()) {
      setErrorMsg('Please enter or scan a valid Token Number.');
      return;
    }
    setErrorMsg('');
    const otp = requestPatientVisitOtp(tokenInput, patientPhone);
    setGeneratedOtp(otp);
    setStep('otp');
  };

  const handleVerifyOtpAndGps = () => {
    if (!doctorCoords) {
      setErrorMsg('Doctor live GPS is required for physical presence confirmation.');
      return;
    }
    if (enteredOtp.length < 6) {
      setErrorMsg('Please enter the complete 6-digit OTP provided by the patient.');
      return;
    }

    const result = verifyPhysicalDoctorVisit(
      tokenInput,
      enteredOtp,
      doctorCoords,
      patientCoords
    );

    if (!result.success) {
      setErrorMsg(result.message);
      return;
    }

    // Save to verified records
    saveVerifiedVisit({
      id: `REC-VFY-${Math.floor(100 + Math.random() * 900)}`,
      tokenOrRef: tokenInput.toUpperCase().trim(),
      patientName,
      patientPhone,
      patientCoords,
      doctorCoords,
      distanceMeters: result.distanceMeters,
      verifiedAt: `Today, ${result.verifiedAt}`,
      otpUsed: enteredOtp,
      payoutAmount: 1450,
      insurerClaimAmount: 1200,
      settlementStatus: 'Settled',
      doctorName,
      doctorId,
    });

    setStep('success');
    if (onVerificationComplete) {
      onVerificationComplete();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-lg overflow-hidden flex flex-col max-h-[92vh]">
        {/* Modal Header */}
        <div className="bg-[#002b49] px-6 py-4.5 text-white flex items-center justify-between relative shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-teal-500/20 text-teal-300 flex items-center justify-center">
              <Navigation className="w-5 h-5 text-teal-300" />
            </div>
            <div>
              <h3 className="text-base font-bold flex items-center gap-2">
                <span>GPS Physical Presence Verification</span>
                <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
                  Fraud-Proof
                </span>
              </h3>
              <p className="text-xs text-slate-300 font-medium">
                Mandatory Live Geolocation &amp; Patient OTP Audit
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-5 text-slate-700">
          {/* Live GPS Coordinates Cross-Check Card */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-3">
            <div className="flex items-center justify-between border-b border-slate-200/80 pb-2">
              <div className="flex items-center gap-2 text-xs font-bold text-[#002b49]">
                <MapPin className="w-4 h-4 text-[#008080]" />
                <span>Dual Coordinate Cross-Check</span>
              </div>
              <button
                type="button"
                onClick={fetchDoctorLocation}
                disabled={isLocating}
                className="text-[11px] text-[#008080] hover:underline font-semibold flex items-center gap-1 cursor-pointer"
              >
                <RefreshCw className={`w-3 h-3 ${isLocating ? 'animate-spin' : ''}`} />
                <span>{isLocating ? 'Acquiring GPS...' : 'Refresh GPS'}</span>
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-2.5 rounded-xl bg-white border border-slate-200">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">
                  Patient Registered GPS
                </span>
                <span className="font-mono font-bold text-slate-700 block mt-0.5">
                  {patientCoords.latitude.toFixed(5)}° N, {patientCoords.longitude.toFixed(5)}° E
                </span>
                <span className="text-[10px] text-slate-500 mt-0.5 block truncate">
                  {patientName} (Registered Address)
                </span>
              </div>

              <div className="p-2.5 rounded-xl bg-white border border-slate-200">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">
                  Doctor Live Geolocation
                </span>
                <span className="font-mono font-bold text-teal-700 block mt-0.5">
                  {doctorCoords
                    ? `${doctorCoords.latitude.toFixed(5)}° N, ${doctorCoords.longitude.toFixed(5)}° E`
                    : 'Locating...'}
                </span>
                <span className="text-[10px] text-emerald-600 font-semibold mt-0.5 block">
                  {doctorCoords ? `Accuracy: ±${doctorCoords.accuracy}m` : 'Accessing device...'}
                </span>
              </div>
            </div>

            {/* Distance Proximity Indicator */}
            {distanceMeters !== null && (
              <div
                className={`p-2.5 rounded-xl text-xs font-semibold flex items-center justify-between border ${
                  distanceMeters <= PROXIMITY_THRESHOLD_METERS
                    ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                    : 'bg-red-50 text-red-800 border-red-200'
                }`}
              >
                <div className="flex items-center gap-1.5">
                  {distanceMeters <= PROXIMITY_THRESHOLD_METERS ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  ) : (
                    <AlertTriangle className="w-4 h-4 text-red-600 shrink-0" />
                  )}
                  <span>
                    Geodesic Distance: <strong>{distanceMeters} meters</strong>
                  </span>
                </div>
                <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-md bg-white/70">
                  {distanceMeters <= PROXIMITY_THRESHOLD_METERS
                    ? 'Proximity Verified'
                    : 'Distance Alert'}
                </span>
              </div>
            )}
          </div>

          {/* Step 1: Token / QR Input */}
          {step === 'input' && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Patient Daily Token QR / Number
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={tokenInput}
                    onChange={(e) => setTokenInput(e.target.value)}
                    placeholder="e.g. NHT-DHV-D1-8421"
                    className="flex-1 px-3.5 py-2.5 rounded-xl border border-slate-300 font-mono font-bold text-sm focus:outline-none focus:ring-2 focus:ring-[#008080]"
                  />
                  <button
                    type="button"
                    onClick={handleSimulateQrScan}
                    disabled={isScanningSimulated}
                    className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer border border-slate-300"
                    title="Simulate scanning QR code from patient mobile"
                  >
                    <QrCode className="w-4 h-4 text-[#008080]" />
                    <span>{isScanningSimulated ? 'Scanning...' : 'Scan QR'}</span>
                  </button>
                </div>
                <p className="text-[11px] text-slate-400 mt-1">
                  Scan patient&apos;s daily calendar-dated token from their Nhealth app or physical sheet.
                </p>
              </div>

              <div className="p-3 bg-teal-50/70 border border-teal-200/80 rounded-2xl flex items-center justify-between text-xs">
                <div>
                  <span className="text-[10px] font-bold uppercase text-teal-800 block">
                    Patient Details
                  </span>
                  <span className="font-bold text-slate-800">{patientName}</span>
                  <span className="text-slate-500 ml-2 font-mono">
                    +91 {patientPhone.slice(0, 3)}****{patientPhone.slice(-3)}
                  </span>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-teal-100 text-[#008080]">
                  Home Visit Today
                </span>
              </div>

              {errorMsg && (
                <div className="p-3 rounded-xl bg-red-50 text-red-700 border border-red-200 text-xs font-medium flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              <button
                type="button"
                onClick={handleTriggerOtp}
                className="w-full py-3 rounded-2xl bg-[#008080] hover:bg-[#006666] text-white font-bold text-sm transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
              >
                <Smartphone className="w-4 h-4" />
                <span>Dispatch Patient OTP &amp; Continue</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Step 2: Patient OTP Verification */}
          {step === 'otp' && (
            <div className="space-y-4">
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-2xl text-xs text-amber-900 space-y-1">
                <div className="flex items-center gap-1.5 font-bold">
                  <Smartphone className="w-4 h-4 text-amber-600" />
                  <span>OTP Sent to Registered Mobile</span>
                </div>
                <p>
                  A 6-digit authentication code has been sent via SMS to{' '}
                  <strong>+91 {patientPhone.slice(0, 3)}****{patientPhone.slice(-3)}</strong>. Please ask the patient for this code.
                </p>
                {generatedOtp && (
                  <div className="text-[11px] font-mono text-slate-600 pt-1">
                    Demo Simulation Code: <strong className="text-teal-700">{generatedOtp}</strong>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Enter 6-Digit Verification Code
                </label>
                <input
                  type="text"
                  maxLength={6}
                  value={enteredOtp}
                  onChange={(e) => setEnteredOtp(e.target.value.replace(/\D/g, ''))}
                  placeholder="• • • • • •"
                  className="w-full text-center tracking-widest text-2xl font-mono font-black py-3 rounded-2xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#008080]"
                  autoFocus
                />
              </div>

              {errorMsg && (
                <div className="p-3 rounded-xl bg-red-50 text-red-700 border border-red-200 text-xs font-medium flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setStep('input')}
                  className="px-4 py-3 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors cursor-pointer"
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={handleVerifyOtpAndGps}
                  className="flex-1 py-3 rounded-2xl bg-[#008080] hover:bg-[#006666] text-white font-bold text-sm transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>Authenticate Physical Presence</span>
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Success Confirmation */}
          {step === 'success' && (
            <div className="text-center py-4 space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-inner">
                <CheckCircle2 className="w-9 h-9" />
              </div>

              <div>
                <h4 className="text-lg font-black text-[#002b49]">
                  Physical Presence Authenticated!
                </h4>
                <p className="text-xs text-slate-600 max-w-sm mx-auto mt-1">
                  Live GPS proximity ({distanceMeters}m) and patient OTP successfully cross-verified. Fraud-proof visit logged into Nhealth system.
                </p>
              </div>

              <div className="p-3 bg-slate-50 border border-slate-200 rounded-2xl text-left text-xs space-y-1 font-mono">
                <div className="flex justify-between">
                  <span className="text-slate-400">Token Number:</span>
                  <span className="font-bold text-slate-700">{tokenInput}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Patient:</span>
                  <span className="font-bold text-slate-700">{patientName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Geodesic Radius:</span>
                  <span className="font-bold text-emerald-600">{distanceMeters}m (Passed)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Financial Ledger Credit:</span>
                  <span className="font-bold text-teal-700">₹1,450 (Settlement Queued)</span>
                </div>
              </div>

              <button
                type="button"
                onClick={onClose}
                className="w-full py-3 rounded-2xl bg-[#002b49] hover:bg-[#003d66] text-white font-bold text-sm transition-all cursor-pointer shadow-md"
              >
                Close &amp; View Doctor Dashboard
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
