import { useState, useMemo } from 'react';
import { Link } from '@inertiajs/react';
import { ArrowRight, ShieldCheck, Pill, Eye, Sparkles } from 'lucide-react';
import Container from '../common/Container';

export default function FeaturedProductsSection({ products = [], onOpenEnquiryModal }) {
  const [selectedFilter, setSelectedFilter] = useState('ALL');

  // Photorealistic 3D pharmaceutical product cartons matching Intas showcase
  const primaryFeaturedBoxes = [
    {
      id: 'globucel-sc',
      name: 'Globucel-SC',
      image: '/images/box_globucel_sc.jpg',
      category: 'Plasma & Biologics',
      generic: 'Human Normal Immunoglobulin IP 16.5%',
      dosageForm: 'Subcutaneous Injectable',
      strength: '5 g / 30.3 mL',
      description: 'Ultra-purified human normal immunoglobulin solution indicated for primary immunodeficiency and autoimmune polyneuropathy.',
    },
    {
      id: 'fibrogen-i',
      name: 'Fibrogen-I',
      image: '/images/box_fibrogen_i.jpg',
      category: 'Plasma & Biologics',
      generic: 'Human Fibrinogen EP 1g',
      dosageForm: 'Lyophilized Infusion Vial',
      strength: '1g Active Protein',
      description: 'Sterile human fibrinogen concentrate for immediate therapeutic hemostasis and congenital fibrinogen deficiency management.',
    },
    {
      id: 'factocel-ix',
      name: 'Factocel-IX',
      image: '/images/box_factocel_ix.jpg',
      category: 'Plasma & Biologics',
      generic: 'Human Coagulation Factor IX IP 600 IU',
      dosageForm: 'Lyophilized Powder for Injection',
      strength: '600 IU / 5 mL',
      description: 'High-purity human coagulation factor IX concentrate for targeted prophylaxis and therapy in patients with Hemophilia B.',
    },
  ];

  // Database products formatted for grid display if filtered
  const dbFormattedItems = useMemo(() => {
    return (products || []).map((p, index) => {
      // Pick fallback 3D packaging image if database product doesn't have custom image
      const fallbackImages = [
        '/images/box_globucel_sc.jpg',
        '/images/box_fibrogen_i.jpg',
        '/images/box_factocel_ix.jpg',
        '/images/pharma_product_boxes.jpg',
      ];
      const imageUrl =
        p.imageUrl ||
        p.image_url ||
        p.primaryImage?.url ||
        p.primary_image?.url ||
        fallbackImages[index % fallbackImages.length];

      return {
        id: p.id || p.slug || index,
        name: p.brand_name || p.name || 'Ciplon Formulation',
        image: imageUrl,
        category: p.category?.name || 'Oral Solids',
        generic: p.generic_name || p.composition || 'Therapeutic formulation',
        dosageForm: p.dosage_form || 'Tablet / Capsule',
        strength: p.strength || 'Standard Dosage',
        description: p.description || 'WHO-GMP validated finished formulation.',
        isDatabase: true,
      };
    });
  }, [products]);

  // Merge items
  const allItems = useMemo(() => {
    return [...primaryFeaturedBoxes, ...dbFormattedItems];
  }, [dbFormattedItems]);

  // Unique categories for pills
  const categoriesList = useMemo(() => {
    const set = new Set(['ALL', 'Plasma & Biologics']);
    (products || []).forEach((p) => {
      if (p.category?.name) set.add(p.category.name);
    });
    return Array.from(set);
  }, [products]);

  // Display items based on category filter
  const displayedItems = useMemo(() => {
    if (selectedFilter === 'ALL') {
      return primaryFeaturedBoxes;
    }
    const filtered = allItems.filter((item) => item.category === selectedFilter);
    return filtered.length > 0 ? filtered.slice(0, 3) : primaryFeaturedBoxes;
  }, [allItems, selectedFilter]);

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

        {/* Product Cards Grid: Simple, Flat & Elegant (No Shadows, Seamless White Presentation) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 max-w-6xl mx-auto items-stretch">
          {displayedItems.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-2xl border border-slate-200 hover:border-[#c59324] transition-colors duration-200 flex flex-col justify-between group p-6"
            >
              <div>
                {/* Top Subtle Tags */}
                <div className="flex items-center justify-between gap-2 pb-3 border-b border-slate-100 text-xs">
                  <span className="font-semibold text-[#c59324] uppercase tracking-wider text-[11px]">
                    {item.category}
                  </span>
                  <span className="text-slate-500 font-medium text-[11px]">
                    {item.dosageForm}
                  </span>
                </div>

                {/* Seamless White Product Visual (No gray box, blends naturally with image) */}
                <div className="w-full h-56 sm:h-60 flex items-center justify-center p-3 my-3 bg-white">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="max-h-full max-w-full object-contain transition-transform duration-300 group-hover:scale-105"
                  />
                </div>

                {/* Product Name & Molecule */}
                <div className="space-y-1">
                  <Link
                    href={`/products`}
                    className="text-lg sm:text-xl font-bold text-[#0c2340] group-hover:text-[#c59324] transition-colors block leading-tight tracking-tight"
                  >
                    {item.name}
                  </Link>

                  <p className="text-xs font-medium text-slate-600 leading-snug">
                    {item.generic}
                  </p>
                </div>

                {/* Minimal Specifications Bar */}
                <div className="flex items-center justify-between text-xs py-2 px-3 my-3 bg-slate-50 rounded-xl border border-slate-100">
                  <div className="flex items-center gap-1.5">
                    <span className="text-slate-400 font-medium text-[11px]">Strength:</span>
                    <span className="font-semibold text-[#0c2340] text-[11px]">{item.strength}</span>
                  </div>
                  <div className="flex items-center gap-1 text-emerald-700 font-semibold text-[11px]">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                    <span>WHO-GMP</span>
                  </div>
                </div>

                {/* Description */}
                <p className="text-xs text-slate-500 leading-relaxed line-clamp-2">
                  {item.description}
                </p>
              </div>

              {/* Action Buttons: Clean & Elegant (No Shadows) */}
              <div className="pt-4 mt-4 border-t border-slate-100 flex items-center gap-2.5">
                <Link
                  href={`/products`}
                  className="flex-1 py-2.5 rounded-xl border border-slate-200 hover:border-[#c59324] hover:text-[#c59324] text-slate-700 text-center font-semibold text-xs transition-colors bg-white"
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
                  className="flex-1 py-2.5 rounded-xl bg-[#0c2340] hover:bg-[#c59324] text-white text-center font-semibold text-xs transition-colors cursor-pointer"
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
