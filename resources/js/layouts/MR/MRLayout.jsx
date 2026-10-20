import { useState } from 'react';
import { Link, usePage } from '@inertiajs/react';
import MRSidebar from './MRSidebar';
import MRHeader from './MRHeader';
import { 
  LayoutDashboard, 
  Presentation, 
  CalendarClock, 
  UserCheck, 
  Pill 
} from 'lucide-react';

export default function MRLayout({ children, title = 'MR Dashboard' }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { url } = usePage();
  const currentPath = url.split('?')[0];

  const mobileNav = [
    { label: 'Dashboard', href: '/mr/dashboard', icon: LayoutDashboard, active: currentPath === '/mr/dashboard' },
    { label: 'Detailing', href: '/mr/detailing', icon: Presentation, active: currentPath.startsWith('/mr/detailing') },
    { label: 'Visits', href: '/mr/visits', icon: CalendarClock, active: currentPath.startsWith('/mr/visits') },
    { label: 'Doctors', href: '/mr/doctors', icon: UserCheck, active: currentPath.startsWith('/mr/doctors') },
    { label: 'Products', href: '/mr/products', icon: Pill, active: currentPath.startsWith('/mr/products') },
  ];

  return (
    <div className="min-h-screen bg-[#f8f9fc] flex antialiased text-slate-800 font-sans">
      <MRSidebar 
        isOpen={sidebarOpen} 
        onClose={() => setSidebarOpen(false)} 
      />

      <div className="flex-1 flex flex-col lg:pl-64 min-w-0 pb-16 lg:pb-0">
        <MRHeader 
          onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} 
          title={title}
        />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>

      {/* Mobile Bottom Navigation Bar (Matching SpaceWork Phone UI) */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200/80 px-2 py-1.5 flex items-center justify-around shadow-lg">
        {mobileNav.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.label}
              href={item.href}
              className={`flex flex-col items-center justify-center py-1 px-3 rounded-xl text-[10px] font-medium transition-colors ${
                item.active 
                  ? 'text-violet-700 font-semibold' 
                  : 'text-slate-400 hover:text-slate-700'
              }`}
            >
              <Icon className={`w-5 h-5 mb-0.5 ${item.active ? 'text-violet-700 stroke-[2]' : 'text-slate-400'}`} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
