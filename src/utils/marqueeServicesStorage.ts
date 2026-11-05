export interface MarqueeServiceItem {
  id: string;
  name: string;
  directUrl: string;
  hoverImage?: string;
  localFile?: string;
  pageUrl?: string;
  tagline: string;
  description?: string;
  category: string;
  iconName?: string;
  gradient?: string;
  aspectRatio?: string; // Strict 3:2 aspect ratio setting
  active?: boolean;
}

export const SERVICE_HOVER_IMAGE_MAP: Record<string, string> = {
  'bedside assistance': '/images/bedside-assistance-3x1.png',
  'bedside-assistance': '/images/bedside-assistance-3x1.png',
  'bedside': '/images/bedside-assistance-3x1.png',
  'eldercare': '/images/eldercare-3x1.png',
  'pharmacy to home': '/images/Pharmacy-to-home-3x1.png',
  'pharmacy-to-home': '/images/Pharmacy-to-home-3x1.png',
  'pharmacy delivery': '/images/Pharmacy-to-home-3x1.png',
  'pharmacy': '/images/Pharmacy-to-home-3x1.png',
  'doctor home visits': '/images/doctor-home-visits-3x1.png',
  'doctor-home-visits': '/images/doctor-home-visits-3x1.png',
  'doctor visits': '/images/doctor-home-visits-3x1.png',
  'doctor-visits': '/images/doctor-home-visits-3x1.png',
  'lab test at home': '/images/labtest-at-home-3x1.png',
  'labtest-at-home': '/images/labtest-at-home-3x1.png',
  'lab tests': '/images/labtest-at-home-3x1.png',
  'online doctor consultations': '/images/online-doctor-consultations-3x1.png',
  'online-doctor-consultations': '/images/online-doctor-consultations-3x1.png',
  'teleconsult': '/images/online-doctor-consultations-3x1.png',
  'physiotherapy': '/images/physiotherapy-3x1.png',
  'prebooking opd services': '/images/prebooking-opd-services-3x1.png',
  'prebooking-opd-services': '/images/prebooking-opd-services-3x1.png',
  'pre-booking opd': '/images/prebooking-opd-services-3x1.png',
  'prebook-opd': '/images/prebooking-opd-services-3x1.png',
  'premium opd services': '/images/premium-opd-services-3x1.png',
  'premium-opd-services': '/images/premium-opd-services-3x1.png',
  'premium-opd': '/images/premium-opd-services-3x1.png',
  'home x-ray services': '/images/home-X-ray-Services-3x1.png',
  'home-x-ray-services': '/images/home-X-ray-Services-3x1.png',
  'home-xray': '/images/home-X-ray-Services-3x1.png',
  'nhealth care ride': '/images/nhealth-care-ride-3x1.png',
  'nhealth-care-ride': '/images/nhealth-care-ride-3x1.png',
  'care-ride': '/images/nhealth-care-ride-3x1.png',
  'nhealth care assist': '/images/nhealth-care-assist-3x1.png',
  'nhealth-care-assist': '/images/nhealth-care-assist-3x1.png',
  'care assist': '/images/nhealth-care-assist-3x1.png',
  'care-assist': '/images/nhealth-care-assist-3x1.png',
};

