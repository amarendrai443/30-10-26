import React, { useState, useMemo } from 'react';
import {
  ArrowLeft,
  Building2,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  Search,
  Filter,
  ArrowRight,
  ExternalLink,
  Award,
  Stethoscope,
  TestTube2,
  Pill,
  Ambulance,
  Phone,
  Clock,
  Layers,
  MapPin,
  HeartPulse
} from 'lucide-react';
import { PartnerApplication, PartnerCategory } from '../types/partner';
import { PartnerLogoItem, AccreditationItem } from '../utils/partnerLogosStorage';

interface PartnersPageProps {
  partners: PartnerApplication[];
  partnerMarqueeItems: PartnerLogoItem[];
  accMarqueeItems: AccreditationItem[];
  partnerScrollDuration?: number;
  accreditationsScrollDuration?: number;
  onBackToHome: () => void;
  onNavigatePartnerWithUs: () => void;
  onOpenBookingFor: (serviceName: string) => void;
}

export const PartnersPage: React.FC<PartnersPageProps> = ({
  partners,
  partnerMarqueeItems,
  accMarqueeItems,
  partnerScrollDuration = 30,
  accreditationsScrollDuration = 35,
  onBackToHome,
  onNavigatePartnerWithUs,
  onOpenBookingFor,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Handle seamless 1-step back navigation
  const handleBack = () => {
    if (typeof window !== 'undefined' && window.history.length > 1) {
      window.history.back();
    } else {
      onBackToHome();
    }
  };

  const categories = [
    { id: 'All', label: 'All Partners' },
    { id: 'Diagnostics', label: 'Diagnostic Labs' },
    { id: 'Hospital', label: 'Hospitals & Clinics' },
    { id: 'Doctor', label: 'Doctors & Specialists' },
    { id: 'Pharmacy', label: 'Pharmacies' },
    { id: 'Ambulance', label: 'Emergency Transit' },
  ];

  const livePartners = useMemo(() => {
    return partners.filter((p) => p.status === 'Live' && !p.isSuspendedDueToInactivity && !p.isRestrictedByAdmin);
  }, [partners]);

  const filteredPartners = useMemo(() => {
    return livePartners.filter((p) => {
      const matchesCategory =
        selectedCategory === 'All' || p.category === selectedCategory;
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        p.entityName.toLowerCase().includes(q) ||
        p.specialty.toLowerCase().includes(q) ||
        p.city.toLowerCase().includes(q) ||
        (p.bioOrExperience && p.bioOrExperience.toLowerCase().includes(q));
      return matchesCategory && matchesSearch;
    });
  }, [livePartners, selectedCategory, searchQuery]);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col text-slate-800">
      {/* Top Header with One-Step Back Navigation */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleBack}
              className="p-1 text-slate-700 hover:text-[#008080] transition-colors cursor-pointer shrink-0"
              aria-label="Go back"
              title="Go back"
            >
              <ArrowLeft className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>

            <div className="h-6 w-px bg-slate-200 hidden xs:block" />

            <a
              href="https://ibb.co/SDYB7XbW"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 hover:opacity-95"
              title="Official Nhealth Logo"
            >
              <img
                src="https://i.ibb.co/wZG4rNV3/Nhealth-logo-8cm-x-8cm-high-quality-1-1.png"
                alt="Nhealth Logo"
                className="w-7 h-7 sm:w-8 sm:h-8 object-contain"
                onError={(e) => {
                  e.currentTarget.src = 'https://i.ibb.co/JW6HFRV0/Nhealth-logo-8cm-x-8cm-high-quality-1-1.png';
                }}
              />
              <div>
                <span className="font-extrabold text-lg sm:text-xl text-[#002b49] tracking-tight">
                  Nhealth<span className="text-[#008080]">™</span>
                </span>
                <span className="hidden md:inline-block ml-2 text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-teal-50 text-[#008080] border border-teal-200">
                  Partner Network
                </span>
              </div>
            </a>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <button
              type="button"
              onClick={onNavigatePartnerWithUs}
              className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-xl border border-[#002b49]/30 text-[#002b49] hover:bg-teal-50/50 hover:border-[#008080] transition-colors whitespace-nowrap cursor-pointer"
            >
              <Building2 className="w-3.5 h-3.5 text-[#008080]" />
              <span className="hidden xs:inline">Join Network as Partner</span>
              <span className="xs:hidden">Join</span>
            </button>
            <button
              type="button"
              onClick={() => onOpenBookingFor('General Consultation')}
              className="inline-flex items-center gap-1.5 text-xs font-bold px-3.5 py-2 rounded-xl bg-[#008080] hover:bg-[#006666] text-white transition-colors whitespace-nowrap cursor-pointer shadow-xs"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Book Service</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content View */}
      <main className="flex-1 pb-20">
        {/* Hero Section */}
        <section className="bg-gradient-to-b from-[#002b49] to-[#00172b] text-white py-12 sm:py-16 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="max-w-5xl mx-auto text-center relative z-10">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-teal-500/20 text-teal-300 text-xs font-extrabold uppercase tracking-wider mb-4 border border-teal-400/30">
              <ShieldCheck className="w-4 h-4 text-teal-300" />
              <span>Accredited Healthcare &amp; Clinical Network</span>
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight leading-tight">
              Our Healthcare &amp; Diagnostic Partners
            </h1>
            <p className="mt-4 text-sm sm:text-base text-slate-300 max-w-3xl mx-auto leading-relaxed">
              Nhealth™ collaborates with premier laboratories, verified medical institutions, certified pharmaceutical networks, and empanelled clinicians across Bharat to guarantee clinical integrity and hospital-grade care at doorstep.
            </p>

            {/* Badges */}
            <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 max-w-4xl mx-auto text-left">
              <div className="bg-white/10 backdrop-blur-md rounded-xl p-3 border border-white/15">
                <div className="text-amber-400 text-xs font-black uppercase">NABL &amp; NABH</div>
                <div className="text-white text-xs font-medium mt-0.5">Accredited testing labs</div>
              </div>
              <div className="bg-white/10 backdrop-blur-md rounded-xl p-3 border border-white/15">
                <div className="text-teal-300 text-xs font-black uppercase">Cold-Chain Logistics</div>
                <div className="text-white text-xs font-medium mt-0.5">Barcode-tracked samples</div>
              </div>
              <div className="bg-white/10 backdrop-blur-md rounded-xl p-3 border border-white/15">
                <div className="text-sky-300 text-xs font-black uppercase">100% Verified</div>
                <div className="text-white text-xs font-medium mt-0.5">Licensed specialists &amp; staff</div>
              </div>
              <div className="bg-white/10 backdrop-blur-md rounded-xl p-3 border border-white/15">
                <div className="text-emerald-300 text-xs font-black uppercase">Cashless Claims</div>
                <div className="text-white text-xs font-medium mt-0.5">Approved insurer integration</div>
              </div>
            </div>
          </div>
        </section>

        {/* Diagnostic Partner Logos Continuous Scrolling Ticker */}
        <section className="py-8 bg-white border-b border-slate-200 overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 mb-3 text-center">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Certified Diagnostic &amp; Clinical Brand Network
            </span>
          </div>
          <div className="w-full overflow-hidden py-2">
            <div
              style={{ animationDuration: `${partnerScrollDuration}s` }}
              className="animate-ticker-ltr flex items-center"
            >
              {partnerMarqueeItems.map((logo, idx) => (
                <div
                  key={`${logo.id}-${idx}`}
                  className="flex items-center justify-center h-20 sm:h-24 px-6 sm:px-8 py-2 bg-slate-50 rounded-xl border border-slate-200/80 shadow-2xs mx-3 shrink-0"
                >
                  <img
                    src={logo.src}
                    alt={logo.name}
                    className="h-10 sm:h-12 w-auto object-contain max-w-[160px]"
                    loading="lazy"
                    onError={(e) => {
                      if (logo.fallback && e.currentTarget.src !== window.location.origin + logo.fallback) {
                        e.currentTarget.src = logo.fallback;
                      }
                    }}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Accreditations Bar */}
          <div className="w-full bg-[#2a2f38] border-t border-slate-700/60 overflow-hidden py-2.5 mt-4">
            <div
              style={{ animationDuration: `${accreditationsScrollDuration}s` }}
              className="animate-accreditations-ticker flex items-center whitespace-nowrap text-white font-black tracking-widest text-xs uppercase"
            >
              {accMarqueeItems.map((acc, idx) => (
                <span key={idx} className="mx-6 sm:mx-8 flex items-center gap-2 text-slate-200">
                  <span className="w-1.5 h-1.5 rounded-full bg-teal-400" />
                  <span>{acc.name}</span>
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* Directory Section: Search & Category Filters */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 sm:pt-14">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            <div>
              <h2 className="text-2xl font-black text-[#002b49]">
                Live Empaneled Network Directory
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                Explore currently active diagnostic centers, hospitals, and licensed medical specialists.
              </p>
            </div>

            {/* Search Input */}
            <div className="relative w-full md:w-80">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search partner, specialty or city..."
                className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-300 bg-white text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#008080] focus:border-transparent"
              />
            </div>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-6 no-scrollbar">
            {categories.map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                  selectedCategory === cat.id
                    ? 'bg-[#002b49] text-white shadow-xs'
                    : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Partners Grid */}
          {filteredPartners.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
              {filteredPartners.map((partner) => (
                <div
                  key={partner.id}
                  className="bg-white rounded-2xl border border-slate-200 hover:border-[#008080] p-5 flex flex-col justify-between shadow-2xs hover:shadow-md transition-all group"
                >
                  <div>
                    <div className="flex items-center justify-between gap-1 mb-2.5">
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-teal-50 text-[#008080] border border-teal-200">
                        {partner.category}
                      </span>
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        Verified Active
                      </span>
                    </div>

                    <h3 className="text-base font-bold text-[#002b49] group-hover:text-[#008080] transition-colors leading-snug line-clamp-1">
                      {partner.entityName}
                    </h3>
                    <p className="text-xs text-teal-700 font-semibold mt-0.5 line-clamp-1">
                      {partner.specialty}
                    </p>

                    <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-2">
                      <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span>{partner.city}, {partner.state}</span>
                    </div>

                    <p className="text-xs text-slate-600 mt-2.5 line-clamp-2">
                      {partner.bioOrExperience || 'Accredited Nhealth healthcare network partner committed to clinical quality.'}
                    </p>

                    <div className="mt-3 text-[10px] text-slate-400 font-mono bg-slate-50 p-1.5 rounded-lg border border-slate-100">
                      Reg / Accreditation: {partner.registrationNumber}
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      if (partner.category === 'Doctor') {
                        onOpenBookingFor('Doctor Home Visits');
                      } else if (partner.category === 'Diagnostics') {
                        onOpenBookingFor('Home Diagnostics');
                      } else if (partner.category === 'Ambulance') {
                        onOpenBookingFor('24/7 Smart Ambulance & SOS');
                      } else if (partner.category === 'Pharmacy') {
                        onOpenBookingFor('Doorstep Pharmacy');
                      } else {
                        onOpenBookingFor(partner.specialty || 'General Consultation');
                      }
                    }}
                    className="mt-4 w-full py-2 px-3 rounded-xl bg-teal-50 hover:bg-[#008080] text-[#008080] hover:text-white text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs"
                  >
                    <span>Connect &amp; Book Service</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-slate-200 p-10 text-center max-w-md mx-auto">
              <Filter className="w-8 h-8 text-slate-300 mx-auto mb-2" />
              <h4 className="text-base font-bold text-slate-800">No Partners Found</h4>
              <p className="text-xs text-slate-500 mt-1">
                Try selecting another category or clearing your search keywords.
              </p>
              <button
                type="button"
                onClick={() => {
                  setSelectedCategory('All');
                  setSearchQuery('');
                }}
                className="mt-3 px-3 py-1.5 rounded-lg bg-teal-50 text-[#008080] text-xs font-bold hover:bg-teal-100"
              >
                Reset Filters
              </button>
            </div>
          )}
        </section>

        {/* Partnership Quality Governance */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16 sm:mt-20">
          <div className="bg-gradient-to-br from-teal-50/70 via-white to-emerald-50/50 rounded-3xl border border-teal-200 p-6 sm:p-10 shadow-sm">
            <div className="max-w-3xl">
              <span className="text-xs font-extrabold uppercase tracking-wider text-[#008080]">
                Strict Quality Standards
              </span>
              <h3 className="text-2xl sm:text-3xl font-black text-[#002b49] mt-1">
                How We Empanel Our Clinical Partners
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 mt-2 leading-relaxed">
                Every doctor, laboratory, pharmacy, and hospital on Nhealth undergoes strict multi-tier credentialing to ensure patients receive hospital-grade medical precision in the safety of their homes.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
              <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-2xs">
                <div className="w-10 h-10 rounded-xl bg-teal-50 text-[#008080] flex items-center justify-center font-bold mb-3">
                  1
                </div>
                <h4 className="text-sm font-bold text-[#002b49]">Statutory Licensure &amp; Degrees</h4>
                <p className="text-xs text-slate-500 mt-1">
                  100% Medical Council registration validation, background checks, and state board approvals.
                </p>
              </div>

              <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-2xs">
                <div className="w-10 h-10 rounded-xl bg-teal-50 text-[#008080] flex items-center justify-center font-bold mb-3">
                  2
                </div>
                <h4 className="text-sm font-bold text-[#002b49]">Cold-Chain &amp; Equipment Calibrations</h4>
                <p className="text-xs text-slate-500 mt-1">
                  Strict temperature-controlled collection kits, portable X-Ray shielding, and NABL proficiency testing.
                </p>
              </div>

              <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-2xs">
                <div className="w-10 h-10 rounded-xl bg-teal-50 text-[#008080] flex items-center justify-center font-bold mb-3">
                  3
                </div>
                <h4 className="text-sm font-bold text-[#002b49]">Continuous Clinical Audits</h4>
                <p className="text-xs text-slate-500 mt-1">
                  Real-time patient feedback audits, turnaround benchmark metrics, and automated protocol adherence checks.
                </p>
              </div>
            </div>

            {/* Bottom CTA */}
            <div className="mt-8 pt-6 border-t border-teal-100 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <h4 className="text-sm sm:text-base font-bold text-[#002b49]">
                  Are you a hospital, diagnostic lab, or medical specialist?
                </h4>
                <p className="text-xs text-slate-500">
                  Expand your patient reach through India's premier integrated at-home healthcare platform.
                </p>
              </div>
              <button
                type="button"
                onClick={onNavigatePartnerWithUs}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-[#002b49] hover:bg-[#001d31] text-white text-xs sm:text-sm font-bold shadow-sm transition-all cursor-pointer"
              >
                <span>Apply as Network Partner</span>
                <ArrowRight className="w-4 h-4 text-teal-400" />
              </button>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};
