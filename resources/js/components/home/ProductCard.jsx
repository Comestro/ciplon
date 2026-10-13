import { useState } from 'react';
import { Link } from '@inertiajs/react';
import { Pill, FlaskConical, Droplet, ArrowRight, ShieldCheck } from 'lucide-react';

export default function ProductCard({ product }) {
  const [imgError, setImgError] = useState(false);

  if (!product) return null;

  const productId = product.id || product.product_code || product.productCode || product.slug;
  const brandName = product.brandName || product.brand_name || 'Pharmaceutical Formulation';
  const genericName = product.genericName || product.generic_name || '';
  const dosageForm = product.dosageForm || product.dosage_form || 'Solid Oral';
  const strength = product.strength || '';
  const categoryName = product.category?.name || (typeof product.category === 'string' ? product.category : '') || product.therapeuticArea || '';

  const imageUrl =
    product.imageUrl ||
    product.image_url ||
    product.image ||
    product.primary_image?.url ||
    product.primary_image?.image_url ||
    product.primaryImage?.url ||
    product.primaryImage?.image_url ||
    (Array.isArray(product.images) && product.images.length > 0
      ? (typeof product.images[0] === 'string' ? product.images[0] : product.images[0]?.url || product.images[0]?.image_url)
      : null);

  const getDosageIcon = (form = '') => {
    const safeForm = String(form || '').toLowerCase();
    if (safeForm.includes('capsule')) {
      return (
        <svg className="w-6 h-6 text-[#c59324]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="3" y="9" width="18" height="6" rx="3" transform="rotate(-45 12 12)" />
          <line x1="8" y1="8" x2="16" y2="16" />
        </svg>
      );
    }
    if (safeForm.includes('syrup') || safeForm.includes('liquid') || safeForm.includes('suspension')) {
      return <FlaskConical className="w-6 h-6 text-[#c59324]" />;
    }
    if (safeForm.includes('drop')) {
      return <Droplet className="w-6 h-6 text-[#c59324]" />;
    }
    return <Pill className="w-6 h-6 text-[#c59324]" />;
  };

  return (
    <Link
      href={`/products/${productId}`}
      className="group bg-white rounded-2xl border border-slate-200 hover:border-[#c59324] transition-colors duration-200 flex flex-col justify-between overflow-hidden cursor-pointer"
    >
      <div>
        <div className="relative w-full h-48 sm:h-52 bg-white border-b border-slate-100 flex items-center justify-center p-3">
          <span className="absolute top-3 left-3 z-10 inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#0c2340] text-white">
            {dosageForm}
          </span>

          {strength && (
            <span className="absolute top-3 right-3 z-10 inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold text-[#0c2340] bg-amber-50 border border-amber-200/70">
              {strength}
            </span>
          )}

          {imageUrl && !imgError ? (
            <img
              src={imageUrl}
              alt={brandName}
              onError={() => setImgError(true)}
              loading="lazy"
              className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center bg-slate-50/50 p-4">
              <div className="w-14 h-14 rounded-2xl bg-white border border-slate-200 flex items-center justify-center text-[#c59324] group-hover:scale-105 transition-transform duration-200">
                {getDosageIcon(dosageForm)}
              </div>
            </div>
          )}
        </div>

        <div className="p-4 sm:p-5">
          {categoryName && (
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#c59324] block mb-1">
              {categoryName}
            </span>
          )}
          <h3 className="text-base font-bold text-[#0c2340] group-hover:text-[#c59324] transition-colors line-clamp-1">
            {brandName}
          </h3>
          {genericName ? (
            <p className="text-xs text-slate-600 font-medium line-clamp-2 mt-1 leading-relaxed">
              {genericName}
            </p>
          ) : (
            <p className="text-xs text-slate-400 font-medium line-clamp-1 mt-1">
              Clinical formulation monograph
            </p>
          )}
        </div>
      </div>

      <div className="px-4 sm:px-5 pb-4 pt-0">
        <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <span className="font-semibold text-slate-600 truncate flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>WHO-GMP Validated</span>
          </span>
          <span className="text-[#c59324] font-bold inline-flex items-center gap-1 group-hover:translate-x-1 transition-transform shrink-0">
            <span>Dossier</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </span>
        </div>
      </div>
    </Link>
  );
}
