// Products catalog page with slim category filter navbar and streamlined product grid
import { useMemo } from 'react';
import { router } from '@inertiajs/react';
import { Pill, RefreshCw } from 'lucide-react';
import PublicLayout from '../../layouts/PublicLayout';
import Container from '../../components/common/Container';
import ProductCard from '../../components/home/ProductCard';

export default function ProductsPage({ products = [], categories = [], filters = {} }) {
  const searchQuery = filters.search || '';
  const selectedCategory = filters.category || 'All';

  // Sync category selection via Inertia GET
  const handleCategorySelect = (category) => {
    const params = {};
    if (searchQuery.trim()) {
      params.search = searchQuery.trim();
    }
    if (category !== 'All') {
      params.category = category;
    }
    router.get('/products', params, { preserveState: true });
  };

  // Reset search and category filters
  const handleResetFilters = () => {
    router.get('/products', {}, { preserveState: true });
  };

  // Safely extract category names list
  const availableCategories = useMemo(() => {
    const list = ['All'];

    if (Array.isArray(categories)) {
      categories.forEach((cat) => {
        const name = typeof cat === 'object' && cat?.name ? cat.name : cat;
        if (name && name !== 'All' && !list.includes(name)) {
          list.push(name);
        }
      });
    }

    if (Array.isArray(products)) {
      products.forEach((p) => {
        const catName = typeof p.category === 'object' && p.category?.name
          ? p.category.name
          : (typeof p.category === 'string' ? p.category : p.therapeuticArea);
        if (catName && !list.includes(catName)) {
          list.push(catName);
        }
      });
    }

    return list;
  }, [categories, products]);

  // Filter products by search query and category (or trust backend filter)
  const filteredProducts = useMemo(() => {
    if (!Array.isArray(products)) {
      return [];
    }

    return products.filter((p) => {
      if (!p) return false;

      // Category matching
      if (selectedCategory !== 'All') {
        const catName = typeof p.category === 'object' && p.category?.name
          ? p.category.name
          : (typeof p.category === 'string' ? p.category : p.therapeuticArea || '');
        if (catName.toLowerCase() !== selectedCategory.toLowerCase()) {
          return false;
        }
      }

      // Search keyword matching
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const brand = (p.brand_name || p.brandName || '').toLowerCase();
        const generic = (p.generic_name || p.genericName || '').toLowerCase();
        const code = (p.product_code || p.productCode || '').toLowerCase();
        const desc = (p.description || p.short_description || '').toLowerCase();

        return brand.includes(q) || generic.includes(q) || code.includes(q) || desc.includes(q);
      }

      return true;
    });
  }, [products, selectedCategory, searchQuery]);

  const hasActiveFilters = searchQuery.trim() !== '' || selectedCategory !== 'All';

  return (
    <PublicLayout categories={categories}>
      <div className="min-h-screen bg-slate-50/60 pb-16">
        {/* Hero Header matching Home Page Corporate Theme */}
        <div className="bg-[#0c2340] text-white py-10 sm:py-12 border-b border-[#c59324]/40 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-[#0c2340] via-[#091b30] to-[#05101d] pointer-events-none" />
          <Container className="relative z-10">
            <div className="max-w-3xl">
              <span className="text-[11px] font-bold text-[#dfad36] uppercase tracking-widest block mb-1.5">
                Therapeutic Portfolio & Catalog
              </span>
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-white uppercase">
                Finished Pharmaceutical Formulations
              </h1>
              <div className="w-16 h-1 bg-gradient-to-r from-[#c59324] to-[#dfad36] mt-2 mb-2.5 rounded-full" />
              <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
                WHO-GMP validated finished oral solids, injectables, lyophilized vials, and plasma therapeutics produced under stringent pharmacopoeial quality control.
              </p>
            </div>
          </Container>
        </div>

        {/* Category Pills Navigation Bar */}
        <div className="sticky top-[68px] sm:top-[76px] z-30 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
          <Container>
            <div className="flex items-center justify-between gap-4 py-2.5 sm:py-3">
              <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-0.5">
                {availableCategories.map((cat) => {
                  const isSelected = selectedCategory.toLowerCase() === cat.toLowerCase();
                  return (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => handleCategorySelect(cat)}
                      className={`px-4 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all duration-200 cursor-pointer ${
                        isSelected
                          ? 'bg-[#0c2340] text-white border border-[#c59324] shadow-xs'
                          : 'bg-slate-100 text-slate-700 hover:text-[#c59324] hover:bg-amber-50/60 border border-slate-200/80'
                      }`}
                    >
                      {cat === 'All' ? 'All Formulations' : cat}
                    </button>
                  );
                })}
              </div>
            </div>
          </Container>
        </div>

        <Container className="pt-6 sm:pt-8">
          {hasActiveFilters && (
            <div className="mb-6 flex items-center justify-between gap-3 text-xs text-slate-700 bg-white rounded-2xl px-4 py-2.5 border border-slate-200/80 shadow-xs">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-slate-500">Showing formulations for:</span>
                {selectedCategory !== 'All' && (
                  <span className="font-semibold text-[#0c2340] bg-amber-50 border border-amber-200/70 px-2.5 py-0.5 rounded-lg">
                    {selectedCategory}
                  </span>
                )}
                {searchQuery.trim() && (
                  <span className="font-semibold text-slate-800 bg-slate-100 px-2.5 py-0.5 rounded-lg border border-slate-200">
                    "{searchQuery.trim()}"
                  </span>
                )}
              </div>
              <button
                type="button"
                onClick={handleResetFilters}
                className="text-[#c59324] hover:text-[#9f6d0f] font-semibold cursor-pointer shrink-0 inline-flex items-center gap-1.5"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Reset Filters</span>
              </button>
            </div>
          )}

          {filteredProducts.length === 0 ? (
            <div className="bg-white rounded-3xl border border-slate-200/80 p-10 sm:p-14 text-center max-w-lg mx-auto space-y-4 my-8 shadow-xs">
              <div className="w-14 h-14 rounded-2xl bg-amber-50 border border-amber-200/60 flex items-center justify-center mx-auto text-[#c59324]">
                <Pill className="w-7 h-7 stroke-[2]" />
              </div>
              <h3 className="text-lg font-bold text-[#0c2340]">
                No Formulations Found
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                No products match your current search query or category filter. Try searching for other molecules or reset filters.
              </p>
              <div className="pt-2">
                <button
                  type="button"
                  onClick={handleResetFilters}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#0c2340] hover:bg-[#c59324] text-white text-xs font-bold transition-colors cursor-pointer shadow-xs"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Reset All Filters</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {filteredProducts.map((product) => (
                <ProductCard
                  key={product.id || product.product_code || product.brand_name}
                  product={product}
                />
              ))}
            </div>
          )}
        </Container>
      </div>
    </PublicLayout>
  );
}
