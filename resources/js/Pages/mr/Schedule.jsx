import { useState, useMemo } from 'react';
import { router, Link } from '@inertiajs/react';
import { 
  CalendarClock, 
  MapPin, 
  Phone, 
  PhoneCall,
  Plus, 
  Search, 
  CheckCircle2, 
  Clock, 
  Calendar, 
  Filter, 
  X, 
  AlertCircle, 
  Check, 
  ChevronRight, 
  Building2, 
  Stethoscope, 
  Pill, 
  FileText, 
  Trash2, 
  RefreshCw,
  TrendingUp,
  Sparkles,
  UserCheck,
  ChevronDown,
  RotateCcw,
  CheckCheck,
  MessageSquare
} from 'lucide-react';
import toast from 'react-hot-toast';
import MRLayout from '../../layouts/MR/MRLayout';

const CALL_OUTCOMES = [
  'Spoke with Doctor - Positive response',
  'Prescription promised for upcoming month',
  'Requested clinic visit with product samples',
  'Busy in OPD - Requested callback later',
  'Call unanswered / Left reminder message'
];

const VISIT_OUTCOMES = [
  'Visited clinic & completed product detailing',
  'Handed over samples & clinical visual aid shown',
  'Doctor committed to trial on 5+ patients',
  'Doctor in surgery / Not available at clinic',
  'Follow-up visit requested next week'
];

