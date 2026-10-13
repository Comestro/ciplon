import { useState, useRef } from 'react';
import { Globe2, TrendingUp, Award, Layers, ChevronLeft, ChevronRight } from 'lucide-react';
import Container from '../common/Container';

export default function ExcellenceStatsSection() {
  const [activeIdx, setActiveIdx] = useState(0);
  const scrollContainerRef = useRef(null);

  const stats = [
    {
      icon: Globe2,
      value: '$2.2',
      unit: 'Billion',
      label: 'Billion Turnover',
      highlight: true,
    },
    {
      icon: TrendingUp,
      value: '20',
      unit: '%',
      label: 'CAGR Growth',
      highlight: false,
    },
    {
      icon: Award,
      value: 'No. 1',
      unit: '',
      label: 'Generic Company in Key Markets',
      highlight: false,
    },
    {
      icon: Layers,
      value: '9,738',
      unit: '+',
      label: 'Product Registrations Worldwide',
      highlight: false,
    },
  ];

  // Track active index as the user swipes horizontally on mobile
  const handleScroll = () => {
    if (!scrollContainerRef.current) return;
    const container = scrollContainerRef.current;
    const containerCenter = container.scrollLeft + container.offsetWidth / 2;
    const children = Array.from(container.children);
    let closestIdx = 0;
    let minDistance = Infinity;

    children.forEach((child, idx) => {
      const childCenter = child.offsetLeft + child.offsetWidth / 2;
      const distance = Math.abs(containerCenter - childCenter);
      if (distance < minDistance) {
        minDistance = distance;
        closestIdx = idx;
      }
    });

    setActiveIdx(closestIdx);
  };

  // Scroll to a specific card on tap
  const scrollToIndex = (index) => {
    if (!scrollContainerRef.current) return;
    const container = scrollContainerRef.current;
    const cards = container.children;
    if (cards && cards[index]) {
      cards[index].scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
        inline: 'center',
      });
      setActiveIdx(index);
    }
  };

  // Mouse drag-to-scroll support for desktop emulator testing
  const isDraggingRef = useRef(false);
  const startXRef = useRef(0);
  const scrollLeftStartRef = useRef(0);

  const handleMouseDown = (e) => {
    if (!scrollContainerRef.current) return;
    isDraggingRef.current = true;
    startXRef.current = e.pageX - scrollContainerRef.current.offsetLeft;
    scrollLeftStartRef.current = scrollContainerRef.current.scrollLeft;
  };

  const handleMouseMove = (e) => {
    if (!isDraggingRef.current || !scrollContainerRef.current) return;
    e.preventDefault();
    const x = e.pageX - scrollContainerRef.current.offsetLeft;
    const walk = (x - startXRef.current) * 1.5;
    scrollContainerRef.current.scrollLeft = scrollLeftStartRef.current - walk;
  };

  const handleMouseUpOrLeave = () => {
    isDraggingRef.current = false;
  };

  return (
    <section id="excellence" className="py-12 sm:py-20 bg-gradient-to-b sm:bg-gradient-to-r from-[#0c2340] via-[#07172b] to-[#040e1b] text-white relative overflow-hidden border-y border-[#c59324]/20">
      {/* Decorative molecular pattern / subtle background circles */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="dotPattern" width="40" height="40" patternUnits="userSpaceOnUse">
              <circle cx="20" cy="20" r="2" fill="#c59324" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#dotPattern)" />
        </svg>
      </div>

      <Container className="relative z-10">
        {/* Title */}
        <div className="text-center mb-8 sm:mb-14">
          <h2 className="text-2xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white">
            <span className="text-[#dfad36] drop-shadow-sm">Excellence</span> is a Matter of Fact
          </h2>
          <div className="w-16 sm:w-20 h-1 bg-gradient-to-r from-[#c59324] to-[#dfad36] mx-auto mt-3 rounded-full" />
        </div>

        {/* 4 Stats: Swipeable Carousel on Mobile (<768px), Clean 4-Col Grid on Desktop */}
        <div
          ref={scrollContainerRef}
          onScroll={handleScroll}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUpOrLeave}
          onMouseLeave={handleMouseUpOrLeave}
          className="flex md:grid md:grid-cols-4 gap-4 sm:gap-6 lg:gap-8 max-w-6xl mx-auto overflow-x-auto md:overflow-visible snap-x snap-mandatory md:snap-none no-scrollbar touch-pan-x px-6 md:px-0 scroll-px-6 pb-2 md:pb-0 select-none cursor-grab active:cursor-grabbing md:cursor-default"
        >
          {stats.map((item, idx) => {
            const Icon = item.icon;
            const isActiveOnMobile = activeIdx === idx;
            return (
              <div
                key={idx}
                onClick={() => scrollToIndex(idx)}
                className={`group p-6 sm:p-7 rounded-2xl backdrop-blur-md text-center transition-all duration-300 md:hover:scale-105 md:hover:shadow-2xl flex flex-col items-center justify-center shadow-lg shrink-0 w-[78vw] sm:w-[50vw] md:w-auto snap-center min-h-[220px] ${
                  isActiveOnMobile
                    ? 'bg-white/10 border-2 border-[#dfad36] shadow-[#dfad36]/10 shadow-xl'
                    : 'bg-white/5 border border-[#c59324]/25 hover:border-[#c59324]/50'
                }`}
              >
                {/* Icon */}
                <div
                  className={`w-14 h-14 rounded-full flex items-center justify-center mb-4 transition-all duration-300 md:group-hover:scale-110 ${
                    isActiveOnMobile
                      ? 'bg-[#c59324] text-[#07172b] border border-[#dfad36]'
                      : 'bg-[#c59324]/20 border border-[#c59324]/40 text-[#dfad36] md:group-hover:bg-[#c59324] md:group-hover:text-[#07172b]'
                  }`}
                >
                  <Icon className="w-7 h-7 stroke-[2.2]" />
                </div>

                {/* Number */}
                <div className="flex items-baseline justify-center gap-1">
                  <span className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white md:group-hover:text-[#dfad36] transition-colors">
                    {item.value}
                  </span>
                  {item.unit && (
                    <span className="text-xl sm:text-2xl font-bold text-[#dfad36]">
                      {item.unit}
                    </span>
                  )}
                </div>

                {/* Subtitle Label */}
                <p className="text-xs sm:text-sm font-semibold text-slate-300 mt-2 leading-snug">
                  {item.label}
                </p>
              </div>
            );
          })}
        </div>

        {/* Mobile Swipe Indicators & Navigation Controls */}
        <div className="flex md:hidden flex-col items-center justify-center gap-2.5 mt-6">
          <div className="flex items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => scrollToIndex(Math.max(0, activeIdx - 1))}
              disabled={activeIdx === 0}
              className="p-2 rounded-full bg-white/10 text-white disabled:opacity-20 disabled:cursor-not-allowed hover:bg-white/20 active:scale-95 transition-all cursor-pointer border border-white/10"
              aria-label="Previous stat"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-1.5 px-2">
              {stats.map((_, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => scrollToIndex(idx)}
                  className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                    activeIdx === idx
                      ? 'w-7 bg-gradient-to-r from-[#c59324] to-[#dfad36] shadow-sm shadow-[#dfad36]/50'
                      : 'w-2 bg-white/30 hover:bg-white/60'
                  }`}
                  aria-label={`Go to stat ${idx + 1}`}
                />
              ))}
            </div>

            <button
              type="button"
              onClick={() => scrollToIndex(Math.min(stats.length - 1, activeIdx + 1))}
              disabled={activeIdx === stats.length - 1}
              className="p-2 rounded-full bg-white/10 text-white disabled:opacity-20 disabled:cursor-not-allowed hover:bg-white/20 active:scale-95 transition-all cursor-pointer border border-white/10"
              aria-label="Next stat"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <span className="text-[11px] font-medium text-slate-400 tracking-wide">
            Swipe left or right ({activeIdx + 1} of {stats.length})
          </span>
        </div>
      </Container>
    </section>
  );
}
