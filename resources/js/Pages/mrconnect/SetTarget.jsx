import { usePage } from '@inertiajs/react';
import { 
  Target, 
  TrendingUp, 
  Award, 
  Calendar 
} from 'lucide-react';
import AdminLayout from '../../layouts/AdminLayout';
import MRLayout from '../../layouts/MR/MRLayout';

export default function SetTarget({ targets = [], summary = {} }) {
  const { props } = usePage();
  const isAdmin = props.auth?.user?.role === 'admin' || props.auth?.user?.role === 'super_admin';
  const Layout = isAdmin ? AdminLayout : MRLayout;

  return (
    <Layout title={isAdmin ? "Target vs Sales Performance" : "My Sales Targets"}>
      <div className="space-y-6 pb-12 font-sans max-w-[1400px] mx-auto">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200/80">
          <div>
            <h2 className="text-xl sm:text-2xl font-semibold tracking-tight text-slate-800">
              {isAdmin ? "Target vs Sales Achievement" : "My Sales Targets & Achievement"}
            </h2>
            <p className="text-xs text-slate-500 font-normal mt-0.5">
              {isAdmin 
                ? "Set monthly sales quotas and evaluate field representative quota achievement."
                : "Your allocated monthly sales targets, verified revenue achievement, and milestone progress."}
            </p>
          </div>
        </div>

        {/* 3 Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white rounded-2xl border border-slate-200/80 p-5">
            <span className="text-xs font-medium text-slate-500">
              {isAdmin ? "Cumulative Target" : "My Sales Quota"}
            </span>
            <p className="text-2xl font-semibold text-slate-800 mt-2">
              ₹{Number(summary.total_target || 0).toLocaleString()}
            </p>
            <p className="text-[11px] text-slate-400 mt-1">Assigned budget</p>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200/80 p-5">
            <span className="text-xs font-medium text-slate-500">Sales Achieved</span>
            <p className="text-2xl font-semibold text-emerald-600 mt-2">
              ₹{Number(summary.total_achieved || 0).toLocaleString()}
            </p>
            <p className="text-[11px] text-emerald-600 font-medium mt-1">Realized volume</p>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200/80 p-5">
            <span className="text-xs font-medium text-slate-500">Overall Achievement</span>
            <p className="text-2xl font-semibold text-violet-600 mt-2">
              {summary.overall_percentage || 0}%
            </p>
            <p className="text-[11px] text-slate-400 mt-1">Portfolio achievement index</p>
          </div>
        </div>

        {/* Targets Table */}
        <div className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden">
          <div className="px-5 py-3.5 border-b border-slate-100 flex items-center justify-between">
            <h3 className="text-sm font-semibold text-slate-800">
              {isAdmin ? "Sales Quotas by Representative" : "My Assigned Monthly Quotas"}
            </h3>
            <span className="text-xs text-slate-400">{targets.length} records</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-100 text-[11px] font-semibold text-slate-400 bg-slate-50/50">
                  {isAdmin && <th className="py-2.5 px-4">Representative</th>}
                  <th className="py-2.5 px-4">Period</th>
                  <th className="py-2.5 px-4 text-right">Target Quota (₹)</th>
                  <th className="py-2.5 px-4 text-right">Achieved Sales (₹)</th>
                  <th className="py-2.5 px-4 text-center">Progress %</th>
                  <th className="py-2.5 px-4">Notes</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {targets.length === 0 ? (
                  <tr>
                    <td colSpan={isAdmin ? 6 : 5} className="py-8 text-center text-slate-400 text-xs">
                      No sales targets assigned yet.
                    </td>
                  </tr>
                ) : (
                  targets.map((tgt) => {
                    const pct = tgt.target_amount > 0 ? Math.round((tgt.achieved_amount / tgt.target_amount) * 100) : 0;
                    return (
                      <tr key={tgt.id} className="hover:bg-slate-50/70 transition-colors">
                        {isAdmin && (
                          <td className="py-3 px-4 font-medium text-slate-800">
                            {tgt.employee_name}
                          </td>
                        )}
                        <td className="py-3 px-4 font-medium text-slate-700">
                          {tgt.month} {tgt.year}
                        </td>
                        <td className="py-3 px-4 text-right font-semibold text-slate-800">
                          ₹{Number(tgt.target_amount).toLocaleString()}
                        </td>
                        <td className="py-3 px-4 text-right font-semibold text-emerald-600">
                          ₹{Number(tgt.achieved_amount).toLocaleString()}
                        </td>
                        <td className="py-3 px-4 text-center font-bold text-slate-900">
                          <div className="inline-flex items-center gap-1.5">
                            <span className="text-xs">{pct}%</span>
                            <div className="w-16 bg-slate-100 h-1.5 rounded-full overflow-hidden hidden sm:block">
                              <div className="bg-slate-900 h-full rounded-full" style={{ width: `${Math.min(100, pct)}%` }}></div>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-slate-500 max-w-xs truncate">
                          {tgt.notes}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </Layout>
  );
}
