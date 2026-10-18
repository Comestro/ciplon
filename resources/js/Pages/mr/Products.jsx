import { createPortal } from 'react-dom';

// Helper to render icon for dynamic cards
const renderDynamicIcon = (iconName, className = 'w-4 h-4') => {
  switch (iconName) {
    case 'stethoscope': return <Stethoscope className={className} />;
    case 'heart-pulse': return <HeartPulse className={className} />;
    case 'clock': return <Clock className={className} />;
    case 'alert-circle': return <AlertCircle className={className} />;
    case 'package': return <Package className={className} />;
    case 'shield-check': return <ShieldCheck className={className} />;
    case 'sparkles': return <Sparkles className={className} />;
    default: return <CheckCircle2 className={className} />;
  }
};
import { useState, useEffect, useMemo } from 'react';
import { Link } from '@inertiajs/react';
import axios from 'axios';
import {
  Pill,
  Search,
  Filter,
  RefreshCw,
  Sparkles,
  Layers,
  ChevronRight,
  ChevronLeft,
  X,
  Play,
  FileText,
  ShieldCheck,
  Activity,
  CheckCircle2,
  AlertCircle,
  Eye,
  Maximize2,
  Minimize2,
  Calendar,
  Building2,
  BookOpen,
  Info,
  Check,
  Stethoscope,
  ExternalLink,
  Package,
  Sun,
  Moon,
  Clock,
  Zap,
  Award,
  HeartPulse,
  Droplets,
  CheckCheck
} from 'lucide-react';
import toast from 'react-hot-toast';
import MRLayout from '../../layouts/MR/MRLayout';

