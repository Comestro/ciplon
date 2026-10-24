import { useState, useMemo } from 'react';
import { usePage, router } from '@inertiajs/react';
import { 
  Target, 
  TrendingUp, 
  Award, 
  Calendar, 
  Plus, 
  Search, 
  Edit3, 
  Trash2, 
  X, 
  User, 
  DollarSign, 
  FileText,
  Percent
} from 'lucide-react';
import AdminLayout from '../../layouts/AdminLayout';
import MRLayout from '../../layouts/MR/MRLayout';
import ConfirmModal from '../../components/common/ConfirmModal';
import SearchBar from '../../components/common/SearchBar';

export default function SetTarget({ 
  targets = [], 
  representatives = [], 
  summary = {}, 
  isAdmin = false 
}) {
  const { props } = usePage();
  const userRole = props.auth?.user?.role;
  const isSuperAdminOrAdmin = userRole === 'admin' || userRole === 'super_admin' || isAdmin;
  const Layout = isSuperAdminOrAdmin ? AdminLayout : MRLayout;

  // Search & Filter
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedYear, setSelectedYear] = useState('all');

  // Modals state
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [editingTarget, setEditingTarget] = useState(null);
  const [deletingTarget, setDeletingTarget] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formErrors, setFormErrors] = useState({});

  // Months list
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const currentMonthName = months[new Date().getMonth()];
  const currentYearNum = new Date().getFullYear();

  // Form State for Assigning / Creating Target
  const [assignForm, setAssignForm] = useState({
    user_id: '',
    month: currentMonthName,
    year: currentYearNum,
    target_amount: '',
    achieved_amount: '',
    notes: '',
  });

  // Open Assign Modal
  const openAssignModal = () => {
    setAssignForm({
      user_id: representatives[0]?.id || '',
      month: currentMonthName,
      year: currentYearNum,
      target_amount: '',
      achieved_amount: '0',
      notes: '',
    });
    setFormErrors({});
    setShowAssignModal(true);
  };

  // Submit Assign Target
  const handleAssignSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setFormErrors({});

    router.post('/mrconnect/set-target', assignForm, {
      preserveScroll: true,
      onSuccess: () => {
        setIsSubmitting(false);
        setShowAssignModal(false);
      },
      onError: (errs) => {
        setIsSubmitting(false);
        setFormErrors(errs || {});
      },
    });
  };

  // Open Edit Modal
  const openEditModal = (target) => {
    setEditingTarget({
      id: target.id,
      employee_name: target.employee_name,
      month: target.month,
      year: target.year,
      target_amount: target.target_amount,
      achieved_amount: target.achieved_amount || '0',
      notes: target.notes || '',
    });
    setFormErrors({});
  };

  // Submit Edit Target
  const handleEditSubmit = (e) => {
    e.preventDefault();
    if (!editingTarget) return;

    setIsSubmitting(true);
    setFormErrors({});

    router.put(`/mrconnect/set-target/${editingTarget.id}`, {
      target_amount: editingTarget.target_amount,
      achieved_amount: editingTarget.achieved_amount,
      notes: editingTarget.notes,
    }, {
      preserveScroll: true,
      onSuccess: () => {
        setIsSubmitting(false);
        setEditingTarget(null);
      },
      onError: (errs) => {
        setIsSubmitting(false);
        setFormErrors(errs || {});
      },
    });
  };

  // Confirm Delete Target
  const handleDeleteConfirm = () => {
    if (!deletingTarget) return;
    setIsSubmitting(true);

    router.delete(`/mrconnect/set-target/${deletingTarget.id}`, {
      preserveScroll: true,
      onSuccess: () => {
        setIsSubmitting(false);
        setDeletingTarget(null);
      },
      onError: () => {
        setIsSubmitting(false);
      },
    });
  };

  // Filtered targets
  const filteredTargets = useMemo(() => {
    return targets.filter((tgt) => {
      const matchSearch =
        (tgt.employee_name && tgt.employee_name.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (tgt.month && tgt.month.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (tgt.notes && tgt.notes.toLowerCase().includes(searchTerm.toLowerCase()));

      const matchYear =
        selectedYear === 'all' ? true : String(tgt.year) === String(selectedYear);

      return matchSearch && matchYear;
    });
  }, [targets, searchTerm, selectedYear]);

  // Unique years for filter
  const availableYears = useMemo(() => {
    const yrs = targets.map((t) => t.year).filter(Boolean);
    return Array.from(new Set([currentYearNum, ...yrs])).sort((a, b) => b - a);
  }, [targets, currentYearNum]);

  return (
    <Layout title={isSuperAdminOrAdmin ? "Target vs Sales Performance" : "My Sales Targets"}>
      <div className="space-y-6 max-w-7xl mx-auto pb-12 font-sans">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-violet-50 text-violet-600 border border-violet-100 flex items-center justify-center shrink-0">
              <Target className="w-5 h-5 stroke-[2.2]" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900 tracking-tight">
                {isSuperAdminOrAdmin ? "Sales Targets & Revenue Quotas" : "My Sales Targets & Quotas"}
              </h1>
              <p className="text-xs text-slate-500">
                {isSuperAdminOrAdmin 
                  ? "Assign monthly sales quotas to field representatives and monitor revenue achievement."
                  : "Your allocated monthly revenue quotas, verified achievement, and milestone progress."}
              </p>
            </div>
          </div>

          {/* Admin Assign Button */}
          {isSuperAdminOrAdmin && (
            <div className="flex items-center gap-2.5">
              <button
                type="button"
                onClick={openAssignModal}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 transition-colors shadow-xs cursor-pointer"
              >
                <Plus className="w-4 h-4 stroke-[2.5]" />
                <span>Assign New Target</span>
              </button>
            </div>
          )}
        </div>

        {/* 3 Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-slate-500">
                {isSuperAdminOrAdmin ? "Total Assigned Quota" : "My Assigned Quota"}
              </span>
              <div className="w-8 h-8 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center">
                <Target className="w-4 h-4" />
              </div>
            </div>
            <p className="text-2xl font-bold text-slate-900 mt-2">
              ₹{Number(summary.total_target || 0).toLocaleString()}
            </p>
            <p className="text-[11px] text-slate-400 mt-1">Cumulative sales budget</p>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-slate-500">Realized Revenue</span>
              <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <TrendingUp className="w-4 h-4" />
              </div>
            </div>
            <p className="text-2xl font-bold text-emerald-600 mt-2">
              ₹{Number(summary.total_achieved || 0).toLocaleString()}
            </p>
            <p className="text-[11px] text-emerald-600 font-medium mt-1">Verified sales achievement</p>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-slate-500">Overall Quota Index</span>
              <div className="w-8 h-8 rounded-lg bg-violet-50 text-violet-600 flex items-center justify-center">
                <Award className="w-4 h-4" />
              </div>
            </div>
            <p className="text-2xl font-bold text-violet-600 mt-2">
              {Math.min(100, summary.overall_percentage || 0)}%
            </p>
            <p className="text-[11px] text-violet-600 font-medium mt-1">Portfolio achievement rate</p>
          </div>
        </div>

        {/* Filter and Search Bar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white p-3.5 rounded-2xl border border-slate-200/80 shadow-xs">
          <SearchBar
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={isSuperAdminOrAdmin ? "Search by representative name, month, or notes..." : "Search by month or notes..."}
            className="flex-1 max-w-md"
          />

          <div className="flex items-center gap-2">
            <label className="text-xs font-medium text-slate-500 shrink-0">Year:</label>
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 cursor-pointer"
            >
              <option value="all">All Years</option>
              {availableYears.map((yr) => (
                <option key={yr} value={yr}>
                  {yr}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Targets Table */}
        <div className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-xs">
          <div className="px-5 py-3.5 border-b border-slate-100 flex items-center justify-between">
            <h3 className="text-sm font-semibold text-slate-800">
              {isSuperAdminOrAdmin ? "Sales Quotas by Representative" : "My Monthly Quotas & Achievement"}
            </h3>
            <span className="text-xs text-slate-400">{filteredTargets.length} records</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-100 text-[11px] font-semibold text-slate-400 bg-slate-50/50">
                  {isSuperAdminOrAdmin && <th className="py-3 px-4">Representative</th>}
                  <th className="py-3 px-4">Period</th>
                  <th className="py-3 px-4 text-right">Target Quota (₹)</th>
                  <th className="py-3 px-4 text-right">Achieved Sales (₹)</th>
                  <th className="py-3 px-4 text-center">Progress %</th>
                  <th className="py-3 px-4">Notes & Strategy</th>
                  {isSuperAdminOrAdmin && <th className="py-3 px-4 text-right">Actions</th>}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredTargets.length > 0 ? (
                  filteredTargets.map((tgt) => {
                    const targetNum = parseFloat(tgt.target_amount) || 0;
                    const achievedNum = parseFloat(tgt.achieved_amount) || 0;
                    const rawPct = targetNum > 0 ? Math.round((achievedNum / targetNum) * 100) : 0;
                    const pct = Math.min(100, rawPct);
                    const isCompleted = pct >= 100;
                    const isGood = pct >= 70;

                    return (
                      <tr key={tgt.id} className="hover:bg-slate-50/70 transition-colors">
                        {/* Representative Name (Admin) */}
                        {isSuperAdminOrAdmin && (
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-2">
                              <div className="w-6 h-6 rounded-full bg-violet-100 text-violet-700 flex items-center justify-center font-bold text-[10px]">
                                {tgt.employee_name ? tgt.employee_name.charAt(0).toUpperCase() : 'M'}
                              </div>
                              <span className="font-semibold text-slate-800">
                                {tgt.employee_name || 'Representative'}
                              </span>
                            </div>
                          </td>
                        )}

                        {/* Period */}
                        <td className="py-3 px-4">
                          <span className="inline-flex items-center gap-1.5 font-medium text-slate-700 bg-slate-50 px-2 py-0.5 rounded-md border border-slate-200/60">
                            <Calendar className="w-3 h-3 text-slate-400" />
                            <span>{tgt.month} {tgt.year}</span>
                          </span>
                        </td>

                        {/* Target Quota */}
                        <td className="py-3 px-4 text-right font-bold text-slate-900">
                          ₹{Number(tgt.target_amount).toLocaleString()}
                        </td>

                        {/* Achieved Sales */}
                        <td className="py-3 px-4 text-right">
                          <span className="font-bold text-emerald-600 block">
                            ₹{Number(tgt.achieved_amount).toLocaleString()}
                          </span>
                          {tgt.pob_achieved > 0 && (
                            <span className="text-[10px] text-slate-400 block font-normal mt-0.5">
                              (₹{Number(tgt.pob_achieved).toLocaleString()} verified POB)
                            </span>
                          )}
                        </td>

                        {/* Progress Bar & % */}
                        <td className="py-3 px-4 text-center">
                          <div className="inline-flex flex-col items-center gap-1 min-w-[90px]">
                            <span className={`text-xs font-bold ${
                              isCompleted ? 'text-emerald-600' : isGood ? 'text-violet-600' : 'text-amber-600'
                            }`}>
                              {pct}%
                            </span>
                            <div className="w-20 bg-slate-100 h-1.5 rounded-full overflow-hidden">
                              <div 
                                className={`h-full rounded-full transition-all duration-300 ${
                                  isCompleted ? 'bg-emerald-500' : isGood ? 'bg-violet-600' : 'bg-amber-500'
                                }`} 
                                style={{ width: `${Math.min(100, pct)}%` }}
                              />
                            </div>
                          </div>
                        </td>

                        {/* Notes */}
                        <td className="py-3 px-4 text-slate-500 max-w-xs truncate" title={tgt.notes}>
                          {tgt.notes || <span className="text-slate-300 italic">No notes</span>}
                        </td>

                        {/* Admin Actions */}
                        {isSuperAdminOrAdmin && (
                          <td className="py-3 px-4 text-right">
                            <div className="inline-flex items-center gap-1 justify-end">
                              <button
                                type="button"
                                onClick={() => openEditModal(tgt)}
                                title="Edit Target / Update Achieved Sales"
                                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
                              >
                                <Edit3 className="w-3.5 h-3.5" />
                              </button>
                              <button
                                type="button"
                                onClick={() => setDeletingTarget(tgt)}
                                title="Delete Target"
                                className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        )}
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={isSuperAdminOrAdmin ? 7 : 5} className="py-12 text-center text-slate-400">
                      <Target className="w-8 h-8 mx-auto text-slate-300 mb-2 stroke-[1.5]" />
                      <p className="text-xs font-medium">No sales targets found matching the filter criteria.</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>

      {/* Assign New Target Modal (Admin) */}
      {showAssignModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl border border-slate-200 max-w-md w-full p-6 space-y-4 shadow-xl animate-in zoom-in-95 duration-200">
            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-violet-50 text-violet-600 flex items-center justify-center">
                  <Target className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Assign Sales Target</h3>
                  <p className="text-[11px] text-slate-500">Set monthly sales quota for field representative.</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowAssignModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleAssignSubmit} className="space-y-3.5 text-xs">
              {/* Field Representative */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Field Representative (MR) <span className="text-rose-500">*</span>
                </label>
                <select
                  value={assignForm.user_id}
                  onChange={(e) => setAssignForm({ ...assignForm, user_id: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 cursor-pointer"
                >
                  <option value="">Select Representative...</option>
                  {representatives.map((rep) => (
                    <option key={rep.id} value={rep.id}>
                      {rep.name} ({rep.email})
                    </option>
                  ))}
                </select>
                {formErrors.user_id && (
                  <p className="text-[11px] text-rose-500 mt-1">{formErrors.user_id[0] || formErrors.user_id}</p>
                )}
              </div>

              {/* Month & Year */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Month <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={assignForm.month}
                    onChange={(e) => setAssignForm({ ...assignForm, month: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 cursor-pointer"
                  >
                    {months.map((m) => (
                      <option key={m} value={m}>
                        {m}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Year <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="number"
                    min="2020"
                    max="2035"
                    value={assignForm.year}
                    onChange={(e) => setAssignForm({ ...assignForm, year: parseInt(e.target.value) || currentYearNum })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500"
                  />
                </div>
              </div>

              {/* Target Quota Amount */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Monthly Target Quota (₹) <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold">₹</span>
                  <input
                    type="number"
                    min="1"
                    placeholder="350000"
                    value={assignForm.target_amount}
                    onChange={(e) => setAssignForm({ ...assignForm, target_amount: e.target.value })}
                    className="w-full pl-8 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500"
                  />
                </div>
                {formErrors.target_amount && (
                  <p className="text-[11px] text-rose-500 mt-1">{formErrors.target_amount[0] || formErrors.target_amount}</p>
                )}
              </div>

              {/* Initial Achieved Volume (Optional) */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Achieved Volume (₹) <span className="text-[11px] font-normal text-slate-400">(Optional)</span>
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold">₹</span>
                  <input
                    type="number"
                    min="0"
                    placeholder="0"
                    value={assignForm.achieved_amount}
                    onChange={(e) => setAssignForm({ ...assignForm, achieved_amount: e.target.value })}
                    className="w-full pl-8 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500"
                  />
                </div>
              </div>

              {/* Notes */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Strategic Focus & Notes <span className="text-[11px] font-normal text-slate-400">(Optional)</span>
                </label>
                <textarea
                  rows="2"
                  placeholder="e.g. Focus on CIPLOMAX CD3 & DICLOTRYP-FORT in South Zone..."
                  value={assignForm.notes}
                  onChange={(e) => setAssignForm({ ...assignForm, notes: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500"
                ></textarea>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAssignModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-medium text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2 rounded-xl text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 disabled:opacity-50 transition-colors cursor-pointer"
                >
                  {isSubmitting ? 'Assigning...' : 'Assign Target'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Target Modal (Admin) */}
      {editingTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl border border-slate-200 max-w-md w-full p-6 space-y-4 shadow-xl animate-in zoom-in-95 duration-200">
            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  Edit Target: {editingTarget.employee_name}
                </h3>
                <p className="text-[11px] text-slate-500">
                  Period: {editingTarget.month} {editingTarget.year}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setEditingTarget(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleEditSubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Target Quota (₹) <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold">₹</span>
                  <input
                    type="number"
                    min="1"
                    value={editingTarget.target_amount}
                    onChange={(e) => setEditingTarget({ ...editingTarget, target_amount: e.target.value })}
                    className="w-full pl-8 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Achieved Sales (₹)
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold">₹</span>
                  <input
                    type="number"
                    min="0"
                    value={editingTarget.achieved_amount}
                    onChange={(e) => setEditingTarget({ ...editingTarget, achieved_amount: e.target.value })}
                    className="w-full pl-8 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Notes & Focus
                </label>
                <textarea
                  rows="2"
                  value={editingTarget.notes}
                  onChange={(e) => setEditingTarget({ ...editingTarget, notes: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500"
                ></textarea>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setEditingTarget(null)}
                  className="px-4 py-2 rounded-xl text-xs font-medium text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2 rounded-xl text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 disabled:opacity-50 transition-colors cursor-pointer"
                >
                  {isSubmitting ? 'Saving...' : 'Update Target'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal (Admin) */}
      <ConfirmModal
        isOpen={!!deletingTarget}
        onClose={() => setDeletingTarget(null)}
        onConfirm={handleDeleteConfirm}
        isDanger={true}
        isLoading={isSubmitting}
        title="Delete Sales Target"
        message={`Are you sure you want to delete the sales target for ${deletingTarget?.employee_name} (${deletingTarget?.month} ${deletingTarget?.year})? This action cannot be undone.`}
        confirmText="Delete Target"
        cancelText="Cancel"
      />

    </Layout>
  );
}