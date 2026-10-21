import { useState, useEffect, useMemo } from 'react';
import { Link, router } from '@inertiajs/react';
import {
  ArrowLeft,
  ChevronRight,
  ChevronLeft,
  Pill,
  Package,
  FileText,
  Clock,
  AlertCircle,
  Share2,
  Layers,
  Check,
  ShieldCheck,
  FileCheck,
  Thermometer,
  Activity,
  Sparkles,
  MessageSquare,
  Microscope,
  Award,
  Info
} from 'lucide-react';
import PublicLayout from '../../layouts/PublicLayout';
import Container from '../../components/common/Container';
import Button from '../../components/common/Button';
import EnquiryModal from '../../components/home/EnquiryModal';

export default function ProductDetailsPage({ product, relatedProducts: initialRelated = [], categories = [] }) {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [copiedLink, setCopiedLink] = useState(false);
  const [isEnquiryOpen, setIsEnquiryOpen] = useState(false);
  const [isImageHovered, setIsImageHovered] = useState(false);

  // Normalize product properties safely for both camelCase and snake_case
  const brandName = product?.brandName || product?.brand_name || 'Pharmaceutical Formulation';
  const genericName = product?.genericName || product?.generic_name || '';
  const productCode = product?.productCode || product?.product_code || '';
  const dosageForm = product?.dosageForm || product?.dosage_form || 'Finished Formulation';
  const strength = product?.strength || 'Clinical Strength';
  const packSize = product?.packSize || product?.pack_size || 'Commercial Institutional Pack';
  const description = product?.description || product?.short_description || 'Finished pharmaceutical formulation produced in strict compliance with current Good Manufacturing Practices (cGMP). Complete analytical specifications, stability documentation, and batch release data are maintained in our central regulatory repository.';
  const indications = product?.indications || 'For clinical management and therapeutic treatment as documented in approved pharmaceutical compendia and product technical dossiers.';
  const directions = product?.directions || 'To be administered strictly under the supervision of a registered medical practitioner in accordance with clinical dosing protocols.';
  const precautions = product?.precautions || 'Contraindicated in patients with documented hypersensitivity to active substances or excipients. Monitor clinical response in specific patient cohorts.';
  const storage = product?.storage || 'Store in a dry, ventilated area below 25°C. Protect from moisture and direct sunlight. Keep out of reach of children.';
  const categoryName = product?.category?.name || (typeof product?.category === 'string' ? product.category : '') || product?.therapeuticArea || 'Therapeutic Portfolio';
  const prescriptionType = product?.prescriptionType || product?.prescription_type || 'Rx Only';

  // Extract available product images from dynamic database records
  const images = useMemo(() => {
    const list = [];
    const getSrc = (img) => {
      if (!img) return null;
      if (typeof img === 'string') return img;
      if (img.file_path) {
        return img.file_path.startsWith('/') ? img.file_path : `/${img.file_path}`;
      }
      return img.url || img.image_url || null;
    };

    const primarySrc = getSrc(product?.primary_image || product?.primaryImage);
    if (primarySrc) {
      list.push(primarySrc);
    }

    if (Array.isArray(product?.images)) {
      product.images.forEach((img) => {
        const src = getSrc(img);
        if (src && !list.includes(src)) {
          list.push(src);
        }
      });
    }

    if (product?.image && !list.includes(product.image)) {
      list.push(product.image);
    }
    return list;
  }, [product]);

  // Auto-cycle through images every 3 seconds
  useEffect(() => {
    if (images.length <= 1 || isImageHovered) return;

    const timer = setTimeout(() => {
      setSelectedImageIndex((prev) => (prev >= images.length - 1 ? 0 : prev + 1));
    }, 3000);

    return () => clearTimeout(timer);
  }, [images.length, isImageHovered, selectedImageIndex]);

  // Extract dynamic active compositions
  const compositions = useMemo(() => {
    if (Array.isArray(product?.compositions) && product.compositions.length > 0) {
      return product.compositions;
    }
    return [];
  }, [product]);

  const relatedProducts = initialRelated.slice(0, 3);

  // Image navigation handlers
  const handlePrevImage = () => {
    setSelectedImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNextImage = () => {
    setSelectedImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  // Share formulation URL
  const handleShare = () => {
    if (navigator?.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  if (!product) {
    return (
      <PublicLayout categories={categories}>
        <div className="py-20 bg-slate-50 min-h-[60vh] flex items-center">
          <Container>
            <div className="max-w-md mx-auto text-center space-y-5 p-8 bg-white rounded-3xl border border-slate-200 shadow-sm">
              <div className="w-14 h-14 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto">
                <AlertCircle className="w-7 h-7 stroke-[1.8]" />
              </div>
              <h2 className="text-xl font-bold text-slate-900">Formulation Not Found</h2>
              <p className="text-xs text-slate-500 leading-relaxed">
                The requested pharmaceutical product formulation could not be located in our current catalog.
              </p>
              <div className="pt-2">
                <Link
                  href="/products"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#0c2340] hover:bg-[#c59324] text-white text-xs font-semibold transition-colors cursor-pointer"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Return to Products Catalog</span>
                </Link>
              </div>
            </div>
          </Container>
        </div>
      </PublicLayout>
    );
  }

  return (
    <PublicLayout categories={categories}>
      <div className="bg-white pt-2 pb-14 min-h-screen">
        <Container>
          {/* Breadcrumbs for desktop */}
          <div className="hidden md:flex items-center text-xs text-slate-500 mb-3">
            <nav className="flex items-center gap-1.5 font-medium flex-wrap">
              <Link href="/" className="hover:text-[#c59324] transition-colors">
                Home
              </Link>
              <ChevronRight className="w-3.5 h-3.5 text-slate-300 shrink-0" />
              <Link href="/products" className="hover:text-[#c59324] transition-colors">
                Products Catalog
              </Link>
              {categoryName && (
                <>
                  <ChevronRight className="w-3.5 h-3.5 text-slate-300 shrink-0" />
                  <span className="text-slate-600">{categoryName}</span>
                </>
              )}
              {brandName && (
                <>
                  <ChevronRight className="w-3.5 h-3.5 text-slate-300 shrink-0" />
                  <span className="text-[#0c2340] font-bold truncate max-w-[220px]">
                    {brandName}
                  </span>
                </>
              )}
            </nav>
          </div>

          {/* Hero Section: Left Image Showcase & Right Identity */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 lg:gap-8 items-start mb-6">
            
            {/* Left Column: Image Showcase Stage */}
            <div className="lg:col-span-5 space-y-2.5">
              {/* Main Image Stage Container */}
              <div
                className="bg-slate-50/70 rounded-2xl relative aspect-[4/3] overflow-hidden group border border-slate-200/80 p-3 flex items-center justify-center"
                onMouseEnter={() => setIsImageHovered(true)}
                onMouseLeave={() => setIsImageHovered(false)}
              >
                
                {/* Floating Badges */}
                <div className="absolute top-2.5 left-2.5 z-10 flex flex-wrap items-center gap-1 max-w-[70%]">
                  {dosageForm && (
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] sm:text-[11px] font-bold uppercase tracking-wider bg-[#0c2340] text-white shadow-xs">
                      {dosageForm}
                    </span>
                  )}
                  {prescriptionType && (
                    <span className="px-2 py-0.5 rounded-full text-[10px] sm:text-[11px] font-semibold uppercase tracking-wider bg-white/95 text-slate-700 border border-slate-200 shadow-xs">
                      {prescriptionType}
                    </span>
                  )}
                </div>

                {/* Floating Share Button on Top-Right of Image Card */}
                <button
                  type="button"
                  onClick={handleShare}
                  className="absolute top-2.5 right-2.5 z-10 p-2 rounded-full bg-white/90 hover:bg-white text-slate-500 hover:text-[#c59324] transition-colors cursor-pointer border border-slate-200 shadow-xs"
                  title="Share Formulation"
                  aria-label="Share Formulation"
                >
                  {copiedLink ? <Check className="w-4 h-4 text-[#c59324]" /> : <Share2 className="w-4 h-4" />}
                </button>

                {/* Primary Image Display */}
                {images.length > 0 ? (
                  <img
                    src={images[selectedImageIndex]}
                    alt={brandName}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center text-center p-6 space-y-2">
                    <div className="w-14 h-14 rounded-2xl bg-amber-50 text-[#c59324] border border-amber-200/60 flex items-center justify-center">
                      <Pill className="w-7 h-7 stroke-[1.8]" />
                    </div>
                    <span className="text-xs font-semibold text-slate-500">Finished Formulation</span>
                  </div>
                )}
              </div>

              {/* Thumbnail Selector Strip */}
              {images.length > 1 && (
                <div className="flex items-center gap-2 overflow-x-auto py-1 no-scrollbar">
                  {images.map((imgUrl, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setSelectedImageIndex(idx)}
                      className={`w-14 h-14 rounded-xl p-1 transition-all cursor-pointer overflow-hidden shrink-0 ${
                        selectedImageIndex === idx
                          ? 'border-2 border-[#c59324] bg-white shadow-xs'
                          : 'border border-slate-200/80 bg-slate-50 hover:bg-white'
                      }`}
                    >
                      <img src={imgUrl} alt="" className="w-full h-full object-contain rounded-lg" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Right Column: Identity & Formulation Specs */}
            <div className="lg:col-span-7 space-y-5">
              <div>
                <div className="flex items-center gap-2 flex-wrap mb-1.5">
                  {categoryName && (
                    <span className="text-[11px] font-bold uppercase tracking-wider text-[#c59324] bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200/60">
                      {categoryName}
                    </span>
                  )}
                  {productCode && (
                    <>
                      <span className="text-slate-300">•</span>
                      <span className="text-[11px] font-mono text-slate-500">
                        Code: {productCode}
                      </span>
                    </>
                  )}
                </div>

                <h1 className="text-2xl sm:text-3xl font-bold text-[#0c2340] tracking-tight leading-tight">
                  {brandName}
                </h1>

                {genericName && (
                  <p className="text-sm font-semibold text-slate-600 mt-1">
                    {genericName}
                  </p>
                )}
              </div>

              {/* Quick Specs Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 py-3 border-y border-slate-100">
                <div className="bg-slate-50 rounded-xl p-2.5 border border-slate-100">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">Dosage Form</span>
                  <span className="text-xs font-bold text-[#0c2340]">{dosageForm}</span>
                </div>
                <div className="bg-slate-50 rounded-xl p-2.5 border border-slate-100">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">Strength</span>
                  <span className="text-xs font-bold text-[#0c2340]">{strength}</span>
                </div>
                <div className="bg-slate-50 rounded-xl p-2.5 col-span-2 sm:col-span-1 border border-slate-100">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">Prescription</span>
                  <span className="text-xs font-bold text-[#0c2340]">{prescriptionType}</span>
                </div>
              </div>

              {/* Primary Action Button */}
              <div className="flex items-center gap-3 pt-1">
                <Button
                  variant="primary"
                  size="md"
                  onClick={() => setIsEnquiryOpen(true)}
                  className="bg-[#0c2340] hover:bg-[#c59324] text-white font-bold text-xs sm:text-sm py-2.5 px-6 rounded-xl shadow-md transition-colors cursor-pointer"
                >
                  Request Technical Dossier / Quote
                </Button>
                <button
                  type="button"
                  onClick={handleShare}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:text-[#c59324] hover:border-[#c59324] transition-colors cursor-pointer"
                >
                  {copiedLink ? <Check className="w-3.5 h-3.5 text-[#c59324]" /> : <Share2 className="w-3.5 h-3.5" />}
                  <span>{copiedLink ? 'Link Copied' : 'Share'}</span>
                </button>
              </div>

              {/* Active Compositions */}
              {compositions.length > 0 && (
                <div className="pt-2">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-[#0c2340] mb-2">
                    Active Pharmaceutical Ingredients (API)
                  </h3>
                  <div className="border border-slate-100 rounded-xl overflow-hidden divide-y divide-slate-100 bg-white">
                    {compositions.map((comp, idx) => (
                      <div key={idx} className="flex items-center justify-between px-3.5 py-2 text-xs">
                        <span className="font-semibold text-slate-800">{comp.ingredient_name || comp.ingredientName}</span>
                        <span className="font-mono text-[#c59324] font-bold">{comp.strength} {comp.unit || 'mg'}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Details & Indications Section */}
          <div className="border-t border-slate-100 pt-6 mt-6 space-y-6">
            {description && (
              <div>
                <h3 className="text-sm font-bold text-slate-900 mb-2">Description & Clinical Overview</h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed whitespace-pre-line">{description}</p>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {indications && (
                <div className="bg-slate-50/70 rounded-2xl p-4 border border-slate-100">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[#0c2340] mb-1.5 flex items-center gap-1.5">
                    <Activity className="w-3.5 h-3.5 text-[#c59324]" />
                    <span>Indications</span>
                  </h4>
                  <p className="text-xs text-slate-600 leading-relaxed">{indications}</p>
                </div>
              )}

              {directions && (
                <div className="bg-slate-50/70 rounded-2xl p-4 border border-slate-100">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[#0c2340] mb-1.5 flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-[#c59324]" />
                    <span>Dosage & Administration</span>
                  </h4>
                  <p className="text-xs text-slate-600 leading-relaxed">{directions}</p>
                </div>
              )}

              {precautions && (
                <div className="bg-slate-50/70 rounded-2xl p-4 border border-slate-100">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[#0c2340] mb-1.5 flex items-center gap-1.5">
                    <AlertCircle className="w-3.5 h-3.5 text-[#c59324]" />
                    <span>Precautions & Warnings</span>
                  </h4>
                  <p className="text-xs text-slate-600 leading-relaxed">{precautions}</p>
                </div>
              )}

              {storage && (
                <div className="bg-slate-50/70 rounded-2xl p-4 border border-slate-100">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[#0c2340] mb-1.5 flex items-center gap-1.5">
                    <Thermometer className="w-3.5 h-3.5 text-[#c59324]" />
                    <span>Storage Requirements</span>
                  </h4>
                  <p className="text-xs text-slate-600 leading-relaxed">{storage}</p>
                </div>
              )}
            </div>
          </div>

          {/* Related Formulations Carousel / Grid */}
          {relatedProducts.length > 0 && (
            <div className="border-t border-slate-100 pt-8 mt-8">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-base font-bold text-[#0c2340]">Related Formulations</h3>
                <Link
                  href="/products"
                  className="text-xs font-semibold text-[#c59324] hover:text-[#9f6d0f] inline-flex items-center gap-1"
                >
                  <span>View All</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-5">
                {relatedProducts.map((p) => {
                  const rBrand = p.brand_name || p.brandName;
                  const rGeneric = p.generic_name || p.genericName;
                  const rCode = p.product_code || p.productCode || p.id;
                  const rForm = p.dosage_form || p.dosageForm;
                  const rStrength = p.strength || '';
                  const rImage = p.primary_image?.url || p.primaryImage?.url || (Array.isArray(p.images) && p.images[0]?.url) || '';

                  return (
                    <Link
                      key={p.id || rCode}
                      href={`/products/${p.id || rCode}`}
                      className="bg-white hover:border-[#c59324]/60 border border-slate-200/90 rounded-2xl p-4 transition-all duration-300 hover:shadow-lg group flex flex-col justify-between"
                    >
                      <div className="space-y-2.5">
                        {/* Thumbnail & Badges */}
                        <div className="h-28 rounded-xl bg-slate-50 flex items-center justify-center relative overflow-hidden p-2">
                          {rImage ? (
                            <img
                              src={rImage}
                              alt={rBrand}
                              className="max-h-full max-w-full object-contain transition-transform duration-300 group-hover:scale-105"
                            />
                          ) : (
                            <Pill className="w-7 h-7 text-[#c59324]" />
                          )}
                          {rForm && (
                            <span className="absolute top-2 left-2 px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider bg-[#0c2340] text-white">
                              {rForm}
                            </span>
                          )}
                        </div>

                        <div className="space-y-0.5">
                          <div className="flex items-center justify-between text-[10px] font-mono text-slate-400">
                            <span>{rCode}</span>
                            <span className="text-[#c59324] font-bold">{rStrength}</span>
                          </div>
                          <h4 className="text-xs sm:text-sm font-bold text-[#0c2340] group-hover:text-[#c59324] transition-colors line-clamp-1">
                            {rBrand}
                          </h4>
                          {rGeneric && (
                            <p className="text-xs text-slate-500 line-clamp-1">
                              {rGeneric}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="pt-2.5 mt-2.5 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-[#c59324]">
                        <span>View Specifications</span>
                        <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          )}

          {/* Floating Mobile Bottom Action Strip (Visible only on mobile devices) */}
          <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 px-4 py-2.5 flex items-center justify-between gap-3 shadow-lg">
            <div className="min-w-0 flex-1">
              <span className="text-xs font-bold text-[#0c2340] block truncate">
                {brandName}
              </span>
              <span className="text-[10px] text-[#c59324] font-semibold block truncate">
                {strength} • {dosageForm}
              </span>
            </div>

            <Button
              variant="primary"
              onClick={() => setIsEnquiryOpen(true)}
              className="shrink-0 bg-[#0c2340] hover:bg-[#c59324] text-white font-bold text-xs py-2 px-4 rounded-xl cursor-pointer"
            >
              Inquire Now
            </Button>
          </div>

          {/* Product Formulation Enquiry Modal */}
          <EnquiryModal
            isOpen={isEnquiryOpen}
            onClose={() => setIsEnquiryOpen(false)}
            initialProduct={product}
          />
        </Container>
      </div>
    </PublicLayout>
  );
}
