import { ArrowRight, Award } from 'lucide-react';
import Container from '../common/Container';

export default function EditorialBanner({ onContactUs }) {
  const stats = [
    { value: "250+", label: "Finished Formulations", sub: "Solid, liquid & inhalation" },
    { value: "15+", label: "Therapeutic Segments", sub: "Acute & chronic care" },
    { value: "45+", label: "Export Markets", sub: "Global regulatory supply" },
    { value: "100%", label: "WHO-GMP Certified", sub: "Fully validated facilities" },
  ];

  return (
    <section id="manufacturing" className="py-16 sm:py-20 bg-gradient-to-b from-slate-50 via-white to-slate-50/70 text-slate-900 relative overflow-hidden border-y border-slate-200">
      <Container className="relative z-10">
        <div className="max-w-5xl mx-auto text-center space-y-8">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-teal-50 border border-teal-200 text-xs font-bold text-teal-900 shadow-2xs">
            <Award className="w-4 h-4 text-teal-700" />
            <span>The Ciplon Formulation Charter</span>
          </div>

          <h2 className="text-2xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-[#0c2340] leading-tight">
            Advancing Human Health Through <br className="hidden sm:inline" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-800 via-teal-700 to-emerald-700">
              Scientific Precision & Uncompromising Quality
            </span>
          </h2>

          <p className="max-w-3xl mx-auto text-base sm:text-lg text-slate-600 font-normal leading-relaxed">
            "Pharmaceutical manufacturing is more than producing tablets and capsules. It is our disciplined commitment to reproducible potency, clinical stability, and patient safety across every single dosage unit."
          </p>

          {/* Corporate Stats Banner - Light Theme */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 pt-4">
            {stats.map((stat, i) => (
              <div key={i} className="p-6 rounded-2xl bg-white border border-slate-200/90 text-center shadow-xs">
                <div className="text-2xl sm:text-4xl font-extrabold text-teal-700 font-mono tracking-tight">
                  {stat.value}
                </div>
                <div className="text-xs sm:text-sm font-bold text-slate-900 mt-1">
                  {stat.label}
                </div>
                <div className="text-[11px] text-slate-500 font-medium mt-0.5">
                  {stat.sub}
                </div>
              </div>
            ))}
          </div>

          <div className="pt-4 flex flex-wrap items-center justify-center gap-4">
            <button
              onClick={onContactUs}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-teal-700 hover:bg-teal-800 text-white font-bold text-xs sm:text-sm transition-all cursor-pointer shadow-md shadow-teal-700/15"
            >
              <span>Consult Our Regulatory Formulation Team</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </Container>
    </section>
  );
}
