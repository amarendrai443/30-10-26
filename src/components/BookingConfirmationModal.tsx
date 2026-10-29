import React, { useMemo } from 'react';
import { CheckCircle2, Calendar, MapPin, Clock, Phone, User, FileText, X, ArrowRight, ShieldCheck, QrCode } from 'lucide-react';
import { ConfirmedBooking } from '../types/serviceBooking';
import { SecureQrTokenCard } from './SecureQrTokenCard';
import { createOneTimeSecureToken, findTokenById, resolveDepartment } from '../utils/secureQrToken';
import { SecureHealthToken } from '../types/secureToken';

interface BookingConfirmationModalProps {
  booking: ConfirmedBooking | null;
  isOpen: boolean;
  onClose: () => void;
  onViewHistory?: () => void;
  isLoggedIn: boolean;
}

export const BookingConfirmationModal: React.FC<BookingConfirmationModalProps> = ({
  booking,
  isOpen,
  onClose,
  onViewHistory,
  isLoggedIn,
}) => {

  // Generate or retrieve persistent one-time secure token for this booking
  const secureToken = useMemo<SecureHealthToken | null>(() => {
    if (!booking) return null;
    const existing = findTokenById(booking.referenceId);
    if (existing) return existing;

    const isInsurance = !!booking.insuranceClaim;
    const dept = resolveDepartment('general_service', booking.serviceName);
    return createOneTimeSecureToken(
      booking.referenceId,
      'general_service',
      booking.serviceName,
      {
        patientName: booking.patientName,
        patientPhone: booking.phone,
        deliveryAddress: `${booking.address}, ${booking.city}, ${booking.state}`,
        totalAmount: isInsurance ? 0 : 499,
        notes: `Age: ${booking.age}, Gender: ${booking.gender}. Slot: ${booking.preferredDate} (${booking.preferredTimeSlot})`,
        insuranceClaimId: booking.insuranceClaim?.claimId,
        insuranceCompany: booking.insuranceClaim?.insuranceCompany,
      },
      isInsurance,
      booking.insuranceClaim?.claimId,
      dept
    );
  }, [booking]);

  if (!isOpen || !booking) return null;

  return (
    <>
      <div
        role="dialog"
        aria-modal="true"
        className="fixed inset-0 z-[2000] flex items-center justify-center bg-black/70 p-3 sm:p-4 md:p-5 backdrop-blur-sm overflow-y-auto animate-in fade-in duration-200"
      >
        <div className="bg-white rounded-3xl max-w-lg w-full max-h-[92vh] overflow-y-auto p-4 sm:p-6 shadow-2xl border border-slate-200 relative animate-in zoom-in-95 duration-200 text-left my-auto space-y-3.5 scrollbar-thin">
          {/* Close Button */}
          <button
            type="button"
            onClick={onClose}
            className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1.5 rounded-full hover:bg-slate-100 transition-colors cursor-pointer"
            aria-label="Close confirmation modal"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Top Success Icon */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-teal-50 border border-teal-200 text-[#008080] flex items-center justify-center shrink-0 shadow-xs">
              <CheckCircle2 className="w-6 h-6 text-[#008080]" />
            </div>
            <div>
              <div className="text-[11px] font-bold uppercase tracking-wider text-[#008080]">
                Booking Request Confirmed
              </div>
              <h3 className="text-base sm:text-lg font-black text-[#002b49] leading-tight">
                {booking.serviceName}
              </h3>
            </div>
          </div>

          {/* Reference ID Pill */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 sm:p-3.5 flex items-center justify-between">
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                Booking Reference ID
              </span>
              <span className="text-base sm:text-lg font-black text-[#002b49] font-mono tracking-wide">
                {booking.referenceId}
              </span>
            </div>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
              <span>Dispatched</span>
            </span>
          </div>

          {/* Secure One-Time QR Token Card Component */}
          {secureToken && (
            <div className="pt-1">
              <SecureQrTokenCard
                token={secureToken}
                isStaff={false}
              />
            </div>
          )}

          {/* Booking Details Summary */}
          <div className="space-y-3 text-xs text-slate-700 bg-white border border-slate-100 rounded-2xl p-4 shadow-2xs">
            <div className="flex items-start gap-2.5">
              <User className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold text-slate-500">Patient: </span>
                <span className="font-bold text-slate-900">{booking.patientName}</span>
                <span className="text-slate-500"> ({booking.age} yrs, {booking.gender})</span>
              </div>
            </div>

            <div className="flex items-start gap-2.5">
              <Calendar className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold text-slate-500">Schedule: </span>
                <span className="font-bold text-slate-900">{booking.preferredDate}</span>
                <span className="text-slate-600 block text-[11px]">
                  {booking.preferredTimeSlot}
                  {booking.durationDays && booking.durationDays > 1 && (
                    <span className="ml-2 px-2 py-0.5 rounded-full bg-teal-100 text-[#008080] font-bold text-[10px]">
                      {booking.durationDays} Days Package
                    </span>
                  )}
                </span>
              </div>
            </div>

            <div className="flex items-start gap-2.5">
              <MapPin className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold text-slate-500">Address: </span>
                <span className="font-bold text-slate-900">{booking.address}, {booking.city}, {booking.state}</span>
              </div>
            </div>

            <div className="flex items-start gap-2.5">
              <Phone className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold text-slate-500">Contact: </span>
                <span className="font-bold text-slate-900">+91 {booking.phone}</span>
                {booking.whatsapp && <span className="text-emerald-600 ml-2 font-medium">(WhatsApp: +91 {booking.whatsapp})</span>}
              </div>
            </div>

            {/* Uploaded Medical Documents Info */}
            {booking.uploadedMedicalDocs && booking.uploadedMedicalDocs.length > 0 && (
              <div className="pt-2 border-t border-slate-100">
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-800 block mb-1">
                  Attached Medical Documents (Insurance Pre-Authorization)
                </span>
                <div className="space-y-1">
                  {booking.uploadedMedicalDocs.map((doc, dIdx) => (
                    <div key={`conf-doc-${dIdx}`} className="flex items-center gap-2 text-[11px] text-slate-600">
                      <FileText className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                      <span className="font-medium truncate">{doc.name}</span>
                      <span className="text-slate-400">({doc.size})</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* AUTOMATED MULTI-DAY TOKEN ENGINE SCHEDULE */}
          {booking.multiDayTokens && booking.multiDayTokens.length > 1 && (
            <div className="p-4 rounded-2xl bg-gradient-to-br from-teal-50 via-slate-50 to-blue-50 border border-teal-200 text-left space-y-2.5 shadow-2xs">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-[#008080]" />
                  <span className="text-xs font-black uppercase tracking-wider text-[#002b49]">
                    Multi-Day Token Schedule ({booking.multiDayTokens.length} Days)
                  </span>
                </div>
                <span className="text-[10px] bg-teal-200 text-teal-900 font-bold px-2 py-0.5 rounded-full">
                  12:00 AM Midnight Rollover
                </span>
              </div>
              <p className="text-[11px] text-slate-600">
                Each daily visit requires that specific calendar day's token. Fresh tokens activate automatically at 12:00 AM midnight with strict 1-day validity.
              </p>

              <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                {booking.multiDayTokens.map((item) => (
                  <div
                    key={item.tokenId}
                    className={`p-2.5 rounded-xl border flex items-center justify-between text-xs ${
                      item.status === 'active'
                        ? 'bg-white border-teal-500 shadow-2xs ring-1 ring-teal-400'
                        : 'bg-white/80 border-slate-200 text-slate-600'
                    }`}
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-black text-slate-900">Day {item.dayNumber}</span>
                        <span className="text-slate-500 text-[11px]">({item.date})</span>
                      </div>
                      <div className="font-mono text-[11px] font-bold text-[#008080] mt-0.5">
                        {item.tokenId}
                      </div>
                    </div>
                    <div className="text-right">
                      {item.status === 'active' ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-black text-[10px]">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                          <span>Active Today (1-Day Valid)</span>
                        </span>
                      ) : item.status === 'expired' ? (
                        <span className="text-[10px] text-slate-400 font-bold">1-Day Expired</span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 font-bold text-[10px]">
                          <span>Unlocks 12:00 AM</span>
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* History Status Callout */}
          {booking.isGuest ? (
            <div className="bg-amber-50 border border-amber-200/80 rounded-xl p-3 text-xs text-amber-900 flex items-start gap-2">
              <ShieldCheck className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <span>
                <strong>Booked as Guest:</strong> Please keep reference ID <strong>{booking.referenceId}</strong> safe for SMS and phone coordination.
              </span>
            </div>
          ) : (
            <div className="bg-teal-50 border border-teal-200/80 rounded-xl p-3 text-xs text-teal-900 flex items-start gap-2">
              <ShieldCheck className="w-4 h-4 text-[#008080] shrink-0 mt-0.5" />
              <span>
                <strong>Saved to Your Health Records:</strong> This booking and its Secure QR Pass have been saved for verification and staff check-in.
              </span>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center gap-2.5 pt-2">
            {isLoggedIn && onViewHistory && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onViewHistory();
                }}
                className="w-full sm:flex-1 py-3 px-4 rounded-xl bg-[#002b49] hover:bg-[#001d31] text-white text-xs font-bold transition-all text-center cursor-pointer shadow-sm"
              >
                View In My Bookings History
              </button>
            )}

            <button
              type="button"
              onClick={onClose}
              className="w-full sm:flex-1 py-3 px-4 rounded-xl bg-[#008080] hover:bg-[#006666] text-white text-xs font-bold transition-all text-center cursor-pointer shadow-sm"
            >
              Done
            </button>
          </div>
        </div>
      </div>
    </>
  );
};
