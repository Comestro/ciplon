import { useState } from 'react';
import { usePage, Link, router } from '@inertiajs/react';
import { 
  Calendar, 
  CheckCircle2, 
  Clock, 
  ShieldCheck, 
  MapPin, 
  ChevronRight, 
  Plus, 
  Filter,
  Check,
  X
} from 'lucide-react';
import toast from 'react-hot-toast';
import AdminLayout from '../../layouts/AdminLayout';
import MRLayout from '../../layouts/MR/MRLayout';

export default function TourPlan({ tourPlans = [] }) {
  const { props } = usePage();
  const isAdmin = props.auth?.user?.role === 'admin';
  const Layout = isAdmin ? AdminLayout : MRLayout;

  const now = new Date();
  const currentMonthName = now.toLocaleString('en-US', { month: 'long', year: 'numeric' });
  const currentYear = now.getFullYear();

  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    month: currentMonthName,
    year: currentYear,
    type: 'Monthly Tour Plan (MTP)',
    days_count: 24,
    planned_visits: 120,
    notes: '',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    router.post('/mrconnect/tour-plan', formData, {
      onSuccess: () => {
        toast.success('Tour plan submitted successfully!');
        setShowModal(false);
      },
      onError: () => toast.error('Failed to submit tour plan.'),
    });
  };

  const handleApprove = (id) => {
    router.post(`/mrconnect/tour-plan/${id}/approve`, {}, {
      onSuccess: () => toast.success('Tour plan approved!'),
      onError: () => toast.error('Action failed.'),
    });
  };

  const handleReject = (id) => {
    router.post(`/mrconnect/tour-plan/${id}/reject`, {}, {
      onSuccess: () => toast.success('Tour plan rejected.'),
      onError: () => toast.error('Action failed.'),
    });
  };

  return (
    <Layout title={isAdmin ? "Monthly Tour Plan (MTP)" : "My Monthly Tour Plan"}>
      <div className="space-y-6 pb-12 font-sans max-w-[1400px] mx-auto">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200/80">
          <div>
            <h2 className="text-xl sm:text-2xl font-semibold tracking-tight text-slate-800">
              {isAdmin ? "Monthly Tour Plan (MTP) Schedules" : "My Monthly Tour Plan (MTP)"}
            </h2>
            <p className="text-xs text-slate-500 font-normal mt-0.5">
              {isAdmin 
                ? "Review and manage field representative doctor route plans and monthly tour approvals."
                : "Submit and monitor your doctor route coverage schedules and administrative approval status."}
            </p>
          </div>

          <div className="flex items-center gap-2">
            {!isAdmin ? (
              <button
                type="button"
                onClick={() => setShowModal(true)}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-medium text-xs transition-colors cursor-pointer shadow-xs"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Submit Tour Plan</span>
              </button>
            ) : (
              <Link
                href="/admin/tracking"
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-medium text-xs transition-colors cursor-pointer shadow-xs"
              >
                <MapPin className="w-3.5 h-3.5" />
                <span>Live Tour Tracking Map</span>
              </Link>
            )}
          </div>
        </div>

        {/* 4 Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <div className="bg-white rounded-2xl border border-slate-200/80 p-5">
            <span className="text-xs font-medium text-slate-500">
              {isAdmin ? "Total Plans Submitted" : "My Tour Plans"}
            </span>
            <p className="text-2xl font-semibold text-slate-800 mt-2">{tourPlans.length}</p>
            <p className="text-[11px] text-slate-400 mt-1">Recorded cycles</p>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200/80 p-5">
            <span className="text-xs font-medium text-slate-500">Approved Plans</span>
            <p className="text-2xl font-semibold text-emerald-600 mt-2">
              {tourPlans.filter(p => p.status === 'approved').length}
            </p>
            <p className="text-[11px] text-emerald-600 font-medium mt-1">Active field routes</p>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200/80 p-5">
            <span className="text-xs font-medium text-slate-500">Pending Review</span>
            <p className="text-2xl font-semibold text-amber-600 mt-2">
              {tourPlans.filter(p => p.status === 'pending').length}
            </p>
            <p className="text-[11px] text-amber-600 font-medium mt-1">Awaiting management</p>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200/80 p-5">
            <span className="text-xs font-medium text-slate-500">Planned Call Density</span>
            <p className="text-2xl font-semibold text-violet-600 mt-2">
              {tourPlans.reduce((sum, p) => sum + (p.planned_visits || 0), 0)} Calls
            </p>
            <p className="text-[11px] text-slate-400 mt-1">Doctor touchpoints</p>
          </div>
        </div>

        {/* Tour Plans Table */}
        <div className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden">
          <div className="px-5 py-3.5 border-b border-slate-100 flex items-center justify-between">
            <h3 className="text-sm font-semibold text-slate-800">
              {isAdmin ? "Field Tour Plans" : "My Tour Schedules"}
            </h3>
            <span className="text-xs text-slate-400">{tourPlans.length} records</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-100 text-[11px] font-semibold text-slate-400 bg-slate-50/50">
                  {isAdmin && <th className="py-2.5 px-4">Representative</th>}
                  <th className="py-2.5 px-4">Month / Period</th>
                  <th className="py-2.5 px-4 text-center">Working Days</th>
                  <th className="py-2.5 px-4 text-center">Planned Visits</th>
                  <th className="py-2.5 px-4">Notes</th>
                  <th className="py-2.5 px-4 text-center">Status</th>
                  {isAdmin && <th className="py-2.5 px-4 text-center">Actions</th>}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {tourPlans.length === 0 ? (
                  <tr>
                    <td colSpan={isAdmin ? 7 : 5} className="py-8 text-center text-slate-400 text-xs">
                      No tour plans found. Click "Submit Tour Plan" above to create one.
                    </td>
                  </tr>
                ) : (
                  tourPlans.map((plan) => (
                    <tr key={plan.id} className="hover:bg-slate-50/70 transition-colors">
                      {isAdmin && (
                        <td className="py-3 px-4 font-medium text-slate-800">
                          {plan.user_name}
                        </td>
                      )}
                      <td className="py-3 px-4 font-medium text-slate-700">
                        {plan.month} {plan.year}
                      </td>
                      <td className="py-3 px-4 text-center font-medium text-slate-800">
                        {plan.days_count} days
                      </td>
                      <td className="py-3 px-4 text-center font-medium text-violet-700">
                        {plan.planned_visits} visits
                      </td>
                      <td className="py-3 px-4 text-slate-500 max-w-xs truncate">
                        {plan.notes || 'Routine monthly territory coverage.'}
                      </td>
                      <td className="py-3 px-4 text-center">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-[11px] font-medium ${
                          plan.status === 'approved'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200/60'
                            : plan.status === 'rejected'
                            ? 'bg-rose-50 text-rose-700 border border-rose-200/60'
                            : 'bg-amber-50 text-amber-700 border border-amber-200/60'
                        }`}>
                          {plan.status.charAt(0).toUpperCase() + plan.status.slice(1)}
                        </span>
                      </td>
                      {isAdmin && (
                        <td className="py-3 px-4 text-center">
                          {plan.status === 'pending' ? (
                            <div className="flex items-center justify-center gap-1.5">
                              <button
                                type="button"
                                onClick={() => handleApprove(plan.id)}
                                className="p-1 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 transition-colors"
                                title="Approve Plan"
                              >
                                <Check className="w-3.5 h-3.5" />
                              </button>
                              <button
                                type="button"
                                onClick={() => handleReject(plan.id)}
                                className="p-1 rounded-lg bg-rose-50 text-rose-700 hover:bg-rose-100 transition-colors"
                                title="Reject Plan"
                              >
                                <X className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          ) : (
                            <span className="text-[11px] text-slate-400">Reviewed</span>
                          )}
                        </td>
                      )}
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>

      {/* Submit Tour Plan Modal (MR) */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl max-w-md w-full border border-slate-200 p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-semibold text-slate-800">Submit Monthly Tour Plan</h3>
              <button 
                type="button" 
                onClick={() => setShowModal(false)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Month / Period</label>
                <input
                  type="text"
                  required
                  value={formData.month}
                  onChange={(e) => setFormData({ ...formData, month: e.target.value })}
                  placeholder="e.g. August 2026"
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-violet-500/20"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Working Days</label>
                  <input
                    type="number"
                    min="1"
                    max="31"
                    required
                    value={formData.days_count}
                    onChange={(e) => setFormData({ ...formData, days_count: parseInt(e.target.value) || '' })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-violet-500/20"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Planned Doctor Visits</label>
                  <input
                    type="number"
                    min="1"
                    max="300"
                    required
                    value={formData.planned_visits}
                    onChange={(e) => setFormData({ ...formData, planned_visits: parseInt(e.target.value) || '' })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-violet-500/20"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Route & Field Notes</label>
                <textarea
                  rows="3"
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="Specify key clinic stops, ex-station days, and joint fieldwork plans..."
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-violet-500/20"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-3.5 py-1.5 rounded-xl border border-slate-200 text-xs text-slate-600 hover:bg-slate-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-medium text-xs cursor-pointer shadow-xs"
                >
                  Submit Plan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </Layout>
  );
}
