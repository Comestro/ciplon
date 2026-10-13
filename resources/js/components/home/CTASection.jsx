import { ArrowRight, Mail, Phone, Building2, FileCheck2, Clock } from 'lucide-react';
import Container from '../common/Container';
import Button from '../common/Button';

export default function CTASection({ onOpenEnquiryModal }) {
  return (
    <section id="contact" className="py-16 lg:py-24 bg-white relative overflow-hidden">
      <Container>
        <div className="rounded-3xl bg-gradient-to-br from-slate-50 via-teal-50/30 to-slate-50 text-slate-900 p-8 sm:p-12 lg:p-16 relative overflow-hidden shadow-sm border border-slate-200">
          <div className="relative z-10 max-w-3xl mx-auto text-center space-y-6">
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold tracking-wider uppercase bg-teal-100/80 text-teal-900 border border-teal-200">
              Commercial & Institutional Partnerships
            </span>

            <h2 className="text-2xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-[#0c2340] leading-tight">
              Looking for Trusted Formulation Supply?
            </h2>

            <p className="text-sm sm:text-base lg:text-lg text-slate-600 leading-relaxed max-w-2xl mx-auto font-normal">
              Connect with our corporate team to explore product licensing, hospital tenders, institutional supply, technical dossiers, or pharmaceutical distribution in your market.
            </p>

            <div className="pt-2 flex flex-wrap items-center justify-center gap-4">
              <Button
                variant="primary"
                size="lg"
                icon={ArrowRight}
                onClick={onOpenEnquiryModal}
                className="bg-teal-700 hover:bg-teal-800 text-white font-bold px-7 py-3 rounded-xl shadow-md shadow-teal-700/20 text-sm"
              >
                Submit Commercial Inquiry
              </Button>
              <Button
                variant="outline"
                size="lg"
                icon={Mail}
                href="mailto:enquiry@ciplon.com"
                className="bg-white hover:bg-slate-50 text-slate-700 border-slate-300 hover:border-slate-400 font-semibold px-6 py-3 rounded-xl text-sm shadow-2xs"
              >
                enquiry@ciplon.com
              </Button>
            </div>

            <div className="pt-8 mt-6 border-t border-slate-200 flex flex-wrap items-center justify-center gap-6 sm:gap-10 text-xs text-slate-700 font-semibold">
              <div className="flex items-center gap-2">
                <Building2 className="w-4 h-4 text-teal-700" />
                <span>Institutional & Hospital Supply</span>
              </div>
              <div className="flex items-center gap-2">
                <FileCheck2 className="w-4 h-4 text-teal-700" />
                <span>CTD Dossiers & Stability Data</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-teal-700" />
                <span>Rapid 24-48h Response Desk</span>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
