// Unified ProductForm component for creating and editing pharmaceutical formulations
import { useState } from 'react';
import { Link, router } from '@inertiajs/react';
import toast from 'react-hot-toast';
import { 
  Upload, 
  X, 
  Plus, 
  Trash2, 
  Sparkles, 
  AlertCircle,
  ImageIcon
} from 'lucide-react';
import AdminLayout from '../../../layouts/AdminLayout';
import { resolveImageUrl } from '../../../utils/media';

const FieldError = ({ message }) => {
  if (!message) return null;

  return (
    <p className="text-[11px] text-rose-600 flex items-center gap-1 mt-1">
      <AlertCircle className="w-3 h-3 shrink-0" />
      <span>{message}</span>
    </p>
  );
};

// Standard preset dosage forms
const STANDARD_DOSAGE_FORMS = [
  { value: 'Tablet', label: 'Tablet' },
  { value: 'Capsule', label: 'Capsule' },
  { value: 'Syrup', label: 'Syrup' },
  { value: 'Suspension', label: 'Suspension' },
  { value: 'Injection', label: 'Injection' },
  { value: 'Infusion', label: 'Infusion' },
  { value: 'Cream', label: 'Cream' },
  { value: 'Ointment', label: 'Ointment' },
  { value: 'Gel', label: 'Gel' },
  { value: 'Drops', label: 'Eye/Ear Drops' },
  { value: 'Inhaler', label: 'Inhaler / Respule' },
  { value: 'Powder', label: 'Powder / Sachet' },
];

// Standard preset prescription types
const STANDARD_PRESCRIPTION_TYPES = [
  { value: 'Schedule H', label: 'Schedule H Prescription' },
  { value: 'Schedule H1', label: 'Schedule H1 Strict Prescription' },
  { value: 'Schedule X', label: 'Schedule X Controlled' },
  { value: 'OTC', label: 'Over The Counter (OTC)' },
  { value: 'General Sales', label: 'General Sales' },
];

// Capitalize first letter helper function
const ucfirst = (str) => (str && typeof str === 'string' ? str.charAt(0).toUpperCase() + str.slice(1) : str || '');

