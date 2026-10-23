import { useState } from 'react';
import { router, Link } from '@inertiajs/react';
import { 
  Mail, 
  Search, 
  Filter, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  Trash2, 
  ExternalLink, 
  Building2, 
  Phone, 
  Globe, 
  X,
  FileText,
  User,
  MessageSquare
} from 'lucide-react';
import AdminLayout from '../../../layouts/AdminLayout';
import ConfirmModal from '../../../components/common/ConfirmModal';

export default function EnquiryIndex({ enquiries = {}, stats = {}, filters = {} }) {
  const [searchTerm, setSearchTerm] = useState(filters.search || '');
  const [selectedEnquiry, setSelectedEnquiry] = useState(null);
  const [statusUpdating, setStatusUpdating] = useState(false);
  const [deletingEnquiryId, setDeletingEnquiryId] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const enquiryList = enquiries.data || [];

  const handleSearch = (e) => {
    e.preventDefault();
    router.get('/admin/enquiries', {
      search: searchTerm,
      status: filters.status || 'all',
    }, { preserveState: true });
  };

  const handleStatusFilter = (status) => {
    router.get('/admin/enquiries', {
      search: searchTerm,
      status: status,
    }, { preserveState: true });
  };

  const handleUpdateStatus = (enquiryId, newStatus) => {
    setStatusUpdating(true);
    router.patch(`/admin/enquiries/${enquiryId}/status`, {
      status: newStatus,
    }, {
      preserveScroll: true,
      onSuccess: () => {
        setStatusUpdating(false);
        if (selectedEnquiry && selectedEnquiry.id === enquiryId) {
          setSelectedEnquiry(prev => ({ ...prev, status: newStatus }));
        }
      },
      onError: () => {
        setStatusUpdating(false);
      }
    });
  };

  const confirmDeleteEnquiry = () => {
    if (!deletingEnquiryId) return;
    setIsDeleting(true);
    router.delete(`/admin/enquiries/${deletingEnquiryId}`, {
      preserveScroll: true,
      onFinish: () => {
        setIsDeleting(false);
        setDeletingEnquiryId(null);
      },
      onSuccess: () => {
        if (selectedEnquiry && selectedEnquiry.id === deletingEnquiryId) {
          setSelectedEnquiry(null);
        }
      }
    });
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'pending':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
            <Clock className="w-3 h-3" />
            Pending Action
          </span>
        );
      case 'contacted':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
            <Mail className="w-3 h-3" />
            Contacted
          </span>
        );
      case 'resolved':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <CheckCircle2 className="w-3 h-3" />
            Resolved
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-slate-100 text-slate-700 border border-slate-200">
            {status}
          </span>
        );
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
              Commercial Inquiries & Partnerships
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Inquiries received via the Contact page and formulation enquiry modals.
            </p>
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">Total Inquiries</span>
            <span className="text-2xl font-bold text-slate-900 mt-1 block">{stats.total || 0}</span>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-amber-200/80 bg-amber-50/20">
            <span className="text-xs font-semibold text-amber-700 uppercase tracking-wider block">Pending Action</span>
            <span className="text-2xl font-bold text-amber-600 mt-1 block">{stats.pending || 0}</span>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">Contacted</span>
            <span className="text-2xl font-bold text-blue-600 mt-1 block">{stats.contacted || 0}</span>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">Resolved</span>
            <span className="text-2xl font-bold text-emerald-600 mt-1 block">{stats.resolved || 0}</span>
          </div>
        </div>

        {/* Filters & Search Toolbar */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Status Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0 no-scrollbar">
            {[
              { label: 'All', value: 'all' },
              { label: 'Pending', value: 'pending' },
              { label: 'Contacted', value: 'contacted' },
              { label: 'Resolved', value: 'resolved' },
            ].map((tab) => (
              <button
                key={tab.value}
                type="button"
                onClick={() => handleStatusFilter(tab.value)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
                  (filters.status || 'all') === tab.value
                    ? 'bg-[#0c2340] text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="relative w-full md:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search sender, company, email..."
              className="w-full pl-9 pr-4 py-2 bg-slate-50 focus:bg-white border border-slate-200 focus:border-[#c59324] rounded-xl text-xs text-slate-900 placeholder:text-slate-400 outline-none transition-all"
            />
          </form>
        </div>

        {/* Inquiries Table */}
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
          {enquiryList.length === 0 ? (
            <div className="p-12 text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
                <Mail className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-800">No Commercial Inquiries Found</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                {filters.search || filters.status !== 'all'
                  ? 'No inquiries match your current filters. Try resetting search.'
                  : 'New inquiries submitted via the Contact page or product modal will appear here.'}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider text-[11px]">
                    <th className="py-3.5 px-4 sm:px-6">Sender & Organization</th>
                    <th className="py-3.5 px-4">Contact</th>
                    <th className="py-3.5 px-4">Inquiry Nature</th>
                    <th className="py-3.5 px-4">Received Date</th>
                    <th className="py-3.5 px-4">Status</th>
                    <th className="py-3.5 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {enquiryList.map((item) => (
                    <tr 
                      key={item.id} 
                      className="hover:bg-slate-50/70 transition-colors group cursor-pointer"
                      onClick={() => setSelectedEnquiry(item)}
                    >
                      {/* Sender */}
                      <td className="py-4 px-4 sm:px-6">
                        <div className="font-bold text-slate-900 text-sm">
                          {item.name}
                        </div>
                        {item.company && (
                          <div className="text-slate-500 text-xs flex items-center gap-1 mt-0.5">
                            <Building2 className="w-3 h-3 text-slate-400 shrink-0" />
                            <span className="truncate max-w-[200px]">{item.company}</span>
                          </div>
                        )}
                      </td>

                      {/* Contact */}
                      <td className="py-4 px-4">
                        <div className="text-slate-800 font-medium">
                          {item.email}
                        </div>
                        {item.phone && (
                          <div className="text-slate-500 text-xs mt-0.5">
                            {item.phone}
                          </div>
                        )}
                      </td>

                      {/* Nature */}
                      <td className="py-4 px-4">
                        <span className="font-semibold text-slate-800 block">
                          {item.inquiry_type || 'General'}
                        </span>
                        {item.product_name && (
                          <span className="text-[11px] text-[#c59324] font-medium block truncate max-w-[180px]">
                            {item.product_name}
                          </span>
                        )}
                      </td>

                      {/* Date */}
                      <td className="py-4 px-4 text-slate-500 whitespace-nowrap">
                        {item.created_at ? new Date(item.created_at).toLocaleDateString('en-IN', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric'
                        }) : 'Recent'}
                      </td>

                      {/* Status */}
                      <td className="py-4 px-4">
                        {getStatusBadge(item.status)}
                      </td>

                      {/* Actions */}
                      <td className="py-4 px-4 text-right whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => setSelectedEnquiry(item)}
                            className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-[#0c2340] hover:text-white text-slate-700 font-semibold transition-colors cursor-pointer"
                          >
                            View
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDelete(item.id)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                            title="Delete inquiry"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Pagination */}
          {enquiries.links && enquiries.links.length > 3 && (
            <div className="p-4 border-t border-slate-100 flex items-center justify-between">
              <span className="text-xs text-slate-500">
                Showing {enquiries.from || 0} to {enquiries.to || 0} of {enquiries.total || 0} inquiries
              </span>
              <div className="flex items-center gap-1">
                {enquiries.links.map((link, idx) => (
                  <button
                    key={idx}
                    disabled={!link.url}
                    onClick={() => link.url && router.get(link.url, {}, { preserveState: true })}
                    dangerouslySetInnerHTML={{ __html: link.label }}
                    className={`px-3 py-1 rounded-lg text-xs font-semibold cursor-pointer ${
                      link.active
                        ? 'bg-[#0c2340] text-white'
                        : link.url
                        ? 'bg-slate-50 text-slate-700 hover:bg-slate-100'
                        : 'text-slate-300 cursor-not-allowed'
                    }`}
                  />
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Modal: Inquiry Detail Viewer */}
        {selectedEnquiry && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-150">
            <div className="bg-white rounded-3xl max-w-xl w-full max-h-[92vh] overflow-y-auto border border-slate-200 shadow-2xl relative">
              
              {/* Modal Header */}
              <div className="p-6 bg-gradient-to-r from-[#0c2340] to-[#07172b] text-white rounded-t-3xl relative">
                <button
                  type="button"
                  onClick={() => setSelectedEnquiry(null)}
                  className="absolute top-5 right-5 p-1.5 rounded-full text-slate-300 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>

                <div className="flex items-center gap-2 mb-2">
                  <span className="text-[11px] font-bold text-[#dfad36] uppercase tracking-wider">
                    {selectedEnquiry.inquiry_type || 'Commercial Inquiry'}
                  </span>
                  {selectedEnquiry.product_name && (
                    <span className="text-[11px] bg-white/15 px-2 py-0.5 rounded text-white">
                      {selectedEnquiry.product_name}
                    </span>
                  )}
                </div>

                <h3 className="text-xl font-bold text-white">
                  {selectedEnquiry.name}
                </h3>
                {selectedEnquiry.company && (
                  <p className="text-xs text-slate-300 mt-0.5">
                    {selectedEnquiry.company} {selectedEnquiry.country ? `• ${selectedEnquiry.country}` : ''}
                  </p>
                )}
              </div>

              {/* Modal Body */}
              <div className="p-6 space-y-5 text-xs sm:text-sm">
                
                {/* Contact Information Bar */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">Email Address</span>
                    <a href={`mailto:${selectedEnquiry.email}`} className="text-[#0c2340] font-semibold hover:underline mt-0.5 block truncate">
                      {selectedEnquiry.email}
                    </a>
                  </div>

                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">Phone / WhatsApp</span>
                    <span className="text-[#0c2340] font-semibold mt-0.5 block">
                      {selectedEnquiry.phone || 'Not provided'}
                    </span>
                  </div>
                </div>

                {/* Message Body */}
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider mb-1.5">Requirements & Message</span>
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-slate-800 leading-relaxed whitespace-pre-wrap">
                    {selectedEnquiry.message}
                  </div>
                </div>

                {/* Status Switcher */}
                <div className="pt-2 border-t border-slate-100">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider mb-2">Update Workflow Status</span>
                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      type="button"
                      disabled={statusUpdating}
                      onClick={() => handleUpdateStatus(selectedEnquiry.id, 'pending')}
                      className={`px-3 py-1.5 rounded-xl font-bold text-xs cursor-pointer transition-colors ${
                        selectedEnquiry.status === 'pending'
                          ? 'bg-amber-500 text-white'
                          : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                      }`}
                    >
                      Pending
                    </button>
                    <button
                      type="button"
                      disabled={statusUpdating}
                      onClick={() => handleUpdateStatus(selectedEnquiry.id, 'contacted')}
                      className={`px-3 py-1.5 rounded-xl font-bold text-xs cursor-pointer transition-colors ${
                        selectedEnquiry.status === 'contacted'
                          ? 'bg-blue-600 text-white'
                          : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                      }`}
                    >
                      Mark as Contacted
                    </button>
                    <button
                      type="button"
                      disabled={statusUpdating}
                      onClick={() => handleUpdateStatus(selectedEnquiry.id, 'resolved')}
                      className={`px-3 py-1.5 rounded-xl font-bold text-xs cursor-pointer transition-colors ${
                        selectedEnquiry.status === 'resolved'
                          ? 'bg-emerald-600 text-white'
                          : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                      }`}
                    >
                      Mark as Resolved
                    </button>
                  </div>
                </div>

                {/* Footer Action */}
                <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                  <a
                    href={`mailto:${selectedEnquiry.email}?subject=Re: Inquiry regarding ${selectedEnquiry.product_name || selectedEnquiry.inquiry_type || 'Ciplon Pharma'}`}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#c59324] to-[#dfad36] text-[#07172b] font-bold text-xs hover:brightness-105 transition-all shadow-sm"
                  >
                    <Mail className="w-3.5 h-3.5" />
                    <span>Reply via Email</span>
                  </a>

                  <button
                    type="button"
                    onClick={() => setSelectedEnquiry(null)}
                    className="px-4 py-2 rounded-xl text-slate-500 hover:text-slate-800 font-semibold text-xs cursor-pointer"
                  >
                    Close
                  </button>
                </div>

              </div>
            </div>
          </div>
        )}

      </div>

      <ConfirmModal
        isOpen={!!deletingEnquiryId}
        onClose={() => !isDeleting && setDeletingEnquiryId(null)}
        onConfirm={confirmDeleteEnquiry}
        title="Delete Commercial Inquiry"
        message="Are you sure you want to permanently delete this commercial inquiry? This action cannot be undone."
        confirmText="Delete Inquiry"
        cancelText="Cancel"
        isDanger={true}
        isLoading={isDeleting}
      />
    </AdminLayout>
  );
}
