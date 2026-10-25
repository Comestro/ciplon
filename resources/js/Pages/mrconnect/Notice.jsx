import { useState, useMemo } from 'react';
import { usePage, useForm, router } from '@inertiajs/react';
import { 
  Megaphone, 
  AlertCircle, 
  Calendar, 
  User, 
  Plus, 
  Trash2, 
  Search, 
  X 
} from 'lucide-react';
import AdminLayout from '../../layouts/AdminLayout';
import MRLayout from '../../layouts/MR/MRLayout';

const capitalizeFirst = (text) => {
  if (!text) return '';
  return text.charAt(0).toUpperCase() + text.slice(1);
};

export default function Notice({ notices = [] }) {
  const { props } = usePage();
  const isAdmin = props.auth?.user?.role === 'admin' || props.auth?.user?.role === 'super_admin';
  const Layout = isAdmin ? AdminLayout : MRLayout;

  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  const { data, setData, post, processing, errors, reset, clearErrors } = useForm({
    title: '',
    content: '',
  });

  const handleOpenModal = () => {
    reset();
    clearErrors();
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    reset();
    clearErrors();
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    post('/mrconnect/notice', {
      onSuccess: () => {
        handleCloseModal();
      },
    });
  };

  const handleDelete = (id) => {
    if (confirm('Are you sure you want to delete this notice?')) {
      setDeletingId(id);
      router.delete(`/mrconnect/notice/${id}`, {
        onFinish: () => setDeletingId(null),
      });
    }
  };

  const filteredNotices = useMemo(() => {
    if (!searchQuery.trim()) return notices;
    const q = searchQuery.toLowerCase();
    return notices.filter((nt) => 
      nt.title?.toLowerCase().includes(q) ||
      nt.content?.toLowerCase().includes(q) ||
      nt.publisher_name?.toLowerCase().includes(q)
    );
  }, [notices, searchQuery]);

  return (
    <Layout title="Notices">
      <div className="space-y-6 pb-12 font-sans max-w-[1200px] mx-auto text-slate-800">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200/80">
          <div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-violet-50 text-violet-600 flex items-center justify-center">
                <Megaphone className="w-4 h-4" />
              </div>
              <h2 className="text-xl sm:text-2xl font-semibold tracking-tight text-slate-900">
                Notices
              </h2>
            </div>
            <p className="text-xs text-slate-500 font-normal mt-1">
              Official company updates, circulars, and announcements.
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* Search Box */}
            <div className="relative w-48 sm:w-64">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search notices..."
                className="w-full bg-white border border-slate-200/80 rounded-xl pl-8 pr-7 py-2 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-500/10 transition-all font-normal"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {isAdmin && (
              <button
                type="button"
                onClick={handleOpenModal}
                className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-medium transition-all shadow-xs cursor-pointer whitespace-nowrap"
              >
                <Plus className="w-4 h-4" />
                <span>Post Notice</span>
              </button>
            )}
          </div>
        </div>

        {/* Notices List */}
        {filteredNotices.length > 0 ? (
          <div className="space-y-3">
            {filteredNotices.map((nt) => (
              <div 
                key={nt.id} 
                className="bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-6 space-y-3 transition-all hover:border-slate-300"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-1">
                    <h3 className="text-base font-semibold text-slate-900 tracking-tight">
                      {capitalizeFirst(nt.title)}
                    </h3>
                    <div className="flex items-center gap-3 text-[11px] text-slate-400 font-normal">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-slate-400" />
                        <span>
                          {nt.created_at || nt.published_at 
                            ? new Date(nt.created_at || nt.published_at).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' }) 
                            : 'Recent'}
                        </span>
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <User className="w-3 h-3 text-slate-400" />
                        <span>{nt.publisher_name || 'Admin'}</span>
                      </span>
                    </div>
                  </div>

                  {isAdmin && (
                    <button
                      type="button"
                      disabled={deletingId === nt.id}
                      onClick={() => handleDelete(nt.id)}
                      className="text-slate-400 hover:text-rose-600 p-1.5 rounded-lg hover:bg-rose-50 transition-colors cursor-pointer shrink-0 disabled:opacity-50"
                      title="Delete notice"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>

                <p className="text-xs text-slate-600 leading-relaxed whitespace-pre-line pt-1">
                  {capitalizeFirst(nt.content)}
                </p>
              </div>
            ))}
          </div>
        ) : (
          /* Empty State */
          <div className="bg-white rounded-2xl border border-slate-200/80 p-12 text-center space-y-3 max-w-md mx-auto">
            <div className="w-12 h-12 mx-auto rounded-2xl bg-violet-50 text-violet-600 flex items-center justify-center">
              <Megaphone className="w-5 h-5" />
            </div>

            <div className="space-y-1">
              <h3 className="text-sm font-semibold text-slate-900">
                {searchQuery ? 'No matching notices' : 'No notices yet'}
              </h3>
              <p className="text-xs text-slate-500 font-normal">
                {searchQuery
                  ? 'Try a different search keyword.'
                  : 'Announcements and circulars will appear here.'}
              </p>
            </div>

            {isAdmin && !searchQuery && (
              <button
                type="button"
                onClick={handleOpenModal}
                className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-medium transition-all shadow-xs cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Post First Notice</span>
              </button>
            )}
          </div>
        )}

        {/* Post Notice Modal */}
        {isModalOpen && (
          <div 
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in duration-200"
            onClick={handleCloseModal}
          >
            <div 
              className="w-full max-w-md bg-white rounded-3xl shadow-xl border border-slate-200/80 overflow-hidden transform transition-all text-slate-800"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="px-6 pt-6 pb-4 border-b border-slate-100 flex items-center justify-between">
                <div>
                  <h3 className="text-base font-semibold text-slate-900 tracking-tight">
                    Post Notice
                  </h3>
                  <p className="text-xs text-slate-400 font-normal">
                    Send an announcement to all users.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="w-8 h-8 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 flex items-center justify-center transition-colors cursor-pointer shrink-0 -mr-1"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} noValidate className="p-6 space-y-4">
                {/* Title */}
                <div className="space-y-1">
                  <label className="text-xs font-medium text-slate-700 block">
                    Title
                  </label>
                  <input
                    type="text"
                    value={data.title}
                    onChange={(e) => { 
                      const val = capitalizeFirst(e.target.value);
                      setData('title', val); 
                      if (errors.title) clearErrors('title'); 
                    }}
                    placeholder="e.g. Office Holiday Notice / Meeting Update"
                    autoFocus
                    className={`w-full bg-slate-50/60 hover:bg-slate-50 focus:bg-white border rounded-xl px-3 py-2 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none transition-all font-normal ${
                      errors.title
                        ? 'border-rose-300 focus:border-rose-500 focus:ring-2 focus:ring-rose-500/15'
                        : 'border-slate-200 focus:border-slate-300 focus:ring-2 focus:ring-violet-500/10'
                    }`}
                  />
                  {errors.title && (
                    <p className="text-[11px] text-rose-600 flex items-center gap-1 font-normal mt-1">
                      <AlertCircle className="w-3 h-3 shrink-0" />
                      <span>{errors.title}</span>
                    </p>
                  )}
                </div>

                {/* Content */}
                <div className="space-y-1">
                  <label className="text-xs font-medium text-slate-700 block">
                    Message
                  </label>
                  <textarea
                    rows={4}
                    value={data.content}
                    onChange={(e) => { 
                      const val = capitalizeFirst(e.target.value);
                      setData('content', val); 
                      if (errors.content) clearErrors('content'); 
                    }}
                    placeholder="Write the announcement details..."
                    className={`w-full bg-slate-50/60 hover:bg-slate-50 focus:bg-white border rounded-xl p-3 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none transition-all font-normal ${
                      errors.content
                        ? 'border-rose-300 focus:border-rose-500 focus:ring-2 focus:ring-rose-500/15'
                        : 'border-slate-200 focus:border-slate-300 focus:ring-2 focus:ring-violet-500/10'
                    }`}
                  />
                  {errors.content && (
                    <p className="text-[11px] text-rose-600 flex items-center gap-1 font-normal mt-1">
                      <AlertCircle className="w-3 h-3 shrink-0" />
                      <span>{errors.content}</span>
                    </p>
                  )}
                </div>

                {/* Actions */}
                <div className="pt-2 flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={handleCloseModal}
                    className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 text-xs font-medium transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={processing}
                    className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-medium flex items-center gap-1.5 transition-all cursor-pointer disabled:opacity-60 shadow-xs"
                  >
                    {processing ? (
                      <>
                        <div className="w-3.5 h-3.5 border-2 border-white/60 border-t-white rounded-full animate-spin" />
                        <span>Posting...</span>
                      </>
                    ) : (
                      <span>Post Notice</span>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

      </div>
    </Layout>
  );
}
