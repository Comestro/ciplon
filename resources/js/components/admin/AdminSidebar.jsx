// AdminSidebar component providing responsive navigation, collapsible mobile drawer, and active links
import { Link, router, usePage } from '@inertiajs/react';
import {
  LayoutDashboard,
  Package,
  Layers,
  PlusCircle,
  FolderTree,
  FolderPlus,
  Settings,
  LogOut,
  ExternalLink,
  ShieldCheck,
  X,
  Activity,
  Mail,
  Users,
  Shield
} from 'lucide-react';

export default function AdminSidebar({ isOpen, onClose }) {
  const { url, props } = usePage();
  const currentPath = url.split('?')[0];

  const authUser = props.auth?.user;
  const adminName = authUser?.name || 'Administrator';
  const adminEmail = authUser?.email || 'admin@ciplon.com';

  const handleLogout = () => {
    router.post('/logout');
  };

  const isCurrent = (path) => currentPath === path;
  const isParentActive = (prefix) => currentPath.startsWith(prefix);

  const navigationSections = [
    {
      title: 'Dashboard',
      items: [
        {
          name: 'Overview',
          path: '/admin',
          icon: LayoutDashboard,
          active: currentPath === '/admin' || currentPath === '/admin/dashboard',
        },
      ],
    },
    {
      title: 'Products & Formulations',
      items: [
        {
          name: 'All Products',
          path: '/admin/products',
          icon: Package,
          active: isParentActive('/admin/product') && !currentPath.includes('/add') && !currentPath.includes('/create'),
        },
        {
          name: 'Add New Product',
          path: '/admin/products/add',
          icon: PlusCircle,
          active: currentPath === '/admin/products/add' || currentPath === '/admin/products/create',
        },
        {
          name: 'Visual Aid Carousels',
          path: '/admin/carousels',
          icon: Layers,
          active: currentPath === '/admin/carousels' || currentPath.includes('/slides'),
        },
      ],
    },
    {
      title: 'Classification',
      items: [
        {
          name: 'Categories',
          path: '/admin/category',
          icon: FolderTree,
          active: currentPath === '/admin/category' || currentPath === '/admin/categories',
        },
        {
          name: 'Add Category',
          path: '/admin/category/add',
          icon: FolderPlus,
          active: currentPath.includes('/category/add') || currentPath.includes('/category/create') || currentPath === '/admin/addcategory',
        },
      ],
    },
    {
      title: 'Staff & Access Control',
      items: [
        {
          name: 'Staff & Team',
          path: '/admin/staff',
          icon: Users,
          active: isParentActive('/admin/staff'),
        },
        {
          name: 'Roles & Permissions',
          path: '/admin/roles',
          icon: Shield,
          active: isParentActive('/admin/roles'),
        },
      ],
    },
    {
      title: 'Commercial Desk',
      items: [
        {
          name: 'Commercial Inquiries',
          path: '/admin/enquiries',
          icon: Mail,
          active: isParentActive('/admin/enquiries'),
        },
      ],
    },
    {
      title: 'Preferences',
      items: [
        {
          name: 'Settings',
          path: '/admin/settings',
          icon: Settings,
          active: currentPath === '/admin/settings',
        },
      ],
    },
  ];

  return (
    <>
      {isOpen && (
        <div 
          onClick={onClose}
          className="fixed inset-0 z-40 bg-slate-950/60 lg:hidden"
        />
      )}

      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-64 bg-slate-900 text-slate-300 border-r border-slate-800 flex flex-col transition-transform duration-200 ease-in-out lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="h-16 px-5 flex items-center justify-between border-b border-slate-800 bg-slate-900">
          <Link href="/admin" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-teal-600 flex items-center justify-center text-white">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div className="leading-tight">
              <span className="text-sm font-bold text-white tracking-tight block">
                Ciplon
              </span>
              <span className="text-[10px] font-mono tracking-wider uppercase text-teal-400 block">
                Pharma Admin
              </span>
            </div>
          </Link>
          <button 
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 lg:hidden cursor-pointer"
            aria-label="Close sidebar"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-5 overflow-y-auto">
          {navigationSections.map((section, sIdx) => (
            <div key={sIdx} className="space-y-1">
              <p className="px-3 pb-1 text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                {section.title}
              </p>

              {section.items.map((item) => {
                const Icon = item.icon;

                return (
                  <Link
                    key={item.name}
                    href={item.path}
                    onClick={onClose}
                    className={`flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                      item.active
                        ? 'bg-teal-500/15 text-teal-300 font-semibold border-l-2 border-teal-400'
                        : 'text-slate-300 hover:text-white hover:bg-slate-800/80'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Icon className={`w-4 h-4 shrink-0 ${item.active ? 'text-teal-400' : 'text-slate-400'}`} />
                      <span>{item.name}</span>
                    </div>
                    {item.active && (
                      <div className="w-1.5 h-1.5 rounded-full bg-teal-400" />
                    )}
                  </Link>
                );
              })}
            </div>
          ))}
        </nav>

        <div className="p-3 border-t border-slate-800 bg-slate-900/60 space-y-2">
          <Link
            href="/"
            className="flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium text-slate-300 hover:text-white hover:bg-slate-800 transition-colors border border-slate-800"
          >
            <span className="flex items-center gap-2">
              <ExternalLink className="w-3.5 h-3.5 text-teal-400" />
              <span>Public Website</span>
            </span>
            <span className="text-[10px] font-mono text-teal-400 bg-teal-950 px-1.5 py-0.5 rounded border border-teal-800/50">
              Live
            </span>
          </Link>

          <div className="flex items-center gap-2.5 px-3 py-2 rounded-lg bg-slate-800/50 border border-slate-800">
            <div className="w-7 h-7 rounded-full bg-teal-600 text-white flex items-center justify-center font-bold text-xs shrink-0">
              {adminName.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0 leading-tight">
              <span className="block text-xs font-semibold text-white truncate">{adminName}</span>
              <span className="block text-[10px] text-slate-400 truncate">{adminEmail}</span>
            </div>
            <div className="w-2 h-2 rounded-full bg-emerald-400" title="System Online" />
          </div>

          <button
            type="button"
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-xs font-medium text-rose-400 hover:text-rose-300 hover:bg-rose-950/40 border border-rose-900/50 transition-colors cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>
    </>
  );
}