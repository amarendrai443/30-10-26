export interface VaultClinicalDetails {
  diagnoses?: string[];
  medications?: Array<{ name: string; dosage: string; frequency: string; duration: string }>;
  labParameters?: Array<{ test: string; result: string; unit: string; referenceRange: string; status: 'Normal' | 'High' | 'Low' }>;
  doctorRemarks?: string;
  allergies?: string[];
  hospitalCourse?: string;
}

export interface UnifiedVaultRecord {
  id: string;
  title: string;
  category: 'Prescription' | 'Lab Report' | 'Discharge Summary' | 'Vital Lens' | 'Clinical Notes';
  date: string;
  issuedBy: string;
  facility: string;
  documentType: string;
  summary: string;
  clinicalDetails: VaultClinicalDetails;
}

const DEFAULT_VAULT_RECORDS: UnifiedVaultRecord[] = [
  {
    id: 'REC-DISCH-2026-08',
    title: 'Hospital Discharge Summary & Inpatient Course',
    category: 'Discharge Summary',
    date: '14 Oct 2026',
    issuedBy: 'Dr. K. Srinivas Rao, MD (Internal Medicine)',
    facility: 'Care Hospitals, Banjara Hills',
    documentType: 'Inpatient Hospital Record',
    summary: 'Admitted for acute viral gastroenteritis with moderate dehydration. Stabilized with IV fluid resuscitation. Discharged in hemodynamically stable condition.',
    clinicalDetails: {
      diagnoses: ['Acute Viral Gastroenteritis', 'Dehydration (Resolved)', 'Essential Hypertension (Well Controlled)'],
      medications: [
        { name: 'Rifaximin 400mg', dosage: '400 mg', frequency: 'TDS (Three times a day)', duration: '5 days' },
        { name: 'Telmisartan 40mg', dosage: '40 mg', frequency: 'OD (Once daily morning)', duration: 'Ongoing' },
        { name: 'Probiotic Sachet', dosage: '1 sachet', frequency: 'BD with water', duration: '7 days' },
      ],
      doctorRemarks: 'Patient vitals stable at discharge (BP 124/82 mmHg, HR 72 bpm, SpO2 99%). Maintain oral hydration. Follow-up OPD review in 2 weeks.',
      allergies: ['Penicillin (Moderate rash / erythema)', 'Sulfa drugs (Mild itching)'],
      hospitalCourse: '48-hour monitored stay. Serial electrolyte profiles normalized. Afebrile for >36 hours before discharge.',
    },
  },
  {
    id: 'REC-LAB-2026-94',
    title: 'Complete Blood Count (CBC) & Comprehensive Metabolic Panel',
    category: 'Lab Report',
    date: '18 Oct 2026',
    issuedBy: 'Dr. Radhika Varma (Chief Pathologist)',
    facility: 'Apollo Diagnostics (NABL Accredited)',
    documentType: 'Diagnostic Pathology Report',
    summary: 'Routine post-discharge clinical blood work. Hemoglobin, renal biomarkers, and liver enzymes within normal physiological limits.',
    clinicalDetails: {
      diagnoses: ['Routine Post-Discharge Monitoring', 'Metabolic Assessment'],
      labParameters: [
        { test: 'Hemoglobin', result: '14.2', unit: 'g/dL', referenceRange: '13.0 - 17.0', status: 'Normal' },
        { test: 'Total WBC Count', result: '6,800', unit: '/mcL', referenceRange: '4,000 - 11,000', status: 'Normal' },
        { test: 'Platelet Count', result: '245,000', unit: '/mcL', referenceRange: '150,000 - 450,000', status: 'Normal' },
        { test: 'Serum Creatinine', result: '0.92', unit: 'mg/dL', referenceRange: '0.7 - 1.3', status: 'Normal' },
        { test: 'Blood Urea Nitrogen', result: '16', unit: 'mg/dL', referenceRange: '7 - 20', status: 'Normal' },
        { test: 'Fasting Blood Sugar', result: '94', unit: 'mg/dL', referenceRange: '70 - 99', status: 'Normal' },
        { test: 'HbA1c Glycated Hb', result: '5.6', unit: '%', referenceRange: '< 5.7 (Normal)', status: 'Normal' },
      ],
      doctorRemarks: 'All biochemical and hematological parameters are within optimal adult reference ranges. Normal renal clearance.',
      allergies: ['Penicillin'],
    },
  },
  {
    id: 'REC-RX-2026-41',
    title: 'Cardiology Consultation & Outpatient Prescription',
    category: 'Prescription',
    date: '12 Oct 2026',
    issuedBy: 'Dr. Arvind Swaminathan (Senior Consultant Cardiologist)',
    facility: 'Nhealth Specialty Clinic & Home Care Hub',
    documentType: 'Specialist Prescription',
    summary: 'Quarterly cardiovascular review. Normal sinus rhythm on 12-lead ECG. Echocardiogram shows normal LV ejection fraction (62%).',
    clinicalDetails: {
      diagnoses: ['Essential Hypertension (Grade 1 - Controlled)', 'Mild Dyslipidemia'],
      medications: [
        { name: 'Telmisartan 40mg', dosage: '40 mg', frequency: 'OD (Morning)', duration: '90 days' },
        { name: 'Rosuvastatin 10mg', dosage: '10 mg', frequency: 'OD (Bedtime)', duration: '90 days' },
        { name: 'CoQ10 Ubiquinol 100mg', dosage: '100 mg', frequency: 'OD (Post-lunch)', duration: '60 days' },
      ],
      doctorRemarks: 'ECG shows regular sinus rhythm without ST-T changes. Exercise tolerance is good. Continue 30-minute brisk morning walks and low-sodium diet.',
      allergies: ['Penicillin'],
    },
  },
  {
    id: 'REC-VIT-2026-19',
    title: 'Optical Facial Photoplethysmography (vPPG) Biometrics',
    category: 'Vital Lens',
    date: '10 Oct 2026',
    issuedBy: 'Nhealth Vital Lens™ AI Clinical Engine',
    facility: 'Nhealth Contactless AI Lab (CE & ISO Certified)',
    documentType: 'Contactless Physiological Scan',
    summary: 'Automated 30-second camera-based rPPG vitals extraction. Heart Rate: 72 bpm, SpO2: 98%, Blood Pressure: 122/80 mmHg, Mental Wellbeing: 86/100.',
    clinicalDetails: {
      diagnoses: ['Contactless Vitals Baseline Assessment'],
      labParameters: [
        { test: 'Heart Rate (rPPG)', result: '72', unit: 'BPM', referenceRange: '60 - 100', status: 'Normal' },
        { test: 'Blood Oxygen (SpO2)', result: '98', unit: '%', referenceRange: '95 - 100', status: 'Normal' },
        { test: 'Systolic Blood Pressure', result: '122', unit: 'mmHg', referenceRange: '90 - 129', status: 'Normal' },
        { test: 'Diastolic Blood Pressure', result: '80', unit: 'mmHg', referenceRange: '60 - 84', status: 'Normal' },
        { test: 'Heart Rate Variability (SDNN)', result: '46', unit: 'ms', referenceRange: '> 35', status: 'Normal' },
        { test: 'Respiratory Rate', result: '16', unit: 'br/min', referenceRange: '12 - 20', status: 'Normal' },
      ],
      doctorRemarks: 'Optimal autonomic nervous system balance. Mental wellbeing index rated high (86/100). Low physiological stress signature.',
    },
  },
  {
    id: 'REC-NOTES-2026-03',
    title: 'Clinical Allergies & Emergency Care Protocol Summary',
    category: 'Clinical Notes',
    date: '02 Oct 2026',
    issuedBy: 'Dr. Priya Nambiar (Family Medicine & Emergency Attending)',
    facility: 'Nhealth Care Coordination Center',
    documentType: 'Emergency Clinical Summary',
    summary: 'Consolidated emergency care summary for rapid triage by attending emergency physicians or ambulance paramedics.',
    clinicalDetails: {
      diagnoses: ['Hypertension', 'Known Penicillin Sensitivity'],
      allergies: ['Penicillin (Severe hypersensitivity, anaphylaxis precaution)', 'Sulfa antibiotics (Mild cutaneous rash)'],
      doctorRemarks: 'CRITICAL PRECAUTION: Strictly avoid Beta-Lactam / Penicillin class antibiotics. In case of bacterial infections, prefer Azithromycin, Ciprofloxacin, or Clindamycin. Blood group: B Positive.',
    },
  },
];

