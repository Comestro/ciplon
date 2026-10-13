import { useState } from 'react';
import { useForm } from '@inertiajs/react';
import { 
  Building2, 
  Factory, 
  Mail, 
  Phone, 
  MapPin, 
  Send, 
  CheckCircle2, 
  Clock, 
  ShieldCheck,
  FileText,
  Sparkles
} from 'lucide-react';
import PublicLayout from '../../layouts/PublicLayout';
import Container from '../../components/common/Container';

export default function ContactPage({ company }) {
  const companyData = company || {};
  const [submitted, setSubmitted] = useState(false);

  const { data, setData, post, processing, errors, reset } = useForm({
    name: '',
    email: '',
    phone: '',
    company: '',
    inquiry_type: 'General Enquiry',
    message: '',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    post('/enquiry', {
      preserveScroll: true,
      onSuccess: () => {
        setSubmitted(true);
        reset();
      },
    });
  };

  return (
    <PublicLayout companyData={companyData}>
      <div className="bg-white text-slate-900">
        
        {/* 1. Hero Header */}
        <section className="relative py-16 sm:py-24 bg-gradient-to-r from-[#0c2340] via-[#07172b] to-[#040e1b] text-white overflow-hidden border-b border-[#c59324]/20">
          <div className="absolute inset-0 opacity-15 pointer-events-none">
            <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern id="contactGrid" width="40" height="40" patternUnits="userSpaceOnUse">
                  <circle cx="20" cy="20" r="1.5" fill="#c59324" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#contactGrid)" />
            </svg>
          </div>

          <Container size="wide" className="relative z-10">
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#c59324]/20 border border-[#c59324]/40 text-[#dfad36] text-xs font-semibold uppercase tracking-wider mb-5">
                <Sparkles className="w-3.5 h-3.5" />
                Connect With Us
              </div>
              <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-white leading-tight">
                Corporate Contacts & <span className="text-[#dfad36]">Commercial Inquiries</span>
              </h1>
              <p className="mt-5 text-base sm:text-lg text-slate-300 leading-relaxed font-normal">
                Whether you are seeking institutional bulk supply, PCD franchise distribution, contract manufacturing, or product dossiers, our pharmaceutical team is here to assist.
              </p>
            </div>
          </Container>
        </section>

        {/* 2. Main Contact Grid: Information Cards + Form */}
        <section className="py-16 sm:py-24 bg-slate-50 border-b border-slate-200">
          <Container size="wide">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
              
              {/* Left Column: Authentic Corporate & Manufacturing Details (5 cols) */}
              <div className="lg:col-span-5 space-y-6">
                <div>
                  <span className="text-xs font-bold uppercase tracking-widest text-[#c59324]">Official Locations</span>
                  <h2 className="text-2xl sm:text-3xl font-bold text-[#0c2340] mt-1 mb-4">
                    Registered Offices & Facilities
                  </h2>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    Direct your correspondence to our registered corporate office or regulatory contact desk.
                  </p>
                </div>

                {/* Card 1: Registered Office (Ciplon Pharma) */}
                <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs hover:border-[#c59324]/40 transition-colors">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-amber-50 border border-[#c59324]/30 text-[#c59324] flex items-center justify-center shrink-0">
                      <Building2 className="w-6 h-6 stroke-[2]" />
                    </div>
                    <div>
                      <span className="text-xs font-bold uppercase tracking-wider text-[#c59324]">Corporate Headquarters</span>
                      <h3 className="text-base font-bold text-[#0c2340] mt-0.5 mb-1.5">
                        Ciplon Pharma Private Limited
                      </h3>
                      <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                        M24/A, KH No. 294, 1st Floor, Batla House, Okhla, Jamia Nagar, South Delhi, Delhi - 110025, India
                      </p>
                      <div className="mt-3 pt-3 border-t border-slate-100 flex flex-wrap gap-2 text-xs font-medium text-slate-500">
                        <span className="bg-slate-100 px-2 py-0.5 rounded">ISO 9001:2015</span>
                        <span className="bg-slate-100 px-2 py-0.5 rounded">FSSAI 10426340000172</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Card 2: Manufacturing Partner (Walpar Wellness) */}
                <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs hover:border-[#c59324]/40 transition-colors">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-slate-100 border border-slate-200 text-[#0c2340] flex items-center justify-center shrink-0">
                      <Factory className="w-6 h-6 stroke-[2]" />
                    </div>
                    <div>
                      <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Manufacturing Unit</span>
                      <h3 className="text-base font-bold text-[#0c2340] mt-0.5 mb-1.5">
                        Walpar Wellness Pvt. Ltd.
                      </h3>
                      <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                        Plot No. 2/A & 06, Opp. Sabarmati Gas Station, Khatraj, Kalol, Gandhinagar, Gujarat - 382721
                      </p>
                      <div className="mt-3 pt-3 border-t border-slate-100 flex flex-wrap gap-2 text-xs font-medium text-slate-500">
                        <span className="bg-amber-50 text-[#c59324] px-2 py-0.5 rounded font-semibold">WHO-GMP Certified</span>
                        <span className="bg-slate-100 px-2 py-0.5 rounded">Automated Lines</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Direct Communications */}
                <div className="p-6 rounded-2xl bg-[#0c2340] text-white">
                  <h4 className="text-sm font-bold text-[#dfad36] uppercase tracking-wider mb-4">
                    Direct Desks
                  </h4>
                  <div className="space-y-3.5 text-xs sm:text-sm">
                    <div className="flex items-center gap-3">
                      <Mail className="w-4 h-4 text-[#dfad36] shrink-0" />
                      <a href="mailto:info@ciplonpharma.in" className="text-slate-200 hover:text-white underline-offset-2 hover:underline">
                        info@ciplonpharma.in
                      </a>
                    </div>
                    <div className="flex items-center gap-3">
                      <Phone className="w-4 h-4 text-[#dfad36] shrink-0" />
                      <span className="text-slate-200">
                        {companyData?.company_phone || '+91 800 458 7290'}
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Clock className="w-4 h-4 text-[#dfad36] shrink-0" />
                      <span className="text-slate-300">
                        Monday – Saturday: 9:30 AM – 6:30 PM IST
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column: Interactive Commercial Inquiry Form (7 cols) */}
              <div className="lg:col-span-7">
                <div className="bg-white p-8 sm:p-10 rounded-3xl border border-slate-200 shadow-md">
                  <div className="mb-6">
                    <span className="text-xs font-bold uppercase tracking-widest text-[#c59324]">Inquiry Form</span>
                    <h3 className="text-2xl font-bold text-[#0c2340] mt-1">
                      Send a Commercial Inquiry
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-500 mt-1">
                      Fill out your requirements below and our commercial division will connect with you within 24 hours.
                    </p>
                  </div>

                  {submitted ? (
                    <div className="p-8 rounded-2xl bg-amber-50/80 border border-[#c59324]/40 text-center space-y-4">
                      <div className="w-14 h-14 rounded-full bg-[#c59324] text-white flex items-center justify-center mx-auto shadow-md">
                        <CheckCircle2 className="w-8 h-8" />
                      </div>
                      <h4 className="text-xl font-bold text-[#0c2340]">Inquiry Transmitted Successfully</h4>
                      <p className="text-sm text-slate-600 max-w-md mx-auto">
                        Thank you for reaching out to Ciplon Pharma. Our regulatory and business desk will review your details and respond promptly.
                      </p>
                      <button
                        type="button"
                        onClick={() => setSubmitted(false)}
                        className="px-6 py-2.5 rounded-xl bg-[#0c2340] text-white text-xs font-semibold hover:bg-slate-800 transition-all cursor-pointer"
                      >
                        Submit Another Inquiry
                      </button>
                    </div>
                  ) : (
                    <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                            Full Name <span className="text-rose-500">*</span>
                          </label>
                          <input
                            type="text"
                            required
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                            placeholder="Dr. / Mr. / Ms. Full Name"
                            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-[#c59324] focus:ring-2 focus:ring-[#c59324]/20 outline-none text-sm transition-all"
                          />
                          {errors.name && <p className="text-rose-500 text-xs mt-1">{errors.name}</p>}
                        </div>

                        <div>
                          <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                            Email Address <span className="text-rose-500">*</span>
                          </label>
                          <input
                            type="email"
                            required
                            value={data.email}
                            onChange={(e) => setData('email', e.target.value)}
                            placeholder="name@organization.com"
                            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-[#c59324] focus:ring-2 focus:ring-[#c59324]/20 outline-none text-sm transition-all"
                          />
                          {errors.email && <p className="text-rose-500 text-xs mt-1">{errors.email}</p>}
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                            Phone / WhatsApp <span className="text-rose-500">*</span>
                          </label>
                          <input
                            type="tel"
                            required
                            value={data.phone}
                            onChange={(e) => setData('phone', e.target.value)}
                            placeholder="+91 98765 43210"
                            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-[#c59324] focus:ring-2 focus:ring-[#c59324]/20 outline-none text-sm transition-all"
                          />
                          {errors.phone && <p className="text-rose-500 text-xs mt-1">{errors.phone}</p>}
                        </div>

                        <div>
                          <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                            Organization / Hospital / Distributor
                          </label>
                          <input
                            type="text"
                            value={data.company}
                            onChange={(e) => setData('company', e.target.value)}
                            placeholder="Hospital / Pharmacy / Distributor Name"
                            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-[#c59324] focus:ring-2 focus:ring-[#c59324]/20 outline-none text-sm transition-all"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                          Inquiry Nature
                        </label>
                        <select
                          value={data.inquiry_type}
                          onChange={(e) => setData('inquiry_type', e.target.value)}
                          className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-[#c59324] focus:ring-2 focus:ring-[#c59324]/20 outline-none text-sm bg-white transition-all"
                        >
                          <option value="General Enquiry">General Corporate Inquiry</option>
                          <option value="Bulk Formulation Supply">Bulk Formulation Supply</option>
                          <option value="PCD Pharma Franchise">PCD Pharma Franchise / Regional Stockist</option>
                          <option value="Hospital & Institutional Tender">Hospital & Institutional Tender</option>
                          <option value="Third-Party Contract Manufacturing">Third-Party Contract Manufacturing</option>
                          <option value="Product Monograph & Dossier">Product Monograph & Dossier Request</option>
                          <option value="Pharmacovigilance">Pharmacovigilance & Drug Safety</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                          Detailed Message & Requirements <span className="text-rose-500">*</span>
                        </label>
                        <textarea
                          required
                          rows={4}
                          value={data.message}
                          onChange={(e) => setData('message', e.target.value)}
                          placeholder="Please provide dosage form, molecule, expected volume, or specific queries..."
                          className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-[#c59324] focus:ring-2 focus:ring-[#c59324]/20 outline-none text-sm transition-all"
                        />
                        {errors.message && <p className="text-rose-500 text-xs mt-1">{errors.message}</p>}
                      </div>

                      <button
                        type="submit"
                        disabled={processing}
                        className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-[#c59324] to-[#dfad36] text-[#07172b] font-bold text-sm hover:brightness-105 transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                      >
                        <Send className="w-4 h-4" />
                        {processing ? 'Transmitting Inquiry...' : 'Submit Commercial Inquiry'}
                      </button>
                    </form>
                  )}
                </div>
              </div>

            </div>
          </Container>
        </section>

        {/* 3. FAQ Section */}
        <section className="py-16 sm:py-20 bg-white">
          <Container size="narrow">
            <div className="text-center max-w-xl mx-auto mb-12">
              <span className="text-xs font-bold uppercase tracking-widest text-[#c59324]">Assistance</span>
              <h2 className="text-2xl sm:text-3xl font-bold text-[#0c2340] mt-1">
                Frequently Asked Inquiries
              </h2>
            </div>

            <div className="space-y-4">
              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200">
                <h4 className="text-sm font-bold text-[#0c2340]">How can I request Certificates of Analysis (COA)?</h4>
                <p className="text-xs sm:text-sm text-slate-600 mt-1.5 leading-relaxed">
                  Every batch manufactured at Walpar Wellness is accompanied by an authenticated Certificate of Analysis (COA). You can submit a request with the batch number via this form or by emailing info@ciplonpharma.in.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200">
                <h4 className="text-sm font-bold text-[#0c2340]">Do you provide PCD Franchise & Distributorship rights?</h4>
                <p className="text-xs sm:text-sm text-slate-600 mt-1.5 leading-relaxed">
                  Yes, Ciplon Pharma offers monopoly-based district and territorial PCD distributorship agreements backed by promotional inputs, visual aids, MR training kits, and timely product delivery.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200">
                <h4 className="text-sm font-bold text-[#0c2340]">What regulatory standards govern your formulation packaging?</h4>
                <p className="text-xs sm:text-sm text-slate-600 mt-1.5 leading-relaxed">
                  All formulations comply strictly with Schedule M (WHO-GMP guidelines), FSSAI license 10426340000172 regulations, and ISO 9001:2015 quality assurance protocols with tamper-evident packaging.
                </p>
              </div>
            </div>
          </Container>
        </section>

      </div>
    </PublicLayout>
  );
}
