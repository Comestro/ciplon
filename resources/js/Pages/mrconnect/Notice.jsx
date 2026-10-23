import { usePage } from '@inertiajs/react';
import { 
  Bell, 
  Megaphone, 
  AlertCircle, 
  Calendar, 
  User 
} from 'lucide-react';
import AdminLayout from '../../layouts/AdminLayout';
import MRLayout from '../../layouts/MR/MRLayout';

export default function Notice({ notices = [] }) {
  const { props } = usePage();
  const isAdmin = props.auth?.user?.role === 'admin' || props.auth?.user?.role === 'super_admin';
  const Layout = isAdmin ? AdminLayout : MRLayout;

  return (
    <Layout title="Notices & Announcements">
      <div className="space-y-6 pb-12 font-sans max-w-[1400px] mx-auto">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200/80">
          <div>
            <h2 className="text-xl sm:text-2xl font-semibold tracking-tight text-slate-800">
              Notices & Official Announcements
            </h2>
            <p className="text-xs text-slate-500 font-normal mt-0.5">
              Broadcast circulars, price updates, medical conference details, and corporate news.
            </p>
          </div>
        </div>

        {/* Notices Cards List */}
        <div className="space-y-4">
          {notices.map((nt) => (
            <div key={nt.id} className="bg-white rounded-2xl border border-slate-200/80 p-5 space-y-2.5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className={`px-2.5 py-0.5 rounded-md text-[11px] font-semibold uppercase ${
                    nt.priority === 'urgent'
                      ? 'bg-rose-50 text-rose-700 border border-rose-200/60'
                      : nt.priority === 'high'
                      ? 'bg-amber-50 text-amber-700 border border-amber-200/60'
                      : 'bg-violet-50 text-violet-700 border border-violet-200/60'
                  }`}>
                    {nt.category}
                  </span>
                  <h3 className="text-sm font-semibold text-slate-800">{nt.title}</h3>
                </div>
                <span className="text-[11px] text-slate-400 font-normal">
                  {nt.published_at}
                </span>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed">
                {nt.content}
              </p>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
                <span>Published by: <strong className="text-slate-600 font-medium">{nt.publisher_name || 'Ciplon Head Office'}</strong></span>
                <span className="text-emerald-600 font-medium">Active Circular</span>
              </div>
            </div>
          ))}
        </div>

      </div>
    </Layout>
  );
}
