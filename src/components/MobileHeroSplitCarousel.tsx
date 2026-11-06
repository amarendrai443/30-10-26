import React, { useState, useEffect, useRef, useCallback } from 'react';
import { HEALTHCARE_FALLBACK_SVG, NHEALTH_LOGO_FALLBACK_SVG } from '../utils/imageFallback';

const NHEALTH_OFFICIAL_LOGO = '/images/Nhealth_logo_8cm_x_8cm_high_quality-3.png';
const NHEALTH_LOGO_FALLBACK = '/Nhealth_logo_8cm_x_8cm_high_quality-3.png';

// Strict 70% Carousel Images from public/images/
export const mobileHero70Images = [
  "/images/bedside assistance.png",
  "/images/Pharmacy to home.png",
  "/images/home X-ray Services.png",
  "/images/online doctor consultations.png",
  "/images/physiotherapy.png",
  "/images/pre booking opd services.png",
  "/images/premium opd services.png",
];

export const heroImages = mobileHero70Images;

export const MOBILE_HERO_SLIDES = mobileHero70Images.map((img, idx) => ({
  id: `hero-${idx + 1}`,
  directUrl: img,
  title: `Healthcare Service ${idx + 1}`,
  targetRoute: '/services',
}));

interface MobileHeroSplitCarouselProps {
  onServiceClick?: () => void;
}

export const MobileHeroSplitCarousel: React.FC<MobileHeroSplitCarouselProps> = ({ onServiceClick }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const touchStartX = useRef<number | null>(null);

  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % heroImages.length);
  }, []);

  const prevSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + heroImages.length) % heroImages.length);
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
        className="w-[30%] h-full bg-white flex items-center justify-center p-1.5 sm:p-2.5 shrink-0 z-10 relative overflow-hidden"
        style={{ backgroundColor: '#ffffff' }}
      >
        <a
          href="/"
          onClick={(e) => {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className="w-full h-full flex items-center justify-center focus:outline-none cursor-pointer bg-white"
          style={{ backgroundColor: '#ffffff' }}
          title="Nhealth - Healthcare at Home"
        >
          <img
            src={NHEALTH_OFFICIAL_LOGO}
            alt="Nhealth Official Logo"
            loading="eager"
            decoding="sync"
            className="w-full h-full object-contain p-1 sm:p-1.5 bg-white transition-transform duration-300 hover:scale-105"
            style={{ backgroundColor: '#ffffff' }}
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
        {heroImages.map((imgSrc, idx) => {
          const isActive = idx === currentIndex;
          return (
            <div
              key={`${imgSrc}-${idx}`}
              className={`absolute inset-0 w-full h-full transition-all duration-700 ease-in-out ${
                isActive
                  ? 'opacity-100 scale-100 z-10'
                  : 'opacity-0 scale-[1.03] pointer-events-none z-0'
              }`}
            >
              <img
                src={imgSrc}
                alt={`Healthcare Showcase ${idx + 1}`}
                loading={idx === 0 ? 'eager' : 'lazy'}
                className="w-full h-full object-cover object-center"
                onError={(e) => {
                  const target = e.currentTarget;
                  target.onerror = null;
                  const rootFallback = imgSrc.replace('/images/', '/');
                  if (!target.dataset.triedRoot && rootFallback !== imgSrc) {
                    target.dataset.triedRoot = 'true';
                    target.src = rootFallback;
                  } else {
                    target.src = HEALTHCARE_FALLBACK_SVG;
                  }
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
            {heroImages.length}
          </span>
        </div>
      </div>
    </div>
  );
};

export default MobileHeroSplitCarousel;
