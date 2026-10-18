// Dedicated admin hub for managing visual aid carousels across all products
import { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import {
  Image as ImageIcon,
  Plus,
  Eye,
  Search,
  ExternalLink,
  ChevronRight,
  Layers,
  Sparkles,
  CheckCircle2,
  Package
} from 'lucide-react';
import AdminLayout from '../../../layouts/AdminLayout';

export default function CarouselsHub({ products, filters = {} }) {
  const [searchTerm, setSearchTerm] = useState(filters.search || '');

  const handleSearch = (e) => {
    e.preventDefault();
    router.get('/admin/carousels', { search: searchTerm }, { preserveState: true });
  };

  const productList = products.data || products;

  return (
    <AdminLayout>
      <Head title="Visual Aid Carousels — Admin Desk" />

      <div className="space-y-6">
        {/* Top Header Card */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200/90 shadow-xs">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-teal-50 text-teal-700 flex items-center justify-center shadow-xs">
              <ImageIcon className="w-6 h-6 stroke-[2.2]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-black text-slate-900 tracking-tight">
                  Visual Aid Carousels
                </h1>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-teal-50 text-teal-800 border border-teal-200/80 font-bold">
                  E-Detailing Hub
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Create and manage image flipchart carousels presented by MRs on their tablets.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/mr/products"
              target="_blank"
              className="inline-flex items-center gap-1.5 px-4 py-2.5 text-xs font-bold text-teal-800 bg-teal-50 hover:bg-teal-100 border border-teal-200 rounded-xl transition-colors cursor-pointer shadow-xs"
            >
              <Eye className="w-4 h-4" />
              <span>Preview Live MR Deck</span>
              <ExternalLink className="w-3.5 h-3.5 opacity-60" />
            </Link>
          </div>
        </div>

        {/* Search & Filter Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
          <form onSubmit={handleSearch} className="relative w-full sm:w-96">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search product or molecule name..."
              className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-600"
            />
          </form>

          <div className="text-xs font-semibold text-slate-500 self-end sm:self-center">
            Showing {productList.length} products
          </div>
        </div>

        {/* Product Carousels Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {productList.map((product) => {
            const slides = product.slides || [];
            const hasSlides = slides.length > 0;

            return (
              <div
                key={product.id}
                className="bg-white rounded-3xl border border-slate-200/90 shadow-xs hover:shadow-md hover:border-teal-300 transition-all overflow-hidden flex flex-col justify-between"
              >
                {/* Header */}
                <div className="p-5 pb-3 space-y-1.5 border-b border-slate-100">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-teal-700 bg-teal-50 px-2.5 py-0.5 rounded-full border border-teal-200">
                      {product.category?.name || 'Formulation'}
                    </span>
                    <span
                      className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full ${
                        hasSlides
                          ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                          : 'bg-amber-50 text-amber-800 border border-amber-200'
                      }`}
                    >
                      {hasSlides ? `${slides.length} Slide(s)` : 'No Carousel Yet'}
                    </span>
                  </div>

                  <h3 className="text-base font-black text-slate-900 tracking-tight">{product.brand_name}</h3>
                  <p className="text-xs text-slate-500 truncate">{product.generic_name || product.dosage_form}</p>
                </div>

                {/* Carousel Thumbnail Strip or Placeholder */}
                <div className="p-4 bg-slate-50/60 min-h-[110px] flex items-center justify-center">
                  {hasSlides ? (
                    <div className="flex items-center gap-2 overflow-x-auto w-full py-1 scrollbar-none">
                      {slides.slice(0, 4).map((s, idx) => (
                        <div
                          key={s.id || idx}
                          className="relative w-20 h-16 rounded-xl overflow-hidden border border-slate-200 bg-slate-900 shrink-0 shadow-xs group"
                        >
                          <img src={s.image_path} alt={s.title} className="w-full h-full object-cover" />
                          <span className="absolute bottom-0 inset-x-0 bg-black/70 text-[9px] text-white font-black text-center py-0.5">
                            #{idx + 1}
                          </span>
                        </div>
                      ))}
                      {slides.length > 4 && (
                        <div className="w-12 h-16 rounded-xl bg-slate-200 text-slate-600 flex items-center justify-center font-bold text-xs shrink-0">
                          +{slides.length - 4}
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="text-center py-2 space-y-1">
                      <ImageIcon className="w-6 h-6 text-slate-300 mx-auto" />
                      <p className="text-[11px] text-slate-400">Click below to upload slide images</p>
                    </div>
                  )}
                </div>

                {/* Bottom CTA Button */}
                <div className="p-4 pt-3 border-t border-slate-100 bg-white flex items-center justify-between gap-3">
                  <span className="text-[11px] text-slate-500 font-medium">
                    {product.dosage_form} • {product.strength || 'Standard'}
                  </span>

                  <Link
                    href={`/admin/products/${product.id}/slides`}
                    className={`inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold rounded-xl transition-all shadow-xs cursor-pointer ${
                      hasSlides
                        ? 'bg-teal-700 hover:bg-teal-800 text-white'
                        : 'bg-teal-50 hover:bg-teal-100 text-teal-800 border border-teal-200'
                    }`}
                  >
                    <span>{hasSlides ? 'Edit Carousel' : 'Create Carousel'}</span>
                    <ChevronRight className="w-3.5 h-3.5 stroke-[2.5]" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </AdminLayout>
  );
}
