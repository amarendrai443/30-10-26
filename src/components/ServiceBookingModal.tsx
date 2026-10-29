import React, { useState, useEffect } from 'react';
import {
  X,
  Calendar,
  Clock,
  MapPin,
  Phone,
  User,
  AlertCircle,
  FileText,
  ShieldCheck,
  CheckCircle2,
  ChevronDown,
  Sparkles,
  UploadCloud,
  Trash2,
  Plus,
} from 'lucide-react';
import { ServiceItem, BookingFormData } from '../types/serviceBooking';
import { INDIAN_STATES, TIME_SLOTS } from '../data/servicesData';
import { InsuranceClaimSection } from './InsuranceClaimSection';
import { InsurancePaymentOption, InsuranceClaimDetails } from '../types/insurance';

interface ServiceBookingModalProps {
  service: ServiceItem | null;
  isOpen: boolean;
  onClose: () => void;
  onSubmitBooking: (formData: BookingFormData) => void;
  initialPhone?: string;
  initialName?: string;
  initialSymptoms?: string;
  isLoggedIn?: boolean;
  onPromptLogin?: () => void;
}

export const ServiceBookingModal: React.FC<ServiceBookingModalProps> = ({
  service,
  isOpen,
  onClose,
  onSubmitBooking,
  initialPhone = '',
  initialName = '',
  initialSymptoms = '',
  isLoggedIn = false,
  onPromptLogin,
}) => {
  // Tomorrow's date formatted as YYYY-MM-DD for sensible date default
  const getTomorrowDate = () => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return d.toISOString().split('T')[0];
  };

  const [formData, setFormData] = useState<BookingFormData>({
    serviceId: '',
    serviceName: '',
    patientName: initialName,
    age: '',
    gender: 'Male',
    phone: initialPhone,
    whatsapp: initialPhone,
    sameAsPhone: true,
    state: 'Telangana',
    city: 'Hyderabad',
    symptoms: '',
    address: '',
    preferredDate: getTomorrowDate(),
    preferredTimeSlot: TIME_SLOTS[0],
    agreeTerms: false,
    agreePrivacy: false,
  });

  const [paymentOption, setPaymentOption] = useState<InsurancePaymentOption>('pay_now');
  const [insuranceClaim, setInsuranceClaim] = useState<InsuranceClaimDetails | null>(null);

  const isDoctorHomeVisit =
    service?.id === 'doctor-home-visits' ||
    service?.name?.toLowerCase().includes('doctor home visit') ||
    service?.name?.toLowerCase().includes('doctor visit');

  const [durationDays, setDurationDays] = useState<number>(1);
  const [uploadedMedicalDocs, setUploadedMedicalDocs] = useState<
    Array<{ name: string; size: string; type: string }>
  >([]);

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (service) {
      setFormData((prev) => ({
        ...prev,
        serviceId: service.id,
        serviceName: service.name,
        patientName: initialName || prev.patientName,
        phone: initialPhone || prev.phone,
        whatsapp: prev.sameAsPhone ? initialPhone || prev.phone : prev.whatsapp,
        symptoms: initialSymptoms || prev.symptoms,
      }));
      setErrors({});
    }
  }, [service, initialName, initialPhone, initialSymptoms]);

  if (!isOpen || !service) return null;

  const handlePhoneChange = (val: string) => {
    const cleanPhone = val.replace(/\D/g, '').slice(0, 10);
    setFormData((prev) => ({
      ...prev,
      phone: cleanPhone,
      whatsapp: prev.sameAsPhone ? cleanPhone : prev.whatsapp,
    }));
    if (errors.phone) setErrors((prev) => ({ ...prev, phone: '' }));
  };

  const handleWhatsappChange = (val: string) => {
    const cleanWhatsapp = val.replace(/\D/g, '').slice(0, 10);
    setFormData((prev) => ({
      ...prev,
      whatsapp: cleanWhatsapp,
    }));
    if (errors.whatsapp) setErrors((prev) => ({ ...prev, whatsapp: '' }));
  };

  const handleSameAsPhoneToggle = (checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      sameAsPhone: checked,
      whatsapp: checked ? prev.phone : prev.whatsapp,
    }));
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    const newItems: Array<{ name: string; size: string; type: string }> = [];
    for (let i = 0; i < files.length; i++) {
      const f = files[i];
      const sizeStr = (f.size / (1024 * 1024)).toFixed(2) + ' MB';
      newItems.push({
        name: f.name,
        size: sizeStr,
        type: f.type || 'application/pdf',
      });
    }
    setUploadedMedicalDocs((prev) => [...prev, ...newItems]);
    if (errors.medicalDocs) setErrors((prev) => ({ ...prev, medicalDocs: '' }));
  };

  const handleAddSampleDoc = (docType: 'Discharge Summary' | 'Prescription') => {
    const sample = {
      name: `${docType}_${formData.patientName.replace(/\s+/g, '_') || 'Patient'}_Nhealth.pdf`,
      size: '1.42 MB',
      type: 'application/pdf',
    };
    setUploadedMedicalDocs((prev) => [...prev, sample]);
    if (errors.medicalDocs) setErrors((prev) => ({ ...prev, medicalDocs: '' }));
  };

  const handleRemoveDoc = (index: number) => {
    setUploadedMedicalDocs((prev) => prev.filter((_, idx) => idx !== index));
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.patientName.trim()) {
      newErrors.patientName = 'Patient full name is required.';
    }

    if (!formData.age.trim()) {
      newErrors.age = 'Patient age is required.';
    } else {
      const ageNum = parseInt(formData.age, 10);
      if (isNaN(ageNum) || ageNum <= 0 || ageNum > 125) {
        newErrors.age = 'Please enter a valid age (1-120).';
      }
    }

    if (!formData.phone.trim() || formData.phone.length < 10) {
      newErrors.phone = 'Valid 10-digit mobile number is required.';
    }

    if (!formData.whatsapp.trim() || formData.whatsapp.length < 10) {
      newErrors.whatsapp = 'Valid 10-digit WhatsApp number is required.';
    }

    if (!formData.city.trim()) {
      newErrors.city = 'City name is required.';
    }

    if (!formData.address.trim()) {
      newErrors.address = 'Doorstep residential address is required.';
    }

    if (!formData.symptoms.trim()) {
      newErrors.symptoms = 'Please describe patient symptoms or reason for booking.';
    }

    if (!formData.preferredDate) {
      newErrors.preferredDate = 'Preferred appointment date is required.';
    }

    if (!formData.agreeTerms) {
      newErrors.agreeTerms = 'You must agree to the Terms & Conditions.';
    }

    if (!formData.agreePrivacy) {
      newErrors.agreePrivacy = 'Privacy Policy consent is mandatory.';
    }

    if (paymentOption === 'claim_insurance' && !insuranceClaim) {
      newErrors.insurance = 'Please complete the insurance OTP verification above to confirm cashless claim.';
    }

    if (isDoctorHomeVisit && paymentOption === 'claim_insurance' && uploadedMedicalDocs.length === 0) {
      newErrors.medicalDocs =
        'Please upload required medical documents (Discharge Summary or Prescription) for cashless doctor home visit insurance claim.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      onSubmitBooking({
        ...formData,
        insuranceClaim: paymentOption === 'claim_insurance' ? (insuranceClaim || undefined) : undefined,
        durationDays: isDoctorHomeVisit ? durationDays : 1,
        uploadedMedicalDocs: uploadedMedicalDocs.length > 0 ? uploadedMedicalDocs : undefined,
      });
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="booking-modal-title"
      className="fixed inset-0 z-[2000] flex flex-col items-center justify-start bg-black/65 p-3 sm:p-5 pt-20 sm:pt-24 pb-8 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-200"
    >
      <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[calc(100vh-6.5rem)] sm:max-h-[calc(100vh-7.5rem)] flex flex-col shadow-2xl border border-slate-200 relative animate-in zoom-in-95 duration-200 my-auto overflow-hidden">
        {/* Modal Top Header with Service Badge */}
        <div className="bg-gradient-to-r from-[#002b49] via-[#00385e] to-[#008080] text-white p-5 sm:p-6 relative shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="absolute top-5 right-5 text-white/80 hover:text-white p-1.5 rounded-full hover:bg-white/10 transition-colors cursor-pointer"
            aria-label="Close booking modal"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2 mb-2">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/15 text-teal-200 text-xs font-bold tracking-wide backdrop-blur-xs">
              <Sparkles className="w-3 h-3 text-teal-300" />
              <span>{service.category}</span>
            </span>
            <span className="text-white/60 text-xs">·</span>
            <span className="text-xs text-white/80 font-medium">Quick Doorstep Booking</span>
          </div>

          <h2 id="booking-modal-title" className="text-xl sm:text-2xl font-black text-white tracking-tight">
            Schedule {service.name}
          </h2>

          <p className="text-xs sm:text-[13px] text-slate-200 mt-1 max-w-lg leading-relaxed font-medium">
            {service.tagline}
          </p>
        </div>

        {/* Scrollable Form Body */}
        <form onSubmit={handleSubmit} className="p-5 sm:p-7 overflow-y-auto flex-1 space-y-5 text-left">
          {/* Section 1: Patient Basic Details */}
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-[#008080] mb-3 flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-teal-600" />
              <span>Patient Information</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-12 gap-3.5">
              {/* Patient Name (7 cols) */}
              <div className="sm:col-span-7">
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Patient Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Ramesh Chandra Verma"
                  value={formData.patientName}
                  onChange={(e) => {
                    setFormData({ ...formData, patientName: e.target.value });
                    if (errors.patientName) setErrors({ ...errors, patientName: '' });
                  }}
                  className={`w-full px-3.5 py-2.5 rounded-xl border text-sm text-slate-900 bg-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#008080] transition-all ${
                    errors.patientName ? 'border-red-500 ring-1 ring-red-500' : 'border-slate-300'
                  }`}
                />
                {errors.patientName && <p className="text-[11px] text-red-500 mt-1">{errors.patientName}</p>}
              </div>

              {/* Age (2 cols) */}
              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Age <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  min="1"
                  max="125"
                  required
                  placeholder="45"
                  value={formData.age}
                  onChange={(e) => {
                    setFormData({ ...formData, age: e.target.value });
                    if (errors.age) setErrors({ ...errors, age: '' });
                  }}
                  className={`w-full px-3 py-2.5 rounded-xl border text-sm text-slate-900 bg-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#008080] transition-all ${
                    errors.age ? 'border-red-500 ring-1 ring-red-500' : 'border-slate-300'
                  }`}
                />
                {errors.age && <p className="text-[11px] text-red-500 mt-1">{errors.age}</p>}
              </div>

              {/* Gender (3 cols) */}
              <div className="sm:col-span-3">
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Gender <span className="text-red-500">*</span>
                </label>
                <div className="flex rounded-xl border border-slate-300 p-0.5 bg-slate-50">
                  {(['Male', 'Female', 'Other'] as const).map((g) => (
                    <button
                      key={g}
                      type="button"
                      onClick={() => setFormData({ ...formData, gender: g })}
                      className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                        formData.gender === g
                          ? 'bg-[#002b49] text-white shadow-xs'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      {g}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Section 2: Contact Numbers */}
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-[#008080] mb-3 flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5 text-teal-600" />
              <span>Contact &amp; Verification Numbers</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {/* Mobile Phone */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Phone Number <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-2.5 text-xs font-bold text-slate-500">+91</span>
                  <input
                    type="tel"
                    required
                    placeholder="98765 43210"
                    value={formData.phone}
                    onChange={(e) => handlePhoneChange(e.target.value)}
                    className={`w-full pl-12 pr-3.5 py-2.5 rounded-xl border text-sm text-slate-900 bg-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#008080] transition-all ${
                      errors.phone ? 'border-red-500 ring-1 ring-red-500' : 'border-slate-300'
                    }`}
                  />
                </div>
                {errors.phone && <p className="text-[11px] text-red-500 mt-1">{errors.phone}</p>}
              </div>

              {/* WhatsApp Number */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-bold text-slate-700">
                    WhatsApp Number <span className="text-red-500">*</span>
                  </label>
                  <label className="inline-flex items-center gap-1 text-[11px] text-slate-600 font-semibold cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={formData.sameAsPhone}
                      onChange={(e) => handleSameAsPhoneToggle(e.target.checked)}
                      className="rounded text-[#008080] focus:ring-[#008080] w-3 h-3"
                    />
                    <span>Same as Phone</span>
                  </label>
                </div>
                <div className="relative">
                  <span className="absolute left-3.5 top-2.5 text-xs font-bold text-emerald-600">+91</span>
                  <input
                    type="tel"
                    required
                    disabled={formData.sameAsPhone}
                    placeholder="98765 43210"
                    value={formData.whatsapp}
                    onChange={(e) => handleWhatsappChange(e.target.value)}
                    className={`w-full pl-12 pr-3.5 py-2.5 rounded-xl border text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#008080] transition-all ${
                      formData.sameAsPhone ? 'bg-slate-100 text-slate-600' : 'bg-white'
                    } ${errors.whatsapp ? 'border-red-500 ring-1 ring-red-500' : 'border-slate-300'}`}
                  />
                </div>
                {errors.whatsapp && <p className="text-[11px] text-red-500 mt-1">{errors.whatsapp}</p>}
              </div>
            </div>
          </div>

          {/* Section 3: State & City & Doorstep Address */}
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-[#008080] mb-3 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-teal-600" />
              <span>Doorstep Delivery Address</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 mb-3">
              {/* State Dropdown */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  State <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <select
                    value={formData.state}
                    onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                    className="w-full appearance-none px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm text-slate-900 bg-white font-medium focus:outline-none focus:ring-2 focus:ring-[#008080] pr-9 cursor-pointer"
                  >
                    {INDIAN_STATES.map((st, sIdx) => (
                      <option key={`state-opt-${st}-${sIdx}`} value={st}>
                        {st}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-3 pointer-events-none" />
                </div>
              </div>

              {/* City Input */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  City <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Hyderabad, Secunderabad"
                  value={formData.city}
                  onChange={(e) => {
                    setFormData({ ...formData, city: e.target.value });
                    if (errors.city) setErrors({ ...errors, city: '' });
                  }}
                  className={`w-full px-3.5 py-2.5 rounded-xl border text-sm text-slate-900 bg-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#008080] transition-all ${
                    errors.city ? 'border-red-500 ring-1 ring-red-500' : 'border-slate-300'
                  }`}
                />
                {errors.city && <p className="text-[11px] text-red-500 mt-1">{errors.city}</p>}
              </div>
            </div>

            {/* Complete Doorstep Address */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Residential Address (House / Flat No., Street, Landmark) <span className="text-red-500">*</span>
              </label>
              <textarea
                rows={2}
                required
                placeholder="e.g. Flat 402, Sai Residency, Road No. 12, Banjara Hills, near Care Hospital"
                value={formData.address}
                onChange={(e) => {
                  setFormData({ ...formData, address: e.target.value });
                  if (errors.address) setErrors({ ...errors, address: '' });
                }}
                className={`w-full px-3.5 py-2 rounded-xl border text-sm text-slate-900 bg-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#008080] transition-all resize-none ${
                  errors.address ? 'border-red-500 ring-1 ring-red-500' : 'border-slate-300'
                }`}
              />
              {errors.address && <p className="text-[11px] text-red-500 mt-1">{errors.address}</p>}
            </div>
          </div>

          {/* Section 4: Symptoms & Health Concerns */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Symptoms / Health Concerns / Specific Test Required <span className="text-red-500">*</span>
            </label>
            <textarea
              rows={2}
              required
              placeholder="e.g. Fasting blood sugar & Lipid profile test needed; or fever for 3 days and joint mobility ache..."
              value={formData.symptoms}
              onChange={(e) => {
                setFormData({ ...formData, symptoms: e.target.value });
                if (errors.symptoms) setErrors({ ...errors, symptoms: '' });
              }}
              className={`w-full px-3.5 py-2 rounded-xl border text-sm text-slate-900 bg-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#008080] transition-all resize-none ${
                errors.symptoms ? 'border-red-500 ring-1 ring-red-500' : 'border-slate-300'
              }`}
            />
            {errors.symptoms && <p className="text-[11px] text-red-500 mt-1">{errors.symptoms}</p>}
          </div>

          {/* Section 5: Preferred Date & Time Slot */}
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-[#008080] mb-3 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-teal-600" />
              <span>Preferred Appointment Schedule</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {/* Date */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Preferred Date <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  required
                  value={formData.preferredDate}
                  min={new Date().toISOString().split('T')[0]}
                  onChange={(e) => setFormData({ ...formData, preferredDate: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-[#008080]"
                />
              </div>

              {/* Time Slot */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Preferred Time Slot <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <select
                    value={formData.preferredTimeSlot}
                    onChange={(e) => setFormData({ ...formData, preferredTimeSlot: e.target.value })}
                    className="w-full appearance-none px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm text-slate-900 bg-white font-medium focus:outline-none focus:ring-2 focus:ring-[#008080] pr-8 cursor-pointer"
                  >
                    {TIME_SLOTS.map((slot, sIdx) => (
                      <option key={`slot-opt-${slot}-${sIdx}`} value={slot}>
                        {slot}
                      </option>
                    ))}
                  </select>
                  <Clock className="w-4 h-4 text-slate-400 absolute right-3 top-3 pointer-events-none" />
                </div>
              </div>
            </div>

            {/* DURATION INPUT FOR DOCTOR HOME VISITS */}
            {isDoctorHomeVisit && (
              <div className="mt-3.5 p-3.5 rounded-2xl bg-teal-50/70 border border-teal-200 space-y-2.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-black uppercase tracking-wider text-teal-900 flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-[#008080]" />
                    <span>Doctor Home Visit Duration (Days) *</span>
                  </label>
                  <span className="text-[10px] font-bold text-teal-800 bg-teal-200/80 px-2 py-0.5 rounded-full">
                    Automated Midnight Rollover Engine
                  </span>
                </div>
                <p className="text-[11px] text-teal-800 leading-relaxed">
                  Specify the number of days you require clinician home visits. For multi-day packages, Nhealth automatically generates a fresh QR token every day right after midnight (12:00 AM) with strict 1-day calendar validity.
                </p>

                <div className="flex flex-wrap items-center gap-2">
                  {[1, 3, 5, 7, 14].map((d) => (
                    <button
                      key={`dur-${d}`}
                      type="button"
                      onClick={() => setDurationDays(d)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        durationDays === d
                          ? 'bg-[#002b49] text-white shadow-xs ring-2 ring-teal-500/30'
                          : 'bg-white text-slate-700 border border-slate-200 hover:bg-teal-50'
                      }`}
                    >
                      {d === 1 ? '1 Day (Single Visit)' : `${d} Days Package`}
                    </button>
                  ))}
                  <div className="flex items-center gap-1.5 ml-auto text-xs font-bold text-slate-700">
                    <span>Custom:</span>
                    <input
                      type="number"
                      min="1"
                      max="30"
                      value={durationDays}
                      onChange={(e) => setDurationDays(Math.max(1, parseInt(e.target.value, 10) || 1))}
                      className="w-16 px-2 py-1 rounded-lg border border-slate-300 bg-white text-xs font-bold text-center focus:outline-none focus:ring-2 focus:ring-[#008080]"
                    />
                    <span className="text-[11px] text-slate-500">Days</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Section 6: Payment & Cashless Insurance Claim Options */}
          <div className="pt-2 border-t border-slate-200/80 space-y-3">
            <InsuranceClaimSection
              amount={1250 * (isDoctorHomeVisit ? durationDays : 1)}
              serviceOrProductName={
                isDoctorHomeVisit && durationDays > 1
                  ? `${service.name} (${durationDays} Days Package)`
                  : service.name
              }
              defaultPhone={formData.phone}
              defaultName={formData.patientName}
              selectedOption={paymentOption}
              isLoggedIn={isLoggedIn}
              onPromptLogin={onPromptLogin}
              onChangeOption={(opt) => {
                setPaymentOption(opt);
                if (errors.insurance) setErrors((prev) => ({ ...prev, insurance: '' }));
                if (errors.medicalDocs) setErrors((prev) => ({ ...prev, medicalDocs: '' }));
              }}
              onClaimConfirmed={(claim) => {
                setInsuranceClaim(claim);
                if (errors.insurance) setErrors((prev) => ({ ...prev, insurance: '' }));
              }}
            />
            {errors.insurance && (
              <p className="text-xs text-red-600 font-bold mt-1.5 flex items-center gap-1">
                <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
                <span>{errors.insurance}</span>
              </p>
            )}

            {/* MANDATORY MEDICAL DOCUMENTS UPLOAD FOR DOCTOR HOME VISITS INSURANCE CLAIM */}
            {isDoctorHomeVisit && paymentOption === 'claim_insurance' && (
              <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-300/80 text-left space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-amber-700" />
                    <span className="text-xs font-black uppercase tracking-wider text-amber-950">
                      Upload Medical Documents (Discharge Summary / Prescriptions) *
                    </span>
                  </div>
                  <span className="text-[10px] bg-amber-200 text-amber-900 font-bold px-2 py-0.5 rounded-full">
                    Required for Cashless Approval
                  </span>
                </div>
                <p className="text-[11px] text-amber-900 leading-relaxed">
                  As mandated by TPA/Insurer guidelines for doctor home visits, please attach the patient's recent Hospital Discharge Summary, treating physician referral, or valid prescription.
                </p>

                {/* Upload Buttons */}
                <div className="flex flex-wrap items-center gap-2.5">
                  <label className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white border border-amber-300 text-amber-950 hover:bg-amber-100 font-bold text-xs cursor-pointer shadow-2xs transition-colors">
                    <UploadCloud className="w-4 h-4 text-amber-700" />
                    <span>Upload PDF / Images</span>
                    <input
                      type="file"
                      multiple
                      accept=".pdf,.png,.jpg,.jpeg"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                  </label>

                  <button
                    type="button"
                    onClick={() => handleAddSampleDoc('Discharge Summary')}
                    className="inline-flex items-center gap-1 px-3 py-2 rounded-xl bg-amber-100 hover:bg-amber-200 text-amber-900 font-bold text-xs border border-amber-300/60 cursor-pointer transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>+ Attach Sample Discharge Summary</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleAddSampleDoc('Prescription')}
                    className="inline-flex items-center gap-1 px-3 py-2 rounded-xl bg-amber-100 hover:bg-amber-200 text-amber-900 font-bold text-xs border border-amber-300/60 cursor-pointer transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>+ Attach Sample Prescription</span>
                  </button>
                </div>

                {/* Uploaded Documents List */}
                {uploadedMedicalDocs.length > 0 && (
                  <div className="space-y-1.5 pt-1">
                    {uploadedMedicalDocs.map((doc, idx) => (
                      <div
                        key={`doc-${idx}`}
                        className="flex items-center justify-between p-2.5 rounded-xl bg-white border border-amber-200 text-xs shadow-2xs"
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                          <span className="font-bold text-slate-800 truncate">{doc.name}</span>
                          <span className="text-[10px] text-slate-400 shrink-0">({doc.size})</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleRemoveDoc(idx)}
                          className="text-red-500 hover:text-red-700 p-1 rounded-lg hover:bg-red-50 transition-colors ml-2 cursor-pointer shrink-0"
                          title="Remove document"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {errors.medicalDocs && (
                  <p className="text-[11px] font-bold text-red-600 flex items-center gap-1 mt-1">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    <span>{errors.medicalDocs}</span>
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Section 7: Terms & Conditions and Mandate Privacy Policy Checkboxes */}
          <div className="pt-2 border-t border-slate-200/80 space-y-2.5">
            {/* Terms & Conditions Checkbox */}
            <label className="flex items-start gap-2.5 text-xs text-slate-700 cursor-pointer select-none">
              <input
                type="checkbox"
                required
                checked={formData.agreeTerms}
                onChange={(e) => {
                  setFormData({ ...formData, agreeTerms: e.target.checked });
                  if (errors.agreeTerms) setErrors({ ...errors, agreeTerms: '' });
                }}
                className="mt-0.5 w-4 h-4 rounded text-[#008080] focus:ring-[#008080] cursor-pointer"
              />
              <span>
                I agree to the <span className="font-bold text-[#002b49] underline">Terms &amp; Conditions</span> for doorstep clinical sample collection and home healthcare services <span className="text-red-500 font-bold">(Mandatory)</span>.
              </span>
            </label>
            {errors.agreeTerms && <p className="text-[11px] text-red-500 pl-6">{errors.agreeTerms}</p>}

            {/* Privacy Policy Checkbox (Mandatory) */}
            <label className="flex items-start gap-2.5 text-xs text-slate-700 cursor-pointer select-none">
              <input
                type="checkbox"
                required
                checked={formData.agreePrivacy}
                onChange={(e) => {
                  setFormData({ ...formData, agreePrivacy: e.target.checked });
                  if (errors.agreePrivacy) setErrors({ ...errors, agreePrivacy: '' });
                }}
                className="mt-0.5 w-4 h-4 rounded text-[#008080] focus:ring-[#008080] cursor-pointer"
              />
              <span>
                I agree to the <span className="font-bold text-[#002b49] underline">Privacy Policy</span> and grant clinical consent for digital health records processing <span className="text-red-500 font-bold">(Mandatory)</span>.
              </span>
            </label>
            {errors.agreePrivacy && <p className="text-[11px] text-red-500 pl-6">{errors.agreePrivacy}</p>}
          </div>

          {/* Submit Action Buttons */}
          <div className="pt-3">
            <button
              type="submit"
              disabled={
                !formData.agreeTerms ||
                !formData.agreePrivacy ||
                (paymentOption === 'claim_insurance' && !insuranceClaim)
              }
              className={`w-full font-extrabold py-3.5 px-6 rounded-xl text-sm transition-all flex items-center justify-center gap-2 ${
                !formData.agreeTerms ||
                !formData.agreePrivacy ||
                (paymentOption === 'claim_insurance' && !insuranceClaim)
                  ? 'bg-slate-200 text-slate-400 border border-slate-300 cursor-not-allowed opacity-60 shadow-none'
                  : paymentOption === 'claim_insurance'
                  ? 'bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 text-white shadow-md hover:shadow-lg active:scale-[0.99] cursor-pointer ring-2 ring-emerald-500/30'
                  : 'bg-gradient-to-r from-[#008080] to-[#006666] hover:from-[#006666] hover:to-[#004d4d] text-white shadow-md hover:shadow-lg active:scale-[0.99] cursor-pointer ring-2 ring-teal-500/30'
              }`}
            >
              <CheckCircle2
                className={`w-4 h-4 ${
                  formData.agreeTerms &&
                  formData.agreePrivacy &&
                  (paymentOption !== 'claim_insurance' || insuranceClaim)
                    ? 'text-teal-200'
                    : 'text-slate-400'
                }`}
              />
              <span>
                {paymentOption === 'claim_insurance'
                  ? insuranceClaim
                    ? `Confirm Cashless Booking (Claim: ${insuranceClaim.claimId})`
                    : 'Complete Insurance OTP Verification Above'
                  : 'Submit Request & Proceed'}
              </span>
            </button>
            <p className="text-center text-[11px] text-slate-400 mt-2">
              {paymentOption === 'claim_insurance' && insuranceClaim
                ? 'Zero payment gateway deduction. Direct cashless claim pre-authorization confirmed.'
                : 'Our clinical coordinator will instantly acknowledge your booking via WhatsApp & SMS.'}
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};
