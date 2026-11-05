import React, { useState, useEffect, useRef, useCallback } from 'react';
import { HEALTHCARE_FALLBACK_SVG, NHEALTH_LOGO_FALLBACK_SVG } from '../utils/imageFallback';

// Nhealth standard company logo from https://ibb.co/7xFjPBHp
const NHEALTH_OFFICIAL_LOGO = 'https://i.ibb.co/DPnzhmNM/Nhealth-logo-8cm-x-8cm-high-quality-3.png';
const NHEALTH_LOGO_FALLBACK = '/nhealth_logo.png';

// 14 Sequential hero showcase images
export const MOBILE_HERO_SLIDES = [
  {
    id: 'hero-doctor-consultations',
    directUrl: 'https://i.ibb.co/LXXWyKKG/Gemini-Generated-Image-veitu3veitu3veit.png',
    title: 'Healthcare at Home - Doctor Consultations',
    targetRoute: '/online-consultation',
  },
  {
    id: 'hero-home-diagnostics',
    directUrl: 'https://i.ibb.co/NnL0Cn0C/Gemini-Generated-Image-fdjjkhfdjjkhfdjj.png',
    title: 'Home Diagnostics & Phlebotomy',
    targetRoute: '/services?id=home-diagnostics-lab-tests',
  },
  {
    id: 'hero-specialized-nursing',
    directUrl: 'https://i.ibb.co/B2ymqK4L/Gemini-Generated-Image-11xdtq11xdtq11xd.png',
    title: 'Specialized Nursing Care at Home',
    targetRoute: '/services?id=specialized-nursing-care',
  },
  {
    id: 'hero-doorstep-pharmacy',
    directUrl: 'https://i.ibb.co/DHpnGnDC/Gemini-Generated-Image-6u7tr76u7tr76u7t.png',
    title: 'Doorstep Pharmacy & Medicine Delivery',
    targetRoute: '/doorstep-pharmacy',
  },
  {
    id: 'hero-home-xray',
    directUrl: 'https://i.ibb.co/gbBfmvMD/Gemini-Generated-Image-w46p8fw46p8fw46p.png',
    title: 'Portable Home X-Ray & Imaging',
    targetRoute: '/services?id=xray-portable-diagnostics',
  },
  {
    id: 'hero-bedside-assistance',
    directUrl: 'https://i.ibb.co/S7VLqYfK/Gemini-Generated-Image-j8lndj8lndj8lndj.png',
    title: 'Bedside Assistance & Attendant Care',
    targetRoute: '/services?id=bedside-assistance',
  },
  {
    id: 'hero-elder-care',
    directUrl: 'https://i.ibb.co/Xk4CK4Qb/Gemini-Generated-Image-v8hyj4v8hyj4v8hy.png',
    title: 'Elder Care & Senior Living Support',
    targetRoute: '/services?id=eldercare-senior-assistance',
  },
  {
    id: 'hero-home-physiotherapy',
    directUrl: 'https://i.ibb.co/bYj1sz2/Gemini-Generated-Image-wmpehewmpehewmpe.png',
    title: 'Home Physiotherapy & Rehabilitation',
    targetRoute: '/services?id=physiotherapy-at-home',
  },
  {
    id: 'hero-online-doctor',
    directUrl: 'https://i.ibb.co/QjjjLH99/Gemini-Generated-Image-t3oaczt3oaczt3oa.png',
    title: 'Online Doctor & Specialist Teleconsultations',
    targetRoute: '/online-consultation',
  },
  {
    id: 'hero-ambulance-emergency',
    directUrl: 'https://i.ibb.co/TD6JvGtJ/Gemini-Generated-Image-wm28q4wm28q4wm28.png',
    title: '24/7 Smart Ambulance & Emergency SOS',
    targetRoute: '/services?id=ambulance-medical-transport',
  },
  {
    id: 'hero-blood-bank',
    directUrl: 'https://i.ibb.co/NgczQvxr/Gemini-Generated-Image-xh1vf8xh1vf8xh1v.png',
    title: 'Blood Bank Network & Donor Support',
    targetRoute: '/services?id=blood-bank-network',
  },
  {
    id: 'hero-dental-care',
    directUrl: 'https://i.ibb.co/Z1XfLgbh/Gemini-Generated-Image-b2p66ob2p66ob2p6.png',
    title: 'Dental Care & Oral Hygiene at Home',
    targetRoute: '/services?id=dental-care-at-home',
  },
  {
    id: 'hero-hospital-opd',
    directUrl: 'https://i.ibb.co/Xf7FhNNw/Gemini-Generated-Image-c46m09c46m09c46m.png',
    title: 'Premium Hospital OPD Assistance',
    targetRoute: '/services?id=priority-opd-specialist-checkin',
  },
  {
    id: 'hero-care-rider',
    directUrl: 'https://i.ibb.co/B5sDXFGT/Gemini-Generated-Image-a2mrwsa2mrwsa2mr.png',
    title: 'Nhealth Care Rider & Medical Transit',
    targetRoute: '/services?id=nhealth-care-ride',
  },
];