export default function ProductForm({ product = null, categories: propCategories = [] }) {
  const isEditMode = Boolean(product?.id);

  const currentDosage = product?.dosage_form || 'Tablet';
  const isCustomDosageInitial = Boolean(
    currentDosage && !STANDARD_DOSAGE_FORMS.some((f) => f.value === currentDosage)
  );

  const currentRx = product?.prescription_type || 'Schedule H';
  const isCustomRxInitial = Boolean(
    currentRx && !STANDARD_PRESCRIPTION_TYPES.some((p) => p.value === currentRx)
  );

  // Custom dosage form state
  const [isCustomDosage, setIsCustomDosage] = useState(isCustomDosageInitial);
  const [customDosage, setCustomDosage] = useState(isCustomDosageInitial ? currentDosage : '');

  // Custom prescription type state
  const [isCustomPrescription, setIsCustomPrescription] = useState(isCustomRxInitial);
  const [customPrescription, setCustomPrescription] = useState(isCustomRxInitial ? ucfirst(currentRx) : '');

  // Form specifications
  const [formData, setFormData] = useState({
    brand_name: product ? ucfirst(product.brand_name) : '',
    generic_name: product ? ucfirst(product.generic_name) : '',
    product_code: product ? (product.product_code || '').toUpperCase() : '',
    category_id: product?.category_id || '',
    dosage_form: product ? ucfirst(currentDosage) : 'Tablet',
    strength: product ? ucfirst(product.strength) : '',
    prescription_type: product ? ucfirst(currentRx) : 'Schedule H',
    short_description: product ? ucfirst(product.short_description) : '',
    description: product ? ucfirst(product.description) : '',
    indications: product ? ucfirst(product.indications) : '',
    directions: product ? ucfirst(product.directions) : '',
    precautions: product ? ucfirst(product.precautions) : '',
    storage: product ? ucfirst(product.storage) : '',
    status: product?.status || 'active',
    is_featured: Boolean(product?.is_featured),
  });

  // Dynamic composition rows
  const [compositions, setCompositions] = useState(
    product?.compositions?.length
      ? product.compositions.map(c => ({
          ingredient_name: ucfirst(c.ingredient_name),
          strength: c.strength,
          unit: c.unit || 'mg'
        }))
      : [{ ingredient_name: '', strength: '', unit: 'mg' }]
  );

  // Existing images (for edit mode)
  const [existingImages, setExistingImages] = useState(product?.images || []);
  const [removedImageIds, setRemovedImageIds] = useState([]);

  // Newly selected images
  const [selectedImages, setSelectedImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);

  const categories = propCategories;
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Handle generic text/select input change with capitalization
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    let finalValue = type === 'checkbox' ? checked : value;

    if (name === 'product_code' && typeof finalValue === 'string') {
      finalValue = finalValue.toUpperCase();
    } else if (
      [
        'brand_name',
        'generic_name',
        'strength',
        'short_description',
        'description',
        'indications',
        'directions',
        'precautions',
        'storage',
      ].includes(name) &&
      typeof finalValue === 'string'
    ) {
      finalValue = ucfirst(finalValue);
    }

    setFormData((prev) => ({ ...prev, [name]: finalValue }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  // Handle dosage form select change
  const handleDosageSelectChange = (e) => {
    const val = e.target.value;
    if (val === 'Other') {
      setIsCustomDosage(true);
      setFormData((prev) => ({ ...prev, dosage_form: customDosage }));
    } else {
      setIsCustomDosage(false);
      setFormData((prev) => ({ ...prev, dosage_form: val }));
    }
  };

  // Handle custom dosage form input change with first letter capitalized
  const handleCustomDosageChange = (e) => {
    let val = e.target.value;
    if (val.length > 0) {
      val = val.charAt(0).toUpperCase() + val.slice(1);
    }
    setCustomDosage(val);
    setFormData((prev) => ({ ...prev, dosage_form: val }));
  };

  // Handle prescription type select change
  const handlePrescriptionSelectChange = (e) => {
    const val = e.target.value;
    if (val === 'Other') {
      setIsCustomPrescription(true);
      setFormData((prev) => ({ ...prev, prescription_type: customPrescription }));
    } else {
      setIsCustomPrescription(false);
      setFormData((prev) => ({ ...prev, prescription_type: val }));
    }
  };

  // Handle custom prescription type input change with first letter capitalized
  const handleCustomPrescriptionChange = (e) => {
    let val = e.target.value;
    if (val.length > 0) {
      val = val.charAt(0).toUpperCase() + val.slice(1);
    }
    setCustomPrescription(val);
    setFormData((prev) => ({ ...prev, prescription_type: val }));
  };

  // Modify composition row item with first letter capitalized
  const handleCompositionChange = (index, field, value) => {
    let finalVal = value;
    if (field === 'ingredient_name') {
      finalVal = ucfirst(finalVal);
    }
    setCompositions((prev) => {
      const updated = [...prev];
      updated[index][field] = finalVal;
      return updated;
    });

    const errKey = `compositions.${index}.${field}`;
    if (errors[errKey] || errors.compositions) {
      setErrors((prev) => ({ ...prev, [errKey]: null, compositions: null }));
    }
  };

  // Append new composition row
  const addCompositionRow = () => {
    setCompositions((prev) => [
      ...prev,
      { ingredient_name: '', strength: '', unit: 'mg' },
    ]);
  };

  // Remove composition row
  const removeCompositionRow = (index) => {
    setErrors((prev) => {
      const next = { ...prev };
      Object.keys(next).forEach((k) => {
        if (k.startsWith('compositions.')) {
          delete next[k];
        }
      });
      return next;
    });

    if (compositions.length === 1) {
      setCompositions([{ ingredient_name: '', strength: '', unit: 'mg' }]);
      return;
    }
    setCompositions((prev) => prev.filter((_, i) => i !== index));
  };

  // Remove existing image in edit mode
  const handleRemoveExistingImage = (imageId) => {
    setExistingImages((prev) => prev.filter((img) => img.id !== imageId));
    setRemovedImageIds((prev) => [...prev, imageId]);
  };

  // Handle selected image files
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp'];
    const validFiles = [];
    const newPreviews = [];
    const rejectedMessages = [];

    files.forEach((file) => {
      if (!allowedTypes.includes(file.type)) {
        rejectedMessages.push(`"${file.name}" must be a JPEG, PNG, or WEBP image.`);
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        rejectedMessages.push(`"${file.name}" exceeds the 5MB limit.`);
        return;
      }
      validFiles.push(file);
      newPreviews.push({
        url: URL.createObjectURL(file),
        name: file.name,
      });
    });

    if (rejectedMessages.length > 0) {
      rejectedMessages.forEach((msg) => toast.error(msg));
      setErrors((prev) => ({ ...prev, images: rejectedMessages[0] }));
    } else {
      setErrors((prev) => {
        const next = { ...prev };
        Object.keys(next).forEach((k) => {
          if (k === 'images' || k.startsWith('images.')) {
            delete next[k];
          }
        });
        return next;
      });
    }

    setSelectedImages((prev) => [...prev, ...validFiles]);
    setImagePreviews((prev) => [...prev, ...newPreviews]);
    e.target.value = '';
  };

  // Remove newly selected image
  const removeSelectedImage = (index) => {
    if (imagePreviews[index]?.url) {
      URL.revokeObjectURL(imagePreviews[index].url);
    }
    setSelectedImages((prev) => prev.filter((_, i) => i !== index));
    setImagePreviews((prev) => prev.filter((_, i) => i !== index));
  };

  // Validate form
  const validate = () => {
    const newErrors = {};
    if (!formData.brand_name.trim()) {
      newErrors.brand_name = 'Brand Name is required';
    }
    if (!formData.category_id) {
      newErrors.category_id = 'Please select a Category';
    }

    compositions.forEach((comp, idx) => {
      const hasName = Boolean(comp.ingredient_name?.trim());
      const hasStrength = Boolean(comp.strength?.trim());
      if (hasName && !hasStrength) {
        newErrors[`compositions.${idx}.strength`] = 'Strength value is required for this ingredient';
      }
      if (!hasName && hasStrength) {
        newErrors[`compositions.${idx}.ingredient_name`] = 'Ingredient name is required for this variation';
      }
    });

    return newErrors;
  };

  // Submit form for either Create or Update
  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validate();

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      const firstMsg = Object.values(validationErrors)[0];
      toast.error(firstMsg || 'Please fix the highlighted errors before saving.');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    setIsSubmitting(true);
    setErrors({});

    const data = new FormData();
    if (isEditMode) {
      data.append('_method', 'PUT');
    }

    data.append('brand_name', ucfirst(formData.brand_name.trim()));
    if (formData.generic_name.trim()) data.append('generic_name', ucfirst(formData.generic_name.trim()));
    if (formData.product_code.trim()) data.append('product_code', formData.product_code.trim().toUpperCase());
    data.append('category_id', formData.category_id);
    if (formData.dosage_form) data.append('dosage_form', ucfirst(formData.dosage_form));
    if (formData.strength.trim()) data.append('strength', ucfirst(formData.strength.trim()));
    if (formData.prescription_type) data.append('prescription_type', ucfirst(formData.prescription_type));

    if (formData.short_description.trim()) data.append('short_description', ucfirst(formData.short_description.trim()));
    if (formData.description.trim()) data.append('description', ucfirst(formData.description.trim()));
    if (formData.indications.trim()) data.append('indications', ucfirst(formData.indications.trim()));
    if (formData.directions.trim()) data.append('directions', ucfirst(formData.directions.trim()));
    if (formData.precautions.trim()) data.append('precautions', ucfirst(formData.precautions.trim()));
    if (formData.storage.trim()) data.append('storage', ucfirst(formData.storage.trim()));

    data.append('status', formData.status);
    data.append('is_featured', formData.is_featured ? '1' : '0');

    const validCompositions = compositions
      .filter((c) => c.ingredient_name.trim() && c.strength.trim())
      .map((c) => ({
        ingredient_name: ucfirst(c.ingredient_name.trim()),
        strength: c.strength.trim(),
        unit: c.unit || 'mg',
      }));
    data.append('compositions', JSON.stringify(validCompositions));

    if (isEditMode && removedImageIds.length > 0) {
      data.append('removed_image_ids', JSON.stringify(removedImageIds));
    }

    selectedImages.forEach((file) => {
      data.append('images[]', file);
    });

    const endpoint = isEditMode
      ? `/admin/products/${product.id}`
      : '/admin/products';

    router.post(endpoint, data, {
      onError: (backendErrors) => {
        setErrors(backendErrors);
        setIsSubmitting(false);
        const firstMsg = Object.values(backendErrors)[0];
        toast.error(firstMsg || 'Failed to save product. Please check the errors below.');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      },
      onFinish: () => {
        setIsSubmitting(false);
      },
    });
  };

  const activeErrorEntries = Object.entries(errors).filter(([, msg]) => Boolean(msg));
  const imageErrorMessages = Object.entries(errors)
    .filter(([key, msg]) => Boolean(msg) && (key === 'images' || key.startsWith('images.')))
    .map(([, msg]) => msg);

  return (
    <AdminLayout>
      <div className="max-w-5xl mx-auto space-y-6 pb-12 pt-2">
        {activeErrorEntries.length > 0 && (
          <div className="rounded-xl border border-rose-200 bg-rose-50/80 p-4 text-rose-900 space-y-1.5">
            <div className="flex items-center gap-2 font-semibold text-xs sm:text-sm">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>Please review the errors below before saving:</span>
            </div>
            <ul className="list-disc list-inside text-xs space-y-0.5 text-rose-800">
              {activeErrorEntries.map(([key, msg]) => (
                <li key={key}>{msg}</li>
              ))}
            </ul>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Section 1: Basic Information */}
          <div className="bg-white rounded-xl border border-slate-200 p-6 sm:p-7 space-y-5">
            <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
              <div className="w-7 h-7 rounded-lg bg-teal-50 text-teal-700 flex items-center justify-center font-bold text-xs">
                1
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">Basic Information</h3>
                <p className="text-xs text-slate-500">Core formulation identification parameters</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700 flex items-center justify-between">
                  <span>Brand Name *</span>
                  <span className="text-[10px] text-slate-400 font-normal">Capitalized automatically</span>
                </label>
                <input
                  type="text"
                  name="brand_name"
                  value={formData.brand_name}
                  onChange={handleChange}
                  placeholder="e.g. Paracetamol Extra"
                  className={`w-full px-3.5 py-2 text-xs sm:text-sm rounded-lg border outline-none transition-colors ${
                    errors.brand_name
                      ? 'border-rose-300 bg-rose-50/20 text-rose-900'
                      : 'border-slate-200 bg-slate-50/50 hover:bg-white focus:bg-white focus:border-teal-500 focus:ring-1 focus:ring-teal-500'
                  }`}
                />
                {errors.brand_name && (
                  <p className="text-[11px] text-rose-600 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    {errors.brand_name}
                  </p>
                )}
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700 flex items-center justify-between">
                  <span>Generic Name</span>
                  <span className="text-[10px] text-slate-400 font-normal">Capitalized automatically</span>
                </label>
                <input
                  type="text"
                  name="generic_name"
                  value={formData.generic_name}
                  onChange={handleChange}
                  placeholder="e.g. Acetaminophen + Caffeine"
                  className={`w-full px-3.5 py-2 text-xs sm:text-sm rounded-lg border transition-colors outline-none ${
                    errors.generic_name
                      ? 'border-rose-300 bg-rose-50/20 text-rose-900'
                      : 'border-slate-200 bg-slate-50/50 hover:bg-white focus:bg-white focus:border-teal-500 focus:ring-1 focus:ring-teal-500'
                  }`}
                />
                <FieldError message={errors.generic_name} />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700 flex items-center justify-between">
                  <span>Product Code / SKU</span>
                  <span className="text-[10px] text-slate-400 font-normal">Auto uppercase</span>
                </label>
                <input
                  type="text"
                  name="product_code"
                  value={formData.product_code}
                  onChange={handleChange}
                  placeholder="e.g. APX-TAB-001"
                  className="w-full px-3.5 py-2 text-xs sm:text-sm font-mono rounded-lg border border-slate-200 bg-slate-50/50 hover:bg-white focus:bg-white focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-colors outline-none uppercase"
                />
                {errors.product_code && (
                  <p className="text-[11px] text-rose-600 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    {errors.product_code}
                  </p>
                )}
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700">Category *</label>
                <select
                  name="category_id"
                  value={formData.category_id}
                  onChange={handleChange}
                  className={`w-full px-3.5 py-2 text-xs sm:text-sm rounded-lg border outline-none transition-colors cursor-pointer text-slate-700 ${
                    errors.category_id
                      ? 'border-rose-300 bg-rose-50/20 text-rose-900'
                      : 'border-slate-200 bg-slate-50/50 hover:bg-white focus:bg-white focus:border-teal-500 focus:ring-1 focus:ring-teal-500'
                  }`}
                >
                  <option value="">Select Category</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
                {errors.category_id && (
                  <p className="text-[11px] text-rose-600 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    {errors.category_id}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Section 2: Formulation & Dosage */}
          <div className="bg-white rounded-xl border border-slate-200 p-6 sm:p-7 space-y-5">
            <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
              <div className="w-7 h-7 rounded-lg bg-teal-50 text-teal-700 flex items-center justify-center font-bold text-xs">
                2
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">Formulation & Dosage</h3>
                <p className="text-xs text-slate-500">Dosage forms and prescription regulatory classifications</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-5">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700">Dosage Form</label>
                <select
                  value={isCustomDosage ? 'Other' : formData.dosage_form}
                  onChange={handleDosageSelectChange}
                  className="w-full px-3.5 py-2 text-xs sm:text-sm rounded-lg border border-slate-200 bg-slate-50/50 hover:bg-white focus:bg-white focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-colors outline-none cursor-pointer text-slate-700"
                >
                  {STANDARD_DOSAGE_FORMS.map((f) => (
                    <option key={f.value} value={f.value}>
                      {f.label}
                    </option>
                  ))}
                  <option value="Other">Other / Custom</option>
                </select>

                {isCustomDosage && (
                  <input
                    type="text"
                    value={customDosage}
                    onChange={handleCustomDosageChange}
                    placeholder="Enter custom dosage form (e.g. Lozenges)"
                    className="w-full mt-2 px-3.5 py-2 text-xs sm:text-sm rounded-lg border border-teal-300 bg-teal-50/30 focus:bg-white focus:border-teal-500 transition-colors outline-none"
                    autoFocus
                  />
                )}
                <FieldError message={errors.dosage_form} />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700 flex items-center justify-between">
                  <span>Strength</span>
                  <span className="text-[10px] text-slate-400 font-normal">Capitalized automatically</span>
                </label>
                <input
                  type="text"
                  name="strength"
                  value={formData.strength}
                  onChange={handleChange}
                  placeholder="e.g. 500 mg, 10 mg/5ml"
                  className={`w-full px-3.5 py-2 text-xs sm:text-sm rounded-lg border transition-colors outline-none ${
                    errors.strength
                      ? 'border-rose-300 bg-rose-50/20 text-rose-900'
                      : 'border-slate-200 bg-slate-50/50 hover:bg-white focus:bg-white focus:border-teal-500 focus:ring-1 focus:ring-teal-500'
                  }`}
                />
                <FieldError message={errors.strength} />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700">Prescription Classification</label>
                <select
                  value={isCustomPrescription ? 'Other' : formData.prescription_type}
                  onChange={handlePrescriptionSelectChange}
                  className="w-full px-3.5 py-2 text-xs sm:text-sm rounded-lg border border-slate-200 bg-slate-50/50 hover:bg-white focus:bg-white focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-colors outline-none cursor-pointer text-slate-700"
                >
                  {STANDARD_PRESCRIPTION_TYPES.map((p) => (
                    <option key={p.value} value={p.value}>
                      {p.label}
                    </option>
                  ))}
                  <option value="Other">Other Custom Classification</option>
                </select>

                {isCustomPrescription && (
                  <input
                    type="text"
                    value={customPrescription}
                    onChange={handleCustomPrescriptionChange}
                    placeholder="Enter prescription type"
                    className="w-full mt-2 px-3.5 py-2 text-xs sm:text-sm rounded-lg border border-teal-300 bg-teal-50/30 focus:bg-white focus:border-teal-500 transition-colors outline-none"
                    autoFocus
                  />
                )}
                <FieldError message={errors.prescription_type} />
              </div>
            </div>
          </div>

          {/* Section 3: Active Compositions */}
          <div className="bg-white rounded-xl border border-slate-200 p-6 sm:p-7 space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-teal-50 text-teal-700 flex items-center justify-center font-bold text-xs">
                  3
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">Active Compositions (APIs)</h3>
                  <p className="text-xs text-slate-500">Chemical molecules and biological strengths per dosage unit</p>
                </div>
              </div>

              <button
                type="button"
                onClick={addCompositionRow}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-teal-700 bg-teal-50 hover:bg-teal-100 rounded-lg transition-colors cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Ingredient</span>
              </button>
            </div>

            <div className="space-y-3">
              {errors.compositions && <FieldError message={errors.compositions} />}

              {compositions.map((item, idx) => {
                const nameError = errors[`compositions.${idx}.ingredient_name`];
                const strengthError = errors[`compositions.${idx}.strength`];
                const unitError = errors[`compositions.${idx}.unit`];

                return (
                  <div
                    key={idx}
                    className={`flex flex-col sm:flex-row items-start gap-3 p-3 rounded-lg border ${
                      nameError || strengthError || unitError
                        ? 'border-rose-300 bg-rose-50/30'
                        : 'border-slate-200/80 bg-slate-50/40'
                    }`}
                  >
                    <div className="flex-1 w-full space-y-1">
                      <span className="text-[10px] uppercase font-semibold text-slate-400">Ingredient Name</span>
                      <input
                        type="text"
                        value={item.ingredient_name}
                        onChange={(e) => handleCompositionChange(idx, 'ingredient_name', e.target.value)}
                        placeholder="e.g. Paracetamol (Acetaminophen)"
                        className={`w-full px-3 py-1.5 text-xs sm:text-sm rounded-lg border bg-white outline-none ${
                          nameError ? 'border-rose-300 focus:border-rose-500' : 'border-slate-200 focus:border-teal-500'
                        }`}
                      />
                      <FieldError message={nameError} />
                    </div>

                    <div className="w-full sm:w-36 space-y-1">
                      <span className="text-[10px] uppercase font-semibold text-slate-400">Strength Value</span>
                      <input
                        type="text"
                        value={item.strength}
                        onChange={(e) => handleCompositionChange(idx, 'strength', e.target.value)}
                        placeholder="e.g. 500"
                        className={`w-full px-3 py-1.5 text-xs sm:text-sm rounded-lg border bg-white outline-none ${
                          strengthError ? 'border-rose-300 focus:border-rose-500' : 'border-slate-200 focus:border-teal-500'
                        }`}
                      />
                      <FieldError message={strengthError} />
                    </div>

                    <div className="w-full sm:w-28 space-y-1">
                      <span className="text-[10px] uppercase font-semibold text-slate-400">Unit</span>
                      <input
                        type="text"
                        value={item.unit}
                        onChange={(e) => handleCompositionChange(idx, 'unit', e.target.value)}
                        placeholder="e.g. mg, mcg, %"
                        className={`w-full px-3 py-1.5 text-xs sm:text-sm rounded-lg border bg-white outline-none ${
                          unitError ? 'border-rose-300 focus:border-rose-500' : 'border-slate-200 focus:border-teal-500'
                        }`}
                      />
                      <FieldError message={unitError} />
                    </div>

                    <div className="self-end sm:self-center pt-2 sm:pt-4">
                      <button
                        type="button"
                        onClick={() => removeCompositionRow(idx)}
                        className="p-1.5 rounded-lg text-rose-500 hover:text-rose-700 hover:bg-rose-50 transition-colors cursor-pointer"
                        title="Remove ingredient"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Section 4: Clinical Overview & Pharmacological Details */}
          <div className="bg-white rounded-xl border border-slate-200 p-6 sm:p-7 space-y-5">
            <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
              <div className="w-7 h-7 rounded-lg bg-teal-50 text-teal-700 flex items-center justify-center font-bold text-xs">
                4
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">Clinical Overview & Documentation</h3>
                <p className="text-xs text-slate-500">Technical monograph information, indications, and administration directions</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700 flex items-center justify-between">
                  <span>Short Summary / Tagline</span>
                  <span className="text-[10px] text-slate-400 font-normal">Capitalized automatically</span>
                </label>
                <input
                  type="text"
                  name="short_description"
                  value={formData.short_description}
                  onChange={handleChange}
                  placeholder="Concise one-line pharmacological description..."
                  className="w-full px-3.5 py-2 text-xs sm:text-sm rounded-lg border border-slate-200 bg-slate-50/50 hover:bg-white focus:bg-white focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-colors outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700 flex items-center justify-between">
                  <span>Detailed Clinical Description</span>
                  <span className="text-[10px] text-slate-400 font-normal">Capitalized automatically</span>
                </label>
                <textarea
                  rows={3}
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Comprehensive pharmacological profile, pharmacokinetics, and therapeutic class..."
                  className="w-full px-3.5 py-2 text-xs sm:text-sm rounded-lg border border-slate-200 bg-slate-50/50 hover:bg-white focus:bg-white focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-colors outline-none resize-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700 flex items-center justify-between">
                    <span>Clinical Indications</span>
                    <span className="text-[10px] text-slate-400 font-normal">Capitalized automatically</span>
                  </label>
                  <textarea
                    rows={2}
                    name="indications"
                    value={formData.indications}
                    onChange={handleChange}
                    placeholder="Diseases, symptoms, or diagnostic uses..."
                    className="w-full px-3.5 py-2 text-xs sm:text-sm rounded-lg border border-slate-200 bg-slate-50/50 hover:bg-white focus:bg-white focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-colors outline-none resize-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700 flex items-center justify-between">
                    <span>Dosage & Administration Directions</span>
                    <span className="text-[10px] text-slate-400 font-normal">Capitalized automatically</span>
                  </label>
                  <textarea
                    rows={2}
                    name="directions"
                    value={formData.directions}
                    onChange={handleChange}
                    placeholder="Standard dosing frequency, route, and administration instructions..."
                    className="w-full px-3.5 py-2 text-xs sm:text-sm rounded-lg border border-slate-200 bg-slate-50/50 hover:bg-white focus:bg-white focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-colors outline-none resize-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700 flex items-center justify-between">
                    <span>Precautions & Warnings</span>
                    <span className="text-[10px] text-slate-400 font-normal">Capitalized automatically</span>
                  </label>
                  <textarea
                    rows={2}
                    name="precautions"
                    value={formData.precautions}
                    onChange={handleChange}
                    placeholder="Contraindications, drug interactions, pregnancy warnings..."
                    className="w-full px-3.5 py-2 text-xs sm:text-sm rounded-lg border border-slate-200 bg-slate-50/50 hover:bg-white focus:bg-white focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-colors outline-none resize-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700 flex items-center justify-between">
                    <span>Storage Requirements</span>
                    <span className="text-[10px] text-slate-400 font-normal">Capitalized automatically</span>
                  </label>
                  <textarea
                    rows={2}
                    name="storage"
                    value={formData.storage}
                    onChange={handleChange}
                    placeholder="e.g. Store below 25°C in a dry place. Protect from light."
                    className="w-full px-3.5 py-2 text-xs sm:text-sm rounded-lg border border-slate-200 bg-slate-50/50 hover:bg-white focus:bg-white focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-colors outline-none resize-none"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Section 5: Imagery & Media Assets */}
          <div className="bg-white rounded-xl border border-slate-200 p-6 sm:p-7 space-y-5">
            <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
              <div className="w-7 h-7 rounded-lg bg-teal-50 text-teal-700 flex items-center justify-center font-bold text-xs">
                5
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">Product Photography & Visuals</h3>
                <p className="text-xs text-slate-500">High-resolution packaging, blister packs, and vials stored in Cloudflare R2 (Max 5MB per file)</p>
              </div>
            </div>

            {/* Existing images list (edit mode) */}
            {isEditMode && existingImages.length > 0 && (
              <div className="space-y-2">
                <span className="text-xs font-semibold text-slate-700 block">Existing Images</span>
                <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-3">
                  {existingImages.map((img) => {
                    const imgSrc = resolveImageUrl(img);
                    return (
                      <div key={img.id} className="relative group rounded-lg border border-slate-200 overflow-hidden bg-slate-50 aspect-square flex items-center justify-center">
                        {imgSrc ? (
                          <img
                            src={imgSrc}
                            alt={img.alt_text || ''}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.currentTarget.style.display = 'none';
                            }}
                          />
                        ) : (
                          <ImageIcon className="w-6 h-6 text-slate-300" />
                        )}
                        <button
                          type="button"
                          onClick={() => handleRemoveExistingImage(img.id)}
                          className="absolute top-1 right-1 p-1 rounded-md bg-rose-600 text-white opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer shadow-xs"
                          title="Remove image"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Upload Zone */}
            <div className={`border-2 border-dashed rounded-xl p-6 text-center transition-colors bg-slate-50/30 ${
              imageErrorMessages.length > 0 ? 'border-rose-300 bg-rose-50/20' : 'border-slate-200 hover:border-teal-400'
            }`}>
              <input
                type="file"
                multiple
                accept="image/jpeg,image/png,image/jpg,image/webp"
                onChange={handleImageChange}
                className="hidden"
                id="product-image-file-input"
              />
              <label
                htmlFor="product-image-file-input"
                className="flex flex-col items-center justify-center cursor-pointer space-y-2"
              >
                <div className="w-10 h-10 rounded-full bg-teal-50 text-teal-600 flex items-center justify-center">
                  <Upload className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xs font-semibold text-teal-700 hover:underline">Click to upload product photos</span>
                  <span className="text-xs text-slate-500"> or drag and drop</span>
                </div>
                <p className="text-[11px] text-slate-400">PNG, JPG, or WEBP up to 5MB each</p>
              </label>
            </div>

            {imageErrorMessages.length > 0 && (
              <div className="space-y-1">
                {imageErrorMessages.map((msg, i) => (
                  <FieldError key={i} message={msg} />
                ))}
              </div>
            )}

            {/* Newly selected image previews */}
            {imagePreviews.length > 0 && (
              <div className="space-y-2 pt-2">
                <span className="text-xs font-semibold text-slate-700 block">Ready to Upload ({imagePreviews.length})</span>
                <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-3">
                  {imagePreviews.map((preview, idx) => (
                    <div key={idx} className="relative group rounded-lg border border-teal-200 overflow-hidden bg-slate-50 aspect-square">
                      <img src={preview.url} alt="" className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => removeSelectedImage(idx)}
                        className="absolute top-1 right-1 p-1 rounded-md bg-rose-600 text-white opacity-90 hover:opacity-100 transition-opacity cursor-pointer shadow-xs"
                        title="Remove image"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Section 6: Publishing & Showcase Status */}
          <div className="bg-white rounded-xl border border-slate-200 p-6 sm:p-7 space-y-5">
            <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
              <div className="w-7 h-7 rounded-lg bg-teal-50 text-teal-700 flex items-center justify-center font-bold text-xs">
                6
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">Publishing & Catalog Visibility</h3>
                <p className="text-xs text-slate-500">Control lifecycle state and public landing page promotion</p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-2">
                  Publication Status
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                  {[
                    { value: 'active', label: 'Active', desc: 'Visible in commercial catalog' },
                    { value: 'draft', label: 'Draft', desc: 'Work in progress / unlisted' },
                    { value: 'inactive', label: 'Inactive', desc: 'Temporarily disabled' },
                    { value: 'archived', label: 'Archived', desc: 'Discontinued monograph' },
                  ].map((s) => (
                    <label
                      key={s.value}
                      className={`flex items-start gap-2.5 p-3 rounded-lg border cursor-pointer transition-colors ${
                        formData.status === s.value
                          ? 'border-teal-500 bg-teal-50/30 text-teal-950 font-medium'
                          : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                      }`}
                    >
                      <input
                        type="radio"
                        name="status"
                        value={s.value}
                        checked={formData.status === s.value}
                        onChange={handleChange}
                        className="w-4 h-4 mt-0.5 text-teal-600 focus:ring-teal-500"
                      />
                      <div>
                        <span className="text-xs font-semibold block">{s.label}</span>
                        <span className="text-[10px] text-slate-500 block">{s.desc}</span>
                      </div>
                    </label>
                  ))}
                </div>
                <FieldError message={errors.status} />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-2">
                  Public Website Promotion
                </label>
                <label className="flex items-start gap-3 p-4 rounded-lg border border-slate-200 hover:bg-slate-50 cursor-pointer transition-colors">
                  <input
                    type="checkbox"
                    name="is_featured"
                    checked={formData.is_featured}
                    onChange={handleChange}
                    className="w-4 h-4 mt-0.5 rounded text-teal-600 focus:ring-teal-500"
                  />
                  <div>
                    <span className="text-xs font-semibold text-slate-900 block flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                      Feature on Homepage
                    </span>
                    <span className="text-[11px] text-slate-500 block mt-0.5">
                      Display prominently on the public homepage featured medicine formulations showcase.
                    </span>
                  </div>
                </label>
              </div>
            </div>
          </div>

          {/* Bottom Actions */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <Link
              href="/admin/products"
              className="px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2 text-xs font-semibold text-white bg-teal-600 hover:bg-teal-700 active:bg-teal-800 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer flex items-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                  <span>{isEditMode ? 'Updating Product...' : 'Saving Product...'}</span>
                </>
              ) : (
                <span>{isEditMode ? 'Update Product' : 'Save & Publish Product'}</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
}