export const DEFAULT_MARQUEE_SERVICES: MarqueeServiceItem[] = [
  {
    id: 'bedside-assistance',
    name: 'Bedside Assistance',
    directUrl: '/bedside-assistance.png',
    hoverImage: '/images/bedside-assistance-3x1.png',
    localFile: '/bedside-assistance.png',
    pageUrl: '/services?id=bedside-assistance',
    tagline: 'Compassionate Post-Hospitalization Care',
    category: 'Nursing',
    iconName: 'HeartPulse',
    gradient: 'from-[#002b49] to-[#059669]',
    active: true,
  },
  {
    id: 'eldercare',
    name: 'Eldercare',
    directUrl: '/service-eldercare.png',
    hoverImage: '/images/eldercare-3x1.png',
    localFile: '/eldercare-3x1.png',
    pageUrl: '/services?id=eldercare-assistance',
    tagline: 'Specialized Senior Well-being & Monitoring',
    category: 'Elderly Care',
    iconName: 'HeartHandshake',
    gradient: 'from-[#002b49] to-[#d97706]',
    active: true,
  },
  {
    id: 'pharmacy-to-home',
    name: 'Pharmacy to Home',
    directUrl: '/Pharmacy to home.png',
    hoverImage: '/images/Pharmacy-to-home-3x1.png',
    localFile: '/Pharmacy to home.png',
    pageUrl: '/doorstep-pharmacy',
    tagline: 'Direct Temperature-Controlled Medicines',
    category: 'Pharmacy',
    iconName: 'Pill',
    gradient: 'from-[#002b49] to-[#10b981]',
    active: true,
  },
  {
    id: 'doctor-home-visits',
    name: 'Doctor Home Visits',
    directUrl: '/service-doctor-visits.png',
    hoverImage: '/images/doctor-home-visits-3x1.png',
    localFile: '/doctor-home-visits-3x1.png',
    pageUrl: '/services?id=doctor-home-consult',
    tagline: 'Expert Physicians at Your Doorstep',
    category: 'Home Visit',
    iconName: 'Stethoscope',
    gradient: 'from-[#002b49] to-[#0284c7]',
    active: true,
  },
  {
    id: 'labtest-at-home',
    name: 'Lab Test at Home',
    directUrl: '/service-home-diagnostics.png',
    hoverImage: '/images/labtest-at-home-3x1.png',
    localFile: '/labtest-at-home-3x1.png',
    pageUrl: '/services?id=home-diagnostic-tests',
    tagline: 'Certified Sample Collection & Rapid Reports',
    category: 'Diagnostics',
    iconName: 'HeartPulse',
    gradient: 'from-[#002b49] to-[#8b5cf6]',
    active: true,
  },
  {
    id: 'online-doctor-consultations',
    name: 'Online Doctor Consultations',
    directUrl: '/online doctor consultations.png',
    hoverImage: '/images/online-doctor-consultations-3x1.png',
    localFile: '/online doctor consultations.png',
    pageUrl: '/online-consultation',
    tagline: 'Instant Specialist Video & E-Prescription',
    category: 'Tele-Health',
    iconName: 'Video',
    gradient: 'from-[#002b49] to-[#0284c7]',
    active: true,
  },
  {
    id: 'physiotherapy',
    name: 'Physiotherapy',
    directUrl: '/physiotherapy.png',
    hoverImage: '/images/physiotherapy-3x1.png',
    localFile: '/physiotherapy.png',
    pageUrl: '/services?id=physiotherapy-at-home',
    tagline: 'Home Rehabilitation & Mobility Care',
    category: 'Therapy',
    iconName: 'Activity',
    gradient: 'from-[#002b49] to-[#008080]',
    active: true,
  },
  {
    id: 'prebooking-opd-services',
    name: 'Prebooking OPD Services',
    directUrl: '/pre booking opd services.png',
    hoverImage: '/images/prebooking-opd-services-3x1.png',
    localFile: '/pre booking opd services.png',
    pageUrl: '/services?id=priority-opd-specialist-checkin',
    tagline: 'Guaranteed Consult Slots & Express Tokens',
    category: 'Scheduling',
    iconName: 'CalendarCheck',
    gradient: 'from-[#00385e] to-[#0284c7]',
    active: true,
  },
  {
    id: 'premium-opd-services',
    name: 'Premium OPD Services',
    directUrl: '/premium opd services.png',
    hoverImage: '/images/premium-opd-services-3x1.png',
    localFile: '/premium opd services.png',
    pageUrl: '/services?id=priority-opd-specialist-checkin',
    tagline: 'Priority Zero-Wait Specialist Clinic Access',
    category: 'Priority Care',
    iconName: 'Award',
    gradient: 'from-[#1e293b] to-[#0d9488]',
    active: true,
  },
  {
    id: 'home-xray-services',
    name: 'Home X-Ray Services',
    directUrl: '/home X-ray Services.png',
    hoverImage: '/images/home-X-ray-Services-3x1.png',
    localFile: '/home X-ray Services.png',
    pageUrl: '/services?id=xray-portable-diagnostics',
    tagline: 'Portable Digital Radiography At Doorstep',
    category: 'Imaging',
    iconName: 'Layers',
    gradient: 'from-[#0f172a] to-[#008080]',
    active: true,
  },
  {
    id: 'nhealth-care-ride',
    name: 'Nhealth Care Ride',
    directUrl: '/nhealth care ride.png',
    hoverImage: '/images/nhealth-care-ride-3x1.png',
    localFile: '/nhealth care ride.png',
    pageUrl: '/services?id=nhealth-care-ride',
    tagline: 'Assisted Non-Emergency Medical Transit',
    category: 'Transit',
    iconName: 'Car',
    gradient: 'from-[#003e6b] to-[#0d9488]',
    active: true,
  },
  {
    id: 'nhealth-care-assist',
    name: 'Nhealth Care Assist',
    directUrl: '/nhealth care assist.png',
    hoverImage: '/images/nhealth-care-assist-3x1.png',
    localFile: '/nhealth care assist.png',
    pageUrl: '/services?id=nhealth-careassist',
    tagline: 'Trained Home Attendants & Daily Support',
    category: 'Personal Care',
    iconName: 'HeartHandshake',
    gradient: 'from-[#0a3d66] to-[#0f766e]',
    active: true,
  },
];

