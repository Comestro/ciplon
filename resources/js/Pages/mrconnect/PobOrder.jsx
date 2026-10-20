import { useState } from 'react';
import { usePage, router } from '@inertiajs/react';
import { 
  Package, 
  Plus, 
  ShoppingBag, 
  CheckCircle2, 
  Clock, 
  X, 
  Building2, 
  User 
} from 'lucide-react';
import toast from 'react-hot-toast';
import AdminLayout from '../../layouts/AdminLayout';
import MRLayout from '../../layouts/MR/MRLayout';

export default function PobOrder({ orders = [], doctors = [], summary = {} }) {
  const { props } = usePage();
  const isAdmin = props.auth?.user?.role === 'admin';
  const Layout = isAdmin ? AdminLayout : MRLayout;

  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    chemist_name: '',
    doctor_id: '',
    total_amount: '',
    notes: '',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    router.post('/mrconnect/pob-order', formData, {
      onSuccess: () => {
        toast.success('POB order booked successfully!');
        setShowModal(false);
        setFormData({
          chemist_name: '',
          doctor_id: '',
          total_amount: '',
          notes: '',
        });
      },
      onError: () => toast.error('Failed to book POB order.'),
    });
  };

  return (
    <Layout title="POB Order Booking">
      <div className="space-y-6 pb-12 font-sans max-w-[1400px] mx-auto">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200/80">
          <div>
            <h2 className="text-xl sm:text-2xl font-semibold tracking-tight text-slate-800">
              Personal Order Booking (POB Orders)
            </h2>
            <p className="text-xs text-slate-500 font-normal mt-0.5">
              Book retail chemist orders and doctor prescription stock requirements directly from the field.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setShowModal(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-medium text-xs transition-colors cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Book New POB Order</span>
          </button>
        </div>

        {/* 3 Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white rounded-2xl border border-slate-200/80 p-5">
            <span className="text-xs font-medium text-slate-500">Total Orders Booked</span>
            <p className="text-2xl font-semibold text-slate-800 mt-2">{summary.total_orders || orders.length}</p>
            <p className="text-[11px] text-slate-400 mt-1">Field prescription orders</p>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200/80 p-5">
            <span className="text-xs font-medium text-slate-500">Total Order Booking Value</span>
            <p className="text-2xl font-semibold text-violet-600 mt-2">
              ₹{Number(summary.total_value || 0).toLocaleString()}
            </p>
            <p className="text-[11px] text-slate-400 mt-1">Gross sales generated</p>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200/80 p-5">
            <span className="text-xs font-medium text-slate-500">Stockist Verified</span>
            <p className="text-2xl font-semibold text-emerald-600 mt-2">{summary.verified_orders || 0}</p>
            <p className="text-[11px] text-emerald-600 font-medium mt-1">Approved for dispatch</p>
          </div>
        </div>

        {/* Orders Table */}
        <div className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden">
          <div className="px-5 py-3.5 border-b border-slate-100 flex items-center justify-between">
            <h3 className="text-sm font-semibold text-slate-800">Recent POB Bookings</h3>
            <span className="text-xs text-slate-400">{orders.length} orders</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-100 text-[11px] font-semibold text-slate-400 bg-slate-50/50">
                  <th className="py-2.5 px-4">Order No</th>
                  <th className="py-2.5 px-4">Chemist / Pharmacy</th>
                  <th className="py-2.5 px-4">Representative</th>
                  <th className="py-2.5 px-4 text-center">Items</th>
                  <th className="py-2.5 px-4 text-right">Order Amount</th>
                  <th className="py-2.5 px-4 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {orders.length > 0 ? (
                  orders.map((ord) => (
                    <tr key={ord.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3 px-4 font-mono font-semibold text-slate-800">
                        {ord.order_no}
                      </td>
                      <td className="py-3 px-4 font-medium text-slate-800">
                        {ord.chemist_name}
                      </td>
                      <td className="py-3 px-4 text-slate-600">
                        {ord.representative_name || 'Representative'}
                      </td>
                      <td className="py-3 px-4 text-center text-slate-600">
                        {ord.items_count} products
                      </td>
                      <td className="py-3 px-4 text-right font-semibold text-slate-800">
                        ₹{Number(ord.total_amount).toLocaleString()}
                      </td>
                      <td className="py-3 px-4 text-center">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-[11px] font-medium ${
                          ord.status === 'verified'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200/60'
                            : 'bg-amber-50 text-amber-700 border border-amber-200/60'
                        }`}>
                          {ord.status.charAt(0).toUpperCase() + ord.status.slice(1)}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-slate-400">
                      No POB orders recorded yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>

      {/* Book POB Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl border border-slate-200 max-w-md w-full p-6 space-y-4 shadow-xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-semibold text-slate-800">Book Personal Order (POB)</h3>
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Chemist / Retail Pharmacy</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Apollo Pharmacy, KP Road"
                  value={formData.chemist_name}
                  onChange={(e) => setFormData({ ...formData, chemist_name: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Prescribing Doctor (Optional)</label>
                <select
                  value={formData.doctor_id}
                  onChange={(e) => setFormData({ ...formData, doctor_id: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 cursor-pointer"
                >
                  <option value="">Select Doctor...</option>
                  {doctors.map((doc) => (
                    <option key={doc.id} value={doc.id}>
                      {doc.name} ({doc.clinic_hospital_name})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Total Order Value (₹)</label>
                <input
                  type="number"
                  required
                  min="1"
                  placeholder="8500"
                  value={formData.total_amount}
                  onChange={(e) => setFormData({ ...formData, total_amount: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Notes & Product Breakdown</label>
                <textarea
                  rows="2"
                  placeholder="e.g. Factocel-IX 10 vials, Globucel-SC 5 vials..."
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500"
                ></textarea>
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-medium text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl text-xs font-medium text-white bg-slate-900 hover:bg-slate-800 transition-colors cursor-pointer"
                >
                  Submit Order
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </Layout>
  );
}
