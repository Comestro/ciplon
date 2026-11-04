import { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight, Award, Globe, Sparkles, HeartPulse, ArrowRight } from 'lucide-react';
import Container from '../common/Container';

export default function IntasHeroBanner({ onExploreProducts, onContactUs, onOpenEnquiryModal }) {
  const [activeSlide, setActiveSlide] = useState(0);
  const [activeMobileCard, setActiveMobileCard] = useState(0);
  const cardScrollRef = useRef(null);

  const slides = [
    {
      id: 0,
      image: '/images/hero_indian_doctors.jpg',
      headlinePre: 'Quality-First Pharmaceutical Formulations',
      headlineMain: 'Committed to Healthcare Excellence',
      headlineSub: 'Trusted formulations through our',
      headlineSubBold: 'WHO-GMP partners',
      description: 'Ciplon Pharma markets high-potency, affordable finished formulations manufactured by certified partners Walpar Wellness & Akums Group.',
      tag: 'Quality Formulations',
    },
    {
      id: 1,
      image: '/images/pharma_automation_line.jpg',
      headlinePre: 'Advanced Contract Manufacturing',
      headlineMain: 'High-Precision Automated Plants',
      headlineSub: 'Partnered with India’s leading',
      headlineSubBold: 'manufacturing giants',
      description: 'Manufactured at WHO-GMP & ISO 9001:2015 certified facilities with automated blistering, serialization, and strict batch release.',
      tag: 'Walpar & Akums',
    },
    {
      id: 2,
      image: '/images/hero_indian_scientists.jpg',
      headlinePre: 'Translating Pharmaceutical Science',
      headlineMain: 'Into Life-Changing Smiles',
      headlineSub: 'Continuous focus on',
      headlineSubBold: 'essential medicines',
      description: 'Formulations developed with verified bioavailability, clinical efficacy, and uncompromising batch-level quality assurance.',
      tag: 'Therapeutic Excellence',
    },
    {
      id: 3,
      image: '/images/hero_indian_consultation.jpg',
      headlinePre: 'Patient-Centric Healthcare',
      headlineMain: 'Compassionate Medical Care',
      headlineSub: 'Trusted by doctors across',
      headlineSubBold: 'clinical therapies',
      description: 'Delivering bioequivalent, accessible therapeutic treatments that enhance patient outcomes and community wellness.',
      tag: 'Clinical Trust',
    },
  ];

  // Auto rotate slides
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % slides.length);
    }, 6500);
    return () => clearInterval(timer);
  }, [slides.length]);

  const handlePrevSlide = () => {
    setActiveSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const handleNextSlide = () => {
    setActiveSlide((prev) => (prev + 1) % slides.length);
  };

  const currentSlide = slides[activeSlide];

  // 4 Docked Feature Cards
  const cards = [
    {
      icon: Award,
      title: "Committed to Quality by Design (QbD)",
      description: "Our dedicated commitment to clinical precision, verified bioavailability, and stringent analytical standards across every formulation.",
      actionText: "Our Quality Vision",
    },
    {
      icon: Globe,
      title: "WHO-GMP Manufacturing Allies",
      description: "Produced at state-of-the-art facilities of Walpar Wellness and Akums Drugs & Pharmaceuticals Ltd.",
      actionText: "View Mfg Partners",
    },
    {
      icon: Sparkles,
      title: "A Dynamic Product Basket",
      description: "Comprehensive therapeutic portfolio covering essential neuro, cardio, analgesic, anti-infective, and metabolic treatments.",
      actionText: "Explore Portfolio",
    },
    {
      icon: HeartPulse,
      title: "Accessible Patient Healthcare",
      description: "Bridging clinical excellence with affordability to supply trusted hospital and retail formulations across India.",
      actionText: "View Therapies",
    },
  ];

  // Mobile horizontal swipe detection for cards
  const handleCardScroll = () => {
    if (!cardScrollRef.current) return;
    const container = cardScrollRef.current;
    const center = container.scrollLeft + container.offsetWidth / 2;
    const children = Array.from(container.children);
    let closestIndex = 0;
    let minDistance = Infinity;

    children.forEach((child, idx) => {
      const childCenter = child.offsetLeft + child.offsetWidth / 2;
      const distance = Math.abs(center - childCenter);
      if (distance < minDistance) {
        minDistance = distance;
        closestIndex = idx;
      }
    });
    setActiveMobileCard(closestIndex);
  };

  const scrollCardToIndex = (idx) => {
    if (!cardScrollRef.current) return;
    const container = cardScrollRef.current;
    const target = container.children[idx];
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
      setActiveMobileCard(idx);
    }
  };

  return (
    <section className="relative w-full bg-slate-50 select-none overflow-hidden">
      {/* Hero Visual Container */}
      <div className="relative w-full h-[460px] sm:h-[520px] md:h-[580px] lg:h-[620px] overflow-hidden bg-slate-900">
        {/* Background Slide Images with smooth fade */}
        {slides.map((slide, index) => (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              index === activeSlide ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
            }`}
          >
            <img
              src={slide.image}
              alt={slide.headlineMain}
              className="w-full h-full object-cover object-center transform scale-100 transition-transform duration-[7000ms] ease-out hover:scale-105"
            />
            {/* Dark & Blue Pharmaceutical Corporate Overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-slate-950/85 via-slate-900/65 to-sky-950/40" />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-slate-950/30" />
          </div>
        ))}

        {/* Hanging Healthcare Commitment Shield Badge (Top Right) */}
        <div className="absolute top-0 right-4 sm:right-8 lg:right-16 z-30 pointer-events-auto filter drop-shadow-md">
          <div className="w-24 sm:w-28 md:w-32 flex flex-col items-center">
            {/* Top Red Section */}
            <div className="w-full bg-[#e21838] text-white pt-2.5 pb-2.5 px-2 flex flex-col items-center shadow-md">
              <div className="flex items-center gap-1 text-amber-300 text-xs mb-0.5">
                <span>★</span><span>★</span><span>★</span>
              </div>
              <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-center leading-tight">
                QUALITY FIRST
              </span>
              <span className="text-[8px] sm:text-[9px] font-medium uppercase tracking-wider text-center text-sky-100">
                PATIENT CENTRIC
              </span>
            </div>

            {/* Bottom Navy Shield Section with V-notch point */}
            <div
              className="w-full bg-[#0a2540] text-white pt-2 pb-4 px-1.5 flex flex-col items-center text-center shadow-md"
              style={{
                clipPath: 'polygon(0% 0%, 100% 0%, 100% 82%, 50% 100%, 0% 82%)',
              }}
            >
              <span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-widest text-white leading-none">
                COMMITTED
              </span>
              <span className="text-[7px] sm:text-[8px] font-medium text-sky-200 uppercase tracking-tight mt-1 block">
                TO EXCELLENCE
              </span>
              <span className="text-[8px] sm:text-[9px] font-bold text-amber-300 uppercase tracking-wider mt-0.5 block">
                HEALTHCARE
              </span>
            </div>
          </div>
        </div>

        {/* Slide Content Overlay */}
        <div className="absolute inset-0 z-20 flex items-center pt-2 pb-14 sm:pb-20">
          <Container>
            <div className="max-w-2xl sm:max-w-3xl text-white pl-2 sm:pl-4">
              {/* Slide Pre-Headline */}
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-black/40 backdrop-blur-md border border-[#c59324]/40 text-xs sm:text-sm font-semibold tracking-wide text-[#dfad36] mb-3 sm:mb-4">
                <span>{currentSlide.headlinePre}</span>
              </div>

              {/* Main Headline */}
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-[54px] font-bold tracking-tight leading-[1.18] text-white drop-shadow-md">
                {currentSlide.headlineMain}
              </h1>

              {/* Sub-Headline */}
              <div className="mt-3 sm:mt-4 text-lg sm:text-2xl md:text-3xl font-light text-slate-100 flex flex-wrap items-center gap-x-2 gap-y-1">
                <span>{currentSlide.headlineSub}</span>
                <span className="font-bold text-[#dfad36] underline decoration-[#c59324] decoration-2 underline-offset-4">
                  {currentSlide.headlineSubBold}
                </span>
              </div>

              <p className="mt-3 text-sm sm:text-base text-slate-200/90 max-w-xl font-normal leading-relaxed hidden sm:block">
                {currentSlide.description}
              </p>

              {/* Action Buttons */}
              <div className="mt-6 sm:mt-8 flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={onExploreProducts}
                  className="px-6 py-2.5 sm:py-3 rounded-full bg-gradient-to-r from-[#c59324] via-[#d4a029] to-[#b8831b] hover:from-[#b8831b] hover:to-[#9f6d0f] text-white font-bold text-xs sm:text-sm transition-all shadow-lg shadow-[#c59324]/30 hover:scale-[1.02] cursor-pointer flex items-center gap-2"
                >
                  <span>Explore Formulations</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  type="button"
                  onClick={() => {
                    const el = document.getElementById('about');
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="px-6 py-2.5 sm:py-3 rounded-full bg-white/15 hover:bg-white/25 text-white font-semibold text-xs sm:text-sm backdrop-blur-md border border-white/30 transition-all cursor-pointer"
                >
                  Discover Ciplon
                </button>
              </div>
            </div>
          </Container>
        </div>

        {/* Carousel Prev/Next Buttons */}
        <button
          type="button"
          onClick={handlePrevSlide}
          className="absolute left-3 sm:left-6 top-1/2 -translate-y-1/2 z-30 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-black/40 hover:bg-[#0c2340] hover:border-[#c59324] text-white backdrop-blur-md border border-white/20 flex items-center justify-center transition-all cursor-pointer shadow-lg group"
          aria-label="Previous Slide"
        >
          <ChevronLeft className="w-6 h-6 group-hover:-translate-x-0.5 transition-transform" />
        </button>

        <button
          type="button"
          onClick={handleNextSlide}
          className="absolute right-3 sm:right-6 top-1/2 -translate-y-1/2 z-30 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-black/40 hover:bg-[#0c2340] hover:border-[#c59324] text-white backdrop-blur-md border border-white/20 flex items-center justify-center transition-all cursor-pointer shadow-lg group"
          aria-label="Next Slide"
        >
          <ChevronRight className="w-6 h-6 group-hover:translate-x-0.5 transition-transform" />
        </button>

        {/* Slide Indicators */}
        <div className="absolute bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 z-30 flex items-center gap-2">
          {slides.map((_, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setActiveSlide(idx)}
              className={`h-2.5 rounded-full transition-all cursor-pointer ${
                idx === activeSlide ? 'w-8 bg-[#c59324]' : 'w-2.5 bg-white/50 hover:bg-white'
              }`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>
      </div>

      {/* 4 Feature Cards Section (Swipable on Mobile, Docked Grid on Desktop, Non-clickable, Consistent Styling) */}
      <div className="relative z-30 -mt-6 sm:-mt-10 lg:-mt-14 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div
          ref={cardScrollRef}
          onScroll={handleCardScroll}
          className="flex sm:grid sm:grid-cols-2 lg:grid-cols-4 gap-4 overflow-x-auto sm:overflow-visible pb-2 sm:pb-0 snap-x snap-mandatory no-scrollbar"
        >
          {cards.map((card, index) => {
            const Icon = card.icon;

            return (
              <div
                key={index}
                className="w-[82vw] sm:w-auto shrink-0 snap-center p-5 sm:p-6 rounded-2xl bg-white text-slate-800 border border-slate-200/90 shadow-md flex flex-col justify-between select-none"
              >
                <div>
                  {/* Icon */}
                  <div className="w-11 h-11 rounded-xl flex items-center justify-center mb-4 bg-amber-50 text-[#0c2340] border border-amber-100">
                    <Icon className="w-6 h-6 stroke-[2.2] text-[#c59324]" />
                  </div>

                  {/* Title */}
                  <h3 className="text-base font-bold tracking-tight mb-2 leading-snug text-[#0c2340]">
                    {card.title}
                  </h3>

                  {/* Description */}
                  <p className="text-xs leading-relaxed text-slate-600">
                    {card.description}
                  </p>
                </div>

                {/* Footer text badge (informative, non-clickable) */}
                <div className="pt-4 mt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-[#c59324]">
                  <span>{card.actionText}</span>
                  <div className="w-1.5 h-1.5 rounded-full bg-[#c59324]" />
                </div>
              </div>
            );
          })}
        </div>

        {/* Mobile Swipe Indicators (dots) */}
        <div className="flex sm:hidden items-center justify-center gap-1.5 pt-3">
          {cards.map((_, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => scrollCardToIndex(idx)}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                activeMobileCard === idx ? 'w-6 bg-[#c59324]' : 'w-1.5 bg-slate-300'
              }`}
              aria-label={`Go to card ${idx + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
