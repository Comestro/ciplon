import { useState, useEffect } from 'react';
import { router } from '@inertiajs/react';

export default function ContentLoader() {
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let timer = null;

    const handleStart = () => {
      // 30ms debounce to avoid flicker on immediate cached transitions
      timer = setTimeout(() => {
        setLoading(true);
      }, 30);
    };

    const handleEnd = () => {
      if (timer) clearTimeout(timer);
      setLoading(false);
    };

    const removeStart = router.on('start', handleStart);
    const removeFinish = router.on('finish', handleEnd);
    const removeCancel = router.on('cancel', handleEnd);
    const removeError = router.on('error', handleEnd);

    return () => {
      if (timer) clearTimeout(timer);
      removeStart();
      removeFinish();
      removeCancel();
      removeError();
    };
  }, []);

  if (!loading) return null;

  return (
    <div 
      className="fixed top-16 bottom-0 left-0 lg:left-64 right-0 z-30 flex items-center justify-center bg-[#f8f9fc]/85 backdrop-blur-[2px] transition-all animate-in fade-in duration-100"
      aria-label="Loading page content"
      role="status"
    >
      <div className="bg-white/95 backdrop-blur-md rounded-2xl border border-slate-200/90 px-8 py-6 shadow-2xl flex flex-col items-center gap-3.5 min-w-[210px] animate-in zoom-in-95 duration-100">
        <div className="relative w-12 h-12 flex items-center justify-center">
          {/* Animated spinning ring */}
          <div className="w-12 h-12 rounded-full border-[3px] border-teal-100 border-t-teal-700 animate-spin" />
          
          {/* Center glowing pulse dot */}
          <div className="absolute w-3 h-3 rounded-full bg-teal-600 animate-pulse shadow-[0_0_8px_rgba(13,148,136,0.6)]" />
        </div>

        <div className="text-center">
          <p className="text-xs font-bold text-slate-800 tracking-tight">Loading Page</p>
          <p className="text-[11px] font-medium text-slate-400 mt-0.5">Please wait a moment...</p>
        </div>
      </div>
    </div>
  );
}