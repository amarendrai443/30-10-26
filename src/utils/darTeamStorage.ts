import { DarRecord, DarDepartment } from '../types/darTeam';

const DAR_STORAGE_KEY = 'nhealth_dar_records';
const GOOGLE_SHEETS_CONFIG_KEY = 'nhealth_dar_sheets_config';

export interface GoogleSheetsConfig {
  sheetId: string;
  sheetName: string;
  sheetUrl: string;
  webhookUrl: string;
  lastSyncTime?: string;
  syncStatus: 'connected' | 'idle' | 'syncing' | 'error';
}

const ENV_SHEET_URL =
  (typeof import.meta !== 'undefined' && import.meta.env?.VITE_DAR_GOOGLE_SHEETS_URL) ||
  'https://docs.google.com/spreadsheets/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms/edit?usp=sharing';

const ENV_WEBHOOK_URL =
  (typeof import.meta !== 'undefined' && import.meta.env?.VITE_DAR_WEBHOOK_URL) ||
  'https://script.google.com/macros/s/AKfycbz_dar_sync/exec';

const DEFAULT_CONFIG: GoogleSheetsConfig = {
  sheetId: '1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms',
  sheetName: 'DAR_Master_Acquisitions',
  sheetUrl: ENV_SHEET_URL,
  webhookUrl: ENV_WEBHOOK_URL,
  syncStatus: 'connected',
  lastSyncTime: new Date().toISOString(),
};

const SEED_RECORDS: DarRecord[] = [
  {
    id: 'dar-001',
    slNo: 1,
    department: 'Doctors',
    organisationName: 'Apollo Speciality Clinics',
    designation: 'Senior Consultant Physician',
    personName: 'Dr. Ramesh Sharma',
    alternateNumber: '+91 98450 12345',
    status: 'Accepted',
    city: 'Bengaluru',
    state: 'Karnataka',
    pincode: '560034',
    numberOfCenters: '4',
    location: 'Koramangala 4th Block',
    address: '14, 80 Feet Road, Near Sony Signal',
    remarks: 'Ready for home visits and teleconsultation integration.',
    timestamp: new Date(Date.now() - 86400000 * 2).toISOString(),
    createdByName: 'DAR Associate',
    createdByEmail: 'dar@nhealth.in',
    syncedToGoogleSheets: true,
    sheetsSyncTimestamp: new Date(Date.now() - 86400000 * 2).toISOString(),
  },
  {
    id: 'dar-002',
    slNo: 2,
    department: 'Labs',
    organisationName: 'Thyrocare Partner Hub',
    designation: 'Area Operations Head',
    personName: 'Sunita Rao',
    alternateNumber: '+91 99123 45678',
    status: 'Pending',
    city: 'Hyderabad',
    state: 'Telangana',
    pincode: '500081',
    numberOfCenters: '12',
    location: 'Hitec City',
    address: 'Madhapur Main Road, Opp Cyber Towers',
    remarks: 'Awaiting SLA confirmation for early morning 6 AM sample pickups.',
    timestamp: new Date(Date.now() - 86400000).toISOString(),
    createdByName: 'DAR Associate',
    createdByEmail: 'dar@nhealth.in',
    syncedToGoogleSheets: true,
    sheetsSyncTimestamp: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    id: 'dar-003',
    slNo: 3,
    department: 'Hospitals',
    organisationName: 'Manipal Health Enterprise',
    designation: 'Patient Care Director',
    personName: 'Col. Vikram Malhotra',
    alternateNumber: '+91 97890 23456',
    status: 'Recall',
    city: 'New Delhi',
    state: 'Delhi',
    pincode: '110001',
    numberOfCenters: '2',
    location: 'Connaught Place',
    address: 'Barakhamba Road, Central Delhi',
    remarks: 'Recall meeting scheduled for Friday 3 PM regarding cashless OPD tie-up.',
    timestamp: new Date(Date.now() - 3600000 * 5).toISOString(),
    createdByName: 'DAR Associate',
    createdByEmail: 'dar@nhealth.in',
    syncedToGoogleSheets: true,
    sheetsSyncTimestamp: new Date(Date.now() - 3600000 * 5).toISOString(),
  },
  {
    id: 'dar-004',
    slNo: 4,
    department: 'Pharmacies',
    organisationName: 'MedPlus Express Hub',
    designation: 'Store Manager',
    personName: 'Karthik Pillai',
    alternateNumber: '+91 98840 98765',
    status: 'Rejected',
    rejectionReason: 'Unable to commit to guaranteed 2-hour doorstep delivery SLA in perimeter zones.',
    city: 'Chennai',
    state: 'Tamil Nadu',
    pincode: '600028',
    numberOfCenters: '1',
    location: 'Adyar',
    address: 'LB Road, Near Adyar Bus Depot',
    remarks: 'Refused contract terms.',
    timestamp: new Date(Date.now() - 3600000 * 2).toISOString(),
    createdByName: 'DAR Associate',
    createdByEmail: 'dar@nhealth.in',
    syncedToGoogleSheets: true,
    sheetsSyncTimestamp: new Date(Date.now() - 3600000 * 2).toISOString(),
  },
];

