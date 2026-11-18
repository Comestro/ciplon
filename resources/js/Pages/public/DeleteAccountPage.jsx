import { useState } from 'react';
import { Link } from '@inertiajs/react';
import {
  Trash2,
  Mail,
  CheckCircle2,
  ShieldAlert,
  Clock,
  Copy,
  Check,
  ArrowRight,
  FileCheck2,
  ShieldCheck,
} from 'lucide-react';
import PublicLayout from '../../layouts/PublicLayout';
import Container from '../../components/common/Container';
import SeoHead from '../../components/common/SeoHead';

export default function DeleteAccountPage({ company }) {
  const companyData = company || {};
  const legalName = companyData.legal_name || 'Ciplon Pharma Private Limited';
  const email = companyData.enquiries_email || companyData.company_email || 'info@ciplonpharma.in';
  const website = companyData.website_url || 'https://www.ciplonpharma.in';

  const [copied, setCopied] = useState(false);

  const emailSubject = 'Account Deletion Request — Ciplon / MR Connect';
  const emailBody = `Hello Ciplon Pharma Support Team,

I would like to request the permanent deletion of my account and associated personal data from the Ciplon Pharma / MR Connect platform.

Account Details for Verification:
- Full Name: [Enter your full name]
- Registered Email Address: [Enter your registered email]
- Role / Account Type: [Medical Representative / Manager / Staff]
- Reason (Optional): [Optional]

Please confirm once my account has been permanently deleted.

Thank you.`;

  const mailtoHref = `mailto:${email}?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`;

  const handleCopyTemplate = async () => {
    try {
      await navigator.clipboard.writeText(`To: ${email}\nSubject: ${emailSubject}\n\n${emailBody}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // Fallback ignored if clipboard permissions are restricted
    }
  };

  const steps = [
    {
      step: '01',
      title: 'Send an Account Deletion Email',
      desc: `Compose an email from your registered account email address to ${email} with the subject "${emailSubject}". Sending from your registered email helps us verify account ownership quickly.`,
    },
    {
      step: '02',
      title: 'Include Your Verification Details',
      desc: 'Provide your Full Name, Registered Email Address, and Role (e.g., Medical Representative or Staff) in the email body so our administration team can accurately locate your account.',
    },
    {
      step: '03',
      title: 'Verification & Confirmation (Within 7 Business Days)',
      desc: 'Our support and compliance administrator will verify your identity, deactivate and permanently remove your account credentials and personal profile data within 7 business days, and email you a confirmation once complete.',
    },
  ];

  return (
    <PublicLayout companyData={companyData}>
      <SeoHead
        title="Delete Account — Account & Data Deletion Instructions"
        description={`Step-by-step instructions to request permanent deletion of your ${legalName} / MR Connect account and associated personal data.`}
        canonicalUrl={`${website.replace(/\/$/, '')}/delete-account`}
      />

      <div className="bg-white text-slate-900">
        {/* Hero Header */}
        <section className="relative py-14 sm:py-20 bg-gradient-to-r from-[#0c2340] via-[#07172b] to-[#040e1b] text-white overflow-hidden border-b border-[#c59324]/20">
          <Container size="wide" className="relative z-10">
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-rose-500/20 border border-rose-400/40 text-rose-200 text-xs font-semibold uppercase tracking-wider mb-4">
                <Trash2 className="w-3.5 h-3.5" />
                Account & Data Deletion Request
              </div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight leading-tight">
                How to Delete Your Account
              </h1>
              <p className="text-sm sm:text-base text-slate-300 mt-4 leading-relaxed">
                Follow the steps below to permanently delete your <strong className="text-white">{legalName}</strong> / MR Connect user account and associated personal data.
              </p>

              <div className="flex flex-wrap items-center gap-3 mt-6">
                <a
                  href={mailtoHref}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#c59324] to-[#dfad36] hover:from-[#b0811d] hover:to-[#c59324] text-[#071527] font-bold text-xs sm:text-sm transition-all shadow-sm"
                >
                  <Mail className="w-4 h-4" />
                  <span>Email Deletion Request to {email}</span>
                </a>
                <Link
                  href="/privacy-policy"
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 border border-white/15 text-white text-xs sm:text-sm font-semibold transition-colors"
                >
                  <ShieldCheck className="w-4 h-4 text-[#dfad36]" />
                  <span>Read Privacy Policy</span>
                </Link>
              </div>
            </div>
          </Container>
        </section>

        {/* Main Content */}
        <section className="py-12 sm:py-16 bg-slate-50/50">
          <Container>
            <div className="max-w-4xl mx-auto space-y-8">
              {/* Step-by-Step Guide */}
              <div className="space-y-4">
                <h2 className="text-xl sm:text-2xl font-bold text-[#0c2340]">
                  Step-by-Step Deletion Process
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                  {steps.map((item) => (
                    <div
                      key={item.step}
                      className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-[0_1px_3px_rgba(0,0,0,0.03)] space-y-3"
                    >
                      <span className="inline-flex items-center justify-center w-9 h-9 rounded-xl bg-[#0c2340] text-[#dfad36] font-mono font-bold text-sm">
                        {item.step}
                      </span>
                      <h3 className="text-base font-bold text-slate-900">{item.title}</h3>
                      <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">{item.desc}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Ready-to-Use Email Template Card */}
              <div className="bg-white rounded-2xl border border-slate-200/90 p-6 sm:p-8 shadow-[0_1px_3px_rgba(0,0,0,0.03)] space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
                  <div>
                    <h2 className="text-lg font-bold text-[#0c2340] flex items-center gap-2">
                      <Mail className="w-5 h-5 text-[#c59324]" />
                      <span>Ready-to-Use Deletion Request Email</span>
                    </h2>
                    <p className="text-xs text-slate-500 mt-1">
                      Send this request directly to{' '}
                      <a href={mailtoHref} className="font-semibold text-[#0c2340] underline hover:text-[#c59324]">
                        {email}
                      </a>
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={handleCopyTemplate}
                      className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 text-xs font-semibold text-slate-700 transition-colors cursor-pointer"
                    >
                      {copied ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                          <span className="text-emerald-700">Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>Copy Template</span>
                        </>
                      )}
                    </button>

                    <a
                      href={mailtoHref}
                      className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-[#0c2340] hover:bg-[#13335c] text-white text-xs font-semibold transition-colors"
                    >
                      <span>Open Mail App</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>

                <div className="rounded-xl bg-slate-900 text-slate-100 p-4 sm:p-5 text-xs font-mono leading-relaxed whitespace-pre-wrap overflow-x-auto">
                  <div className="text-amber-300 mb-2">
                    To: {email}
                    {'\n'}Subject: {emailSubject}
                  </div>
                  <div className="text-slate-300 border-t border-slate-800 pt-2">
                    {emailBody}
                  </div>
                </div>
              </div>

              {/* Data Deleted vs Data Retained */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-[0_1px_3px_rgba(0,0,0,0.03)] space-y-3">
                  <div className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                    <h3 className="text-base font-bold text-[#0c2340]">Data Permanently Deleted</h3>
                  </div>
                  <ul className="space-y-2 text-xs sm:text-sm text-slate-600 leading-relaxed">
                    <li className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-2 shrink-0" />
                      <span>User account profile (name, email address, role assignment, and login credentials).</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-2 shrink-0" />
                      <span>Active Sanctum API authentication tokens and active web/mobile sessions.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-2 shrink-0" />
                      <span>In-app notifications, personal tour plans, and GPS location telemetry linked to your account.</span>
                    </li>
                  </ul>
                </div>

                <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-[0_1px_3px_rgba(0,0,0,0.03)] space-y-3">
                  <div className="flex items-center gap-2.5">
                    <ShieldAlert className="w-5 h-5 text-amber-600 shrink-0" />
                    <h3 className="text-base font-bold text-[#0c2340]">Data Retained for Compliance</h3>
                  </div>
                  <ul className="space-y-2 text-xs sm:text-sm text-slate-600 leading-relaxed">
                    <li className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-2 shrink-0" />
                      <span>Approved financial/tax expense reimbursement logs and POB commercial invoices where retention is required by Indian tax or corporate accounting laws.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-2 shrink-0" />
                      <span>Any retained statutory records are locked from active login access and purged once the mandatory legal retention window expires.</span>
                    </li>
                  </ul>
                </div>
              </div>

              {/* SLA Notice */}
              <div className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-start gap-3">
                  <Clock className="w-5 h-5 text-[#c59324] shrink-0 mt-0.5" />
                  <div className="text-xs sm:text-sm text-slate-600">
                    <strong className="text-slate-900 block">Need assistance with your request?</strong>
                    All verified account deletion requests sent to <strong className="text-slate-900">{email}</strong> are processed within 7 business days.
                  </div>
                </div>
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl border border-slate-200 hover:border-[#c59324] text-xs font-semibold text-[#0c2340] transition-colors shrink-0 self-start sm:self-auto"
                >
                  <FileCheck2 className="w-3.5 h-3.5 text-[#c59324]" />
                  <span>Contact Support Desk</span>
                </Link>
              </div>
            </div>
          </Container>
        </section>
      </div>
    </PublicLayout>
  );
}
