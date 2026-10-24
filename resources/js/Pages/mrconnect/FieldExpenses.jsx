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
  ArrowLeft,
  UserCheck,
  AlertCircle,
  MessageSquare,
  UploadCloud,
  FileText,
  ExternalLink,
  Trash2,
  Link as LinkIcon
} from 'lucide-react';
import toast from 'react-hot-toast';
import AdminLayout from '../../layouts/AdminLayout';
import MRLayout from '../../layouts/MR/MRLayout';
import ConfirmModal from '../../components/common/ConfirmModal';

export default function FieldExpenses({ expenses = [], summary = {} }) {
  const { props } = usePage();
  const isAdmin = props.auth?.user?.role === 'admin' || props.auth?.user?.role === 'super_admin';
  const Layout = isAdmin ? AdminLayout : MRLayout;

  const [showModal, setShowModal] = useState(false);
  const [approvingExpense, setApprovingExpense] = useState(null);
  const [isApproving, setIsApproving] = useState(false);
  const [rejectingExpense, setRejectingExpense] = useState(null);
  const [isRejecting, setIsRejecting] = useState(false);
  const [rejectReason, setRejectReason] = useState('');
  const [rejectError, setRejectError] = useState('');

  const [receiptMode, setReceiptMode] = useState('file'); // 'file' | 'url'
  const [receiptPreview, setReceiptPreview] = useState(null);
  const [previewModalUrl, setPreviewModalUrl] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formErrors, setFormErrors] = useState({});

  const initialFormState = {
    date: new Date().toISOString().split('T')[0],
    expense_type: 'daily_allowance',
    amount: '',
    distance_km: '',
    city: '',
    notes: '',
    receipt: null,
    receipt_url: '',
  };

  const [formData, setFormData] = useState(initialFormState);

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      setFormErrors(prev => ({ ...prev, receipt: 'File size cannot exceed 5MB.' }));
      return;
    }

    if (formErrors.receipt || formErrors.receipt_url) {
      setFormErrors(prev => ({ ...prev, receipt: undefined, receipt_url: undefined }));
    }

    setFormData(prev => ({ ...prev, receipt: file }));
    if (file.type.startsWith('image/')) {
      const url = URL.createObjectURL(file);
      setReceiptPreview(url);
    } else {
      setReceiptPreview(null);
    }
  };

  const handleRemoveFile = () => {
    if (receiptPreview) {
      URL.revokeObjectURL(receiptPreview);
    }
    setFormData(prev => ({ ...prev, receipt: null }));
    setReceiptPreview(null);
    if (formErrors.receipt) {
      setFormErrors(prev => ({ ...prev, receipt: undefined }));
    }
  };

  const resetForm = () => {
    if (receiptPreview) {
      URL.revokeObjectURL(receiptPreview);
    }
    setFormData(initialFormState);
    setReceiptPreview(null);
    setReceiptMode('file');
    setFormErrors({});
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setFormErrors({});
    setIsSubmitting(true);
    router.post('/mrconnect/field-expenses', formData, {
      forceFormData: true,
      onSuccess: () => {
        setShowModal(false);
        resetForm();
      },
      onError: (errs) => {
        setFormErrors(errs || {});
      },
      onFinish: () => setIsSubmitting(false),
    });
  };

  const confirmApproveExpense = () => {
    if (!approvingExpense) return;
    setIsApproving(true);
    router.post(`/mrconnect/field-expenses/${approvingExpense.id}/approve`, {}, {
      onFinish: () => {
        setIsApproving(false);
        setApprovingExpense(null);
      },
      onError: () => {
        setIsApproving(false);
      },
    });
  };

  const confirmRejectExpense = () => {
    if (!rejectingExpense) return;
    if (!rejectReason.trim()) {
      setRejectError('Please provide a reason for declining this claim.');
      return;
    }

    setRejectError('');
    setIsRejecting(true);
    router.post(`/mrconnect/field-expenses/${rejectingExpense.id}/reject`, { reason: rejectReason }, {
      onFinish: () => {
        setIsRejecting(false);
        setRejectingExpense(null);
        setRejectReason('');
        setRejectError('');
      },
      onError: () => {
        setIsRejecting(false);
      },
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
            onClick={() => { resetForm(); setShowModal(true); }}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-medium text-xs transition-colors cursor-pointer shadow-sm hover:shadow"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Claim Expense</span>
          </button>
        </div>

        {/* 3 Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs">
            <span className="text-xs font-medium text-slate-500">Total Claimed</span>
            <p className="text-2xl font-semibold text-slate-800 mt-2">
              ₹{Number(summary.total_claimed || 0).toLocaleString()}
            </p>
            <p className="text-[11px] text-slate-400 mt-1">All submitted claims</p>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs">
            <span className="text-xs font-medium text-slate-500">Approved & Disbursed</span>
            <p className="text-2xl font-semibold text-emerald-600 mt-2">
              ₹{Number(summary.approved_amount || 0).toLocaleString()}
            </p>
            <p className="text-[11px] text-emerald-600 font-medium mt-1">Processed by finance</p>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs">
            <span className="text-xs font-medium text-slate-500">Pending Review</span>
            <p className="text-2xl font-semibold text-amber-600 mt-2">
              ₹{Number(summary.pending_amount || 0).toLocaleString()}
            </p>
            <p className="text-[11px] text-amber-600 font-medium mt-1">Awaiting management</p>
          </div>
        </div>

        {/* Expenses List */}
        <div className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-xs">
          <div className="px-5 py-3.5 border-b border-slate-100 flex items-center justify-between bg-slate-50/40">
            <div>
              <h3 className="text-sm font-semibold text-slate-800">Expense Claim Records</h3>
              <p className="text-[11px] text-slate-400">Audit trail with reviewer and approval tracking</p>
            </div>
            <span className="text-xs text-slate-400 font-medium">{expenses.length} claims</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-100 text-[11px] font-semibold text-slate-500 bg-slate-50/60 uppercase tracking-wider">
                  <th className="py-3 px-4">Date</th>
                  {isAdmin && <th className="py-3 px-4">Representative</th>}
                  <th className="py-3 px-4">Type</th>
                  <th className="py-3 px-4">Location / Distance</th>
                  <th className="py-3 px-4 text-right">Amount</th>
                  <th className="py-3 px-4 text-center">Receipt</th>
                  <th className="py-3 px-4 text-center">Status</th>
                  {isAdmin && <th className="py-3 px-4 text-right">Action</th>}
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
                        <td className="py-3 px-4 font-medium text-slate-700 whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 font-semibold text-[10px]">
                              {(exp.user_name || 'U').charAt(0).toUpperCase()}
                            </div>
                            <span>{exp.user_name || 'Representative'}</span>
                          </div>
                        </td>
                      )}
                      <td className="py-3 px-4 capitalize text-slate-700 font-medium">
                        {exp.expense_type.replace('_', ' ')}
                      </td>
                      <td className="py-3 px-4 text-slate-500">
                        <span>{exp.city || 'Headquarters'}</span>
                        {exp.distance_km && (
                          <span className="ml-1.5 text-[11px] font-medium text-slate-400">({exp.distance_km} km)</span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-right font-semibold text-slate-800 whitespace-nowrap">
                        ₹{Number(exp.amount).toFixed(2)}
                      </td>
                      <td className="py-3 px-4 text-center whitespace-nowrap">
                        {exp.receipt_url ? (
                          <button
                            type="button"
                            onClick={() => setPreviewModalUrl(exp.receipt_url)}
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-violet-50 text-violet-700 hover:bg-violet-100 border border-violet-200/60 font-semibold text-[11px] transition-colors cursor-pointer shadow-2xs"
                            title="View attached bill receipt"
                          >
                            <Receipt className="w-3.5 h-3.5 text-violet-600" />
                            <span>View Bill</span>
                          </button>
                        ) : (
                          <span className="text-slate-300 italic text-xs">—</span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-center whitespace-nowrap">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-medium ${
                          exp.status === 'approved'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200/60'
                            : exp.status === 'rejected'
                            ? 'bg-rose-50 text-rose-700 border border-rose-200/60'
                            : 'bg-amber-50 text-amber-700 border border-amber-200/60'
                        }`}>
                          {exp.status === 'approved' && <CheckCircle2 className="w-3 h-3" />}
                          {exp.status === 'rejected' && <XCircle className="w-3 h-3" />}
                          {exp.status === 'pending' && <Clock className="w-3 h-3" />}
                          {exp.status.charAt(0).toUpperCase() + exp.status.slice(1)}
                        </span>
                        {exp.admin_feedback && (
                          <p className="text-[10px] text-rose-600 font-medium mt-1 truncate max-w-[130px]" title={exp.admin_feedback}>
                            {exp.admin_feedback}
                          </p>
                        )}
                      </td>

                      {/* Action Column (Admin Only) */}
                      {isAdmin && (
                        <td className="py-3 px-4 text-right whitespace-nowrap">
                          {exp.status === 'pending' ? (
                            <div className="inline-flex items-center gap-1.5 justify-end">
                              <button
                                type="button"
                                onClick={() => setApprovingExpense(exp)}
                                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-[11px] transition-colors cursor-pointer shadow-xs"
                                title="Approve Claim"
                              >
                                <Check className="w-3 h-3" />
                                Approve
                              </button>
                              <button
                                type="button"
                                onClick={() => { setRejectingExpense(exp); setRejectReason(''); setRejectError(''); }}
                                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-rose-600 hover:bg-rose-700 text-white font-semibold text-[11px] transition-colors cursor-pointer shadow-xs"
                                title="Reject Claim"
                              >
                                <X className="w-3 h-3" />
                                Reject
                              </button>
                            </div>
                          ) : (
                            <div className="relative group inline-flex items-center justify-end">
                              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-teal-50 text-slate-600 hover:text-teal-700 border border-slate-200/60 hover:border-teal-200 text-[11px] font-medium transition-all cursor-pointer shadow-2xs">
                                <UserCheck className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                                <span>Completed</span>
                              </div>

                              {/* Floating Tooltip on Hover */}
                              <div className="absolute right-0 bottom-full mb-2 hidden group-hover:flex flex-col items-start px-3 py-2 bg-slate-900 text-white text-xs rounded-xl shadow-xl z-30 whitespace-nowrap pointer-events-none animate-in fade-in duration-150">
                                <div className="flex items-center gap-1.5 font-semibold text-slate-100">
                                  <UserCheck className="w-3.5 h-3.5 text-teal-400 shrink-0" />
                                  <span>Reviewed by: {exp.reviewer_name || 'Administrator'}</span>
                                </div>
                                {exp.reviewed_at && (
                                  <span className="text-[10px] text-slate-400 mt-0.5 pl-5">
                                    Date: {new Date(exp.reviewed_at).toLocaleDateString(undefined, {
                                      day: 'numeric',
                                      month: 'short',
                                      year: 'numeric'
                                    })}
                                  </span>
                                )}
                                <div className="absolute right-4 top-full w-0 h-0 border-x-4 border-x-transparent border-t-4 border-t-slate-900"></div>
                              </div>
                            </div>
                          )}
                        </td>
                      )}
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={isAdmin ? 8 : 6} className="py-8 text-center text-slate-400">
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
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Date <span className="text-rose-500">*</span>
                </label>
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) => {
                    setFormData({ ...formData, date: e.target.value });
                    if (formErrors.date) setFormErrors(prev => ({ ...prev, date: undefined }));
                  }}
                  className={`w-full px-3 py-2 bg-slate-50 border rounded-xl text-xs text-slate-800 transition-colors focus:bg-white focus:outline-none ${
                    formErrors.date
                      ? 'border-rose-400 focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20 bg-rose-50/20'
                      : 'border-slate-200 focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500'
                  }`}
                />
                {formErrors.date && (
                  <p className="mt-1 text-xs text-rose-600 font-medium flex items-center gap-1 animate-in fade-in duration-150">
                    <AlertCircle className="w-3 h-3 shrink-0" />
                    <span>{formErrors.date}</span>
                  </p>
                )}
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Expense Type <span className="text-rose-500">*</span>
                </label>
                <select
                  value={formData.expense_type}
                  onChange={(e) => {
                    setFormData({ ...formData, expense_type: e.target.value });
                    if (formErrors.expense_type) setFormErrors(prev => ({ ...prev, expense_type: undefined }));
                  }}
                  className={`w-full px-3 py-2 bg-slate-50 border rounded-xl text-xs text-slate-800 focus:bg-white focus:outline-none transition-colors cursor-pointer ${
                    formErrors.expense_type
                      ? 'border-rose-400 focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20 bg-rose-50/20'
                      : 'border-slate-200 focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500'
                  }`}
                >
                  <option value="daily_allowance">Daily Allowance (DA)</option>
                  <option value="travel_fuel">Travel & Fuel Allowance (TA)</option>
                  <option value="lodging">Hotel & Lodging</option>
                  <option value="meal">Client / Doctor CME Hospitality</option>
                  <option value="miscellaneous">Stationery & Courier</option>
                </select>
                {formErrors.expense_type && (
                  <p className="mt-1 text-xs text-rose-600 font-medium flex items-center gap-1 animate-in fade-in duration-150">
                    <AlertCircle className="w-3 h-3 shrink-0" />
                    <span>{formErrors.expense_type}</span>
                  </p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Claim Amount (₹) <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="number"
                    min="1"
                    placeholder="e.g. 450"
                    value={formData.amount}
                    onChange={(e) => {
                      setFormData({ ...formData, amount: e.target.value });
                      if (formErrors.amount) setFormErrors(prev => ({ ...prev, amount: undefined }));
                    }}
                    className={`w-full px-3 py-2 bg-slate-50 border rounded-xl text-xs text-slate-800 transition-colors focus:bg-white focus:outline-none ${
                      formErrors.amount
                        ? 'border-rose-400 focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20 bg-rose-50/20'
                        : 'border-slate-200 focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500'
                    }`}
                  />
                  {formErrors.amount && (
                    <p className="mt-1 text-xs text-rose-600 font-medium flex items-center gap-1 animate-in fade-in duration-150">
                      <AlertCircle className="w-3 h-3 shrink-0" />
                      <span>{formErrors.amount}</span>
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Distance (km)</label>
                  <input
                    type="number"
                    placeholder="e.g. 42"
                    value={formData.distance_km}
                    onChange={(e) => {
                      setFormData({ ...formData, distance_km: e.target.value });
                      if (formErrors.distance_km) setFormErrors(prev => ({ ...prev, distance_km: undefined }));
                    }}
                    className={`w-full px-3 py-2 bg-slate-50 border rounded-xl text-xs text-slate-800 transition-colors focus:bg-white focus:outline-none ${
                      formErrors.distance_km
                        ? 'border-rose-400 focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20 bg-rose-50/20'
                        : 'border-slate-200 focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500'
                    }`}
                  />
                  {formErrors.distance_km && (
                    <p className="mt-1 text-xs text-rose-600 font-medium flex items-center gap-1 animate-in fade-in duration-150">
                      <AlertCircle className="w-3 h-3 shrink-0" />
                      <span>{formErrors.distance_km}</span>
                    </p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Territory / City</label>
                <input
                  type="text"
                  placeholder="e.g. Nagercoil / Kanyakumari"
                  value={formData.city}
                  onChange={(e) => {
                    setFormData({ ...formData, city: e.target.value });
                    if (formErrors.city) setFormErrors(prev => ({ ...prev, city: undefined }));
                  }}
                  className={`w-full px-3 py-2 bg-slate-50 border rounded-xl text-xs text-slate-800 transition-colors focus:bg-white focus:outline-none ${
                    formErrors.city
                      ? 'border-rose-400 focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20 bg-rose-50/20'
                      : 'border-slate-200 focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500'
                  }`}
                />
                {formErrors.city && (
                  <p className="mt-1 text-xs text-rose-600 font-medium flex items-center gap-1 animate-in fade-in duration-150">
                    <AlertCircle className="w-3 h-3 shrink-0" />
                    <span>{formErrors.city}</span>
                  </p>
                )}
              </div>

              {/* Receipt / Bill Attachment (Optional) */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-medium text-slate-700 flex items-center gap-1.5">
                    <Receipt className="w-3.5 h-3.5 text-slate-500" />
                    <span>Bill / Receipt Attachment</span>
                    <span className="text-[10px] text-slate-400 font-normal">(Optional)</span>
                  </label>

                  {/* Mode switcher tabs: File vs URL */}
                  <div className="inline-flex p-0.5 bg-slate-100 rounded-lg text-[10px] font-medium text-slate-600">
                    <button
                      type="button"
                      onClick={() => setReceiptMode('file')}
                      className={`px-2 py-0.5 rounded-md transition-all cursor-pointer ${
                        receiptMode === 'file' ? 'bg-white text-slate-900 shadow-2xs font-semibold' : 'hover:text-slate-900'
                      }`}
                    >
                      Upload File
                    </button>
                    <button
                      type="button"
                      onClick={() => setReceiptMode('url')}
                      className={`px-2 py-0.5 rounded-md transition-all cursor-pointer ${
                        receiptMode === 'url' ? 'bg-white text-slate-900 shadow-2xs font-semibold' : 'hover:text-slate-900'
                      }`}
                    >
                      Enter URL
                    </button>
                  </div>
                </div>

                {receiptMode === 'file' ? (
                  <div>
                    {!formData.receipt ? (
                      <label className={`relative flex flex-col items-center justify-center p-3.5 border-2 border-dashed rounded-xl transition-all cursor-pointer group ${
                        formErrors.receipt
                          ? 'border-rose-400 bg-rose-50/20'
                          : 'border-slate-200 hover:border-violet-400 bg-slate-50/70 hover:bg-violet-50/20'
                      }`}>
                        <UploadCloud className="w-5 h-5 text-slate-400 group-hover:text-violet-600 mb-1 transition-colors" />
                        <span className="text-xs font-medium text-slate-600 group-hover:text-slate-900">
                          Click to browse or drop bill receipt
                        </span>
                        <span className="text-[10px] text-slate-400 mt-0.5">
                          Supports PNG, JPG, WEBP, or PDF (up to 5MB)
                        </span>
                        <input
                          type="file"
                          accept="image/png,image/jpeg,image/webp,application/pdf"
                          onChange={handleFileChange}
                          className="hidden"
                        />
                      </label>
                    ) : (
                      <div className="flex items-center justify-between p-2.5 bg-violet-50/50 border border-violet-200/80 rounded-xl">
                        <div className="flex items-center gap-2.5 overflow-hidden">
                          {receiptPreview ? (
                            <img
                              src={receiptPreview}
                              alt="Receipt preview"
                              className="w-10 h-10 rounded-lg object-cover border border-violet-200 shrink-0"
                            />
                          ) : (
                            <div className="w-10 h-10 rounded-lg bg-violet-100 flex items-center justify-center shrink-0">
                              <FileText className="w-5 h-5 text-violet-600" />
                            </div>
                          )}
                          <div className="overflow-hidden">
                            <p className="text-xs font-semibold text-slate-800 truncate">
                              {formData.receipt.name}
                            </p>
                            <p className="text-[10px] text-slate-500">
                              {(formData.receipt.size / 1024).toFixed(1)} KB
                            </p>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={handleRemoveFile}
                          className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-50 transition-colors cursor-pointer"
                          title="Remove file"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                  </div>
                ) : (
                  <div>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                        <LinkIcon className="w-3.5 h-3.5" />
                      </div>
                      <input
                        type="url"
                        placeholder="https://example.com/receipt-or-bill-image.jpg"
                        value={formData.receipt_url}
                        onChange={(e) => {
                          setFormData({ ...formData, receipt_url: e.target.value });
                          if (formErrors.receipt_url) setFormErrors(prev => ({ ...prev, receipt_url: undefined }));
                        }}
                        className={`w-full pl-8.5 pr-3 py-2 bg-slate-50 border rounded-xl text-xs text-slate-800 focus:bg-white focus:outline-none transition-colors ${
                          formErrors.receipt_url
                            ? 'border-rose-400 focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20 bg-rose-50/20'
                            : 'border-slate-200 focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500'
                        }`}
                      />
                    </div>
                    <span className="block text-[10px] text-slate-400 mt-1">
                      Paste a direct link to a hosted invoice, fuel slip, or Google Drive / Cloud photo.
                    </span>
                  </div>
                )}
                {(formErrors.receipt || formErrors.receipt_url) && (
                  <p className="mt-1 text-xs text-rose-600 font-medium flex items-center gap-1 animate-in fade-in duration-150">
                    <AlertCircle className="w-3 h-3 shrink-0" />
                    <span>{formErrors.receipt || formErrors.receipt_url}</span>
                  </p>
                )}
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Remarks</label>
                <textarea
                  rows="2"
                  placeholder="Notes regarding fieldwork coverage..."
                  value={formData.notes}
                  onChange={(e) => {
                    setFormData({ ...formData, notes: e.target.value });
                    if (formErrors.notes) setFormErrors(prev => ({ ...prev, notes: undefined }));
                  }}
                  className={`w-full px-3 py-2 bg-slate-50 border rounded-xl text-xs text-slate-800 transition-colors focus:bg-white focus:outline-none ${
                    formErrors.notes
                      ? 'border-rose-400 focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20 bg-rose-50/20'
                      : 'border-slate-200 focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500'
                  }`}
                ></textarea>
                {formErrors.notes && (
                  <p className="mt-1 text-xs text-rose-600 font-medium flex items-center gap-1 animate-in fade-in duration-150">
                    <AlertCircle className="w-3 h-3 shrink-0" />
                    <span>{formErrors.notes}</span>
                  </p>
                )}
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => { setShowModal(false); resetForm(); }}
                  className="px-4 py-2 rounded-xl text-xs font-medium text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2 rounded-xl text-xs font-medium text-white bg-slate-900 hover:bg-slate-800 disabled:opacity-50 transition-colors cursor-pointer"
                >
                  {isSubmitting ? 'Submitting...' : 'Submit Claim'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Approve Expense Modal (Admin Only) via Reusable ConfirmModal */}
      <ConfirmModal
        isOpen={!!approvingExpense}
        onClose={() => !isApproving && setApprovingExpense(null)}
        onConfirm={confirmApproveExpense}
        title="Approve Expense Claim"
        message={`Are you sure you want to approve this expense claim of ₹${Number(approvingExpense?.amount || 0).toFixed(2)} submitted by ${approvingExpense?.user_name || 'Representative'}?`}
        confirmText="Approve Claim"
        loadingText="Approving..."
        isDanger={false}
        icon={CheckCircle2}
        isLoading={isApproving}
      />

      {/* Decline Expense Modal (Admin Only) via Reusable ConfirmModal */}
      <ConfirmModal
        isOpen={!!rejectingExpense}
        onClose={() => !isRejecting && setRejectingExpense(null)}
        onConfirm={confirmRejectExpense}
        title="Decline Expense Claim"
        message="Please provide feedback or reason for declining this claim. This will be shown to the representative."
        confirmText="Confirm Reject"
        loadingText="Rejecting..."
        isDanger={true}
        icon={AlertCircle}
        isLoading={isRejecting}
      >
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5">
            Rejection Feedback / Reason <span className="text-rose-500">*</span>
          </label>
          <textarea
            rows="3"
            placeholder="e.g. Mileage exceeds territory limit, bill receipt required..."
            value={rejectReason}
            onChange={(e) => {
              setRejectReason(e.target.value);
              if (rejectError) setRejectError('');
            }}
            className={`w-full px-3 py-2 bg-slate-50 border rounded-xl text-xs text-slate-800 transition-colors focus:bg-white focus:outline-none ${
              rejectError
                ? 'border-rose-400 focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20 bg-rose-50/20'
                : 'border-slate-200 focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20'
            }`}
          ></textarea>
          {rejectError && (
            <p className="mt-1.5 text-xs text-rose-600 font-medium flex items-center gap-1.5 animate-in fade-in duration-150">
              <AlertCircle className="w-3.5 h-3.5 shrink-0 text-rose-500" />
              <span>{rejectError}</span>
            </p>
          )}
        </div>
      </ConfirmModal>

          {/* View Attached Receipt Modal */}
      {previewModalUrl && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl border border-slate-200 max-w-lg w-full overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-100 bg-slate-50/50">
              <div className="flex items-center gap-2">
                <Receipt className="w-4 h-4 text-violet-600" />
                <h3 className="text-sm font-semibold text-slate-800">Expense Bill Receipt</h3>
              </div>
              <div className="flex items-center gap-2">
                <a
                  href={previewModalUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Open Full</span>
                </a>
                <button
                  type="button"
                  onClick={() => setPreviewModalUrl(null)}
                  className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="p-4 flex items-center justify-center bg-slate-900/5 max-h-[70vh] overflow-auto">
              {previewModalUrl.match(/\.(jpeg|jpg|png|webp|gif)($|\?)/i) || previewModalUrl.startsWith('data:image') || (!previewModalUrl.endsWith('.pdf') && !previewModalUrl.match(/\.pdf($|\?)/i)) ? (
                <img
                  src={previewModalUrl}
                  alt="Receipt"
                  className="max-h-[60vh] w-auto max-w-full rounded-lg shadow-xs object-contain"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                    if (e.currentTarget.nextElementSibling) {
                      e.currentTarget.nextElementSibling.style.display = 'block';
                    }
                  }}
                />
              ) : null}
              <div style={{ display: (previewModalUrl.endsWith('.pdf') || previewModalUrl.match(/\.pdf($|\?)/i)) ? 'block' : 'none' }} className="w-full text-center py-8">
                <FileText className="w-12 h-12 text-slate-400 mx-auto mb-2" />
                <p className="text-xs text-slate-600 font-medium mb-3">Document / PDF Attachment</p>
                <a
                  href={previewModalUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-medium rounded-xl transition-colors"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>View PDF in New Tab</span>
                </a>
              </div>
            </div>

            <div className="px-5 py-3 border-t border-slate-100 bg-slate-50/50 flex justify-end">
              <button
                type="button"
                onClick={() => setPreviewModalUrl(null)}
                className="px-4 py-1.5 rounded-xl text-xs font-medium text-slate-600 hover:bg-slate-200/60 transition-colors cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

    </Layout>
  );
}