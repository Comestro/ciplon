import { Menu, ExternalLink, ArrowLeft, Sparkles } from 'lucide-react';
import { Link, usePage } from '@inertiajs/react';

export default function AdminNavbar({ onToggleSidebar }) {
  const { url, props } = usePage();
  const currentPath = url.split('?')[0];

  const authUser = props.auth?.user || {};
  const adminName = authUser.name || 'Administrator';
  const adminEmail = authUser.email || 'admin@ciplon.com';

  const getNavContext = () => {
    const path = currentPath.toLowerCase();

    if (path === '/admin' || path === '/admin/dashboard') {
      return { title: 'Dashboard', parent: null };
    }
    if (path === '/admin/products') {
      return { title: 'Products & Formulations', parent: null };
    }
    if (path === '/admin/categories' || path === '/admin/category') {
      return { title: 'Categories', parent: null };
    }
    if (path === '/admin/staff') {
      return { title: 'Staff & Team', parent: null };
    }
    if (path === '/admin/roles') {
      return { title: 'Roles & Permissions', parent: null };
    }
    if (path === '/admin/settings') {
      return { title: 'Settings', parent: null };
    }
    if (path === '/admin/enquiries') {
      return { title: 'Commercial Inquiries', parent: null };
    }

    if (path.includes('/products/add') || path.includes('/products/create')) {
      return { title: 'Add New Formulation', parent: { label: 'Products', url: '/admin/products' } };
    }
    if (path.includes('/products/') && path.includes('/edit')) {
      return { title: 'Edit Formulation', parent: { label: 'Products', url: '/admin/products' } };
    }
    if (path.startsWith('/admin/products/') && path.split('/').filter(Boolean).length === 3) {
      return { title: 'Product Details', parent: { label: 'Products', url: '/admin/products' } };
    }

    const parts = currentPath.split('/').filter(Boolean);
    const lastPart = parts[parts.length - 1] || 'Dashboard';
    const fallbackTitle = lastPart.charAt(0).toUpperCase() + lastPart.slice(1);
    return { title: fallbackTitle, parent: null };
  };

  const navContext = getNavContext();

  return (
    <header className="h-16 bg-white/90 backdrop-blur-md border-b border-slate-200/80 px-4 sm:px-6 flex items-center justify-between sticky top-0 z-30">
      <div className="flex items-center gap-2.5 min-w-0">
        <button
          type="button"
          onClick={onToggleSidebar}
          className="p-1.5 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 lg:hidden cursor-pointer"
          aria-label="Open sidebar"
        >
          <Menu className="w-5 h-5" />
        </button>

        {navContext.parent ? (
          <div className="flex items-center gap-2 min-w-0">
            <Link
              href={navContext.parent.url}
              className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors shrink-0"
              title={`Back to ${navContext.parent.label}`}
            >
              <ArrowLeft className="w-4 h-4 stroke-[2.2]" />
            </Link>
            <div className="flex items-center gap-1.5 text-xs sm:text-sm min-w-0">
              <Link
                href={navContext.parent.url}
                className="hidden sm:inline hover:text-slate-900 transition-colors truncate font-medium text-slate-500"
              >
                {navContext.parent.label}
              </Link>
              <span className="hidden sm:inline text-slate-300">/</span>
              <h1 className="text-sm sm:text-base font-bold text-slate-900 tracking-tight truncate">
                {navContext.title}
              </h1>
            </div>
          </div>
        ) : (
          <h1 className="text-sm sm:text-base font-bold text-slate-900 tracking-tight truncate">
            {navContext.title}
          </h1>
        )}
      </div>

      <div className="flex items-center gap-2.5">
        <Link
          href="/"
          className="hidden sm:inline-flex items-center gap-1 text-xs font-medium text-slate-500 hover:text-slate-900 px-2.5 py-1.5 rounded-lg hover:bg-slate-100 transition-colors"
        >
          <span>Live Site</span>
          <ExternalLink className="w-3 h-3 text-slate-400" />
        </Link>

        {/* Admin Profile Pill */}
        <div className="flex items-center gap-2 p-1 pl-1.5 pr-2 rounded-xl bg-slate-50 border border-slate-200/80">
          <div className="w-6 h-6 rounded-lg bg-gradient-to-tr from-violet-600 to-indigo-600 text-white flex items-center justify-center text-[11px] font-bold">
            {adminName.charAt(0).toUpperCase()}
          </div>
          <span className="text-xs font-bold text-slate-800 truncate max-w-[120px]">
            {adminName}
          </span>
        </div>
      </div>
    </header>
  );
}
