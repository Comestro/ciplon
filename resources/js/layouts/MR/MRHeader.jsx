import { useState, useRef, useEffect } from 'react';
import { Link, usePage } from '@inertiajs/react';
import { Menu, Bell, User, LogOut, ExternalLink, ChevronDown, Sparkles } from 'lucide-react';

export default function MRHeader({ onToggleSidebar, title = 'MR Dashboard' }) {
  const { props } = usePage();
  const authUser = props.auth?.user || {};
  const userName = authUser.name || 'Medical Representative';
  const userEmail = authUser.email || 'mr@ciplon.com';

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="h-16 bg-white/90 backdrop-blur-md border-b border-slate-200/80 px-4 sm:px-6 flex items-center justify-between sticky top-0 z-30">
      {/* Left Section with clean title */}
      <div className="flex items-center gap-3 min-w-0">
        <button
          type="button"
          onClick={onToggleSidebar}
          className="p-1.5 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 lg:hidden cursor-pointer"
          aria-label="Open sidebar"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2">
          <h1 className="text-sm sm:text-base font-semibold text-slate-800 tracking-tight truncate">
            {title}
          </h1>
        </div>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-2.5">
        <Link
          href="/mr/detailing"
          className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium bg-violet-50 text-violet-700 hover:bg-violet-100 border border-violet-200/60 transition-colors"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>E-Detailing</span>
        </Link>

        <Link
          href="/"
          className="hidden md:inline-flex items-center gap-1 text-xs font-normal text-slate-500 hover:text-slate-800 px-2.5 py-1.5 rounded-lg hover:bg-slate-100 transition-colors"
        >
          <span>Website</span>
          <ExternalLink className="w-3 h-3 text-slate-400" />
        </Link>

        {/* User Profile Pill */}
        <div className="relative pl-1" ref={dropdownRef}>
          <button
            type="button"
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center gap-2 p-1 pl-1.5 pr-2 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer text-left border border-slate-200/60"
          >
            <div className="w-6 h-6 rounded-lg bg-gradient-to-tr from-violet-600 to-indigo-600 text-white flex items-center justify-center text-[11px] font-semibold">
              {userName.charAt(0).toUpperCase()}
            </div>

            <span className="hidden sm:inline-block text-xs font-medium text-slate-700 truncate max-w-[120px]">
              {userName}
            </span>

            <ChevronDown className="w-3 h-3 text-slate-400" />
          </button>

          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-52 bg-white rounded-2xl border border-slate-200 shadow-xl py-1.5 z-50 text-xs font-normal">
              <div className="px-3.5 py-2.5 border-b border-slate-100">
                <span className="block font-semibold text-slate-800 truncate">{userName}</span>
                <span className="block text-[11px] text-slate-400 truncate font-light">{userEmail}</span>
                <span className="inline-block text-[10px] font-medium text-violet-700 bg-violet-50 px-2 py-0.5 rounded-full mt-1.5">
                  Field Representative
                </span>
              </div>

              <div className="py-1">
                <Link
                  href="/logout"
                  method="post"
                  as="button"
                  className="w-full flex items-center gap-2 px-3.5 py-2 text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer text-left font-medium"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Sign Out</span>
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