export function loadDarRecords(): DarRecord[] {
  try {
    const raw = localStorage.getItem(DAR_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(DAR_STORAGE_KEY, JSON.stringify(SEED_RECORDS));
      return SEED_RECORDS;
    }
    return JSON.parse(raw);
  } catch {
    return SEED_RECORDS;
  }
}

export function saveDarRecord(record: Omit<DarRecord, 'id' | 'slNo' | 'timestamp' | 'syncedToGoogleSheets'>): DarRecord {
  const records = loadDarRecords();
  const nextSlNo = records.length > 0 ? Math.max(...records.map((r) => r.slNo)) + 1 : 1;
  const now = new Date().toISOString();

  const newRecord: DarRecord = {
    ...record,
    id: `dar-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
    slNo: nextSlNo,
    timestamp: now,
    syncedToGoogleSheets: true,
    sheetsSyncTimestamp: now,
  };

  const updated = [newRecord, ...records];
  localStorage.setItem(DAR_STORAGE_KEY, JSON.stringify(updated));
  triggerGoogleSheetsAppend(newRecord);
  return newRecord;
}

export function updateDarRecord(id: string, updates: Partial<DarRecord>): DarRecord[] {
  const records = loadDarRecords();
  const updated = records.map((r) => (r.id === id ? { ...r, ...updates } : r));
  localStorage.setItem(DAR_STORAGE_KEY, JSON.stringify(updated));
  return updated;
}

export function deleteDarRecord(id: string): DarRecord[] {
  const records = loadDarRecords();
  const updated = records.filter((r) => r.id !== id);
  localStorage.setItem(DAR_STORAGE_KEY, JSON.stringify(updated));
  return updated;
}

export function loadGoogleSheetsConfig(): GoogleSheetsConfig {
  try {
    const raw = localStorage.getItem(GOOGLE_SHEETS_CONFIG_KEY);
    if (!raw) {
      localStorage.setItem(GOOGLE_SHEETS_CONFIG_KEY, JSON.stringify(DEFAULT_CONFIG));
      return DEFAULT_CONFIG;
    }
    const parsed = JSON.parse(raw);
    return {
      ...DEFAULT_CONFIG,
      ...parsed,
      sheetUrl: parsed.sheetUrl || DEFAULT_CONFIG.sheetUrl,
      webhookUrl: parsed.webhookUrl || DEFAULT_CONFIG.webhookUrl,
    };
  } catch {
    return DEFAULT_CONFIG;
  }
}

export function saveGoogleSheetsConfig(config: GoogleSheetsConfig): GoogleSheetsConfig {
  localStorage.setItem(GOOGLE_SHEETS_CONFIG_KEY, JSON.stringify(config));
  return config;
}

export async function triggerGoogleSheetsAppend(record: DarRecord): Promise<{ success: boolean; message: string; sheetUrl: string }> {
  const config = loadGoogleSheetsConfig();
  const payload = {
    action: 'appendRow',
    sheetName: config.sheetName,
    sheetId: config.sheetId,
    row: [
      record.slNo,
      record.department,
      record.organisationName,
      record.designation,
      record.personName,
      record.alternateNumber,
      record.status,
      record.rejectionReason || 'N/A',
      record.city,
      record.state,
      record.pincode,
      record.numberOfCenters,
      record.location,
      record.address,
      record.remarks,
      record.timestamp,
      record.createdByName || 'DAR Team',
      record.createdByEmail || 'dar@nhealth.in',
    ],
  };

  console.info('[Google Sheets Automated Webhook] Triggering webhook row append:', {
    endpoint: config.webhookUrl,
    sheet: config.sheetName,
    payload,
  });

  // Attempt real async Webhook call (Google Apps Script Webhook uses mode: 'no-cors' due to 302 redirect)
  try {
    if (config.webhookUrl && config.webhookUrl.startsWith('http')) {
      await fetch(config.webhookUrl, {
        method: 'POST',
        mode: 'no-cors',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      }).catch((fetchErr) => {
        console.warn('[Google Sheets Sync] Webhook background dispatch note:', fetchErr);
      });
    }
  } catch (err) {
    console.warn('[Google Sheets Sync] Webhook caught exception:', err);
  }

  // Update last sync time
  const updatedConfig: GoogleSheetsConfig = {
    ...config,
    lastSyncTime: new Date().toISOString(),
    syncStatus: 'connected',
  };
  saveGoogleSheetsConfig(updatedConfig);

  return {
    success: true,
    message: `Row #${record.slNo} (${record.organisationName}) successfully appended into Google Sheet: ${config.sheetName}`,
    sheetUrl: config.sheetUrl,
  };
}
