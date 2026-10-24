import { useState, useMemo } from 'react';
import { usePage, router } from '@inertiajs/react';
import { 
  ShoppingBag, 
  Plus, 
  CheckCircle2, 
  Clock, 
  Search, 
  Eye, 
  Store, 
  User, 
  Stethoscope, 
  X, 
  Trash2, 
  Truck, 
  Check, 
  FileText,
  AlertCircle
} from 'lucide-react';
import toast from 'react-hot-toast';
import AdminLayout from '../../layouts/AdminLayout';
import MRLayout from '../../layouts/MR/MRLayout';
import ConfirmModal from '../../components/common/ConfirmModal';

export default function PobOrder({ 
  orders = [], 
  doctors = [], 
  products = [], 
  summary = {}, 
  isAdmin = false 
}) {
  const { props } = usePage();
  const userRole = props.auth?.user?.role;
  const isSuperAdminOrAdmin = userRole === 'admin' || userRole === 'super_admin' || isAdmin;
  const Layout = isSuperAdminOrAdmin ? AdminLayout : MRLayout;

  // Search & Filter state
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // Modals state
  const [showBookModal, setShowBookModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null); // For Details Modal
  const [verifyingOrder, setVerifyingOrder] = useState(null); // For ConfirmModal
  const [dispatchingOrder, setDispatchingOrder] = useState(null); // For Dispatch ConfirmModal
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form state for booking POB
  const initialItem = {
    product_id: '',
    product_name: '',
    quantity: 10,
    unit_price: 150,
  };

  const [formData, setFormData] = useState({
    chemist_name: '',
    doctor_id: '',
    notes: '',
    items: [{ ...initialItem }],
  });
  const [formErrors, setFormErrors] = useState({});

  // Reset form when modal opens
  const openBookModal = () => {
    setFormData({
      chemist_name: '',
      doctor_id: '',
      notes: '',
      items: [{ ...initialItem }],
    });
    setFormErrors({});
    setShowBookModal(true);
  };

  // Dynamic Item row handlers
  const handleAddItem = () => {
    setFormData((prev) => ({
      ...prev,
      items: [...prev.items, { ...initialItem }],
    }));
  };

  const handleRemoveItem = (index) => {
    if (formData.items.length <= 1) return;
    setFormData((prev) => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index),
    }));
  };

  const handleItemChange = (index, field, value) => {
    setFormData((prev) => {
      const updated = [...prev.items];
      if (field === 'product_id') {
        const prod = products.find((p) => String(p.id) === String(value));
        updated[index] = {
          ...updated[index],
          product_id: value,
          product_name: prod ? `${prod.brand_name} (${prod.dosage_form || 'Medicine'})` : '',
        };
      } else {
        updated[index] = {
          ...updated[index],
          [field]: value,
        };
      }
      return { ...prev, items: updated };
    });
  };

  // Calculate live order total
  const calculatedTotal = useMemo(() => {
    return formData.items.reduce((sum, item) => {
      const q = parseFloat(item.quantity) || 0;
      const p = parseFloat(item.unit_price) || 0;
      return sum + q * p;
    }, 0);
  }, [formData.items]);

  // Submit POB Order
  const handleBookSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setFormErrors({});

    router.post('/mrconnect/pob-order', formData, {
      preserveScroll: true,
      onSuccess: () => {
        setIsSubmitting(false);
        setShowBookModal(false);
      },
      onError: (errs) => {
        setIsSubmitting(false);
        setFormErrors(errs || {});
        toast.error('Please check the form for errors.');
      },
    });
  };

  // Admin: Verify Order
  const handleVerifyConfirm = () => {
    if (!verifyingOrder) return;
    setIsSubmitting(true);

    router.post(`/mrconnect/pob-order/${verifyingOrder.id}/status`, { status: 'verified' }, {
      preserveScroll: true,
      onSuccess: () => {
        setIsSubmitting(false);
        setVerifyingOrder(null);
        if (selectedOrder?.id === verifyingOrder.id) {
          setSelectedOrder((prev) => prev ? { ...prev, status: 'verified' } : null);
        }
      },
      onError: () => {
        setIsSubmitting(false);
        toast.error('Failed to verify order.');
      },
    });
  };

  // Admin: Mark Dispatched
  const handleDispatchConfirm = () => {
    if (!dispatchingOrder) return;
    setIsSubmitting(true);

    router.post(`/mrconnect/pob-order/${dispatchingOrder.id}/status`, { status: 'dispatched' }, {
      preserveScroll: true,
      onSuccess: () => {
        setIsSubmitting(false);
        setDispatchingOrder(null);
        if (selectedOrder?.id === dispatchingOrder.id) {
          setSelectedOrder((prev) => prev ? { ...prev, status: 'dispatched' } : null);
        }
      },
      onError: () => {
        setIsSubmitting(false);
        toast.error('Failed to update status.');
      },
    });
  };

  // Normalized items parser for any order
  const getOrderItems = (order) => {
    if (!order) return [];
    if (Array.isArray(order.items) && order.items.length > 0) {
      return order.items;
    }
    if (order.items_json) {
      try {
        const parsed = typeof order.items_json === 'string' ? JSON.parse(order.items_json) : order.items_json;
        if (Array.isArray(parsed)) return parsed;
      } catch (e) {
        // ignore JSON parse error
      }
    }
    return [];
  };

  // Filtered orders list
  const filteredOrders = useMemo(() => {
    return orders.filter((ord) => {
      const matchSearch =
        (ord.order_no && ord.order_no.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (ord.chemist_name && ord.chemist_name.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (ord.representative_name && ord.representative_name.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (ord.doctor_name && ord.doctor_name.toLowerCase().includes(searchTerm.toLowerCase()));

      const matchStatus =
        statusFilter === 'all' ? true : ord.status === statusFilter;

      return matchSearch && matchStatus;
    });
  }, [orders, searchTerm, statusFilter]);

  return (
    <Layout>
      <div className="space-y-6 max-w-7xl mx-auto pb-12">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-violet-50 text-violet-600 border border-violet-100 flex items-center justify-center">
                <ShoppingBag className="w-5 h-5 stroke-[2.2]" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-slate-900 tracking-tight">
                  Personal Order Booking (POB)
                </h1>
                <p className="text-xs text-slate-500">
                  {isSuperAdminOrAdmin
                    ? 'Review and verify retail chemist orders taken by Medical Representatives in the field.'
                    : 'Book personal orders at retail chemist pharmacies during doctor & field visits.'}
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={openBookModal}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 transition-colors shadow-xs cursor-pointer"
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
              <span>Book POB Order</span>
            </button>
          </div>
        </div>

        {/* Metrics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-slate-500">Total Bookings</span>
              <div className="w-8 h-8 rounded-lg bg-violet-50 text-violet-600 flex items-center justify-center">
                <ShoppingBag className="w-4 h-4" />
              </div>
            </div>
            <p className="text-2xl font-bold text-slate-900 mt-2">{summary.total_orders || orders.length || 0}</p>
            <p className="text-[11px] text-slate-400 mt-1">Retail chemist orders</p>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-slate-500">Total Order Value</span>
              <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <span className="text-xs font-bold">₹</span>
              </div>
            </div>
            <p className="text-2xl font-bold text-emerald-600 mt-2">
              ₹{Number(summary.total_value || 0).toLocaleString()}
            </p>
            <p className="text-[11px] text-emerald-600 font-medium mt-1">Gross sales generated</p>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-slate-500">Verified by Admin</span>
              <div className="w-8 h-8 rounded-lg bg-teal-50 text-teal-600 flex items-center justify-center">
                <CheckCircle2 className="w-4 h-4" />
              </div>
            </div>
            <p className="text-2xl font-bold text-teal-600 mt-2">{summary.verified_orders || 0}</p>
            <p className="text-[11px] text-teal-600 font-medium mt-1">Approved for stockist dispatch</p>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-slate-500">Pending Review</span>
              <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
                <Clock className="w-4 h-4" />
              </div>
            </div>
            <p className="text-2xl font-bold text-amber-600 mt-2">
              {summary.pending_orders ?? orders.filter((o) => o.status === 'submitted').length}
            </p>
            <p className="text-[11px] text-amber-600 font-medium mt-1">Awaiting admin verification</p>
          </div>
        </div>

        {/* Filter and Search Bar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white p-3.5 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search by order no, chemist shop, representative, doctor..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500"
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
            {[
              { id: 'all', label: 'All Orders' },
              { id: 'submitted', label: 'Pending' },
              { id: 'verified', label: 'Verified' },
              { id: 'dispatched', label: 'Dispatched' },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setStatusFilter(tab.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer whitespace-nowrap ${
                  statusFilter === tab.id
                    ? 'bg-slate-900 text-white'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Orders Table */}
        <div className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-xs">
          <div className="px-5 py-3.5 border-b border-slate-100 flex items-center justify-between">
            <h3 className="text-sm font-semibold text-slate-800">
              POB Chemist Bookings {isSuperAdminOrAdmin ? '(All Representatives)' : '(My Territory)'}
            </h3>
            <span className="text-xs text-slate-400">{filteredOrders.length} records</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-100 text-[11px] font-semibold text-slate-400 bg-slate-50/50">
                  <th className="py-3 px-4">Order No</th>
                  <th className="py-3 px-4">Chemist / Medical Store</th>
                  <th className="py-3 px-4">Representative</th>
                  <th className="py-3 px-4 text-center">Items</th>
                  <th className="py-3 px-4 text-right">Order Amount</th>
                  <th className="py-3 px-4 text-center">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredOrders.length > 0 ? (
                  filteredOrders.map((ord) => {
                    const items = getOrderItems(ord);
                    return (
                      <tr key={ord.id} className="hover:bg-slate-50/70 transition-colors">
                        {/* Order No */}
                        <td className="py-3 px-4">
                          <button
                            type="button"
                            onClick={() => setSelectedOrder(ord)}
                            className="font-mono font-semibold text-violet-700 hover:text-violet-900 hover:underline cursor-pointer flex items-center gap-1.5"
                          >
                            <span>{ord.order_no}</span>
                          </button>
                          <span className="text-[10px] text-slate-400 block mt-0.5">
                            {new Date(ord.created_at).toLocaleDateString('en-IN', {
                              day: '2-digit',
                              month: 'short',
                              year: 'numeric',
                            })}
                          </span>
                        </td>

                        {/* Chemist / Medical Store */}
                        <td className="py-3 px-4">
                          <div className="font-medium text-slate-800 flex items-center gap-1.5">
                            <Store className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                            <span>{ord.chemist_name}</span>
                          </div>
                          {ord.doctor_name ? (
                            <span className="inline-flex items-center gap-1 text-[11px] text-teal-700 mt-0.5">
                              <Stethoscope className="w-3 h-3" />
                              <span>Dr. {ord.doctor_name}</span>
                            </span>
                          ) : (
                            <span className="text-[10px] text-slate-400 block mt-0.5">Direct Chemist Booking</span>
                          )}
                        </td>

                        {/* Representative */}
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2">
                            <div className="w-6 h-6 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center font-bold text-[10px]">
                              {ord.representative_name ? ord.representative_name.charAt(0).toUpperCase() : 'M'}
                            </div>
                            <span className="text-slate-700 font-medium">
                              {ord.representative_name || 'Representative'}
                            </span>
                          </div>
                        </td>

                        {/* Items */}
                        <td className="py-3 px-4 text-center">
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium bg-slate-100 text-slate-700">
                            {ord.items_count || items.length || 1} products
                          </span>
                        </td>

                        {/* Order Amount */}
                        <td className="py-3 px-4 text-right font-bold text-slate-900">
                          ₹{Number(ord.total_amount).toLocaleString()}
                        </td>

                        {/* Status */}
                        <td className="py-3 px-4 text-center">
                          <span
                            className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-[11px] font-semibold ${
                              ord.status === 'verified'
                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200/60'
                                : ord.status === 'dispatched'
                                ? 'bg-sky-50 text-sky-700 border border-sky-200/60'
                                : ord.status === 'delivered'
                                ? 'bg-violet-50 text-violet-700 border border-violet-200/60'
                                : 'bg-amber-50 text-amber-700 border border-amber-200/60'
                            }`}
                          >
                            {ord.status === 'verified' ? (
                              <CheckCircle2 className="w-3 h-3" />
                            ) : ord.status === 'dispatched' ? (
                              <Truck className="w-3 h-3" />
                            ) : (
                              <Clock className="w-3 h-3" />
                            )}
                            <span className="capitalize">{ord.status}</span>
                          </span>
                        </td>

                        {/* Actions */}
                        <td className="py-3 px-4 text-right">
                          <div className="inline-flex items-center gap-1.5 justify-end">
                            {/* View Details */}
                            <button
                              type="button"
                              onClick={() => setSelectedOrder(ord)}
                              title="View Order Details"
                              className="p-1.5 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors cursor-pointer"
                            >
                              <Eye className="w-4 h-4" />
                            </button>

                            {/* Admin Actions */}
                            {isSuperAdminOrAdmin && ord.status === 'submitted' && (
                              <button
                                type="button"
                                onClick={() => setVerifyingOrder(ord)}
                                title="Verify Order for Stockist Dispatch"
                                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-emerald-600 hover:bg-emerald-700 text-white transition-colors cursor-pointer shadow-xs"
                              >
                                <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                                <span>Verify</span>
                              </button>
                            )}

                            {isSuperAdminOrAdmin && ord.status === 'verified' && (
                              <button
                                type="button"
                                onClick={() => setDispatchingOrder(ord)}
                                title="Mark as Dispatched"
                                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-sky-600 hover:bg-sky-700 text-white transition-colors cursor-pointer shadow-xs"
                              >
                                <Truck className="w-3.5 h-3.5" />
                                <span>Dispatch</span>
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={7} className="py-12 text-center text-slate-400">
                      <ShoppingBag className="w-8 h-8 mx-auto text-slate-300 mb-2 stroke-[1.5]" />
                      <p className="text-xs font-medium">No POB orders found matching the filter criteria.</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>

      {/* Book POB Modal (MR / Chemist Order) */}
      {showBookModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl border border-slate-200 max-w-2xl w-full p-6 space-y-4 shadow-xl max-h-[90vh] flex flex-col animate-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 shrink-0">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-violet-50 text-violet-600 flex items-center justify-center">
                  <Store className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm sm:text-base font-bold text-slate-900">
                    Book Personal Order (POB)
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    Visit medical store/chemist, add product items, and submit for admin verification.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowBookModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body / Form */}
            <form onSubmit={handleBookSubmit} className="space-y-4 overflow-y-auto pr-1 flex-1 text-xs">
              {/* Row 1: Chemist Name & Linked Doctor */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Chemist / Medical Shop Name <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Sanjeevani Medical Store, Station Road"
                    value={formData.chemist_name}
                    onChange={(e) => {
                      setFormData({ ...formData, chemist_name: e.target.value });
                      if (formErrors.chemist_name) setFormErrors({ ...formErrors, chemist_name: null });
                    }}
                    className={`w-full px-3 py-2 bg-slate-50 border rounded-xl text-xs text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 ${
                      formErrors.chemist_name ? 'border-rose-300 bg-rose-50/30' : 'border-slate-200'
                    }`}
                  />
                  {formErrors.chemist_name && (
                    <p className="text-[11px] text-rose-500 mt-1">{formErrors.chemist_name[0] || formErrors.chemist_name}</p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Prescribing Doctor (Optional)
                  </label>
                  <select
                    value={formData.doctor_id}
                    onChange={(e) => setFormData({ ...formData, doctor_id: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 cursor-pointer"
                  >
                    <option value="">Select Doctor (Prescription Driver)...</option>
                    {doctors.map((doc) => (
                      <option key={doc.id} value={doc.id}>
                        Dr. {doc.name} ({doc.clinic_hospital_name || 'Clinic'})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Product Items Table */}
              <div className="space-y-2 pt-2 border-t border-slate-100">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-slate-800 flex items-center gap-1.5">
                    <span>Product Items</span>
                    <span className="text-[11px] font-normal text-slate-400">({formData.items.length} items)</span>
                  </label>
                  <button
                    type="button"
                    onClick={handleAddItem}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-semibold text-violet-700 bg-violet-50 hover:bg-violet-100 transition-colors cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Product</span>
                  </button>
                </div>

                <div className="border border-slate-200 rounded-xl overflow-hidden">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="bg-slate-50/80 border-b border-slate-200 text-[11px] font-semibold text-slate-500">
                        <th className="py-2 px-3">Product Name</th>
                        <th className="py-2 px-3 w-20 text-center">Qty</th>
                        <th className="py-2 px-3 w-28 text-right">Rate (₹)</th>
                        <th className="py-2 px-3 w-28 text-right">Subtotal</th>
                        <th className="py-2 px-2 w-10 text-center"></th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {formData.items.map((item, idx) => {
                        const lineSubtotal = (parseFloat(item.quantity) || 0) * (parseFloat(item.unit_price) || 0);
                        return (
                          <tr key={idx} className="hover:bg-slate-50/40">
                            {/* Product Select / Input */}
                            <td className="py-2 px-3">
                              {products.length > 0 ? (
                                <select
                                  value={item.product_id || ''}
                                  onChange={(e) => handleItemChange(idx, 'product_id', e.target.value)}
                                  className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-violet-500"
                                >
                                  <option value="">Select company product...</option>
                                  {products.map((p) => (
                                    <option key={p.id} value={p.id}>
                                      {p.brand_name} - {p.dosage_form || p.strength || 'Item'}
                                    </option>
                                  ))}
                                </select>
                              ) : (
                                <input
                                  type="text"
                                  required
                                  placeholder="Product Name"
                                  value={item.product_name}
                                  onChange={(e) => handleItemChange(idx, 'product_name', e.target.value)}
                                  className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-violet-500"
                                />
                              )}
                              {/* If custom product or if product selected, allow custom name tweak */}
                              {item.product_id && (
                                <input
                                  type="text"
                                  value={item.product_name}
                                  onChange={(e) => handleItemChange(idx, 'product_name', e.target.value)}
                                  className="w-full mt-1 px-2.5 py-1 bg-slate-50 border border-slate-200 rounded text-[11px] text-slate-600"
                                  placeholder="Custom description / pack size"
                                />
                              )}
                            </td>

                            {/* Qty */}
                            <td className="py-2 px-3">
                              <input
                                type="number"
                                min="1"
                                required
                                value={item.quantity}
                                onChange={(e) => handleItemChange(idx, 'quantity', e.target.value)}
                                className="w-full px-2 py-1.5 bg-white border border-slate-200 rounded-lg text-xs text-center text-slate-800 focus:outline-none focus:ring-1 focus:ring-violet-500"
                              />
                            </td>

                            {/* Rate */}
                            <td className="py-2 px-3">
                              <div className="relative">
                                <span className="absolute left-2 top-1/2 -translate-y-1/2 text-slate-400 text-[11px]">₹</span>
                                <input
                                  type="number"
                                  step="0.01"
                                  min="0.1"
                                  required
                                  value={item.unit_price}
                                  onChange={(e) => handleItemChange(idx, 'unit_price', e.target.value)}
                                  className="w-full pl-5 pr-2 py-1.5 bg-white border border-slate-200 rounded-lg text-xs text-right text-slate-800 focus:outline-none focus:ring-1 focus:ring-violet-500"
                                />
                              </div>
                            </td>

                            {/* Line Subtotal */}
                            <td className="py-2 px-3 text-right font-semibold text-slate-800">
                              ₹{lineSubtotal.toLocaleString()}
                            </td>

                            {/* Remove button */}
                            <td className="py-2 px-2 text-center">
                              <button
                                type="button"
                                disabled={formData.items.length <= 1}
                                onClick={() => handleRemoveItem(idx)}
                                className="p-1 text-slate-400 hover:text-rose-600 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer transition-colors"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                    <tfoot>
                      <tr className="bg-violet-50/50 border-t border-slate-200 font-semibold text-slate-800">
                        <td colSpan={3} className="py-2.5 px-3 text-right text-xs">
                          Gross Order Value:
                        </td>
                        <td className="py-2.5 px-3 text-right text-sm font-bold text-violet-900">
                          ₹{calculatedTotal.toLocaleString()}
                        </td>
                        <td></td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>

              {/* Notes & Stockist Instructions */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Delivery Notes & Preferred Stockist (Optional)
                </label>
                <textarea
                  rows="2"
                  placeholder="e.g. Supply via Mahaveer Medicose Stockist within 2 days..."
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500"
                ></textarea>
              </div>

              {/* Modal Footer */}
              <div className="flex items-center justify-between pt-3 border-t border-slate-100 shrink-0">
                <div className="text-[11px] text-slate-500">
                  Total: <span className="font-bold text-slate-800">₹{calculatedTotal.toLocaleString()}</span> ({formData.items.length} items)
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setShowBookModal(false)}
                    className="px-4 py-2 rounded-xl text-xs font-medium text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting || calculatedTotal <= 0}
                    className="px-5 py-2 rounded-xl text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 disabled:opacity-50 transition-colors cursor-pointer"
                  >
                    {isSubmitting ? 'Booking Order...' : 'Submit POB Order'}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Order Details Modal (View by MR or Admin) */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl border border-slate-200 max-w-xl w-full p-6 space-y-4 shadow-xl max-h-[90vh] flex flex-col animate-in zoom-in-95 duration-200">
            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-violet-50 text-violet-600 flex items-center justify-center">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-bold text-slate-900">
                      Order {selectedOrder.order_no}
                    </h3>
                    <span
                      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold ${
                        selectedOrder.status === 'verified'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : selectedOrder.status === 'dispatched'
                          ? 'bg-sky-50 text-sky-700 border border-sky-200'
                          : selectedOrder.status === 'delivered'
                          ? 'bg-violet-50 text-violet-700 border border-violet-200'
                          : 'bg-amber-50 text-amber-700 border border-amber-200'
                      }`}
                    >
                      <span className="capitalize">{selectedOrder.status}</span>
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400">
                    Booked on {new Date(selectedOrder.created_at).toLocaleString('en-IN')}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setSelectedOrder(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <div className="space-y-4 overflow-y-auto pr-1 flex-1 text-xs">
              {/* Chemist & Doctor Meta Card */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-slate-50/80 p-3.5 rounded-xl border border-slate-100">
                <div>
                  <span className="text-[11px] font-medium text-slate-400">Chemist / Retail Pharmacy</span>
                  <p className="font-semibold text-slate-800 text-xs mt-0.5 flex items-center gap-1.5">
                    <Store className="w-3.5 h-3.5 text-slate-500" />
                    <span>{selectedOrder.chemist_name}</span>
                  </p>
                </div>

                <div>
                  <span className="text-[11px] font-medium text-slate-400">Field Representative</span>
                  <p className="font-semibold text-slate-800 text-xs mt-0.5 flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-slate-500" />
                    <span>{selectedOrder.representative_name || 'Representative'}</span>
                  </p>
                </div>

                {selectedOrder.doctor_name && (
                  <div className="sm:col-span-2 pt-2 border-t border-slate-200/60">
                    <span className="text-[11px] font-medium text-slate-400">Prescribing Doctor Linked</span>
                    <p className="font-semibold text-teal-800 text-xs mt-0.5 flex items-center gap-1.5">
                      <Stethoscope className="w-3.5 h-3.5 text-teal-600" />
                      <span>Dr. {selectedOrder.doctor_name} ({selectedOrder.clinic_hospital_name || 'Clinic'})</span>
                    </p>
                  </div>
                )}
              </div>

              {/* Items Breakdown */}
              <div className="space-y-2">
                <h4 className="text-xs font-semibold text-slate-800">Itemized Medicine Breakdown</h4>
                <div className="border border-slate-200 rounded-xl overflow-hidden">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="bg-slate-50 text-[11px] font-semibold text-slate-500 border-b border-slate-200">
                        <th className="py-2 px-3">#</th>
                        <th className="py-2 px-3">Product Name</th>
                        <th className="py-2 px-3 text-center">Qty</th>
                        <th className="py-2 px-3 text-right">Unit Rate</th>
                        <th className="py-2 px-3 text-right">Subtotal</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {getOrderItems(selectedOrder).length > 0 ? (
                        getOrderItems(selectedOrder).map((item, i) => {
                          const pName = item.product_name || item.product || 'Medicine Item';
                          const q = item.quantity || item.qty || 1;
                          const r = item.unit_price || item.rate || item.mrp || 0;
                          const sub = item.subtotal || (Number(q) * Number(r));
                          return (
                            <tr key={i} className="hover:bg-slate-50/50">
                              <td className="py-2 px-3 text-slate-400">{i + 1}</td>
                              <td className="py-2 px-3 font-medium text-slate-800">{pName}</td>
                              <td className="py-2 px-3 text-center text-slate-700">{q}</td>
                              <td className="py-2 px-3 text-right text-slate-600">₹{Number(r).toLocaleString()}</td>
                              <td className="py-2 px-3 text-right font-semibold text-slate-800">₹{Number(sub).toLocaleString()}</td>
                            </tr>
                          );
                        })
                      ) : (
                        <tr>
                          <td colSpan={5} className="py-4 text-center text-slate-400">
                            Single lumped order amount without itemized lines.
                          </td>
                        </tr>
                      )}
                    </tbody>
                    <tfoot>
                      <tr className="bg-slate-50 border-t border-slate-200 font-semibold text-slate-800">
                        <td colSpan={4} className="py-2.5 px-3 text-right text-xs">
                          Total Order Value:
                        </td>
                        <td className="py-2.5 px-3 text-right text-sm font-bold text-slate-900">
                          ₹{Number(selectedOrder.total_amount).toLocaleString()}
                        </td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>

              {/* Notes */}
              {selectedOrder.notes && (
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <span className="text-[11px] font-medium text-slate-400 block mb-0.5">Notes & Instructions</span>
                  <p className="text-xs text-slate-700 leading-relaxed">{selectedOrder.notes}</p>
                </div>
              )}
            </div>

            {/* Modal Actions Footer */}
            <div className="flex items-center justify-between pt-3 border-t border-slate-100 shrink-0">
              <button
                type="button"
                onClick={() => setSelectedOrder(null)}
                className="px-4 py-2 rounded-xl text-xs font-medium text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
              >
                Close
              </button>

              {/* Admin Verification Quick Action inside modal */}
              {isSuperAdminOrAdmin && selectedOrder.status === 'submitted' && (
                <button
                  type="button"
                  onClick={() => {
                    const ord = selectedOrder;
                    setSelectedOrder(null);
                    setVerifyingOrder(ord);
                  }}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 transition-colors shadow-xs cursor-pointer"
                >
                  <Check className="w-4 h-4" />
                  <span>Verify This Order</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ConfirmModal for Admin Verification */}
      <ConfirmModal
        isOpen={!!verifyingOrder}
        onClose={() => setVerifyingOrder(null)}
        onConfirm={handleVerifyConfirm}
        isDanger={false}
        isLoading={isSubmitting}
        title="Verify POB Order"
        message={`Are you sure you want to verify order ${verifyingOrder?.order_no} from "${verifyingOrder?.chemist_name}"? This authorizes the order for stockist billing and dispatch.`}
        confirmText="Verify Order"
        cancelText="Cancel"
      />

      {/* ConfirmModal for Dispatch */}
      <ConfirmModal
        isOpen={!!dispatchingOrder}
        onClose={() => setDispatchingOrder(null)}
        onConfirm={handleDispatchConfirm}
        isDanger={false}
        isLoading={isSubmitting}
        title="Mark Order Dispatched"
        message={`Mark order ${dispatchingOrder?.order_no} as dispatched from the stockist?`}
        confirmText="Mark Dispatched"
        cancelText="Cancel"
      />
    </Layout>
  );
}