const STORAGE_KEY = 'nhealth_marquee_services';
export const MARQUEE_SERVICES_UPDATED_EVENT = 'nhealth_marquee_services_updated';

const INTERNAL_SERVICE_ROUTING_MAP: Record<string, string> = {
  'physiotherapy': '/services?id=physiotherapy-at-home',
  'care-ride': '/services?id=nhealth-care-ride',
  'nhealth care ride': '/services?id=nhealth-care-ride',
  'nhealth-care-ride': '/services?id=nhealth-care-ride',
  'teleconsult': '/online-consultation',
  'online doctor consultations': '/online-consultation',
  'online-doctor-consultations': '/online-consultation',
  'care-assist': '/services?id=nhealth-careassist',
  'care assist': '/services?id=nhealth-careassist',
  'nhealth-care-assist': '/services?id=nhealth-careassist',
  'home-xray': '/services?id=xray-portable-diagnostics',
  'home x-ray services': '/services?id=xray-portable-diagnostics',
  'home-xray-services': '/services?id=xray-portable-diagnostics',
  'bedside': '/services?id=bedside-assistance',
  'bedside assistance': '/services?id=bedside-assistance',
  'bedside-assistance': '/services?id=bedside-assistance',
  'premium-opd': '/services?id=priority-opd-specialist-checkin',
  'premium opd services': '/services?id=priority-opd-specialist-checkin',
  'premium-opd-services': '/services?id=priority-opd-specialist-checkin',
  'pharmacy': '/doorstep-pharmacy',
  'pharmacy delivery': '/doorstep-pharmacy',
  'pharmacy to home': '/doorstep-pharmacy',
  'pharmacy-to-home': '/doorstep-pharmacy',
  'prebook-opd': '/services?id=priority-opd-specialist-checkin',
  'pre-booking opd': '/services?id=priority-opd-specialist-checkin',
  'prebooking-opd-services': '/services?id=priority-opd-specialist-checkin',
  'doctor home visits': '/services?id=doctor-home-consult',
  'doctor-home-visits': '/services?id=doctor-home-consult',
  'lab test at home': '/services?id=home-diagnostic-tests',
  'labtest-at-home': '/services?id=home-diagnostic-tests',
  'eldercare': '/services?id=eldercare-assistance',
};

const DEFAULT_LOCAL_IMAGE_MAP: Record<string, string> = {
  'bedside assistance': '/bedside-assistance.png',
  'bedside-assistance': '/bedside-assistance.png',
  'bedside': '/bedside-assistance.png',
  'eldercare': '/service-eldercare.png',
  'pharmacy to home': '/Pharmacy to home.png',
  'pharmacy-to-home': '/Pharmacy to home.png',
  'pharmacy delivery': '/Pharmacy to home.png',
  'pharmacy': '/Pharmacy to home.png',
  'doctor home visits': '/service-doctor-visits.png',
  'doctor-home-visits': '/service-doctor-visits.png',
  'lab test at home': '/service-home-diagnostics.png',
  'labtest-at-home': '/service-home-diagnostics.png',
  'online doctor consultations': '/online doctor consultations.png',
  'online-doctor-consultations': '/online doctor consultations.png',
  'teleconsult': '/online doctor consultations.png',
  'physiotherapy': '/physiotherapy.png',
  'prebooking opd services': '/pre booking opd services.png',
  'prebooking-opd-services': '/pre booking opd services.png',
  'pre-booking opd': '/pre booking opd services.png',
  'prebook-opd': '/pre booking opd services.png',
  'premium opd services': '/premium opd services.png',
  'premium-opd-services': '/premium opd services.png',
  'premium-opd': '/premium opd services.png',
  'home x-ray services': '/home X-ray Services.png',
  'home-x-ray-services': '/home X-ray Services.png',
  'home-xray': '/home X-ray Services.png',
  'nhealth care ride': '/nhealth care ride.png',
  'nhealth-care-ride': '/nhealth care ride.png',
  'care-ride': '/nhealth care ride.png',
  'nhealth care assist': '/nhealth care assist.png',
  'nhealth-care-assist': '/nhealth care assist.png',
  'care assist': '/nhealth care assist.png',
  'care-assist': '/nhealth care assist.png',
};

