import { useState } from 'react';
import { ChevronRight, FlaskConical, Microscope, Sparkles, Building2, CheckCircle2, X } from 'lucide-react';
import Container from '../common/Container';

export default function ScienceIntoSmilesSection() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const bulletPoints = [
    {
      highlight: "6 - 7%",
      text: "of turnover invested in R&D every year",
    },
    {
      highlight: "Over 1,00,000 sq ft",
      text: "dedicated R&D and analytical space",
    },
    {
      highlight: "650+ scientists",
      text: "and researchers working across therapeutic areas",
    },
    {
      highlight: "17 advanced",
      text: "formulation and bio-analytical research facilities",
    },
    {
      highlight: "Global Regulatory Authority",
      text: "accreditations including USFDA, WHO-GMP & MHRA",
    },
    {
      highlight: "Pioneers in biosimilars",
      text: "and novel extended-release drug delivery systems",
    },
  ];

  return (
    <section id="science" className="py-16 sm:py-24 bg-white border-b border-slate-100 overflow-hidden">
      <Container>
        {/* Main Section Heading */}
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tight text-[#0069b4] uppercase">
            TRANSFORMING SCIENCE INTO SMILES
          </h2>
          <div className="w-16 h-1 bg-[#0069b4] mx-auto mt-2 rounded-full" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Left Column: Circular Multi-Lens Scientific Infographic (Matching Intas Design) */}
          <div className="lg:col-span-6 flex justify-center">
            <div className="relative w-[300px] h-[300px] sm:w-[380px] sm:h-[380px] md:w-[420px] md:h-[420px] flex items-center justify-center">
              {/* Outer decorative orbit rings */}
              <div className="absolute inset-0 rounded-full border border-slate-200 animate-spin-slow pointer-events-none" />
              <div className="absolute inset-4 rounded-full border-2 border-dashed border-[#0069b4]/20 pointer-events-none" />
              <div className="absolute inset-10 rounded-full border border-sky-100 pointer-events-none" />

              {/* Central Primary Circular Lens: Cleanroom Laboratory */}
              <div className="relative z-10 w-48 h-48 sm:w-60 sm:h-60 md:w-64 md:h-64 rounded-full p-2 bg-white shadow-2xl border-4 border-[#0069b4] overflow-hidden group">
                <img
                  src="/images/pharma_rd_lab.jpg"
                  alt="Ciplon Formulation R&D Laboratory"
                  className="w-full h-full object-cover rounded-full group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 rounded-full bg-gradient-to-t from-[#003e6d]/60 via-transparent to-transparent flex items-end justify-center pb-3">
                  <span className="text-[11px] sm:text-xs font-bold text-white uppercase tracking-wider bg-[#0069b4]/80 px-2.5 py-0.5 rounded-full">
                    Core R&D Hub
                  </span>
                </div>
              </div>

              {/* Satellite Orbit Lens 1: Automation Line (Top Right) */}
              <div className="absolute -top-2 right-4 sm:top-2 sm:right-6 z-20 w-24 h-24 sm:w-28 sm:h-28 rounded-full p-1.5 bg-white shadow-xl border-2 border-sky-400 overflow-hidden hover:scale-110 transition-transform cursor-pointer group">
                <img
                  src="/images/pharma_automation_line.jpg"
                  alt="High Speed Robotic Packaging Line"
                  className="w-full h-full object-cover rounded-full"
                />
              </div>

              {/* Satellite Orbit Lens 2: Formulation Facility (Bottom Left) */}
              <div className="absolute -bottom-2 left-2 sm:bottom-4 sm:left-4 z-20 w-22 h-22 sm:w-26 sm:h-26 rounded-full p-1.5 bg-white shadow-xl border-2 border-sky-400 overflow-hidden hover:scale-110 transition-transform cursor-pointer group">
                <img
                  src="/images/ciplon_facility.jpg"
                  alt="Formulation Cleanroom"
                  className="w-full h-full object-cover rounded-full"
                />
              </div>

              {/* Satellite Orbit Lens 3: Scientists (Bottom Right) */}
              <div className="absolute bottom-6 right-2 sm:bottom-8 sm:right-4 z-20 w-20 h-20 sm:w-24 sm:h-24 rounded-full p-1.5 bg-white shadow-xl border-2 border-sky-400 overflow-hidden hover:scale-110 transition-transform cursor-pointer group">
                <img
                  src="/images/ciplon_lab.jpg"
                  alt="Analytical Spectroscopy"
                  className="w-full h-full object-cover rounded-full"
                />
              </div>

              {/* Decorative Pulsing Connection Nodes */}
              <div className="absolute top-1/2 -left-2 w-5 h-5 rounded-full bg-[#0069b4] border-2 border-white shadow-md flex items-center justify-center">
                <div className="w-2 h-2 rounded-full bg-white animate-ping" />
              </div>
              <div className="absolute top-1/2 -right-2 w-5 h-5 rounded-full bg-[#0069b4] border-2 border-white shadow-md flex items-center justify-center">
                <div className="w-2 h-2 rounded-full bg-white animate-ping" />
              </div>
            </div>
          </div>

          {/* Right Column: R&D Narrative & Highlight Bullets */}
          <div className="lg:col-span-6 space-y-6">
            <p className="text-sm sm:text-base text-slate-700 leading-relaxed font-normal">
              R&D is the cornerstone of Ciplon's success. A high-calibre team works round the clock with a quest to develop a progressive and formidable product basket that includes novel doses, generics, biosimilars and parenteral formulations to address unmet global healthcare needs.
            </p>

            {/* Bullets with Blue Chevrons */}
            <div className="space-y-3.5 pt-2">
              {bulletPoints.map((item, index) => (
                <div key={index} className="flex items-start gap-3 group">
                  <div className="w-5 h-5 rounded-full bg-sky-100 text-[#0069b4] flex items-center justify-center shrink-0 mt-0.5 group-hover:bg-[#0069b4] group-hover:text-white transition-colors">
                    <ChevronRight className="w-3.5 h-3.5 stroke-[3]" />
                  </div>
                  <p className="text-xs sm:text-sm text-slate-700 leading-snug">
                    <strong className="text-[#0069b4] font-bold">{item.highlight}</strong>{' '}
                    <span>{item.text}</span>
                  </p>
                </div>
              ))}
            </div>

            {/* READ MORE Button */}
            <div className="pt-4">
              <button
                type="button"
                onClick={() => setIsModalOpen(true)}
                className="px-8 py-3 rounded-full bg-[#0069b4] hover:bg-[#00528e] text-white font-bold text-xs sm:text-sm tracking-wider uppercase transition-all shadow-md shadow-[#0069b4]/25 hover:shadow-lg hover:scale-105 cursor-pointer"
              >
                READ MORE
              </button>
            </div>
          </div>
        </div>
      </Container>

      {/* R&D Innovation Detailed Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-slate-100 relative max-h-[90vh] overflow-y-auto">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="absolute top-5 right-5 p-2 rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-2xl bg-sky-50 text-[#0069b4] flex items-center justify-center border border-sky-100">
                <Microscope className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-[#003e6d]">Ciplon Research & Development</h3>
                <p className="text-xs text-slate-500">Transforming Science into High-Affordability Therapies</p>
              </div>
            </div>

            <div className="space-y-4 text-xs sm:text-sm text-slate-600 leading-relaxed pt-2">
              <p>
                Our formulation scientists focus on complex generics, bioequivalence, and modified-release tablets and capsules. With dedicated stability chambers under ICH Climatic Zone IVB guidelines, every product undergoes forced degradation, dissolution kinetics, and analytical testing.
              </p>

              <div className="grid grid-cols-2 gap-3 py-2">
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                  <div className="text-xs font-bold text-slate-900">Bioequivalence Testing</div>
                  <div className="text-[11px] text-slate-500 mt-1">Multi-media comparative in-vitro dissolution profiling</div>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                  <div className="text-xs font-bold text-slate-900">HPLC & Mass Spec</div>
                  <div className="text-[11px] text-slate-500 mt-1">High sensitivity impurity profiling & chiral separations</div>
                </div>
              </div>

              <p>
                Ciplon authors Common Technical Documents (eCTD) for regulatory filings across the US, Europe, ASEAN, and CIS markets, helping ensure speedy therapeutic access worldwide.
              </p>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100 flex justify-end">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="px-6 py-2 rounded-xl bg-[#0069b4] text-white text-xs font-bold hover:bg-[#005a9c] transition-colors cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
