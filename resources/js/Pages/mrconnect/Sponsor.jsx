import { usePage } from '@inertiajs/react';
import { 
  Award, 
  Handshake, 
  Calendar, 
  CheckCircle2, 
  Clock 
} from 'lucide-react';
import AdminLayout from '../../layouts/AdminLayout';
import MRLayout from '../../layouts/MR/MRLayout';

export default function Sponsor({ sponsorships = [] }) {
  const { props } = usePage();
  const isAdmin = props.auth?.user?.role === 'admin' || props.auth?.user?.role === 'super_admin';
  const Layout = isAdmin ? AdminLayout : MRLayout;

  return (
    <Layout title={isAdmin ? "Doctor & CME Sponsorships" : "My Doctor Sponsorships"}>
      <div className="space-y-6 pb-12 font-sans max-w-[1400px] mx-auto">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200/80">
          <div>
            <h2 className="text-xl sm:text-2xl font-semibold tracking-tight text-slate-800">
              {isAdmin ? "Doctor & Academic Sponsorships" : "My Doctor Sponsorships"}
            </h2>
            <p className="text-xs text-slate-500 font-normal mt-0.5">
              {isAdmin 
                ? "Manage clinical CME programs, academic grants, medical society conferences, and clinical camp sponsorships."
                : "Track your physician CME registrations, conference travel grants, and health camp proposals."}
            </p>
          </div>
        </div>

        {/* Sponsorships Table */}
        <div className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden">
          <div className="px-5 py-3.5 border-b border-slate-100 flex items-center justify-between">
            <h3 className="text-sm font-semibold text-slate-800">
              {isAdmin ? "All Sponsorship Records" : "My Submitted Sponsorships"}
            </h3>
            <span className="text-xs text-slate-400">{sponsorships.length} activities</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-100 text-[11px] font-semibold text-slate-400 bg-slate-50/50">
                  <th className="py-2.5 px-4">Title / Program</th>
                  <th className="py-2.5 px-4">Category</th>
                  <th className="py-2.5 px-4">Doctor / Society</th>
                  {isAdmin && <th className="py-2.5 px-4">Representative</th>}
                  <th className="py-2.5 px-4 text-right">Sponsorship Amount</th>
                  <th className="py-2.5 px-4 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {sponsorships.length === 0 ? (
                  <tr>
                    <td colSpan={isAdmin ? 6 : 5} className="py-8 text-center text-slate-400 text-xs">
                      No sponsorships recorded.
                    </td>
                  </tr>
                ) : (
                  sponsorships.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3 px-4 font-medium text-slate-800 max-w-sm">
                        {item.title}
                      </td>
                      <td className="py-3 px-4 uppercase font-medium text-violet-700 text-[11px]">
                        {item.type.replace('_', ' ')}
                      </td>
                      <td className="py-3 px-4 text-slate-700">
                        {item.doctor_name || 'Medical Society'}
                      </td>
                      {isAdmin && (
                        <td className="py-3 px-4 text-slate-500">
                          {item.representative_name}
                        </td>
                      )}
                      <td className="py-3 px-4 text-right font-semibold text-slate-800">
                        ₹{Number(item.amount).toLocaleString()}
                      </td>
                      <td className="py-3 px-4 text-center">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-[11px] font-medium ${
                          item.status === 'approved'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200/60'
                            : 'bg-amber-50 text-amber-700 border border-amber-200/60'
                        }`}>
                          {item.status.toUpperCase()}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </Layout>
  );
}
