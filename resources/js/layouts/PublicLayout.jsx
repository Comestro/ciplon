import { useState, useEffect } from 'react';
import { usePage } from '@inertiajs/react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import EnquiryModal from '../components/home/EnquiryModal';

export default function PublicLayout({ children, companyData: propCompanyData, categories: propCategories }) {
  const { url, props } = usePage();
  const companyData = propCompanyData || props.company || {};
  const categories = propCategories || props.navCategories || [];
  const [isEnquiryModalOpen, setIsEnquiryModalOpen] = useState(false);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [url]);

  return (
    <div className="min-h-screen flex flex-col bg-white text-slate-900 selection:bg-[#c59324] selection:text-white antialiased">
      <Header
        companyData={companyData}
        categories={categories}
        onOpenEnquiryModal={() => setIsEnquiryModalOpen(true)}
      />

      <main className="flex-1 w-full">
        {typeof children === 'function' 
          ? children({ openEnquiryModal: () => setIsEnquiryModalOpen(true) }) 
          : children}
      </main>

      <Footer
        companyData={companyData}
        categories={categories}
      />

      <EnquiryModal
        isOpen={isEnquiryModalOpen}
        onClose={() => setIsEnquiryModalOpen(false)}
      />
    </div>
  );
}
