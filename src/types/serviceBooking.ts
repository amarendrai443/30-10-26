export interface ServiceItem {
  id: string;
  name: string;
  category: string;
  tagline: string;
  description: string;
  cardImage: string;
  iconImage: string;
  iconName: string;
  badge?: string;
  turnaroundTime?: string;
}

export interface BookingFormData {
  serviceId: string;
  serviceName: string;
  patientName: string;
  age: string;
  gender: 'Male' | 'Female' | 'Other';
  phone: string;
  whatsapp: string;
  sameAsPhone: boolean;
  state: string;
  city: string;
  symptoms: string;
  address: string;
  preferredDate: string;
  preferredTimeSlot: string;
  agreeTerms: boolean;
  agreePrivacy: boolean;
  insuranceClaim?: import('./insurance').InsuranceClaimDetails;
  durationDays?: number; // Duration of visit package in days (for doctor home visits)
  uploadedMedicalDocs?: Array<{ name: string; size: string; type: string; url?: string }>;
}

export interface MultiDayTokenItem {
  dayNumber: number;
  date: string; // YYYY-MM-DD
  tokenId: string; // NHT-DHV-D1-XXXX
  validFrom: string; // 12:00 AM midnight
  validUntil: string; // 11:59 PM same day
  status: 'active' | 'scheduled' | 'expired' | 'redeemed';
}

export interface UserAccount {
  id: string;
  name: string;
  phone: string;
  email?: string;
  accountType?: 'Patient' | 'Partner' | string;
  role?: string;
  entityName?: string;
  roles?: string[];
  provider?: 'phone' | 'email' | 'google';
  specialty?: string;
  status?: string;
  city?: string;
}

export interface ConfirmedBooking {
  referenceId: string;
  serviceId: string;
  serviceName: string;
  patientName: string;
  age: string;
  gender: string;
  phone: string;
  whatsapp: string;
  state: string;
  city: string;
  symptoms: string;
  address: string;
  preferredDate: string;
  preferredTimeSlot: string;
  bookedAt: string;
  isGuest: boolean;
  userId?: string;
  status: 'Confirmed' | 'Clinician Dispatched' | 'Sample Collected' | 'Report Ready' | 'Completed' | 'Used / Expired';
  insuranceClaim?: import('./insurance').InsuranceClaimDetails;
  serviceCategory?: string;
  secureTokenId?: string;
  qrStatus?: 'active' | 'used' | 'expired';
  durationDays?: number;
  uploadedMedicalDocs?: Array<{ name: string; size: string; type: string; url?: string }>;
  multiDayTokens?: MultiDayTokenItem[];
}

