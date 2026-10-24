import { useState, useEffect } from 'react';
import { Link } from '@inertiajs/react';
import axios from 'axios';
import {
  Pill,
  RefreshCw,
  AlertCircle,
  Calendar,
  Presentation,
  LayoutGrid,
  List
} from 'lucide-react';
import MRLayout from '../../layouts/MR/MRLayout';
import SearchBar from '../../components/common/SearchBar';

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

  return (
    <MRLayout title="Products & Formulations">
      <div className="space-y-5 max-w-7xl mx-auto pb-10 font-sans">

        {/* Top Header Card */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="text-xl font-bold text-slate-900 tracking-tight">
                Product Portfolio & Detailing
              </h1>
              {meta?.total !== undefined && (
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-800 border border-slate-200/80">
                  {meta.total} Formulations
                </span>
              )}
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Pharmaceutical formulations, molecule compositions, and prescribing guides for in-clinic doctor calls
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={fetchProducts}
              disabled={loading}
              className="p-2 rounded-xl border border-slate-200/80 hover:bg-slate-50 text-slate-600 transition-colors cursor-pointer"
              title="Refresh products catalog"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-slate-900' : ''}`} />
            </button>

            <Link
              href="/mr/detailing"
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-xs border border-slate-200/80 transition-colors cursor-pointer"
              title="Launch Doctor E-Detailing Interactive Slide Show"
            >
              <Presentation className="w-4 h-4 stroke-[2]" />
              <span>Doctor E-Detailing</span>
            </Link>

            <Link
              href="/mr/visits"
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-medium text-xs transition-colors shadow-xs cursor-pointer"
            >
              <Calendar className="w-4 h-4 stroke-[2]" />
              <span>Field Visits</span>
            </Link>
          </div>
        </div>

        {/* Filter Controls Bar */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
          <div className="flex-1 max-w-md">
            <SearchBar
              value={search}
              onChange={setSearch}
              placeholder="Search brand, generic molecule, composition..."
            />
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {/* Category Filter */}
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-3 py-2 text-xs font-medium rounded-xl border border-slate-200 bg-slate-50 text-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-900 transition-all cursor-pointer"
            >
              <option value="all">All Categories</option>
              {meta?.categories?.map((c) => (
                <option key={c.id} value={c.slug}>
                  {c.name}
                </option>
              ))}
            </select>

            {/* Dosage Form Filter */}
            <select
              value={dosageFilter}
              onChange={(e) => setDosageFilter(e.target.value)}
              className="px-3 py-2 text-xs font-medium rounded-xl border border-slate-200 bg-slate-50 text-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-900 transition-all cursor-pointer"
            >
              <option value="all">All Dosage Forms</option>
              {meta?.dosage_forms?.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>

            {/* View Mode Toggle: Grid / Table */}
            <div className="flex items-center bg-slate-100 p-0.5 rounded-xl border border-slate-200/60">
              <button
                type="button"
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                  viewMode === 'grid'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
                title="Grid cards view"
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => setViewMode('list')}
                className={`p-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                  viewMode === 'list'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
                title="Table view"
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Content State: Loading, Error, Empty or List */}
        {loading && products.length === 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <div key={n} className="bg-white rounded-2xl border border-slate-200/80 p-5 space-y-4 animate-pulse">
                <div className="flex gap-3">
                  <div className="w-20 h-20 bg-slate-100 rounded-xl" />
                  <div className="flex-1 space-y-2">
                    <div className="h-3 bg-slate-100 rounded w-1/3" />
                    <div className="h-4 bg-slate-100 rounded w-3/4" />
                    <div className="h-3 bg-slate-100 rounded w-1/2" />
                  </div>
                </div>
                <div className="h-3 bg-slate-100 rounded w-full" />
                <div className="h-3 bg-slate-100 rounded w-5/6" />
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
            <div className="w-14 h-14 rounded-2xl bg-slate-100 text-slate-700 flex items-center justify-center mx-auto">
              <Pill className="w-7 h-7 stroke-[1.8]" />
            </div>
            <h3 className="text-base font-bold text-slate-900">No Formulations Found</h3>
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
              className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-medium transition-colors cursor-pointer"
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
                  className="bg-white rounded-2xl border border-slate-200/80 hover:border-slate-300 hover:shadow-xs transition-all p-5 flex flex-col justify-between gap-4 group"
                >
                  <div className="space-y-3">
                    {/* Header: Packshot & Badges */}
                    <div className="flex items-start gap-3.5">
                      <div className="w-20 h-20 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center p-2 shrink-0 overflow-hidden group-hover:scale-102 transition-transform">
                        {primaryImg ? (
                          <img
                            src={primaryImg}
                            alt={p.brand_name}
                            className="w-full h-full object-contain"
                          />
                        ) : (
                          <Pill className="w-8 h-8 text-slate-400" />
                        )}
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-1.5 flex-wrap mb-1">
                          {p.category && (
                            <span className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-slate-100 text-slate-700 border border-slate-200/60">
                              {p.category.name}
                            </span>
                          )}
                          <span className={`px-2 py-0.5 rounded-md text-[10px] font-semibold ${
                            p.prescription_type === 'Rx Only'
                              ? 'bg-slate-100 text-slate-800 border border-slate-200/80'
                              : 'bg-slate-50 text-slate-600 border border-slate-200/60'
                          }`}>
                            {p.prescription_type || 'Rx'}
                          </span>
                        </div>

                        <h3 className="text-sm font-bold text-slate-900 group-hover:text-slate-700 transition-colors truncate">
                          {p.brand_name}
                        </h3>
                        <p className="text-[11px] text-slate-500 font-medium line-clamp-1">
                          {p.generic_name}
                        </p>
                        <div className="text-[10px] text-slate-600 font-medium mt-0.5">
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
                            className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-medium bg-slate-50 text-slate-700 border border-slate-200/60"
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
                </div>
              );
            })}
          </div>
        ) : (
          /* Table View */
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/80 border-b border-slate-200/80 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                    <th className="py-3 px-4">Brand & Molecule</th>
                    <th className="py-3 px-4">Segment</th>
                    <th className="py-3 px-4">Dosage / Strength</th>
                    <th className="py-3 px-4">Active Compositions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs">
                  {products.map((p) => (
                    <tr key={p.id} className="hover:bg-slate-50/60 transition-colors">
                      <td className="py-3 px-4">
                        <div className="font-bold text-slate-900">{p.brand_name}</div>
                        <div className="text-[11px] text-slate-500">{p.generic_name}</div>
                      </td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-slate-100 text-slate-700 border border-slate-200/60">
                          {p.category?.name || 'General'}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-medium text-slate-700">
                        {p.dosage_form} <span className="text-slate-400">•</span> {p.strength}
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex flex-wrap gap-1 max-w-xs">
                          {p.compositions?.slice(0, 2).map((c) => (
                            <span key={c.id} className="text-[10px] bg-slate-100 text-slate-700 px-1.5 py-0.5 rounded font-medium border border-slate-200/60">
                              {c.ingredient_name}
                            </span>
                          ))}
                          {p.compositions?.length > 2 && (
                            <span className="text-[10px] text-slate-400">+{p.compositions.length - 2} more</span>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

      </div>
    </MRLayout>
  );
}