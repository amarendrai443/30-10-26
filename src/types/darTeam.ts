export type DarDepartment =
  | 'Doctors'
  | 'Labs'
  | 'Pharmacies'
  | 'Manpower'
  | 'Imaging Centers'
  | 'Human Support'
  | 'Hospitals'
  | 'Blood Banks'
  | 'Ambulance Services'
  | 'Surgicals'
  | 'Riders'
  | 'Assistants'
  | 'Insurers'
  | 'Clients';

export const DAR_DEPARTMENTS: DarDepartment[] = [
  'Doctors',
  'Labs',
  'Pharmacies',
  'Manpower',
  'Imaging Centers',
  'Human Support',
  'Hospitals',
  'Blood Banks',
  'Ambulance Services',
  'Surgicals',
  'Riders',
  'Assistants',
  'Insurers',
  'Clients',
];

export type DarStatus = 'Pending' | 'Accepted' | 'Recall' | 'Rejected';

export interface DarRecord {
  id: string;
  slNo: number;
  department: DarDepartment;
  organisationName: string;
  designation: string;
  personName: string;
  alternateNumber: string;
  status: DarStatus;
  rejectionReason?: string;
  city: string;
  state: string;
  pincode: string;
  numberOfCenters: string;
  location: string;
  address: string;
  remarks: string;
  timestamp: string; // ISO string
  createdByName?: string;
  createdByEmail?: string;
  syncedToGoogleSheets: boolean;
  sheetsSyncTimestamp?: string;
}