interface MobileHeroSplitCarouselProps {
  onServiceClick?: () => void;
}

export const MobileHeroSplitCarousel: React.FC<MobileHeroSplitCarouselProps> = ({ onServiceClick }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const touchStartX = useRef<number | null>(null);

  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % MOBILE_HERO_SLIDES.length);
  }, []);

  const prevSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + MOBILE_HERO_SLIDES.length) % MOBILE_HERO_SLIDES.length);
  }, []);

  // Automated cycling effect every 3.2 seconds
  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(nextSlide, 3200);
    return () => clearInterval(interval);
  }, [nextSlide, isPaused]);

  // Touch swipe support for responsive mobile experience
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchStartX.current - touchEndX;
    if (diff > 40) {
      nextSlide();
    } else if (diff < -40) {
      prevSlide();
    }
    touchStartX.current = null;
  };

  return (
    <div
      className="w-full max-w-none relative flex flex-row overflow-hidden bg-slate-900 border-b border-teal-900/30 select-none"
      style={{ aspectRatio: '5 / 2' }}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      role="region"
      aria-label="Nhealth Hero Showcase"
    >
      {/* LEFT 30% CONTAINER: Standard Official Nhealth Company Logo */}
      <div
        className="w-[30%] h-full bg-white flex items-center justify-center p-2 sm:p-3.5 shrink-0 z-10 relative"
        style={{ backgroundColor: '#ffffff' }}
      >
        <a
          href="/"
          onClick={(e) => {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className="w-full h-full flex items-center justify-center focus:outline-none cursor-pointer"
          title="Nhealth - Healthcare at Home"
        >
          <img
            src={NHEALTH_OFFICIAL_LOGO}
            alt="Nhealth Official Logo"
            loading="eager"
            className="max-h-full max-w-full object-contain transition-transform duration-300 hover:scale-105"
            onError={(e) => {
              const target = e.currentTarget;
              target.onerror = null;
              if (target.src !== window.location.origin + NHEALTH_LOGO_FALLBACK) {
                target.src = NHEALTH_LOGO_FALLBACK;
              } else {
                target.src = NHEALTH_LOGO_FALLBACK_SVG;
              }
            }}
          />
        </a>
      </div>

      {/* RIGHT 70% CONTAINER: Animated Image Slider / Carousel adhering strictly to 5:2 ratio */}
      <div
        className="w-[70%] h-full relative overflow-hidden bg-[#00172b] shrink-0 cursor-pointer"
        onClick={onServiceClick}
      >
        {MOBILE_HERO_SLIDES.map((slide, idx) => {
          const isActive = idx === currentIndex;
          return (
            <div
              key={slide.id}
              className={`absolute inset-0 w-full h-full transition-all duration-700 ease-in-out ${
                isActive
                  ? 'opacity-100 scale-100 z-10'
                  : 'opacity-0 scale-[1.03] pointer-events-none z-0'
              }`}
            >
              <img
                src={slide.directUrl}
                alt={slide.title}
                loading={idx === 0 ? 'eager' : 'lazy'}
                className="w-full h-full object-cover object-center"
                onError={(e) => {
                  const target = e.currentTarget;
                  target.onerror = null;
                  target.src = HEALTHCARE_FALLBACK_SVG;
                }}
              />
              {/* Subtle gradient vignette at bottom for contrast */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />
            </div>
          );
        })}

        {/* Carousel Slide Indicators */}
        <div className="absolute bottom-1.5 sm:bottom-2.5 right-2 sm:right-3 z-20 flex items-center gap-1 bg-black/40 backdrop-blur-md px-1.5 py-0.5 rounded-full border border-white/20">
          <span className="text-[9px] sm:text-[10px] font-bold text-white/90 tabular-nums">
            {currentIndex + 1}
          </span>
          <span className="text-[8px] text-white/50">/</span>
          <span className="text-[8px] text-white/60 tabular-nums">
            {MOBILE_HERO_SLIDES.length}
          </span>
        </div>
      </div>
    </div>
  );
};

export default MobileHeroSplitCarousel;
