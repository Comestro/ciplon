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
            <span className="text-[11px] font-bold tracking-widest text-[#c59324] uppercase block mb-1">
              Corporate Overview
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-[#0c2340] uppercase">
              CIPLON PHARMA PRIVATE LIMITED
            </h2>
            <p className="text-xs sm:text-sm font-semibold text-slate-500 mt-1">
              (An ISO 9001: 2015 certified company)
            </p>
            <div className="w-20 h-1 bg-gradient-to-r from-[#c59324] to-[#dfad36] mx-auto mt-2 rounded-full" />
          </div>

          {/* Intro Paragraph matching corporate identity */}
          <p className="text-sm sm:text-base md:text-lg text-slate-700 leading-relaxed font-normal">
            Ciplon Pharma Private Limited is an ISO 9001: 2015 certified healthcare and pharmaceutical formulations company committed to marketing high-quality, accessible, and affordable therapeutic formulations. Manufactured in state-of-the-art WHO-GMP and ISO 9001: 2015 certified partner facilities, our formulations undergo rigorous quality control and batch testing to ensure the highest standards of safety, bioavailability, and clinical efficacy.
          </p>

          {/* READ MORE Button */}
          <div className="pt-2">
            <button
              type="button"
              onClick={() => setIsModalOpen(true)}
              className="px-8 py-3 rounded-full bg-[#0c2340] hover:bg-[#123055] text-white border border-[#c59324]/40 font-bold text-xs sm:text-sm tracking-wider uppercase transition-all shadow-md shadow-[#0c2340]/25 hover:shadow-lg hover:scale-105 cursor-pointer"
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
              <div className="w-12 h-12 rounded-2xl bg-amber-50 text-[#c59324] flex items-center justify-center border border-amber-200/70">
                <Building2 className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-[#0c2340]">Ciplon Pharma Private Limited</h3>
                <p className="text-xs text-slate-500 font-medium">An ISO 9001: 2015 Certified Company • FSSAI Lic. No. 10426340000172</p>
              </div>
            </div>

            <div className="space-y-4 text-xs sm:text-sm text-slate-600 leading-relaxed pt-2">
              <p>
                <strong>Marketed by:</strong> Ciplon Pharma Private Limited<br />
                M24/A, KH No. 294, 1st Floor, Batla House, Okhla, Jamia Nagar, South Delhi, New Delhi, Delhi, India - 110025.
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 py-3">
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 text-center">
                  <ShieldCheck className="w-5 h-5 text-[#c59324] mx-auto mb-1.5" />
                  <div className="font-extrabold text-[#0c2340] text-sm">ISO 9001: 2015</div>
                  <div className="text-[11px] text-slate-500">Certified Quality Standard</div>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 text-center">
                  <Award className="w-5 h-5 text-[#c59324] mx-auto mb-1.5" />
                  <div className="font-extrabold text-[#0c2340] text-sm">WHO-GMP</div>
                  <div className="text-[11px] text-slate-500">Manufacturing Facility</div>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 text-center">
                  <Globe2 className="w-5 h-5 text-[#c59324] mx-auto mb-1.5" />
                  <div className="font-extrabold text-[#0c2340] text-sm">FSSAI License</div>
                  <div className="text-[11px] text-slate-500">10426340000172</div>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-200/60 text-xs text-slate-700 space-y-1.5">
                <p className="font-bold text-[#0c2340] uppercase tracking-wider text-[11px]">
                  Manufacturing Partner Credentials
                </p>
                <p className="font-semibold text-slate-800">
                  Mfg. in India by: WALPAR WELLNESS PVT.LTD.
                </p>
                <p className="text-slate-600">
                  (WHO-GMP & An ISO 9001 : 2015 Certified Company)
                </p>
                <p className="text-slate-500 text-[11px]">
                  PLOT NO.2/A & 06, OPP, SABARMATI GAS STATION, KHATRAJ, KALOL, GANDHINAGAR., Gujarat-382721.
                </p>
              </div>

              <p className="text-slate-600">
                For any query or feedback, contact our corporate desk at <a href="mailto:info@ciplonpharma.in" className="text-[#c59324] font-semibold hover:underline">info@ciplonpharma.in</a> or visit <a href="https://www.ciplonpharma.in" target="_blank" rel="noopener noreferrer" className="text-[#c59324] font-semibold hover:underline">www.ciplonpharma.in</a>. TM - Trademark Under Registration.
              </p>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100 flex justify-end">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="px-6 py-2 rounded-xl bg-[#0c2340] text-white text-xs font-bold hover:bg-[#c59324] transition-colors cursor-pointer"
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
