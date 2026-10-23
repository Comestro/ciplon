import { useState, useEffect, useRef } from 'react';
import { usePage } from '@inertiajs/react';
import toast from 'react-hot-toast';
import AdminSidebar from '../components/admin/AdminSidebar';
import AdminNavbar from '../components/admin/AdminNavbar';
import ContentLoader from '../components/common/ContentLoader';

export default function AdminLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { flash } = usePage().props;
  const lastToastRef = useRef('');

  useEffect(() => {
    if (flash?.success && flash.success !== lastToastRef.current) {
      lastToastRef.current = flash.success;
      toast.success(flash.success);
    }
    if (flash?.error && flash.error !== lastToastRef.current) {
      lastToastRef.current = flash.error;
      toast.error(flash.error);
    }
  }, [flash]);

  return (
    <div className="min-h-screen bg-[#f8f9fc] flex antialiased text-slate-800 font-sans">
      <AdminSidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <div className="flex-1 flex flex-col lg:pl-64 min-w-0">
        <AdminNavbar onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto relative min-h-[calc(100vh-5rem)]">
          <ContentLoader />
          {children}
        </main>
      </div>
    </div>
  );
}