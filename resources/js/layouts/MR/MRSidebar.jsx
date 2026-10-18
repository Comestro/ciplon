import { Link, usePage } from '@inertiajs/react';
import { 
  LayoutDashboard, 
  UserCheck, 
  MapPin, 
  Pill, 
  Gift, 
  CalendarClock, 
  Target, 
  TrendingUp, 
  FileText, 
  Bell, 
  Megaphone, 
  User, 
  LogOut, 
  X,
  Activity
} from 'lucide-react';

export default function MRSidebar({ isOpen, onClose }) {
  const { url, props } = usePage();
  const currentPath = url.split('?')[0];

  const authUser = props.auth?.user || {};
  const userName = authUser.name || 'Medical Representative';

  // Navigation Items
  const navItems = [
    { 
      label: 'Dashboard', 
      href: '/mr/dashboard', 
      icon: LayoutDashboard, 
      active: currentPath === '/mr/dashboard', 
      enabled: true 
    },
    { 
      label: 'Doctors', 
      href: '/mr/doctors', 
      icon: UserCheck, 
      active: currentPath === '/mr/doctors' || currentPath.startsWith('/mr/doctors'), 
      enabled: true 
    },
    { 
      label: 'Visits & Daily Planner', 
      href: '/mr/visits', 
      icon: CalendarClock, 
      active: currentPath === '/mr/visits' || currentPath.startsWith('/mr/visits') || currentPath === '/mr/schedule', 
      enabled: true 
    },
    { label: 'Products', href: '/mr/products', icon: Pill, active: currentPath === '/mr/products' || currentPath.startsWith('/mr/products'), enabled: true },
    { label: 'Samples', href: '#', icon: Gift, enabled: false },
    { label: 'Targets', href: '#', icon: Target, enabled: false },
    { label: 'Performance', href: '#', icon: TrendingUp, enabled: false },
    { label: 'Daily Reports', href: '#', icon: FileText, enabled: false },
    { label: 'Notifications', href: '#', icon: Bell, enabled: false },
    { label: 'Announcements', href: '#', icon: Megaphone, enabled: false },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div 
          onClick={onClose}
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-40 lg:hidden transition-opacity"
          aria-hidden="true"
        />
      )}

      {/* Sidebar Container */}
      <aside className={`fixed top-0 bottom-0 left-0 z-50 w-64 bg-white border-r border-slate-200/80 flex flex-col transition-transform duration-200 ease-in-out lg:translate-x-0 ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        {/* Brand / Portal Header */}
        <div className="h-16 px-5 border-b border-slate-100 flex items-center justify-between">
          <Link href="/mr/dashboard" className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-teal-700 text-white flex items-center justify-center font-bold text-base shadow-sm">
              <Activity className="w-5 h-5 stroke-[2.2]" />
            </div>
            <div>
              <span className="block text-sm font-bold tracking-tight text-slate-900 leading-none">Ciplon</span>
              <span className="text-[10px] uppercase tracking-wider font-semibold text-teal-700 block mt-0.5">MR Field Portal</span>
            </div>
          </Link>

          <button 
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 lg:hidden cursor-pointer"
            aria-label="Close sidebar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Section */}
        <div className="flex-1 overflow-y-auto px-3.5 py-4 space-y-1">
          <div className="px-3 pb-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">
            MR Field Operations
          </div>

          {navItems.map((item) => {
            const Icon = item.icon;

            if (item.enabled) {
              return (
                <Link
                  key={item.label}
                  href={item.href}
                  onClick={() => {
                    if (isOpen && typeof onClose === 'function') {
                      onClose();
                    }
                  }}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                    item.active 
                      ? 'bg-teal-50 text-teal-800 shadow-xs' 
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${item.active ? 'text-teal-700 stroke-[2.2]' : 'text-slate-400'}`} />
                  <span className="flex-1 truncate">{item.label}</span>
                </Link>
              );
            }

            return (
              <div
                key={item.label}
                className="flex items-center gap-3 px-3 py-2 rounded-xl text-xs text-slate-400 font-medium cursor-not-allowed select-none group"
                title={`${item.label} (Future Module)`}
              >
                <Icon className="w-4 h-4 text-slate-300" />
                <span className="flex-1 truncate">{item.label}</span>
                <span className="text-[9px] uppercase tracking-wider bg-slate-100 text-slate-400 px-1.5 py-0.5 rounded font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                  Soon
                </span>
              </div>
            );
          })}
        </div>

        {/* Bottom Profile & Actions */}
        <div className="p-3 border-t border-slate-100 space-y-1 bg-slate-50/50">
          <div className="px-3 py-2 flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-teal-100/80 text-teal-800 font-bold text-xs flex items-center justify-center shrink-0">
              {userName.charAt(0).toUpperCase()}
            </div>
            <div className="min-w-0 flex-1">
              <span className="block text-xs font-semibold text-slate-900 truncate">{userName}</span>
              <span className="block text-[10px] text-teal-700 font-medium truncate">Field Representative</span>
            </div>
          </div>

          <Link
            href="/logout"
            method="post"
            as="button"
            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-semibold text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer text-left"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </Link>
        </div>
      </aside>
    </>
  );
}
