import { useState, useRef, useEffect, useMemo } from 'react';
import { 
  Bell, 
  Receipt, 
  Calendar, 
  CheckCircle2, 
  XCircle, 
  Check, 
  Clock,
  CheckCheck,
  X
} from 'lucide-react';
import { usePage as useInertiaPage, router as inertiaRouter } from '@inertiajs/react';

export default function NotificationDropdown() {
  const { props } = useInertiaPage();
  const notificationsData = props.notifications || { unread_count: 0, list: [] };
  const serverNotifications = notificationsData.list || [];

  const [isOpen, setIsOpen] = useState(false);
  const [localReadIds, setLocalReadIds] = useState(new Set());
  const dropdownRef = useRef(null);

  // Sync or clean localReadIds when server updates
  useEffect(() => {
    const serverRead = new Set(serverNotifications.filter((n) => Boolean(n.read_at)).map((n) => n.id));
    setLocalReadIds((prev) => {
      const merged = new Set([...prev, ...serverRead]);
      return merged;
    });
  }, [serverNotifications]);

  // Close dropdown on outside click or touch
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, []);

  const isNotificationRead = (notif) => {
    return Boolean(notif.read_at || localReadIds.has(notif.id));
  };

  const effectiveUnreadCount = useMemo(() => {
    return serverNotifications.filter((n) => !isNotificationRead(n)).length;
  }, [serverNotifications, localReadIds]);

  // Mark all as read
  const handleMarkAllRead = (e) => {
    e.stopPropagation();
    if (effectiveUnreadCount === 0) return;

    // Optimistically mark all as read locally
    setLocalReadIds(new Set(serverNotifications.map((n) => n.id)));

    inertiaRouter.post('/notifications/mark-all-read', {}, {
      preserveScroll: true,
      preserveState: true,
    });
  };

  // Mark single notification as read without navigating
  const handleMarkSingleAsRead = (e, notif) => {
    e.stopPropagation();
    if (isNotificationRead(notif)) return;

    setLocalReadIds((prev) => new Set([...prev, notif.id]));

    inertiaRouter.post(`/notifications/${notif.id}/read`, {}, {
      preserveScroll: true,
      preserveState: true,
    });
  };

  // Click on notification item (marks read and redirects to link)
  const handleNotificationClick = (notif) => {
    setIsOpen(false);

    if (!isNotificationRead(notif)) {
      setLocalReadIds((prev) => new Set([...prev, notif.id]));

      inertiaRouter.post(
        `/notifications/${notif.id}/read`,
        { redirect_to: notif.link || undefined },
        { preserveScroll: true }
      );
    } else if (notif.link) {
      inertiaRouter.visit(notif.link);
    }
  };

  // Get icon & colors based on type
  const getIconConfig = (type) => {
    switch (type) {
      case 'leave_applied':
        return {
          icon: Calendar,
          bg: 'bg-amber-50 text-amber-600 border-amber-100',
        };
      case 'expense_submitted':
        return {
          icon: Receipt,
          bg: 'bg-sky-50 text-sky-600 border-sky-100',
        };
      case 'leave_approved':
      case 'expense_approved':
        return {
          icon: CheckCircle2,
          bg: 'bg-emerald-50 text-emerald-600 border-emerald-100',
        };
      case 'leave_rejected':
      case 'expense_rejected':
        return {
          icon: XCircle,
          bg: 'bg-rose-50 text-rose-600 border-rose-100',
        };
      default:
        return {
          icon: Bell,
          bg: 'bg-violet-50 text-violet-600 border-violet-100',
        };
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Bell Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer"
        aria-label="View notifications"
        title="Notifications"
      >
        <Bell className="w-4 h-4 sm:w-4 sm:h-4 stroke-[2.2]" />

        {/* Badge counter */}
        {effectiveUnreadCount > 0 && (
          <span className="absolute top-1 right-1 flex items-center justify-center min-w-[16px] h-4 px-1 rounded-full bg-rose-500 text-[10px] font-bold text-white shadow-xs animate-in zoom-in-50 duration-200">
            {effectiveUnreadCount > 9 ? '9+' : effectiveUnreadCount}
          </span>
        )}
      </button>

      {/* Dropdown Flyout */}
      {isOpen && (
        <div className="fixed inset-x-3 top-16 sm:absolute sm:inset-x-auto sm:right-0 sm:top-full sm:mt-2 sm:w-96 max-w-[calc(100vw-1.5rem)] bg-white rounded-2xl border border-slate-200/90 shadow-2xl z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-150 font-sans">
            
            {/* Header */}
            <div className="px-4 py-3 border-b border-slate-100 bg-slate-50/80 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-900">Notifications</span>
                {effectiveUnreadCount > 0 ? (
                  <span className="text-[10px] font-semibold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-full border border-rose-100">
                    {effectiveUnreadCount} new
                  </span>
                ) : (
                  <span className="text-[10px] font-medium text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">
                    All caught up
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2">
                {effectiveUnreadCount > 0 && (
                  <button
                    type="button"
                    onClick={handleMarkAllRead}
                    className="text-[11px] font-medium text-violet-600 hover:text-violet-800 hover:underline inline-flex items-center gap-1 cursor-pointer"
                  >
                    <CheckCheck className="w-3.5 h-3.5 stroke-[2.2]" />
                    <span>Mark all read</span>
                  </button>
                )}

                {/* Mobile Close Button */}
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="sm:hidden p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-200/60 transition-colors cursor-pointer"
                  aria-label="Close"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* List of Notifications */}
            <div className="max-h-[65vh] sm:max-h-[380px] overflow-y-auto divide-y divide-slate-100 overscroll-contain">
              {serverNotifications.length === 0 ? (
                <div className="py-12 px-4 text-center">
                  <div className="w-11 h-11 rounded-full bg-slate-100 text-slate-400 mx-auto flex items-center justify-center mb-2.5">
                    <CheckCircle2 className="w-5 h-5 stroke-[1.8]" />
                  </div>
                  <p className="text-xs font-semibold text-slate-800">No notifications yet</p>
                  <p className="text-[11px] text-slate-400 mt-0.5 max-w-xs mx-auto">
                    When field requests or approvals happen, you will see them here.
                  </p>
                </div>
              ) : (
                serverNotifications.map((notif) => {
                  const read = isNotificationRead(notif);
                  const { icon: Icon, bg } = getIconConfig(notif.type);

                  return (
                    <div
                      key={notif.id}
                      onClick={() => handleNotificationClick(notif)}
                      className={`p-3.5 sm:p-4 flex items-start gap-3 transition-colors cursor-pointer group active:bg-slate-100/80 ${
                        !read
                          ? 'bg-violet-50/40 hover:bg-violet-50/70'
                          : 'hover:bg-slate-50'
                      }`}
                    >
                      {/* Icon */}
                      <div
                        className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 border ${bg}`}
                      >
                        <Icon className="w-4 h-4 stroke-[2.2]" />
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-1 mb-0.5">
                          <span
                            className={`text-xs tracking-tight truncate ${
                              !read ? 'font-bold text-slate-900' : 'font-semibold text-slate-700'
                            }`}
                          >
                            {notif.title}
                          </span>

                          <div className="flex items-center gap-1.5 shrink-0">
                            {/* Mark-as-read checkmark */}
                            {!read && (
                              <button
                                type="button"
                                onClick={(e) => handleMarkSingleAsRead(e, notif)}
                                title="Mark as read"
                                className="p-1 rounded-md text-slate-400 hover:text-violet-600 hover:bg-violet-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity"
                              >
                                <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                              </button>
                            )}

                            {/* Unread indicator dot */}
                            {!read && (
                              <span className="w-2 h-2 rounded-full bg-violet-600" title="Unread" />
                            )}
                          </div>
                        </div>

                        <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                          {notif.message}
                        </p>

                        <div className="flex items-center gap-1 mt-1.5 text-[10px] text-slate-400">
                          <Clock className="w-3 h-3 text-slate-300" />
                          <span>{notif.created_at || 'Recently'}</span>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
      )}
    </div>
  );
}