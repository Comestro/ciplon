import { useState } from 'react';
import { router, usePage } from '@inertiajs/react';
import PublicLayout from '../../layouts/PublicLayout';
import IntasHeroBanner from '../../components/home/IntasHeroBanner';
import CompanyIntroSection from '../../components/home/CompanyIntroSection';
import ExcellenceStatsSection from '../../components/home/ExcellenceStatsSection';
import ScienceIntoSmilesSection from '../../components/home/ScienceIntoSmilesSection';
import LatestNewsSection from '../../components/home/LatestNewsSection';
import FeaturedProductsSection from '../../components/home/FeaturedProductsSection';
import EnquiryModal from '../../components/home/EnquiryModal';

export default function HomePage({ featuredProducts = [], categories = [], company = null }) {
  const { props } = usePage();
  const companyData = company || props.company || {};
  const products = featuredProducts.length > 0 ? featuredProducts : [];
  const [isEnquiryModalOpen, setIsEnquiryModalOpen] = useState(false);

  // Smooth scroll helper to products catalog
  const handleScrollToProducts = () => {
    const el = document.getElementById('products');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    } else {
      router.get('/products');
    }
  };

  // Contact / Supply inquiry helper
  const handleContactUs = () => {
    setIsEnquiryModalOpen(true);
  };

  return (
    <PublicLayout companyData={companyData} categories={categories}>
      <div className="w-full bg-white text-slate-900 selection:bg-[#0069b4] selection:text-white">
        {/* 1. Hero Banner with Carousel, Quality Ribbon & 4 Feature Cards */}
        <IntasHeroBanner
          onExploreProducts={handleScrollToProducts}
          onContactUs={handleContactUs}
          onOpenEnquiryModal={() => setIsEnquiryModalOpen(true)}
        />

        {/* 2. Company Introduction ("CIPLON PHARMACEUTICALS LTD.") */}
        <CompanyIntroSection />

        {/* 3. Excellence is a Matter of Fact (Stats Grid Banner) */}
        <ExcellenceStatsSection />

        {/* 4. Transforming Science into Smiles (R&D Section with Circular Montage) */}
        <ScienceIntoSmilesSection />

        {/* 5. Latest News Section */}
        <LatestNewsSection />

        {/* 6. Featured Products (3D Pharma Carton Boxes & Filters) */}
        <FeaturedProductsSection
          products={products}
          onOpenEnquiryModal={() => setIsEnquiryModalOpen(true)}
        />

        {/* 7. Institutional Supply Inquiry Modal */}
        <EnquiryModal
          isOpen={isEnquiryModalOpen}
          onClose={() => setIsEnquiryModalOpen(false)}
        />
      </div>
    </PublicLayout>
  );
}
