import { Globe2, TrendingUp, Award, Layers } from 'lucide-react';
import Container from '../common/Container';

export default function ExcellenceStatsSection() {
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

  return (
    <section id="excellence" className="py-16 sm:py-20 bg-gradient-to-r from-[#0069b4] via-[#005a9c] to-[#004780] text-white relative overflow-hidden">
      {/* Decorative molecular pattern / subtle background circles */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="dotPattern" width="40" height="40" patternUnits="userSpaceOnUse">
              <circle cx="20" cy="20" r="2" fill="white" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#dotPattern)" />
        </svg>
      </div>

      <Container className="relative z-10">
        {/* Title */}
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-white">
            <span className="text-[#f59e0b] drop-shadow-sm">Excellence</span> is a Matter of Fact
          </h2>
          <div className="w-16 h-1 bg-[#f59e0b] mx-auto mt-3 rounded-full" />
        </div>

        {/* 4 Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 max-w-6xl mx-auto">
          {stats.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="group p-6 rounded-2xl bg-white/10 hover:bg-white/15 backdrop-blur-md border border-white/15 hover:border-white/30 text-center transition-all duration-300 hover:scale-105 hover:shadow-2xl flex flex-col items-center justify-center cursor-default"
              >
                {/* Icon */}
                <div className="w-14 h-14 rounded-full bg-white/20 border border-white/30 flex items-center justify-center text-white mb-4 group-hover:scale-110 group-hover:bg-[#f59e0b] group-hover:text-slate-900 transition-all duration-300">
                  <Icon className="w-7 h-7 stroke-[2.2]" />
                </div>

                {/* Number */}
                <div className="flex items-baseline justify-center gap-1">
                  <span className="text-3xl sm:text-4xl md:text-5xl font-black font-mono tracking-tight text-white">
                    {item.value}
                  </span>
                  {item.unit && (
                    <span className="text-xl sm:text-2xl font-black text-amber-300">
                      {item.unit}
                    </span>
                  )}
                </div>

                {/* Subtitle Label */}
                <p className="text-xs sm:text-sm font-semibold text-sky-100 mt-2 leading-snug">
                  {item.label}
                </p>
              </div>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
