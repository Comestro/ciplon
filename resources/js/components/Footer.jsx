import { Link } from '@inertiajs/react';
import { Mail, Phone, MapPin, Globe, ShieldCheck, Award, ArrowUpRight, CheckCircle2, ChevronRight } from 'lucide-react';
import Container from './common/Container';

const CURRENT_YEAR = new Date().getFullYear();

export default function Footer({ companyData, categories = [], onOpenEnquiryModal }) {
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
  const isoCertification = companyData?.iso_certification || 'An ISO 9001: 2015 Certified Company';
  const manufacturerName = companyData?.manufacturer_name || 'Pure & Cure Healthcare Pvt. Ltd. / Walpar Wellness';
  const manufacturerCert = companyData?.manufacturer_certification || 'WHO-GMP & cGMP Compliant Facility';
  const logoUrl = companyData?.logo_url || '/images/ciplon_logo.png';

  return (
    <footer className="bg-[#071527] text-slate-300 selection:bg-[#c59324] selection:text-white border-t border-[#c59324]/30 relative overflow-hidden font-sans">
      {/* Subtle top ambient glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-24 bg-gradient-to-b from-[#c59324]/5 to-transparent pointer-events-none" />

      {/* Main Footer Content */}
      <div className="pt-16 pb-12 relative z-10">
        <Container>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8 items-start">
            
            {/* Column 1: Brand & Identity (lg:col-span-4) */}
            <div className="lg:col-span-4 space-y-5">
              <div className="inline-block bg-white px-4 py-2.5 rounded-xl border border-white/10 shadow-sm">
                <img
                  src={logoUrl}
                  alt={legalName}
                  className="h-10 sm:h-12 w-auto object-contain"
                  onError={(e) => {
                    e.currentTarget.src = '/images/ciplon_logo.png';
                  }}
                />
              </div>

              <div className="space-y-2">
                <h3 className="text-base font-bold text-white tracking-wide uppercase">
                  {legalName}
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Dedicated to delivering high-potency, research-driven finished pharmaceutical formulations. Marketed under strict quality management and regulatory compliance.
                </p>
              </div>

              {/* Badges / Credentials */}
              <div className="flex flex-wrap items-center gap-2 pt-1">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-white/5 border border-white/10 text-[11px] font-medium text-amber-300">
                  <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
                  <span>{isoCertification}</span>
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-white/5 border border-white/10 text-[11px] font-medium text-emerald-300">
                  <Award className="w-3.5 h-3.5 text-emerald-400" />
                  <span>WHO-GMP Partnered</span>
                </span>
              </div>

              {/* FSSAI Badge */}
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-slate-900/80 border border-[#c59324]/30 text-xs">
                <span className="italic font-black text-amber-400">fssai</span>
                <span className="text-slate-400 text-[11px]">
                  Lic. No. <strong className="text-amber-200 font-mono font-semibold">{fssaiLicNo}</strong>
                </span>
              </div>
            </div>

            {/* Column 2: Quick Links (lg:col-span-2) */}
            <div className="lg:col-span-2 space-y-4">
              <h4 className="text-xs font-bold text-white uppercase tracking-wider border-b border-white/10 pb-2.5">
                Explore
              </h4>
              <ul className="space-y-2.5 text-xs">
                <li>
                  <Link href="/" className="hover:text-amber-300 transition-colors inline-flex items-center gap-1 text-slate-300">
                    <ChevronRight className="w-3 h-3 text-[#c59324]" />
                    <span>Home</span>
                  </Link>
                </li>
                <li>
                  <Link href="/about" className="hover:text-amber-300 transition-colors inline-flex items-center gap-1 text-slate-300">
                    <ChevronRight className="w-3 h-3 text-[#c59324]" />
                    <span>About Us</span>
                  </Link>
                </li>
                <li>
                  <Link href="/products" className="hover:text-amber-300 transition-colors inline-flex items-center gap-1 text-slate-300">
                    <ChevronRight className="w-3 h-3 text-[#c59324]" />
                    <span>Our Formulations</span>
                  </Link>
                </li>
                <li>
                  <Link href="/quality" className="hover:text-amber-300 transition-colors inline-flex items-center gap-1 text-slate-300">
                    <ChevronRight className="w-3 h-3 text-[#c59324]" />
                    <span>Quality Assurance</span>
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="hover:text-amber-300 transition-colors inline-flex items-center gap-1 text-slate-300">
                    <ChevronRight className="w-3 h-3 text-[#c59324]" />
                    <span>Contact Corporate Desk</span>
                  </Link>
                </li>
                <li className="pt-1">
                  <Link href="/login" className="inline-flex items-center gap-1 text-amber-300 hover:text-white font-semibold">
                    <span>MR Connect Portal</span>
                    <ArrowUpRight className="w-3 h-3" />
                  </Link>
                </li>
              </ul>
            </div>

            {/* Column 3: Corporate & Manufacturing (lg:col-span-3) */}
            <div className="lg:col-span-3 space-y-4">
              <h4 className="text-xs font-bold text-white uppercase tracking-wider border-b border-white/10 pb-2.5">
                Registered Office
              </h4>
              <div className="space-y-2 text-xs text-slate-300 leading-relaxed">
                <div className="flex items-start gap-2.5">
                  <MapPin className="w-4 h-4 text-[#c59324] shrink-0 mt-0.5" />
                  <p>
                    {headquarters}, {city}, {state}, {country}-{postalCode}
                  </p>
                </div>
                <div className="flex items-center gap-2.5 pt-1">
                  <Mail className="w-4 h-4 text-[#c59324] shrink-0" />
                  <a href={`mailto:${email}`} className="text-amber-200 hover:text-white transition-colors underline">
                    {email}
                  </a>
                </div>
                <div className="flex items-center gap-2.5">
                  <Globe className="w-4 h-4 text-[#c59324] shrink-0" />
                  <a href={website} target="_blank" rel="noopener noreferrer" className="text-amber-200 hover:text-white transition-colors underline">
                    www.ciplonpharma.in
                  </a>
                </div>
              </div>

              <div className="pt-2 border-t border-white/10 space-y-1">
                <span className="text-[11px] font-semibold text-slate-400 block uppercase tracking-wider">
                  Manufacturing Partners:
                </span>
                <p className="text-xs text-slate-300 font-medium">
                  {manufacturerName}
                </p>
                <p className="text-[11px] text-amber-300/80">
                  {manufacturerCert}
                </p>
              </div>
            </div>

            {/* Column 4: Commercial Alliances & Inquiry (lg:col-span-3) */}
            <div className="lg:col-span-3 space-y-4">
              <h4 className="text-xs font-bold text-white uppercase tracking-wider border-b border-white/10 pb-2.5">
                Business Inquiries
              </h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Partner with us for third-party manufacturing alliances, PCD franchise opportunities, institutional hospital supplies, and distribution networks.
              </p>

              <button
                type="button"
                onClick={() => {
                  if (typeof onOpenEnquiryModal === 'function') {
                    onOpenEnquiryModal();
                  } else {
                    window.location.href = '/contact';
                  }
                }}
                className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-[#c59324] to-[#dfad36] hover:from-[#b0811d] hover:to-[#c59324] text-[#071527] font-bold text-xs uppercase tracking-wider transition-all cursor-pointer flex items-center justify-center gap-2 shadow-sm"
              >
                <span>Partner With Us</span>
                <ArrowUpRight className="w-4 h-4" />
              </button>

              <div className="pt-2 text-[11px] text-slate-400 space-y-1">
                <p className="text-amber-300/90 font-medium">
                  {trademarkStatus}
                </p>
                <p className="text-slate-500">
                  All formulations comply strictly with Schedule M & cGMP norms.
                </p>
              </div>
            </div>

          </div>
        </Container>
      </div>

      {/* Sub-footer Bottom Bar */}
      <div className="py-5 bg-[#040c17] text-slate-400 text-xs border-t border-white/5">
        <Container>
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
            <p className="text-[11px] sm:text-xs text-slate-400">
              © {CURRENT_YEAR} <span className="text-white font-medium">{legalName}</span>. All rights reserved.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4 text-[11px] sm:text-xs text-slate-400">
              <Link href="/about" className="hover:text-amber-300 transition-colors">About</Link>
              <span>•</span>
              <Link href="/products" className="hover:text-amber-300 transition-colors">Products</Link>
              <span>•</span>
              <Link href="/contact" className="hover:text-amber-300 transition-colors">Contact</Link>
              <span>•</span>
              <span className="text-slate-500">ISO 9001:2015</span>
            </div>
          </div>
        </Container>
      </div>
    </footer>
  );
}
