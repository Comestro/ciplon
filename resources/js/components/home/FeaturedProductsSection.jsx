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
        {/* Section Header matching Intas: Bold Blue Title + Accent Line */}
        <div className="text-center mb-10 sm:mb-12">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tight text-[#0069b4] uppercase">
            FEATURED PRODUCTS
          </h2>
          <div className="w-16 h-1 bg-[#0069b4] mx-auto mt-2 rounded-full" />
          <p className="text-xs sm:text-sm text-slate-500 max-w-xl mx-auto mt-3">
            High-purity plasma therapeutics and finished formulations manufactured under strict WHO-GMP compliance.
          </p>
        </div>

        {/* Category Filter Pills (No Shadows) */}
        <div className="flex items-center justify-center gap-2 overflow-x-auto pb-4 mb-10 no-scrollbar">
          {categoriesList.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedFilter(cat)}
              className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                selectedFilter === cat
                  ? 'bg-[#0069b4] text-white'
                  : 'bg-slate-50 text-slate-600 hover:bg-slate-100 hover:text-slate-900 border border-slate-200'
              }`}
            >
              {cat === 'ALL' ? 'All Formulations' : cat}
            </button>
          ))}
        </div>

        {/* 3 Real Photorealistic Product Boxes (Seamless white background, zero artificial shadow) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 sm:gap-12 max-w-5xl mx-auto items-end">
          {displayedItems.map((item) => (
            <div
              key={item.id}
              className="group flex flex-col items-center text-center transition-all duration-300"
            >
              {/* Product 3D Carton Box Frame */}
              <div className="relative w-full max-w-[280px] sm:max-w-[300px] h-[380px] sm:h-[420px] rounded-2xl flex items-center justify-center p-2 transition-transform duration-300 group-hover:-translate-y-2 cursor-pointer bg-white">
                {/* 3D Photorealistic Box Image with NO artificial drop-shadow filter */}
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-105"
                />

                {/* Subtle Hover Action Overlay */}
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-t from-slate-950/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-end justify-center pb-6 gap-2">
                  <Link
                    href={`/products`}
                    className="px-4 py-2 rounded-full bg-white text-slate-900 font-bold text-xs hover:bg-slate-100 transition-all flex items-center gap-1.5"
                  >
                    <Eye className="w-3.5 h-3.5 text-[#0069b4]" />
                    <span>Monograph</span>
                  </Link>

                  <button
                    type="button"
                    onClick={() => {
                      if (typeof onOpenEnquiryModal === 'function') {
                        onOpenEnquiryModal();
                      }
                    }}
                    className="px-4 py-2 rounded-full bg-[#0069b4] text-white font-bold text-xs hover:bg-[#005a9c] transition-all"
                  >
                    Enquire
                  </button>
                </div>
              </div>

              {/* Product Label under the Box (Exact Intas Blue Title Style) */}
              <div className="mt-4 text-center space-y-1">
                <Link
                  href="/products"
                  className="text-lg sm:text-xl font-bold text-[#0069b4] hover:text-[#004780] transition-colors block leading-tight cursor-pointer"
                >
                  {item.name}
                </Link>

                <p className="text-xs text-slate-500 font-medium">
                  {item.generic}
                </p>

                <div className="pt-2 flex items-center justify-center gap-2">
                  <Link
                    href="/products"
                    className="px-3.5 py-1 rounded-full bg-white border border-slate-200 text-slate-600 hover:text-[#0069b4] hover:border-[#0069b4] text-[11px] font-semibold transition-all"
                  >
                    View Details
                  </Link>

                  <button
                    type="button"
                    onClick={() => {
                      if (typeof onOpenEnquiryModal === 'function') {
                        onOpenEnquiryModal();
                      }
                    }}
                    className="px-3.5 py-1 rounded-full bg-[#0069b4] hover:bg-[#00528e] text-white text-[11px] font-semibold transition-all cursor-pointer"
                  >
                    Enquire
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Global CTA Bar matching Intas */}
        <div className="mt-14 sm:mt-16 text-center">
          <Link
            href="/products"
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-[#0069b4] hover:bg-[#00528e] text-white font-bold text-xs sm:text-sm tracking-wider uppercase transition-all hover:scale-105 cursor-pointer"
          >
            <span>EXPLORE ALL FINISHED FORMULATIONS</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </Container>
    </section>
  );
}
