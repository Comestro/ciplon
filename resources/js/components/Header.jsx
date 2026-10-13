import { useState, useEffect } from 'react';
import { Link, router, usePage } from '@inertiajs/react';
import { Menu, X, ArrowRight, ShieldCheck, Search, LogIn } from 'lucide-react';
import Container from './common/Container';
import Button from './common/Button';

export default function Header({ companyData, onOpenEnquiryModal }) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);

  const { url } = usePage();
  const currentPath = url.split('?')[0];
  const isProductsPage = currentPath.startsWith('/products');

  const getQueryParam = (param) => {
    try {
      const searchParams = new URLSearchParams(url.split('?')[1] || '');
      return searchParams.get(param) || '';
    } catch {
      return '';
    }
  };

  const [searchTerm, setSearchTerm] = useState(getQueryParam('search'));

  useEffect(() => {
    setSearchTerm(getQueryParam('search'));
  }, [url]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const trimmed = searchTerm.trim();
    if (trimmed) {
      router.get(`/products?search=${encodeURIComponent(trimmed)}`);
      setMobileSearchOpen(false);
      setMobileMenuOpen(false);
    } else if (isProductsPage) {
      router.get('/products');
    }
  };

  const handleClearSearch = () => {
    setSearchTerm('');
    if (isProductsPage && getQueryParam('search')) {
      router.get('/products');
    }
  };

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Formulations', href: '/products' },
    { name: 'Therapeutic Areas', href: '/#therapeutic-areas' },
    { name: 'Quality & GMP', href: '/#quality' },
    { name: 'R&D Pipeline', href: '/#rd' },
    { name: 'Corporate', href: '/#about' },
  ];

  const rawCompanyName = companyData?.company_name || companyData?.companyName || 'Ciplon Life Sciences';
  const companyPhone = companyData?.company_phone || companyData?.companyPhone || '+91 800 458 7290';
  const logoUrl = companyData?.logo_url || companyData?.logoUrl;

  const displayBrandName = rawCompanyName
    .toUpperCase()
    .replace(' PHARMACEUTICALS', '')
    .replace(' LIFE SCIENCES', '')
    .replace(' PVT. LTD.', '')
    .replace(' LTD.', '')
    .trim() || 'CIPLON';

  return (
    <header className="sticky top-0 z-50 w-full transition-all duration-300 shadow-xs">
      {/* Main Navigation Bar */}
      <nav
        className={`bg-white/95 backdrop-blur-md transition-all duration-200 ${
          isScrolled ? 'border-b border-slate-200/90 py-2.5 shadow-sm' : 'border-b border-slate-200 py-3 sm:py-4'
        }`}
      >
        <Container size="wide">
          <div className="flex items-center justify-between gap-4 xl:gap-8">
            {/* Intas-Style Oval Capsule Logo - Significantly enlarged for crisp readability */}
            <Link
              href="/"
              onClick={() => {
                if (window.location.pathname === '/') {
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }
              }}
              className="flex items-center shrink-0 group focus:outline-none"
              title="Ciplon Pharmaceuticals"
            >
              <img
                src={logoUrl || '/images/ciplon_logo.png'}
                alt="Ciplon Pharma Private Limited"
                className="h-12 sm:h-14 md:h-16 lg:h-17 xl:h-18 w-auto max-w-[260px] sm:max-w-[320px] lg:max-w-[360px] object-contain transition-all drop-shadow-xs"
                onError={(e) => {
                  e.currentTarget.src = '/images/ciplon_logo.png';
                }}
              />
            </Link>

            {/* Desktop Navigation Links (Clean Semibold Poppins Font, Wide Dropdowns, Responsive Spacing) */}
            <nav className="hidden lg:flex items-center gap-3 xl:gap-5 2xl:gap-6 text-xs xl:text-[13px] font-semibold tracking-wide text-slate-700 whitespace-nowrap">
              {/* ABOUT US with dropdown */}
              <div className="relative group/menu py-2">
                <a
                  href="#about"
                  className="flex items-center gap-1 hover:text-[#c59324] transition-colors uppercase whitespace-nowrap cursor-pointer"
                >
                  <span>ABOUT US</span>
                  <span className="text-[8px] text-slate-400 group-hover/menu:text-[#c59324] transition-transform group-hover/menu:rotate-180">▼</span>
                </a>
                <div className="absolute top-full left-0 hidden group-hover/menu:block min-w-[240px] w-max bg-white rounded-2xl shadow-xl border border-slate-100 py-2.5 px-1.5 z-50 animate-in fade-in slide-in-from-top-1 duration-150">
                  <a href="#about" className="block px-4 py-2 text-xs font-medium text-slate-700 hover:bg-amber-50/60 hover:text-[#c59324] rounded-lg transition-colors whitespace-nowrap">Corporate Overview</a>
                  <a href="#excellence" className="block px-4 py-2 text-xs font-medium text-slate-700 hover:bg-amber-50/60 hover:text-[#c59324] rounded-lg transition-colors whitespace-nowrap">Excellence & Growth</a>
                  <a href="#science" className="block px-4 py-2 text-xs font-medium text-slate-700 hover:bg-amber-50/60 hover:text-[#c59324] rounded-lg transition-colors whitespace-nowrap">Scientific Vision</a>
                  <a href="#news" className="block px-4 py-2 text-xs font-medium text-slate-700 hover:bg-amber-50/60 hover:text-[#c59324] rounded-lg transition-colors whitespace-nowrap">Corporate Media</a>
                </div>
              </div>

              {/* BUSINESS OPERATIONS (Responsive label to prevent laptop overflow) */}
              <a
                href="#business"
                className="hover:text-[#c59324] transition-colors uppercase whitespace-nowrap"
              >
                <span className="hidden xl:inline">BUSINESS </span>OPERATIONS
              </a>

              {/* R&D with dropdown - generous min-width to prevent any text wrap */}
              <div className="relative group/menu py-2">
                <a
                  href="#science"
                  className="flex items-center gap-1 hover:text-[#c59324] transition-colors uppercase whitespace-nowrap cursor-pointer"
                >
                  <span>R&D</span>
                  <span className="text-[8px] text-slate-400 group-hover/menu:text-[#c59324] transition-transform group-hover/menu:rotate-180">▼</span>
                </a>
                <div className="absolute top-full left-0 hidden group-hover/menu:block min-w-[260px] w-max bg-white rounded-2xl shadow-xl border border-slate-100 py-2 px-1 z-50 animate-in fade-in slide-in-from-top-1 duration-150">
                  <a href="#science" className="block px-4 py-2 text-xs font-medium text-slate-700 hover:bg-amber-50/60 hover:text-[#c59324] rounded-lg transition-colors whitespace-nowrap">R&D Infrastructure</a>
                  <a href="#science" className="block px-4 py-2 text-xs font-medium text-slate-700 hover:bg-amber-50/60 hover:text-[#c59324] rounded-lg transition-colors whitespace-nowrap">Formulations & Biosimilars</a>
                  <a href="#science" className="block px-4 py-2 text-xs font-medium text-slate-700 hover:bg-amber-50/60 hover:text-[#c59324] rounded-lg transition-colors whitespace-nowrap">Regulatory Dossiers</a>
                </div>
              </div>

              {/* MANUFACTURING with dropdown */}
              <div className="relative group/menu py-2">
                <a
                  href="#manufacturing"
                  className="flex items-center gap-1 hover:text-[#c59324] transition-colors uppercase whitespace-nowrap cursor-pointer"
                >
                  <span>MANUFACTURING</span>
                  <span className="text-[8px] text-slate-400 group-hover/menu:text-[#c59324] transition-transform group-hover/menu:rotate-180">▼</span>
                </a>
                <div className="absolute top-full left-0 hidden group-hover/menu:block min-w-[240px] w-max bg-white rounded-2xl shadow-xl border border-slate-100 py-2 px-1 z-50 animate-in fade-in slide-in-from-top-1 duration-150">
                  <a href="#manufacturing" className="block px-4 py-2 text-xs font-medium text-slate-700 hover:bg-amber-50/60 hover:text-[#c59324] rounded-lg transition-colors whitespace-nowrap">WHO-GMP Facilities</a>
                  <a href="#manufacturing" className="block px-4 py-2 text-xs font-medium text-slate-700 hover:bg-amber-50/60 hover:text-[#c59324] rounded-lg transition-colors whitespace-nowrap">Robotics & Automation</a>
                  <a href="#manufacturing" className="block px-4 py-2 text-xs font-medium text-slate-700 hover:bg-amber-50/60 hover:text-[#c59324] rounded-lg transition-colors whitespace-nowrap">Quality Control (QC)</a>
                </div>
              </div>

              {/* PRODUCTS */}
              <Link
                href="/products"
                className="hover:text-[#c59324] transition-colors uppercase whitespace-nowrap"
              >
                PRODUCTS
              </Link>

              {/* MEDIA */}
              <a
                href="#news"
                className="hover:text-[#c59324] transition-colors uppercase whitespace-nowrap"
              >
                MEDIA
              </a>

              {/* CONTACT */}
              <button
                type="button"
                onClick={() => {
                  if (typeof onOpenEnquiryModal === 'function') {
                    onOpenEnquiryModal();
                  } else {
                    const el = document.getElementById('contact');
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                  }
                }}
                className="hover:text-[#c59324] transition-colors uppercase whitespace-nowrap cursor-pointer"
              >
                CONTACT
              </button>
            </nav>

            {/* Right Side: Search Icon + Accord Partner / MR Portal Badge (Matching Intas Screenshot) */}
            <div className="hidden md:flex items-center gap-4 shrink-0">
              {/* Minimalist Search Icon Button */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setMobileSearchOpen(!mobileSearchOpen)}
                  className="p-1.5 text-slate-600 hover:text-[#c59324] transition-colors cursor-pointer rounded-full hover:bg-amber-50/50"
                  aria-label="Search"
                  title="Search products and molecules"
                >
                  <Search className="w-4 h-4 stroke-[2.2]" />
                </button>

                {/* Floating Search Popover if open */}
                {mobileSearchOpen && (
                  <div className="absolute right-0 top-full mt-2 w-72 bg-white rounded-2xl shadow-2xl border border-slate-200 p-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                    <form onSubmit={handleSearchSubmit} className="relative w-full">
                      <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                      <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Search molecules, brands..."
                        autoFocus
                        className="w-full pl-9 pr-7 py-1.5 bg-slate-50 focus:bg-white border border-slate-200 focus:border-[#c59324] rounded-xl text-xs text-slate-800 focus:outline-none"
                      />
                      {searchTerm && (
                        <button
                          type="button"
                          onClick={() => setSearchTerm('')}
                          className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </form>
                  </div>
                )}
              </div>

              {/* Accord Partner / MR Portal Logo (styled like & accord in orange) */}
              <Link
                href="/login"
                className="flex items-center gap-1.5 text-[#e05e00] hover:text-[#c44e00] transition-colors group py-1 px-1 focus:outline-none"
                title="MR Portal & Accord Healthcare Partner Network"
              >
              </Link>
            </div>

            {/* Mobile Actions: Search toggle & Hamburger */}
            <div className="flex items-center gap-1.5 lg:hidden">
              <button
                type="button"
                onClick={() => setMobileSearchOpen(!mobileSearchOpen)}
                className={`p-2 rounded-xl text-slate-700 hover:bg-slate-100 transition-colors md:hidden ${
                  mobileSearchOpen ? 'bg-teal-50 text-teal-700' : ''
                }`}
                aria-label="Toggle mobile search"
              >
                <Search className="w-5 h-5" />
              </button>

              <button
                type="button"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 rounded-xl text-slate-700 hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-teal-600 cursor-pointer"
                aria-label="Toggle navigation menu"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>

          {/* Expandable Mobile Search Row */}
          {mobileSearchOpen && (
            <div className="md:hidden mt-2.5 pt-2.5 border-t border-slate-100 animate-in fade-in slide-in-from-top-1 duration-200">
              <form onSubmit={handleSearchSubmit} className="relative w-full">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search molecules, brands, indications..."
                  autoFocus
                  className="w-full pl-9 pr-8 py-2 bg-slate-100/90 focus:bg-white border border-slate-200 focus:border-teal-500 rounded-xl text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500/20 transition-all"
                />
                {searchTerm && (
                  <button
                    type="button"
                    onClick={handleClearSearch}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer p-0.5"
                    aria-label="Clear search"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </form>
            </div>
          )}

          {/* Mobile Menu Dropdown */}
          {mobileMenuOpen && (
            <div className="lg:hidden mt-3 pt-3 border-t border-slate-100 pb-4 space-y-2 bg-white animate-in fade-in duration-200">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-2 rounded-lg text-xs font-semibold text-slate-800 hover:bg-teal-50 hover:text-teal-700 transition-colors"
                >
                  {link.name}
                </Link>
              ))}

              <Link
                href="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-lg text-xs font-semibold text-slate-700 hover:bg-teal-50 hover:text-teal-700 transition-colors flex items-center gap-2"
              >
                <LogIn className="w-4 h-4 text-slate-500" />
                <span>Portal Login</span>
              </Link>

              <div className="pt-2 mt-2 border-t border-slate-100 space-y-2">
                <Button
                  variant="primary"
                  className="w-full justify-center bg-teal-700 hover:bg-teal-800 text-white text-xs font-semibold py-2.5"
                  icon={ArrowRight}
                  href="/products"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  View Product Catalog
                </Button>

                {companyPhone && (
                  <div className="pt-2 text-center text-xs text-slate-500">
                    <a href={`tel:${companyPhone.replace(/\s+/g, '')}`} className="block py-1 font-medium text-teal-700">
                      {companyPhone}
                    </a>
                  </div>
                )}
              </div>
            </div>
          )}
        </Container>
      </nav>
    </header>
  );
}
