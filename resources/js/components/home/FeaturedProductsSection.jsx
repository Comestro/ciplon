import { useState, useMemo } from 'react';
import { Link } from '@inertiajs/react';
import { ArrowRight, ShieldCheck, Pill, Eye, Sparkles } from 'lucide-react';
import Container from '../common/Container';

export default function FeaturedProductsSection({ products = [], onOpenEnquiryModal }) {
  const [selectedFilter, setSelectedFilter] = useState('ALL');

  // Database products formatted for grid display
  const formattedItems = useMemo(() => {
    return (products || []).map((p, index) => {
      // Pick fallback or image path
      const imagePath =
        p.primary_image?.file_path
          ? (p.primary_image.file_path.startsWith('/') ? p.primary_image.file_path : `/${p.primary_image.file_path}`)
          : (p.primaryImage?.file_path
              ? (p.primaryImage.file_path.startsWith('/') ? p.primaryImage.file_path : `/${p.primaryImage.file_path}`)
              : (p.imageUrl || p.image_url || p.primary_image?.url || p.primaryImage?.url || '/images/pharma_product_boxes.jpg'));

      return {
        id: p.id || p.slug || index,
        slug: p.slug || p.id,
        name: p.brand_name || p.name || 'Ciplon Formulation',
        image: imagePath,
        category: p.category?.name || 'Formulations',
        generic: p.generic_name || p.composition || 'Therapeutic formulation',
        dosageForm: p.dosage_form || 'Tablet / Capsule',
        strength: p.strength || 'Standard Dosage',
        description: p.short_description || p.description || 'WHO-GMP validated finished formulation.',
        isDatabase: true,
      };
    });
  }, [products]);

  // Unique categories for pills derived strictly from products
  const categoriesList = useMemo(() => {
    const set = new Set(['ALL']);
    (products || []).forEach((p) => {
      if (p.category?.name) set.add(p.category.name);
    });
    return Array.from(set);
  }, [products]);

  // Display items based on category filter
  const displayedItems = useMemo(() => {
    if (selectedFilter === 'ALL') {
      return formattedItems;
    }
    return formattedItems.filter((item) => item.category === selectedFilter);
  }, [formattedItems, selectedFilter]);

  return (
    <section id="products" className="py-16 sm:py-24 bg-white border-b border-slate-100">
      <Container>
        {/* Section Header matching Intas: Bold Title + Accent Line */}
        <div className="text-center mb-10 sm:mb-12">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-[#0c2340] uppercase">
            FEATURED PRODUCTS
          </h2>
          <div className="w-20 h-1 bg-gradient-to-r from-[#c59324] to-[#dfad36] mx-auto mt-2 rounded-full" />
          <p className="text-xs sm:text-sm text-slate-500 max-w-xl mx-auto mt-3">
            High-purity plasma therapeutics and finished formulations manufactured under strict WHO-GMP compliance.
          </p>
        </div>

        {/* Category Filter Pills (Flat & Clean, No Shadows) */}
        <div className="flex items-center justify-center gap-2 overflow-x-auto pb-2 mb-10 no-scrollbar">
          {categoriesList.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedFilter(cat)}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
                selectedFilter === cat
                  ? 'bg-[#0c2340] text-white border border-[#0c2340]'
                  : 'bg-white text-slate-600 hover:text-[#c59324] hover:border-[#c59324] border border-slate-200'
              }`}
            >
              {cat === 'ALL' ? 'All Formulations' : cat}
            </button>
          ))}
        </div>

        {/* Product Cards Grid: Professional, Elevated Pharma Presentation */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 max-w-6xl mx-auto items-stretch">
          {displayedItems.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-2xl border border-slate-200/90 hover:border-[#c59324] hover:shadow-lg hover:shadow-slate-200/50 transition-all duration-300 flex flex-col justify-between group overflow-hidden"
            >
              <div className="p-6 pb-2">
                {/* Top Subtle Tags */}
                <div className="flex items-center justify-between gap-2 pb-3.5 border-b border-slate-100 text-xs">
                  <span className="font-bold text-[#c59324] uppercase tracking-wider text-[11px] truncate">
                    {item.category}
                  </span>
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 font-semibold text-[10px] uppercase tracking-wider shrink-0">
                    {item.dosageForm}
                  </span>
                </div>

                {/* Seamless White Product Visual with gentle podium gradient */}
                <Link
                  href={`/products/${item.slug || item.id}`}
                  className="w-full h-56 sm:h-60 flex items-center justify-center p-4 my-2 bg-gradient-to-b from-slate-50/50 via-white to-slate-50/30 rounded-xl block relative overflow-hidden"
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    className="max-h-full max-w-full object-contain filter drop-shadow-sm transition-transform duration-300 group-hover:scale-105"
                  />
                </Link>

                {/* Product Name & Molecule with fixed minimum heights for alignment */}
                <div className="space-y-1.5 pt-2">
                  <Link
                    href={`/products/${item.slug || item.id}`}
                    className="text-lg sm:text-xl font-bold text-[#0c2340] group-hover:text-[#c59324] transition-colors block leading-tight tracking-tight line-clamp-1"
                    title={item.name}
                  >
                    {item.name}
                  </Link>

                  <p className="text-xs font-medium text-slate-600 leading-snug line-clamp-2 min-h-[2.5rem]">
                    {item.generic}
                  </p>
                </div>

                {/* Minimal Specifications Bar */}
                <div className="flex items-center justify-between text-xs py-2.5 px-3 my-3 bg-slate-50/80 rounded-xl border border-slate-100">
                  <div className="flex items-center gap-1.5 min-w-0 pr-2">
                    <span className="text-slate-400 font-medium text-[11px] shrink-0">Strength:</span>
                    <span className="font-semibold text-[#0c2340] text-[11px] truncate" title={item.strength}>
                      {item.strength}
                    </span>
                  </div>
                  <div className="flex items-center gap-1 text-emerald-700 font-semibold text-[11px] shrink-0 bg-emerald-50/80 px-2 py-0.5 rounded-md border border-emerald-100">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                    <span>WHO-GMP</span>
                  </div>
                </div>

                {/* Description with fixed 2-line clamp */}
                <p className="text-xs text-slate-500 leading-relaxed line-clamp-2 min-h-[2rem]">
                  {item.description}
                </p>
              </div>

              {/* Action Buttons: Clean & Elegant */}
              <div className="p-6 pt-3 mt-2 border-t border-slate-100 flex items-center gap-2.5 bg-slate-50/30">
                <Link
                  href={`/products/${item.slug || item.id}`}
                  className="flex-1 py-2.5 rounded-xl border border-slate-200 hover:border-[#c59324] hover:text-[#c59324] text-slate-700 text-center font-semibold text-xs transition-colors bg-white shadow-xs"
                >
                  Monograph
                </Link>

                <button
                  type="button"
                  onClick={() => {
                    if (typeof onOpenEnquiryModal === 'function') {
                      onOpenEnquiryModal();
                    }
                  }}
                  className="flex-1 py-2.5 rounded-xl bg-[#0c2340] hover:bg-[#c59324] text-white text-center font-semibold text-xs transition-colors cursor-pointer shadow-xs"
                >
                  Enquire Supply
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Global CTA Bar: Flat, Simple & Elegant (No Shadows) */}
        <div className="mt-12 sm:mt-14 text-center">
          <Link
            href="/products"
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-[#0c2340] hover:bg-[#c59324] text-white font-semibold text-xs sm:text-sm tracking-wider uppercase transition-colors cursor-pointer"
          >
            <span>Explore All Formulations</span>
            <ArrowRight className="w-4 h-4 text-[#dfad36]" />
          </Link>
        </div>
      </Container>
    </section>
  );
}
