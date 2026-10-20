import { usePage } from '@inertiajs/react';
import { 
  TrendingUp, 
  Building2, 
  CheckCircle2, 
  Clock, 
  DollarSign, 
  FileText 
} from 'lucide-react';
import AdminLayout from '../../layouts/AdminLayout';
import MRLayout from '../../layouts/MR/MRLayout';

export default function PrimarySales({ sales = [], summary = {} }) {
  const { props } = usePage();
  const isAdmin = props.auth?.user?.role === 'admin';
  const Layout = isAdmin ? AdminLayout : MRLayout;

  return (
    <Layout title="Primary Sales">
      <div className="space-y-6 pb-12 font-sans max-w-[1400px] mx-auto">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200/80">
          <div>
            <h2 className="text-xl sm:text-2xl font-semibold tracking-tight text-slate-800">
              Primary Sales & Stockist Invoicing
            </h2>
            <p className="text-xs text-slate-500 font-normal mt-0.5">
              Monitor primary billing to authorized pharmaceutical distributors and clearing agents.
            </p>
          </div>
        </div>

        {/* 3 Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white rounded-2xl border border-slate-200/80 p-5">
            <span className="text-xs font-medium text-slate-500">Gross Primary Revenue</span>
            <p className="text-2xl font-semibold text-slate-800 mt-2">
              ₹{Number(summary.total_primary || 0).toLocaleString()}
            </p>
            <p className="text-[11px] text-slate-400 mt-1">Invoiced sales</p>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200/80 p-5">
            <span className="text-xs font-medium text-slate-500">Realized Collections</span>
            <p className="text-2xl font-semibold text-emerald-600 mt-2">
              ₹{Number(summary.paid_amount || 0).toLocaleString()}
            </p>
            <p className="text-[11px] text-emerald-600 font-medium mt-1">Settled payments</p>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200/80 p-5">
            <span className="text-xs font-medium text-slate-500">Outstanding Receivable</span>
            <p className="text-2xl font-semibold text-amber-600 mt-2">
              ₹{Number(summary.pending_amount || 0).toLocaleString()}
            </p>
            <p className="text-[11px] text-amber-600 font-medium mt-1">Payment pipeline</p>
          </div>
        </div>

        {/* Primary Invoices Table */}
        <div className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden">
          <div className="px-5 py-3.5 border-b border-slate-100 flex items-center justify-between">
            <h3 className="text-sm font-semibold text-slate-800">Stockist Invoices</h3>
            <span className="text-xs text-slate-400">{sales.length} invoices</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-100 text-[11px] font-semibold text-slate-400 bg-slate-50/50">
                  <th className="py-2.5 px-4">Invoice No</th>
                  <th className="py-2.5 px-4">Stockist / Distributor</th>
                  <th className="py-2.5 px-4">Billing Date</th>
                  <th className="py-2.5 px-4">Territory</th>
                  <th className="py-2.5 px-4 text-right">Invoice Amount</th>
                  <th className="py-2.5 px-4 text-center">Payment Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {sales.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3 px-4 font-mono font-semibold text-slate-800">
                      {item.invoice_no}
                    </td>
                    <td className="py-3 px-4 font-medium text-slate-800">
                      {item.stockist_name}
                    </td>
                    <td className="py-3 px-4 text-slate-600">
                      {item.invoice_date}
                    </td>
                    <td className="py-3 px-4 text-slate-500">
                      {item.territory}
                    </td>
                    <td className="py-3 px-4 text-right font-semibold text-slate-800">
                      ₹{Number(item.amount).toLocaleString()}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-[11px] font-medium ${
                        item.status === 'paid'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200/60'
                          : 'bg-amber-50 text-amber-700 border border-amber-200/60'
                      }`}>
                        {item.status.toUpperCase()}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </Layout>
  );
}