const DEFAULT_PASSKEY = '1234';

export const getStoredVaultPasskey = (patientId: string = 'default'): string => {
  try {
    const saved = localStorage.getItem(`nhealth_vault_passkey_${patientId}`);
    return saved || DEFAULT_PASSKEY;
  } catch {
    return DEFAULT_PASSKEY;
  }
};

export const setStoredVaultPasskey = (patientId: string = 'default', newPasskey: string): boolean => {
  try {
    localStorage.setItem(`nhealth_vault_passkey_${patientId}`, newPasskey);
    return true;
  } catch {
    return false;
  }
};

export const getStoredVaultRecords = (patientId: string = 'default'): UnifiedVaultRecord[] => {
  try {
    const key = `nhealth_vault_records_${patientId}`;
    const saved = localStorage.getItem(key);
    if (saved) {
      return JSON.parse(saved);
    }
    // Seed with realistic default records
    localStorage.setItem(key, JSON.stringify(DEFAULT_VAULT_RECORDS));
    return DEFAULT_VAULT_RECORDS;
  } catch {
    return DEFAULT_VAULT_RECORDS;
  }
};

export const getVaultTokenId = (patientId: string = 'USR-88210'): string => {
  const cleanId = patientId.replace(/[^a-zA-Z0-9]/g, '').toUpperCase();
  return `VAULT-NH-${cleanId}-SEC`;
};
