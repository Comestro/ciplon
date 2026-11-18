import { Link } from '@inertiajs/react';
import {
  ShieldCheck,
  Lock,
  Database,
  MapPin,
  FileText,
  UserCheck,
  Trash2,
  Mail,
  Smartphone,
  Clock,
  Globe,
  AlertCircle,
} from 'lucide-react';
import PublicLayout from '../../layouts/PublicLayout';
import Container from '../../components/common/Container';
import SeoHead from '../../components/common/SeoHead';

export default function PrivacyPolicyPage({ company }) {
  const companyData = company || {};
  const legalName = companyData.legal_name || 'Ciplon Pharma Private Limited';
  const email = companyData.enquiries_email || companyData.company_email || 'info@ciplonpharma.in';
  const website = companyData.website_url || 'https://www.ciplonpharma.in';
  const address = [
    companyData.headquarters_address || 'M24/A, KH No. 294, 1st Floor, Batla House, Okhla, Jamia Nagar, South Delhi',
    companyData.city || 'New Delhi',
    companyData.state || 'Delhi',
    `${companyData.country || 'India'}-${companyData.postal_code || '110025'}`,
  ].join(', ');

  const effectiveDate = 'November 18, 2026';

  const sections = [
    {
      id: 'information-collected',
      icon: Database,
      title: '1. Information We Collect',
      intro:
        'We collect only the information necessary to provide our website services, commercial inquiry responses, and the Ciplon / MR Connect mobile and web applications for authorized field representatives and staff.',
      bullets: [
        {
          label: 'Account & Profile Information:',
          text: 'Full name, email address, assigned role (such as Medical Representative, Area Manager, or Administrator), and authentication credentials managed securely for authorized personnel.',
        },
        {
          label: 'Commercial & Inquiry Data:',
          text: 'Contact details (name, email, phone number, organization, country, and inquiry message) voluntarily submitted through our public website contact or product enquiry forms.',
        },
        {
          label: 'Field Operations & Business Records (MR Connect App):',
          text: 'Doctor visit reports (DCRs), tour schedules, POB orders, leave applications, target progress, and field expense claims including receipt images or PDFs uploaded by the user.',
        },
        {
          label: 'Location Information (Mobile App):',
          text: 'Approximate or precise GPS location coordinates when an authorized Medical Representative checks in, logs a doctor visit, or uses field route tracking while on active duty. Location is never collected when you are logged out or outside authorized field tracking workflows.',
        },
        {
          label: 'Device, Storage & App Diagnostics:',
          text: 'Camera or photo library access strictly when you choose to upload an expense receipt or product image, plus app version codes used solely to verify compatibility and prompt required app updates.',
        },
      ],
    },
    {
      id: 'how-we-use',
      icon: FileText,
      title: '2. How We Use Collected Information',
      intro: 'All collected data is processed strictly for legitimate operational, healthcare-business, and security purposes:',
      bullets: [
        {
          label: 'Service Delivery & Authentication:',
          text: 'To authenticate authorized users, enforce role-based access controls, and operate the MR Connect field operations portal and mobile application.',
        },
        {
          label: 'Field Force & Commercial Management:',
          text: 'To record doctor detailing visits, process expense reimbursements and leave requests, manage product inquiries, and verify field visit routes.',
        },
        {
          label: 'App Updates & Reliability:',
          text: 'To check installed application versions against the latest supported release, maintain service security, prevent unauthorized access, and troubleshoot technical issues.',
        },
        {
          label: 'Legal & Regulatory Compliance:',
          text: 'To satisfy applicable Indian corporate, tax, pharmaceutical distribution, and audit record-keeping obligations.',
        },
      ],
      note: 'We do NOT sell, rent, or trade your personal information to third parties, and we do NOT display third-party behavioral advertising inside our mobile apps or website.',
    },
    {
      id: 'permissions-play-store',
      icon: Smartphone,
      title: '3. Mobile App Permissions (Google Play Disclosure)',
      intro:
        'When using our Android application distributed via Google Play Store, the app may request specific device permissions only when needed for core functionality:',
      bullets: [
        {
          label: 'Location (ACCESS_FINE_LOCATION / ACCESS_COARSE_LOCATION):',
          text: 'Used during field check-ins and doctor visit logging to verify territory coverage and route tracking.',
        },
        {
          label: 'Camera & Photos / Media Access:',
          text: 'Used only when you capture or select a bill/receipt image for a field expense claim or upload authorized product media.',
        },
        {
          label: 'Internet & Network State:',
          text: 'Required to securely sync field records, fetch product dossiers, and check for critical application updates.',
        },
      ],
    },
    {
      id: 'data-sharing',
      icon: UserCheck,
      title: '4. Data Sharing & Third-Party Processors',
      intro:
        'Access to your information is restricted on a strict need-to-know basis:',
      bullets: [
        {
          label: 'Internal Authorized Administrators:',
          text: 'Supervisors, managers, and HR/finance administrators within Ciplon Pharma Private Limited who review DCRs, leave requests, and expense claims.',
        },
        {
          label: 'Cloud Hosting & Object Storage Providers:',
          text: 'Uploaded media, logos, and expense receipts are stored securely using encrypted cloud object storage (Cloudflare R2) and managed server infrastructure acting solely as data processors under confidentiality obligations.',
        },
        {
          label: 'Legal Disclosures:',
          text: 'When required by applicable law, court order, or government/regulatory authority.',
        },
      ],
    },
    {
      id: 'security-retention',
      icon: Lock,
      title: '5. Data Security & Retention',
      intro:
        'We implement industry-standard technical and organizational safeguards to protect your data:',
      bullets: [
        {
          label: 'Encryption in Transit & Secure Auth:',
          text: 'All API and web communications use HTTPS/TLS encryption. Passwords are stored using one-way cryptographic hashing (bcrypt), and mobile sessions use revocable Sanctum Bearer tokens.',
        },
        {
          label: 'Retention Period:',
          text: 'We retain account and operational records for as long as your account remains active or as required for employment administration, tax auditing, and statutory pharmaceutical compliance.',
        },
      ],
    },
    {
      id: 'rights-deletion',
      icon: Trash2,
      title: '6. Your Rights & Account Deletion',
      intro:
        'You have the right to request access to, correction of, or deletion of your personal data and user account.',
      bullets: [
        {
          label: 'Account Deletion Requests:',
          text: 'Users can request permanent deletion of their account and associated personal data at any time by following the instructions on our dedicated Account Deletion page or emailing us directly.',
        },
        {
          label: 'Location & Permission Controls:',
          text: 'You may revoke camera, storage, or location permissions at any time from your Android device settings (note that disabling certain permissions may limit field reporting features).',
        },
      ],
    },
    {
      id: 'children-privacy',
      icon: AlertCircle,
      title: '7. Children’s Privacy',
      intro:
        'Our website, commercial inquiry services, and MR Connect mobile application are intended strictly for adult healthcare professionals, business partners, and authorized company personnel. We do not knowingly collect personal information from children under the age of 13 (or 18 where applicable). If you believe a child has provided personal data to us, please contact us immediately for prompt removal.',
      bullets: [],
    },
  ];

  return (
    <PublicLayout companyData={companyData}>
      <SeoHead
        title="Privacy Policy — Data Protection & Google Play Compliance"
        description={`Official Privacy Policy for ${legalName} website and mobile applications, detailing data collection, permissions, security, and account deletion procedures.`}
        canonicalUrl={`${website.replace(/\/$/, '')}/privacy-policy`}
      />

      <div className="bg-white text-slate-900">
        {/* Hero Header */}
        <section className="relative py-14 sm:py-20 bg-gradient-to-r from-[#0c2340] via-[#07172b] to-[#040e1b] text-white overflow-hidden border-b border-[#c59324]/20">
          <Container size="wide" className="relative z-10">
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#c59324]/20 border border-[#c59324]/40 text-[#dfad36] text-xs font-semibold uppercase tracking-wider mb-4">
                <ShieldCheck className="w-3.5 h-3.5" />
                Privacy & Google Play Data Safety
              </div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight leading-tight">
                Privacy Policy
              </h1>
              <p className="text-sm sm:text-base text-slate-300 mt-4 leading-relaxed">
                This Privacy Policy explains how <strong className="text-white">{legalName}</strong> collects, uses, stores, and protects information across our corporate website and mobile/web applications (including MR Connect).
              </p>
              <div className="flex flex-wrap items-center gap-4 mt-6 text-xs text-slate-300">
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10">
                  <Clock className="w-3.5 h-3.5 text-[#dfad36]" />
                  Effective Date: <strong className="text-white">{effectiveDate}</strong>
                </span>
                <Link
                  href="/delete-account"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#c59324]/20 border border-[#c59324]/40 text-[#dfad36] hover:bg-[#c59324]/30 transition-colors font-semibold"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Account Deletion Guide</span>
                </Link>
              </div>
            </div>
          </Container>
        </section>

        {/* Policy Body */}
        <section className="py-12 sm:py-16 bg-slate-50/50">
          <Container>
            <div className="max-w-4xl mx-auto space-y-6">
              {sections.map((section) => {
                const Icon = section.icon;
                return (
                  <article
                    key={section.id}
                    id={section.id}
                    className="bg-white rounded-2xl border border-slate-200/90 p-6 sm:p-8 shadow-[0_1px_3px_rgba(0,0,0,0.03)] space-y-4"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-[#0c2340]/5 border border-[#0c2340]/10 text-[#0c2340] flex items-center justify-center shrink-0">
                        <Icon className="w-5 h-5 text-[#c59324]" />
                      </div>
                      <h2 className="text-lg sm:text-xl font-bold text-[#0c2340]">
                        {section.title}
                      </h2>
                    </div>

                    <p className="text-sm text-slate-600 leading-relaxed">
                      {section.intro}
                    </p>

                    {section.bullets.length > 0 && (
                      <ul className="space-y-2.5 pt-1">
                        {section.bullets.map((item, idx) => (
                          <li key={idx} className="flex items-start gap-2.5 text-sm text-slate-700 leading-relaxed">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#c59324] mt-2 shrink-0" />
                            <span>
                              <strong className="text-slate-900">{item.label}</strong> {item.text}
                            </span>
                          </li>
                        ))}
                      </ul>
                    )}

                    {section.note && (
                      <div className="p-4 rounded-xl bg-amber-50/70 border border-amber-200/80 text-xs sm:text-sm text-amber-950 font-medium leading-relaxed">
                        {section.note}
                      </div>
                    )}

                    {section.id === 'rights-deletion' && (
                      <div className="pt-2">
                        <Link
                          href="/delete-account"
                          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#0c2340] hover:bg-[#13335c] text-white text-xs font-semibold transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5 text-[#dfad36]" />
                          <span>View Step-by-Step Account Deletion Instructions</span>
                        </Link>
                      </div>
                    )}
                  </article>
                );
              })}

              {/* Section 8: Changes & Contact Details */}
              <article className="bg-white rounded-2xl border border-slate-200/90 p-6 sm:p-8 shadow-[0_1px_3px_rgba(0,0,0,0.03)] space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#0c2340]/5 border border-[#0c2340]/10 flex items-center justify-center shrink-0">
                    <Mail className="w-5 h-5 text-[#c59324]" />
                  </div>
                  <h2 className="text-lg sm:text-xl font-bold text-[#0c2340]">
                    8. Policy Updates & Contact Information
                  </h2>
                </div>

                <p className="text-sm text-slate-600 leading-relaxed">
                  We may update this Privacy Policy periodically to reflect operational, legal, or Google Play policy updates. Any changes will be posted on this page with an updated effective date. If you have questions about this Privacy Policy or how your data is handled, please contact our Privacy & Compliance Desk:
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1.5">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
                      Privacy & Data Requests Email
                    </span>
                    <a
                      href={`mailto:${email}?subject=${encodeURIComponent('Privacy Policy Inquiry')}`}
                      className="inline-flex items-center gap-2 text-sm font-semibold text-[#0c2340] hover:text-[#c59324] transition-colors"
                    >
                      <Mail className="w-4 h-4 text-[#c59324]" />
                      <span>{email}</span>
                    </a>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1.5">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
                      Official Website
                    </span>
                    <a
                      href={website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-sm font-semibold text-[#0c2340] hover:text-[#c59324] transition-colors"
                    >
                      <Globe className="w-4 h-4 text-[#c59324]" />
                      <span>{website.replace(/^https?:\/\//, '')}</span>
                    </a>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 flex items-start gap-3 text-xs sm:text-sm text-slate-700">
                  <MapPin className="w-4 h-4 text-[#c59324] shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-slate-900 block">{legalName}</strong>
                    <span>{address}</span>
                  </div>
                </div>
              </article>
            </div>
          </Container>
        </section>
      </div>
    </PublicLayout>
  );
}
