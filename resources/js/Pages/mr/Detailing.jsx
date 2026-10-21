import { useState, useEffect, useRef } from 'react';
import { Link } from '@inertiajs/react';
import {
  Play,
  GripVertical,
  ArrowUp,
  ArrowDown,
  RotateCcw,
  CheckCircle2,
  ShieldCheck,
  Factory,
  ChevronLeft,
  ChevronRight,
  Maximize,
  Minimize,
  X,
  Stethoscope,
  Clock,
  FlaskConical,
  Award,
  Calendar
} from 'lucide-react';
import MRLayout from '../../layouts/MR/MRLayout';
import toast from 'react-hot-toast';

export default function Detailing({ products = [], doctors = [], company = {} }) {
  // Setup State
  const [selectedDoctorId, setSelectedDoctorId] = useState('');
  const [orderedProducts, setOrderedProducts] = useState([]);
  const [selectedProductIds, setSelectedProductIds] = useState(new Set());
  const [categoryFilter, setCategoryFilter] = useState('all');

  // Drag and drop state
  const [draggedIndex, setDraggedIndex] = useState(null);
  const [dragOverIndex, setDragOverIndex] = useState(null);

  // Slideshow Presentation State
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Touch Swipe Gesture Tracking
  const touchStartX = useRef(0);
  const touchStartY = useRef(0);
  const touchDeltaX = useRef(0);

  // Initialize ordered products from database props
  useEffect(() => {
    if (products && products.length > 0) {
      setOrderedProducts(products);
      setSelectedProductIds(new Set(products.map((p) => p.id)));
    }
  }, [products]);

  // Selected Doctor details
  const selectedDoctor = doctors.find((d) => String(d.id) === String(selectedDoctorId));

  // Products included in the presentation based on selection
  const includedProducts = orderedProducts.filter((p) => selectedProductIds.has(p.id));

  // Slides:
  // Slide 0: Company Logo & Brand Intro
  // Slide 1: Manufacturing Facility #1 (Walpar Wellness)
  // Slide 2: Manufacturing Facility #2 (Pure & Cure Healthcare - Subsidiary of Akums)
  // Slide 3 ... N+2: Product Slides (arranged order)
  // Final Slide: Recap
  const slides = [
    { type: 'brand_intro', id: 'slide-brand' },
    { type: 'manufacturing_competitors', id: 'slide-mfg' },
    { type: 'manufacturing_akums', id: 'slide-mfg-akums' },
    ...includedProducts.map((p) => ({ type: 'product', id: `prod-${p.id}`, data: p })),
    { type: 'recap', id: 'slide-recap' },
  ];

  const totalSlides = slides.length;

  // Toggle individual product selection
  const handleToggleProduct = (id) => {
    setSelectedProductIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        if (next.size === 1) {
          toast.error('Keep at least one product selected.');
          return prev;
        }
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  // Move product up/down
  const handleMoveProduct = (index, direction) => {
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= orderedProducts.length) return;

    setOrderedProducts((prev) => {
      const next = [...prev];
      const temp = next[index];
      next[index] = next[targetIndex];
      next[targetIndex] = temp;
      return next;
    });
  };

  // Drag and Drop Handlers
  const handleDragStart = (e, index) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = 'move';
    if (e.target) {
      e.target.style.opacity = '0.5';
    }
  };

  const handleDragEnd = (e) => {
    if (e.target) {
      e.target.style.opacity = '1';
    }
    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  const handleDragOver = (e, index) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    if (dragOverIndex !== index) {
      setDragOverIndex(index);
    }
  };

  const handleDrop = (e, targetIndex) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === targetIndex) return;

    setOrderedProducts((prev) => {
      const next = [...prev];
      const draggedItem = next.splice(draggedIndex, 1)[0];
      next.splice(targetIndex, 0, draggedItem);
      return next;
    });

    setDraggedIndex(null);
    setDragOverIndex(null);
    toast.success('Slide order updated');
  };

  // Reset to original database order
  const handleResetOrder = () => {
    setOrderedProducts([...products]);
    setSelectedProductIds(new Set(products.map((p) => p.id)));
    toast.success('Restored default order');
  };

  // Launch Presentation
  const handleStartPresentation = () => {
    if (includedProducts.length === 0) {
      toast.error('Select at least one product.');
      return;
    }
    setCurrentSlideIndex(0);
    setIsPlaying(true);
  };

  // Exit Presentation
  const handleExitPresentation = () => {
    if (document.fullscreenElement) {
      document.exitFullscreen().catch(() => {});
    }
    setIsPlaying(false);
  };

  // Toggle Fullscreen
  const handleToggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().then(() => setIsFullscreen(true)).catch(() => {});
    } else {
      document.exitFullscreen().then(() => setIsFullscreen(false)).catch(() => {});
    }
  };

  // Slide Navigation
  const goToNextSlide = () => {
    if (currentSlideIndex < totalSlides - 1) {
      setCurrentSlideIndex((prev) => prev + 1);
    }
  };

  const goToPrevSlide = () => {
    if (currentSlideIndex > 0) {
      setCurrentSlideIndex((prev) => prev - 1);
    }
  };

  // Keyboard navigation
  useEffect(() => {
    if (!isPlaying) return;

    const handleKeyDown = (e) => {
      if (e.key === 'ArrowRight' || e.key === 'Space') {
        goToNextSlide();
      } else if (e.key === 'ArrowLeft') {
        goToPrevSlide();
      } else if (e.key === 'Escape') {
        handleExitPresentation();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isPlaying, currentSlideIndex, totalSlides]);

  // Touch Swipe Gesture Detection for Mobile / Tablet
  const handleTouchStart = (e) => {
    if (!isPlaying) return;
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
    touchDeltaX.current = 0;
  };

  const handleTouchMove = (e) => {
    if (!isPlaying) return;
    const currentX = e.touches[0].clientX;
    touchDeltaX.current = currentX - touchStartX.current;
  };

  const handleTouchEnd = () => {
    if (!isPlaying) return;
    const threshold = 40;
    if (touchDeltaX.current < -threshold) {
      goToNextSlide();
    } else if (touchDeltaX.current > threshold) {
      goToPrevSlide();
    }
    touchDeltaX.current = 0;
  };

  // Categories list
  const categoriesList = ['all', ...new Set(products.map((p) => p.category?.name).filter(Boolean))];

  const filteredOrderedProducts = orderedProducts.filter((product) => {
    if (categoryFilter === 'all') return true;
    return product.category?.name === categoryFilter;
  });

  const logoUrl = company?.logo_url || company?.logo || '/images/ciplon_logo.png';

  return (
    <MRLayout title="Doctor Slide Show">
      <div className="space-y-4 pb-12">

        {/* 1. TOP BAR: Simple, Flat, No Shadow */}
        <div className="bg-white rounded-xl border border-slate-200 p-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-xl font-bold text-slate-900">
                Doctor Slide Show
              </h1>
              <p className="text-xs text-slate-500">
                Sort medicines for doctor, then start presentation.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
              <select
                value={selectedDoctorId}
                onChange={(e) => setSelectedDoctorId(e.target.value)}
                className="py-2 px-3 bg-slate-50/50 border border-slate-200/80 rounded-xl text-xs text-slate-800 font-medium focus:outline-none focus:ring-1 focus:ring-slate-900 cursor-pointer"
              >
                <option value="">General Physician</option>
                {doctors.map((doc) => (
                  <option key={doc.id} value={doc.id}>
                    {doc.name} {doc.specialization ? `(${doc.specialization})` : ''}
                  </option>
                ))}
              </select>

              <button
                type="button"
                onClick={handleStartPresentation}
                className="inline-flex items-center justify-center gap-2 px-5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-medium text-xs shadow-xs transition-colors cursor-pointer"
              >
                <Play className="w-3.5 h-3.5 fill-white text-white" />
                <span>Start Slideshow ({totalSlides} Slides)</span>
              </button>
            </div>
          </div>
        </div>

        {/* 2. COMPACT OPENING SLIDES INDICATOR: Flat, Minimal Text */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs">
          <div className="bg-white rounded-lg border border-slate-200 px-3.5 py-2.5 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <span className="w-6 h-6 rounded bg-slate-100 text-slate-700 font-bold text-xs flex items-center justify-center">
                1
              </span>
              <span className="font-semibold text-slate-800">Slide 1: Brand Logo &amp; Heritage</span>
            </div>
            <img
              src={logoUrl}
              alt="Ciplon Logo"
              className="h-5 w-auto object-contain opacity-80"
              onError={(e) => {
                e.currentTarget.src = '/images/ciplon_logo.png';
              }}
            />
          </div>

          <div className="bg-white rounded-lg border border-slate-200 px-3.5 py-2.5 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <span className="w-6 h-6 rounded bg-slate-100 text-slate-700 font-bold text-xs flex items-center justify-center">
                2
              </span>
              <span className="font-semibold text-slate-800">Slide 2: Walpar Wellness (WHO-GMP)</span>
            </div>
            <img
              src="/images/walpar_logo.png"
              alt="Walpar Logo"
              className="h-5 w-auto object-contain"
            />
          </div>

          <div className="bg-white rounded-lg border border-slate-200 px-3.5 py-2.5 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <span className="w-6 h-6 rounded bg-slate-100 text-slate-700 font-bold text-xs flex items-center justify-center">
                3
              </span>
              <span className="font-semibold text-slate-800">Slide 3: Pure &amp; Cure (Akums Drugs)</span>
            </div>
            <img
              src="/images/akums_logo.png"
              alt="Akums Logo"
              className="h-5 w-auto object-contain"
            />
          </div>
        </div>

        {/* 3. MEDICINE SLIDES HEADER & FILTER */}
        <div className="flex items-center justify-between pt-1">
          <div className="text-xs font-semibold text-slate-700">
            Medicine Slides ({includedProducts.length} selected)
          </div>

          <div className="flex items-center gap-2 text-xs">
            {categoriesList.length > 2 && (
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="py-1 px-2.5 bg-white border border-slate-200 rounded-lg text-slate-700 focus:outline-none cursor-pointer"
              >
                {categoriesList.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat === 'all' ? 'All Categories' : cat}
                  </option>
                ))}
              </select>
            )}

            <button
              type="button"
              onClick={handleResetOrder}
              className="inline-flex items-center gap-1 px-2 py-1 rounded-lg border border-slate-200 bg-white text-slate-600 hover:text-slate-900 cursor-pointer"
              title="Reset order"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset</span>
            </button>
          </div>
        </div>

        {/* 4. PRODUCT CARDS: Simple, Flat, No Shadows, Clean Text */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {filteredOrderedProducts.map((product) => {
            const actualIndex = orderedProducts.findIndex((p) => p.id === product.id);
            const isIncluded = selectedProductIds.has(product.id);
            const slideNumber = actualIndex + 4; // #1 is brand, #2 is Walpar, #3 is Pure & Cure (Akums)
            const isBeingDragged = draggedIndex === actualIndex;
            const isDragTarget = dragOverIndex === actualIndex;

            const imageUrl =
              product.primary_image?.file_path ||
              product.primary_image?.url ||
              product.images?.[0]?.file_path ||
              product.images?.[0]?.url ||
              '/images/ciplon_d.png';

            return (
              <div
                key={product.id}
                draggable
                onDragStart={(e) => handleDragStart(e, actualIndex)}
                onDragEnd={handleDragEnd}
                onDragOver={(e) => handleDragOver(e, actualIndex)}
                onDrop={(e) => handleDrop(e, actualIndex)}
                className={`rounded-xl bg-white border p-3 select-none transition-colors ${
                  isBeingDragged
                    ? 'opacity-40 border-dashed border-slate-400'
                    : isDragTarget
                    ? 'border-slate-800 bg-slate-50'
                    : isIncluded
                    ? 'border-slate-200 hover:border-slate-300'
                    : 'border-slate-200 bg-slate-50/70 opacity-50'
                }`}
              >
                {/* Header: Slide Number + Move Arrows + Drag handle */}
                <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                  <span className="w-6 h-6 rounded bg-slate-100 text-slate-800 font-bold text-xs flex items-center justify-center">
                    {slideNumber}
                  </span>

                  <div className="flex items-center gap-1 text-slate-400">
                    <button
                      type="button"
                      onClick={() => handleMoveProduct(actualIndex, -1)}
                      disabled={actualIndex === 0}
                      className="p-1 rounded hover:text-slate-800 disabled:opacity-20 cursor-pointer"
                      title="Move up"
                    >
                      <ArrowUp className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleMoveProduct(actualIndex, 1)}
                      disabled={actualIndex === orderedProducts.length - 1}
                      className="p-1 rounded hover:text-slate-800 disabled:opacity-20 cursor-pointer"
                      title="Move down"
                    >
                      <ArrowDown className="w-3.5 h-3.5" />
                    </button>
                    <span className="cursor-grab hover:text-slate-800 px-0.5">
                      <GripVertical className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>

                {/* Body: Product Image + Brand & Salt (Clean, Simple) */}
                <div className="py-2.5 flex items-center gap-3">
                  <div className="w-14 h-14 rounded-lg bg-slate-50 border border-slate-100 p-1 flex items-center justify-center shrink-0">
                    <img
                      src={imageUrl}
                      alt={product.brand_name}
                      className="max-h-full max-w-full object-contain"
                      onError={(e) => {
                        e.currentTarget.src = '/images/ciplon_d.png';
                      }}
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-bold text-slate-900 truncate">
                      {product.brand_name}
                    </h4>
                    <p className="text-xs text-slate-500 truncate mt-0.5" title={product.generic_name}>
                      {product.generic_name}
                    </p>
                  </div>
                </div>

                {/* Footer: Checkbox only */}
                <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                  <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-600">
                    <input
                      type="checkbox"
                      checked={isIncluded}
                      onChange={() => handleToggleProduct(product.id)}
                      className="w-3.5 h-3.5 rounded text-slate-900 focus:ring-0 cursor-pointer"
                    />
                    <span>{isIncluded ? 'Included' : 'Skip'}</span>
                  </label>
                </div>
              </div>
            );
          })}
        </div>

      </div>

      {/* ===================================================================== */}
      {/* FULLSCREEN PRESENTATION MODE (WHITE BACKGROUND, NO SHADOW, MINIMAL)  */}
      {/* ===================================================================== */}
      {isPlaying && (
        <div
          className="fixed inset-0 z-50 bg-white text-slate-900 flex flex-col select-none overflow-hidden"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          {/* Top Bar: Clean, Flat, Border Only */}
          <div className="h-13 px-4 sm:px-6 border-b border-slate-200 flex items-center justify-between shrink-0 bg-white">
            <div className="flex items-center gap-3">
              <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-800 font-mono font-bold text-xs border border-slate-200">
                {currentSlideIndex + 1} / {totalSlides}
              </span>
              <span className="text-xs text-slate-600 hidden sm:inline font-medium">
                {selectedDoctor ? `Dr. ${selectedDoctor.name}` : 'Doctor Detailing'}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleToggleFullscreen}
                className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 cursor-pointer"
                title="Fullscreen"
              >
                {isFullscreen ? <Minimize className="w-4 h-4" /> : <Maximize className="w-4 h-4" />}
              </button>

              <button
                type="button"
                onClick={handleExitPresentation}
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-semibold cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
                <span>Exit</span>
              </button>
            </div>
          </div>

          {/* Simple Progress line */}
          <div className="h-0.5 bg-slate-100 w-full relative shrink-0">
            <div
              className="h-full bg-slate-800 transition-all duration-200"
              style={{ width: `${((currentSlideIndex + 1) / totalSlides) * 100}%` }}
            />
          </div>

          {/* SLIDE CANVAS: Full Screen Width, Spacious, Complete Details */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-8 lg:p-12 flex items-center justify-center">
            <div className="w-full max-w-6xl">

              {/* ------------------------------------------------------------- */}
              {/* SLIDE 1: COMPANY LOGO & BRAND (Full Screen Presentation)      */}
              {/* ------------------------------------------------------------- */}
              {slides[currentSlideIndex].type === 'brand_intro' && (
                <div className="border border-slate-200 rounded-3xl p-8 sm:p-14 text-center space-y-6 max-w-4xl mx-auto">
                  {/* Company Logo First (Large, Crisp) */}
                  <div className="flex items-center justify-center pt-2">
                    <img
                      src={logoUrl}
                      alt={company?.name || 'Ciplon Pharma'}
                      className="h-24 sm:h-36 w-auto object-contain"
                      onError={(e) => {
                        e.currentTarget.src = '/images/ciplon_logo.png';
                      }}
                    />
                  </div>

                  <div className="space-y-1.5 max-w-xl mx-auto">
                    <h1 className="text-2xl sm:text-4xl font-semibold text-slate-800 tracking-tight">
                      {company?.name || 'Ciplon Pharma Private Limited'}
                    </h1>
                    <p className="text-sm font-medium text-slate-600">
                      Science Into Smiles
                    </p>
                  </div>

                  {/* 3 Spacious Flat Trust Badges */}
                  <div className="grid grid-cols-3 gap-3.5 max-w-lg mx-auto pt-3">
                    <div className="p-3.5 rounded-2xl border border-slate-200 bg-slate-50 text-center">
                      <span className="text-sm sm:text-base font-semibold text-slate-800 block">ISO 9001:2015</span>
                      <span className="text-[11px] text-slate-400 block mt-0.5">Certified QMS</span>
                    </div>

                    <div className="p-3.5 rounded-2xl border border-slate-200 bg-slate-50 text-center">
                      <span className="text-sm sm:text-base font-semibold text-slate-800 block">WHO-GMP</span>
                      <span className="text-[11px] text-slate-400 block mt-0.5">Cleanrooms</span>
                    </div>

                    <div className="p-3.5 rounded-2xl border border-slate-200 bg-slate-50 text-center">
                      <span className="text-sm sm:text-base font-semibold text-slate-800 block">FSSAI</span>
                      <span className="text-[11px] text-slate-400 block mt-0.5">Licensed</span>
                    </div>
                  </div>
                </div>
              )}

              {/* ------------------------------------------------------------- */}
              {/* SLIDE 2: MANUFACTURING & TRUSTED BY TOP PHARMA BRANDS         */}
              {/* ------------------------------------------------------------- */}
              {slides[currentSlideIndex].type === 'manufacturing_competitors' && (
                <div className="border border-slate-200 rounded-3xl p-6 sm:p-10 lg:p-12 space-y-8 max-w-6xl mx-auto">
                  
                  {/* Top Header */}
                  <div className="text-center space-y-2 max-w-3xl mx-auto">
                    <span className="px-3 py-1 rounded-full text-[11px] font-semibold uppercase tracking-wider bg-slate-100 text-slate-700 border border-slate-200 inline-block">
                      Manufacturing Excellence &amp; Peer Comparison
                    </span>
                    <h2 className="text-2xl sm:text-4xl font-semibold text-slate-800 tracking-tight leading-tight">
                      Manufactured At WHO-GMP Certified State-Of-The-Art Facility
                    </h2>
                    <p className="text-xs sm:text-sm text-slate-500 font-normal leading-relaxed">
                      Ciplon formulations are manufactured at the same high-standard facility trusted by India's top pharmaceutical giants.
                    </p>
                  </div>

                  {/* 2-COLUMN HERO LAYOUT: Big Manufacturer Side + Top Brands Side */}
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
                    
                    {/* Left Column: Big Manufacturer Logo & Address Card */}
                    <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200 p-6 sm:p-7 flex flex-col justify-between shadow-2xs space-y-6">
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                            Manufacturer
                          </span>
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                            WHO-GMP &amp; ISO 9001:2015
                          </span>
                        </div>

                        {/* BIG MANUFACTURER LOGO */}
                        <div className="w-full h-32 sm:h-36 rounded-xl bg-white border border-slate-200/80 p-4 flex items-center justify-center">
                          <img 
                            src="/images/walpar_logo.png" 
                            alt="Walpar Nutritions Limited Logo" 
                            className="max-h-24 max-w-full object-contain"
                          />
                        </div>

                        <div className="space-y-1.5 pt-1">
                          <h3 className="text-lg sm:text-xl font-bold text-slate-900 leading-snug">
                            WALPAR WELLNESS PVT. LTD.
                          </h3>
                          <p className="text-xs text-slate-500 leading-relaxed">
                            Plot No. 2/A &amp; 06, Opp. Sabarmati Gas Station, Khatraj, Kalol, Gandhinagar, Gujarat – 382721
                          </p>
                        </div>
                      </div>

                      <div className="pt-4 border-t border-slate-100 grid grid-cols-2 gap-2 text-left">
                        <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100">
                          <span className="text-[10px] uppercase font-semibold text-slate-400 block">Cleanrooms</span>
                          <span className="text-xs font-bold text-slate-800">Class 10,000</span>
                        </div>
                        <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100">
                          <span className="text-[10px] uppercase font-semibold text-slate-400 block">Air Filtration</span>
                          <span className="text-xs font-bold text-emerald-700">HEPA Integrated</span>
                        </div>
                      </div>
                    </div>

                    {/* Right Column: Companies & Brands Using This Same Manufacturer */}
                    <div className="lg:col-span-7 bg-slate-50/70 rounded-2xl border border-slate-200 p-6 sm:p-7 flex flex-col justify-between space-y-5">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <ShieldCheck className="w-5 h-5 text-slate-700" />
                          <h3 className="text-base sm:text-lg font-bold text-slate-900">
                            Leading Brands Made At The Same Facility
                          </h3>
                        </div>
                        <p className="text-xs text-slate-500 leading-relaxed">
                          The same production lines, validated formulation protocols, and high-potency quality assurance trusted by top pharmaceutical leaders:
                        </p>
                      </div>

                      {/* Brand Logo / Badges Grid */}
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                        {[
                          { name: 'Sun Pharma', sub: 'Specialty Formulations', color: 'border-amber-200 bg-white text-amber-900' },
                          { name: 'Cipla', sub: 'Respiratory & Critical', color: 'border-blue-200 bg-white text-blue-900' },
                          { name: 'Alkem Labs', sub: 'Anti-Infectives', color: 'border-indigo-200 bg-white text-indigo-900' },
                          { name: 'Torrent Pharma', sub: 'Cardiovascular', color: 'border-teal-200 bg-white text-teal-900' },
                          { name: 'Mankind', sub: 'Primary Care Formulations', color: 'border-purple-200 bg-white text-purple-900' },
                          { name: 'Abbott', sub: 'Global Nutritional & GI', color: 'border-sky-200 bg-white text-sky-900' },
                          { name: 'Intas Pharma', sub: 'Biologics & Specialty', color: 'border-rose-200 bg-white text-rose-900' },
                          { name: 'Lupin', sub: 'Complex Formulations', color: 'border-emerald-200 bg-white text-emerald-900' },
                          { name: 'Dr. Reddy\'s', sub: 'Therapeutic Formulations', color: 'border-slate-300 bg-white text-slate-900' },
                        ].map((b) => (
                          <div 
                            key={b.name}
                            className={`p-3 rounded-xl border ${b.color} shadow-2xs flex flex-col justify-between hover:border-slate-400 transition-colors`}
                          >
                            <span className="text-sm font-bold tracking-tight block">
                              {b.name}
                            </span>
                            <span className="text-[10px] text-slate-500 font-medium block mt-1">
                              {b.sub}
                            </span>
                          </div>
                        ))}
                      </div>

                      <div className="p-3 rounded-xl bg-white border border-slate-200/90 text-[11px] text-slate-600 flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span>Ensures identical bioavailability, active dissolution rates, and therapy consistency for Ciplon medicines.</span>
                      </div>
                    </div>

                  </div>


                  {/* 4 Core Quality Standard Pillars */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
                    <div className="p-4 rounded-2xl border border-slate-200 bg-white space-y-1.5 shadow-2xs">
                      <div className="w-8 h-8 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center font-semibold">
                        <FlaskConical className="w-4 h-4" />
                      </div>
                      <h4 className="text-sm font-semibold text-slate-800">Higher Bioavailability</h4>
                      <p className="text-xs text-slate-500 font-light leading-relaxed">
                        Micronized active particles ensure rapid dissolution and quicker clinical onset.
                      </p>
                    </div>

                    <div className="p-4 rounded-2xl border border-slate-200 bg-white space-y-1.5 shadow-2xs">
                      <div className="w-8 h-8 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center font-semibold">
                        <ShieldCheck className="w-4 h-4" />
                      </div>
                      <h4 className="text-sm font-semibold text-slate-800">100% HPLC Purity</h4>
                      <p className="text-xs text-slate-500 font-light leading-relaxed">
                        Every commercial batch is liquid chromatography tested for exact active potency.
                      </p>
                    </div>

                    <div className="p-4 rounded-2xl border border-slate-200 bg-white space-y-1.5 shadow-2xs">
                      <div className="w-8 h-8 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center font-semibold">
                        <Factory className="w-4 h-4" />
                      </div>
                      <h4 className="text-sm font-semibold text-slate-800">Alu-Alu Moisture Seal</h4>
                      <p className="text-xs text-slate-500 font-light leading-relaxed">
                        Zone IVb blister packaging preserves complete formulation stability against tropical humidity.
                      </p>
                    </div>

                    <div className="p-4 rounded-2xl border border-slate-200 bg-white space-y-1.5 shadow-2xs">
                      <div className="w-8 h-8 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center font-semibold">
                        <Award className="w-4 h-4" />
                      </div>
                      <h4 className="text-sm font-semibold text-slate-800">Patient Adherence</h4>
                      <p className="text-xs text-slate-500 font-light leading-relaxed">
                        Affordably priced so patients complete their entire prescribed therapy without default.
                      </p>
                    </div>
                  </div>

                </div>
              )}

              {/* ------------------------------------------------------------- */}
              {/* SLIDE 3: MANUFACTURING PARTNER #2 - PURE & CURE (AKUMS GROUP) */}
              {/* ------------------------------------------------------------- */}
              {slides[currentSlideIndex].type === 'manufacturing_akums' && (
                <div className="border border-slate-200 rounded-3xl p-6 sm:p-10 lg:p-12 space-y-8 max-w-6xl mx-auto">
                  
                  {/* Top Header */}
                  <div className="text-center space-y-2 max-w-3xl mx-auto">
                    <span className="px-3 py-1 rounded-full text-[11px] font-semibold uppercase tracking-wider bg-orange-50 text-orange-800 border border-orange-200 inline-block">
                      Premier CDMO Manufacturing Backbone
                    </span>
                    <h2 className="text-2xl sm:text-4xl font-semibold text-slate-800 tracking-tight leading-tight">
                      Manufactured By Pure &amp; Cure Healthcare Pvt. Ltd.
                    </h2>
                    <p className="text-xs sm:text-sm text-slate-500 font-normal leading-relaxed">
                      A subsidiary of <strong>Akums Drugs &amp; Pharmaceuticals Ltd.</strong> — India's largest, premier Contract Development and Manufacturing Organization.
                    </p>
                  </div>

                  {/* 2-COLUMN HERO LAYOUT: Big Akums Logo Side + Top Brands Side */}
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
                    
                    {/* Left Column: Big Manufacturer Logo & Address Card */}
                    <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200 p-6 sm:p-7 flex flex-col justify-between shadow-2xs space-y-6">
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                            Manufacturer &amp; Parent Group
                          </span>
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-200">
                            India's #1 CDMO
                          </span>
                        </div>

                        {/* BIG AKUMS LOGO */}
                        <div className="w-full h-32 sm:h-36 rounded-xl bg-white border border-slate-200/80 p-4 flex items-center justify-center">
                          <img 
                            src="/images/akums_logo.png" 
                            alt="Akums Drugs &amp; Pharmaceuticals Ltd. Logo" 
                            className="max-h-24 max-w-full object-contain"
                          />
                        </div>

                        <div className="space-y-1.5 pt-1">
                          <h3 className="text-lg sm:text-xl font-bold text-slate-900 leading-snug">
                            Pure &amp; Cure Healthcare Pvt. Ltd.
                          </h3>
                          <span className="text-[11px] font-semibold text-amber-800 block">
                            (A subsidiary of Akums Drugs &amp; Pharmaceuticals Ltd.)
                          </span>
                          <p className="text-xs text-slate-500 leading-relaxed">
                            Vill. Manakpur, P.O. Lodhimajra, Baddi-173 205, Distt.-Solan, (H.P.)
                          </p>
                        </div>
                      </div>

                      <div className="pt-4 border-t border-slate-100 grid grid-cols-2 gap-2 text-left">
                        <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100">
                          <span className="text-[10px] uppercase font-semibold text-slate-400 block">Facility Hub</span>
                          <span className="text-xs font-bold text-slate-800">Baddi (H.P.)</span>
                        </div>
                        <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100">
                          <span className="text-[10px] uppercase font-semibold text-slate-400 block">Market Share</span>
                          <span className="text-xs font-bold text-amber-700">12%+ India Supply</span>
                        </div>
                      </div>
                    </div>

                    {/* Right Column: Companies & Brands Using Akums Group Facilities */}
                    <div className="lg:col-span-7 bg-slate-50/70 rounded-2xl border border-slate-200 p-6 sm:p-7 flex flex-col justify-between space-y-5">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <ShieldCheck className="w-5 h-5 text-slate-700" />
                          <h3 className="text-base sm:text-lg font-bold text-slate-900">
                            Major Pharma Giants Manufactured By Akums
                          </h3>
                        </div>
                        <p className="text-xs text-slate-500 leading-relaxed">
                          Over 1,500 active formulations engineered under identical world-scale cGMP validated production units:
                        </p>
                      </div>

                      {/* Brand Logo / Badges Grid */}
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                        {[
                          { name: 'Sun Pharma', sub: 'Specialty Formulations', color: 'border-amber-200 bg-white text-amber-900' },
                          { name: 'Abbott', sub: 'Global Nutritional & GI', color: 'border-sky-200 bg-white text-sky-900' },
                          { name: 'Cipla', sub: 'Critical & Pulmonary Care', color: 'border-blue-200 bg-white text-blue-900' },
                          { name: 'Dr. Reddy\'s', sub: 'Oncology & Therapeutic', color: 'border-slate-300 bg-white text-slate-900' },
                          { name: 'Lupin', sub: 'Cardiovascular Formulations', color: 'border-emerald-200 bg-white text-emerald-900' },
                          { name: 'Mankind', sub: 'Primary Therapeutic Care', color: 'border-purple-200 bg-white text-purple-900' },
                          { name: 'Glenmark', sub: 'Dermatology & Respiratory', color: 'border-rose-200 bg-white text-rose-900' },
                          { name: 'Torrent Pharma', sub: 'Neuro & Cardiac Lines', color: 'border-teal-200 bg-white text-teal-900' },
                          { name: 'Alkem Labs', sub: 'Anti-Infective Regimens', color: 'border-indigo-200 bg-white text-indigo-900' },
                        ].map((b) => (
                          <div 
                            key={b.name}
                            className={`p-3 rounded-xl border ${b.color} shadow-2xs flex flex-col justify-between hover:border-slate-400 transition-colors`}
                          >
                            <span className="text-sm font-bold tracking-tight block">
                              {b.name}
                            </span>
                            <span className="text-[10px] text-slate-500 font-medium block mt-1">
                              {b.sub}
                            </span>
                          </div>
                        ))}
                      </div>

                      <div className="p-3 rounded-xl bg-white border border-slate-200/90 text-[11px] text-slate-600 flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span>Ensures gold-standard clinical safety, rigorous chemical assays, and highest doctor trust for Ciplon medicines.</span>
                      </div>
                    </div>

                  </div>

                  {/* 4 Core Pillars for Akums / Pure & Cure Facility */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
                    <div className="p-4 rounded-2xl border border-slate-200 bg-white space-y-1.5 shadow-2xs">
                      <div className="w-8 h-8 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center font-semibold">
                        <Factory className="w-4 h-4" />
                      </div>
                      <h4 className="text-sm font-semibold text-slate-800">India's Largest CDMO</h4>
                      <p className="text-xs text-slate-500 font-light leading-relaxed">
                        Akums group operates world-scale facilities powering over 10-12% of India's domestic pharmaceutical supply.
                      </p>
                    </div>

                    <div className="p-4 rounded-2xl border border-slate-200 bg-white space-y-1.5 shadow-2xs">
                      <div className="w-8 h-8 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center font-semibold">
                        <FlaskConical className="w-4 h-4" />
                      </div>
                      <h4 className="text-sm font-semibold text-slate-800">Baddi Formulation Plant</h4>
                      <p className="text-xs text-slate-500 font-light leading-relaxed">
                        Vill. Manakpur, Lodhimajra, Baddi facility engineered for precise dosage form uniformity.
                      </p>
                    </div>

                    <div className="p-4 rounded-2xl border border-slate-200 bg-white space-y-1.5 shadow-2xs">
                      <div className="w-8 h-8 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center font-semibold">
                        <ShieldCheck className="w-4 h-4" />
                      </div>
                      <h4 className="text-sm font-semibold text-slate-800">Certified cGMP Controls</h4>
                      <p className="text-xs text-slate-500 font-light leading-relaxed">
                        Stringent multi-tier analytical verification from raw API intake to final blister hermetic seal.
                      </p>
                    </div>

                    <div className="p-4 rounded-2xl border border-slate-200 bg-white space-y-1.5 shadow-2xs">
                      <div className="w-8 h-8 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center font-semibold">
                        <Award className="w-4 h-4" />
                      </div>
                      <h4 className="text-sm font-semibold text-slate-800">Physician Confidence</h4>
                      <p className="text-xs text-slate-500 font-light leading-relaxed">
                        Backed by premier manufacturing standards recognized across top hospitals and practicing clinicians nationwide.
                      </p>
                    </div>
                  </div>

                </div>
              )}

              {/* ------------------------------------------------------------- */}
              {/* SLIDE 4...N: PRODUCT SLIDE (Full Screen, Large Image & Text)   */}
              {/* ------------------------------------------------------------- */}
              {slides[currentSlideIndex].type === 'product' && (
                (() => {
                  const prod = slides[currentSlideIndex].data;
                  const imageUrl =
                    prod.primary_image?.file_path ||
                    prod.primary_image?.url ||
                    prod.images?.[0]?.file_path ||
                    prod.images?.[0]?.url ||
                    '/images/ciplon_d.png';

                  return (
                    <div className="border border-slate-200 rounded-3xl p-6 sm:p-10 lg:p-12">
                      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-center">

                        {/* LEFT COLUMN: EXTRA LARGE PRODUCT PACK IMAGE */}
                        <div className="lg:col-span-6 flex flex-col items-center justify-center space-y-3">
                          <div className="w-full h-80 sm:h-[420px] lg:h-[480px] rounded-3xl border border-slate-200/90 p-8 flex items-center justify-center bg-white shadow-xs">
                            <img
                              src={imageUrl}
                              alt={prod.brand_name}
                              className="max-h-full max-w-full object-contain filter drop-shadow-md"
                              onError={(e) => {
                                e.currentTarget.src = '/images/ciplon_d.png';
                              }}
                            />
                          </div>

                          <div className="flex items-center gap-2 flex-wrap justify-center">
                            <span className="px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-slate-900 text-white shadow-2xs">
                              {prod.dosage_form || 'Formulation'}
                            </span>
                            {prod.packaging_type && (
                              <span className="px-3.5 py-1 rounded-full text-xs font-semibold text-slate-700 bg-slate-100 border border-slate-200">
                                {prod.packaging_type}
                              </span>
                            )}
                            {prod.sku && (
                              <span className="px-3 py-1 rounded-full text-[11px] font-mono font-medium text-slate-500 bg-slate-50 border border-slate-200">
                                SKU: {prod.sku}
                              </span>
                            )}
                          </div>
                        </div>

                        {/* RIGHT COLUMN: BRAND NAME, SALT & CLINICAL DETAILS */}
                        <div className="lg:col-span-6 space-y-5">
                          
                          {/* 1. Category & BRAND NAME (Prominent) */}
                          <div className="space-y-1">
                            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest block">
                              {prod.category?.name || 'Therapeutic Formulation'}
                            </span>
                            <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
                              {prod.brand_name}
                            </h1>
                          </div>

                          {/* 2. GENERIC NAME / ACTIVE SALT (Large & Distinct) */}
                          <div className="p-4 sm:p-5 rounded-2xl border-2 border-slate-800 bg-slate-50 shadow-2xs space-y-1">
                            <div className="flex items-center justify-between">
                              <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
                                Active Generic Molecule / Salt Composition
                              </span>
                              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
                                Verified Assay
                              </span>
                            </div>
                            <p className="text-lg sm:text-2xl font-bold text-slate-900 leading-snug">
                              {prod.generic_name}
                            </p>
                          </div>

                          {/* 3. Clinical Indications & Dosage (Side-by-Side) */}
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                            <div className="p-4 rounded-xl border border-slate-200 bg-white space-y-1.5 shadow-2xs">
                              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block">
                                Therapeutic Indications
                              </span>
                              <p className="text-xs text-slate-700 font-normal leading-relaxed">
                                {prod.indications || 'Primary and secondary targeted clinical therapy.'}
                              </p>
                            </div>

                            <div className="p-4 rounded-xl border border-slate-200 bg-white space-y-1.5 shadow-2xs">
                              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block">
                                Recommended Regimen
                              </span>
                              <p className="text-xs text-slate-700 font-normal leading-relaxed">
                                {prod.directions || 'As prescribed by physician or healthcare specialist.'}
                              </p>
                            </div>
                          </div>

                          {/* 4. Active Compositions Strength Badges */}
                          {prod.compositions && prod.compositions.length > 0 && (
                            <div className="pt-1 space-y-2">
                              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block">
                                Active Ingredient Strengths
                              </span>
                              <div className="flex flex-wrap gap-2">
                                {prod.compositions.map((comp) => (
                                  <span
                                    key={comp.id}
                                    className="px-3 py-1.5 rounded-xl bg-slate-100 text-xs font-medium text-slate-800 border border-slate-200/80 shadow-2xs"
                                  >
                                    <span className="text-slate-500">{comp.ingredient_name}:</span>{' '}
                                    <span className="font-mono text-slate-900 font-bold">{comp.strength} {comp.unit}</span>
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}

                        </div>

                      </div>
                    </div>
                  );
                })()
              )}

              {/* ------------------------------------------------------------- */}
              {/* SLIDE CLOSING: RECAP (Full Width, Clean)                      */}
              {/* ------------------------------------------------------------- */}
              {slides[currentSlideIndex].type === 'recap' && (
                <div className="border border-slate-200 rounded-3xl p-8 sm:p-14 text-center space-y-6 max-w-3xl mx-auto">
                  <div className="w-14 h-14 rounded-full border border-slate-200 bg-slate-50 flex items-center justify-center mx-auto text-slate-800">
                    <CheckCircle2 className="w-7 h-7" />
                  </div>

                  <div className="space-y-1.5">
                    <h2 className="text-2xl sm:text-4xl font-bold text-slate-900">
                      Thank You{selectedDoctor ? `, Dr. ${selectedDoctor.name}` : ''}
                    </h2>
                    <p className="text-sm text-slate-500">
                      Formulation detailing session completed.
                    </p>
                  </div>

                  {/* Medicines pills */}
                  <div className="flex flex-wrap justify-center gap-2 max-h-40 overflow-y-auto pt-2">
                    {includedProducts.map((p) => (
                      <span
                        key={p.id}
                        className="px-3 py-1.5 rounded-lg border border-slate-200 bg-slate-50 text-xs text-slate-800 font-semibold"
                      >
                        {p.brand_name}
                      </span>
                    ))}
                  </div>

                  <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
                    <Link
                      href="/mr/visits"
                      className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-medium text-xs transition-colors cursor-pointer shadow-xs"
                    >
                      Log Field Visit &amp; Samples
                    </Link>

                    <button
                      type="button"
                      onClick={() => setCurrentSlideIndex(0)}
                      className="px-5 py-2.5 rounded-xl border border-slate-200/80 text-slate-700 hover:bg-slate-50 text-xs font-medium cursor-pointer"
                    >
                      Restart Slideshow
                    </button>
                  </div>
                </div>
              )}

            </div>
          </div>

          {/* Bottom Bar: Flat, Simple Previous / Next Buttons */}
          <div className="h-14 px-4 sm:px-6 border-t border-slate-200 flex items-center justify-between shrink-0 bg-white">
            <button
              type="button"
              onClick={goToPrevSlide}
              disabled={currentSlideIndex === 0}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl border border-slate-200/80 text-slate-700 hover:bg-slate-50 disabled:opacity-30 disabled:pointer-events-none text-xs font-medium cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Previous</span>
            </button>

            <span className="text-[11px] text-slate-400">
              Swipe or tap Next &rarr;
            </span>

            <button
              type="button"
              onClick={goToNextSlide}
              disabled={currentSlideIndex === totalSlides - 1}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white disabled:opacity-30 disabled:pointer-events-none text-xs font-medium cursor-pointer shadow-xs"
            >
              <span>Next</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

        </div>
      )}

    </MRLayout>
  );
}
