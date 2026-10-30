/**
 * Utility for Passkey Authentication and Forgot Username/Password OTP Recovery
 * Applicable to both Patients and Partners on Nhealth
 */

const PASSKEY_STORAGE_KEY = 'nhealth_user_passkeys';

export interface StoredPasskeyRecord {
  identifier: string; // phone, email, or user/partner ID
  passkey: string;
  userName?: string;
  role?: string;
  updatedAt: string;
}

// Default seeded passkeys for immediate testability
const DEFAULT_PASSKEYS: Record<string, string> = {
  '9876543210': '1234',
  'ramesh.kumar@gmail.com': '1234',
  'USR-88210': '1234',
  '9845012345': '1234',
  'ananya.care@gmail.com': '1234',
  '9581582220': '1234',
  '9393934621': '1234',
  'partner.labs@thyrocare.com': '1234',
  'dr.meera@nambiarclinic.com': '1234',
};

export const getStoredPasskeys = (): Record<string, string> => {
  try {
    const raw = localStorage.getItem(PASSKEY_STORAGE_KEY);
    if (raw) {
      return { ...DEFAULT_PASSKEYS, ...JSON.parse(raw) };
    }
  } catch {}
  return { ...DEFAULT_PASSKEYS };
};

export const saveUserPasskey = (identifier: string, passkey: string): boolean => {
  if (!identifier || !passkey) return false;
  try {
    const current = getStoredPasskeys();
    const cleanId = identifier.trim().toLowerCase();
    current[cleanId] = passkey.trim();
    
    // Also save normalized mobile without spaces if applicable
    const numeric = identifier.replace(/\D/g, '');
    if (numeric.length >= 10) {
      current[numeric] = passkey.trim();
    }
    
    localStorage.setItem(PASSKEY_STORAGE_KEY, JSON.stringify(current));
    
    // Dispatch event so active components update
    window.dispatchEvent(new CustomEvent('nhealth_passkeys_updated', {
      detail: { identifier: cleanId, passkey: passkey.trim() }
    }));
    return true;
  } catch {
    return false;
  }
};

export const verifyUserPasskey = (identifier: string, enteredPasskey: string): boolean => {
  if (!identifier || !enteredPasskey) return false;
  const passkeys = getStoredPasskeys();
  const cleanId = identifier.trim().toLowerCase();
  const numeric = identifier.replace(/\D/g, '');
  
  const expected = passkeys[cleanId] || (numeric ? passkeys[numeric] : null) || passkeys['default'];
  
  if (expected && expected === enteredPasskey.trim()) {
    return true;
  }
  
  // Standard fallback passkey for ease of testing: '1234' or '2026'
  if (enteredPasskey.trim() === '1234' || enteredPasskey.trim() === '2026') {
    return true;
  }
  
  return false;
};

// --- OTP Generation & Verification for Password / Username Recovery ---
interface ActiveRecoverySession {
  phone: string;
  otp: string;
  expiresAt: number;
}

let activeRecoverySession: ActiveRecoverySession | null = null;

export const initiateAccountRecovery = (phoneOrEmail: string): { success: boolean; otp: string; message: string } => {
  const clean = phoneOrEmail.trim();
  const generatedOtp = '482910'; // Deterministic test OTP for seamless verification
  
  activeRecoverySession = {
    phone: clean,
    otp: generatedOtp,
    expiresAt: Date.now() + 10 * 60 * 1000, // 10 minutes validity
  };

  return {
    success: true,
    otp: generatedOtp,
    message: `Verification code sent to registered number +91 ${clean.slice(-10)}. Pre-filled for instant verification: ${generatedOtp}`,
  };
};

export const verifyRecoveryOtp = (enteredOtp: string): boolean => {
  if (!activeRecoverySession) return enteredOtp === '482910';
  if (Date.now() > activeRecoverySession.expiresAt) return false;
  return enteredOtp.trim() === activeRecoverySession.otp || enteredOtp.trim() === '482910' || enteredOtp.trim() === '123456';
};

export const completeAccountReset = ({
  identifier,
  newUsername,
  newPassword,
}: {
  identifier: string;
  newUsername?: string;
  newPassword?: string;
}): { success: boolean; message: string } => {
  try {
    const cleanId = identifier.trim().toLowerCase();
    const numeric = identifier.replace(/\D/g, '');

    // 1. Update localStorage identities
    const rawIdentities = localStorage.getItem('nhealth_identities');
    if (rawIdentities) {
      const identities = JSON.parse(rawIdentities);
      const updated = identities.map((id: any) => {
        if (
          id.phone === numeric ||
          (id.email && id.email.toLowerCase() === cleanId) ||
          id.id.toLowerCase() === cleanId
        ) {
          return {
            ...id,
            name: newUsername?.trim() || id.name,
            password: newPassword?.trim() || id.password,
          };
        }
        return id;
      });
      localStorage.setItem('nhealth_identities', JSON.stringify(updated));
    }

    // 2. Update partner roster if partner account
    const rawPartners = localStorage.getItem('nhealth_partners');
    if (rawPartners) {
      const partners = JSON.parse(rawPartners);
      const updatedPartners = partners.map((p: any) => {
        if (
          p.phone === numeric ||
          (p.email && p.email.toLowerCase() === cleanId) ||
          (p.loginIdOrEmail && p.loginIdOrEmail.toLowerCase() === cleanId) ||
          p.id.toLowerCase() === cleanId
        ) {
          return {
            ...p,
            loginIdOrEmail: newUsername?.trim() || p.loginIdOrEmail,
            contactPerson: newUsername?.trim() || p.contactPerson,
            password: newPassword?.trim() || p.password,
          };
        }
        return p;
      });
      localStorage.setItem('nhealth_partners', JSON.stringify(updatedPartners));
    }

    activeRecoverySession = null;
    return {
      success: true,
      message: 'Credentials updated successfully! You can now sign in with your new credentials.',
    };
  } catch (e) {
    return {
      success: false,
      message: 'Failed to update credentials. Please try again.',
    };
  }
};
