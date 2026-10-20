import { useState } from 'react';
import { usePage, router } from '@inertiajs/react';
import { 
  Calendar, 
  Plus, 
  CheckCircle2, 
  Clock, 
  X, 
  Check, 
  AlertCircle, 
  User 
} from 'lucide-react';
import toast from 'react-hot-toast';
import AdminLayout from '../../layouts/AdminLayout';
import MRLayout from '../../layouts/MR/MRLayout';

export default function Leave({ leaves = [], balances = {} }) {
  const { props } = usePage();
  const isAdmin = props.auth?.user?.role === 'admin';
  const Layout = isAdmin ? AdminLayout : MRLayout;

  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    leave_type: 'casual',
    from_date: new Date().toISOString().split('T')[0],
    to_date: new Date().toISOString().split('T')[0],
    reason: '',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    router.post('/mrconnect/leave', formData, {
      onSuccess: () => {
        toast.success('Leave application submitted.');
        setShowModal(false);
        setFormData({
          leave_type: 'casual',
          from_date: new Date().toISOString().split('T')[0],
          to_date: new Date().toISOString().split('T')[0],
          reason: '',
        });
      },
      onError: () => toast.error('Failed to submit leave.'),
    });
  };

  const handleApprove = (id) => {
    router.post(`/mrconnect/leave/${id}/approve`, {}, {
      onSuccess: () => toast.success('Leave approved!'),
    });
  };

  return (
    <Layout title={isAdmin ? "Leave Management" : "My Leaves"}>
      <div className="space-y-6 pb-12 font-sans max-w-[1400px] mx-auto">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200/80">
          <div>
            <h2 className="text-xl sm:text-2xl font-semibold tracking-tight text-slate-800">
              {isAdmin ? "Leave Applications & Approvals" : "My Leaves & Absence"}
            </h2>
            <p className="text-xs text-slate-500 font-normal mt-0.5">
              {isAdmin
                ? "Review, audit, and approve field staff absence requests and quota balances."
                : "Apply for casual, sick, and earned leaves with instant manager workflow."}
            </p>
          </div>

          <button
            type="button"
            onClick={() => setShowModal(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-medium text-xs transition-colors cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Apply Leave</span>
          </button>
        </div>

        {/* 4 Balance Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <div className="bg-white rounded-2xl border border-slate-200/80 p-5">
            <span className="text-xs font-medium text-slate-500">Casual Leave (CL)</span>
            <p className="text-2xl font-semibold text-slate-800 mt-2">{balances.casual_leave || 8} Days</p>
            <p className="text-[11px] text-slate-400 mt-1">Available balance</p>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200/80 p-5">
            <span className="text-xs font-medium text-slate-500">Sick Leave (SL)</span>
            <p className="text-2xl font-semibold text-slate-800 mt-2">{balances.sick_leave || 6} Days</p>
            <p className="text-[11px] text-slate-400 mt-1">Medical quota</p>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200/80 p-5">
            <span className="text-xs font-medium text-slate-500">Earned Leave (EL)</span>
            <p className="text-2xl font-semibold text-slate-800 mt-2">{balances.earned_leave || 12} Days</p>
            <p className="text-[11px] text-slate-400 mt-1">Accrued privilege</p>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200/80 p-5">
            <span className="text-xs font-medium text-slate-500">Pending Requests</span>
            <p className="text-2xl font-semibold text-amber-600 mt-2">{balances.pending_requests || 0}</p>
            <p className="text-[11px] text-amber-600 font-medium mt-1">Awaiting approval</p>
          </div>
        </div>

        {/* Leaves Table */}
        <div className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden">
          <div className="px-5 py-3.5 border-b border-slate-100 flex items-center justify-between">
            <h3 className="text-sm font-semibold text-slate-800">
              {isAdmin ? "All Staff Leave Applications" : "My Leave History"}
            </h3>
            <span className="text-xs text-slate-400">{leaves.length} records</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-100 text-[11px] font-semibold text-slate-400 bg-slate-50/50">
                  {isAdmin && <th className="py-2.5 px-4">Employee</th>}
                  <th className="py-2.5 px-4">Leave Type</th>
                  <th className="py-2.5 px-4">From Date</th>
                  <th className="py-2.5 px-4">To Date</th>
                  <th className="py-2.5 px-4 text-center">Days</th>
                  <th className="py-2.5 px-4">Reason</th>
                  <th className="py-2.5 px-4 text-center">Status</th>
                  {isAdmin && <th className="py-2.5 px-4 text-right">Action</th>}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {leaves.length > 0 ? (
                  leaves.map((lv) => (
                    <tr key={lv.id} className="hover:bg-slate-50/70 transition-colors">
                      {isAdmin && (
                        <td className="py-3 px-4 font-medium text-slate-800">
                          {lv.user_name || 'Representative'}
                        </td>
                      )}
                      <td className="py-3 px-4 capitalize text-slate-700">
                        {lv.leave_type} Leave
                      </td>
                      <td className="py-3 px-4 text-slate-600">
                        {lv.from_date}
                      </td>
                      <td className="py-3 px-4 text-slate-600">
                        {lv.to_date}
                      </td>
                      <td className="py-3 px-4 text-center font-medium text-slate-800">
                        {lv.days_count}
                      </td>
                      <td className="py-3 px-4 text-slate-500 max-w-xs truncate">
                        {lv.reason}
                      </td>
                      <td className="py-3 px-4 text-center">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-[11px] font-medium ${
                          lv.status === 'approved'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200/60'
                            : lv.status === 'rejected'
                            ? 'bg-rose-50 text-rose-700 border border-rose-200/60'
                            : 'bg-amber-50 text-amber-700 border border-amber-200/60'
                        }`}>
                          {lv.status.charAt(0).toUpperCase() + lv.status.slice(1)}
                        </span>
                      </td>
                      {isAdmin && (
                        <td className="py-3 px-4 text-right">
                          {lv.status === 'pending' && (
                            <button
                              type="button"
                              onClick={() => handleApprove(lv.id)}
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
                    <td colSpan={isAdmin ? 8 : 6} className="py-8 text-center text-slate-400">
                      No leave records recorded yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>

      {/* Apply Leave Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl border border-slate-200 max-w-md w-full p-6 space-y-4 shadow-xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-semibold text-slate-800">Apply for Leave</h3>
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
                <label className="block text-xs font-medium text-slate-700 mb-1">Leave Category</label>
                <select
                  value={formData.leave_type}
                  onChange={(e) => setFormData({ ...formData, leave_type: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 cursor-pointer"
                >
                  <option value="casual">Casual Leave (CL)</option>
                  <option value="sick">Sick Leave (SL)</option>
                  <option value="earned">Earned Leave (EL)</option>
                  <option value="compensatory">Compensatory Off</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">From Date</label>
                  <input
                    type="date"
                    required
                    value={formData.from_date}
                    onChange={(e) => setFormData({ ...formData, from_date: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">To Date</label>
                  <input
                    type="date"
                    required
                    value={formData.to_date}
                    onChange={(e) => setFormData({ ...formData, to_date: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Reason for Absence</label>
                <textarea
                  rows="3"
                  required
                  placeholder="Please state details regarding your leave..."
                  value={formData.reason}
                  onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
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
                  Submit Application
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </Layout>
  );
}