export const getStoredMarqueeServices = (): MarqueeServiceItem[] => {
  if (typeof window === 'undefined') return DEFAULT_MARQUEE_SERVICES;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_MARQUEE_SERVICES));
      return DEFAULT_MARQUEE_SERVICES;
    }
    let parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      let needsUpdate = false;

      // Migrate existing items to have local paths, hoverImage, and internal routing
      const updatedList = parsed.map((item: MarqueeServiceItem) => {
        const idKey = (item.id || '').toLowerCase();
        const nameKey = (item.name || '').toLowerCase();
        const hoverImg = SERVICE_HOVER_IMAGE_MAP[idKey] || SERVICE_HOVER_IMAGE_MAP[nameKey];
        const defaultLocal = DEFAULT_LOCAL_IMAGE_MAP[idKey] || DEFAULT_LOCAL_IMAGE_MAP[nameKey];
        const internalRoute = INTERNAL_SERVICE_ROUTING_MAP[idKey] || INTERNAL_SERVICE_ROUTING_MAP[nameKey];
        let updatedItem = { ...item };

        // Replace any broken ImgBB links with reliable local assets
        if (!updatedItem.directUrl || updatedItem.directUrl.includes('ibb.co')) {
          if (defaultLocal) {
            updatedItem.directUrl = defaultLocal;
            needsUpdate = true;
          }
        }

        // Strictly enforce that hoverImage is exclusively the matching local -3x1.png asset
        if (hoverImg && (!updatedItem.hoverImage || updatedItem.hoverImage !== hoverImg || !updatedItem.hoverImage.endsWith('-3x1.png'))) {
          updatedItem.hoverImage = hoverImg;
          needsUpdate = true;
        }

        // Sanitize any external pageUrls
        if (!updatedItem.pageUrl || updatedItem.pageUrl.includes('ibb.co') || updatedItem.pageUrl.startsWith('http')) {
          if (internalRoute) {
            needsUpdate = true;
            updatedItem.pageUrl = internalRoute;
          }
        }

        return updatedItem;
      });

      // Ensure all 12 services are present
      const existingIds = new Set(updatedList.map((s) => s.id.toLowerCase()));
      for (const defService of DEFAULT_MARQUEE_SERVICES) {
        if (!existingIds.has(defService.id.toLowerCase())) {
          updatedList.push(defService);
          needsUpdate = true;
        }
      }

      if (needsUpdate) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedList));
      }
      return updatedList;
    }
    return DEFAULT_MARQUEE_SERVICES;
  } catch {
    return DEFAULT_MARQUEE_SERVICES;
  }
};

export const saveStoredMarqueeServices = (items: MarqueeServiceItem[]): void => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    window.dispatchEvent(new CustomEvent(MARQUEE_SERVICES_UPDATED_EVENT, { detail: items }));
  } catch (err) {
    console.error('Failed to save marquee services to localStorage:', err);
  }
};

export const addMarqueeService = (
  item: Omit<MarqueeServiceItem, 'id'> & { id?: string }
): MarqueeServiceItem => {
  const current = getStoredMarqueeServices();
  const newItem: MarqueeServiceItem = {
    ...item,
    id: item.id || `srv-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 5)}`,
    active: item.active !== false,
  };
  const updated = [newItem, ...current];
  saveStoredMarqueeServices(updated);
  return newItem;
};

export const updateMarqueeService = (
  id: string,
  updates: Partial<MarqueeServiceItem>
): void => {
  const current = getStoredMarqueeServices();
  const updated = current.map((s) => (s.id === id ? { ...s, ...updates } : s));
  saveStoredMarqueeServices(updated);
};

export const deleteMarqueeService = (id: string): void => {
  const current = getStoredMarqueeServices();
  const updated = current.filter((s) => s.id !== id);
  saveStoredMarqueeServices(updated.length > 0 ? updated : DEFAULT_MARQUEE_SERVICES);
};

export const toggleMarqueeServiceActive = (id: string): void => {
  const current = getStoredMarqueeServices();
  const updated = current.map((s) => (s.id === id ? { ...s, active: !s.active } : s));
  saveStoredMarqueeServices(updated);
};

export const resetMarqueeServices = (): void => {
  saveStoredMarqueeServices(DEFAULT_MARQUEE_SERVICES);
};
