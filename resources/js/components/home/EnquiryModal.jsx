import { useState, useEffect } from 'react';
import { X, Send, CheckCircle2, ShieldCheck, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import Button from '../common/Button';
import { useForm } from '@inertiajs/react';

export default function EnquiryModal({ isOpen, onClose, initialProduct = null }) {
  // Normalize product properties safely for both camelCase and snake_case
  const brandName = initialProduct?.brand_name || initialProduct?.brandName || '';
  const genericName = initialProduct?.generic_name || initialProduct?.genericName || '';
  const initialProductName = brandName && genericName 
    ? `${brandName} (${genericName})` 
    : (brandName || genericName || '');

  // Directly bind form fields with Laravel controller validation rules via useForm
  const { data, setData, post, processing, errors, reset, clearErrors } = useForm({
    name: '',
    email: '',
    organization: '',
    country: '',
    inquiry_type: initialProduct ? 'Product Formulation Enquiry' : 'Commercial Partnership',
    product_name: initialProductName,
    message: ''
  });

  const [isSuccess, setIsSuccess] = useState(false);

  // Sync state if initialProduct changes or modal opens
  useEffect(() => {
    if (initialProduct) {
      const b = initialProduct?.brand_name || initialProduct?.brandName || '';
      const g = initialProduct?.generic_name || initialProduct?.genericName || '';
      const pName = b && g ? `${b} (${g})` : (b || g || '');
      setData(prev => ({
        ...prev,
        inquiry_type: 'Product Formulation Enquiry',
        product_name: pName
      }));
    }
  }, [initialProduct]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    post('/enquiry', {
      preserveScroll: true,
      onSuccess: () => {
        setIsSuccess(true);
        reset();
        clearErrors();
        toast.success('Enquiry submitted successfully!');
      },
    });
  };

  const handleResetAndClose = () => {
    setIsSuccess(false);
    reset();
    clearErrors();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="bg-white rounded-3xl max-w-xl w-full max-h-[92vh] overflow-y-auto shadow-2xl border border-slate-200 relative"
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className="p-6 sm:p-7 bg-gradient-to-r from-[#0c2340] via-[#07172b] to-[#0c2340] text-white rounded-t-3xl relative border-b border-[#c59324]/20">
          <button
            onClick={handleResetAndClose}
            className="absolute top-6 right-6 p-2 rounded-full text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>

          <span className="text-[11px] font-mono tracking-wider uppercase text-[#dfad36] font-semibold">
            Institutional & Distributor Desk
          </span>
          <h3 className="text-xl sm:text-2xl font-bold text-white mt-1">
            {brandName ? `Inquire: ${brandName}` : 'Pharmaceutical Business Enquiry'}
          </h3>
          <p className="text-xs text-slate-300 mt-1">
            Connect with our regulatory affairs and commercial distribution team.
          </p>
        </div>

        {/* Content */}
        <div className="p-6 sm:p-7">
          {isSuccess ? (
            <div className="py-8 text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h4 className="text-xl font-bold text-slate-900">Enquiry Received</h4>
              <p className="text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
                Thank you for reaching out. A representative from our commercial and regulatory licensing desk will review your details and contact you within 24–48 hours.
              </p>
              <div className="pt-4">
                <Button variant="primary" onClick={handleResetAndClose}>
                  Done
                </Button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 text-sm" noValidate>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={data.name}
                    onChange={e => {
                      setData('name', e.target.value);
                      if (errors.name) clearErrors('name');
                    }}
                    placeholder="e.g. Dr. Robert Chen"
                    className={`w-full px-3.5 py-2.5 rounded-xl text-xs sm:text-sm border transition-colors outline-none ${
                      errors.name
                        ? 'border-rose-400 bg-rose-50/40 text-rose-900 focus:ring-2 focus:ring-rose-500'
                        : 'border-slate-300 focus:ring-2 focus:ring-teal-600 text-slate-900'
                    }`}
                  />
                  {errors.name && (
                    <p className="text-[11px] text-rose-600 flex items-center gap-1 font-medium mt-1">
                      <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                      {errors.name}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Corporate / Official Email *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={data.email}
                    onChange={e => {
                      setData('email', e.target.value);
                      if (errors.email) clearErrors('email');
                    }}
                    placeholder="name@company.com"
                    className={`w-full px-3.5 py-2.5 rounded-xl text-xs sm:text-sm border transition-colors outline-none ${
                      errors.email
                        ? 'border-rose-400 bg-rose-50/40 text-rose-900 focus:ring-2 focus:ring-rose-500'
                        : 'border-slate-300 focus:ring-2 focus:ring-teal-600 text-slate-900'
                    }`}
                  />
                  {errors.email && (
                    <p className="text-[11px] text-rose-600 flex items-center gap-1 font-medium mt-1">
                      <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                      {errors.email}
                    </p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Organization / Institution
                  </label>
                  <input
                    type="text"
                    name="organization"
                    value={data.organization}
                    onChange={e => {
                      setData('organization', e.target.value);
                      if (errors.organization || errors.company) clearErrors('organization', 'company');
                    }}
                    placeholder="Hospital, Distributor or Agency"
                    className={`w-full px-3.5 py-2.5 rounded-xl text-xs sm:text-sm border transition-colors outline-none ${
                      errors.organization || errors.company
                        ? 'border-rose-400 bg-rose-50/40 text-rose-900 focus:ring-2 focus:ring-rose-500'
                        : 'border-slate-300 focus:ring-2 focus:ring-teal-600 text-slate-900'
                    }`}
                  />
                  {(errors.organization || errors.company) && (
                    <p className="text-[11px] text-rose-600 flex items-center gap-1 font-medium mt-1">
                      <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                      {errors.organization || errors.company}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Country / Market
                  </label>
                  <input
                    type="text"
                    name="country"
                    value={data.country}
                    onChange={e => {
                      setData('country', e.target.value);
                      if (errors.country) clearErrors('country');
                    }}
                    placeholder="e.g. Germany, UAE, Canada"
                    className={`w-full px-3.5 py-2.5 rounded-xl text-xs sm:text-sm border transition-colors outline-none ${
                      errors.country
                        ? 'border-rose-400 bg-rose-50/40 text-rose-900 focus:ring-2 focus:ring-rose-500'
                        : 'border-slate-300 focus:ring-2 focus:ring-teal-600 text-slate-900'
                    }`}
                  />
                  {errors.country && (
                    <p className="text-[11px] text-rose-600 flex items-center gap-1 font-medium mt-1">
                      <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                      {errors.country}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Enquiry Category
                </label>
                <select
                  name="inquiry_type"
                  value={data.inquiry_type}
                  onChange={e => setData('inquiry_type', e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-teal-600 text-slate-900 text-xs sm:text-sm bg-white"
                >
                  <option value="Commercial Partnership">Distribution & Licensing Partnership</option>
                  <option value="Product Formulation Enquiry">Finished Formulation Specifications</option>
                  <option value="Contract Manufacturing">Contract Formulation & Packaging</option>
                  <option value="Hospital & Tender Supply">Institutional / Hospital Tender Supply</option>
                  <option value="General Corporate">General Corporate Communications</option>
                </select>
              </div>

              {data.product_name && (
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Referenced Formulation
                  </label>
                  <input
                    type="text"
                    readOnly
                    value={data.product_name}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-700 text-xs font-mono"
                  />
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Requirements & Details *
                </label>
                <textarea
                  rows="3"
                  name="message"
                  value={data.message}
                  onChange={e => {
                    setData('message', e.target.value);
                    if (errors.message) clearErrors('message');
                  }}
                  placeholder="Specify target volume, registration dossier requirement, or destination market..."
                  className={`w-full px-3.5 py-2.5 rounded-xl text-xs sm:text-sm border transition-colors outline-none resize-none ${
                    errors.message
                      ? 'border-rose-400 bg-rose-50/40 text-rose-900 focus:ring-2 focus:ring-rose-500'
                      : 'border-slate-300 focus:ring-2 focus:ring-teal-600 text-slate-900'
                  }`}
                />
                {errors.message && (
                  <p className="text-[11px] text-rose-600 flex items-center gap-1 font-medium mt-1">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    {errors.message}
                  </p>
                )}
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-[11px] text-slate-500 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#c59324] shrink-0" />
                <span>All proprietary business information is handled under commercial non-disclosure protocols.</span>
              </div>

              <div className="pt-2 flex items-center justify-end gap-3">
                <Button variant="ghost" size="sm" onClick={handleResetAndClose}>
                  Cancel
                </Button>
                <Button
                  variant="primary"
                  size="md"
                  type="submit"
                  icon={Send}
                  disabled={processing}
                >
                  {processing ? 'Sending Request...' : 'Submit Official Enquiry'}
                </Button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
