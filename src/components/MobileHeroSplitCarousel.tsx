import React, { useState, useEffect, useRef, useCallback } from 'react';

// Nhealth standard company logo from https://ibb.co/7xFjPBHp
const NHEALTH_OFFICIAL_LOGO = 'https://i.ibb.co/DPnzhmNM/Nhealth-logo-8cm-x-8cm-high-quality-3.png';
const NHEALTH_LOGO_FALLBACK = '/nhealth_logo.png';

// 14 Sequential hero showcase images
export const MOBILE_HERO_SLIDES = [
  {
    shareUrl: 'https://ibb.co/fzz5WJJc',
    directUrl: 'https://i.ibb.co/LXXWyKKG/Gemini-Generated-Image-veitu3veitu3veit.png',
    title: 'Healthcare at Home - Doctor Consultations',
  },
  {
    shareUrl: 'https://ibb.co/VpvF9pF9',
    directUrl: 'https://i.ibb.co/NnL0Cn0C/Gemini-Generated-Image-fdjjkhfdjjkhfdjj.png',
    title: 'Home Diagnostics & Phlebotomy',
  },
  {
    shareUrl: 'https://ibb.co/b5sxzRH1',
    directUrl: 'https://i.ibb.co/B2ymqK4L/Gemini-Generated-Image-11xdtq11xdtq11xd.png',
    title: 'Specialized Nursing Care at Home',
  },
  {
    shareUrl: 'https://ibb.co/ZpmCHC68',
    directUrl: 'https://i.ibb.co/DHpnGnDC/Gemini-Generated-Image-6u7tr76u7tr76u7t.png',
    title: 'Doorstep Pharmacy & Medicine Delivery',
  },
  {
    shareUrl: 'https://ibb.co/7x6ZjgJG',
    directUrl: 'https://i.ibb.co/gbBfmvMD/Gemini-Generated-Image-w46p8fw46p8fw46p.png',
    title: 'Portable Home X-Ray & Imaging',
  },
  {
    shareUrl: 'https://ibb.co/XkFwm0Yz',
    directUrl: 'https://i.ibb.co/S7VLqYfK/Gemini-Generated-Image-j8lndj8lndj8lndj.png',
    title: 'Bedside Assistance & Attendant Care',
  },
  {
    shareUrl: 'https://ibb.co/dJc5VcTr',
    directUrl: 'https://i.ibb.co/Xk4CK4Qb/Gemini-Generated-Image-v8hyj4v8hyj4v8hy.png',
    title: 'Elder Care & Senior Living Support',
  },
  {
    shareUrl: 'https://ibb.co/1BYZr8d',
    directUrl: 'https://i.ibb.co/bYj1sz2/Gemini-Generated-Image-wmpehewmpehewmpe.png',
    title: 'Home Physiotherapy & Rehabilitation',
  },
  {
    shareUrl: 'https://ibb.co/zHHHp2ss',
    directUrl: 'https://i.ibb.co/QjjjLH99/Gemini-Generated-Image-t3oaczt3oaczt3oa.png',
    title: 'Online Doctor & Specialist Teleconsultations',
  },
  {
    shareUrl: 'https://ibb.co/WNZ7xXf7',
    directUrl: 'https://i.ibb.co/TD6JvGtJ/Gemini-Generated-Image-wm28q4wm28q4wm28.png',
    title: '24/7 Smart Ambulance & Emergency SOS',
  },
  {
    shareUrl: 'https://ibb.co/1YFxhgZM',
    directUrl: 'https://i.ibb.co/NgczQvxr/Gemini-Generated-Image-xh1vf8xh1vf8xh1v.png',
    title: 'Blood Bank Network & Donor Support',
  },
  {
    shareUrl: 'https://ibb.co/R4bgv6JC',
    directUrl: 'https://i.ibb.co/Z1XfLgbh/Gemini-Generated-Image-b2p66ob2p66ob2p6.png',
    title: 'Dental Care & Oral Hygiene at Home',
  },
  {
    shareUrl: 'https://ibb.co/j9y3cBBp',
    directUrl: 'https://i.ibb.co/Xf7FhNNw/Gemini-Generated-Image-c46m09c46m09c46m.png',
    title: 'Premium Hospital OPD Assistance',
  },
  {
    shareUrl: 'https://ibb.co/xt5vpdYz',
    directUrl: 'https://i.ibb.co/B5sDXFGT/Gemini-Generated-Image-a2mrwsa2mrwsa2mr.png',
    title: 'Nhealth Care Rider & Medical Transit',
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
          href="#home"
          className="w-full h-full flex items-center justify-center focus:outline-none"
          title="Nhealth - Healthcare at Home"
        >
          <img
            src={NHEALTH_OFFICIAL_LOGO}
            alt="Nhealth Official Logo"
            loading="eager"
            className="max-h-full max-w-full object-contain transition-transform duration-300 hover:scale-105"
            onError={(e) => {
              const target = e.currentTarget;
              if (target.src !== window.location.origin + NHEALTH_LOGO_FALLBACK) {
                target.src = NHEALTH_LOGO_FALLBACK;
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
              key={slide.shareUrl}
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
                  if (target.src !== slide.shareUrl) {
                    target.src = slide.shareUrl;
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
            {MOBILE_HERO_SLIDES.length}
          </span>
        </div>
      </div>
    </div>
  );
};

export default MobileHeroSplitCarousel;
