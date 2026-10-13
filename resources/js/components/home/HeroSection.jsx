import { ArrowRight, ShieldCheck, Microscope, CheckCircle2, Award, Building2, Sparkles } from 'lucide-react';
import Container from '../common/Container';
import Button from '../common/Button';

export default function HeroSection({ onExploreProducts, onContactUs, onOpenEnquiryModal }) {
  return (
    <section id="home" className="relative overflow-hidden bg-gradient-to-b from-slate-50 via-white to-slate-50/50 text-slate-900 border-b border-slate-200/80">
      <Container className="relative z-10 py-12 lg:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          {/* Left Column: Authoritative Corporate Presentation (Light Theme) */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-teal-50 border border-teal-200 text-xs font-bold text-teal-900 shadow-2xs">
              <Award className="w-4 h-4 text-teal-700 shrink-0" />
              <span>WHO-GMP & ISO 9001:2015 Certified Pharmaceutical Enterprise</span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-slate-950 leading-[1.14]">
              Precision Formulations. <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-800 via-teal-700 to-emerald-700">
                Trusted Global Healthcare.
              </span>
            </h1>

            <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl font-normal">
              Ciplon is a research-driven pharmaceutical manufacturer delivering WHO-GMP certified finished formulations across critical therapeutic segments with uncompromising analytical rigor and global regulatory compliance.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-1">
              <Button
                variant="primary"
                size="lg"
                icon={ArrowRight}
                onClick={onExploreProducts}
                className="bg-teal-700 hover:bg-teal-800 text-white font-bold px-6 py-3 rounded-xl shadow-md shadow-teal-700/20 text-sm"
              >
                Explore Product Portfolio
              </Button>
              <Button
                variant="outline"
                size="lg"
                onClick={onContactUs}
                className="bg-white hover:bg-slate-50 text-slate-700 border-slate-300 hover:border-slate-400 font-semibold px-6 py-3 rounded-xl text-sm shadow-2xs"
              >
                Institutional Supply Inquiry
              </Button>
            </div>

            {/* Authoritative Trust Indicators Strip */}
            <div className="pt-6 border-t border-slate-200 grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs text-slate-700 font-semibold">
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4.5 h-4.5 text-teal-700 shrink-0" />
                <span>WHO-GMP Validated Plants</span>
              </div>
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4.5 h-4.5 text-teal-700 shrink-0" />
                <span>Finished Dosage Forms</span>
              </div>
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4.5 h-4.5 text-teal-700 shrink-0" />
                <span>Global Pharmacopoeia Specs</span>
              </div>
            </div>
          </div>

          {/* Right Column: Genuine Pharmaceutical Facility Showcase (Light Theme) */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              {/* Image Frame with Clean Corporate Finish */}
              <div className="rounded-3xl overflow-hidden border border-slate-200 bg-white p-2.5 shadow-xl relative group">
                <div className="relative rounded-2xl overflow-hidden">
                  <img
                    src="/images/ciplon_facility.jpg"
                    alt="Ciplon WHO-GMP Pharmaceutical Cleanroom Manufacturing Facility"
                    className="w-full h-80 sm:h-96 object-cover transform group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent" />

                  {/* Bottom Overlay Label */}
                  <div className="absolute bottom-0 inset-x-0 p-4 text-white">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-[11px] font-bold text-teal-300 uppercase tracking-wider">Manufacturing Unit 1</p>
                        <h3 className="text-sm font-semibold text-white mt-0.5">Automated Solid Oral Dosage Line</h3>
                      </div>
                      <span className="px-2.5 py-1 rounded-md text-[11px] font-bold bg-white/20 backdrop-blur-md border border-white/30 text-white">
                        Grade C/D Cleanroom
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating Quality Assurance Indicator */}
              <div className="absolute -top-4 -left-4 sm:-top-5 sm:-left-5 bg-white text-slate-900 rounded-2xl p-3.5 shadow-xl border border-slate-200 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-700 border border-teal-200 flex items-center justify-center shrink-0">
                  <ShieldCheck className="w-5 h-5 stroke-[2.2]" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-900">100% Batch Inspection</p>
                  <p className="text-[10px] text-slate-500 font-semibold">IPQC & Electronic Audit Trail</p>
                </div>
              </div>

              {/* Floating Quick Stats Card */}
              <div className="hidden sm:flex absolute -bottom-4 -right-4 bg-white text-slate-900 rounded-2xl p-3.5 shadow-xl border border-slate-200 items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-700 border border-teal-200 flex items-center justify-center shrink-0">
                  <Building2 className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-900">250+ Formulations</p>
                  <p className="text-[10px] text-teal-700 font-semibold">Solid, Liquid & Inhalers</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
