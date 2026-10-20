import { usePage, Link } from '@inertiajs/react';
import { 
  Sliders, 
  Presentation, 
  Image, 
  Plus, 
  CheckCircle2, 
  ExternalLink 
} from 'lucide-react';
import AdminLayout from '../../layouts/AdminLayout';
import MRLayout from '../../layouts/MR/MRLayout';

export default function Slider({ slides = [] }) {
  const { props } = usePage();
  const isAdmin = props.auth?.user?.role === 'admin';
  const Layout = isAdmin ? AdminLayout : MRLayout;

  return (
    <Layout title="Promotional Sliders & Visual Aids">
      <div className="space-y-6 pb-12 font-sans max-w-[1400px] mx-auto">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200/80">
          <div>
            <h2 className="text-xl sm:text-2xl font-semibold tracking-tight text-slate-800">
              Interactive Promotional Sliders
            </h2>
            <p className="text-xs text-slate-500 font-normal mt-0.5">
              Manage pharmaceutical visual aid presentation slides and carousel sequences.
            </p>
          </div>

          <Link
            href="/mr/detailing"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-medium text-xs transition-colors cursor-pointer shadow-xs"
          >
            <Presentation className="w-3.5 h-3.5" />
            <span>Open E-Detailing Deck</span>
          </Link>
        </div>

        {/* Sliders Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {slides.map((slide) => (
            <div key={slide.id} className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden flex flex-col justify-between">
              <div>
                <div className="relative aspect-video bg-slate-100 flex items-center justify-center p-4 overflow-hidden border-b border-slate-100">
                  <img
                    src={slide.image}
                    alt={slide.title}
                    className="max-h-36 max-w-full object-contain"
                  />
                  <span className="absolute top-2.5 left-2.5 bg-slate-900 text-white font-mono text-[10px] font-semibold px-2 py-0.5 rounded">
                    Slide #{slide.order}
                  </span>
                </div>

                <div className="p-4 space-y-1.5">
                  <span className="text-[10px] font-semibold text-violet-700 bg-violet-50 px-2 py-0.5 rounded">
                    {slide.type}
                  </span>
                  <h3 className="text-sm font-semibold text-slate-800">
                    {slide.title}
                  </h3>
                </div>
              </div>

              <div className="p-4 pt-0 flex items-center justify-between text-[11px] text-slate-400">
                <span className="inline-flex items-center gap-1 text-emerald-600 font-medium">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Active in Detailing Deck
                </span>
              </div>
            </div>
          ))}
        </div>

      </div>
    </Layout>
  );
}
