import { Link } from '@inertiajs/react';
import { 
  Building2, 
  ShieldCheck, 
  Award, 
  FlaskConical, 
  Globe2, 
  Users2, 
  Factory, 
  CheckCircle2, 
  ArrowRight,
  Microscope,
  HeartPulse,
  Sparkles
} from 'lucide-react';
import PublicLayout from '../../layouts/PublicLayout';
import Container from '../../components/common/Container';
import SeoHead from '../../components/common/SeoHead';

export default function AboutPage({ company, categories = [], featuredProducts = [] }) {
  const companyData = company || {};

  const values = [
    {
      title: 'Uncompromising Quality',
      desc: 'Formulations engineered in strictly audited WHO-GMP and ISO 9001:2015 certified facilities with rigorous batch-level HPLC purity verification.',
      icon: ShieldCheck,
    },
    {
      title: 'Accessible Healthcare',
      desc: 'Bridging modern therapeutic innovation with economic affordability, ensuring life-saving medicines reach every community across India.',
      icon: HeartPulse,
    },
    {
      title: 'Research-Led Formulations',
      desc: 'Active pipeline spanning specialty therapeutics, complex generics, preventive nutra-medicines, and stability-tested dosage forms.',
      icon: FlaskConical,
    },
    {
      title: 'Ethical Transparency',
      desc: 'Committed to complete compliance integrity, transparent monographs, strict pharmacovigilance, and dependable physician trust.',
      icon: CheckCircle2,
    },
  ];

  const milestones = [
    { year: 'Incorporation', title: 'Founded with a Vision', desc: 'Established Ciplon Pharma Private Limited with a core dedication to therapeutic excellence and patient-first healthcare.' },
    { year: 'WHO-GMP Alignment', title: 'State-of-the-Art Partnering', desc: 'Partnered with premier WHO-GMP manufacturing leaders Walpar Wellness Pvt. Ltd. (Khatraj Unit) and Akums Drugs & Pharmaceuticals Ltd. (Pure & Cure Healthcare).' },
    { year: 'ISO 9001:2015', title: 'Quality System Certified', desc: 'Attained formal ISO 9001:2015 quality management standards across all procurement, supply chain, and packaging stages.' },
    { year: 'Nationwide Expansion', title: '9,738+ Registrations', desc: 'Scaled multi-state distribution channels, institutional hospital supply, and specialized medical representative networks.' },
  ];

  return (
    <PublicLayout companyData={companyData} categories={categories}>
      <SeoHead
        title="About Us — Corporate Profile & Manufacturing Heritage"
        description="Learn about Ciplon Pharma Private Limited, our ISO 9001:2015 certification, and our certified manufacturing partners Walpar Wellness Pvt. Ltd. and Akums Drugs & Pharmaceuticals Ltd. (Pure & Cure Healthcare)."
        canonicalUrl="https://www.ciplonpharma.in/about"
      />
      <div className="bg-white text-slate-900">
        
        {/* 1. Hero Header */}
        <section className="relative py-16 sm:py-24 bg-gradient-to-r from-[#0c2340] via-[#07172b] to-[#040e1b] text-white overflow-hidden border-b border-[#c59324]/20">
          <div className="absolute inset-0 opacity-15 pointer-events-none">
            <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern id="aboutGrid" width="40" height="40" patternUnits="userSpaceOnUse">
                  <circle cx="20" cy="20" r="1.5" fill="#c59324" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#aboutGrid)" />
            </svg>
          </div>

          <Container size="wide" className="relative z-10">
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#c59324]/20 border border-[#c59324]/40 text-[#dfad36] text-xs font-semibold uppercase tracking-wider mb-5">
                <Sparkles className="w-3.5 h-3.5" />
                Corporate Profile & Heritage
              </div>
              <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-white leading-tight">
                Committed to <span className="text-[#dfad36]">Healthcare Excellence</span> & Scientific Innovation
              </h1>
              <p className="mt-5 text-base sm:text-lg text-slate-300 leading-relaxed font-normal">
                Ciplon Pharma Private Limited is an ISO 9001:2015 certified pharmaceutical formulations enterprise dedicated to delivering dependable, bioequivalent, and accessible therapeutics across clinical disciplines.
              </p>
              
              <div className="mt-8 flex flex-wrap items-center gap-4">
                <Link
                  href="/products"
                  className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#c59324] to-[#dfad36] text-[#07172b] font-semibold text-sm hover:brightness-105 transition-all shadow-md flex items-center gap-2"
                >
                  Explore Formulations
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  href="/contact"
                  className="px-6 py-3 rounded-xl bg-white/10 hover:bg-white/15 text-white font-semibold text-sm border border-white/20 transition-all"
                >
                  Partner With Us
                </Link>
              </div>
            </div>
          </Container>
        </section>

        {/* 2. Overview & Indian Medical Imagery */}
        <section className="py-16 sm:py-24 bg-slate-50 border-b border-slate-200">
          <Container size="wide">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
              <div>
                <span className="text-xs font-bold uppercase tracking-widest text-[#c59324]">Who We Are</span>
                <h2 className="text-2xl sm:text-4xl font-bold text-[#0c2340] mt-2 mb-6">
                  Pioneering Therapeutics with Human Warmth & Clinical Rigor
                </h2>
                <div className="space-y-4 text-slate-600 text-sm sm:text-base leading-relaxed">
                  <p>
                    Rooted in India’s dynamic pharmaceutical landscape, <strong>Ciplon Pharma Private Limited</strong> combines scientific research with modern formulation technology. Our portfolio spans prescription medicines, specialty injectables, oral solid dosages, and targeted nutraceutical therapeutics.
                  </p>
                  <p>
                    Every Ciplon brand undergoes comprehensive testing to ensure bioavailability, physiological stability, and therapeutic efficacy. We maintain stringent adherence to Indian Pharmacopoeia (IP), British Pharmacopoeia (BP), and United States Pharmacopeia (USP) monographs.
                  </p>
                </div>

                {/* Key Credentials Grid */}
                <div className="mt-8 grid grid-cols-2 gap-4">
                  <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs">
                    <span className="text-xs text-slate-500 uppercase font-semibold block">Quality Standard</span>
                    <span className="text-base font-bold text-[#0c2340] mt-1 block">ISO 9001:2015</span>
                    <span className="text-xs text-slate-500 mt-0.5 block">Certified QMS Protocol</span>
                  </div>
                  <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs">
                    <span className="text-xs text-slate-500 uppercase font-semibold block">Regulatory Lic.</span>
                    <span className="text-base font-bold text-[#0c2340] mt-1 block">FSSAI 10426340000172</span>
                    <span className="text-xs text-slate-500 mt-0.5 block">Central Safety Approval</span>
                  </div>
                </div>
              </div>

              {/* Indian Medical Scientists Image */}
              <div className="relative">
                <div className="rounded-3xl overflow-hidden shadow-2xl border-4 border-white aspect-[4/3] bg-slate-900 relative">
                  <img
                    src="/images/hero_indian_doctors.jpg"
                    alt="Indian Medical Professionals at Ciplon"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0c2340]/80 via-transparent to-transparent flex items-end p-6">
                    <div className="text-white">
                      <p className="text-xs uppercase tracking-wider text-[#dfad36] font-semibold">Medical Excellence</p>
                      <p className="text-base sm:text-lg font-bold">Trusted by Clinicians & Healthcare Specialists Across India</p>
                    </div>
                  </div>
                </div>
                {/* Floating badge */}
                <div className="hidden sm:flex absolute -bottom-6 -left-6 bg-[#0c2340] text-white p-5 rounded-2xl shadow-xl border border-[#c59324]/30 items-center gap-4 max-w-xs">
                  <div className="w-12 h-12 rounded-full bg-[#c59324]/20 border border-[#c59324] flex items-center justify-center text-[#dfad36] shrink-0">
                    <Factory className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-300">Mfg Partners</p>
                    <p className="text-sm font-bold text-white leading-snug">Walpar Wellness & Akums Group</p>
                  </div>
                </div>
              </div>
            </div>
          </Container>
        </section>

        {/* 3. Core Values */}
        <section className="py-16 sm:py-24 bg-white">
          <Container size="wide">
            <div className="text-center max-w-2xl mx-auto mb-14">
              <span className="text-xs font-bold uppercase tracking-widest text-[#c59324]">Guiding Pillars</span>
              <h2 className="text-2xl sm:text-4xl font-bold text-[#0c2340] mt-2">
                Our Foundational Values
              </h2>
              <div className="w-16 h-1 bg-gradient-to-r from-[#c59324] to-[#dfad36] mx-auto mt-3 rounded-full" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {values.map((v, i) => {
                const Icon = v.icon;
                return (
                  <div
                    key={i}
                    className="p-6 rounded-2xl bg-white border border-slate-200 hover:border-[#c59324]/50 hover:shadow-lg transition-all duration-300 flex flex-col group"
                  >
                    <div className="w-12 h-12 rounded-xl bg-amber-50 group-hover:bg-[#c59324] text-[#c59324] group-hover:text-white flex items-center justify-center mb-5 transition-colors">
                      <Icon className="w-6 h-6 stroke-[2]" />
                    </div>
                    <h3 className="text-base sm:text-lg font-bold text-[#0c2340] mb-2">{v.title}</h3>
                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed flex-1">{v.desc}</p>
                  </div>
                );
              })}
            </div>
          </Container>
        </section>

        {/* 4. Manufacturing & Packaging Excellence (Walpar Wellness & Akums Group details) */}
        <section className="py-16 sm:py-24 bg-[#0c2340] text-white relative overflow-hidden">
          <Container size="wide">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className="order-2 lg:order-1 space-y-6">
                <div className="rounded-3xl overflow-hidden shadow-2xl border-4 border-white/10 aspect-[4/3] bg-slate-900">
                  <img
                    src="/images/pharma_automation_line.jpg"
                    alt="WHO-GMP Automated Packaging & Manufacturing Line"
                    className="w-full h-full object-cover"
                  />
                </div>
                {/* Partner Badges */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 rounded-2xl bg-white/10 border border-white/15 backdrop-blur-sm flex items-center gap-3">
                    <img src="/images/walpar_logo.png" alt="Walpar Wellness" className="h-9 w-auto object-contain bg-white/90 p-1 rounded-lg" />
                    <div>
                      <p className="text-xs font-bold text-white">Walpar Wellness</p>
                      <p className="text-[10px] text-[#dfad36]">WHO-GMP Khatraj Unit</p>
                    </div>
                  </div>
                  <div className="p-4 rounded-2xl bg-white/10 border border-white/15 backdrop-blur-sm flex items-center gap-3">
                    <img src="/images/akums_logo.png" alt="Akums Group" className="h-9 w-auto object-contain bg-white/90 p-1 rounded-lg" />
                    <div>
                      <p className="text-xs font-bold text-white">Akums Group</p>
                      <p className="text-[10px] text-[#dfad36]">Pure & Cure Healthcare</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="order-1 lg:order-2">
                <span className="text-xs font-bold uppercase tracking-widest text-[#dfad36]">Manufacturing Infrastructure</span>
                <h2 className="text-2xl sm:text-4xl font-bold text-white mt-2 mb-6">
                  Premier Contract Manufacturing Partners — Precision at Scale
                </h2>
                <p className="text-slate-300 text-sm sm:text-base leading-relaxed mb-6">
                  Ciplon Pharma is a specialized pharmaceutical formulations enterprise. We deliberately do not own captive plants; instead, all our formulations are manufactured under strict loan licensing and contract agreements at India’s premier WHO-GMP certified facilities: <strong>Walpar Wellness Pvt. Ltd.</strong> and <strong>Akums Drugs & Pharmaceuticals Ltd. (Pure & Cure Healthcare Pvt. Ltd.)</strong>.
                </p>

                <div className="space-y-4">
                  <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-1">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-5 h-5 text-[#dfad36] shrink-0" />
                      <strong className="text-sm text-white">Walpar Wellness Pvt. Ltd. (Khatraj Unit, Gujarat)</strong>
                    </div>
                    <p className="text-xs text-slate-300 pl-7">
                      Plot No. 2/A & 06, Opp. Sabarmati Gas Station, Khatraj, Kalol, Gandhinagar, Gujarat - 382721. WHO-GMP & ISO 9001:2015 accredited unit featuring high-speed blistering and serialization.
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-1">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-5 h-5 text-[#dfad36] shrink-0" />
                      <strong className="text-sm text-white">Akums Drugs & Pharmaceuticals Ltd. (Pure & Cure Healthcare)</strong>
                    </div>
                    <p className="text-xs text-slate-300 pl-7">
                      Sector-8A, IIE SIDCUL Ranipur, Haridwar, Uttarakhand & Baddi Units. One of India’s largest pharmaceutical manufacturing groups with international quality accreditations.
                    </p>
                  </div>
                </div>

                <div className="mt-8">
                  <Link
                    href="/quality"
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-sm border border-white/20 transition-all"
                  >
                    View Quality & Compliance Dossier
                    <ArrowRight className="w-4 h-4 text-[#dfad36]" />
                  </Link>
                </div>
              </div>
            </div>
          </Container>
        </section>

        {/* 5. Corporate Journey / Milestones */}
        <section className="py-16 sm:py-24 bg-white">
          <Container size="wide">
            <div className="text-center max-w-2xl mx-auto mb-14">
              <span className="text-xs font-bold uppercase tracking-widest text-[#c59324]">Heritage</span>
              <h2 className="text-2xl sm:text-4xl font-bold text-[#0c2340] mt-2">
                Our Path to Excellence
              </h2>
              <div className="w-16 h-1 bg-gradient-to-r from-[#c59324] to-[#dfad36] mx-auto mt-3 rounded-full" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {milestones.map((m, i) => (
                <div key={i} className="p-6 rounded-2xl bg-slate-50 border border-slate-200 relative">
                  <span className="text-xs font-bold text-[#c59324] tracking-wider uppercase block mb-1">
                    {m.year}
                  </span>
                  <h3 className="text-base font-bold text-[#0c2340] mb-2">{m.title}</h3>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">{m.desc}</p>
                </div>
              ))}
            </div>
          </Container>
        </section>

        {/* 6. Contact / Inquire CTA */}
        <section className="py-14 bg-gradient-to-r from-[#0c2340] to-[#07172b] text-white text-center">
          <Container size="narrow">
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3">
              Looking for Formulations or Distribution Partnerships?
            </h2>
            <p className="text-slate-300 text-sm sm:text-base max-w-xl mx-auto mb-7">
              Connect with our corporate team for bulk supply, institutional partnerships, and third-party contracts.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <Link
                href="/contact"
                className="px-7 py-3 rounded-xl bg-gradient-to-r from-[#c59324] to-[#dfad36] text-[#07172b] font-semibold text-sm hover:brightness-105 transition-all shadow-md"
              >
                Contact Corporate Desk
              </Link>
              <Link
                href="/products"
                className="px-7 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-sm border border-white/20 transition-all"
              >
                Browse All Formulations
              </Link>
            </div>
          </Container>
        </section>

      </div>
    </PublicLayout>
  );
}
