// Business Profile and Settings management for pharma admin panel
import { useState } from 'react';
import { router } from '@inertiajs/react';
import { 
  Building2, 
  ShieldCheck, 
  PhoneCall, 
  MapPin, 
  Globe, 
  Save, 
  Upload, 
  X, 
  CheckCircle2, 
  Loader2, 
  FileText,
  ImageIcon,
  Navigation,
  Layers,
  Crosshair,
  Key
} from 'lucide-react';
import toast from 'react-hot-toast';
import AdminLayout from '../../../layouts/AdminLayout';

export default function Settings({ grouped = {}, settings: initialSettings = {} }) {
  const [activeTab, setActiveTab] = useState('all');
  const [isSaving, setIsSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  // Form settings state
  const [settings, setSettings] = useState({
    company_name: initialSettings.company_name || '',
    legal_name: initialSettings.legal_name || '',
    tagline: initialSettings.tagline || '',
    description: initialSettings.description || '',
    founded_year: initialSettings.founded_year || '',
    logo_url: initialSettings.logo_url || '',
    drug_license_no: initialSettings.drug_license_no || '',
    gst_tax_id: initialSettings.gst_tax_id || '',
    who_gmp_certified: Boolean(initialSettings.who_gmp_certified),
    iso_certification: initialSettings.iso_certification || '',
    company_email: initialSettings.company_email || '',
    enquiries_email: initialSettings.enquiries_email || '',
    company_phone: initialSettings.company_phone || '',
    whatsapp_number: initialSettings.whatsapp_number || '',
    business_hours: initialSettings.business_hours || '',
    headquarters_address: initialSettings.headquarters_address || '',
    city: initialSettings.city || '',
    state: initialSettings.state || '',
    postal_code: initialSettings.postal_code || '',
    country: initialSettings.country || '',
    manufacturing_unit_address: initialSettings.manufacturing_unit_address || '',
    website_url: initialSettings.website_url || '',
    linkedin_url: initialSettings.linkedin_url || '',
    twitter_url: initialSettings.twitter_url || '',
    mapbox_token: initialSettings.mapbox_token || '',
    mapbox_style: initialSettings.mapbox_style || 'mapbox://styles/mapbox/streets-v12',
    mapbox_default_lat: initialSettings.mapbox_default_lat || '8.1833',
    mapbox_default_lng: initialSettings.mapbox_default_lng || '77.4119',
    mapbox_default_zoom: initialSettings.mapbox_default_zoom || '13',
    mapbox_tracking_interval: initialSettings.mapbox_tracking_interval || '30',
    ...initialSettings,
    who_gmp_certified: Boolean(initialSettings.who_gmp_certified),
  });

  // Selected logo file for upload
  const [logoFile, setLogoFile] = useState(null);
  const [logoPreview, setLogoPreview] = useState(null);

  // Handle input field modifications
  const handleChange = (key, value) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
    setHasChanges(true);
  };

  // Handle logo file selection
  const handleLogoChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error('Logo file size must be under 5MB.');
      return;
    }

    setLogoFile(file);
    setLogoPreview(URL.createObjectURL(file));
    setHasChanges(true);
  };

  // Remove selected logo file
  const removeLogoFile = () => {
    if (logoPreview) {
      URL.revokeObjectURL(logoPreview);
    }
    setLogoFile(null);
    setLogoPreview(null);
  };

  // Handle saving all settings to backend
  const handleSubmit = (e) => {
    e?.preventDefault();
    setIsSaving(true);

    const formData = new FormData();
    formData.append('settings', JSON.stringify(settings));

    if (logoFile) {
      formData.append('logo', logoFile);
    }

    router.post('/admin/settings', formData, {
      onSuccess: () => {
        removeLogoFile();
        setHasChanges(false);
        setIsSaving(false);
      },
      onError: () => {
        setIsSaving(false);
      },
      onFinish: () => {
        setIsSaving(false);
      },
    });
  };

  const navTabs = [
    { id: 'all', label: 'All Settings', icon: FileText },
    { id: 'general', label: 'General & Identity', icon: Building2 },
    { id: 'regulatory', label: 'Regulatory & Compliance', icon: ShieldCheck },
    { id: 'contact', label: 'Contact & Hours', icon: PhoneCall },
    { id: 'location', label: 'Locations & Plants', icon: MapPin },
    { id: 'social', label: 'Web & Social', icon: Globe },
    { id: 'mapbox', label: 'Mapbox SDK & Field Map', icon: Navigation },
  ];

  return (
    <AdminLayout>
    <div className="max-w-6xl mx-auto space-y-6 pb-16">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900 tracking-tight">Business Profile & Settings</h2>
          <p className="text-xs text-slate-500">Configure your pharmaceutical enterprise information, compliance details, and contact points.</p>
        </div>

        <button
          type="button"
          onClick={handleSubmit}
          disabled={isSaving || !hasChanges}
          className={`inline-flex items-center gap-2 px-5 py-2 rounded-lg text-xs font-semibold text-white transition-all shadow-xs cursor-pointer ${
            hasChanges
              ? 'bg-teal-600 hover:bg-teal-700'
              : 'bg-slate-400 opacity-60 cursor-not-allowed'
          }`}
        >
          {isSaving ? (
            <>
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
              <span>Saving Changes...</span>
            </>
          ) : (
            <>
              <Save className="w-3.5 h-3.5" />
              <span>{hasChanges ? 'Save Changes' : 'All Changes Saved'}</span>
            </>
          )}
        </button>
      </div>

      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
        {navTabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-lg font-medium transition-colors shrink-0 cursor-pointer ${
                isActive
                  ? 'bg-teal-50 text-teal-700 border border-teal-200 font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-transparent'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {(activeTab === 'all' || activeTab === 'general') && (
          <div className="bg-white rounded-xl border border-slate-200 p-6 sm:p-7 space-y-6">
            <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
              <div className="w-8 h-8 rounded-lg bg-teal-50 text-teal-700 flex items-center justify-center font-bold text-xs">
                <Building2 className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900">General & Corporate Identity</h3>
                <p className="text-xs text-slate-500">Legal entity name, public trade name, and corporate branding.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Brand / Trade Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={settings.company_name}
                  onChange={(e) => handleChange('company_name', e.target.value)}
                  placeholder="e.g. Ciplon Life Sciences"
                  className="w-full px-3.5 py-2 bg-slate-50/50 border border-slate-200 rounded-lg text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Full Registered Legal Entity Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={settings.legal_name}
                  onChange={(e) => handleChange('legal_name', e.target.value)}
                  placeholder="e.g. Ciplon Pharmaceuticals Ltd."
                  className="w-full px-3.5 py-2 bg-slate-50/50 border border-slate-200 rounded-lg text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Corporate Tagline / Mission Statement
                </label>
                <input
                  type="text"
                  value={settings.tagline}
                  onChange={(e) => handleChange('tagline', e.target.value)}
                  placeholder="e.g. Advancing Global Healthcare Through Scientific Precision & Quality"
                  className="w-full px-3.5 py-2 bg-slate-50/50 border border-slate-200 rounded-lg text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Detailed Company Overview
                </label>
                <textarea
                  rows={3}
                  value={settings.description}
                  onChange={(e) => handleChange('description', e.target.value)}
                  placeholder="Provide a comprehensive profile of your pharmaceutical manufacturing and R&D activities..."
                  className="w-full px-3.5 py-2 bg-slate-50/50 border border-slate-200 rounded-lg text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all resize-y"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Year Established
                </label>
                <input
                  type="text"
                  value={settings.founded_year}
                  onChange={(e) => handleChange('founded_year', e.target.value)}
                  placeholder="e.g. 2004"
                  className="w-full px-3.5 py-2 bg-slate-50/50 border border-slate-200 rounded-lg text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Official Corporate Logo
                </label>
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-lg border border-slate-200 bg-slate-50 flex items-center justify-center overflow-hidden shrink-0">
                    {logoPreview || settings.logo_url ? (
                      <img 
                        src={logoPreview || settings.logo_url} 
                        alt="Logo" 
                        className="w-full h-full object-contain p-1"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                        }}
                      />
                    ) : (
                      <ImageIcon className="w-6 h-6 text-slate-300" />
                    )}
                  </div>

                  <div className="flex-1 space-y-1">
                    <input
                      type="file"
                      id="business-logo-input"
                      accept="image/png,image/jpeg,image/svg+xml,image/webp"
                      onChange={handleLogoChange}
                      className="hidden"
                    />
                    <label
                      htmlFor="business-logo-input"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-xs font-semibold text-slate-700 cursor-pointer transition-colors"
                    >
                      <Upload className="w-3.5 h-3.5" />
                      <span>{settings.logo_url || logoPreview ? 'Change Logo' : 'Upload Logo'}</span>
                    </label>
                    <p className="text-[11px] text-slate-400">PNG, SVG or WEBP with transparent background recommended.</p>
                  </div>

                  {logoPreview && (
                    <button
                      type="button"
                      onClick={removeLogoFile}
                      className="p-1.5 rounded-lg text-rose-600 hover:bg-rose-50 border border-rose-200 cursor-pointer"
                      title="Clear selection"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {(activeTab === 'all' || activeTab === 'regulatory') && (
          <div className="bg-white rounded-xl border border-slate-200 p-6 sm:p-7 space-y-6">
            <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
              <div className="w-8 h-8 rounded-lg bg-teal-50 text-teal-700 flex items-center justify-center font-bold text-xs">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900">Regulatory, Licensing & Quality Compliance</h3>
                <p className="text-xs text-slate-500">Official pharmaceutical licenses, statutory numbers, and quality accreditations.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Drug Manufacturing / Wholesale License Number
                </label>
                <input
                  type="text"
                  value={settings.drug_license_no}
                  onChange={(e) => handleChange('drug_license_no', e.target.value)}
                  placeholder="e.g. DL-2024-MH-BIO891"
                  className="w-full px-3.5 py-2 bg-slate-50/50 border border-slate-200 rounded-lg text-xs font-mono text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  GST / Corporate Tax Identification Number
                </label>
                <input
                  type="text"
                  value={settings.gst_tax_id}
                  onChange={(e) => handleChange('gst_tax_id', e.target.value)}
                  placeholder="e.g. 27AABCA1234D1Z5"
                  className="w-full px-3.5 py-2 bg-slate-50/50 border border-slate-200 rounded-lg text-xs font-mono text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Quality Management & ISO Certifications
                </label>
                <input
                  type="text"
                  value={settings.iso_certification}
                  onChange={(e) => handleChange('iso_certification', e.target.value)}
                  placeholder="e.g. ISO 9001:2015 & ISO 14001:2015 Certified"
                  className="w-full px-3.5 py-2 bg-slate-50/50 border border-slate-200 rounded-lg text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all"
                />
              </div>

              <div className="flex items-center gap-3 pt-6">
                <input
                  type="checkbox"
                  id="who-gmp-checkbox"
                  checked={settings.who_gmp_certified}
                  onChange={(e) => handleChange('who_gmp_certified', e.target.checked)}
                  className="w-4 h-4 rounded text-teal-600 focus:ring-teal-500 border-slate-300 cursor-pointer"
                />
                <label htmlFor="who-gmp-checkbox" className="text-xs font-medium text-slate-800 cursor-pointer select-none">
                  WHO-GMP Certified Facility Status
                  <span className="block text-[11px] text-slate-400 font-normal">Check if formulation manufacturing adheres to World Health Organization GMP guidelines.</span>
                </label>
              </div>
            </div>
          </div>
        )}

        {(activeTab === 'all' || activeTab === 'contact') && (
          <div className="bg-white rounded-xl border border-slate-200 p-6 sm:p-7 space-y-6">
            <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
              <div className="w-8 h-8 rounded-lg bg-teal-50 text-teal-700 flex items-center justify-center font-bold text-xs">
                <PhoneCall className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900">Communication & Operating Hours</h3>
                <p className="text-xs text-slate-500">Public emails, customer helpline, and administrative availability.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Primary Corporate Email
                </label>
                <input
                  type="email"
                  value={settings.company_email}
                  onChange={(e) => handleChange('company_email', e.target.value)}
                  placeholder="corporate@ciplon.com"
                  className="w-full px-3.5 py-2 bg-slate-50/50 border border-slate-200 rounded-lg text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Commercial / Product Enquiries Email
                </label>
                <input
                  type="email"
                  value={settings.enquiries_email}
                  onChange={(e) => handleChange('enquiries_email', e.target.value)}
                  placeholder="enquiry@ciplon.com"
                  className="w-full px-3.5 py-2 bg-slate-50/50 border border-slate-200 rounded-lg text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Official Phone / Toll-free Number
                </label>
                <input
                  type="text"
                  value={settings.company_phone}
                  onChange={(e) => handleChange('company_phone', e.target.value)}
                  placeholder="+1 (800) 458-7290"
                  className="w-full px-3.5 py-2 bg-slate-50/50 border border-slate-200 rounded-lg text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  WhatsApp Business Communication
                </label>
                <input
                  type="text"
                  value={settings.whatsapp_number}
                  onChange={(e) => handleChange('whatsapp_number', e.target.value)}
                  placeholder="+1 (800) 458-7291"
                  className="w-full px-3.5 py-2 bg-slate-50/50 border border-slate-200 rounded-lg text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Business & Dispatch Operating Hours
                </label>
                <input
                  type="text"
                  value={settings.business_hours}
                  onChange={(e) => handleChange('business_hours', e.target.value)}
                  placeholder="e.g. Monday - Friday: 09:00 - 18:00 (EST)"
                  className="w-full px-3.5 py-2 bg-slate-50/50 border border-slate-200 rounded-lg text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all"
                />
              </div>
            </div>
          </div>
        )}

        {(activeTab === 'all' || activeTab === 'location') && (
          <div className="bg-white rounded-xl border border-slate-200 p-6 sm:p-7 space-y-6">
            <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
              <div className="w-8 h-8 rounded-lg bg-teal-50 text-teal-700 flex items-center justify-center font-bold text-xs">
                <MapPin className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900">Headquarters & Manufacturing Facilities</h3>
                <p className="text-xs text-slate-500">Registered commercial office and pharmaceutical formulation manufacturing sites.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="md:col-span-2">
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Corporate Headquarters Street Address
                </label>
                <input
                  type="text"
                  value={settings.headquarters_address}
                  onChange={(e) => handleChange('headquarters_address', e.target.value)}
                  placeholder="e.g. Innovation Park, Sector 62, Bio-Tech Corridor"
                  className="w-full px-3.5 py-2 bg-slate-50/50 border border-slate-200 rounded-lg text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">City</label>
                <input
                  type="text"
                  value={settings.city}
                  onChange={(e) => handleChange('city', e.target.value)}
                  placeholder="e.g. Boston"
                  className="w-full px-3.5 py-2 bg-slate-50/50 border border-slate-200 rounded-lg text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">State / Province</label>
                <input
                  type="text"
                  value={settings.state}
                  onChange={(e) => handleChange('state', e.target.value)}
                  placeholder="e.g. Massachusetts"
                  className="w-full px-3.5 py-2 bg-slate-50/50 border border-slate-200 rounded-lg text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">Postal / ZIP Code</label>
                <input
                  type="text"
                  value={settings.postal_code}
                  onChange={(e) => handleChange('postal_code', e.target.value)}
                  placeholder="e.g. 02115"
                  className="w-full px-3.5 py-2 bg-slate-50/50 border border-slate-200 rounded-lg text-xs font-mono text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">Country</label>
                <input
                  type="text"
                  value={settings.country}
                  onChange={(e) => handleChange('country', e.target.value)}
                  placeholder="e.g. United States"
                  className="w-full px-3.5 py-2 bg-slate-50/50 border border-slate-200 rounded-lg text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Formulation Plant & Manufacturing Site Address
                </label>
                <input
                  type="text"
                  value={settings.manufacturing_unit_address}
                  onChange={(e) => handleChange('manufacturing_unit_address', e.target.value)}
                  placeholder="e.g. Ciplon Formulation Plant 1, Pharma SEZ, Industrial Zone"
                  className="w-full px-3.5 py-2 bg-slate-50/50 border border-slate-200 rounded-lg text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all"
                />
              </div>
            </div>
          </div>
        )}

        {(activeTab === 'all' || activeTab === 'social') && (
          <div className="bg-white rounded-xl border border-slate-200 p-6 sm:p-7 space-y-6">
            <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
              <div className="w-8 h-8 rounded-lg bg-teal-50 text-teal-700 flex items-center justify-center font-bold text-xs">
                <Globe className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900">Web Presence & Social Channels</h3>
                <p className="text-xs text-slate-500">Corporate portal and professional institutional network links.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="md:col-span-2">
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Official Website URL
                </label>
                <input
                  type="url"
                  value={settings.website_url}
                  onChange={(e) => handleChange('website_url', e.target.value)}
                  placeholder="https://ciplon.com"
                  className="w-full px-3.5 py-2 bg-slate-50/50 border border-slate-200 rounded-lg text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  LinkedIn Organization Profile
                </label>
                <input
                  type="url"
                  value={settings.linkedin_url}
                  onChange={(e) => handleChange('linkedin_url', e.target.value)}
                  placeholder="https://linkedin.com/company/ciplon"
                  className="w-full px-3.5 py-2 bg-slate-50/50 border border-slate-200 rounded-lg text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Twitter / X Profile
                </label>
                <input
                  type="url"
                  value={settings.twitter_url}
                  onChange={(e) => handleChange('twitter_url', e.target.value)}
                  placeholder="https://x.com/ciplon_pharma"
                  className="w-full px-3.5 py-2 bg-slate-50/50 border border-slate-200 rounded-lg text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all"
                />
              </div>
            </div>
          </div>
        )}

        {/* Mapbox SDK & Field Tracking Configuration */}
        {(activeTab === 'all' || activeTab === 'mapbox') && (
          <div className="bg-white rounded-xl border border-slate-200 p-6 sm:p-7 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-700 flex items-center justify-center font-bold text-xs">
                  <Navigation className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Mapbox SDK & Field Map Configuration</h3>
                  <p className="text-xs text-slate-500">Configure Mapbox GL vector mapping engine for MR live tracking & route animation.</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {settings.mapbox_token ? (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium bg-emerald-50 text-emerald-700 border border-emerald-200/60">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Mapbox Token Configured
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium bg-amber-50 text-amber-700 border border-amber-200/60">
                    Standard Mapbox Vector Tiles Active
                  </span>
                )}
              </div>
            </div>

            <div className="bg-slate-50/60 border border-slate-200/70 rounded-lg p-3.5 text-xs text-slate-600 space-y-1">
              <p className="font-semibold text-slate-800">💡 Mapbox Integration Instructions</p>
              <p>The Doctor Movement Map and MR live GPS locator uses Mapbox GL SDK. Enter your Mapbox Public Token (starts with <code className="text-indigo-600 bg-white px-1 py-0.5 rounded border border-slate-200">pk.eyJ1...</code>) below. If left empty, high-definition street tiles and route vectors remain fully functional.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="md:col-span-2">
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Mapbox Public Access Token (SDK Key)
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <Key className="w-3.5 h-3.5" />
                  </div>
                  <input
                    type="text"
                    value={settings.mapbox_token}
                    onChange={(e) => handleChange('mapbox_token', e.target.value)}
                    placeholder="pk.eyJ1IjoieW91ci11c2VybmFtZSIsImEiOiJjb..."
                    className="w-full pl-9 pr-3.5 py-2 bg-slate-50/50 border border-slate-200 rounded-lg text-xs font-mono text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                  />
                </div>
                <p className="mt-1 text-[11px] text-slate-400">
                  You can get your free token from <a href="https://account.mapbox.com/access-tokens/" target="_blank" rel="noreferrer" className="text-indigo-600 hover:underline">mapbox.com/account/access-tokens</a>.
                </p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Default Map Style
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <Layers className="w-3.5 h-3.5" />
                  </div>
                  <select
                    value={settings.mapbox_style}
                    onChange={(e) => handleChange('mapbox_style', e.target.value)}
                    className="w-full pl-9 pr-3.5 py-2 bg-slate-50/50 border border-slate-200 rounded-lg text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all cursor-pointer"
                  >
                    <option value="mapbox://styles/mapbox/streets-v12">Mapbox Streets (Recommended)</option>
                    <option value="mapbox://styles/mapbox/navigation-day-v1">Mapbox Navigation Day</option>
                    <option value="mapbox://styles/mapbox/light-v11">Mapbox Light Clean</option>
                    <option value="mapbox://styles/mapbox/outdoors-v12">Mapbox Outdoors Topo</option>
                    <option value="mapbox://styles/mapbox/dark-v11">Mapbox Dark Mode</option>
                    <option value="mapbox://styles/mapbox/satellite-streets-v12">Mapbox Satellite Hybrid</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  MR Live GPS Broadcast Interval (seconds)
                </label>
                <input
                  type="number"
                  min="5"
                  max="300"
                  value={settings.mapbox_tracking_interval}
                  onChange={(e) => handleChange('mapbox_tracking_interval', e.target.value)}
                  placeholder="30"
                  className="w-full px-3.5 py-2 bg-slate-50/50 border border-slate-200 rounded-lg text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-semibold text-slate-700">
                    Default Center Latitude
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      handleChange('mapbox_default_lat', '8.1833');
                      handleChange('mapbox_default_lng', '77.4119');
                    }}
                    className="text-[11px] text-indigo-600 hover:text-indigo-800 font-medium cursor-pointer"
                  >
                    Preset: Nagercoil (TN)
                  </button>
                </div>
                <input
                  type="text"
                  value={settings.mapbox_default_lat}
                  onChange={(e) => handleChange('mapbox_default_lat', e.target.value)}
                  placeholder="8.1833"
                  className="w-full px-3.5 py-2 bg-slate-50/50 border border-slate-200 rounded-lg text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Default Center Longitude
                </label>
                <input
                  type="text"
                  value={settings.mapbox_default_lng}
                  onChange={(e) => handleChange('mapbox_default_lng', e.target.value)}
                  placeholder="77.4119"
                  className="w-full px-3.5 py-2 bg-slate-50/50 border border-slate-200 rounded-lg text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Default Map Zoom Level (1 - 18)
                </label>
                <input
                  type="number"
                  min="1"
                  max="18"
                  value={settings.mapbox_default_zoom}
                  onChange={(e) => handleChange('mapbox_default_zoom', e.target.value)}
                  placeholder="13"
                  className="w-full px-3.5 py-2 bg-slate-50/50 border border-slate-200 rounded-lg text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                />
              </div>

              <div className="flex items-end">
                <a
                  href="/admin/tracking"
                  className="w-full inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 transition-colors"
                >
                  <Crosshair className="w-3.5 h-3.5" />
                  Open Live Field Tracking Map
                </a>
              </div>
            </div>
          </div>
        )}

        <div className="flex items-center justify-between p-4 bg-white rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center gap-2">
            {hasChanges ? (
              <span className="text-xs font-medium text-amber-600 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                Unsaved changes
              </span>
            ) : (
              <span className="text-xs font-medium text-teal-700 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Up to date
              </span>
            )}
          </div>

          <button
            type="submit"
            disabled={isSaving || !hasChanges}
            className={`inline-flex items-center gap-2 px-6 py-2.5 rounded-lg text-xs font-semibold text-white transition-all shadow-xs cursor-pointer ${
              hasChanges
                ? 'bg-teal-600 hover:bg-teal-700'
                : 'bg-slate-400 opacity-60 cursor-not-allowed'
            }`}
          >
            {isSaving ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Saving...</span>
              </>
            ) : (
              <>
                <Save className="w-3.5 h-3.5" />
                <span>Save All Settings</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
    </AdminLayout>
  );
}
