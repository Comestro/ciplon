import { useState } from 'react';
import { X, Send, CheckCircle2, ShieldCheck } from 'lucide-react';
import toast from 'react-hot-toast';
import Button from '../common/Button';
import { router } from '@inertiajs/react';

export default function EnquiryModal({ isOpen, onClose, initialProduct = null }) {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    organization: '',
    country: '',
    enquiryType: initialProduct ? 'Product Formulation Enquiry' : 'Commercial Partnership',
    productName: initialProduct ? `${initialProduct.brandName} (${initialProduct.genericName})` : '',
    message: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen) return null;

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    router.post('/enquiry', {
      name: formData.fullName,
      email: formData.email,
      organization: formData.organization,
      country: formData.country,
      message: formData.message,
      product_name: formData.productName || formData.enquiryType,
    }, {
      preserveScroll: true,
      onSuccess: () => {
        setIsSuccess(true);
        toast.success('Enquiry submitted successfully!');
        setIsSubmitting(false);
      },
      onError: () => {
        toast.error('Unable to submit enquiry. Please check your input.');
        setIsSubmitting(false);
      }
    });
  };

  const handleResetAndClose = () => {
    setIsSuccess(false);
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
            {initialProduct ? `Inquire: ${initialProduct.brandName}` : 'Pharmaceutical Business Enquiry'}
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
            <form onSubmit={handleSubmit} className="space-y-4 text-sm">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    placeholder="e.g. Dr. Robert Chen"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-teal-600 text-slate-900 text-xs sm:text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Corporate / Official Email *
                  </label>
                  <input
                    type="email"
                    required
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="name@company.com"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-teal-600 text-slate-900 text-xs sm:text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Organization / Institution *
                  </label>
                  <input
                    type="text"
                    required
                    name="organization"
                    value={formData.organization}
                    onChange={handleChange}
                    placeholder="Hospital, Distributor or Agency"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-teal-600 text-slate-900 text-xs sm:text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Country / Market *
                  </label>
                  <input
                    type="text"
                    required
                    name="country"
                    value={formData.country}
                    onChange={handleChange}
                    placeholder="e.g. Germany, UAE, Canada"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-teal-600 text-slate-900 text-xs sm:text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Enquiry Category
                </label>
                <select
                  name="enquiryType"
                  value={formData.enquiryType}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-teal-600 text-slate-900 text-xs sm:text-sm bg-white"
                >
                  <option value="Commercial Partnership">Distribution & Licensing Partnership</option>
                  <option value="Product Formulation Enquiry">Finished Formulation Specifications</option>
                  <option value="Contract Manufacturing">Contract Formulation & Packaging</option>
                  <option value="Hospital & Tender Supply">Institutional / Hospital Tender Supply</option>
                  <option value="General Corporate">General Corporate Communications</option>
                </select>
              </div>

              {formData.productName && (
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Referenced Formulation
                  </label>
                  <input
                    type="text"
                    readOnly
                    value={formData.productName}
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
                  required
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Specify target volume, registration dossier requirement, or destination market..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-teal-600 text-slate-900 text-xs sm:text-sm resize-none"
                />
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
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Sending Request...' : 'Submit Official Enquiry'}
                </Button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
