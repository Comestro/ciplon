import { useState, useMemo } from 'react';
import { Link } from '@inertiajs/react';
import { ArrowRight, Sparkles, Filter, FileText } from 'lucide-react';
import Container from '../common/Container';
import SectionHeading from '../common/SectionHeading';
import ProductCard from './ProductCard';
import Button from '../common/Button';

export default function FeaturedProducts({ products = [] }) {
  const [selectedCategory, setSelectedCategory] = useState('ALL');

  // Extract unique categories from products
  const categoryFilters = useMemo(() => {
    if (!Array.isArray(products)) return ['ALL'];
    const names = new Set();
    products.forEach((p) => {
      const cat = p.category?.name || p.therapeuticArea;
      if (cat) names.add(cat);
    });
    return ['ALL', ...Array.from(names).slice(0, 5)];
  }, [products]);

  // Filter and prioritize featured products
  const displayedProducts = useMemo(() => {
    if (!Array.isArray(products)) return [];

    let filtered = products;
    if (selectedCategory !== 'ALL') {
      filtered = products.filter((p) => {
        const cat = p.category?.name || p.therapeuticArea;
        return cat === selectedCategory;
      });
    }

    const isFeatured = (p) => Boolean(
      p?.is_featured === true ||
      p?.is_featured === 1 ||
      p?.is_featured === '1' ||
      p?.featured === true ||
      p?.badge
    );

    const sorted = [...filtered].sort((a, b) => {
      const aFeat = isFeatured(a) ? 1 : 0;
      const bFeat = isFeatured(b) ? 1 : 0;
      if (bFeat !== aFeat) return bFeat - aFeat;
      const aId = Number(a?.id) || 0;
      const bId = Number(b?.id) || 0;
      return bId - aId;
    });

    return sorted.slice(0, 6);
  }, [products, selectedCategory]);

  return (
    <section id="products" className="py-14 lg:py-20 bg-white border-b border-slate-200/80">
      <Container>
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-50 border border-teal-200/80 text-[11px] font-bold text-teal-800 uppercase tracking-wider mb-2.5">
              <Sparkles className="w-3.5 h-3.5 text-teal-600" />
              <span>Pharmaceutical Formulations</span>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#0c2340] tracking-tight">
              Featured Formulations Portfolio
            </h2>
            <p className="text-sm sm:text-base text-slate-600 mt-2 max-w-2xl">
              Manufactured with USP/BP pharmacopoeial grade active APIs and validated excipient matrices for guaranteed bioavailability and clinical efficacy.
            </p>
          </div>

          <Link
            href="/products"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-teal-700 hover:bg-teal-800 text-white font-semibold text-xs sm:text-sm transition-all hover:gap-3 cursor-pointer shrink-0 shadow-xs"
          >
            <span>Explore Full Catalog</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Category Pills Filter */}
        {categoryFilters.length > 2 && (
          <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-6 no-scrollbar">
            <span className="text-xs font-semibold text-slate-400 flex items-center gap-1 shrink-0 mr-1">
              <Filter className="w-3.5 h-3.5" />
              <span>Filter:</span>
            </span>
            {categoryFilters.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-teal-700 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200/80 hover:text-slate-900'
                }`}
              >
                {cat === 'ALL' ? 'All Segments' : cat}
              </button>
            ))}
          </div>
        )}

        {displayedProducts.length === 0 ? (
          <div className="py-14 text-center rounded-2xl bg-slate-50 border border-slate-200 text-slate-500 text-sm">
            No formulations found for the selected segment.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
            {displayedProducts.map((product) => (
              <ProductCard
                key={product.id || product.product_code || product.brand_name}
                product={product}
              />
            ))}
          </div>
        )}

        {/* Regulatory Technical Dossier Banner - Light Theme */}
        <div className="mt-12 p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-slate-50 via-teal-50/20 to-slate-50 border border-slate-200 text-slate-900 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xs">
          <div className="space-y-1.5 text-center md:text-left">
            <span className="inline-flex items-center gap-1 text-xs font-bold text-teal-800 uppercase tracking-widest bg-teal-100/70 px-2.5 py-0.5 rounded-md">
              <FileText className="w-3.5 h-3.5 text-teal-700" />
              <span>Institutional & Regulatory Affiliation</span>
            </span>
            <h3 className="text-lg sm:text-xl font-bold text-slate-900">
              Need Product Dossiers (CTD/eCTD) or Government Tender Bids?
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 max-w-2xl font-normal leading-relaxed">
              Our regulatory affairs division provides comprehensive technical documentation, stability data, bioequivalence summaries, and batch Certificates of Analysis (COA).
            </p>
          </div>
          <div className="shrink-0">
            <a
              href="#contact"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-teal-700 hover:bg-teal-800 text-white font-bold text-xs sm:text-sm transition-all cursor-pointer shadow-xs"
            >
              <span>Contact Regulatory Affairs</span>
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        </div>
      </Container>
    </section>
  );
}
