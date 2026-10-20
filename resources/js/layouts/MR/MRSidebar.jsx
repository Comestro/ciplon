import { useState } from 'react';
import { Link, router, usePage } from '@inertiajs/react';
import {
  LayoutDashboard,
  Users,
  Globe,
  Receipt,
  Calendar,
  TrendingUp,
  Package,
  Target,
  Presentation,
  Film,
  Sliders,
  Bell,
  Handshake,
  Percent,
  UserCheck,
  FileText,
  MapPin,
  LogOut,
  X,
  Search,
  ChevronDown
} from 'lucide-react';

export default function MRSidebar({ isOpen, onClose }) {
  const { url, props } = usePage();
  const currentPath = url.split('?')[0];

  const authUser = props.auth?.user;
  const userName = authUser?.name || 'Medical Representative';
  const userEmail = authUser?.email || 'mr@ciplon.com';
  const [searchQuery, setSearchQuery] = useState('');

  const isCurrent = (path) => currentPath === path;
  const isParentActive = (prefix) => currentPath.startsWith(prefix);

  const navigationSections = [
    {
      title: 'Workspace',
      items: [
        {
          name: 'Dashboard',
          path: '/mr/dashboard',
          icon: LayoutDashboard,
          active: currentPath === '/mr/dashboard' || currentPath === '/mr',
        },
        {
          name: 'Doctor Directory',
          path: '/mr/doctors',
          icon: Users,
          active: isParentActive('/mr/doctors'),
        },
        {
          name: 'Calls & Visits Planner',
          path: '/mr/visits',
          icon: Calendar,
          active: isParentActive('/mr/visits'),
        },
        {
          name: 'Product Formulations',
          path: '/mr/products',
          icon: Package,
          active: isParentActive('/mr/products'),
        },
      ],
    },
    {
      title: 'Employee & Field',
      items: [
        {
          name: 'Employee Assign',
          path: '/mrconnect/employee-assign',
          icon: Users,
          active: isParentActive('/mrconnect/employee-assign'),
        },
        {
          name: 'Tour Plan',
          path: '/mrconnect/tour-plan',
          icon: Globe,
          active: isParentActive('/mrconnect/tour-plan'),
        },
        {
          name: 'Field Expenses',
          path: '/mrconnect/field-expenses',
          icon: Receipt,
          active: isParentActive('/mrconnect/field-expenses'),
        },
        {
          name: 'Leave',
          path: '/mrconnect/leave',
          icon: Calendar,
          active: isParentActive('/mrconnect/leave'),
        },
      ],
    },
    {
      title: 'Sales & Targets',
      items: [
        {
          name: 'Primary Sales',
          path: '/mrconnect/primary-sales',
          icon: TrendingUp,
          active: isParentActive('/mrconnect/primary-sales'),
        },
        {
          name: 'POB Order',
          path: '/mrconnect/pob-order',
          icon: Package,
          active: isParentActive('/mrconnect/pob-order'),
        },
        {
          name: 'Set Target',
          path: '/mrconnect/set-target',
          icon: Target,
          active: isParentActive('/mrconnect/set-target'),
        },
      ],
    },
    {
      title: 'Media & Alert',
      items: [
        {
          name: 'E-Detailing',
          path: '/mr/detailing',
          icon: Presentation,
          active: isParentActive('/mr/detailing'),
        },
        {
          name: 'Video Library',
          path: '/mrconnect/video-library',
          icon: Film,
          active: isParentActive('/mrconnect/video-library'),
        },
        {
          name: 'Slider',
          path: '/mrconnect/slider',
          icon: Sliders,
          active: isParentActive('/mrconnect/slider'),
        },
        {
          name: 'Notice / Announcement',
          path: '/mrconnect/notice',
          icon: Bell,
          active: isParentActive('/mrconnect/notice'),
        },
      ],
    },
    {
      title: 'Sponsorship & Schemes',
      items: [
        {
          name: 'Sponsor',
          path: '/mrconnect/sponsor',
          icon: Handshake,
          active: isParentActive('/mrconnect/sponsor'),
        },
        {
          name: 'Scheme',
          path: '/mrconnect/scheme',
          icon: Percent,
          active: isParentActive('/mrconnect/scheme'),
        },
      ],
    },
    {
      title: 'HR & Reports',
      items: [
        {
          name: 'HR Directory',
          path: '/mrconnect/hr-section',
          icon: UserCheck,
          active: isParentActive('/mrconnect/hr-section'),
        },
        {
          name: 'All Reports',
          path: '/mrconnect/all-reports',
          icon: FileText,
          active: isParentActive('/mrconnect/all-reports'),
        },
      ],
    },
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

      {/* Sidebar Container (SpaceWork Inspired, matching AdminSidebar) */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-64 bg-[#fbfbfd] border-r border-slate-200/80 flex flex-col transition-transform duration-200 ease-in-out lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Workspace Switcher Pill & Actions */}
        <div className="h-16 px-4 border-b border-slate-100 flex items-center justify-between">
          <Link
            href="/mr/dashboard"
            className="flex items-center gap-2.5 px-2 py-1.5 rounded-xl hover:bg-slate-200/60 transition-colors group cursor-pointer"
          >
            <div className="w-7 h-7 rounded-lg bg-slate-900 text-white flex items-center justify-center font-semibold text-xs">
              MR
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-semibold text-slate-800 tracking-tight">Ciplon MR</span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-700 transition-colors" />
            </div>
          </Link>

          <div className="flex items-center gap-1">
            <Link
              href="/mrconnect/notice"
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-800 hover:bg-slate-200/60 transition-colors relative"
              title="Notices & Announcements"
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

        {/* Navigation Sections */}
        <div className="flex-1 overflow-y-auto px-3 py-1 space-y-4">
          {navigationSections.map((section) => {
            const filteredItems = section.items.filter((item) =>
              item.name.toLowerCase().includes(searchQuery.toLowerCase())
            );

            if (filteredItems.length === 0) return null;

            return (
              <div key={section.title}>
                <div className="px-2.5 pb-1.5 text-[10px] font-medium uppercase tracking-wider text-slate-400">
                  {section.title}
                </div>
                <div className="space-y-0.5">
                  {filteredItems.map((item) => {
                    const Icon = item.icon;
                    return (
                      <Link
                        key={item.path}
                        href={item.path}
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
                        <span className="flex-1 truncate">{item.name}</span>
                      </Link>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom Profile Bar */}
        <div className="p-3 border-t border-slate-100 bg-white">
          <div className="p-2 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 min-w-0">
              <div className="w-7 h-7 rounded-full bg-slate-900 text-white font-semibold text-xs flex items-center justify-center shrink-0">
                {userName.charAt(0).toUpperCase()}
              </div>
              <div className="min-w-0 flex-1">
                <span className="block text-xs font-semibold text-slate-800 truncate leading-tight">{userName}</span>
                <span className="block text-[10px] text-slate-400 font-normal truncate">Field Representative</span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => router.post('/logout')}
              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
              title="Sign Out"
            >
              <LogOut className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
