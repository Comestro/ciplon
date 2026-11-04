import { useState } from 'react';
import { router, usePage } from '@inertiajs/react';
import PublicLayout from '../../layouts/PublicLayout';
import SeoHead from '../../components/common/SeoHead';
import IntasHeroBanner from '../../components/home/IntasHeroBanner';
import CompanyIntroSection from '../../components/home/CompanyIntroSection';
import ExcellenceStatsSection from '../../components/home/ExcellenceStatsSection';
import ScienceIntoSmilesSection from '../../components/home/ScienceIntoSmilesSection';
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

  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'MedicalOrganization',
    name: 'Ciplon Pharma Private Limited',
    alternateName: 'Ciplon Pharma',
    url: 'https://www.ciplonpharma.in',
    logo: 'https://www.ciplonpharma.in/images/ciplon_logo.png',
    description:
      'ISO 9001:2015 certified pharmaceutical formulations company marketing WHO-GMP finished formulations across India.',
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'M24/A, KH No. 294, 1st Floor, Batla House, Okhla, Jamia Nagar, South Delhi',
      addressLocality: 'New Delhi',
      addressRegion: 'Delhi',
      postalCode: '110025',
      addressCountry: 'IN',
    },
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: '+91-8004587290',
      contactType: 'customer support',
      areaServed: 'IN',
      availableLanguage: ['en', 'hi'],
    },
  };

  return (
    <PublicLayout companyData={companyData} categories={categories}>
      <SeoHead
        title="Ciplon Pharma — WHO-GMP & ISO 9001:2015 Formulations & PCD Pharma"
        description="Ciplon Pharma Private Limited delivers WHO-GMP certified finished pharmaceutical formulations, PCD pharma franchises, hospital supplies, and high-quality generics across India."
        canonicalUrl="https://www.ciplonpharma.in"
        schemaJson={organizationSchema}
      />
      <div className="w-full bg-white text-slate-900 selection:bg-[#c59324] selection:text-white">
        {/* 1. Hero Banner with Carousel, Quality Ribbon & 4 Feature Cards */}
        <IntasHeroBanner
          onExploreProducts={handleScrollToProducts}
          onContactUs={handleContactUs}
          onOpenEnquiryModal={() => setIsEnquiryModalOpen(true)}
        />

        {/* 2. Featured Products (Moved Up directly under Hero for instant product discoverability) */}
        <FeaturedProductsSection
          products={products}
          onOpenEnquiryModal={() => setIsEnquiryModalOpen(true)}
        />

        {/* 3. Company Introduction ("CIPLON PHARMACEUTICALS LTD.") */}
        <CompanyIntroSection />

        {/* 4. Excellence is a Matter of Fact (Stats Grid Banner) */}
        <ExcellenceStatsSection />

        {/* 5. Transforming Science into Smiles (Formulation Quality & WHO-GMP Standards) */}
        <ScienceIntoSmilesSection />

        {/* 6. Institutional Supply Inquiry Modal */}
        <EnquiryModal
          isOpen={isEnquiryModalOpen}
          onClose={() => setIsEnquiryModalOpen(false)}
        />
      </div>
    </PublicLayout>
  );
}
