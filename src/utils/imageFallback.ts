import React from 'react';

/**
 * Universal self-contained SVG placeholders that never fail (offline/network resilient).
 * Provides graceful visual fallbacks when external CDNs (like ImgBB) experience downtime.
 */
export const HEALTHCARE_FALLBACK_SVG =
  'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="600" height="400" viewBox="0 0 600 400"><defs><linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="%23002b49"/><stop offset="100%" stop-color="%23008080"/></linearGradient></defs><rect width="600" height="400" fill="url(%23g)"/><g fill="%23ffffff" opacity="0.95"><circle cx="300" cy="180" r="46" fill="%23008080" stroke="%23ffffff" stroke-width="4"/><rect x="294" y="152" width="12" height="56" rx="4" fill="%23ffffff"/><rect x="272" y="174" width="56" height="12" rx="4" fill="%23ffffff"/></g><text x="300" y="262" font-family="-apple-system,BlinkMacSystemFont,\'Segoe UI\',Roboto,sans-serif" font-size="18" font-weight="bold" fill="%23ffffff" text-anchor="middle" letter-spacing="0.5">Nhealth Specialized Healthcare</text><text x="300" y="288" font-family="-apple-system,BlinkMacSystemFont,\'Segoe UI\',Roboto,sans-serif" font-size="12" font-weight="500" fill="%23e6f4f4" text-anchor="middle" opacity="0.85">Verified Clinical Excellence at Doorstep</text></svg>';

export const NHEALTH_LOGO_FALLBACK_SVG =
  'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="200" height="60" viewBox="0 0 200 60"><rect width="200" height="60" rx="8" fill="%23002b49"/><text x="24" y="40" font-family="-apple-system,BlinkMacSystemFont,\'Segoe UI\',Roboto,sans-serif" font-size="26" font-weight="900" fill="%23ffffff">Nhealth<tspan fill="%23008080">™</tspan></text></svg>';

/**
 * Universal safe image fallback error handler.
 * Prevents recursive loops and replaces broken/unavailable CDN images instantly.
 */
export const handleImageFallback = (
  e: React.SyntheticEvent<HTMLImageElement, Event>,
  backupUrl?: string
) => {
  const target = e.currentTarget;
  target.onerror = null; // Prevent loop
  if (backupUrl && target.src !== backupUrl) {
    target.src = backupUrl;
  } else {
    target.src = HEALTHCARE_FALLBACK_SVG;
  }
};

export const handleLogoFallback = (
  e: React.SyntheticEvent<HTMLImageElement, Event>,
  backupUrl?: string
) => {
  const target = e.currentTarget;
  target.onerror = null;
  if (backupUrl && target.src !== backupUrl) {
    target.src = backupUrl;
  } else {
    target.src = NHEALTH_LOGO_FALLBACK_SVG;
  }
};
