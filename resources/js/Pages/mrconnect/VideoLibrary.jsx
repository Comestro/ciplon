import { usePage, Link } from '@inertiajs/react';
import { 
  Video, 
  Play, 
  Clock, 
  Eye, 
  Sparkles, 
  Film 
} from 'lucide-react';
import AdminLayout from '../../layouts/AdminLayout';
import MRLayout from '../../layouts/MR/MRLayout';

export default function VideoLibrary({ videos = [] }) {
  const { props } = usePage();
  const isAdmin = props.auth?.user?.role === 'admin';
  const Layout = isAdmin ? AdminLayout : MRLayout;

  return (
    <Layout title="Clinical Video Library">
      <div className="space-y-6 pb-12 font-sans max-w-[1400px] mx-auto">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200/80">
          <div>
            <h2 className="text-xl sm:text-2xl font-semibold tracking-tight text-slate-800">
              Clinical Video Library & MOA Animations
            </h2>
            <p className="text-xs text-slate-500 font-normal mt-0.5">
              High-definition Mechanism of Action (MOA) 3D scientific videos for doctor engagement.
            </p>
          </div>
        </div>

        {/* Videos Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {videos.map((vid) => (
            <div key={vid.id} className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden flex flex-col justify-between group">
              <div>
                <div className="relative aspect-video bg-slate-900 overflow-hidden">
                  <img
                    src={vid.thumbnail}
                    alt={vid.title}
                    className="w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-slate-955/30 flex items-center justify-center">
                    <div className="w-12 h-12 rounded-full bg-white/90 text-slate-900 flex items-center justify-center shadow-lg group-hover:bg-slate-900 group-hover:text-white transition-colors">
                      <Play className="w-5 h-5 ml-0.5" />
                    </div>
                  </div>
                  <span className="absolute bottom-2.5 right-2.5 bg-black/80 text-white font-mono text-[10px] px-2 py-0.5 rounded">
                    {vid.duration}
                  </span>
                </div>

                <div className="p-4 space-y-2">
                  <span className="text-[10px] font-semibold text-slate-700 bg-slate-100 border border-slate-200/60 px-2 py-0.5 rounded-md">
                    {vid.category}
                  </span>
                  <h3 className="text-sm font-semibold text-slate-800 line-clamp-2">
                    {vid.title}
                  </h3>
                  <p className="text-xs text-slate-500 line-clamp-2">
                    {vid.description}
                  </p>
                </div>
              </div>

              <div className="p-4 pt-0 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
                <span className="flex items-center gap-1">
                  <Eye className="w-3.5 h-3.5" />
                  {vid.views} views
                </span>
                <Link
                  href="/mr/detailing"
                  className="font-medium text-violet-600 hover:text-violet-800"
                >
                  Launch in Player &rarr;
                </Link>
              </div>
            </div>
          ))}
        </div>

      </div>
    </Layout>
  );
}
