import { Link } from '@inertiajs/react';
import { Mail, Globe, MapPin, Building, ShieldCheck, Award, ArrowRight } from 'lucide-react';
import Container from './common/Container';

const CURRENT_YEAR = new Date().getFullYear();

export default function Footer({ companyData, categories = [], onOpenEnquiryModal }) {
  const companyName = companyData?.company_name || 'Ciplon Pharma Private Limited';
  const legalName = companyData?.legal_name || 'Ciplon Pharma Private Limited';
  const headquarters = companyData?.headquarters_address || 'M24/A, KH No. 294, 1st Floor, Batla House, Okhla, Jamia Nagar, South Delhi';
  const city = companyData?.city || 'New Delhi';
  const state = companyData?.state || 'Delhi';
  const postalCode = companyData?.postal_code || '110025';
  const country = companyData?.country || 'India';
  const email = companyData?.company_email || companyData?.enquiries_email || 'info@ciplonpharma.in';
  const website = companyData?.website_url || 'https://www.ciplonpharma.in';
  const fssaiLicNo = companyData?.fssai_lic_no || '10426340000172';
  const trademarkStatus = companyData?.trademark_status || 'TM-Trademark Under Registration';
  const isoCertification = companyData?.iso_certification || 'An ISO 9001: 2015 certified company';
  const manufacturerName = companyData?.manufacturer_name || 'WALPAR WELLNESS PVT.LTD.';
  const manufacturerCert = companyData?.manufacturer_certification || 'WHO-GMP & An ISO 9001 : 2015 Certified Company';
  const manufacturerAddress = companyData?.manufacturing_unit_address || 'PLOT NO.2/A & 06, OPP, SABARMATI GAS STATION, KHATRAJ, KALOL, GANDHINAGAR., Gujarat-382721';
  const logoUrl = companyData?.logo_url || '/images/ciplon_logo.png';

  return (
    <footer className="bg-[#07172b] text-white border-t-2 border-[#c59324] selection:bg-[#c59324] selection:text-white">
      {/* Main Footer Container */}
      <div className="py-12 sm:py-16 border-b border-white/10">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-start">
            
            {/* Left Column: Official Packaging & Marketed By Details (lg:col-span-5) */}
            <div className="lg:col-span-5 space-y-4">
              {/* Marketed By Header */}
              <div className="text-[11px] font-semibold text-[#dfad36] uppercase tracking-widest">
                Marketed by :
              </div>

              {/* Logo Card - Enlarged for clear legibility */}
              <div className="bg-white p-3.5 sm:p-4 rounded-2xl inline-block shadow-md">
                <img
                  src={logoUrl}
                  alt="Ciplon Pharma Private Limited"
                  className="h-14 sm:h-16 md:h-18 w-auto max-w-[280px] sm:max-w-[320px] object-contain"
                  onError={(e) => {
                    e.currentTarget.src = '/images/ciplon_logo.png';
                  }}
                />
              </div>

              {/* Company Entity & Certification */}
              <div className="space-y-0.5 pt-1">
                <h3 className="text-base sm:text-lg font-bold text-white tracking-tight uppercase">
                  {legalName}
                </h3>
                <p className="text-xs font-semibold text-amber-200/90">
                  ({isoCertification})
                </p>
              </div>

              {/* Registered Corporate Address */}
              <div className="text-xs sm:text-[13px] text-slate-300 leading-relaxed font-light space-y-0.5">
                <p>{headquarters},</p>
                <p>{city}, {state}, {country}-{postalCode}.</p>
              </div>

              {/* Query & Feedback */}
              <div className="pt-2 pb-1 border-t border-white/15 space-y-1">
                <p className="text-xs font-semibold text-[#dfad36]">
                  For any query or feedback, please contact us at:
                </p>
                <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-white">
                  <span>Contact :</span>
                  <a href={`mailto:${email}`} className="font-semibold text-amber-200 hover:text-white underline hover:no-underline">
                    {email}
                  </a>
                  <span className="text-[#c59324]">|</span>
                  <a href={website} target="_blank" rel="noopener noreferrer" className="font-semibold text-amber-200 hover:text-white underline hover:no-underline">
                    www.ciplonpharma.in
                  </a>
                </div>
                <p className="text-[11px] text-amber-300/80 font-medium">
                  {trademarkStatus}
                </p>
              </div>

              {/* FSSAI Regulatory License Badge */}
              <div className="pt-1">
                <div className="inline-flex items-center gap-2.5 px-3 py-1.5 rounded-xl bg-white/10 border border-[#c59324]/30 backdrop-blur-xs">
                  <span className="italic font-extrabold text-sm tracking-tight text-white">
                    <span className="text-amber-400">fss</span><span className="text-emerald-400">ai</span>
                  </span>
                  <span className="text-xs font-mono text-slate-200">
                    Lic. No. : <strong className="text-[#dfad36] font-bold tracking-wider">{fssaiLicNo}</strong>
                  </span>
                </div>
              </div>
            </div>

            {/* Middle Column: Manufacturing Facility & Partner (lg:col-span-4) */}
            <div className="lg:col-span-4 space-y-5">
              <div className="p-5 rounded-2xl bg-white/5 border border-[#c59324]/30 backdrop-blur-xs space-y-3">
                <div className="flex items-center gap-2 text-[#dfad36] text-xs font-bold uppercase tracking-wider">
                  <ShieldCheck className="w-4 h-4 text-[#dfad36] shrink-0" />
                  <span>Manufacturing Partner</span>
                </div>

                <div className="space-y-1 text-xs text-slate-300">
                  <p className="font-bold text-white text-sm">
                    Mfg. in India by: {manufacturerName}
                  </p>
                  <p className="text-amber-200/90 font-medium">
                    ({manufacturerCert})
                  </p>
                  <p className="pt-2 text-slate-300/90 leading-relaxed font-light">
                    {manufacturerAddress}
                  </p>
                </div>
              </div>

              {/* Quick Links */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#dfad36] border-b border-white/15 pb-1">
                  Quick Navigation
                </h4>
                <div className="grid grid-cols-2 gap-2 text-xs text-slate-300">
                  <a href="/" className="hover:text-[#dfad36] hover:underline transition-colors">• Home</a>
                  <a href="/products" className="hover:text-[#dfad36] hover:underline transition-colors">• Products & Pipeline</a>
                  <a href="#about" className="hover:text-[#dfad36] hover:underline transition-colors">• About Us</a>
                  <a href="#science" className="hover:text-[#dfad36] hover:underline transition-colors">• R&D Infrastructure</a>
                  <a href="#excellence" className="hover:text-[#dfad36] hover:underline transition-colors">• Quality Standards</a>
                  <Link href="/login" className="font-bold text-[#dfad36] hover:text-white transition-colors">• MR Portal Login</Link>
                </div>
              </div>
            </div>

            {/* Right Column: Institutional Supply & Follow (lg:col-span-3) */}
            <div className="lg:col-span-3 space-y-5 flex flex-col justify-between">
              <div className="space-y-3">
                <span className="text-[10px] uppercase font-bold tracking-widest text-[#dfad36] block">
                  Commercial Partnerships
                </span>
                <p className="text-xs text-slate-300 leading-relaxed">
                  For distributor appointments, institutional supplies, and third-party manufacturing alliances:
                </p>
                <button
                  type="button"
                  onClick={() => {
                    if (typeof onOpenEnquiryModal === 'function') {
                      onOpenEnquiryModal();
                    } else {
                      const el = document.getElementById('contact');
                      if (el) el.scrollIntoView({ behavior: 'smooth' });
                    }
                  }}
                  className="w-full px-4 py-2.5 rounded-full bg-gradient-to-r from-[#c59324] via-[#d4a029] to-[#b8831b] hover:from-[#b8831b] hover:to-[#9f6d0f] text-white font-bold text-xs shadow-lg shadow-[#c59324]/20 transition-all cursor-pointer text-center"
                >
                  Partner With Us
                </button>
              </div>

              {/* Social Media & Follow */}
              <div className="pt-4 border-t border-white/15 space-y-2">
                <span className="text-xs text-[#dfad36] font-semibold block">Follow Ciplon Pharma</span>
                <div className="flex items-center gap-3">
                  <a
                    href="https://linkedin.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-8 h-8 rounded-full bg-white/10 hover:bg-[#c59324] text-white hover:text-[#07172b] flex items-center justify-center transition-all cursor-pointer"
                    aria-label="LinkedIn"
                  >
                    <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                      <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z"/>
                    </svg>
                  </a>
                </div>
              </div>
            </div>

          </div>
        </Container>
      </div>

      {/* Sub-footer Bar */}
      <div className="py-4 bg-[#040e1b] text-slate-400 text-[11px] sm:text-xs border-t border-white/5">
        <Container>
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
            <p>
              © {CURRENT_YEAR} {legalName}. All rights reserved. ({trademarkStatus})
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4 text-slate-400">
              <a href="#terms" className="hover:text-[#dfad36] hover:underline">Terms of Use</a>
              <span>|</span>
              <a href="#disclaimer" className="hover:text-[#dfad36] hover:underline">Disclaimer</a>
              <span>|</span>
              <a href="#privacy" className="hover:text-[#dfad36] hover:underline">Privacy Policy</a>
              <span>|</span>
              <a href="#cookie" className="hover:text-[#dfad36] hover:underline">Cookie Policy</a>
            </div>
          </div>
        </Container>
      </div>
    </footer>
  );
}