export default function Products({ initialFilters = {} }) {
  const [products, setProducts] = useState([]);
  const [meta, setMeta] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filter states
  const [search, setSearch] = useState(initialFilters.search || '');
  const [categoryFilter, setCategoryFilter] = useState(initialFilters.category || 'all');
  const [dosageFilter, setDosageFilter] = useState(initialFilters.dosage_form || 'all');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'list'

  // Detailing modal & Presentation mode state
  const [detailProduct, setDetailProduct] = useState(null);
  const [presentationMode, setPresentationMode] = useState(false);
  const [activeSlide, setActiveSlide] = useState(0);
  const [deckTheme, setDeckTheme] = useState('light');
  const [fitMode, setFitMode] = useState('full'); // 'full' or 'contain' // 'light' (matches Ciplon theme) | 'dark'

  // Fetch products from API
  const fetchProducts = async () => {
    setLoading(true);
    setError(null);
    try {
      const params = {};
      if (search.trim()) params.search = search.trim();
      if (categoryFilter !== 'all') params.category = categoryFilter;
      if (dosageFilter !== 'all') params.dosage_form = dosageFilter;

      const res = await axios.get('/api/v1/mr/products', { params });
      if (res.data?.success) {
        setProducts(res.data.data || []);
        setMeta(res.data.meta || null);
      }
    } catch (err) {
      console.error('Failed to load products:', err);
      setError('Unable to load product catalog. Please retry.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchProducts();
    }, 250);
    return () => clearTimeout(timer);
  }, [search, categoryFilter, dosageFilter]);

  // Open E-Detailing Full-Screen Mode
  const handleOpenPresentation = (prod, slideIndex = 0) => {
    setDetailProduct(prod);
    setActiveSlide(slideIndex);
    setPresentationMode(true);
  };

  // Close E-Detailing Mode

  // Native browser fullscreen toggle helper
  const handleToggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen?.().catch(() => {});
    } else {
      document.exitFullscreen?.().catch(() => {});
    }
  };

  const handleClosePresentation = () => {
    setPresentationMode(false);
  };

  // Pure image-based carousel slides uploaded by admin
  const carouselSlides = detailProduct?.slides && detailProduct.slides.length > 0 ? detailProduct.slides : [];
  const totalSlideCount = carouselSlides.length;

  const handleNextSlide = () => {
    if (activeSlide < totalSlideCount - 1) {
      setActiveSlide((prev) => prev + 1);
    }
  };

  const handlePrevSlide = () => {
    if (activeSlide > 0) {
      setActiveSlide((prev) => prev - 1);
    }
  };

  // Keyboard navigation for presentation mode
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!presentationMode) return;
      if (e.key === 'ArrowRight' || e.key === 'Space') {
        handleNextSlide();
      } else if (e.key === 'ArrowLeft') {
        handlePrevSlide();
      } else if (e.key === 'Escape') {
        handleClosePresentation();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [presentationMode, activeSlide, totalSlideCount]);

  return (
    <MRLayout title="Products & Digital Detailing Aids">
      <div className="space-y-5 max-w-7xl mx-auto pb-10 font-sans">

        {/* Top Header Card */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="text-xl font-bold text-slate-900 tracking-tight">
                Product Portfolio & E-Detailing
              </h1>
              {meta?.total !== undefined && (
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-teal-50 text-teal-800 border border-teal-200">
                  {meta.total} Formulations
                </span>
              )}
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Interactive pharmaceutical visual aids, molecule compositions, and prescribing guides for in-clinic doctor calls
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={fetchProducts}
              disabled={loading}
              className="p-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-600 transition-colors cursor-pointer"
              title="Refresh products catalog"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-teal-700' : ''}`} />
            </button>

            <Link
              href="/mr/visits"
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-teal-700 hover:bg-teal-800 text-white font-semibold text-xs transition-colors shadow-xs cursor-pointer"
            >
              <Calendar className="w-4 h-4 stroke-[2.2]" />
              <span>Field Visits</span>
            </Link>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs space-y-3">
          <div className="flex flex-col md:flex-row items-stretch md:items-center gap-2.5">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by brand name, generic molecule, indication, or composition..."
                className="w-full pl-9 pr-8 py-2 bg-slate-50 border border-slate-200 focus:border-teal-600 focus:bg-white rounded-xl text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-600/10 transition-all"
              />
              {search && (
                <button
                  type="button"
                  onClick={() => setSearch('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5 cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Category Filter */}
            <div className="w-full md:w-56">
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="w-full py-2 px-3 bg-slate-50 border border-slate-200 focus:border-teal-600 focus:bg-white rounded-xl text-xs text-slate-700 focus:outline-none cursor-pointer"
              >
                <option value="all">All Therapeutic Segments</option>
                {meta?.categories?.map((cat) => (
                  <option key={cat.id} value={cat.slug}>
                    {cat.name} ({cat.products_count ?? 0})
                  </option>
                ))}
              </select>
            </div>

            {/* Dosage Form Filter */}
            <div className="w-full md:w-44">
              <select
                value={dosageFilter}
                onChange={(e) => setDosageFilter(e.target.value)}
                className="w-full py-2 px-3 bg-slate-50 border border-slate-200 focus:border-teal-600 focus:bg-white rounded-xl text-xs text-slate-700 focus:outline-none cursor-pointer"
              >
                <option value="all">All Dosage Forms</option>
                {meta?.dosage_forms?.map((form) => (
                  <option key={form} value={form}>{form}</option>
                ))}
              </select>
            </div>

            {/* View Mode Toggle */}
            <div className="flex items-center bg-slate-100 p-1 rounded-xl self-end md:self-center shrink-0">
              <button
                type="button"
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  viewMode === 'grid' ? 'bg-white text-teal-800 shadow-xs' : 'text-slate-500 hover:text-slate-900'
                }`}
                title="Grid presentation cards"
              >
                <Layers className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => setViewMode('list')}
                className={`p-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  viewMode === 'list' ? 'bg-white text-teal-800 shadow-xs' : 'text-slate-500 hover:text-slate-900'
                }`}
                title="List view"
              >
                <BookOpen className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Content: Loading / Error / Empty / Products Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs animate-pulse space-y-3">
                <div className="h-32 bg-slate-100 rounded-xl w-full" />
                <div className="h-4 bg-slate-100 rounded w-2/3" />
                <div className="h-3 bg-slate-100 rounded w-1/2" />
                <div className="h-8 bg-slate-100 rounded w-full mt-2" />
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="bg-rose-50 border border-rose-200 rounded-2xl p-8 text-center space-y-3">
            <AlertCircle className="w-8 h-8 text-rose-600 mx-auto" />
            <h3 className="text-sm font-bold text-rose-900">{error}</h3>
            <button
              type="button"
              onClick={fetchProducts}
              className="text-xs font-semibold text-rose-700 hover:underline cursor-pointer"
            >
              Retry Loading Catalog
            </button>
          </div>
        ) : products.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200/80 p-12 text-center space-y-3 shadow-xs">
            <div className="w-14 h-14 rounded-2xl bg-teal-50 text-teal-700 flex items-center justify-center mx-auto">
              <Pill className="w-7 h-7 stroke-[1.8]" />
            </div>
            <h3 className="text-base font-bold text-slate-800">No Formulations Found</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              No products match your current search query or therapeutic category filters.
            </p>
            <button
              type="button"
              onClick={() => {
                setSearch('');
                setCategoryFilter('all');
                setDosageFilter('all');
              }}
              className="px-4 py-2 rounded-xl bg-teal-700 hover:bg-teal-800 text-white text-xs font-semibold transition-colors cursor-pointer"
            >
              Clear All Filters
            </button>
          </div>
        ) : viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {products.map((p) => {
              const primaryImg = p.primary_image?.file_path || p.images?.[0]?.file_path;

              return (
                <div
                  key={p.id}
                  className="bg-white rounded-2xl border border-slate-200/80 hover:border-teal-400 hover:shadow-sm transition-all p-5 flex flex-col justify-between gap-4 group"
                >
                  <div className="space-y-3">
                    {/* Header: Packshot & Badges */}
                    <div className="flex items-start gap-3.5">
                      <div className="w-20 h-20 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center p-2 shrink-0 overflow-hidden group-hover:scale-105 transition-transform">
                        {primaryImg ? (
                          <img
                            src={primaryImg}
                            alt={p.brand_name}
                            className="w-full h-full object-contain"
                          />
                        ) : (
                          <Pill className="w-8 h-8 text-teal-700" />
                        )}
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-1.5 flex-wrap mb-1">
                          {p.category && (
                            <span className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-slate-100 text-slate-700 border border-slate-200/60">
                              {p.category.name}
                            </span>
                          )}
                          <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                            p.prescription_type === 'Rx Only'
                              ? 'bg-purple-50 text-purple-700 border border-purple-200'
                              : 'bg-blue-50 text-blue-700 border border-blue-200'
                          }`}>
                            {p.prescription_type || 'Rx'}
                          </span>
                        </div>

                        <h3 className="text-sm font-bold text-slate-900 group-hover:text-teal-800 transition-colors truncate">
                          {p.brand_name}
                        </h3>
                        <p className="text-[11px] text-slate-500 font-medium line-clamp-1">
                          {p.generic_name}
                        </p>
                        <div className="text-[10px] text-teal-800 font-semibold mt-0.5">
                          {p.dosage_form} • {p.strength}
                        </div>
                      </div>
                    </div>

                    {/* Active Compositions */}
                    {p.compositions && p.compositions.length > 0 && (
                      <div className="pt-2 border-t border-slate-100 flex flex-wrap gap-1">
                        {p.compositions.map((c) => (
                          <span
                            key={c.id}
                            className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-medium bg-teal-50 text-teal-800 border border-teal-200/60"
                          >
                            {c.ingredient_name} ({c.strength} {c.unit})
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Indications Preview */}
                    {p.indications && (
                      <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                        <span className="font-semibold text-slate-700">Indications: </span>
                        {p.indications}
                      </p>
                    )}
                  </div>

                  {/* Actions Strip */}
                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                    <button
                      type="button"
                      onClick={() => setDetailProduct(p)}
                      className="px-3 py-1.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold transition-colors flex items-center gap-1.5 cursor-pointer"
                      title="View Prescribing Guide"
                    >
                      <Info className="w-3.5 h-3.5 text-slate-400" />
                      <span>Guide</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleOpenPresentation(p, 0)}
                      className="px-3.5 py-1.5 rounded-xl bg-teal-700 hover:bg-teal-800 text-white text-xs font-semibold shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
                      title="Open Interactive Visual Aid for Doctor Presentation"
                    >
                      <Play className="w-3.5 h-3.5 fill-current" />
                      <span>Present Visual Aid</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          /* List / Detailing Table View */
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/80 border-b border-slate-200/80 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                    <th className="py-3 px-4">Brand & Molecule</th>
                    <th className="py-3 px-4">Segment</th>
                    <th className="py-3 px-4">Dosage / Strength</th>
                    <th className="py-3 px-4">Active Compositions</th>
                    <th className="py-3 px-4 text-right">Detailing Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs">
                  {products.map((p) => (
                    <tr key={p.id} className="hover:bg-teal-50/20 transition-colors">
                      <td className="py-3 px-4">
                        <div className="font-bold text-slate-900">{p.brand_name}</div>
                        <div className="text-[11px] text-slate-500">{p.generic_name}</div>
                      </td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-slate-100 text-slate-700">
                          {p.category?.name || 'General'}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-medium text-slate-700">
                        {p.dosage_form} <span className="text-slate-400">•</span> {p.strength}
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex flex-wrap gap-1 max-w-xs">
                          {p.compositions?.slice(0, 2).map((c) => (
                            <span key={c.id} className="text-[10px] bg-teal-50 text-teal-800 px-1.5 py-0.5 rounded font-medium">
                              {c.ingredient_name}
                            </span>
                          ))}
                          {p.compositions?.length > 2 && (
                            <span className="text-[10px] text-slate-400">+{p.compositions.length - 2} more</span>
                          )}
                        </div>
                      </td>
                      <td className="py-3 px-4 text-right space-x-1.5">
                        <button
                          type="button"
                          onClick={() => setDetailProduct(p)}
                          className="px-2.5 py-1 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold cursor-pointer"
                        >
                          Guide
                        </button>
                        <button
                          type="button"
                          onClick={() => handleOpenPresentation(p, 0)}
                          className="px-3 py-1 rounded-lg bg-teal-700 hover:bg-teal-800 text-white text-xs font-semibold shadow-xs cursor-pointer inline-flex items-center gap-1"
                        >
                          <Play className="w-3 h-3 fill-current" />
                          <span>Present</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

      </div>

      {/* Slide-out Prescribing Guide Drawer */}
      {detailProduct && !presentationMode && (
        <div className="fixed inset-0 z-50 flex items-center justify-end bg-slate-900/40 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white h-full w-full max-w-lg shadow-2xl p-6 overflow-y-auto space-y-5 animate-in slide-in-from-right duration-200">
            <div className="flex items-start justify-between border-b border-slate-100 pb-4">
              <div>
                <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-teal-50 text-teal-800 border border-teal-200">
                  {detailProduct.category?.name || 'Therapeutic Portfolio'}
                </span>
                <h2 className="text-lg font-bold text-slate-900 mt-1">{detailProduct.brand_name}</h2>
                <p className="text-xs text-slate-500 font-medium">{detailProduct.generic_name}</p>
              </div>
              <button
                type="button"
                onClick={() => setDetailProduct(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Compositions Card */}
            {detailProduct.compositions && detailProduct.compositions.length > 0 && (
              <div className="bg-slate-50 rounded-xl p-4 border border-slate-200/80 space-y-2">
                <h4 className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                  <Pill className="w-3.5 h-3.5 text-teal-700" />
                  <span>Active Pharmaceutical Ingredients (API)</span>
                </h4>
                <div className="divide-y divide-slate-200/60 text-xs">
                  {detailProduct.compositions.map((c) => (
                    <div key={c.id} className="py-1.5 flex items-center justify-between">
                      <span className="font-semibold text-slate-800">{c.ingredient_name}</span>
                      <span className="font-bold text-teal-800 bg-white px-2 py-0.5 rounded border border-slate-200 text-[11px]">
                        {c.strength} {c.unit}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Indications & Therapeutic Usage */}
            {detailProduct.indications && (
              <div className="space-y-1.5">
                <h4 className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                  <Stethoscope className="w-3.5 h-3.5 text-teal-700" />
                  <span>Therapeutic Indications</span>
                </h4>
                <p className="text-xs text-slate-600 bg-teal-50/40 p-3 rounded-xl border border-teal-100 leading-relaxed">
                  {detailProduct.indications}
                </p>
              </div>
            )}

            {/* Dosage & Administration */}
            {detailProduct.directions && (
              <div className="space-y-1.5">
                <h4 className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-teal-700" />
                  <span>Dosage & Directions for Use</span>
                </h4>
                <p className="text-xs text-slate-600 p-3 rounded-xl bg-slate-50 border border-slate-200 leading-relaxed">
                  {detailProduct.directions}
                </p>
              </div>
            )}

            {/* Precautions */}
            {detailProduct.precautions && (
              <div className="space-y-1.5">
                <h4 className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                  <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
                  <span>Precautions & Contraindications</span>
                </h4>
                <p className="text-xs text-slate-600 p-3 rounded-xl bg-amber-50/50 border border-amber-200/60 leading-relaxed">
                  {detailProduct.precautions}
                </p>
              </div>
            )}

            {/* Storage */}
            {detailProduct.storage && (
              <div className="text-xs text-slate-500 pt-2 border-t border-slate-100">
                <span className="font-semibold text-slate-700">Storage Guidelines: </span>
                {detailProduct.storage}
              </div>
            )}

            {/* Bottom Launch Button */}
            <div className="pt-4 border-t border-slate-200 flex items-center gap-2">
              <button
                type="button"
                onClick={() => handleOpenPresentation(detailProduct, 0)}
                className="flex-1 py-2.5 rounded-xl bg-teal-700 hover:bg-teal-800 text-white font-semibold text-xs shadow-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                <Play className="w-4 h-4 fill-current" />
                <span>Launch Visual Aid Presentation</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* PURE IMMERSIVE FULL-SCREEN VISUAL AID CAROUSEL (NO HEADER / NO TASKBAR) */}
      {presentationMode && detailProduct && typeof document !== 'undefined' && createPortal(
        <div
          className="fixed inset-0 z-[999999] w-screen h-screen bg-black select-none overflow-hidden flex items-center justify-center animate-in fade-in duration-200"
          tabIndex={0}
        >
          {/* Top-Right: Floating Minimal Controls (Fullscreen & Close) */}
          <div className="absolute top-4 right-4 z-50 flex items-center gap-2">
            <button
              type="button"
              onClick={handleToggleFullscreen}
              className="w-10 h-10 rounded-full bg-black/60 hover:bg-black/90 text-white/80 hover:text-white backdrop-blur-md border border-white/20 flex items-center justify-center transition-all cursor-pointer shadow-2xl active:scale-95"
              title="Toggle Fullscreen"
            >
              <Maximize2 className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={handleClosePresentation}
              className="w-10 h-10 rounded-full bg-black/60 hover:bg-rose-600 text-white/80 hover:text-white backdrop-blur-md border border-white/20 flex items-center justify-center transition-all cursor-pointer shadow-2xl active:scale-95"
              title="Exit Presentation (Esc)"
            >
              <X className="w-5 h-5 stroke-[2.5]" />
            </button>
          </div>

          {/* Top-Left: Floating Slide Counter Badge */}
          {totalSlideCount > 0 && (
            <div className="absolute top-4 left-4 z-50 pointer-events-none">
              <div className="px-3.5 py-1.5 rounded-full bg-black/65 backdrop-blur-md border border-white/20 text-white text-xs font-bold shadow-2xl flex items-center gap-2">
                <span className="text-teal-400">{activeSlide + 1} / {totalSlideCount}</span>
                <span className="text-white/40">•</span>
                <span className="text-slate-200 max-w-xs truncate">{detailProduct.brand_name}</span>
              </div>
            </div>
          )}

          {/* Main Immersive Slide Image Stage - 100% Full Width & Height */}
          <div
            className="w-full h-full flex items-center justify-center relative cursor-default"
            onClick={(e) => {
              // Click right half for next slide, click left half for previous slide
              const rect = e.currentTarget.getBoundingClientRect();
              const clickX = e.clientX - rect.left;
              if (clickX > rect.width * 0.6) {
                handleNextSlide();
              } else if (clickX < rect.width * 0.4) {
                handlePrevSlide();
              }
            }}
          >
            {totalSlideCount === 0 ? (
              <div className="text-center text-white space-y-3 p-8 max-w-md bg-slate-900/90 rounded-3xl border border-white/10 shadow-2xl">
                <ImageIcon className="w-12 h-12 text-teal-400 mx-auto" />
                <h3 className="text-lg font-bold text-white">No Slide Images Uploaded</h3>
                <p className="text-xs text-slate-400">
                  Please upload slide images in Admin &gt; Visual Aid Carousels.
                </p>
                <button
                  type="button"
                  onClick={handleClosePresentation}
                  className="px-5 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold transition-colors cursor-pointer"
                >
                  Close
                </button>
              </div>
            ) : (
              <img
                key={activeSlide}
                src={carouselSlides[activeSlide]?.image_path}
                alt={carouselSlides[activeSlide]?.title || `Slide ${activeSlide + 1}`}
                className="w-full h-full object-contain select-none transition-all duration-150 animate-in fade-in"
              />
            )}
          </div>

          {/* Left Floating Chevron (Previous) */}
          {activeSlide > 0 && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handlePrevSlide();
              }}
              className="absolute left-4 top-1/2 -translate-y-1/2 z-40 w-14 h-14 rounded-full bg-black/60 hover:bg-teal-600 text-white/80 hover:text-white backdrop-blur-md border border-white/20 flex items-center justify-center transition-all hover:scale-110 active:scale-95 cursor-pointer shadow-2xl group"
              title="Previous Slide (← Left Arrow)"
            >
              <ChevronLeft className="w-8 h-8 stroke-[2.5] group-hover:-translate-x-0.5 transition-transform" />
            </button>
          )}

          {/* Right Floating Chevron (Next) */}
          {activeSlide < totalSlideCount - 1 && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handleNextSlide();
              }}
              className="absolute right-4 top-1/2 -translate-y-1/2 z-40 w-14 h-14 rounded-full bg-black/60 hover:bg-teal-600 text-white/80 hover:text-white backdrop-blur-md border border-white/20 flex items-center justify-center transition-all hover:scale-110 active:scale-95 cursor-pointer shadow-2xl group"
              title="Next Slide (→ Right Arrow or Space)"
            >
              <ChevronRight className="w-8 h-8 stroke-[2.5] group-hover:translate-x-0.5 transition-transform" />
            </button>
          )}

          {/* Minimal Bottom Subtle Dots Indicator */}
          {totalSlideCount > 1 && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-40 px-3 py-1.5 rounded-full bg-black/60 backdrop-blur-md border border-white/15 flex items-center gap-1.5 shadow-2xl">
              {carouselSlides.map((_, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveSlide(idx);
                  }}
                  className={`transition-all rounded-full cursor-pointer ${
                    activeSlide === idx
                      ? 'w-6 h-2 bg-teal-400'
                      : 'w-2 h-2 bg-white/40 hover:bg-white/80'
                  }`}
                  title={`Jump to Slide ${idx + 1}`}
                />
              ))}
            </div>
          )}
        </div>,
        document.body
      )}
    </MRLayout>
  );
}