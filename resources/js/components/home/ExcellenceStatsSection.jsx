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
    <section id="excellence" className="py-16 sm:py-20 bg-gradient-to-r from-[#0c2340] via-[#07172b] to-[#040e1b] text-white relative overflow-hidden border-y border-[#c59324]/20">
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
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white">
            <span className="text-[#dfad36] drop-shadow-sm">Excellence</span> is a Matter of Fact
          </h2>
          <div className="w-20 h-1 bg-gradient-to-r from-[#c59324] to-[#dfad36] mx-auto mt-3 rounded-full" />
        </div>

        {/* 4 Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 max-w-6xl mx-auto">
          {stats.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="group p-6 rounded-2xl bg-white/5 hover:bg-white/10 backdrop-blur-md border border-[#c59324]/25 hover:border-[#c59324]/60 text-center transition-all duration-300 hover:scale-105 hover:shadow-2xl flex flex-col items-center justify-center cursor-default shadow-lg"
              >
                {/* Icon */}
                <div className="w-14 h-14 rounded-full bg-[#c59324]/20 border border-[#c59324]/40 flex items-center justify-center text-[#dfad36] mb-4 group-hover:scale-110 group-hover:bg-[#c59324] group-hover:text-[#07172b] transition-all duration-300">
                  <Icon className="w-7 h-7 stroke-[2.2]" />
                </div>

                {/* Number */}
                <div className="flex items-baseline justify-center gap-1">
                  <span className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white group-hover:text-[#dfad36] transition-colors">
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
      </Container>
    </section>
  );
}
