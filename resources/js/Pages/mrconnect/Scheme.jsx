import { usePage } from '@inertiajs/react';
import { 
  Percent, 
  Tag, 
  Calendar, 
  Sparkles, 
  Gift 
} from 'lucide-react';
import AdminLayout from '../../layouts/AdminLayout';
import MRLayout from '../../layouts/MR/MRLayout';

export default function Scheme({ schemes = [] }) {
  const { props } = usePage();
  const isAdmin = props.auth?.user?.role === 'admin';
  const Layout = isAdmin ? AdminLayout : MRLayout;

  return (
    <Layout title="Product Schemes & Commercial Offers">
      <div className="space-y-6 pb-12 font-sans max-w-[1400px] mx-auto">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200/80">
          <div>
            <h2 className="text-xl sm:text-2xl font-semibold tracking-tight text-slate-800">
              Commercial Schemes & Promotional Offers
            </h2>
            <p className="text-xs text-slate-500 font-normal mt-0.5">
              Bonus units, volume rebates, and trade settlement discounts available to chemists.
            </p>
          </div>
        </div>

        {/* Schemes Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {schemes.map((sc) => (
            <div key={sc.id} className="bg-white rounded-2xl border border-slate-200/80 p-5 space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <span className="text-xs font-semibold text-violet-700 bg-violet-50 px-2.5 py-1 rounded-lg border border-violet-100">
                  {sc.product_name}
                </span>
                <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200/60">
                  Active Offer
                </span>
              </div>

              <h3 className="text-base font-semibold text-slate-800">{sc.title}</h3>
              <p className="text-xs text-slate-600 font-medium bg-slate-50 p-3 rounded-xl border border-slate-200/60">
                {sc.offer_detail}
              </p>

              <div className="flex items-center justify-between text-xs text-slate-500 pt-2">
                <span>Validity: {sc.valid_from} &rarr; {sc.valid_until}</span>
                <span className="font-semibold text-slate-800">Equivalent ~{sc.discount_percent}% Margin</span>
              </div>
            </div>
          ))}
        </div>

      </div>
    </Layout>
  );
}