export default function Schedule({ 
  schedules = [], 
  metrics = {}, 
  doctors = [], 
  products = [], 
  todayDate = '', 
  filters = {} 
}) {
  const [activeTab, setActiveTab] = useState(filters.tab || 'today');
  const [actionFilter, setActionFilter] = useState(filters.action_type || 'all');
  const [statusFilter, setStatusFilter] = useState(filters.status || 'all');
  const [searchQuery, setSearchQuery] = useState(filters.search || '');

  // Modals state
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [outcomeModalSchedule, setOutcomeModalSchedule] = useState(null);
  const [outcomeNote, setOutcomeNote] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Reschedule state
  const [rescheduleItem, setRescheduleItem] = useState(null);
  const [rescheduleDate, setRescheduleDate] = useState('');
  const [rescheduleTime, setRescheduleTime] = useState('');

  // Create form state
  const [formData, setFormData] = useState({
    action_type: 'call',
    contact_mode: 'doctor', // 'doctor' or 'custom'
    doctor_id: '',
    custom_contact_name: '',
    contact_type: 'doctor',
    scheduled_date: todayDate || new Date().toISOString().split('T')[0],
    scheduled_time: 'Morning OPD (10:30 AM)',
    priority: 'normal',
    purpose: '',
    notes: ''
  });

  // Client-side search and filtering for smooth immediate response
  const filteredSchedules = useMemo(() => {
    return schedules.filter(item => {
      // Action type filter
      if (actionFilter !== 'all' && item.action_type !== actionFilter) {
        return false;
      }
      // Status filter
      if (statusFilter !== 'all' && item.status !== statusFilter) {
        return false;
      }
      // Search
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const docName = item.doctor?.name?.toLowerCase() || '';
        const docHospital = item.doctor?.clinic_hospital_name?.toLowerCase() || '';
        const customName = item.custom_contact_name?.toLowerCase() || '';
        const purpose = item.purpose?.toLowerCase() || '';
        const notes = item.notes?.toLowerCase() || '';
        if (!docName.includes(q) && !docHospital.includes(q) && !customName.includes(q) && !purpose.includes(q) && !notes.includes(q)) {
          return false;
        }
      }
      return true;
    });
  }, [schedules, actionFilter, statusFilter, searchQuery]);

  // Tab change handler (navigates via Inertia to refresh backend dataset)
  const handleTabChange = (newTab) => {
    setActiveTab(newTab);
    router.get('/mr/schedule', {
      tab: newTab,
      action_type: actionFilter,
      status: statusFilter,
      search: searchQuery
    }, { preserveState: true, preserveScroll: true });
  };

  // Open Outcome Modal to Mark Visited or Called
  const openOutcomeModal = (schedule) => {
    setOutcomeModalSchedule(schedule);
    setOutcomeNote(schedule.outcome_note || '');
  };

  // Quick 1-click status update
  const handleStatusUpdate = (scheduleId, status, customOutcomeNote = null) => {
    setIsSubmitting(true);
    router.put(`/mr/schedule/${scheduleId}/status`, {
      status,
      outcome_note: customOutcomeNote !== null ? customOutcomeNote : outcomeNote
    }, {
      preserveScroll: true,
      onSuccess: () => {
        setIsSubmitting(false);
        setOutcomeModalSchedule(null);
        setOutcomeNote('');
        toast.success(status === 'completed' ? 'Marked as completed!' : `Status updated to ${status}`);
      },
      onError: () => {
        setIsSubmitting(false);
        toast.error('Failed to update status.');
      }
    });
  };

  // Handle Reschedule Submit
  const handleRescheduleSubmit = (e) => {
    e.preventDefault();
    if (!rescheduleItem || !rescheduleDate) return;
    setIsSubmitting(true);
    router.put(`/mr/schedule/${rescheduleItem.id}/status`, {
      status: 'rescheduled',
      new_date: rescheduleDate,
      new_time: rescheduleTime
    }, {
      preserveScroll: true,
      onSuccess: () => {
        setIsSubmitting(false);
        setRescheduleItem(null);
        setRescheduleDate('');
        setRescheduleTime('');
        toast.success('Rescheduled successfully!');
      },
      onError: () => {
        setIsSubmitting(false);
        toast.error('Failed to reschedule.');
      }
    });
  };

  // Handle Delete
  const handleDelete = (scheduleId) => {
    if (!confirm('Are you sure you want to remove this item from your schedule?')) return;
    router.delete(`/mr/schedule/${scheduleId}`, {
      preserveScroll: true,
      onSuccess: () => toast.success('Schedule item removed.'),
      onError: () => toast.error('Failed to remove item.')
    });
  };

  // Handle Create Schedule Submit
  const handleCreateSubmit = (e) => {
    e.preventDefault();
    if (formData.contact_mode === 'doctor' && !formData.doctor_id) {
      toast.error('Please select a doctor.');
      return;
    }
    if (formData.contact_mode === 'custom' && !formData.custom_contact_name.trim()) {
      toast.error('Please enter the contact name.');
      return;
    }
    if (!formData.purpose.trim()) {
      toast.error('Please specify the purpose or discussion topic.');
      return;
    }

    setIsSubmitting(true);
    router.post('/mr/schedule', {
      doctor_id: formData.contact_mode === 'doctor' ? formData.doctor_id : null,
      custom_contact_name: formData.contact_mode === 'custom' ? formData.custom_contact_name : null,
      contact_type: formData.contact_mode === 'doctor' ? 'doctor' : formData.contact_type,
      action_type: formData.action_type,
      scheduled_date: formData.scheduled_date,
      scheduled_time: formData.scheduled_time,
      priority: formData.priority,
      purpose: formData.purpose,
      notes: formData.notes
    }, {
      preserveScroll: true,
      onSuccess: () => {
        setIsSubmitting(false);
        setIsCreateModalOpen(false);
        // Reset form
        setFormData({
          action_type: 'call',
          contact_mode: 'doctor',
          doctor_id: '',
          custom_contact_name: '',
          contact_type: 'doctor',
          scheduled_date: todayDate || new Date().toISOString().split('T')[0],
          scheduled_time: 'Morning OPD (10:30 AM)',
          priority: 'normal',
          purpose: '',
          notes: ''
        });
        toast.success('Added to your schedule!');
      },
      onError: (errors) => {
        setIsSubmitting(false);
        const first = Object.values(errors)[0] || 'Failed to save schedule.';
        toast.error(first);
      }
    });
  };

  // Selected doctor helper
  const selectedDoctorObj = useMemo(() => {
    if (!formData.doctor_id) return null;
    return doctors.find(d => String(d.id) === String(formData.doctor_id));
  }, [formData.doctor_id, doctors]);

  // Append product brand to purpose
  const addProductToPurpose = (brandName) => {
    setFormData(prev => ({
      ...prev,
      purpose: prev.purpose ? `${prev.purpose}, ${brandName}` : `Detailing ${brandName}`
    }));
  };

  return (
    <MRLayout title="Planner & Calls">
      <div className="space-y-6">

        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-teal-700 uppercase tracking-wider mb-1">
              <CalendarClock className="w-4 h-4" />
              <span>MR Field Daily Planner</span>
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-teal-50 text-teal-800 border border-teal-200/60">
                {todayDate ? new Date(todayDate).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' }) : 'Today'}
              </span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">Today's Calls & Clinic Visits</h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Organize your field schedule, complete telephonic calls, record clinic visits, and mark outcomes.
            </p>
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            <button
              type="button"
              onClick={() => setIsCreateModalOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-teal-700 hover:bg-teal-800 text-white text-xs font-semibold shadow-xs hover:shadow-sm transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4 stroke-[2.2]" />
              <span>Schedule Call or Visit</span>
            </button>
          </div>
        </div>

        {/* Today's Completion & Metrics Bar */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Main Completion Gauge */}
          <div className="md:col-span-2 bg-gradient-to-br from-teal-900 via-teal-800 to-slate-900 text-white p-5 rounded-2xl shadow-sm relative overflow-hidden flex flex-col justify-between">
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-medium text-teal-200 uppercase tracking-wider flex items-center gap-1.5">
                  <TrendingUp className="w-3.5 h-3.5" /> Today's Execution Rate
                </span>
                <span className="text-xs font-bold bg-teal-500/20 text-teal-200 px-2 py-0.5 rounded-full border border-teal-400/30">
                  {metrics.today_completed || 0} of {metrics.today_total || 0} Done
                </span>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-extrabold tracking-tight">{metrics.completion_rate || 0}%</span>
                <span className="text-xs text-teal-200/80 font-normal">
                  {metrics.today_pending > 0 
                    ? `${metrics.today_pending} action${metrics.today_pending > 1 ? 's' : ''} remaining today`
                    : (metrics.today_total > 0 ? 'All scheduled items completed! Great work!' : 'No items scheduled for today yet')}
                </span>
              </div>
            </div>

            {/* Progress bar */}
            <div className="relative z-10 mt-4">
              <div className="w-full h-2.5 bg-white/15 rounded-full overflow-hidden p-0.5">
                <div 
                  className="h-full bg-gradient-to-r from-teal-300 to-emerald-400 rounded-full transition-all duration-500"
                  style={{ width: `${Math.min(100, Math.max(metrics.completion_rate || 0, metrics.today_total === 0 ? 0 : 5))}%` }}
                />
              </div>
            </div>

            {/* Decorative background circle */}
            <div className="absolute -right-6 -bottom-8 w-32 h-32 rounded-full bg-teal-600/10 pointer-events-none" />
          </div>

          {/* Visits Stat Card */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
            <div>
              <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
                Clinic Visits Planned
              </span>
              <span className="text-2xl font-bold text-slate-900 mt-1 block">
                {metrics.today_visits || 0}
              </span>
              <span className="text-[11px] text-teal-700 font-medium flex items-center gap-1 mt-0.5">
                <MapPin className="w-3 h-3" /> In-Person Detailing
              </span>
            </div>
            <div className="w-11 h-11 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center shrink-0">
              <Stethoscope className="w-5 h-5 stroke-[2]" />
            </div>
          </div>

          {/* Calls Stat Card */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
            <div>
              <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
                Phone Calls Planned
              </span>
              <span className="text-2xl font-bold text-slate-900 mt-1 block">
                {metrics.today_calls || 0}
              </span>
              <span className="text-[11px] text-sky-700 font-medium flex items-center gap-1 mt-0.5">
                <PhoneCall className="w-3 h-3" /> Telephonic Follow-ups
              </span>
            </div>
            <div className="w-11 h-11 rounded-xl bg-sky-50 text-sky-700 flex items-center justify-center shrink-0">
              <Phone className="w-5 h-5 stroke-[2]" />
            </div>
          </div>
        </div>

        {/* Tab & Filter Bar */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-xs space-y-3">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
            
            {/* Primary View Tabs */}
            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl w-full md:w-auto overflow-x-auto">
              <button
                type="button"
                onClick={() => handleTabChange('today')}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
                  activeTab === 'today'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <span>Today's Agenda</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                  activeTab === 'today' ? 'bg-teal-100 text-teal-800' : 'bg-slate-200 text-slate-600'
                }`}>
                  {metrics.today_total || 0}
                </span>
              </button>

              <button
                type="button"
                onClick={() => handleTabChange('upcoming')}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
                  activeTab === 'upcoming'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <span>Upcoming</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                  activeTab === 'upcoming' ? 'bg-teal-100 text-teal-800' : 'bg-slate-200 text-slate-600'
                }`}>
                  {metrics.upcoming_count || 0}
                </span>
              </button>

              <button
                type="button"
                onClick={() => handleTabChange('history')}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
                  activeTab === 'history'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <span>Past History</span>
              </button>

              <button
                type="button"
                onClick={() => handleTabChange('all')}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
                  activeTab === 'all'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <span>All</span>
              </button>
            </div>

            {/* Quick Search */}
            <div className="relative w-full md:w-72">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                placeholder="Search doctor, clinic, purpose..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-teal-600/20 focus:border-teal-700 transition-all"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* Secondary Quick Filter Pills */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-100 text-xs">
            <div className="flex items-center gap-2 overflow-x-auto">
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider shrink-0">
                Type:
              </span>
              <button
                type="button"
                onClick={() => setActionFilter('all')}
                className={`px-2.5 py-1 rounded-lg text-xs font-medium cursor-pointer transition-colors ${
                  actionFilter === 'all' ? 'bg-slate-900 text-white font-semibold' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                All Actions
              </button>
              <button
                type="button"
                onClick={() => setActionFilter('visit')}
                className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium cursor-pointer transition-colors ${
                  actionFilter === 'visit' ? 'bg-teal-700 text-white font-semibold' : 'bg-teal-50 text-teal-800 hover:bg-teal-100'
                }`}
              >
                <MapPin className="w-3 h-3" /> Visits Only
              </button>
              <button
                type="button"
                onClick={() => setActionFilter('call')}
                className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium cursor-pointer transition-colors ${
                  actionFilter === 'call' ? 'bg-sky-700 text-white font-semibold' : 'bg-sky-50 text-sky-800 hover:bg-sky-100'
                }`}
              >
                <Phone className="w-3 h-3" /> Calls Only
              </button>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                Status:
              </span>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="bg-slate-50 border border-slate-200 text-slate-700 text-xs rounded-lg px-2.5 py-1 focus:outline-hidden focus:border-teal-700 cursor-pointer"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="completed">Completed</option>
                <option value="missed">Missed</option>
              </select>
            </div>
          </div>
        </div>

        {/* Schedule List Items */}
        <div className="space-y-3">
          {filteredSchedules.length === 0 ? (
            <div className="bg-white rounded-2xl border border-slate-200/80 p-12 text-center shadow-xs">
              <div className="w-12 h-12 rounded-2xl bg-teal-50 text-teal-700 flex items-center justify-center mx-auto mb-3">
                <CalendarClock className="w-6 h-6 stroke-[1.8]" />
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-1">No Scheduled Items Found</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto mb-4">
                {searchQuery || actionFilter !== 'all' || statusFilter !== 'all'
                  ? 'No items match your active filters. Try clearing filters or searching for something else.'
                  : `You have no calls or visits planned in the '${activeTab}' view.`}
              </p>
              <button
                type="button"
                onClick={() => setIsCreateModalOpen(true)}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-teal-700 text-white text-xs font-semibold hover:bg-teal-800 shadow-xs cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5 stroke-[2.2]" />
                <span>Add Today's Call or Visit</span>
              </button>
            </div>
          ) : (
            filteredSchedules.map((item) => {
              const isCall = item.action_type === 'call';
              const isCompleted = item.status === 'completed';
              const isPending = item.status === 'pending';
              const isMissed = item.status === 'missed';

              const doctor = item.doctor;
              const displayName = doctor ? doctor.name : item.custom_contact_name;
              const subtitle = doctor 
                ? `${doctor.specialization} • ${doctor.clinic_hospital_name}`
                : `Custom Contact • ${(item.contact_type || 'contact').toUpperCase()}`;
              const phone = doctor ? doctor.phone : null;

              return (
                <div 
                  key={item.id}
                  className={`bg-white rounded-2xl border transition-all p-4.5 sm:p-5 shadow-xs hover:shadow-sm ${
                    isCompleted 
                      ? 'border-emerald-200/90 bg-emerald-50/15' 
                      : isMissed 
                        ? 'border-rose-200/90 bg-rose-50/15'
                        : 'border-slate-200/80 hover:border-slate-300'
                  }`}
                >
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    
                    {/* Left: Contact Info & Action Type Badge */}
                    <div className="flex items-start gap-3.5 min-w-0 flex-1">
                      {/* Action Type Icon Badge */}
                      <div className={`w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 shadow-xs ${
                        isCompleted
                          ? 'bg-emerald-100 text-emerald-700'
                          : isCall
                            ? 'bg-sky-100/80 text-sky-700'
                            : 'bg-teal-100/80 text-teal-800'
                      }`}>
                        {isCompleted ? (
                          <CheckCheck className="w-5 h-5 stroke-[2.2]" />
                        ) : isCall ? (
                          <PhoneCall className="w-5 h-5 stroke-[2.2]" />
                        ) : (
                          <MapPin className="w-5 h-5 stroke-[2.2]" />
                        )}
                      </div>

                      {/* Details Column */}
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2 mb-1">
                          {/* Action Badge */}
                          <span className={`text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full ${
                            isCall 
                              ? 'bg-sky-50 text-sky-800 border border-sky-200/70' 
                              : 'bg-teal-50 text-teal-800 border border-teal-200/70'
                          }`}>
                            {isCall ? 'Phone Call' : 'Clinic Visit'}
                          </span>

                          {/* Priority Badge */}
                          {item.priority === 'high' && (
                            <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-rose-50 text-rose-700 border border-rose-200/60">
                              High Priority
                            </span>
                          )}

                          {/* Scheduled Date/Time Badge */}
                          <span className="inline-flex items-center gap-1 text-[11px] text-slate-500 font-medium bg-slate-100 px-2 py-0.5 rounded-md">
                            <Clock className="w-3 h-3 text-slate-400" />
                            <span>{item.scheduled_time || 'Anytime'}</span>
                            {activeTab !== 'today' && (
                              <span className="text-slate-400 font-normal">
                                • {new Date(item.scheduled_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                              </span>
                            )}
                          </span>

                          {/* Status Pill */}
                          {isCompleted && (
                            <span className="inline-flex items-center gap-1 text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300">
                              <Check className="w-3 h-3 stroke-[2.5]" /> Visited / Called
                            </span>
                          )}
                          {isMissed && (
                            <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-rose-100 text-rose-800">
                              Missed
                            </span>
                          )}
                        </div>

                        {/* Title & Subtitle */}
                        <div className="flex items-center gap-2">
                          <h4 className="text-sm font-bold text-slate-900 truncate">
                            {displayName}
                          </h4>
                          {doctor?.tier && (
                            <span className="text-[9px] uppercase font-extrabold px-1.5 py-0.2 bg-teal-50 text-teal-700 border border-teal-200 rounded">
                              {doctor.tier}
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-slate-500 truncate mt-0.5">
                          {subtitle}
                        </p>

                        {/* Purpose & Agenda */}
                        <div className="mt-2 bg-slate-50/80 rounded-xl p-2.5 border border-slate-100/90 text-xs">
                          <div className="flex items-start gap-1.5">
                            <FileText className="w-3.5 h-3.5 text-teal-700 shrink-0 mt-0.5" />
                            <div className="min-w-0 flex-1">
                              <span className="font-medium text-slate-800">Purpose: </span>
                              <span className="text-slate-600">{item.purpose}</span>
                            </div>
                          </div>
                          {item.notes && (
                            <p className="text-[11px] text-slate-500 mt-1 pl-5 italic">
                              Note: {item.notes}
                            </p>
                          )}
                        </div>

                        {/* Completed Outcome Note Display */}
                        {isCompleted && item.outcome_note && (
                          <div className="mt-2 bg-emerald-50/70 border border-emerald-200/60 rounded-xl p-2.5 text-xs text-emerald-950 flex items-start gap-2">
                            <MessageSquare className="w-3.5 h-3.5 text-emerald-700 shrink-0 mt-0.5" />
                            <div>
                              <span className="font-bold text-emerald-900">Outcome: </span>
                              <span>{item.outcome_note}</span>
                              {item.completed_at && (
                                <span className="text-[10px] text-emerald-700 block mt-0.5">
                                  Logged at {new Date(item.completed_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </span>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Right: Action Buttons (1-click mark, call, reschedule) */}
                    <div className="flex flex-wrap lg:flex-col items-end gap-2 shrink-0 pt-3 lg:pt-0 border-t lg:border-t-0 border-slate-100">
                      
                      {/* Action buttons if Pending */}
                      {isPending && (
                        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                          
                          {/* If Call, option to dial directly */}
                          {phone && (
                            <a
                              href={`tel:${phone}`}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-sky-200 bg-sky-50 text-sky-800 hover:bg-sky-100 text-xs font-semibold transition-colors cursor-pointer"
                              title={`Dial ${phone}`}
                            >
                              <Phone className="w-3.5 h-3.5" />
                              <span>Call {phone}</span>
                            </a>
                          )}

                          {/* Primary Mark Button */}
                          <button
                            type="button"
                            onClick={() => openOutcomeModal(item)}
                            className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold text-white shadow-xs hover:shadow-sm transition-all cursor-pointer ${
                              isCall 
                                ? 'bg-sky-700 hover:bg-sky-800' 
                                : 'bg-teal-700 hover:bg-teal-800'
                            }`}
                          >
                            <Check className="w-4 h-4 stroke-[2.5]" />
                            <span>{isCall ? 'Mark as Called' : 'Mark as Visited'}</span>
                          </button>

                          {/* Extra options dropdown / buttons */}
                          {/* Reschedule button */}
                          <button
                            type="button"
                            onClick={() => {
                              setRescheduleItem(item);
                              setRescheduleDate(item.scheduled_date);
                              setRescheduleTime(item.scheduled_time || '');
                            }}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
                            title="Reschedule"
                          >
                            <RotateCcw className="w-4 h-4" />
                          </button>

                          {/* Delete button */}
                          <button
                            type="button"
                            onClick={() => handleDelete(item.id)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      )}

                      {/* If Visit and pending, link to Log Full Detailing */}
                      {!isCall && isPending && doctor && (
                        <Link
                          href={`/mr/visits?doctor_id=${doctor.id}`}
                          className="text-[11px] font-semibold text-teal-700 hover:text-teal-900 inline-flex items-center gap-1 cursor-pointer mt-1"
                        >
                          <span>Log Full Clinic Detailing Form</span>
                          <ChevronRight className="w-3 h-3" />
                        </Link>
                      )}

                      {/* If already completed: Revert or Edit Outcome */}
                      {isCompleted && (
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => openOutcomeModal(item)}
                            className="text-[11px] font-medium text-emerald-800 hover:text-emerald-950 underline cursor-pointer"
                          >
                            Edit Outcome Note
                          </button>
                          <span className="text-slate-300">•</span>
                          <button
                            type="button"
                            onClick={() => handleStatusUpdate(item.id, 'pending')}
                            className="text-[11px] font-medium text-slate-500 hover:text-slate-800 cursor-pointer"
                            title="Revert to Pending"
                          >
                            Reopen
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDelete(item.id)}
                            className="p-1 rounded text-slate-400 hover:text-rose-600 hover:bg-rose-50 ml-1 cursor-pointer"
                            title="Delete"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      )}
                    </div>

                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Modal 1: Schedule Call or Visit */}
        {isCreateModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs overflow-y-auto">
            <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-xl border border-slate-100 my-8">
              
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <div>
                  <h3 className="text-lg font-bold text-slate-900">Schedule a Call or Clinic Visit</h3>
                  <p className="text-xs text-slate-500 mt-0.5">Add to your daily agenda for prompt execution and tracking.</p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleCreateSubmit} className="space-y-4 pt-4 text-xs">
                
                {/* 1. Action Type Selection (Visit vs Call) */}
                <div>
                  <label className="block font-semibold text-slate-700 mb-1.5">
                    Select Activity Type <span className="text-rose-500">*</span>
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, action_type: 'call' }))}
                      className={`flex items-center justify-center gap-2 p-3 rounded-2xl border text-xs font-bold transition-all cursor-pointer ${
                        formData.action_type === 'call'
                          ? 'bg-sky-50 border-sky-600 text-sky-800 shadow-xs ring-2 ring-sky-600/20'
                          : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      <PhoneCall className="w-4 h-4 text-sky-600" />
                      <span>Phone Call</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, action_type: 'visit' }))}
                      className={`flex items-center justify-center gap-2 p-3 rounded-2xl border text-xs font-bold transition-all cursor-pointer ${
                        formData.action_type === 'visit'
                          ? 'bg-teal-50 border-teal-700 text-teal-800 shadow-xs ring-2 ring-teal-700/20'
                          : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      <MapPin className="w-4 h-4 text-teal-700" />
                      <span>Clinic Visit</span>
                    </button>
                  </div>
                </div>

                {/* 2. Contact Target (Registered Doctor vs Custom) */}
                <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200/70 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-800">Whom to Visit or Call?</span>
                    <div className="flex items-center gap-2 text-[11px]">
                      <label className="flex items-center gap-1 cursor-pointer">
                        <input
                          type="radio"
                          name="contact_mode"
                          checked={formData.contact_mode === 'doctor'}
                          onChange={() => setFormData(prev => ({ ...prev, contact_mode: 'doctor' }))}
                          className="text-teal-700 focus:ring-teal-700"
                        />
                        <span className="font-medium text-slate-700">Doctor</span>
                      </label>
                      <label className="flex items-center gap-1 cursor-pointer">
                        <input
                          type="radio"
                          name="contact_mode"
                          checked={formData.contact_mode === 'custom'}
                          onChange={() => setFormData(prev => ({ ...prev, contact_mode: 'custom' }))}
                          className="text-teal-700 focus:ring-teal-700"
                        />
                        <span className="font-medium text-slate-700">Chemist / Other</span>
                      </label>
                    </div>
                  </div>

                  {formData.contact_mode === 'doctor' ? (
                    <div>
                      <select
                        value={formData.doctor_id}
                        onChange={(e) => setFormData(prev => ({ ...prev, doctor_id: e.target.value }))}
                        className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-teal-600/20 focus:border-teal-700 cursor-pointer"
                        required
                      >
                        <option value="">-- Select Doctor from Your List ({doctors.length} available) --</option>
                        {doctors.map(d => (
                          <option key={d.id} value={d.id}>
                            {d.name} ({d.specialization}) - {d.clinic_hospital_name}
                          </option>
                        ))}
                      </select>

                      {selectedDoctorObj && (
                        <div className="mt-2 bg-white p-2.5 rounded-xl border border-slate-200 text-[11px] text-slate-600 space-y-0.5">
                          <p><span className="font-semibold text-slate-800">Clinic:</span> {selectedDoctorObj.clinic_hospital_name}</p>
                          {selectedDoctorObj.phone && <p><span className="font-semibold text-slate-800">Phone:</span> {selectedDoctorObj.phone}</p>}
                          {selectedDoctorObj.visiting_hours && <p><span className="font-semibold text-slate-800">Visiting Hours:</span> {selectedDoctorObj.visiting_hours}</p>}
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <div>
                        <input
                          type="text"
                          placeholder="e.g. Apollo Pharmacy / City Medico"
                          value={formData.custom_contact_name}
                          onChange={(e) => setFormData(prev => ({ ...prev, custom_contact_name: e.target.value }))}
                          className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-teal-600/20 focus:border-teal-700"
                          required
                        />
                      </div>
                      <div>
                        <select
                          value={formData.contact_type}
                          onChange={(e) => setFormData(prev => ({ ...prev, contact_type: e.target.value }))}
                          className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-teal-600/20 focus:border-teal-700 cursor-pointer"
                        >
                          <option value="chemist">Chemist / Pharmacy</option>
                          <option value="hospital">Hospital Desk / Purchase</option>
                          <option value="stockist">Stockist / Distributor</option>
                        </select>
                      </div>
                    </div>
                  )}
                </div>

                {/* 3. Date & Time */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Date</label>
                    <input
                      type="date"
                      value={formData.scheduled_date}
                      onChange={(e) => setFormData(prev => ({ ...prev, scheduled_date: e.target.value }))}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-teal-600/20 focus:border-teal-700"
                      required
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Preferred Time Slot</label>
                    <input
                      type="text"
                      placeholder="e.g. Morning OPD (10:30 AM)"
                      value={formData.scheduled_time}
                      onChange={(e) => setFormData(prev => ({ ...prev, scheduled_time: e.target.value }))}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-teal-600/20 focus:border-teal-700"
                    />
                  </div>
                </div>

                {/* 4. Priority */}
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Priority Level</label>
                  <div className="flex items-center gap-2">
                    {['high', 'normal', 'low'].map(p => (
                      <button
                        key={p}
                        type="button"
                        onClick={() => setFormData(prev => ({ ...prev, priority: p }))}
                        className={`flex-1 py-1.5 rounded-xl border font-bold capitalize text-xs transition-all cursor-pointer ${
                          formData.priority === p 
                            ? (p === 'high' ? 'bg-rose-50 border-rose-600 text-rose-700 ring-1 ring-rose-500' : 'bg-slate-900 border-slate-900 text-white')
                            : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                        }`}
                      >
                        {p}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 5. Purpose & Quick Product Tags */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="font-semibold text-slate-700">
                      Detailing Purpose / Agenda <span className="text-rose-500">*</span>
                    </label>
                    <span className="text-[11px] text-slate-400">Click product to tag:</span>
                  </div>

                  {products.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-2 max-h-16 overflow-y-auto p-1 bg-slate-50 rounded-xl border border-slate-100">
                      {products.slice(0, 8).map(prod => (
                        <button
                          key={prod.id}
                          type="button"
                          onClick={() => addProductToPurpose(prod.brand_name)}
                          className="text-[10px] font-semibold bg-white hover:bg-teal-50 text-slate-700 hover:text-teal-800 border border-slate-200 px-2 py-0.5 rounded-md cursor-pointer transition-colors shadow-2xs"
                        >
                          + {prod.brand_name}
                        </button>
                      ))}
                    </div>
                  )}

                  <textarea
                    rows="2"
                    placeholder="e.g. Detailing Ciplox 500 & Rosucipl; follow up on prescription feedback..."
                    value={formData.purpose}
                    onChange={(e) => setFormData(prev => ({ ...prev, purpose: e.target.value }))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs focus:ring-2 focus:ring-teal-600/20 focus:border-teal-700"
                    required
                  />
                </div>

                {/* 6. Notes */}
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Internal Notes (Optional)</label>
                  <input
                    type="text"
                    placeholder="e.g. Doctor prefers evening OPD after 6 PM"
                    value={formData.notes}
                    onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-teal-600/20 focus:border-teal-700"
                  />
                </div>

                {/* Form Buttons */}
                <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setIsCreateModalOpen(false)}
                    className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-semibold cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-5 py-2 rounded-xl bg-teal-700 hover:bg-teal-800 text-white font-bold shadow-xs transition-all cursor-pointer disabled:opacity-50"
                  >
                    {isSubmitting ? 'Scheduling...' : 'Save to Schedule'}
                  </button>
                </div>
              </form>

            </div>
          </div>
        )}

        {/* Modal 2: Mark as Visited / Called Outcome Drawer */}
        {outcomeModalSchedule && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
            <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-xl border border-slate-100">
              
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2.5">
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                    outcomeModalSchedule.action_type === 'call' ? 'bg-sky-100 text-sky-700' : 'bg-teal-100 text-teal-800'
                  }`}>
                    {outcomeModalSchedule.action_type === 'call' ? <PhoneCall className="w-4 h-4" /> : <CheckCircle2 className="w-4 h-4" />}
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-slate-900">
                      Mark as {outcomeModalSchedule.action_type === 'call' ? 'Called' : 'Visited'}
                    </h3>
                    <p className="text-[11px] text-slate-500">
                      {outcomeModalSchedule.doctor?.name || outcomeModalSchedule.custom_contact_name}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setOutcomeModalSchedule(null)}
                  className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-4 pt-3 text-xs">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1.5">
                    Quick Outcome Presets (Tap to select)
                  </label>
                  <div className="space-y-1.5">
                    {(outcomeModalSchedule.action_type === 'call' ? CALL_OUTCOMES : VISIT_OUTCOMES).map((outcome, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setOutcomeNote(outcome)}
                        className={`w-full text-left p-2 rounded-xl text-xs transition-colors border cursor-pointer ${
                          outcomeNote === outcome 
                            ? 'bg-emerald-50 border-emerald-400 text-emerald-900 font-semibold' 
                            : 'bg-slate-50 border-slate-200/80 text-slate-700 hover:bg-slate-100'
                        }`}
                      >
                        {outcome}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Outcome Feedback / Discussion Notes
                  </label>
                  <textarea
                    rows="3"
                    placeholder="Add notes on doctor's feedback, prescription commitments, or follow-up needs..."
                    value={outcomeNote}
                    onChange={(e) => setOutcomeNote(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs focus:ring-2 focus:ring-teal-600/20 focus:border-teal-700"
                  />
                </div>

                <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setOutcomeModalSchedule(null)}
                    className="px-3.5 py-1.5 rounded-xl text-slate-600 hover:bg-slate-100 font-medium cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    disabled={isSubmitting}
                    onClick={() => handleStatusUpdate(outcomeModalSchedule.id, 'completed', outcomeNote)}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold shadow-xs cursor-pointer disabled:opacity-50"
                  >
                    <Check className="w-4 h-4 stroke-[2.5]" />
                    <span>Confirm Completion</span>
                  </button>
                </div>
              </div>

            </div>
          </div>
        )}

        {/* Modal 3: Reschedule Modal */}
        {rescheduleItem && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
            <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-xl border border-slate-100">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <h3 className="text-base font-bold text-slate-900">Reschedule Activity</h3>
                <button
                  type="button"
                  onClick={() => setRescheduleItem(null)}
                  className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleRescheduleSubmit} className="space-y-3 pt-3 text-xs">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">New Date</label>
                  <input
                    type="date"
                    value={rescheduleDate}
                    onChange={(e) => setRescheduleDate(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-teal-600/20 focus:border-teal-700"
                    required
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">New Time Slot</label>
                  <input
                    type="text"
                    value={rescheduleTime}
                    onChange={(e) => setRescheduleTime(e.target.value)}
                    placeholder="e.g. Tomorrow Evening OPD (06:00 PM)"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-teal-600/20 focus:border-teal-700"
                  />
                </div>

                <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setRescheduleItem(null)}
                    className="px-3 py-1.5 rounded-xl text-slate-600 hover:bg-slate-100 font-medium cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-4 py-1.5 rounded-xl bg-teal-700 hover:bg-teal-800 text-white font-bold cursor-pointer disabled:opacity-50"
                  >
                    Save Reschedule
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

      </div>
    </MRLayout>
  );
}
