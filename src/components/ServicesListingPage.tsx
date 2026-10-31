import React, { useState, useMemo } from 'react';
import {
  ArrowLeft,
  Search,
  ShieldCheck,
  Clock,
  Sparkles,
  Stethoscope,
  Activity,
  HeartPulse,
  Truck,
  CheckCircle2,
  Calendar,
  X,
  Building2,
} from 'lucide-react';
import { EXTRACTED_SERVICES } from '../data/servicesData';
import { ServiceItem } from '../types/serviceBooking';
import { PartnerApplication } from '../types/partner';

interface ServicesListingPageProps {
  onBack: () => void;
  onSelectService: (serviceName: string) => void;
  partners?: PartnerApplication[];
}

const SERVICE_CATEGORIES = [
  { id: 'all', label: 'All Services (16)' },
  { id: 'doctor', label: 'Doctor Home Visits' },
  { id: 'diagnostic', label: 'Lab & Diagnostics' },
  { id: 'nursing', label: 'Nursing & Eldercare' },
  { id: 'emergency', label: 'Emergency & Transit' },
  { id: 'opd', label: 'OPD & Dental' },
];

export const ServicesListingPage: React.FC<ServicesListingPageProps> = ({
  onBack,
  onSelectService,
  partners,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const filteredServices = useMemo(() => {
    let list = EXTRACTED_SERVICES;

    if (selectedCategory !== 'all') {
      list = list.filter((s) => {
        const idLower = s.id.toLowerCase();
        const nameLower = s.name.toLowerCase();
        if (selectedCategory === 'doctor') {
          return idLower.includes('doctor') || idLower.includes('consult');
        }
        if (selectedCategory === 'diagnostic') {
          return idLower.includes('diagnost') || idLower.includes('xray') || idLower.includes('imaging') || idLower.includes('blood');
        }
        if (selectedCategory === 'nursing') {
          return idLower.includes('nurs') || idLower.includes('elder') || idLower.includes('bedside') || idLower.includes('physio');
        }
        if (selectedCategory === 'emergency') {
          return idLower.includes('ambulance') || idLower.includes('careride') || idLower.includes('careassist');
        }
        if (selectedCategory === 'opd') {
          return idLower.includes('opd') || idLower.includes('dental') || idLower.includes('pharmacy');
        }
        return true;
      });
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(
        (s) =>
          s.name.toLowerCase().includes(q) ||
          s.description.toLowerCase().includes(q) ||
          s.id.toLowerCase().includes(q)
      );
    }

    return list;
  }, [searchQuery, selectedCategory]);

  // Memoized sticky header to avoid UI lag and re-renders on filter/search changes
  const stickyHeader = useMemo(() => (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-2xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onBack}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs sm:text-sm font-bold transition-all active:scale-95 cursor-pointer border border-slate-200"
            title="Back strictly one step"
            aria-label="Back"
          >
            <ArrowLeft className="w-4 h-4 text-[#008080]" />
            <span>Back</span>
          </button>

          <div className="h-6 w-px bg-slate-200 hidden xs:block" />

          <a
            href="https://ibb.co/SDYB7XbW"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 hover:opacity-90 transition-opacity"
            title="Official Nhealth Logo"
          >
            <img
              src="https://i.ibb.co/wZG4rNV3/Nhealth-logo-8cm-x-8cm-high-quality-1-1.png"
              alt="Nhealth Logo"
              className="h-8 sm:h-9 w-auto object-contain shrink-0"
              onError={(e) => {
                e.currentTarget.src = 'https://i.ibb.co/JW6HFRV0/Nhealth-logo-8cm-x-8cm-high-quality-1-1.png';
              }}
            />
            <div className="flex flex-col">
              <span className="font-black text-lg sm:text-xl text-[#002b49] tracking-tight leading-tight">
                Nhealth<span className="text-[#008080]">™</span>
              </span>
              <span className="text-[10px] font-bold text-[#008080] uppercase tracking-wider hidden sm:inline">
                Services Directory
              </span>
            </div>
          </a>
        </div>

        <div className="flex items-center gap-2">
          <span className="hidden md:inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-teal-50 text-[#008080] border border-teal-200">
            <Sparkles className="w-3.5 h-3.5" />
            <span>16 Doorstep Healthcare Services</span>
          </span>
        </div>
      </div>
    </header>
  ), [onBack]);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans">
      {stickyHeader}

      {/* 2. HERO / DIRECTORY TITLE */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6 sm:py-10 space-y-8">
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-teal-50 text-[#008080] border border-teal-200">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Clinical Excellence At Doorstep</span>
          </div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#002b49] tracking-tight">
            Our Unified Healthcare Services
          </h1>
          <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
            Select any healthcare service below to view complete medical protocols, doctor empanelment credentials, transparent pricing, and instant booking with rapid response across Bharat.
          </p>
        </div>

        {/* 3. SEARCH & CATEGORY FILTER BAR */}
        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/90 shadow-xs space-y-4">
          <div className="relative max-w-xl mx-auto">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by service name, e.g. Doctor visits, X-Ray, Nursing, Eldercare..."
              className="w-full pl-10 pr-9 py-2.5 rounded-xl border border-slate-200 bg-slate-50/60 text-sm focus:outline-none focus:ring-2 focus:ring-[#008080]/30 focus:border-[#008080] transition-all"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
                aria-label="Clear search"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Category Tabs */}
          <div className="flex items-center justify-start sm:justify-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            {SERVICE_CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer border ${
                  selectedCategory === cat.id
                    ? 'bg-[#008080] text-white border-teal-600 shadow-xs'
                    : 'bg-slate-100 hover:bg-slate-200/80 text-slate-700 border-slate-200/60'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* 4. SERVICES GRID (Strict 4x4 Grid layout across all screen sizes) */}
        <div>
          {filteredServices.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-2xl border border-slate-200">
              <Search className="w-10 h-10 text-slate-300 mx-auto mb-3" />
              <h3 className="text-base font-bold text-slate-700">No matching services found</h3>
              <p className="text-xs text-slate-500 mt-1">
                Try searching with a different term or select &quot;All Services&quot;.
              </p>
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('all');
                }}
                className="mt-4 px-4 py-2 rounded-xl bg-[#008080] text-white text-xs font-bold"
              >
                Reset Filters
              </button>
            </div>
          ) : (
            <div
              className="grid grid-cols-4 gap-2 sm:gap-3.5 md:gap-4 lg:gap-5 xl:gap-6 w-full"
              style={{ gridTemplateColumns: 'repeat(4, minmax(0, 1fr))' }}
            >
              {filteredServices.map((service, idx) => (
                <button
                  key={service.id}
                  type="button"
                  onClick={() => onSelectService(service.name || service.id)}
                  className="group relative flex flex-col bg-white rounded-lg xs:rounded-xl sm:rounded-2xl border border-slate-200/90 hover:border-[#008080] shadow-2xs hover:shadow-xl transition-all duration-300 hover:-translate-y-1 sm:hover:-translate-y-1.5 cursor-pointer overflow-hidden text-center p-1 xs:p-1.5 sm:p-2.5 md:p-3 lg:p-3.5 focus:outline-none focus:ring-2 sm:focus:ring-3 focus:ring-[#008080]/30 w-full active:scale-[0.98]"
                  aria-label={`View details and book ${service.name}`}
                >
                  {/* Service Image extracted from https://ibb.co/4wQnyzJB */}
                  <div className="w-full aspect-[370/236] bg-slate-50 rounded-md xs:rounded-lg sm:rounded-xl overflow-hidden mb-1 sm:mb-2 md:mb-3 border border-slate-100 flex items-center justify-center shrink-0">
                    <img
                      src={service.cardImage}
                      alt={service.name}
                      loading={idx < 4 ? 'eager' : 'lazy'}
                      decoding="async"
                      className="w-full h-full object-cover object-center transform group-hover:scale-[1.03] transition-transform duration-300 will-change-transform"
                      onError={(e) => {
                        const target = e.currentTarget;
                        if (target.src !== window.location.origin + service.iconImage) {
                          target.src = service.iconImage;
                        }
                      }}
                    />
                  </div>

                  {/* Under each service image: ONLY the exact service name as shown in the source image */}
                  <div className="w-full py-0.5 sm:py-1 px-0.5 flex items-center justify-center flex-1 min-h-[26px] xs:min-h-[30px] sm:min-h-[36px] md:min-h-[44px]">
                    <h3 className="font-bold text-[#002b49] group-hover:text-[#008080] text-[8.5px] xs:text-[10px] sm:text-xs md:text-sm lg:text-[15px] leading-[1.15] sm:leading-snug transition-colors text-center break-words hyphens-auto">
                      {service.name}
                    </h3>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* 5. VERIFIED EMPANELED PARTNER PROVIDERS */}
        {partners && partners.filter((p) => p.status === 'Live').length > 0 && (
          <div className="p-5 sm:p-7 rounded-3xl bg-gradient-to-r from-teal-50/80 via-slate-50 to-teal-50/50 border-2 border-teal-500/30 shadow-sm text-left">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 pb-3 border-b border-teal-100">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-[#008080] text-white flex items-center justify-center font-bold shrink-0">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-black text-[#002b49]">
                    Live Empaneled Network Partners ({partners.filter((p) => p.status === 'Live').length} Active)
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Verified healthcare institutions &amp; certified clinical practitioners currently servicing patients
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {partners
                .filter((p) => p.status === 'Live')
                .slice(0, 8)
                .map((partner) => (
                  <div
                    key={partner.id}
                    className="p-3 rounded-xl bg-white border border-teal-100 shadow-2xs flex flex-col justify-between"
                  >
                    <div>
                      <span className="text-[10px] font-black uppercase tracking-wider text-teal-700 bg-teal-50 px-2 py-0.5 rounded-md border border-teal-200">
                        {partner.category}
                      </span>
                      <h4 className="text-xs sm:text-sm font-bold text-slate-900 mt-1.5 truncate">
                        {partner.entityName}
                      </h4>
                      <p className="text-[11px] text-slate-500 truncate">{partner.city}</p>
                    </div>
                    <div className="mt-2 pt-2 border-t border-slate-100 flex items-center gap-1 text-[10px] text-emerald-600 font-bold">
                      <CheckCircle2 className="w-3 h-3" />
                      <span>Empaneled &amp; Verified</span>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}
      </main>

      {/* 6. BOTTOM RETURN BAR */}
      <footer className="bg-white border-t border-slate-200 py-4 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <button
            type="button"
            onClick={onBack}
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-slate-600 hover:text-[#008080] transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Previous View</span>
          </button>
          <span className="text-xs text-slate-400">Nhealth Unified Healthcare Aggregator</span>
        </div>
      </footer>
    </div>
  );
};
