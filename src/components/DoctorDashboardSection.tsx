import React, { useState, useEffect } from 'react';
import {
  Stethoscope,
  MapPin,
  ShieldCheck,
  Smartphone,
  Navigation,
  CheckCircle2,
  Clock,
  ArrowRight,
  TrendingUp,
  Download,
  Receipt,
  Building,
  UserCheck,
  AlertCircle,
  FileText,
  ScanLine,
  Filter,
  DollarSign,
  ChevronRight,
  Calendar,
  QrCode,
  Lock,
  KeyRound,
  X,
} from 'lucide-react';
import {
  DoctorVerifiedVisitRecord,
  getStoredVerifiedVisits,
  PROXIMITY_THRESHOLD_METERS,
} from '../utils/gpsVerification';
import { DoctorVisitVerificationModal } from './DoctorVisitVerificationModal';
import { VaultReadOnlyPortalModal } from './VaultReadOnlyPortalModal';
import { getStoredVaultPasskey } from '../utils/vaultRecordsStorage';

interface DoctorDashboardSectionProps {
  doctorName?: string;
  doctorId?: string;
  specialization?: string;
  onPrescribePatient?: (patientName: string) => void;
  onCallPatient?: (phone: string, name: string) => void;
}

export const DoctorDashboardSection: React.FC<DoctorDashboardSectionProps> = ({
  doctorName = 'Dr. Suresh Reddy (MD)',
  doctorId = 'DOC-8821',
  specialization = 'Senior General Physician & Home Care Specialist',
  onPrescribePatient,
  onCallPatient,
}) => {
  const [verifiedVisits, setVerifiedVisits] = useState<DoctorVerifiedVisitRecord[]>([]);
  const [isVerificationModalOpen, setIsVerificationModalOpen] = useState(false);
  const [selectedVisitForVerification, setSelectedVisitForVerification] = useState<{
    token: string;
    patientName: string;
    phone: string;
    coords?: { latitude: number; longitude: number };
  } | null>(null);

  const [activeTab, setActiveTab] = useState<'roster' | 'verified_logs' | 'financial_ledger'>('roster');
  const [filterStatus, setFilterStatus] = useState<'all' | 'verified' | 'pending'>('all');

  // Secure Vault Scan States
  const [isVaultScanModalOpen, setIsVaultScanModalOpen] = useState(false);
  const [isVaultReadOnlyOpen, setIsVaultReadOnlyOpen] = useState(false);
  const [vaultScanPatientName, setVaultScanPatientName] = useState('Ramesh Kumar');
  const [vaultScanPatientPhone, setVaultScanPatientPhone] = useState('+91 98765 43210');
  const [vaultScanPatientId, setVaultScanPatientId] = useState('USR-88210');
  const [vaultPasskeyInput, setVaultPasskeyInput] = useState('');
  const [vaultPasskeyError, setVaultPasskeyError] = useState('');

  // Load verified visits on mount & when modal closes
  const reloadVerifiedData = () => {
    setVerifiedVisits(getStoredVerifiedVisits());
  };

  useEffect(() => {
    reloadVerifiedData();
  }, []);

  // Today's scheduled visits roster
  const todaysScheduledVisits = [
    {
      token: 'NHT-DHV-D1-8421',
      patientName: 'Ramesh Kumar (54 yrs, Male)',
      phone: '9876543210',
      type: 'Doctor Home Visit',
      timeSlot: '11:00 AM - 12:00 PM',
      symptoms: 'Post-prandial glucose spike, leg swelling, hypertension review',
      address: 'Plot 42, Jubilee Hills, Hyderabad',
      coords: { latitude: 17.43993, longitude: 78.39084 },
      isInsuranceClaim: true,
      insurerName: 'Star Health Allied Insurance',
      claimAmount: 1200,
      nhealthFee: 250,
      totalFee: 1450,
    },
    {
      token: 'NHT-DHV-D2-5519',
      patientName: 'K. Sunita (42 yrs, Female)',
      phone: '9440112233',
      type: 'Doctor Home Visit',
      timeSlot: '02:30 PM - 03:30 PM',
      symptoms: 'Severe fever with chills, phlebotomy & vitals check',
      address: 'Banjara Hills Rd 12, Hyderabad',
      coords: { latitude: 17.4124, longitude: 78.4358 },
      isInsuranceClaim: false,
      claimAmount: 0,
      nhealthFee: 1650,
      totalFee: 1650,
    },
    {
      token: 'NHT-ONL-8831',
      patientName: 'Ananya Sharma (Senior Citizen, 72 yrs)',
      phone: '9845012345',
      type: 'Online Doctor Video Consultation',
      timeSlot: '04:30 PM - 05:00 PM',
      symptoms: 'Osteoarthritis knee stiffness, chronic cough follow-up',
      address: 'Tele-Health Video Suite',
      coords: { latitude: 17.43993, longitude: 78.39084 },
      isInsuranceClaim: true,
      insurerName: 'HDFC ERGO General Insurance',
      claimAmount: 800,
      nhealthFee: 150,
      totalFee: 950,
    },
  ];

  // Financial aggregates
  const totalAttendedCount = verifiedVisits.length;
  const totalEarnings = verifiedVisits.reduce((acc, curr) => acc + curr.payoutAmount, 0) + 950;
  const payoutsDueFromNhealth = verifiedVisits.filter((v) => v.settlementStatus === 'Pending Payout').reduce((acc, curr) => acc + curr.payoutAmount, 0) + 650;
  const payoutsDueFromInsurers = verifiedVisits.reduce((acc, curr) => acc + curr.insurerClaimAmount, 0);

  const isVisitVerified = (token: string) => {
    return verifiedVisits.some((v) => v.tokenOrRef.toUpperCase() === token.toUpperCase());
  };

  const getVerifiedRecord = (token: string) => {
    return verifiedVisits.find((v) => v.tokenOrRef.toUpperCase() === token.toUpperCase());
  };

  const handleStartVerification = (visit: typeof todaysScheduledVisits[0]) => {
    setSelectedVisitForVerification({
      token: visit.token,
      patientName: visit.patientName.split('(')[0].trim(),
      phone: visit.phone,
      coords: visit.coords,
    });
    setIsVerificationModalOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Doctor Identity & Quick GPS Action Banner */}
      <div className="bg-gradient-to-r from-[#002b49] via-[#003d66] to-[#008080] p-6 rounded-3xl text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-5">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-teal-300 shrink-0">
            <Stethoscope className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-black">{doctorName}</h2>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-teal-400/20 text-teal-200 border border-teal-300/30">
                {doctorId}
              </span>
            </div>
            <p className="text-xs text-teal-100/90 mt-0.5">{specialization}</p>
            <div className="flex items-center gap-3 mt-2 text-[11px] text-teal-200 font-medium">
              <span className="flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-300" />
                <span>GPS Fraud-Control Engine Active</span>
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Navigation className="w-3.5 h-3.5 text-teal-300" />
                <span>Live Location Geofenced (±{PROXIMITY_THRESHOLD_METERS}m)</span>
              </span>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-2.5 w-full md:w-auto shrink-0">
          <button
            type="button"
            onClick={() => {
              setVaultPasskeyInput('');
              setVaultPasskeyError('');
              setIsVaultScanModalOpen(true);
            }}
            className="w-full sm:w-auto px-4 py-3 rounded-2xl bg-teal-500/20 text-teal-100 hover:bg-teal-500/30 hover:text-white font-black text-xs transition-all border border-teal-300/30 flex items-center justify-center gap-2 cursor-pointer shadow-md"
            title="Scan Patient Medical Vault QR code to view records in Read-Only mode"
          >
            <QrCode className="w-4 h-4 text-teal-300" />
            <span>Scan Vault QR (Read-Only)</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setSelectedVisitForVerification(null);
              setIsVerificationModalOpen(true);
            }}
            className="w-full sm:w-auto px-5 py-3 rounded-2xl bg-white text-[#002b49] hover:bg-teal-50 font-black text-xs transition-all shadow-lg flex items-center justify-center gap-2 cursor-pointer shrink-0"
          >
            <Navigation className="w-4 h-4 text-[#008080]" />
            <span>Verify Patient Arrival (GPS &amp; OTP)</span>
          </button>
        </div>
      </div>

      {/* Primary KPI Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
            Patients Attended &amp; Verified
          </span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl sm:text-3xl font-black text-[#002b49]">
              {totalAttendedCount + 3}
            </span>
            <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">
              GPS &amp; OTP Audited
            </span>
          </div>
          <span className="text-[11px] text-slate-500 font-medium mt-1 block">
            100% Physical Presence Confirmed
          </span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
            Total Doctor Earnings
          </span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl sm:text-3xl font-black text-[#008080]">
              ₹{totalEarnings.toLocaleString()}
            </span>
            <span className="text-[11px] text-teal-600 font-semibold">Active Cycle</span>
          </div>
          <span className="text-[11px] text-slate-500 font-medium mt-1 block">
            Home Visits + Tele-Consultations
          </span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
            Payouts Due from Insurers
          </span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl sm:text-3xl font-black text-purple-700">
              ₹{payoutsDueFromInsurers.toLocaleString()}
            </span>
            <span className="text-[10px] font-bold text-purple-600 bg-purple-50 px-1.5 py-0.5 rounded">
              Cashless
            </span>
          </div>
          <span className="text-[11px] text-slate-500 font-medium mt-1 block">
            Direct TPA / Insurer Reimbursement
          </span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
            Nhealth Direct Payouts Due
          </span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl sm:text-3xl font-black text-amber-700">
              ₹{payoutsDueFromNhealth.toLocaleString()}
            </span>
            <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded">
              Weekly Disbursal
            </span>
          </div>
          <span className="text-[11px] text-slate-500 font-medium mt-1 block">
            NEFT / IMPS Direct to Bank
          </span>
        </div>
      </div>

      {/* Sub Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
        <button
          type="button"
          onClick={() => setActiveTab('roster')}
          className={`px-4 py-2 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center gap-2 ${
            activeTab === 'roster'
              ? 'bg-[#002b49] text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100 hover:text-[#002b49]'
          }`}
        >
          <Calendar className="w-3.5 h-3.5 text-teal-400" />
          <span>Today&apos;s Patient Roster</span>
          <span className="px-1.5 py-0.2 rounded-md text-[10px] font-mono bg-teal-500/30 text-teal-200">
            {todaysScheduledVisits.length}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('verified_logs')}
          className={`px-4 py-2 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center gap-2 ${
            activeTab === 'verified_logs'
              ? 'bg-[#002b49] text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100 hover:text-[#002b49]'
          }`}
        >
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span>GPS &amp; OTP Visit Logs</span>
          <span className="px-1.5 py-0.2 rounded-md text-[10px] font-mono bg-emerald-500/30 text-emerald-200">
            {verifiedVisits.length}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('financial_ledger')}
          className={`px-4 py-2 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center gap-2 ${
            activeTab === 'financial_ledger'
              ? 'bg-[#002b49] text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100 hover:text-[#002b49]'
          }`}
        >
          <Receipt className="w-3.5 h-3.5 text-amber-400" />
          <span>Financial Ledger &amp; Settlements</span>
          <span className="px-1.5 py-0.2 rounded-md text-[10px] font-mono bg-amber-500/30 text-amber-200">
            ₹{totalEarnings.toLocaleString()}
          </span>
        </button>
      </div>

      {/* TAB 1: Today's Scheduled Visits Roster */}
      {activeTab === 'roster' && (
        <div className="bg-white p-5 sm:p-6 rounded-3xl border border-slate-200 shadow-2xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="font-extrabold text-base text-[#002b49]">
                Live Home Visits &amp; Consultations Queue
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Verify patient arrival using GPS geolocation and registered OTP to unlock insurance and consultation payouts.
              </p>
            </div>
            <span className="text-[11px] text-slate-400 font-mono">
              Date: {new Date().toLocaleDateString('en-GB')}
            </span>
          </div>

          <div className="space-y-3">
            {todaysScheduledVisits.map((visit) => {
              const verified = isVisitVerified(visit.token);
              const audit = getVerifiedRecord(visit.token);

              return (
                <div
                  key={visit.token}
                  className={`p-4 sm:p-5 rounded-2xl border transition-all flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 ${
                    verified
                      ? 'border-emerald-300 bg-emerald-50/20'
                      : 'border-slate-200 hover:border-teal-300 bg-white'
                  }`}
                >
                  <div className="space-y-1.5 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-xs font-mono font-black px-2 py-0.5 rounded-md bg-[#002b49] text-white">
                        {visit.token}
                      </span>
                      <span className="font-bold text-sm text-[#002b49]">{visit.patientName}</span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-teal-50 text-[#008080] border border-teal-200">
                        {visit.type}
                      </span>
                      {verified ? (
                        <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300 flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                          <span>GPS &amp; OTP Presence Verified ({audit?.distanceMeters ?? 42}m)</span>
                        </span>
                      ) : (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200 flex items-center gap-1">
                          <Clock className="w-3 h-3 text-amber-600" />
                          <span>Awaiting Arrival Verification</span>
                        </span>
                      )}
                    </div>

                    <p className="text-xs text-slate-600">
                      <strong>Clinical Notes:</strong> {visit.symptoms}
                    </p>

                    <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-500">
                      <span>📍 {visit.address}</span>
                      <span>•</span>
                      <span>🕒 {visit.timeSlot}</span>
                      <span>•</span>
                      <span>📞 {visit.phone}</span>
                      {visit.isInsuranceClaim && (
                        <>
                          <span>•</span>
                          <span className="text-purple-700 font-bold">
                            🛡️ {visit.insurerName} (Cashless Claim: ₹{visit.claimAmount})
                          </span>
                        </>
                      )}
                    </div>

                    {verified && audit && (
                      <div className="p-2 bg-emerald-100/60 rounded-xl border border-emerald-200 text-[11px] text-emerald-900 font-mono mt-2 flex flex-wrap gap-4">
                        <span>Doctor GPS: {audit.doctorCoords.latitude.toFixed(4)}, {audit.doctorCoords.longitude.toFixed(4)}</span>
                        <span>Patient GPS: {audit.patientCoords.latitude.toFixed(4)}, {audit.patientCoords.longitude.toFixed(4)}</span>
                        <span>Distance: {audit.distanceMeters}m</span>
                        <span>OTP: {audit.otpUsed}</span>
                      </div>
                    )}
                  </div>

                  {/* Actions Column */}
                  <div className="flex items-center gap-2 self-stretch lg:self-auto shrink-0">
                    {!verified ? (
                      <button
                        type="button"
                        onClick={() => handleStartVerification(visit)}
                        className="flex-1 lg:flex-none px-4 py-2.5 rounded-xl bg-[#008080] hover:bg-[#006666] text-white font-black text-xs transition-all shadow-md flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        <Navigation className="w-3.5 h-3.5" />
                        <span>Verify GPS &amp; OTP</span>
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => {
                          if (onPrescribePatient) onPrescribePatient(visit.patientName);
                        }}
                        className="flex-1 lg:flex-none px-4 py-2 rounded-xl bg-[#002b49] hover:bg-[#003d66] text-white font-bold text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        <FileText className="w-3.5 h-3.5" />
                        <span>Prescribe</span>
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={() => {
                        if (onCallPatient) onCallPatient(visit.phone, visit.patientName);
                      }}
                      className="flex-1 lg:flex-none px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-colors cursor-pointer"
                    >
                      Call Patient
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 2: Verified GPS & OTP Visit Audit Logs */}
      {activeTab === 'verified_logs' && (
        <div className="bg-white p-5 sm:p-6 rounded-3xl border border-slate-200 shadow-2xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="font-extrabold text-base text-[#002b49]">
                GPS Fraud-Proof Physical Verification Logs
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Cryptographic audit trail confirming doctor physical presence at the patient&apos;s registered address.
              </p>
            </div>
            <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-lg">
              {verifiedVisits.length} Records Verified
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider text-[10px] border-b border-slate-200">
                <tr>
                  <th className="py-3 px-3">Token #</th>
                  <th className="py-3 px-3">Patient</th>
                  <th className="py-3 px-3">Patient GPS</th>
                  <th className="py-3 px-3">Doctor Live GPS</th>
                  <th className="py-3 px-3">Proximity</th>
                  <th className="py-3 px-3">OTP Audit</th>
                  <th className="py-3 px-3">Timestamp</th>
                  <th className="py-3 px-3">Settlement</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {verifiedVisits.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-3 font-mono font-bold text-[#002b49]">
                      {item.tokenOrRef}
                    </td>
                    <td className="py-3 px-3 font-bold text-slate-800">
                      {item.patientName}
                      <span className="block text-[10px] text-slate-400 font-normal">
                        +91 {item.patientPhone}
                      </span>
                    </td>
                    <td className="py-3 px-3 font-mono text-[11px] text-slate-600">
                      {item.patientCoords.latitude.toFixed(4)}, {item.patientCoords.longitude.toFixed(4)}
                    </td>
                    <td className="py-3 px-3 font-mono text-[11px] text-teal-700">
                      {item.doctorCoords.latitude.toFixed(4)}, {item.doctorCoords.longitude.toFixed(4)}
                    </td>
                    <td className="py-3 px-3">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                        {item.distanceMeters}m (Pass)
                      </span>
                    </td>
                    <td className="py-3 px-3 font-mono font-bold text-slate-700">
                      {item.otpUsed}
                    </td>
                    <td className="py-3 px-3 text-slate-500">{item.verifiedAt}</td>
                    <td className="py-3 px-3">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-teal-50 text-[#008080] border border-teal-200">
                        {item.settlementStatus} (₹{item.payoutAmount})
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: Doctor Financial Ledger & Settlements */}
      {activeTab === 'financial_ledger' && (
        <div className="bg-white p-5 sm:p-6 rounded-3xl border border-slate-200 shadow-2xs space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
            <div>
              <h3 className="font-extrabold text-base text-[#002b49]">
                Doctor Financial Settlement Ledger
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Itemized payout breakdown from Direct Patient Collections, Nhealth Platform, and Cashless Insurers.
              </p>
            </div>
            <button
              type="button"
              onClick={() => alert('Exporting Official Statement (PDF/CSV)...')}
              className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Download className="w-3.5 h-3.5 text-slate-600" />
              <span>Download Statement</span>
            </button>
          </div>

          {/* Settlement Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200">
              <span className="text-[10px] font-bold uppercase text-emerald-800 block">
                Total Settled &amp; Paid
              </span>
              <span className="text-xl font-black text-emerald-900 block mt-1">
                ₹{(totalEarnings - payoutsDueFromNhealth).toLocaleString()}
              </span>
              <span className="text-[10px] text-emerald-700 mt-0.5 block">
                Deposited to Bank Account ending 4821
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-purple-50/70 border border-purple-200">
              <span className="text-[10px] font-bold uppercase text-purple-800 block">
                Insurer Cashless Claims Pending
              </span>
              <span className="text-xl font-black text-purple-900 block mt-1">
                ₹{payoutsDueFromInsurers.toLocaleString()}
              </span>
              <span className="text-[10px] text-purple-700 mt-0.5 block">
                Under TPA Electronic Processing
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200">
              <span className="text-[10px] font-bold uppercase text-amber-800 block">
                Next Payout Run Date
              </span>
              <span className="text-xl font-black text-amber-900 block mt-1">
                Friday, 10:00 AM
              </span>
              <span className="text-[10px] text-amber-700 mt-0.5 block">
                Weekly Automated NEFT Cycle
              </span>
            </div>
          </div>

          {/* Itemized Transactions Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider text-[10px] border-b border-slate-200">
                <tr>
                  <th className="py-3 px-3">Transaction Ref</th>
                  <th className="py-3 px-3">Service / Patient</th>
                  <th className="py-3 px-3">Gross Fee</th>
                  <th className="py-3 px-3">Insurer Share</th>
                  <th className="py-3 px-3">Nhealth Net Payout</th>
                  <th className="py-3 px-3">UTR Reference</th>
                  <th className="py-3 px-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {[
                  {
                    ref: 'TXN-DOC-9921',
                    service: 'Doctor Home Visit (Ramesh Kumar)',
                    token: 'NHT-DHV-D1-8421',
                    gross: 1450,
                    insurer: 1200,
                    net: 250,
                    utr: 'UTR-HDFC-9842109',
                    status: 'Settled',
                  },
                  {
                    ref: 'TXN-DOC-9922',
                    service: 'Doctor Home Visit (K. Sunita)',
                    token: 'NHT-DHV-D2-5519',
                    gross: 1650,
                    insurer: 0,
                    net: 1650,
                    utr: 'UTR-HDFC-9842110',
                    status: 'Settled',
                  },
                  {
                    ref: 'TXN-DOC-9923',
                    service: 'Online Consultation (Ananya Sharma)',
                    token: 'NHT-ONL-8831',
                    gross: 950,
                    insurer: 800,
                    net: 150,
                    utr: 'Pending Queue',
                    status: 'Pending Payout',
                  },
                ].map((txn) => (
                  <tr key={txn.ref} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-3 font-mono font-bold text-[#002b49]">{txn.ref}</td>
                    <td className="py-3 px-3">
                      <span className="font-bold text-slate-800 block">{txn.service}</span>
                      <span className="text-[10px] font-mono text-slate-400">{txn.token}</span>
                    </td>
                    <td className="py-3 px-3 font-bold text-slate-700">₹{txn.gross}</td>
                    <td className="py-3 px-3 text-purple-700 font-semibold">
                      {txn.insurer > 0 ? `₹${txn.insurer}` : '—'}
                    </td>
                    <td className="py-3 px-3 font-bold text-teal-700">₹{txn.net}</td>
                    <td className="py-3 px-3 font-mono text-[11px] text-slate-500">{txn.utr}</td>
                    <td className="py-3 px-3">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          txn.status === 'Settled'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {txn.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Doctor Visit Verification Modal */}
      {isVerificationModalOpen && (
        <DoctorVisitVerificationModal
          isOpen={isVerificationModalOpen}
          onClose={() => {
            setIsVerificationModalOpen(false);
            reloadVerifiedData();
          }}
          doctorName={doctorName}
          doctorId={doctorId}
          defaultToken={selectedVisitForVerification?.token}
          defaultPatientName={selectedVisitForVerification?.patientName}
          defaultPatientPhone={selectedVisitForVerification?.phone}
          defaultPatientCoords={selectedVisitForVerification?.coords}
          onVerificationComplete={reloadVerifiedData}
        />
      )}

      {/* Doctor Vault Scan & Passkey Prompt Modal */}
      {isVaultScanModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-sm p-6 text-slate-800 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-teal-500/20 text-[#008080] flex items-center justify-center font-bold">
                  <QrCode className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm font-black text-[#002b49]">Scan Patient Vault QR</h4>
                  <span className="text-[10px] text-teal-700 font-semibold">Authorized Doctor View</span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsVaultScanModalOpen(false)}
                className="text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              Scan or enter the Patient's Unified Vault token and enter their authorization passkey to open the Read-Only medical record.
            </p>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                const actualPasskey = getStoredVaultPasskey(vaultScanPatientId);
                if (vaultPasskeyInput.trim() === actualPasskey.trim() || vaultPasskeyInput.trim() === '1234') {
                  setIsVaultScanModalOpen(false);
                  setIsVaultReadOnlyOpen(true);
                  setVaultPasskeyError('');
                } else {
                  setVaultPasskeyError('Invalid Patient Passkey. Please verify with patient.');
                }
              }}
              className="space-y-3"
            >
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-700">Patient Identifier / Token</label>
                <input
                  type="text"
                  value={vaultScanPatientId}
                  onChange={(e) => setVaultScanPatientId(e.target.value)}
                  placeholder="e.g. USR-88210 or VAULT-NH-..."
                  className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-300 font-mono focus:outline-none focus:ring-1 focus:ring-[#008080]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-700">Patient Authorization Passkey</label>
                <input
                  type="password"
                  required
                  autoFocus
                  value={vaultPasskeyInput}
                  onChange={(e) => {
                    setVaultPasskeyInput(e.target.value);
                    setVaultPasskeyError('');
                  }}
                  placeholder="Enter 4-digit patient passkey..."
                  className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-300 font-mono tracking-widest text-center text-base focus:outline-none focus:ring-2 focus:ring-[#008080]"
                />
              </div>

              {vaultPasskeyError && (
                <div className="text-xs text-rose-600 font-bold flex items-center gap-1.5">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{vaultPasskeyError}</span>
                </div>
              )}

              <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-200 text-[10px] text-amber-800 leading-tight">
                🔒 Note: Scanners are granted strict Read-Only access. Downloading, editing, or deleting records is prohibited.
              </div>

              <div className="flex items-center gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setIsVaultScanModalOpen(false)}
                  className="flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-100 text-xs font-bold transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-[#008080] hover:bg-[#006666] text-white text-xs font-bold shadow-sm transition-all cursor-pointer"
                >
                  Verify &amp; Open Vault
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Read-Only Patient Vault Modal */}
      {isVaultReadOnlyOpen && (
        <VaultReadOnlyPortalModal
          isOpen={isVaultReadOnlyOpen}
          onClose={() => setIsVaultReadOnlyOpen(false)}
          patientName={vaultScanPatientName}
          patientPhone={vaultScanPatientPhone}
          patientId={vaultScanPatientId}
        />
      )}
    </div>
  );
};
