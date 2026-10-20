import { useState, useRef, useEffect } from 'react';
import { Link, usePage } from '@inertiajs/react';
import { Menu, Bell, User, LogOut, ExternalLink, ChevronDown, Sparkles, Navigation, CheckCircle2, Loader2, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../services/api';

export default function MRHeader({ onToggleSidebar, title = 'MR Dashboard' }) {
  const { props } = usePage();
  const authUser = props.auth?.user || {};
  const userName = authUser.name || 'Medical Representative';
  const userEmail = authUser.email || 'mr@ciplon.com';

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [gpsStatus, setGpsStatus] = useState('idle'); // idle, syncing, active, error
  const [lastAccuracy, setLastAccuracy] = useState(null);
  const dropdownRef = useRef(null);

  // Function to capture and broadcast real-time GPS location
  const syncLiveLocation = async (manual = false) => {
    if (!navigator.geolocation) {
      if (manual) toast.error('Geolocation is not supported by your browser.');
      setGpsStatus('error');
      return;
    }

    setGpsStatus('syncing');

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          const lat = pos.coords.latitude;
          const lng = pos.coords.longitude;
          const acc = Math.round(pos.coords.accuracy);
          const spd = pos.coords.speed || 0;

          let batteryLevel = 85;
          let batteryStatus = 'discharging';
          if ('getBattery' in navigator) {
            try {
              const b = await navigator.getBattery();
              batteryLevel = Math.round(b.level * 100);
              batteryStatus = b.charging ? 'charging' : 'discharging';
            } catch (e) {
              // Ignore battery error
            }
          }

          await api.post('/api/v1/mr/location', {
            latitude: lat,
            longitude: lng,
            accuracy: acc,
            speed: spd,
            battery_level: batteryLevel,
            battery_status: batteryStatus,
            current_activity: spd > 3 ? 'travelling' : 'in_field',
          });

          setGpsStatus('active');
          setLastAccuracy(acc);
          if (manual) toast.success(`GPS Location Synced (~${acc}m accuracy)`);
        } catch (err) {
          setGpsStatus('error');
          if (manual) toast.error('Failed to sync GPS with admin.');
        }
      },
      (err) => {
        setGpsStatus('error');
        if (manual) {
          if (err.code === 1) toast.error('Location permission denied. Please allow location in browser.');
          else toast.error('Unable to retrieve GPS position.');
        }
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  };

  useEffect(() => {
    // Initial sync
    syncLiveLocation(false);

    // Periodic sync every 45 seconds
    const interval = setInterval(() => {
      syncLiveLocation(false);
    }, 45000);

    return () => clearInterval(interval);
  }, []);

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
      <div className="flex items-center gap-2 sm:gap-2.5">
        {/* Live GPS Broadcast Pill */}
        <button
          type="button"
          onClick={() => syncLiveLocation(true)}
          title="Click to sync current GPS coordinates with admin"
          className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-[11px] font-medium transition-all cursor-pointer ${
            gpsStatus === 'active'
              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200/60 hover:bg-emerald-100'
              : gpsStatus === 'syncing'
              ? 'bg-sky-50 text-sky-700 border border-sky-200/60'
              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }`}
        >
          {gpsStatus === 'syncing' ? (
            <Loader2 className="w-3 h-3 animate-spin text-sky-600" />
          ) : gpsStatus === 'active' ? (
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
          ) : (
            <Navigation className="w-3 h-3 text-slate-500" />
          )}
          <span className="hidden md:inline">
            {gpsStatus === 'active'
              ? `GPS Live (~${lastAccuracy || 10}m)`
              : gpsStatus === 'syncing'
              ? 'Syncing GPS...'
              : 'Sync GPS'}
          </span>
          <span className="md:hidden">GPS</span>
        </button>

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
