// Dashboard overview component for pharmaceutical administration
import { Link } from '@inertiajs/react';
import { 
  Package, 
  FolderTree, 
  Sparkles, 
  CheckCircle2, 
  Plus, 
  ArrowRight, 
  Activity, 
  Pill, 
  Mail,
  Clock,
  Building2,
  ChevronRight
} from 'lucide-react';
import AdminLayout from '../../layouts/AdminLayout';

export default function Dashboard({ stats = {}, recentProducts = [], recentEnquiries = [] }) {
  const totalProducts = stats.totalProducts ?? 0;
  const activeProducts = stats.activeProducts ?? 0;
  const featuredProducts = stats.featuredProducts ?? 0;
  const totalCategories = stats.totalCategories ?? 0;
  const totalEnquiries = stats.totalEnquiries ?? 0;
  const pendingEnquiries = stats.pendingEnquiries ?? 0;

  return (
    <AdminLayout>
      <div className="space-y-6 pb-12">
        {/* Welcome Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white rounded-2xl border border-slate-200 p-6">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-[#c59324] mb-1">
              <Activity className="w-3.5 h-3.5" />
              <span>Ciplon Pharma Administration</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
              Operations & Inquiries Dashboard
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              Monitor commercial inquiries, distributor requests, and active formulation catalogs.
            </p>
          </div>

          <div className="flex items-center gap-2.5 self-start sm:self-auto">
            <Link
              href="/admin/enquiries"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-[#0c2340] hover:bg-slate-800 rounded-xl transition-colors shadow-xs"
            >
              <Mail className="w-3.5 h-3.5" />
              <span>View Inquiries ({pendingEnquiries})</span>
            </Link>
            <Link
              href="/admin/products/add"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 rounded-xl border border-slate-200 transition-colors"
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
              <span>Add Product</span>
            </Link>
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* 1. Commercial Inquiries */}
          <div className="bg-white rounded-2xl border border-amber-200/80 bg-amber-50/15 p-5 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-amber-700">Inquiries</span>
              <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center">
                <Mail className="w-4 h-4" />
              </div>
            </div>
            <div>
              <span className="text-2xl font-bold text-slate-900">{totalEnquiries}</span>
              <p className="text-[11px] text-amber-700 font-medium mt-0.5">{pendingEnquiries} pending review</p>
            </div>
            <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
              <Link href="/admin/enquiries" className="text-[#c59324] hover:text-[#9f6d0f] font-semibold flex items-center gap-1">
                <span>Manage inquiries</span>
                <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
          </div>

          {/* 2. Products */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Products</span>
              <div className="w-8 h-8 rounded-lg bg-slate-100 text-[#0c2340] flex items-center justify-center">
                <Package className="w-4 h-4" />
              </div>
            </div>
            <div>
              <span className="text-2xl font-bold text-slate-900">{totalProducts}</span>
              <p className="text-[11px] text-slate-500 mt-0.5">{activeProducts} active formulations</p>
            </div>
            <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
              <Link href="/admin/products" className="text-[#0c2340] hover:text-[#c59324] font-semibold flex items-center gap-1">
                <span>View catalog</span>
                <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
          </div>

          {/* 3. Categories */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Categories</span>
              <div className="w-8 h-8 rounded-lg bg-slate-100 text-[#0c2340] flex items-center justify-center">
                <FolderTree className="w-4 h-4" />
              </div>
            </div>
            <div>
              <span className="text-2xl font-bold text-slate-900">{totalCategories}</span>
              <p className="text-[11px] text-slate-500 mt-0.5">Therapeutic classifications</p>
            </div>
            <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
              <Link href="/admin/category" className="text-[#0c2340] hover:text-[#c59324] font-semibold flex items-center gap-1">
                <span>View categories</span>
                <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
          </div>

          {/* 4. Quality & Compliance */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Compliance</span>
              <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <CheckCircle2 className="w-4 h-4" />
              </div>
            </div>
            <div>
              <span className="text-base font-bold text-slate-900 block">WHO-GMP &amp; ISO</span>
              <p className="text-[11px] text-slate-500 mt-0.5">FSSAI 10426340000172</p>
            </div>
            <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
              <span className="text-[11px] text-emerald-700 font-semibold">Walpar Manufacturing Unit</span>
            </div>
          </div>
        </div>

        {/* Recent Commercial Inquiries Section */}
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
          <div className="p-5 border-b border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <Mail className="w-4.5 h-4.5 text-[#c59324]" />
              <h3 className="text-sm font-bold text-slate-900">Recent Commercial Inquiries</h3>
            </div>
            <Link
              href="/admin/enquiries"
              className="text-xs font-semibold text-[#0c2340] hover:text-[#c59324] flex items-center gap-1"
            >
              <span>See all inquiries</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {recentEnquiries.length === 0 ? (
            <div className="p-8 text-center text-xs text-slate-400">
              No inquiries received yet. Inquiries submitted via Contact and Product enquiry modals will appear here.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-sm">
                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50/60 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                    <th className="py-3 px-5">Sender</th>
                    <th className="py-3 px-4">Contact</th>
                    <th className="py-3 px-4">Inquiry Nature</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-5 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {recentEnquiries.map((enq) => (
                    <tr key={enq.id} className="hover:bg-slate-50/60 transition-colors">
                      <td className="py-3.5 px-5">
                        <div className="font-semibold text-slate-900">{enq.name}</div>
                        {enq.company && (
                          <span className="text-[11px] text-slate-400 block">{enq.company}</span>
                        )}
                      </td>
                      <td className="py-3.5 px-4 text-xs text-slate-600">
                        <div>{enq.email}</div>
                        {enq.phone && <div className="text-slate-400 text-[11px]">{enq.phone}</div>}
                      </td>
                      <td className="py-3.5 px-4 text-xs text-slate-700">
                        <span className="font-semibold">{enq.inquiry_type || 'General'}</span>
                        {enq.product_name && (
                          <span className="text-[11px] text-[#c59324] block truncate max-w-[150px]">{enq.product_name}</span>
                        )}
                      </td>
                      <td className="py-3.5 px-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${
                          enq.status === 'pending'
                            ? 'bg-amber-50 text-amber-700 border border-amber-200'
                            : enq.status === 'contacted'
                            ? 'bg-blue-50 text-blue-700'
                            : 'bg-emerald-50 text-emerald-700'
                        }`}>
                          {enq.status}
                        </span>
                      </td>
                      <td className="py-3.5 px-5 text-right">
                        <Link
                          href="/admin/enquiries"
                          className="text-xs font-semibold text-[#0c2340] hover:text-[#c59324] hover:underline"
                        >
                          View &rarr;
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Recently Registered Formulations */}
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
          <div className="p-5 border-b border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <Pill className="w-4.5 h-4.5 text-[#0c2340]" />
              <h3 className="text-sm font-bold text-slate-900">Recently Registered Formulations</h3>
            </div>
            <Link
              href="/admin/products"
              className="text-xs font-semibold text-[#0c2340] hover:text-[#c59324] flex items-center gap-1"
            >
              <span>See all products</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {recentProducts.length === 0 ? (
            <div className="p-8 text-center text-xs text-slate-400">
              No products in the catalog yet. Click "Add Product" to get started.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-sm">
                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50/60 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                    <th className="py-3 px-5">Product Name</th>
                    <th className="py-3 px-4">Category</th>
                    <th className="py-3 px-4">Dosage & Strength</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-5 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {recentProducts.map((prod) => (
                    <tr key={prod.id} className="hover:bg-slate-50/60 transition-colors">
                      <td className="py-3.5 px-5">
                        <div className="font-semibold text-slate-900">{prod.brand_name}</div>
                        <span className="text-[11px] text-slate-400 block">{prod.generic_name || 'No generic'}</span>
                      </td>
                      <td className="py-3.5 px-4">
                        {prod.category?.name ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-amber-50 text-amber-800 border border-amber-200/60">
                            {prod.category.name}
                          </span>
                        ) : (
                          <span className="text-slate-400 italic text-xs">—</span>
                        )}
                      </td>
                      <td className="py-3.5 px-4 text-xs text-slate-600">
                        {prod.dosage_form || 'Formulation'} {prod.strength ? `• ${prod.strength}` : ''}
                      </td>
                      <td className="py-3.5 px-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${
                          prod.status === 'active'
                            ? 'bg-emerald-50 text-emerald-700'
                            : 'bg-slate-100 text-slate-600'
                        }`}>
                          {prod.status}
                        </span>
                      </td>
                      <td className="py-3.5 px-5 text-right">
                        <Link
                          href={`/admin/products/${prod.id}`}
                          className="text-xs font-semibold text-[#0c2340] hover:text-[#c59324] hover:underline"
                        >
                          Details &rarr;
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
