import { useState } from 'react';
import { usePage, router } from '@inertiajs/react';
import { 
  Receipt, 
  Plus, 
  CheckCircle2, 
  Clock, 
  XCircle, 
  Calendar, 
  MapPin, 
  Car, 
  DollarSign, 
  Check, 
  X, 
  ArrowLeft 
} from 'lucide-react';
import toast from 'react-hot-toast';
import AdminLayout from '../../layouts/AdminLayout';
import MRLayout from '../../layouts/MR/MRLayout';

export default function FieldExpenses({ expenses = [], summary = {} }) {
  const { props } = usePage();
  const isAdmin = props.auth?.user?.role === 'admin';
  const Layout = isAdmin ? AdminLayout : MRLayout;

  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    expense_type: 'daily_allowance',
    amount: '',
    distance_km: '',
    city: '',
    notes: '',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    router.post('/mrconnect/field-expenses', formData, {
      onSuccess: () => {
        toast.success('Field expense claim submitted successfully.');
        setShowModal(false);
        setFormData({
          date: new Date().toISOString().split('T')[0],
          expense_type: 'daily_allowance',
          amount: '',
          distance_km: '',
          city: '',
          notes: '',
        });
      },
      onError: () => toast.error('Failed to submit expense.'),
    });
  };

  const handleApprove = (id) => {
    router.post(`/mrconnect/field-expenses/${id}/approve`, {}, {
      onSuccess: () => toast.success('Expense claim approved!'),
    });
  };

  return (
    <Layout title={isAdmin ? "Field Expenses" : "My Field Expenses"}>
      <div className="space-y-6 pb-12 font-sans max-w-[1400px] mx-auto">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200/80">
          <div>
            <h2 className="text-xl sm:text-2xl font-semibold tracking-tight text-slate-800">
              {isAdmin ? "Field Expenses & Daily Allowance (DA/TA)" : "My Field Expenses (DA/TA)"}
            </h2>
            <p className="text-xs text-slate-500 font-normal mt-0.5">
              {isAdmin 
                ? "Review, audit, and approve field representative travel claims and allowances."
                : "Submit daily travel claims, mileage allowances, lodging, and meal expenses."}
            </p>
          </div>

          <button
            type="button"
            onClick={() => setShowModal(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-medium text-xs transition-colors cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Claim Expense</span>
          </button>
        </div>

        {/* 3 Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white rounded-2xl border border-slate-200/80 p-5">
            <span className="text-xs font-medium text-slate-500">Total Claimed</span>
            <p className="text-2xl font-semibold text-slate-800 mt-2">
              ₹{Number(summary.total_claimed || 0).toLocaleString()}
            </p>
            <p className="text-[11px] text-slate-400 mt-1">All submitted claims</p>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200/80 p-5">
            <span className="text-xs font-medium text-slate-500">Approved & Disbursed</span>
            <p className="text-2xl font-semibold text-emerald-600 mt-2">
              ₹{Number(summary.approved_amount || 0).toLocaleString()}
            </p>
            <p className="text-[11px] text-emerald-600 font-medium mt-1">Processed by finance</p>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200/80 p-5">
            <span className="text-xs font-medium text-slate-500">Pending Review</span>
            <p className="text-2xl font-semibold text-amber-600 mt-2">
              ₹{Number(summary.pending_amount || 0).toLocaleString()}
            </p>
            <p className="text-[11px] text-amber-600 font-medium mt-1">Awaiting management</p>
          </div>
        </div>

        {/* Expenses List */}
        <div className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden">
          <div className="px-5 py-3.5 border-b border-slate-100 flex items-center justify-between">
            <h3 className="text-sm font-semibold text-slate-800">Expense Claim Records</h3>
            <span className="text-xs text-slate-400">{expenses.length} claims</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-100 text-[11px] font-semibold text-slate-400 bg-slate-50/50">
                  <th className="py-2.5 px-4">Date</th>
                  {isAdmin && <th className="py-2.5 px-4">Representative</th>}
                  <th className="py-2.5 px-4">Type</th>
                  <th className="py-2.5 px-4">Location / Distance</th>
                  <th className="py-2.5 px-4 text-right">Amount</th>
                  <th className="py-2.5 px-4 text-center">Status</th>
                  {isAdmin && <th className="py-2.5 px-4 text-right">Action</th>}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {expenses.length > 0 ? (
                  expenses.map((exp) => (
                    <tr key={exp.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3 px-4 font-medium text-slate-800 whitespace-nowrap">
                        {exp.date}
                      </td>
                      {isAdmin && (
                        <td className="py-3 px-4 font-medium text-slate-700">
                          {exp.user_name || 'Representative'}
                        </td>
                      )}
                      <td className="py-3 px-4 capitalize text-slate-600">
                        {exp.expense_type.replace('_', ' ')}
                      </td>
                      <td className="py-3 px-4 text-slate-500">
                        {exp.city} {exp.distance_km ? `(${exp.distance_km} km)` : ''}
                      </td>
                      <td className="py-3 px-4 text-right font-semibold text-slate-800">
                        ₹{Number(exp.amount).toFixed(2)}
                      </td>
                      <td className="py-3 px-4 text-center">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-[11px] font-medium ${
                          exp.status === 'approved'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200/60'
                            : exp.status === 'rejected'
                            ? 'bg-rose-50 text-rose-700 border border-rose-200/60'
                            : 'bg-amber-50 text-amber-700 border border-amber-200/60'
                        }`}>
                          {exp.status === 'approved' && <CheckCircle2 className="w-3 h-3" />}
                          {exp.status === 'pending' && <Clock className="w-3 h-3" />}
                          {exp.status.charAt(0).toUpperCase() + exp.status.slice(1)}
                        </span>
                      </td>
                      {isAdmin && (
                        <td className="py-3 px-4 text-right">
                          {exp.status === 'pending' && (
                            <button
                              type="button"
                              onClick={() => handleApprove(exp.id)}
                              className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-[11px] transition-colors cursor-pointer"
                            >
                              Approve
                            </button>
                          )}
                        </td>
                      )}
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={isAdmin ? 7 : 5} className="py-8 text-center text-slate-400">
                      No expense claims submitted yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>

      {/* Expense Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl border border-slate-200 max-w-md w-full p-6 space-y-4 shadow-xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-semibold text-slate-800">Submit Expense Claim</h3>
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
                <label className="block text-xs font-medium text-slate-700 mb-1">Date</label>
                <input
                  type="date"
                  required
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Expense Type</label>
                <select
                  value={formData.expense_type}
                  onChange={(e) => setFormData({ ...formData, expense_type: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 cursor-pointer"
                >
                  <option value="daily_allowance">Daily Allowance (DA)</option>
                  <option value="travel_fuel">Travel & Fuel Allowance (TA)</option>
                  <option value="lodging">Hotel & Lodging</option>
                  <option value="meal">Client / Doctor CME Hospitality</option>
                  <option value="miscellaneous">Stationery & Courier</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Claim Amount (₹)</label>
                  <input
                    type="number"
                    required
                    min="1"
                    placeholder="450"
                    value={formData.amount}
                    onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Distance (km)</label>
                  <input
                    type="number"
                    placeholder="42"
                    value={formData.distance_km}
                    onChange={(e) => setFormData({ ...formData, distance_km: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Territory / City</label>
                <input
                  type="text"
                  placeholder="Nagercoil / Kanyakumari"
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Remarks</label>
                <textarea
                  rows="2"
                  placeholder="Notes regarding fieldwork coverage..."
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
                  Submit Claim
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </Layout>
  );
}
