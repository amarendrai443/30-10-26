/**
 * Google Sheets & Apps Script Integration Configuration
 */

export const SCRIPT_URL: string =
  (typeof import.meta !== 'undefined' && import.meta.env?.VITE_DAR_WEBHOOK_URL) ||
  'https://script.google.com/macros/s/AKfycbz_dar_sync/exec';

export const GOOGLE_SHEET_URL: string =
  (typeof import.meta !== 'undefined' && import.meta.env?.VITE_DAR_GOOGLE_SHEETS_URL) ||
  'https://docs.google.com/spreadsheets/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms/edit?usp=sharing';

export const SHEET_NAME: string = 'DAR_Master_Acquisitions';

export default {
  SCRIPT_URL,
  GOOGLE_SHEET_URL,
  SHEET_NAME,
};
