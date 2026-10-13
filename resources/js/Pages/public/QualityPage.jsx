import { Link } from '@inertiajs/react';
import { 
  ShieldCheck, 
  Award, 
  FlaskConical, 
  Microscope, 
  Factory, 
  CheckCircle2, 
  ArrowRight,
  FileCheck2,
  Sparkles,
  ClipboardList
} from 'lucide-react';
import PublicLayout from '../../layouts/PublicLayout';
import Container from '../../components/common/Container';

export default function QualityPage({ company }) {
  const companyData = company || {};

  const qualityPillars = [
    {
      title: 'WHO-GMP Certified Facility',
      desc: 'Formulations produced at Walpar Wellness Pvt. Ltd. (Khatraj Unit) adhering strictly to World Health Organization Good Manufacturing Practices with HEPA-filtered cleanrooms.',
      icon: Factory,
    },
    {
      title: 'ISO 9001:2015 Standards',
      desc: 'Audited Quality Management System (QMS) ensuring complete standardization across raw active pharmaceutical ingredient (API) procurement, compounding, and warehousing.',
      icon: Award,
    },
    {
      title: 'High-Precision Analytical QC',
      desc: 'In-house HPLC (High-Performance Liquid Chromatography), UV-Visible Spectrophotometry, and dissolution profile testing for every finished batch.',
      icon: Microscope,
    },
    {
      title: 'ICH Zone IVb Stability Testing',
      desc: 'Real-time and accelerated stability studies in climatic walk-in chambers calibrated for tropical Zone IVb conditions (30°C / 75% RH) to guarantee shelf-life integrity.',
      icon: FlaskConical,
    },
  ];

  const assuranceSteps = [
    { step: '01', title: 'API Vendor Qualification', desc: 'Approved vendor qualification and testing of raw active ingredients against IP/BP/USP pharmacopeial monographs.' },
    { step: '02', title: 'Automated Formulation', desc: 'Robotic weighing, granulation, compression, and sterile liquid blending minimizing human intervention.' },
    { step: '03', title: 'In-Process Quality Controls', desc: 'Continuous online weight variation, hardness, friability, disintegration, and leak testing.' },
    { step: '04', title: 'Finished Product Release', desc: 'Rigorous analytical assay, microbiological sterility confirmation, and issuance of authenticated Certificates of Analysis (COA).' },
  ];

  return (
    <PublicLayout companyData={companyData}>
      <div className="bg-white text-slate-900">
        
        {/* 1. Hero Header */}
        <section className="relative py-16 sm:py-24 bg-gradient-to-r from-[#0c2340] via-[#07172b] to-[#040e1b] text-white overflow-hidden border-b border-[#c59324]/20">
          <div className="absolute inset-0 opacity-15 pointer-events-none">
            <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern id="qualGrid" width="40" height="40" patternUnits="userSpaceOnUse">
                  <circle cx="20" cy="20" r="1.5" fill="#c59324" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#qualGrid)" />
            </svg>
          </div>

          <Container size="wide" className="relative z-10">
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#c59324]/20 border border-[#c59324]/40 text-[#dfad36] text-xs font-semibold uppercase tracking-wider mb-5">
                <ShieldCheck className="w-3.5 h-3.5" />
                Quality Assurance & Regulatory Rigor
              </div>
              <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-white leading-tight">
                Quality is a <span className="text-[#dfad36]">Matter of Fact</span>, Not a Compromise
              </h1>
              <p className="mt-5 text-base sm:text-lg text-slate-300 leading-relaxed font-normal">
                At Ciplon Pharma, quality compliance is integrated into every phase of pharmaceutical production. Through our certified manufacturing partner Walpar Wellness Pvt. Ltd., we maintain gold-standard WHO-GMP protocols and ISO 9001:2015 systems.
              </p>
              
              <div className="mt-8 flex flex-wrap items-center gap-4">
                <Link
                  href="/contact"
                  className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#c59324] to-[#dfad36] text-[#07172b] font-semibold text-sm hover:brightness-105 transition-all shadow-md flex items-center gap-2"
                >
                  Request Batch COA / Dossier
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  href="/products"
                  className="px-6 py-3 rounded-xl bg-white/10 hover:bg-white/15 text-white font-semibold text-sm border border-white/20 transition-all"
                >
                  Browse Tested Formulations
                </Link>
              </div>
            </div>
          </Container>
        </section>

        {/* 2. Four Quality Pillars */}
        <section className="py-16 sm:py-24 bg-slate-50 border-b border-slate-200">
          <Container size="wide">
            <div className="text-center max-w-2xl mx-auto mb-14">
              <span className="text-xs font-bold uppercase tracking-widest text-[#c59324]">Regulatory Foundation</span>
              <h2 className="text-2xl sm:text-4xl font-bold text-[#0c2340] mt-2">
                Four Pillars of Formulation Safety
              </h2>
              <div className="w-16 h-1 bg-gradient-to-r from-[#c59324] to-[#dfad36] mx-auto mt-3 rounded-full" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {qualityPillars.map((p, i) => {
                const Icon = p.icon;
                return (
                  <div
                    key={i}
                    className="p-6 rounded-2xl bg-white border border-slate-200 hover:border-[#c59324]/50 hover:shadow-lg transition-all duration-300 flex flex-col group"
                  >
                    <div className="w-12 h-12 rounded-xl bg-amber-50 group-hover:bg-[#c59324] text-[#c59324] group-hover:text-white flex items-center justify-center mb-5 transition-colors">
                      <Icon className="w-6 h-6 stroke-[2]" />
                    </div>
                    <h3 className="text-base sm:text-lg font-bold text-[#0c2340] mb-2">{p.title}</h3>
                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed flex-1">{p.desc}</p>
                  </div>
                );
              })}
            </div>
          </Container>
        </section>

        {/* 3. Laboratory Infrastructure & Photorealistic Laboratory Visuals */}
        <section className="py-16 sm:py-24 bg-white">
          <Container size="wide">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
              <div>
                <span className="text-xs font-bold uppercase tracking-widest text-[#c59324]">Validation Systems</span>
                <h2 className="text-2xl sm:text-4xl font-bold text-[#0c2340] mt-2 mb-6">
                  Comprehensive Analytical & Microbiological Testing
                </h2>
                <div className="space-y-4 text-slate-600 text-sm sm:text-base leading-relaxed">
                  <p>
                    Every formulation marketed by Ciplon is backed by complete documentation. Before commercial release, batch samples are subjected to stringent chemical assays, dissolution mapping, content uniformity, and microbial bioburden testing.
                  </p>
                  <p>
                    Our manufacturing unit at <strong>Walpar Wellness Pvt. Ltd. (Khatraj Unit)</strong> employs modern validation equipment to ensure that every blister pack, bottle, and vial retains its labeled potency throughout its shelf life.
                  </p>
                </div>

                <div className="mt-8 space-y-3">
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-[#c59324] shrink-0" />
                    <span className="text-sm font-semibold text-slate-800">Assay & Purity testing via calibrated HPLC instrumentation</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-[#c59324] shrink-0" />
                    <span className="text-sm font-semibold text-slate-800">Dissolution profiling according to IP / BP / USP monographs</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-[#c59324] shrink-0" />
                    <span className="text-sm font-semibold text-slate-800">Full batch traceability with serialized tamper-evident carton packaging</span>
                  </div>
                </div>
              </div>

              {/* Lab photo */}
              <div className="relative">
                <div className="rounded-3xl overflow-hidden shadow-2xl border-4 border-white aspect-[4/3] bg-slate-900">
                  <img
                    src="/images/pharma_rd_lab.jpg"
                    alt="Pharmaceutical Quality Control Laboratory"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>
          </Container>
        </section>

        {/* 4. Step-by-Step Quality Journey */}
        <section className="py-16 sm:py-24 bg-[#0c2340] text-white">
          <Container size="wide">
            <div className="text-center max-w-2xl mx-auto mb-14">
              <span className="text-xs font-bold uppercase tracking-widest text-[#dfad36]">Workflow Protocol</span>
              <h2 className="text-2xl sm:text-4xl font-bold text-white mt-2">
                4-Stage Quality Assurance Protocol
              </h2>
              <div className="w-16 h-1 bg-gradient-to-r from-[#c59324] to-[#dfad36] mx-auto mt-3 rounded-full" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {assuranceSteps.map((s, idx) => (
                <div key={idx} className="p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-[#dfad36]/50 transition-all">
                  <span className="text-2xl font-bold text-[#dfad36] tracking-tight block mb-2">
                    {s.step}
                  </span>
                  <h4 className="text-base font-bold text-white mb-2">{s.title}</h4>
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">{s.desc}</p>
                </div>
              ))}
            </div>
          </Container>
        </section>

        {/* 5. Regulatory Credentials Summary */}
        <section className="py-14 bg-white border-t border-slate-200">
          <Container size="wide">
            <div className="bg-slate-50 p-8 sm:p-10 rounded-3xl border border-slate-200 flex flex-col md:flex-row items-center justify-between gap-6">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-[#c59324]">Regulatory Compliance</span>
                <h3 className="text-xl sm:text-2xl font-bold text-[#0c2340] mt-1">
                  Need a Product Monograph or Dossier?
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-xl">
                  We supply CTD dossiers, stability data summaries, and batch Certificates of Analysis for hospitals, state tenders, and institutional procurement partners.
                </p>
              </div>

              <div className="shrink-0 flex items-center gap-3">
                <Link
                  href="/contact"
                  className="px-6 py-3 rounded-xl bg-[#0c2340] hover:bg-slate-800 text-white font-semibold text-sm transition-all shadow-md"
                >
                  Contact Regulatory Desk
                </Link>
                <Link
                  href="/products"
                  className="px-6 py-3 rounded-xl bg-white border border-slate-300 text-slate-800 hover:border-[#c59324] font-semibold text-sm transition-all"
                >
                  View Products
                </Link>
              </div>
            </div>
          </Container>
        </section>

      </div>
    </PublicLayout>
  );
}
