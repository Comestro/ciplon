import { useState } from 'react';
import { Building2, X, ShieldCheck, Globe2, Award, ArrowRight } from 'lucide-react';
import Container from '../common/Container';

export default function CompanyIntroSection() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <section id="about" className="py-16 sm:py-24 bg-white border-b border-slate-100">
      <Container>
        <div className="max-w-4xl mx-auto text-center space-y-6">
          {/* Main Title */}
          <div className="inline-block relative">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tight text-[#003e6d] uppercase">
              CIPLON PHARMACEUTICALS LTD.
            </h2>
            <div className="w-16 h-1 bg-[#0069b4] mx-auto mt-2 rounded-full" />
          </div>

          {/* Intro Paragraph matching Intas Corporate Overview */}
          <p className="text-sm sm:text-base md:text-lg text-slate-700 leading-relaxed font-normal">
            Ciplon is one of the leading research-driven pharmaceutical formulations companies, manufacturing, discovering and commercializing therapeutics across the globe. Today, Ciplon is present in more than 85 countries worldwide and is growing at a rapid pace. More than 70% of its revenues come from the international markets, particularly the highly regulated markets of EU and US. Ciplon is committed to a better quality of life and provides affordable quality healthcare solutions around the globe.
          </p>

          {/* READ MORE Button */}
          <div className="pt-2">
            <button
              type="button"
              onClick={() => setIsModalOpen(true)}
              className="px-8 py-3 rounded-full bg-[#0069b4] hover:bg-[#00528e] text-white font-bold text-xs sm:text-sm tracking-wider uppercase transition-all shadow-md shadow-[#0069b4]/25 hover:shadow-lg hover:scale-105 cursor-pointer"
            >
              READ MORE
            </button>
          </div>
        </div>
      </Container>

      {/* Corporate Overview Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-slate-100 relative max-h-[90vh] overflow-y-auto">
            {/* Close Button */}
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="absolute top-5 right-5 p-2 rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-2xl bg-sky-50 text-[#0069b4] flex items-center justify-center border border-sky-100">
                <Building2 className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-[#003e6d]">Ciplon Corporate Profile</h3>
                <p className="text-xs text-slate-500">Established 2004 • WHO-GMP Validated Facilities</p>
              </div>
            </div>

            <div className="space-y-4 text-xs sm:text-sm text-slate-600 leading-relaxed pt-2">
              <p>
                From its inception, Ciplon has focused on core competence in formulation development, large-scale pharmaceutical manufacturing, and stringent regulatory compliance. We develop and commercialize generic, branded-generic, and specialty therapeutics.
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 py-3">
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 text-center">
                  <Globe2 className="w-5 h-5 text-[#0069b4] mx-auto mb-1.5" />
                  <div className="font-extrabold text-[#003e6d] text-base">85+ Countries</div>
                  <div className="text-[11px] text-slate-500">Global Supply Chain</div>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 text-center">
                  <ShieldCheck className="w-5 h-5 text-[#0069b4] mx-auto mb-1.5" />
                  <div className="font-extrabold text-[#003e6d] text-base">100% WHO-GMP</div>
                  <div className="text-[11px] text-slate-500">Certified Formulation Plants</div>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 text-center">
                  <Award className="w-5 h-5 text-[#0069b4] mx-auto mb-1.5" />
                  <div className="font-extrabold text-[#003e6d] text-base">9,738+</div>
                  <div className="text-[11px] text-slate-500">Global Registrations</div>
                </div>
              </div>

              <p>
                Our formulation sites are regularly audited by premier national and international healthcare regulatory agencies including USFDA, WHO-GMP, and MHRA. With a robust pipeline in cardiovascular, anti-infectives, gastroenterology, and biosimilars, Ciplon remains dedicated to scientific innovation and high affordability.
              </p>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100 flex justify-end">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="px-6 py-2 rounded-xl bg-[#0069b4] text-white text-xs font-bold hover:bg-[#005a9c] transition-colors cursor-pointer"
              >
                Close Overview
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
