import { useState, useRef } from 'react';
import { Globe2, TrendingUp, Award, Layers, ChevronLeft, ChevronRight } from 'lucide-react';
import Container from '../common/Container';

export default function ExcellenceStatsSection() {
  const [activeIdx, setActiveIdx] = useState(0);
  const scrollContainerRef = useRef(null);

  const stats = [
    {
      icon: Award,
      badge: 'ISO 9001:2015',
      mainText: 'WHO-GMP',
      subText: 'Certified Quality Formulations',
      footnote: 'Strict Schedule M Compliance',
    },
    {
      icon: TrendingUp,
      badge: 'Certified Facilities',
      mainText: '2 Manufacturing Partners',
      subText: 'Walpar Wellness (Gujarat) & Akums Group (Uttarakhand)',
      footnote: 'Automated Blistering & Serialization',
    },
    {
      icon: Globe2,
      badge: 'Territory Monopoly',
      mainText: 'Pan-India Distribution',
      subText: 'PCD Pharma Distributorship & Hospital Supply',
      footnote: 'Comprehensive Promotional Support',
    },
    {
      icon: Layers,
      badge: '100% Assurance',
      mainText: 'Batch-Tested Integrity',
      subText: 'HPLC Assays, Dissolution & Purity Testing',
      footnote: 'Authenticated Batch COA Release',
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

        {/* 4 Cards: Non-clickable, Uniform Elegant Card Design, Swipable on Mobile */}
        <div
          ref={scrollContainerRef}
          onScroll={handleScroll}
          className="flex md:grid md:grid-cols-4 gap-4 sm:gap-6 lg:gap-8 max-w-6xl mx-auto overflow-x-auto md:overflow-visible snap-x snap-mandatory md:snap-none no-scrollbar touch-pan-x px-4 md:px-0 pb-2 md:pb-0 select-none"
        >
          {stats.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="p-6 sm:p-7 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md text-center flex flex-col justify-between shrink-0 w-[82vw] sm:w-[50vw] md:w-auto snap-center min-h-[260px] shadow-lg shadow-black/20"
              >
                <div>
                  {/* Badge */}
                  <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#c59324]/15 border border-[#c59324]/40 text-[#dfad36] text-[10px] font-bold uppercase tracking-wider mb-4">
                    {item.badge}
                  </div>

                  {/* Icon */}
                  <div className="w-12 h-12 rounded-2xl mx-auto flex items-center justify-center mb-4 bg-gradient-to-br from-[#c59324]/20 to-[#dfad36]/10 border border-[#c59324]/40 text-[#dfad36]">
                    <Icon className="w-6 h-6 stroke-[2]" />
                  </div>

                  {/* Main Title */}
                  <h3 className="text-lg sm:text-xl font-bold tracking-tight text-white leading-snug">
                    {item.mainText}
                  </h3>

                  {/* Subtitle / Description */}
                  <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                    {item.subText}
                  </p>
                </div>

                {/* Footnote */}
                <div className="pt-3.5 mt-3 border-t border-white/10 text-[11px] font-medium text-[#dfad36]/90">
                  {item.footnote}
                </div>
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
