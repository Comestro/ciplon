import { useState } from 'react';
import { Link, usePage } from '@inertiajs/react';
import { 
  LayoutDashboard, 
  UserCheck, 
  Pill, 
  Presentation,
  Gift, 
  CalendarClock, 
  Target, 
  TrendingUp, 
  FileText, 
  Bell, 
  Megaphone, 
  LogOut, 
  X,
  Search,
  ChevronDown,
  Sparkles,
  Layers
} from 'lucide-react';

export default function MRSidebar({ isOpen, onClose }) {
  const { url, props } = usePage();
  const currentPath = url.split('?')[0];

  const authUser = props.auth?.user || {};
  const userName = authUser.name || 'Medical Representative';
  const [searchQuery, setSearchQuery] = useState('');

  // Primary Navigation Items
  const navItems = [
    { 
      label: 'Dashboard', 
      href: '/mr/dashboard', 
      icon: LayoutDashboard, 
      active: currentPath === '/mr/dashboard', 
      enabled: true 
    },
    { 
      label: 'Doctor E-Detailing', 
      href: '/mr/detailing', 
      icon: Presentation, 
      active: currentPath === '/mr/detailing' || currentPath.startsWith('/mr/detailing'), 
      enabled: true,
      badge: 'Deck'
    },
    { 
      label: 'Doctor Directory', 
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
    { 
      label: 'Product Visual Aids', 
      href: '/mr/products', 
      icon: Pill, 
      active: currentPath === '/mr/products' || currentPath.startsWith('/mr/products'), 
      enabled: true 
    },
  ];

  // Secondary Modules
  const secondaryItems = [
    { label: 'Samples & Stock', href: '#', icon: Gift, enabled: false },
    { label: 'Monthly Targets', href: '#', icon: Target, enabled: false },
    { label: 'Performance', href: '#', icon: TrendingUp, enabled: false },
    { label: 'Daily Call Reports', href: '#', icon: FileText, enabled: false },
  ];

  const filteredNavItems = navItems.filter((i) => 
    i.label.toLowerCase().includes(searchQuery.toLowerCase())
  );

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

      {/* Sidebar Container (SpaceWork Inspired) */}
      <aside className={`fixed top-0 bottom-0 left-0 z-50 w-64 bg-[#fbfbfd] border-r border-slate-200/80 flex flex-col transition-transform duration-200 ease-in-out lg:translate-x-0 ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        
        {/* Workspace Switcher Pill & Notifications */}
        <div className="h-16 px-4 border-b border-slate-100 flex items-center justify-between">
          <Link 
            href="/mr/dashboard" 
            className="flex items-center gap-2.5 px-2 py-1.5 rounded-xl hover:bg-slate-200/60 transition-colors group cursor-pointer"
          >
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-violet-600 via-indigo-600 to-purple-700 text-white flex items-center justify-center font-semibold text-xs">
              CP
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-semibold text-slate-800 tracking-tight">Ciplon MR</span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-700 transition-colors" />
            </div>
          </Link>

          <div className="flex items-center gap-1">
            <Link
              href="/mr/visits"
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-800 hover:bg-slate-200/60 transition-colors relative"
              title="Notifications & Tasks"
            >
              <Bell className="w-4 h-4" />
              <span className="w-1.5 h-1.5 bg-violet-600 rounded-full absolute top-1.5 right-1.5 ring-2 ring-white" />
            </Link>

            <button 
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 lg:hidden cursor-pointer"
              aria-label="Close sidebar"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Search & Commands Pill */}
        <div className="p-3">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search & commands"
              className="w-full bg-slate-200/60 hover:bg-slate-200/80 focus:bg-white border border-transparent focus:border-slate-300 rounded-xl pl-8 pr-8 py-1.5 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none transition-all font-normal"
            />
            <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] font-mono text-slate-400 bg-white border border-slate-200 px-1 py-0.2 rounded">
              ⌘K
            </span>
          </div>
        </div>

        {/* Navigation Section */}
        <div className="flex-1 overflow-y-auto px-3 py-1 space-y-4">
          {/* Main Operations */}
          <div>
            <div className="px-2.5 pb-1.5 text-[10px] font-medium uppercase tracking-wider text-slate-400">
              Workspace
            </div>
            <div className="space-y-0.5">
              {filteredNavItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.label}
                    href={item.href}
                    onClick={() => {
                      if (isOpen && typeof onClose === 'function') {
                        onClose();
                      }
                    }}
                    className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                      item.active 
                        ? 'bg-slate-900 text-white font-medium' 
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
                    }`}
                  >
                    <Icon className={`w-4 h-4 ${item.active ? 'text-violet-400 stroke-[2]' : 'text-slate-400'}`} />
                    <span className="flex-1 truncate">{item.label}</span>
                    {item.badge && (
                      <span className={`text-[9px] font-medium uppercase tracking-wider px-1.5 py-0.5 rounded-md ${
                        item.active ? 'bg-violet-500/30 text-violet-200' : 'bg-violet-100 text-violet-700'
                      }`}>
                        {item.badge}
                      </span>
                    )}
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Secondary Field Modules */}
          <div>
            <div className="px-2.5 pb-1.5 text-[10px] font-medium uppercase tracking-wider text-slate-400">
              Field Modules
            </div>
            <div className="space-y-0.5">
              {secondaryItems.map((item) => {
                const Icon = item.icon;
                return (
                  <div
                    key={item.label}
                    className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs text-slate-400 font-normal cursor-not-allowed select-none group"
                  >
                    <Icon className="w-4 h-4 text-slate-300" />
                    <span className="flex-1 truncate">{item.label}</span>
                    <span className="text-[9px] uppercase tracking-wider bg-slate-200/70 text-slate-400 px-1.5 py-0.5 rounded font-normal opacity-0 group-hover:opacity-100 transition-opacity">
                      Soon
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Bottom Profile Bar */}
        <div className="p-3 border-t border-slate-100 bg-white">
          <div className="p-2 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 min-w-0">
              <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-violet-600 to-indigo-600 text-white font-semibold text-xs flex items-center justify-center shrink-0">
                {userName.charAt(0).toUpperCase()}
              </div>
              <div className="min-w-0 flex-1">
                <span className="block text-xs font-semibold text-slate-800 truncate leading-tight">{userName}</span>
                <span className="block text-[10px] text-slate-400 font-normal truncate">Medical Rep</span>
              </div>
            </div>

            <Link
              href="/logout"
              method="post"
              as="button"
              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
              title="Sign Out"
            >
              <LogOut className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

      </aside>
    </>
  );
}
