import { Link } from '@inertiajs/react';
import { Mail, Phone, MapPin, Globe, ShieldCheck, ArrowRight } from 'lucide-react';
import Container from './common/Container';

const CURRENT_YEAR = new Date().getFullYear();

export default function Footer({ companyData, categories = [], onOpenEnquiryModal }) {
  const companyName = companyData?.company_name || 'Ciplon Pharmaceuticals Ltd.';
  const legalName = companyData?.legal_name || 'Ciplon Life Sciences';
  const headquarters = companyData?.headquarters_address || 'Corporate House, Sector 62, Bio-Tech Corridor';
  const city = companyData?.city || 'Boston / Mumbai';
  const state = companyData?.state || 'MH';
  const country = companyData?.country || 'India';
  const phone = companyData?.company_phone || '+91 800 458 7290';
  const email = companyData?.company_email || companyData?.enquiries_email || 'corporate@ciplon.com';
  const logoUrl = companyData?.logo_url;

  return (
    <footer className="bg-[#004e89] text-white selection:bg-[#0069b4] selection:text-white">
      {/* Main Footer Container */}
      <div className="py-14 sm:py-16 border-b border-white/10">
        <Container>
          <div className="grid grid-cols-1 md:grid-cols-12 gap-10 lg:gap-12 items-start">
            {/* Left Column: Corporate Office (md:col-span-4) */}
            <div className="md:col-span-5 lg:col-span-4 space-y-4">
              {/* Logo */}
              <div className="flex items-center gap-3">
                {logoUrl ? (
                  <img
                    src={logoUrl}
                    alt={companyName}
                    className="h-10 w-auto max-w-[170px] object-contain brightness-0 invert"
                  />
                ) : (
                  <div className="flex items-center gap-2">
                    <div className="w-10 h-10 rounded-full border-2 border-white bg-white/10 flex items-center justify-center text-white font-black shadow-md">
                      <span className="text-base font-extrabold tracking-tight">CP</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-xl font-black tracking-tight text-white leading-none">
                        CIPLON
                      </span>
                      <span className="text-[9px] uppercase tracking-widest font-bold text-sky-200 mt-0.5">
                        PHARMACEUTICALS
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* Sub-header */}
              <h4 className="text-xs font-bold uppercase tracking-wider text-sky-300 pt-2">
                corporate office
              </h4>

              {/* Address info */}
              <div className="text-xs sm:text-sm text-sky-100/90 space-y-1 leading-relaxed font-light">
                <p className="font-semibold text-white">{companyName}</p>
                <p>{headquarters}</p>
                <p>{city}, {state} - 380054</p>
                <p>{country}</p>
              </div>

              {/* Phone & Email */}
              <div className="space-y-1 text-xs sm:text-sm text-sky-100 pt-1">
                <p className="flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5 text-sky-300 shrink-0" />
                  <span>{phone}</span>
                </p>
                <p className="flex items-center gap-2">
                  <Mail className="w-3.5 h-3.5 text-sky-300 shrink-0" />
                  <a href={`mailto:${email}`} className="hover:underline text-sky-200 hover:text-white">
                    {email}
                  </a>
                </p>
              </div>
            </div>

            {/* Middle Column: Our Links (md:col-span-5 lg:col-span-6) */}
            <div className="md:col-span-5 lg:col-span-6 space-y-4">
              <h4 className="text-base font-bold text-white tracking-wide border-b border-white/20 pb-2 inline-block">
                Our Links
              </h4>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 pt-1 text-xs text-sky-100">
                {/* Sub-Column 1 */}
                <div className="space-y-2">
                  <a href="/" className="block hover:text-white hover:underline transition-colors">• Home</a>
                  <a href="#about" className="block hover:text-white hover:underline transition-colors">• About Us</a>
                  <a href="/products" className="block hover:text-white hover:underline transition-colors">• Products & Pipeline</a>
                  <a href="#business" className="block hover:text-white hover:underline transition-colors">• Financials</a>
                  <a href="#careers" className="block hover:text-white hover:underline transition-colors">• Careers</a>
                </div>

                {/* Sub-Column 2 */}
                <div className="space-y-2">
                  <a href="#news" className="block hover:text-white hover:underline transition-colors">• Media</a>
                  <a href="#science" className="block hover:text-white hover:underline transition-colors">• R&D</a>
                  <a href="#manufacturing" className="block hover:text-white hover:underline transition-colors">• Facilities</a>
                  <a href="#csr" className="block hover:text-white hover:underline transition-colors">• CSR</a>
                  <a href="#environment" className="block hover:text-white hover:underline transition-colors">• Environment</a>
                </div>

                {/* Sub-Column 3 */}
                <div className="space-y-2 col-span-2 sm:col-span-1">
                  <a href="#investors" className="block hover:text-white hover:underline transition-colors">• Investor Relations</a>
                  <a href="#adverse-event" className="block hover:text-white hover:underline transition-colors">• Adverse event reporting</a>
                  <a href="#technical" className="block hover:text-white hover:underline transition-colors">• Technical Support</a>
                  <Link href="/login" className="block font-bold text-amber-300 hover:text-white transition-colors">• MR Portal Login</Link>
                </div>
              </div>

              {/* Social Links */}
              <div className="pt-4 flex items-center gap-3">
                <span className="text-xs text-sky-200 font-semibold">Follow us on</span>
                <a
                  href="https://linkedin.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 rounded-full bg-white/10 hover:bg-white text-white hover:text-[#004e89] flex items-center justify-center transition-all cursor-pointer"
                  aria-label="LinkedIn"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z"/>
                  </svg>
                </a>
              </div>
            </div>

            {/* Right Column: Healthcare Partnership CTA */}
            <div className="md:col-span-2 flex flex-col items-start md:items-end justify-center space-y-3">
              <div className="text-left md:text-right">
                <span className="text-[10px] uppercase font-bold tracking-widest text-sky-300 block">
                  PARTNERSHIP
                </span>
                <p className="text-xs text-sky-100/90 mt-1 leading-relaxed">
                  Institutional supply & distribution partnerships.
                </p>
              </div>
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
                className="px-4 py-2 rounded-full bg-white/10 hover:bg-white text-white hover:text-[#004e89] border border-white/20 text-xs font-bold transition-all cursor-pointer whitespace-nowrap"
              >
                Partner With Us
              </button>
            </div>
          </div>
        </Container>
      </div>

      {/* Sub-footer Bar */}
      <div className="py-4 bg-[#003d6d] text-sky-200 text-[11px] sm:text-xs">
        <Container>
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
            <p>
              © {CURRENT_YEAR} {companyName}. All rights reserved.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4 text-sky-300">
              <a href="#terms" className="hover:text-white hover:underline">Terms of Use</a>
              <span>|</span>
              <a href="#disclaimer" className="hover:text-white hover:underline">Disclaimer</a>
              <span>|</span>
              <a href="#privacy" className="hover:text-white hover:underline">Privacy Policy</a>
              <span>|</span>
              <a href="#cookie" className="hover:text-white hover:underline">Cookie Policy</a>
            </div>
          </div>
        </Container>
      </div>
    </footer>
  );
}
