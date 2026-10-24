// ProductDetails component for viewing complete pharmaceutical profile
import { useState } from 'react';
import { Link, router } from '@inertiajs/react';
import {
  Package, 
  Edit3, 
  Trash2, 
  Sparkles, 
  FileText, 
  FlaskConical, 
  Image as ImageIcon
} from 'lucide-react';
import AdminLayout from '../../../layouts/AdminLayout';
import ConfirmModal from '../../../components/common/ConfirmModal';

// Capitalize first letter helper function
const capitalizeFirst = (text) => {
  if (!text || typeof text !== 'string') return text;
  return text.charAt(0).toUpperCase() + text.slice(1);
};

export default function ProductDetails({ product }) {
  const [activeImage, setActiveImage] = useState(
    product?.primary_image?.url || product?.primaryImage?.url || product?.images?.[0]?.url || null
  );
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [brokenImages, setBrokenImages] = useState({});

  // Handle broken image fallback
  const handleImageError = (url) => {
    if (!url) return;
    setBrokenImages((prev) => ({ ...prev, [url]: true }));
  };

  // Delete product after user confirmation in modal
  const handleConfirmDelete = () => {
    if (!product) return;
    setIsDeleting(true);
    router.delete(`/admin/products/${product.id}`, {
      onFinish: () => {
        setIsDeleting(false);
        setIsDeleteModalOpen(false);
      },
    });
  };

  if (!product) {
    return (
      <AdminLayout>
        <div className="max-w-md mx-auto p-12 text-center space-y-4">
          <Package className="w-12 h-12 text-slate-300 mx-auto" />
          <h3 className="text-base font-bold text-slate-800">Product not found</h3>
          <Link href="/admin/products" className="inline-block text-xs font-semibold text-teal-600 hover:underline">
            &larr; Back to Products list
          </Link>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="max-w-6xl mx-auto space-y-6 pb-12">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3">
              <h2 className="text-2xl font-bold tracking-tight text-slate-900 capitalize">
                {product.brand_name}
              </h2>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold uppercase tracking-wider bg-teal-50 text-teal-700 border border-teal-200">
                {product.status}
              </span>
              {product.is_featured && (
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200 flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-amber-500" /> Featured
                </span>
              )}
            </div>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5 capitalize">
              {product.generic_name || 'No generic name'} • {product.dosage_form || 'Formulation'} {product.strength ? `(${product.strength})` : ''}
            </p>
          </div>

          <div className="flex items-center gap-2.5 self-start sm:self-auto">


            <Link
              href={`/admin/products/${product.id}/edit`}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-teal-600 hover:bg-teal-700 rounded-lg transition-colors"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>Edit</span>
            </Link>

            <button
              type="button"
              onClick={() => setIsDeleteModalOpen(true)}
              className="p-2 text-xs font-medium text-rose-600 bg-rose-50 hover:bg-rose-100 rounded-lg border border-rose-200 transition-colors cursor-pointer"
              title="Delete product"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="space-y-6">
            <div className="bg-white rounded-xl border border-slate-200 p-5 space-y-3">
              <div className="w-full aspect-square rounded-lg bg-slate-100 border border-slate-200 overflow-hidden flex items-center justify-center">
                {activeImage && !brokenImages[activeImage] ? (
                  <img
                    src={activeImage}
                    alt={product.brand_name}
                    className="w-full h-full object-cover"
                    onError={() => handleImageError(activeImage)}
                  />
                ) : (
                  <div className="text-center p-6 text-slate-400">
                    <ImageIcon className="w-12 h-12 mx-auto mb-2 opacity-50" />
                    <p className="text-xs">
                      {activeImage ? 'Image unavailable' : 'No product photos uploaded'}
                    </p>
                  </div>
                )}
              </div>

              {product.images?.length > 1 && (
                <div className="flex gap-2 overflow-x-auto pb-1">
                  {product.images.map((img) => (
                    <button
                      key={img.id}
                      type="button"
                      onClick={() => setActiveImage(img.url)}
                      className={`w-14 h-14 rounded-lg overflow-hidden border-2 shrink-0 cursor-pointer transition-all flex items-center justify-center bg-slate-50 ${
                        activeImage === img.url ? 'border-teal-500 scale-95' : 'border-slate-200 opacity-70 hover:opacity-100'
                      }`}
                    >
                      {!brokenImages[img.url] ? (
                        <img
                          src={img.url}
                          alt="thumb"
                          className="w-full h-full object-cover"
                          onError={() => handleImageError(img.url)}
                        />
                      ) : (
                        <ImageIcon className="w-5 h-5 text-slate-400" />
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="bg-white rounded-xl border border-slate-200 p-5 space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">Quick Specs</h4>
              <div className="divide-y divide-slate-100 text-xs">
                <div className="py-2 flex justify-between">
                  <span className="text-slate-500">Category:</span>
                  <span className="font-semibold text-slate-900 capitalize">{product.category?.name || '—'}</span>
                </div>
                <div className="py-2 flex justify-between">
                  <span className="text-slate-500">Product Code:</span>
                  <span className="font-mono font-medium text-slate-900 uppercase">{product.product_code || '—'}</span>
                </div>
                <div className="py-2 flex justify-between">
                  <span className="text-slate-500">Dosage Form:</span>
                  <span className="font-medium text-slate-900 capitalize">{product.dosage_form || '—'}</span>
                </div>
                <div className="py-2 flex justify-between">
                  <span className="text-slate-500">Strength:</span>
                  <span className="font-medium text-slate-900 capitalize">{product.strength || '—'}</span>
                </div>
                <div className="py-2 flex justify-between">
                  <span className="text-slate-500">Prescription:</span>
                  <span className="font-medium text-slate-900 capitalize">{product.prescription_type || '—'}</span>
                </div>
                <div className="py-2 flex justify-between">
                  <span className="text-slate-500">URL Slug:</span>
                  <span className="font-mono text-slate-600">/{product.slug}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
              <div className="p-5 border-b border-slate-100 flex items-center gap-2">
                <FlaskConical className="w-5 h-5 text-teal-600" />
                <h3 className="text-sm font-bold text-slate-900">Active Formulation Composition</h3>
              </div>
              {product.compositions?.length ? (
                <table className="w-full text-left text-xs sm:text-sm">
                  <thead>
                    <tr className="bg-slate-50 text-[11px] font-semibold text-slate-500 uppercase tracking-wider border-b border-slate-200">
                      <th className="py-3 px-5">Active Pharmaceutical Ingredient</th>
                      <th className="py-3 px-5 text-right">Strength</th>
                      <th className="py-3 px-5 text-right">Unit</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {product.compositions.map((comp) => (
                      <tr key={comp.id} className="hover:bg-slate-50/50">
                        <td className="py-3 px-5 font-semibold text-slate-900 capitalize">{comp.ingredient_name}</td>
                        <td className="py-3 px-5 text-right font-mono font-medium text-slate-800">{comp.strength}</td>
                        <td className="py-3 px-5 text-right font-mono text-slate-500 uppercase">{comp.unit}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div className="p-6 text-center text-xs text-slate-400">
                  No active ingredient compositions listed for this formulation.
                </div>
              )}
            </div>

            <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-5">
              <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
                <FileText className="w-5 h-5 text-teal-600" />
                <h3 className="text-sm font-bold text-slate-900">Therapeutic Overview & Monograph</h3>
              </div>

              {product.short_description && (
                <div>
                  <h5 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Highlight Summary</h5>
                  <p className="text-xs sm:text-sm text-slate-700 bg-teal-50/40 p-3 rounded-lg border border-teal-100 first-letter:uppercase">
                    {capitalizeFirst(product.short_description)}
                  </p>
                </div>
              )}

              {product.description && (
                <div>
                  <h5 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Detailed Description</h5>
                  <p className="text-xs sm:text-sm text-slate-700 whitespace-pre-line leading-relaxed first-letter:uppercase">
                    {capitalizeFirst(product.description)}
                  </p>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="p-4 rounded-lg bg-slate-50 border border-slate-200">
                  <h5 className="text-xs font-bold text-slate-800 mb-1">Approved Indications</h5>
                  <p className="text-xs text-slate-600 leading-relaxed whitespace-pre-line first-letter:uppercase">
                    {capitalizeFirst(product.indications) || <span className="text-slate-400 italic">None specified</span>}
                  </p>
                </div>

                <div className="p-4 rounded-lg bg-slate-50 border border-slate-200">
                  <h5 className="text-xs font-bold text-slate-800 mb-1">Dosage & Directions</h5>
                  <p className="text-xs text-slate-600 leading-relaxed whitespace-pre-line first-letter:uppercase">
                    {capitalizeFirst(product.directions) || <span className="text-slate-400 italic">None specified</span>}
                  </p>
                </div>

                <div className="p-4 rounded-lg bg-slate-50 border border-slate-200">
                  <h5 className="text-xs font-bold text-slate-800 mb-1">Precautions & Warnings</h5>
                  <p className="text-xs text-slate-600 leading-relaxed whitespace-pre-line first-letter:uppercase">
                    {capitalizeFirst(product.precautions) || <span className="text-slate-400 italic">None specified</span>}
                  </p>
                </div>

                <div className="p-4 rounded-lg bg-slate-50 border border-slate-200">
                  <h5 className="text-xs font-bold text-slate-800 mb-1">Storage Parameters</h5>
                  <p className="text-xs text-slate-600 leading-relaxed whitespace-pre-line first-letter:uppercase">
                    {capitalizeFirst(product.storage) || <span className="text-slate-400 italic">None specified</span>}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <ConfirmModal
          isOpen={isDeleteModalOpen}
          onClose={() => setIsDeleteModalOpen(false)}
          onConfirm={handleConfirmDelete}
          isLoading={isDeleting}
          title="Delete Product Profile"
          message={`Are you sure you want to delete "${product?.brand_name}"? This formulation, all chemical compositions, and associated images will be permanently removed.`}
          confirmText="Delete Product"
          isDanger={true}
        />
      </div>
    </AdminLayout>
  );
}
