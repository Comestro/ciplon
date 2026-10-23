import { usePage, Link } from '@inertiajs/react';
import { 
  FileText, 
  Download, 
  ArrowRight, 
  Calendar, 
  BarChart2, 
  CheckCircle2 
} from 'lucide-react';
import toast from 'react-hot-toast';
import AdminLayout from '../../layouts/AdminLayout';
import MRLayout from '../../layouts/MR/MRLayout';

export default function AllReports({ reports = [] }) {
  const { props } = usePage();
  const isAdmin = props.auth?.user?.role === 'admin' || props.auth?.user?.role === 'super_admin';
  const Layout = isAdmin ? AdminLayout : MRLayout;

  const handleExport = (reportTitle) => {
    toast.success(`Exporting ${reportTitle} to CSV format...`);
  };

  return (
    <Layout title={isAdmin ? "All Operational Reports" : "My Operational Reports"}>
      <div className="space-y-6 pb-12 font-sans max-w-[1400px] mx-auto">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200/80">
          <div>
            <h2 className="text-xl sm:text-2xl font-semibold tracking-tight text-slate-800">
              {isAdmin ? "Operations & Analytics Reports" : "My Operations & Performance Reports"}
            </h2>
            <p className="text-xs text-slate-500 font-normal mt-0.5">
              {isAdmin
                ? "Comprehensive Daily Call Reports (DCR), territory coverage metrics, and POB booking summaries across representatives."
                : "Your individual Daily Call Reports (DCR), doctor coverage adherence, and personal order booking summaries."}
            </p>
          </div>
        </div>

        {/* Reports Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {reports.map((rep) => (
            <div key={rep.id} className="bg-white rounded-2xl border border-slate-200/80 p-5 space-y-3 flex flex-col justify-between">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-semibold text-violet-700 bg-violet-50 px-2.5 py-0.5 rounded-md border border-violet-100">
                    {rep.category}
                  </span>
                  <span className="text-xs font-semibold text-slate-700">
                    {rep.records} {isAdmin ? "Records Indexed" : "My Records"}
                  </span>
                </div>

                <h3 className="text-base font-semibold text-slate-800">{rep.title}</h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  {rep.desc}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[11px] text-slate-400 font-medium">CSV & PDF Ready</span>
                <button
                  type="button"
                  onClick={() => handleExport(rep.title)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-medium text-xs transition-colors cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Export Report</span>
                </button>
              </div>
            </div>
          ))}
        </div>

      </div>
    </Layout>
  );
}
