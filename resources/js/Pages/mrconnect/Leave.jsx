import { useState, useMemo } from 'react';
import { usePage, router } from '@inertiajs/react';
import { 
  Calendar, 
  Plus, 
  CheckCircle2, 
  Clock, 
  XCircle,
  X, 
  Check, 
  AlertCircle, 
  User,
  Filter,
  FileText,
  CalendarRange,
  MessageSquare
} from 'lucide-react';
import toast from 'react-hot-toast';
import AdminLayout from '../../layouts/AdminLayout';
import ConfirmModal from '../../components/common/ConfirmModal';
import MRLayout from '../../layouts/MR/MRLayout';

export default function Leave({ leaves = [], stats = {}, balances = {} }) {
  const { props } = usePage();
  const isAdmin = props.auth?.user?.role === 'admin' || props.auth?.user?.role === 'super_admin';
  const Layout = isAdmin ? AdminLayout : MRLayout;

  const [showModal, setShowModal] = useState(false);
  const [approvingLeave, setApprovingLeave] = useState(null);
  const [isApproving, setIsApproving] = useState(false);
  const [rejectingLeave, setRejectingLeave] = useState(null);
  const [isRejecting, setIsRejecting] = useState(false);
  const [selectedLeaveId, setSelectedLeaveId] = useState(null);
  const [rejectReason, setRejectReason] = useState('');
  const [rejectError, setRejectError] = useState('');
  const [activeFilter, setActiveFilter] = useState('all'); // all, pending, approved, rejected
  const [isSubmitting, setIsSubmitting] = useState(false);

  const todayStr = new Date().toISOString().split('T')[0];

  const [formData, setFormData] = useState({
    leave_type: 'casual',
    from_date: todayStr,
    to_date: todayStr,
    reason: '',
  });

  // Calculate live days count in apply modal
  const calculatedDays = useMemo(() => {
    if (!formData.from_date || !formData.to_date) return 0;
    const start = new Date(formData.from_date);
    const end = new Date(formData.to_date);
    const diffTime = end - start;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
    return diffDays;
  }, [formData.from_date, formData.to_date]);

  // Derived real-time stats (fallback to leaves array count if stats not passed)
  const computedStats = useMemo(() => {
    const total = stats.total ?? leaves.length;
    const pending = stats.pending ?? leaves.filter(l => l.status === 'pending').length;
    const approved = stats.approved ?? leaves.filter(l => l.status === 'approved').length;
    const rejected = stats.rejected ?? leaves.filter(l => l.status === 'rejected').length;
    const totalDaysApproved = stats.total_days_approved ?? leaves
      .filter(l => l.status === 'approved')
      .reduce((sum, l) => sum + (Number(l.days_count) || 0), 0);

    return { total, pending, approved, rejected, totalDaysApproved };
  }, [leaves, stats]);

  // Filter leaves based on active tab
  const filteredLeaves = useMemo(() => {
    if (activeFilter === 'all') return leaves;
    return leaves.filter(l => l.status === activeFilter);
  }, [leaves, activeFilter]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (calculatedDays <= 0) {
      toast.error('To Date cannot be earlier than From Date.');
      return;
    }

    setIsSubmitting(true);
    router.post('/mrconnect/leave', formData, {
      onSuccess: () => {
        setShowModal(false);
        setIsSubmitting(false);
        setFormData({
          leave_type: 'casual',
          from_date: todayStr,
          to_date: todayStr,
          reason: '',
        });
      },
      onError: (err) => {
        setIsSubmitting(false);
        const msg = Object.values(err)[0] || 'Failed to submit leave.';
        toast.error(msg);
      },
    });
  };

  const confirmApproveLeave = () => {
    if (!approvingLeave) return;
    setIsApproving(true);
    router.post(`/mrconnect/leave/${approvingLeave.id}/approve`, {}, {
      onFinish: () => {
        setIsApproving(false);
        setApprovingLeave(null);
      },
      onError: () => {
        setIsApproving(false);
      },
    });
  };

  const confirmRejectLeave = () => {
    if (!rejectingLeave) return;
    if (!rejectReason.trim()) {
      setRejectError('Please provide feedback or a reason for declining this leave request.');
      return;
    }

    setRejectError('');
    setIsRejecting(true);
    router.post(`/mrconnect/leave/${rejectingLeave.id}/reject`, { reason: rejectReason }, {
      onFinish: () => {
        setIsRejecting(false);
        setRejectingLeave(null);
        setRejectReason('');
        setRejectError('');
      },
      onError: () => {
        setIsRejecting(false);
      },
    });
  };

  return (
    <Layout title={isAdmin ? "Leave Management" : "My Leaves"}>
      <div className="space-y-6 pb-12 font-sans max-w-[1400px] mx-auto">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200/80">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
              {isAdmin ? "Staff Leave Management" : "My Leaves & Absence"}
            </h2>
            <p className="text-xs text-slate-500 font-normal mt-0.5">
              {isAdmin
                ? "Review, audit, approve or decline field staff absence requests."
                : "Submit leave requests and monitor your application status in real-time."}
            </p>
          </div>

          <button
            type="button"
            onClick={() => setShowModal(true)}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-medium text-xs shadow-sm hover:shadow transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Apply Leave</span>
          </button>
        </div>

        {/* 4 Summary Stats Cards (Option 1) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* 1. Total Applications */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs hover:border-slate-300 transition-all">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Applications</span>
              <div className="w-9 h-9 rounded-xl bg-slate-100 flex items-center justify-center text-slate-700">
                <FileText className="w-4 h-4" />
              </div>
            </div>
            <p className="text-2xl sm:text-3xl font-bold text-slate-800 mt-2">{computedStats.total}</p>
            <p className="text-[11px] text-slate-400 mt-1">Total requests recorded</p>
          </div>

          {/* 2. Pending Approval */}
          <div className="bg-white rounded-2xl border border-amber-200/70 p-5 shadow-xs hover:border-amber-300 bg-amber-50/20 transition-all">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-amber-700 uppercase tracking-wider">Pending Review</span>
              <div className="w-9 h-9 rounded-xl bg-amber-100 flex items-center justify-center text-amber-600">
                <Clock className="w-4 h-4" />
              </div>
            </div>
            <p className="text-2xl sm:text-3xl font-bold text-amber-600 mt-2">{computedStats.pending}</p>
            <p className="text-[11px] text-amber-600/80 font-medium mt-1">Awaiting manager action</p>
          </div>

          {/* 3. Approved Leaves */}
          <div className="bg-white rounded-2xl border border-emerald-200/70 p-5 shadow-xs hover:border-emerald-300 bg-emerald-50/20 transition-all">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-emerald-700 uppercase tracking-wider">Approved</span>
              <div className="w-9 h-9 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-600">
                <CheckCircle2 className="w-4 h-4" />
              </div>
            </div>
            <p className="text-2xl sm:text-3xl font-bold text-emerald-600 mt-2">{computedStats.approved}</p>
            <p className="text-[11px] text-emerald-700/80 font-medium mt-1">
              {computedStats.totalDaysApproved} days total sanctioned
            </p>
          </div>

          {/* 4. Rejected Leaves */}
          <div className="bg-white rounded-2xl border border-rose-200/70 p-5 shadow-xs hover:border-rose-300 bg-rose-50/20 transition-all">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-rose-700 uppercase tracking-wider">Rejected</span>
              <div className="w-9 h-9 rounded-xl bg-rose-100 flex items-center justify-center text-rose-600">
                <XCircle className="w-4 h-4" />
              </div>
            </div>
            <p className="text-2xl sm:text-3xl font-bold text-rose-600 mt-2">{computedStats.rejected}</p>
            <p className="text-[11px] text-rose-600/80 font-medium mt-1">Declined applications</p>
          </div>
        </div>

        {/* Leaves Table with Status Filters */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
          {/* Table Header & Filter Tabs */}
          <div className="px-5 py-3.5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50/40">
            <div>
              <h3 className="text-sm font-bold text-slate-800">
                {isAdmin ? "All Staff Leave Applications" : "Leave History"}
              </h3>
              <p className="text-[11px] text-slate-400">Showing {filteredLeaves.length} of {leaves.length} records</p>
            </div>

            {/* Filter Tabs */}
            <div className="flex items-center gap-1 bg-slate-100/80 p-1 rounded-xl text-xs">
              <button
                type="button"
                onClick={() => setActiveFilter('all')}
                className={`px-3 py-1 rounded-lg font-medium transition-all cursor-pointer ${
                  activeFilter === 'all'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                All ({computedStats.total})
              </button>
              <button
                type="button"
                onClick={() => setActiveFilter('pending')}
                className={`px-3 py-1 rounded-lg font-medium transition-all cursor-pointer ${
                  activeFilter === 'pending'
                    ? 'bg-amber-500 text-white shadow-xs'
                    : 'text-amber-700 hover:text-amber-800'
                }`}
              >
                Pending ({computedStats.pending})
              </button>
              <button
                type="button"
                onClick={() => setActiveFilter('approved')}
                className={`px-3 py-1 rounded-lg font-medium transition-all cursor-pointer ${
                  activeFilter === 'approved'
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'text-emerald-700 hover:text-emerald-800'
                }`}
              >
                Approved ({computedStats.approved})
              </button>
              <button
                type="button"
                onClick={() => setActiveFilter('rejected')}
                className={`px-3 py-1 rounded-lg font-medium transition-all cursor-pointer ${
                  activeFilter === 'rejected'
                    ? 'bg-rose-600 text-white shadow-xs'
                    : 'text-rose-700 hover:text-rose-800'
                }`}
              >
                Rejected ({computedStats.rejected})
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-100 text-[11px] font-semibold text-slate-500 bg-slate-50/60 uppercase tracking-wider">
                  {isAdmin && <th className="py-3 px-4">Employee</th>}
                  <th className="py-3 px-4">Leave Type</th>
                  <th className="py-3 px-4">Dates</th>
                  <th className="py-3 px-4 text-center">Duration</th>
                  <th className="py-3 px-4">Reason & Feedback</th>
                  <th className="py-3 px-4 text-center">Status</th>
                  {isAdmin && <th className="py-3 px-4 text-right">Actions</th>}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredLeaves.length > 0 ? (
                  filteredLeaves.map((lv) => (
                    <tr key={lv.id} className="hover:bg-slate-50/70 transition-colors">
                      {isAdmin && (
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2">
                            <div className="w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 font-semibold text-[11px]">
                              {(lv.user_name || 'U').charAt(0).toUpperCase()}
                            </div>
                            <span className="font-semibold text-slate-800">{lv.user_name || 'Staff Member'}</span>
                          </div>
                        </td>
                      )}
                      <td className="py-3 px-4">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold bg-slate-100 text-slate-700 capitalize">
                          {lv.leave_type} Leave
                        </span>
                      </td>
                      <td className="py-3 px-4 text-slate-600 font-medium whitespace-nowrap">
                        <div className="flex items-center gap-1.5 text-xs text-slate-700">
                          <CalendarRange className="w-3.5 h-3.5 text-slate-400" />
                          <span>{lv.from_date}</span>
                          <span className="text-slate-400">→</span>
                          <span>{lv.to_date}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <span className="inline-block px-2.5 py-0.5 rounded-full font-bold text-xs bg-slate-100 text-slate-800">
                          {lv.days_count} {Number(lv.days_count) === 1 ? 'Day' : 'Days'}
                        </span>
                      </td>
                      <td className="py-3 px-4 max-w-xs">
                        <p className="text-slate-700 text-xs font-normal line-clamp-2">{lv.reason}</p>
                        {lv.admin_feedback && (
                          <div className="mt-1 flex items-start gap-1 text-[11px] text-rose-600 bg-rose-50 px-2 py-0.5 rounded-md border border-rose-100">
                            <MessageSquare className="w-3 h-3 mt-0.5 shrink-0" />
                            <span><strong className="font-semibold">Manager:</strong> {lv.admin_feedback}</span>
                          </div>
                        )}
                      </td>
                      <td className="py-3 px-4 text-center whitespace-nowrap">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold ${
                          lv.status === 'approved'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : lv.status === 'rejected'
                            ? 'bg-rose-50 text-rose-700 border border-rose-200'
                            : 'bg-amber-50 text-amber-700 border border-amber-200'
                        }`}>
                          {lv.status === 'approved' && <CheckCircle2 className="w-3 h-3" />}
                          {lv.status === 'rejected' && <XCircle className="w-3 h-3" />}
                          {lv.status === 'pending' && <Clock className="w-3 h-3" />}
                          {lv.status.charAt(0).toUpperCase() + lv.status.slice(1)}
                        </span>
                      </td>
                      {isAdmin && (
                        <td className="py-3 px-4 text-right whitespace-nowrap">
                          {lv.status === 'pending' ? (
                            <div className="inline-flex items-center gap-1.5 justify-end">
                              <button
                                type="button"
                                onClick={() => setApprovingLeave(lv)}
                                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-[11px] transition-colors cursor-pointer shadow-xs"
                                title="Approve Request"
                              >
                                <Check className="w-3 h-3" />
                                Approve
                              </button>
                              <button
                                type="button"
                                onClick={() => { setRejectingLeave(lv); setRejectReason(''); setRejectError(''); }}
                                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-rose-600 hover:bg-rose-700 text-white font-semibold text-[11px] transition-colors cursor-pointer shadow-xs"
                                title="Reject Request"
                              >
                                <X className="w-3 h-3" />
                                Reject
                              </button>
                            </div>
                          ) : (
                            <span className="text-[11px] text-slate-400 italic">Completed</span>
                          )}
                        </td>
                      )}
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={isAdmin ? 7 : 6} className="py-10 text-center text-slate-400">
                      <div className="flex flex-col items-center justify-center gap-2">
                        <FileText className="w-8 h-8 text-slate-300" />
                        <p className="text-xs font-medium text-slate-500">No leave records found for this filter.</p>
                      </div>
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl border border-slate-200 max-w-md w-full p-6 space-y-4 shadow-2xl animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-base font-bold text-slate-900">Apply for Leave</h3>
                <p className="text-xs text-slate-400">Submit your leave application for manager approval</p>
              </div>
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">Leave Category</label>
                <select
                  value={formData.leave_type}
                  onChange={(e) => setFormData({ ...formData, leave_type: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 cursor-pointer"
                >
                  <option value="casual">Casual Leave (CL)</option>
                  <option value="sick">Sick Leave (SL)</option>
                  <option value="earned">Earned Leave (EL)</option>
                  <option value="compensatory">Compensatory Off</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">From Date</label>
                  <input
                    type="date"
                    required
                    value={formData.from_date}
                    onChange={(e) => {
                      const newFrom = e.target.value;
                      setFormData(prev => ({
                        ...prev,
                        from_date: newFrom,
                        to_date: prev.to_date < newFrom ? newFrom : prev.to_date,
                      }));
                    }}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">To Date</label>
                  <input
                    type="date"
                    required
                    min={formData.from_date}
                    value={formData.to_date}
                    onChange={(e) => setFormData({ ...formData, to_date: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                  />
                </div>
              </div>

              {/* Live Duration Preview */}
              <div className="p-3 rounded-xl bg-indigo-50/60 border border-indigo-100 flex items-center justify-between">
                <span className="text-xs font-medium text-indigo-900">Calculated Duration:</span>
                <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${
                  calculatedDays > 0 ? 'bg-indigo-600 text-white' : 'bg-rose-500 text-white'
                }`}>
                  {calculatedDays > 0 ? `${calculatedDays} ${calculatedDays === 1 ? 'Day' : 'Days'}` : 'Invalid Dates'}
                </span>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">Reason for Absence</label>
                <textarea
                  rows="3"
                  required
                  placeholder="Please state details regarding your leave (e.g. personal, medical, family event)..."
                  value={formData.reason}
                  onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                ></textarea>
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting || calculatedDays <= 0}
                  className="px-5 py-2 rounded-xl text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 transition-colors disabled:opacity-50 cursor-pointer"
                >
                  {isSubmitting ? 'Submitting...' : 'Submit Application'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Approve Leave Modal via Reusable ConfirmModal */}
      <ConfirmModal
        isOpen={!!approvingLeave}
        onClose={() => !isApproving && setApprovingLeave(null)}
        onConfirm={confirmApproveLeave}
        title="Approve Leave Request"
        message={`Are you sure you want to approve this ${approvingLeave?.leave_type || ''} leave request of ${approvingLeave?.days_count || 1} day(s) for ${approvingLeave?.user_name || 'Staff Member'}?`}
        confirmText="Approve Leave"
        loadingText="Approving..."
        isDanger={false}
        icon={CheckCircle2}
        isLoading={isApproving}
      />

      {/* Decline Leave Modal via Reusable ConfirmModal */}
      <ConfirmModal
        isOpen={!!rejectingLeave}
        onClose={() => !isRejecting && setRejectingLeave(null)}
        onConfirm={confirmRejectLeave}
        title="Decline Leave Request"
        message="Please provide feedback or reason for declining this request. This will be shown to the representative."
        confirmText="Confirm Reject"
        loadingText="Rejecting..."
        isDanger={true}
        icon={AlertCircle}
        isLoading={isRejecting}
      >
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5">
            Rejection Feedback / Reason
          </label>
          <textarea
            rows="3"
            required
            placeholder="e.g. Crucial field doctor campaign scheduled, kindly reschedule..."
            value={rejectReason}
            onChange={(e) => setRejectReason(e.target.value)}
            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500"
          ></textarea>
        </div>
      </ConfirmModal>

    </Layout>
  );
}