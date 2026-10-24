import { useEffect } from 'react';
import { AlertTriangle, Trash2, X } from 'lucide-react';

export default function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title = 'Confirm Action',
  message = 'Are you sure you want to proceed? This action cannot be undone.',
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  loadingText = null,
  isDanger = true,
  isLoading = false,
  icon = null,
  children = null,
}) {
  // Handle ESC key press to close modal
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && !isLoading) {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, isLoading, onClose]);

  if (!isOpen) return null;

  const IconComponent = icon || (isDanger ? Trash2 : AlertTriangle);
  const activeLoadingText = loadingText || (isLoading ? `${confirmText}...` : confirmText);

  const handleSubmit = (e) => {
    if (e) e.preventDefault();
    onConfirm?.(e);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="fixed inset-0" 
        onClick={isLoading ? undefined : onClose} 
      />

      <div className="relative w-full max-w-md bg-white rounded-2xl border border-slate-200 shadow-xl p-6 z-10 space-y-4 animate-in zoom-in-95 duration-200">
        <button
          type="button"
          onClick={onClose}
          disabled={isLoading}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors disabled:opacity-50 cursor-pointer"
          aria-label="Close dialog"
        >
          <X className="w-4 h-4" />
        </button>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex items-start gap-4">
            <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${
              isDanger 
                ? 'bg-rose-50 text-rose-600 border border-rose-100' 
                : 'bg-teal-50 text-teal-600 border border-teal-100'
            }`}>
              <IconComponent className="w-5 h-5 stroke-[2.2]" />
            </div>

            <div className="flex-1 pr-4">
              <h3 className="text-base font-bold text-slate-900">
                {title}
              </h3>
              {message && (
                <p className="mt-1 text-xs sm:text-sm text-slate-500 leading-relaxed">
                  {message}
                </p>
              )}
            </div>
          </div>

          {/* Children: renders textarea, form fields, notes, etc. */}
          {children && (
            <div className="pt-1">
              {children}
            </div>
          )}

          <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer disabled:opacity-50"
            >
              {cancelText}
            </button>

            <button
              type="submit"
              disabled={isLoading}
              className={`px-4 py-2 text-xs font-semibold text-white rounded-lg transition-colors flex items-center gap-2 cursor-pointer disabled:opacity-50 ${
                isDanger
                  ? 'bg-rose-600 hover:bg-rose-700 active:bg-rose-800'
                  : 'bg-teal-600 hover:bg-teal-700 active:bg-teal-800'
              }`}
            >
              {isLoading && (
                <div className="w-3.5 h-3.5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
              )}
              <span>{isLoading ? activeLoadingText : confirmText}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}