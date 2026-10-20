import { useState, useEffect, useMemo } from 'react';
import { router, Link } from '@inertiajs/react';
import axios from 'axios';
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
  MessageSquare,
  Gift,
  Edit2,
  Layers,
  ArrowRight
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

const FEEDBACK_OPTIONS = [
  { value: 'highly_interested', label: 'High Interest (Core Prescriber)', color: 'text-emerald-700 bg-emerald-50' },
  { value: 'regular_prescriber', label: 'Regular Prescriber', color: 'text-teal-700 bg-teal-50' },
  { value: 'trial_prescriber', label: 'Agreed for Clinical Trial', color: 'text-indigo-700 bg-indigo-50' },
  { value: 'neutral', label: 'Neutral / Follow-up Needed', color: 'text-amber-700 bg-amber-50' },
  { value: 'negative', label: 'Price / Molecule Objection', color: 'text-rose-700 bg-rose-50' }
];

const CALL_TYPES = [
  { value: 'routine_detailing', label: 'Routine Detailing Call' },
  { value: 'new_product_launch', label: 'New Product Launch' },
  { value: 'sample_delivery', label: 'Sample & Input Handover' },
  { value: 'cme_invite', label: 'CME / Symposium Invitation' },
  { value: 'follow_up', label: 'Follow-up Call' }
];

export default function Visits({ 
  schedules = [], 
  metrics = {}, 
  doctors = [], 
  products = [], 
  todayDate = '', 
  filters = {}, 
  initialFilters = {} 
}) {
  // Top-level View: 'planner' (Daily Calls & Visits Checklist) vs 'detailing' (Full DCR & Samples History)
  const [activeView, setActiveView] = useState(filters.view || 'planner');

  // Planner Tab & Filters
  const [plannerTab, setPlannerTab] = useState(filters.tab || 'today');
  const [actionFilter, setActionFilter] = useState(filters.action_type || 'all');
  const [statusFilter, setStatusFilter] = useState(filters.status || 'all');
  const [plannerSearch, setPlannerSearch] = useState(filters.search || '');

  // Modals state (Planner)
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
  const [outcomeModalSchedule, setOutcomeModalSchedule] = useState(null);
  const [outcomeNote, setOutcomeNote] = useState('');
  const [rescheduleItem, setRescheduleItem] = useState(null);
  const [rescheduleDate, setRescheduleDate] = useState('');
  const [rescheduleTime, setRescheduleTime] = useState('');
  const [isPlannerSubmitting, setIsPlannerSubmitting] = useState(false);

  // Planner Create Form
  const [scheduleForm, setScheduleForm] = useState({
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

  // Detailing / DCR State
  const [visits, setVisits] = useState([]);
  const [visitsMeta, setVisitsMeta] = useState(null);
  const [visitsLoading, setVisitsLoading] = useState(false);
  const [dcrStatusFilter, setDcrStatusFilter] = useState(initialFilters.status || 'all');
  const [dcrDateFilter, setDcrDateFilter] = useState(initialFilters.date || 'all');
  const [dcrDoctorFilter, setDcrDoctorFilter] = useState(initialFilters.doctor_id || 'all');
  const [dcrSearch, setDcrSearch] = useState('');

  // Modals state (Detailing / DCR)
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [editingVisit, setEditingVisit] = useState(null);
  const [isDcrSubmitting, setIsDcrSubmitting] = useState(false);
  const [detailForm, setDetailForm] = useState({
    doctor_id: '',
    visit_date: todayDate || new Date().toISOString().split('T')[0],
    visit_time: '11:00 AM',
    call_type: 'routine_detailing',
    status: 'completed',
    products_detailed: ['Ciplox 500'],
    doctor_feedback: 'regular_prescriber',
    samples_given: '',
    remarks: '',
    next_visit_date: ''
  });

  // Fetch Detailing Visits from REST API
  const fetchDetailingVisits = async () => {
    setVisitsLoading(true);
    try {
      const res = await axios.get('/api/v1/mr/visits', {
        params: {
          status: dcrStatusFilter,
          date: dcrDateFilter,
          doctor_id: dcrDoctorFilter,
          search: dcrSearch
        }
      });
      if (res.data?.success) {
        setVisits(res.data.data || []);
        setVisitsMeta(res.data.meta || {});
      }
    } catch (err) {
      console.error(err);
    } finally {
      setVisitsLoading(false);
    }
  };

  useEffect(() => {
    if (activeView === 'detailing') {
      fetchDetailingVisits();
    }
  }, [activeView, dcrStatusFilter, dcrDateFilter, dcrDoctorFilter, dcrSearch]);

  // Client-side filtering for Planner
  const filteredSchedules = useMemo(() => {
    return schedules.filter(item => {
      if (actionFilter !== 'all' && item.action_type !== actionFilter) return false;
      if (statusFilter !== 'all' && item.status !== statusFilter) return false;
      if (plannerSearch.trim()) {
        const q = plannerSearch.toLowerCase();
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
  }, [schedules, actionFilter, statusFilter, plannerSearch]);

  // Planner Tab Change (Inertia fetch)
  const handlePlannerTabChange = (newTab) => {
    setPlannerTab(newTab);
    router.get('/mr/visits', {
      tab: newTab,
      action_type: actionFilter,
      status: statusFilter,
      search: plannerSearch,
      view: 'planner'
    }, { preserveState: true, preserveScroll: true });
  };

  // Open Outcome Modal
  const openOutcomeModal = (schedule) => {
    setOutcomeModalSchedule(schedule);
    setOutcomeNote(schedule.outcome_note || '');
  };

  // 1-Click Update Planner Status (Mark as Called / Visited)
  const handlePlannerStatusUpdate = (scheduleId, status, customOutcomeNote = null) => {
    setIsPlannerSubmitting(true);
    router.put(`/mr/schedule/${scheduleId}/status`, {
      status,
      outcome_note: customOutcomeNote !== null ? customOutcomeNote : outcomeNote
    }, {
      preserveScroll: true,
      onSuccess: () => {
        setIsPlannerSubmitting(false);
        setOutcomeModalSchedule(null);
        setOutcomeNote('');
        toast.success(status === 'completed' ? 'Marked as completed!' : `Status updated to ${status}`);
      },
      onError: () => {
        setIsPlannerSubmitting(false);
        toast.error('Failed to update status.');
      }
    });
  };

  // Reschedule Planner item
  const handleRescheduleSubmit = (e) => {
    e.preventDefault();
    if (!rescheduleItem || !rescheduleDate) return;
    setIsPlannerSubmitting(true);
    router.put(`/mr/schedule/${rescheduleItem.id}/status`, {
      status: 'rescheduled',
      new_date: rescheduleDate,
      new_time: rescheduleTime
    }, {
      preserveScroll: true,
      onSuccess: () => {
        setIsPlannerSubmitting(false);
        setRescheduleItem(null);
        setRescheduleDate('');
        setRescheduleTime('');
        toast.success('Rescheduled successfully!');
      },
      onError: () => {
        setIsPlannerSubmitting(false);
        toast.error('Failed to reschedule.');
      }
    });
  };

  // Delete Planner item
  const handlePlannerDelete = (scheduleId) => {
    if (!confirm('Are you sure you want to remove this item from your schedule?')) return;
    router.delete(`/mr/schedule/${scheduleId}`, {
      preserveScroll: true,
      onSuccess: () => toast.success('Schedule item removed.'),
      onError: () => toast.error('Failed to remove item.')
    });
  };

  // Create Planner item Submit
  const handleScheduleSubmit = (e) => {
    e.preventDefault();
    if (scheduleForm.contact_mode === 'doctor' && !scheduleForm.doctor_id) {
      toast.error('Please select a doctor.');
      return;
    }
    if (scheduleForm.contact_mode === 'custom' && !scheduleForm.custom_contact_name.trim()) {
      toast.error('Please enter the contact name.');
      return;
    }
    if (!scheduleForm.purpose.trim()) {
      toast.error('Please specify the discussion purpose.');
      return;
    }

    setIsPlannerSubmitting(true);
    router.post('/mr/schedule', {
      doctor_id: scheduleForm.contact_mode === 'doctor' ? scheduleForm.doctor_id : null,
      custom_contact_name: scheduleForm.contact_mode === 'custom' ? scheduleForm.custom_contact_name : null,
      contact_type: scheduleForm.contact_mode === 'doctor' ? 'doctor' : scheduleForm.contact_type,
      action_type: scheduleForm.action_type,
      scheduled_date: scheduleForm.scheduled_date,
      scheduled_time: scheduleForm.scheduled_time,
      priority: scheduleForm.priority,
      purpose: scheduleForm.purpose,
      notes: scheduleForm.notes
    }, {
      preserveScroll: true,
      onSuccess: () => {
        setIsPlannerSubmitting(false);
        setIsScheduleModalOpen(false);
        setScheduleForm({
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
      onError: (errs) => {
        setIsPlannerSubmitting(false);
        toast.error(Object.values(errs)[0] || 'Failed to save schedule.');
      }
    });
  };

  // Open Detailing Modal for a Doctor (Seamlessly transitions from Planner or Detailing tab)
  const openDetailingModal = (docId = '', presetProducts = []) => {
    const defaultDocId = docId || (doctors[0]?.id ? String(doctors[0].id) : '');
    setEditingVisit(null);
    setDetailForm({
      doctor_id: defaultDocId,
      visit_date: todayDate || new Date().toISOString().split('T')[0],
      visit_time: '11:00 AM',
      call_type: 'routine_detailing',
      status: 'completed',
      products_detailed: presetProducts.length > 0 ? presetProducts : (products[0]?.brand_name ? [products[0].brand_name] : ['CiplonPara 650']),
      doctor_feedback: 'regular_prescriber',
      samples_given: '',
      remarks: '',
      next_visit_date: ''
    });
    setDetailModalOpen(true);
  };

  // Submit Detailing & Samples Record
  const handleSubmitDetailing = async (e) => {
    e.preventDefault();
    if (!detailForm.doctor_id) {
      toast.error('Please select a doctor.');
      return;
    }
    setIsDcrSubmitting(true);
    try {
      if (editingVisit) {
        const res = await axios.put(`/api/v1/mr/visits/${editingVisit.id}`, detailForm);
        if (res.data?.success) {
          toast.success('Detailing log updated!');
          setDetailModalOpen(false);
          fetchDetailingVisits();
        }
      } else {
        const res = await axios.post('/api/v1/mr/visits', detailForm);
        if (res.data?.success) {
          toast.success('Detailing & samples recorded successfully!');
          setDetailModalOpen(false);
          setActiveView('detailing');
          fetchDetailingVisits();
        }
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error saving detailing log.');
    } finally {
      setIsDcrSubmitting(false);
    }
  };

  // Delete Detailing Log
  const handleDeleteDetailing = async (visitId) => {
    if (!confirm('Are you sure you want to delete this detailing log?')) return;
    try {
      const res = await axios.delete(`/api/v1/mr/visits/${visitId}`);
      if (res.data?.success) {
        toast.success('Detailing log removed.');
        fetchDetailingVisits();
      }
    } catch {
      toast.error('Failed to remove log.');
    }
  };

  // Helper: toggle product tag in detailing modal
  const toggleDetailProduct = (brand) => {
    const list = detailForm.products_detailed || [];
    if (list.includes(brand)) {
      setDetailForm(prev => ({ ...prev, products_detailed: list.filter(p => p !== brand) }));
    } else {
      setDetailForm(prev => ({ ...prev, products_detailed: [...list, brand] }));
    }
  };

  // Helper for tagging product in planner purpose
  const addProductToPurpose = (brandName) => {
    setScheduleForm(prev => ({
      ...prev,
      purpose: prev.purpose ? `${prev.purpose}, ${brandName}` : `Detailing ${brandName}`
    }));
  };

  return (
    <MRLayout title="Visits & Daily Planner">
      <div className="space-y-6">

        {/* Unified Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200/80">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
              <CalendarClock className="w-4 h-4 text-slate-700" />
              <span>Field Operations</span>
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-slate-100 text-slate-700 border border-slate-200">
                {todayDate ? new Date(todayDate).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' }) : 'Today'}
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-semibold tracking-tight text-slate-800">
              Visits & Daily Planner
            </h1>
            <p className="text-xs text-slate-500 font-normal mt-0.5">
              Plan scheduled calls and clinic visits, check off completed interactions, and record product detailing logs.
            </p>
          </div>

          {/* Primary Action Button according to active view */}
          <div className="flex items-center gap-2.5 shrink-0">
            {activeView === 'planner' ? (
              <button
                type="button"
                onClick={() => setIsScheduleModalOpen(true)}
                className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-medium transition-colors cursor-pointer"
              >
                <Plus className="w-4 h-4 stroke-[2]" />
                <span>Schedule Call or Visit</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={() => openDetailingModal()}
                className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-medium transition-colors cursor-pointer"
              >
                <Plus className="w-4 h-4 stroke-[2]" />
                <span>Log Detailing & Samples</span>
              </button>
            )}
          </div>
        </div>

        {/* Top-Level Segmented Mode Switcher */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-2 rounded-2xl border border-slate-200/80">
          <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl w-full sm:w-auto">
            <button
              type="button"
              onClick={() => setActiveView('planner')}
              className={`flex items-center justify-center gap-2 px-4 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                activeView === 'planner'
                  ? 'bg-white text-slate-900 font-semibold shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900 font-normal'
              }`}
            >
              <CalendarClock className={`w-3.5 h-3.5 ${activeView === 'planner' ? 'text-slate-900 stroke-[2]' : 'text-slate-400'}`} />
              <span>Daily Calls & Planner</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-md font-semibold ${
                activeView === 'planner' ? 'bg-slate-100 text-slate-800' : 'bg-slate-200/70 text-slate-600'
              }`}>
                {metrics.today_total || 0} Today
              </span>
            </button>

            <button
              type="button"
              onClick={() => setActiveView('detailing')}
              className={`flex items-center justify-center gap-2 px-4 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                activeView === 'detailing'
                  ? 'bg-white text-slate-900 font-semibold shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900 font-normal'
              }`}
            >
              <Stethoscope className={`w-3.5 h-3.5 ${activeView === 'detailing' ? 'text-slate-900 stroke-[2]' : 'text-slate-400'}`} />
              <span>Detailing & Sample Logs</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-md font-semibold ${
                activeView === 'detailing' ? 'bg-slate-100 text-slate-800' : 'bg-slate-200/70 text-slate-600'
              }`}>
                DCR Logs
              </span>
            </button>
          </div>

          <div className="text-[11px] text-slate-400 px-2 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span>
              {activeView === 'planner' 
                ? 'Check off calls & visits as you complete them on the road' 
                : 'Clinical detailing history and physician sample disbursements'}
            </span>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* VIEW 1: DAILY CALLS & PLANNER                                             */}
        {/* ========================================================================= */}
        {activeView === 'planner' && (
          <div className="space-y-6">
            
            {/* Today's Execution Gauge & Counters */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {/* Main Gauge Card */}
              <div className="md:col-span-2 bg-slate-900 text-white p-5 rounded-2xl border border-slate-800 relative overflow-hidden flex flex-col justify-between">
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-medium text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                      <TrendingUp className="w-3.5 h-3.5 text-emerald-400" /> Today's Execution Rate
                    </span>
                    <span className="text-xs font-semibold bg-emerald-500/20 text-emerald-300 px-2.5 py-0.5 rounded-full border border-emerald-500/30">
                      {metrics.today_completed || 0} of {metrics.today_total || 0} Done
                    </span>
                  </div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-extrabold tracking-tight">{metrics.completion_rate || 0}%</span>
                    <span className="text-xs text-slate-400 font-normal">
                      {metrics.today_pending > 0 
                        ? `${metrics.today_pending} action${metrics.today_pending > 1 ? 's' : ''} remaining today`
                        : (metrics.today_total > 0 ? 'All scheduled items completed! Great work!' : 'No items scheduled for today yet')}
                    </span>
                  </div>
                </div>

                <div className="relative z-10 mt-4">
                  <div className="w-full h-2.5 bg-slate-800 rounded-full overflow-hidden p-0.5 border border-slate-700">
                    <div 
                      className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                      style={{ width: `${Math.min(100, Math.max(metrics.completion_rate || 0, metrics.today_total === 0 ? 0 : 5))}%` }}
                    />
                  </div>
                </div>

                <div className="absolute -right-6 -bottom-8 w-32 h-32 rounded-full bg-emerald-500/5 pointer-events-none" />
              </div>

              {/* Planned Visits Card */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200/80 flex items-center justify-between">
                <div>
                  <span className="text-xs font-medium text-slate-500 block">
                    Clinic Visits Planned
                  </span>
                  <span className="text-2xl font-semibold text-slate-800 mt-1 block">
                    {metrics.today_visits || 0}
                  </span>
                  <span className="text-[11px] text-slate-400 font-normal flex items-center gap-1 mt-0.5">
                    <MapPin className="w-3 h-3 text-slate-400" /> In-person clinic visits
                  </span>
                </div>
                <div className="w-9 h-9 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center shrink-0">
                  <Stethoscope className="w-4 h-4 stroke-[2]" />
                </div>
              </div>

              {/* Planned Calls Card */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200/80 flex items-center justify-between">
                <div>
                  <span className="text-xs font-medium text-slate-500 block">
                    Phone Calls Planned
                  </span>
                  <span className="text-2xl font-semibold text-slate-800 mt-1 block">
                    {metrics.today_calls || 0}
                  </span>
                  <span className="text-[11px] text-slate-400 font-normal flex items-center gap-1 mt-0.5">
                    <PhoneCall className="w-3 h-3 text-slate-400" /> Telephonic reminders
                  </span>
                </div>
                <div className="w-9 h-9 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center shrink-0">
                  <Phone className="w-4 h-4 stroke-[2]" />
                </div>
              </div>
            </div>

            {/* Sub-Tabs & Filter Bar */}
            <div className="bg-white rounded-2xl border border-slate-200/80 p-4 space-y-3">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                
                {/* View Sub-Tabs */}
                <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl w-full md:w-auto overflow-x-auto">
                  <button
                    type="button"
                    onClick={() => handlePlannerTabChange('today')}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer whitespace-nowrap ${
                      plannerTab === 'today'
                        ? 'bg-white text-slate-900 font-semibold shadow-2xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <span>Today's Agenda</span>
                    <span className={`text-[10px] px-1.5 py-0.2 rounded-md font-semibold ${
                      plannerTab === 'today' ? 'bg-slate-100 text-slate-900' : 'bg-slate-200/70 text-slate-600'
                    }`}>
                      {metrics.today_total || 0}
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handlePlannerTabChange('upcoming')}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer whitespace-nowrap ${
                      plannerTab === 'upcoming'
                        ? 'bg-white text-slate-900 font-semibold shadow-2xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <span>Upcoming</span>
                    <span className={`text-[10px] px-1.5 py-0.2 rounded-md font-semibold ${
                      plannerTab === 'upcoming' ? 'bg-slate-100 text-slate-900' : 'bg-slate-200/70 text-slate-600'
                    }`}>
                      {metrics.upcoming_count || 0}
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handlePlannerTabChange('history')}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer whitespace-nowrap ${
                      plannerTab === 'history'
                        ? 'bg-white text-slate-900 font-semibold shadow-2xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <span>Past History</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handlePlannerTabChange('all')}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer whitespace-nowrap ${
                      plannerTab === 'all'
                        ? 'bg-white text-slate-900 font-semibold shadow-2xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <span>All</span>
                  </button>
                </div>

                {/* Instant Search Bar */}
                <div className="relative w-full md:w-72">
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="text"
                    placeholder="Search doctor, clinic, purpose..."
                    value={plannerSearch}
                    onChange={(e) => setPlannerSearch(e.target.value)}
                    className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200/80 rounded-xl focus:bg-white focus:outline-hidden focus:ring-1 focus:ring-slate-900 focus:border-slate-900 transition-all text-slate-800"
                  />
                  {plannerSearch && (
                    <button
                      type="button"
                      onClick={() => setPlannerSearch('')}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>

              {/* Action & Status Filters */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-100 text-xs">
                <div className="flex items-center gap-1.5 overflow-x-auto">
                  <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider shrink-0">
                    Type:
                  </span>
                  <button
                    type="button"
                    onClick={() => setActionFilter('all')}
                    className={`px-2.5 py-1 rounded-lg text-xs font-medium cursor-pointer transition-colors ${
                      actionFilter === 'all' ? 'bg-slate-900 text-white font-semibold' : 'bg-slate-100 text-slate-600 hover:bg-slate-200/70'
                    }`}
                  >
                    All Actions
                  </button>
                  <button
                    type="button"
                    onClick={() => setActionFilter('visit')}
                    className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium cursor-pointer transition-colors ${
                      actionFilter === 'visit' ? 'bg-slate-900 text-white font-semibold' : 'bg-slate-100 text-slate-600 hover:bg-slate-200/70'
                    }`}
                  >
                    <MapPin className="w-3 h-3 text-violet-600" /> Visits Only
                  </button>
                  <button
                    type="button"
                    onClick={() => setActionFilter('call')}
                    className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium cursor-pointer transition-colors ${
                      actionFilter === 'call' ? 'bg-slate-900 text-white font-semibold' : 'bg-slate-100 text-slate-600 hover:bg-slate-200/70'
                    }`}
                  >
                    <Phone className="w-3 h-3 text-sky-600" /> Calls Only
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">
                    Status:
                  </span>
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="bg-slate-50 border border-slate-200/80 text-slate-700 text-xs rounded-xl px-2.5 py-1 focus:outline-hidden focus:ring-1 focus:ring-slate-900 focus:border-slate-900 cursor-pointer"
                  >
                    <option value="all">All Status</option>
                    <option value="pending">Pending</option>
                    <option value="completed">Completed</option>
                    <option value="missed">Missed</option>
                  </select>
                </div>
              </div>
            </div>

            {/* List of Scheduled Items */}
            <div className="space-y-3">
              {filteredSchedules.length === 0 ? (
                <div className="bg-white rounded-2xl border border-slate-200/80 p-12 text-center">
                  <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center mx-auto mb-3">
                    <CalendarClock className="w-5 h-5 stroke-[1.8]" />
                  </div>
                  <h3 className="text-sm font-semibold text-slate-800 mb-1">No Scheduled Items Found</h3>
                  <p className="text-xs text-slate-400 max-w-sm mx-auto mb-4 font-normal">
                    {plannerSearch || actionFilter !== 'all' || statusFilter !== 'all'
                      ? 'No items match your active filters. Try clearing filters or searching for something else.'
                      : `You have no calls or visits planned in the '${plannerTab}' view.`}
                  </p>
                  <button
                    type="button"
                    onClick={() => setIsScheduleModalOpen(true)}
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-slate-900 text-white text-xs font-medium hover:bg-slate-800 transition-colors cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5 stroke-[2]" />
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
                      className={`bg-white rounded-2xl border transition-colors p-4 sm:p-5 ${
                        isCompleted 
                          ? 'border-emerald-200 bg-emerald-50/20' 
                          : isMissed 
                            ? 'border-rose-200 bg-rose-50/20'
                            : 'border-slate-200/80 hover:border-slate-300'
                      }`}
                    >
                      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                        
                        {/* Left Details */}
                        <div className="flex items-start gap-3.5 min-w-0 flex-1">
                          <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                            isCompleted
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-100'
                              : isCall
                                ? 'bg-sky-50 text-sky-700 border border-sky-100'
                                : 'bg-slate-100 text-slate-700 border border-slate-200/60'
                          }`}>
                            {isCompleted ? (
                              <CheckCheck className="w-4 h-4 stroke-[2]" />
                            ) : isCall ? (
                              <PhoneCall className="w-4 h-4 stroke-[2]" />
                            ) : (
                              <MapPin className="w-4 h-4 stroke-[2]" />
                            )}
                          </div>

                          <div className="min-w-0 flex-1">
                            <div className="flex flex-wrap items-center gap-2 mb-1">
                              <span className={`text-[10px] uppercase font-semibold px-2 py-0.5 rounded-md ${
                                isCall 
                                  ? 'bg-sky-50 text-sky-700 border border-sky-100' 
                                  : 'bg-slate-100 text-slate-700 border border-slate-200/70'
                              }`}>
                                {isCall ? 'Phone Call' : 'Clinic Visit'}
                              </span>

                              {item.priority === 'high' && (
                                <span className="text-[10px] uppercase font-semibold px-2 py-0.5 rounded-md bg-rose-50 text-rose-700 border border-rose-100">
                                  High Priority
                                </span>
                              )}

                              <span className="inline-flex items-center gap-1 text-[11px] text-slate-500 font-normal bg-slate-50 px-2 py-0.5 rounded-md border border-slate-100">
                                <Clock className="w-3 h-3 text-slate-400" />
                                <span>{item.scheduled_time || 'Anytime'}</span>
                                {plannerTab !== 'today' && (
                                  <span className="text-slate-400 font-normal">
                                    • {new Date(item.scheduled_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                  </span>
                                )}
                              </span>

                              {isCompleted && (
                                <span className="inline-flex items-center gap-1 text-[10px] uppercase font-semibold px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-100">
                                  <Check className="w-3 h-3 stroke-[2.5]" /> Completed
                                </span>
                              )}
                              {isMissed && (
                                <span className="text-[10px] uppercase font-semibold px-2 py-0.5 rounded-md bg-rose-50 text-rose-700 border border-rose-100">
                                  Missed
                                </span>
                              )}
                            </div>

                            <div className="flex items-center gap-2">
                              <h4 className="text-sm font-semibold text-slate-800 truncate">
                                {displayName}
                              </h4>
                              {doctor?.tier && (
                                <span className="text-[9px] uppercase font-semibold px-1.5 py-0.2 bg-slate-100 text-slate-700 border border-slate-200 rounded">
                                  {doctor.tier}
                                </span>
                              )}
                            </div>
                            <p className="text-xs text-slate-400 truncate mt-0.5 font-normal">
                              {subtitle}
                            </p>

                            {/* Purpose & Agenda */}
                            <div className="mt-2.5 bg-slate-50 rounded-xl p-2.5 border border-slate-100 text-xs">
                              <div className="flex items-start gap-1.5">
                                <FileText className="w-3.5 h-3.5 text-slate-500 shrink-0 mt-0.5" />
                                <div className="min-w-0 flex-1">
                                  <span className="font-semibold text-slate-700">Purpose: </span>
                                  <span className="text-slate-600 font-normal">{item.purpose}</span>
                                </div>
                              </div>
                              {item.notes && (
                                <p className="text-[11px] text-slate-400 mt-1 pl-5 italic">
                                  Note: {item.notes}
                                </p>
                              )}
                            </div>

                            {/* Outcome note display */}
                            {isCompleted && item.outcome_note && (
                              <div className="mt-2 bg-emerald-50/80 border border-emerald-100 rounded-xl p-2.5 text-xs text-emerald-900 flex items-start gap-2">
                                <MessageSquare className="w-3.5 h-3.5 text-emerald-700 shrink-0 mt-0.5" />
                                <div>
                                  <span className="font-semibold text-emerald-900">Outcome: </span>
                                  <span className="font-normal">{item.outcome_note}</span>
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

                        {/* Right Action Buttons */}
                        <div className="flex flex-wrap lg:flex-col items-end gap-2 shrink-0 pt-3 lg:pt-0 border-t lg:border-t-0 border-slate-100">
                          
                          {/* When Pending: Mark Called/Visited + Call now */}
                          {isPending && (
                            <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                              {phone && (
                                <a
                                  href={`tel:${phone}`}
                                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200/80 bg-white text-slate-700 hover:bg-slate-50 text-xs font-medium transition-colors cursor-pointer"
                                  title={`Dial ${phone}`}
                                >
                                  <Phone className="w-3.5 h-3.5 text-sky-600" />
                                  <span>Call {phone}</span>
                                </a>
                              )}

                              <button
                                type="button"
                                onClick={() => openOutcomeModal(item)}
                                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-medium text-white bg-slate-900 hover:bg-slate-800 transition-colors cursor-pointer"
                              >
                                <Check className="w-3.5 h-3.5 stroke-[2]" />
                                <span>{isCall ? 'Mark as Called' : 'Mark as Visited'}</span>
                              </button>

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

                              <button
                                type="button"
                                onClick={() => handlePlannerDelete(item.id)}
                                className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                                title="Delete"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          )}

                          {/* If Visit and doctor, fast link to Log In-Chamber Detailing & Samples */}
                          {!isCall && doctor && (
                            <button
                              type="button"
                              onClick={() => openDetailingModal(String(doctor.id))}
                              className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-700 hover:text-slate-900 bg-white hover:bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200/80 cursor-pointer mt-1 transition-colors"
                            >
                              <Pill className="w-3.5 h-3.5 text-slate-500" />
                              <span>Log Detailing & Samples</span>
                              <ChevronRight className="w-3 h-3 text-slate-400" />
                            </button>
                          )}

                          {/* When Completed: Edit outcome or Reopen */}
                          {isCompleted && (
                            <div className="flex items-center gap-2">
                              <button
                                type="button"
                                onClick={() => openOutcomeModal(item)}
                                className="text-[11px] font-medium text-emerald-800 hover:text-emerald-950 underline cursor-pointer"
                              >
                                Edit Outcome
                              </button>
                              <span className="text-slate-300">•</span>
                              <button
                                type="button"
                                onClick={() => handlePlannerStatusUpdate(item.id, 'pending')}
                                className="text-[11px] font-medium text-slate-500 hover:text-slate-800 cursor-pointer"
                              >
                                Reopen
                              </button>
                              <button
                                type="button"
                                onClick={() => handlePlannerDelete(item.id)}
                                className="p-1 rounded text-slate-400 hover:text-rose-600 hover:bg-rose-50 ml-1 cursor-pointer"
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

          </div>
        )}

        {/* ========================================================================= */}
        {/* VIEW 2: DETAILING & SAMPLE LOGS (DCR)                                      */}
        {/* ========================================================================= */}
        {activeView === 'detailing' && (
          <div className="space-y-6">
            
            {/* Detailing Filter Bar */}
            <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-xs space-y-3">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                <div className="relative w-full md:w-80">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="text"
                    placeholder="Search doctor, hospital, specialty..."
                    value={dcrSearch}
                    onChange={(e) => setDcrSearch(e.target.value)}
                    className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200/80 rounded-xl focus:bg-white focus:outline-hidden focus:ring-1 focus:ring-slate-900 focus:border-slate-900 text-slate-800"
                  />
                  {dcrSearch && (
                    <button
                      type="button"
                      onClick={() => setDcrSearch('')}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <select
                    value={dcrDateFilter}
                    onChange={(e) => setDcrDateFilter(e.target.value)}
                    className="bg-slate-50 border border-slate-200/80 text-slate-700 text-xs rounded-xl px-2.5 py-1.5 focus:outline-hidden focus:ring-1 focus:ring-slate-900 focus:border-slate-900 cursor-pointer"
                  >
                    <option value="all">All Dates</option>
                    <option value="today">Today's Visits</option>
                    <option value="upcoming">Upcoming</option>
                    <option value="past">Past History</option>
                  </select>

                  <select
                    value={dcrDoctorFilter}
                    onChange={(e) => setDcrDoctorFilter(e.target.value)}
                    className="bg-slate-50 border border-slate-200/80 text-slate-700 text-xs rounded-xl px-2.5 py-1.5 focus:outline-hidden focus:ring-1 focus:ring-slate-900 focus:border-slate-900 cursor-pointer max-w-[180px]"
                  >
                    <option value="all">All Doctors</option>
                    {doctors.map(d => (
                      <option key={d.id} value={d.id}>{d.name}</option>
                    ))}
                  </select>

                  <select
                    value={dcrStatusFilter}
                    onChange={(e) => setDcrStatusFilter(e.target.value)}
                    className="bg-slate-50 border border-slate-200/80 text-slate-700 text-xs rounded-xl px-2.5 py-1.5 focus:outline-hidden focus:ring-1 focus:ring-slate-900 focus:border-slate-900 cursor-pointer"
                  >
                    <option value="all">All Status</option>
                    <option value="completed">Completed Calls</option>
                    <option value="scheduled">Scheduled</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Detailing Logs List */}
            {visitsLoading ? (
              <div className="bg-white rounded-2xl border border-slate-200/80 p-12 text-center text-xs text-slate-500">
                <RefreshCw className="w-5 h-5 animate-spin text-slate-900 mx-auto mb-2" />
                <span>Loading detailing records...</span>
              </div>
            ) : visits.length === 0 ? (
              <div className="bg-white rounded-2xl border border-slate-200/80 p-12 text-center">
                <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center mx-auto mb-3">
                  <Stethoscope className="w-5 h-5 stroke-[1.8]" />
                </div>
                <h3 className="text-sm font-semibold text-slate-800 mb-1">No Detailing Records Found</h3>
                <p className="text-xs text-slate-400 max-w-sm mx-auto mb-4 font-normal">
                  Log the drugs pitched, free sample strips handed over, and prescriber commitment for your doctor visits.
                </p>
                <button
                  type="button"
                  onClick={() => openDetailingModal()}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-slate-900 text-white text-xs font-medium hover:bg-slate-800 transition-colors cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5 stroke-[2]" />
                  <span>Log Detailing & Samples</span>
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {visits.map((v) => {
                  const doc = v.doctor;
                  const feedbackObj = FEEDBACK_OPTIONS.find(f => f.value === v.doctor_feedback);
                  return (
                    <div 
                      key={v.id}
                      className="bg-white rounded-2xl border border-slate-200/80 hover:border-slate-300 p-4 sm:p-5 transition-colors"
                    >
                      <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                        
                        {/* Doctor info & Detailing content */}
                        <div className="flex items-start gap-3.5 min-w-0 flex-1">
                          <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center font-semibold text-xs shrink-0 border border-slate-200/60">
                            {doc?.name?.charAt(4) || 'D'}
                          </div>

                          <div className="min-w-0 flex-1">
                            <div className="flex flex-wrap items-center gap-2 mb-1">
                              <span className="text-[10px] uppercase font-semibold px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 border border-slate-200/70">
                                {v.call_type?.replace('_', ' ')?.toUpperCase() || 'ROUTINE DETAILING'}
                              </span>

                              <span className="text-[10px] uppercase font-semibold px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-100">
                                {v.status?.toUpperCase() || 'COMPLETED'}
                              </span>

                              <span className="inline-flex items-center gap-1 text-[11px] text-slate-500 font-normal bg-slate-50 px-2 py-0.5 rounded-md border border-slate-100">
                                <Calendar className="w-3 h-3 text-slate-400" />
                                <span>{v.visit_date}</span>
                                {v.visit_time && <span>• {v.visit_time}</span>}
                              </span>
                            </div>

                            <div className="flex items-center gap-2">
                              <h4 className="text-sm font-semibold text-slate-800 truncate">
                                {doc?.name}
                              </h4>
                              {doc?.qualification && (
                                <span className="text-[11px] text-slate-400">({doc.qualification})</span>
                              )}
                              {doc?.tier && (
                                <span className="text-[9px] uppercase font-semibold px-1.5 py-0.2 bg-slate-100 text-slate-700 border border-slate-200 rounded">
                                  {doc.tier}
                                </span>
                              )}
                            </div>
                            <p className="text-xs text-slate-400 truncate mt-0.5 font-normal">
                              {doc?.clinic_hospital_name} • {doc?.specialization}
                            </p>

                            {/* Products Detailed Tags */}
                            {Array.isArray(v.products_detailed) && v.products_detailed.length > 0 && (
                              <div className="mt-2.5 flex flex-wrap items-center gap-1.5">
                                <span className="text-[11px] font-medium text-slate-400">Formulations Detailed:</span>
                                {v.products_detailed.map((prod, idx) => (
                                  <span key={idx} className="inline-flex items-center gap-1 text-[10px] font-medium bg-slate-100 text-slate-700 border border-slate-200/80 px-2 py-0.5 rounded-md">
                                    <Pill className="w-2.5 h-2.5 text-slate-500" />
                                    <span>{prod}</span>
                                  </span>
                                ))}
                              </div>
                            )}

                            {/* Samples & Feedback details */}
                            <div className="mt-2.5 grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                              {feedbackObj && (
                                <div className="bg-slate-50 p-2 rounded-xl border border-slate-100 flex items-center gap-2">
                                  <span className="text-slate-400 font-normal">Physician Feedback:</span>
                                  <span className={`px-2 py-0.5 rounded-md font-semibold text-[10px] ${feedbackObj.color}`}>
                                    {feedbackObj.label}
                                  </span>
                                </div>
                              )}

                              {v.samples_given && (
                                <div className="bg-slate-50 p-2 rounded-xl border border-slate-100 flex items-center gap-2">
                                  <Gift className="w-3.5 h-3.5 text-slate-600 shrink-0" />
                                  <span className="text-slate-400 font-normal">Samples Provided:</span>
                                  <span className="text-slate-700 font-medium truncate">{v.samples_given}</span>
                                </div>
                              )}
                            </div>

                            {v.remarks && (
                              <p className="text-[11px] text-slate-500 mt-2 bg-slate-50 p-2 rounded-xl border border-slate-100 font-normal">
                                Remarks: {v.remarks}
                              </p>
                            )}

                            {v.next_visit_date && (
                              <p className="text-[11px] text-slate-600 font-medium mt-1.5 flex items-center gap-1">
                                <Calendar className="w-3 h-3 text-slate-400" />
                                <span>Follow-up Planned: {new Date(v.next_visit_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                              </p>
                            )}
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-2 shrink-0 pt-2 lg:pt-0 border-t lg:border-t-0 border-slate-100">
                          <button
                            type="button"
                            onClick={() => {
                              setEditingVisit(v);
                              setDetailForm({
                                doctor_id: String(v.doctor_id),
                                visit_date: v.visit_date,
                                visit_time: v.visit_time || '11:00 AM',
                                call_type: v.call_type || 'routine_detailing',
                                status: v.status || 'completed',
                                products_detailed: v.products_detailed || [],
                                doctor_feedback: v.doctor_feedback || 'regular_prescriber',
                                samples_given: v.samples_given || '',
                                remarks: v.remarks || '',
                                next_visit_date: v.next_visit_date || ''
                              });
                              setDetailModalOpen(true);
                            }}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-100 border border-slate-200 cursor-pointer"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                            <span>Edit Log</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => handleDeleteDetailing(v.id)}
                            className="p-1.5 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 border border-slate-200 cursor-pointer"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>

                      </div>
                    </div>
                  );
                })}
              </div>
            )}

          </div>
        )}

        {/* ========================================================================= */}
        {/* MODAL 1: SCHEDULE CALL OR CLINIC VISIT                                   */}
        {/* ========================================================================= */}
        {isScheduleModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs overflow-y-auto">
            <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-xl border border-slate-100 my-8">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <div>
                  <h3 className="text-lg font-bold text-slate-900">Schedule a Call or Clinic Visit</h3>
                  <p className="text-xs text-slate-500 mt-0.5">Add to your daily agenda for prompt field execution.</p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsScheduleModalOpen(false)}
                  className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleScheduleSubmit} className="space-y-4 pt-4 text-xs">
                {/* Action Type */}
                <div>
                  <label className="block font-semibold text-slate-700 mb-1.5">
                    Select Activity Type <span className="text-rose-500">*</span>
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setScheduleForm(prev => ({ ...prev, action_type: 'call' }))}
                      className={`flex items-center justify-center gap-2 p-3 rounded-2xl border text-xs font-bold transition-all cursor-pointer ${
                        scheduleForm.action_type === 'call'
                          ? 'bg-sky-50 border-sky-600 text-sky-800 shadow-xs ring-2 ring-sky-600/20'
                          : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      <PhoneCall className="w-4 h-4 text-sky-600" />
                      <span>Phone Call</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setScheduleForm(prev => ({ ...prev, action_type: 'visit' }))}
                      className={`flex items-center justify-center gap-2 p-3 rounded-2xl border text-xs font-semibold transition-colors cursor-pointer ${
                        scheduleForm.action_type === 'visit'
                          ? 'bg-slate-900 border-slate-900 text-white'
                          : 'border-slate-200/80 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      <MapPin className="w-4 h-4" />
                      <span>Clinic Visit</span>
                    </button>
                  </div>
                </div>

                {/* Whom to Visit/Call */}
                <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200/70 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-slate-800">Whom to Visit or Call?</span>
                    <div className="flex items-center gap-3 text-[11px]">
                      <label className="flex items-center gap-1.5 cursor-pointer">
                        <input
                          type="radio"
                          name="contact_mode"
                          checked={scheduleForm.contact_mode === 'doctor'}
                          onChange={() => setScheduleForm(prev => ({ ...prev, contact_mode: 'doctor' }))}
                          className="text-slate-900 focus:ring-slate-900"
                        />
                        <span className="font-medium text-slate-700">Doctor</span>
                      </label>
                      <label className="flex items-center gap-1.5 cursor-pointer">
                        <input
                          type="radio"
                          name="contact_mode"
                          checked={scheduleForm.contact_mode === 'custom'}
                          onChange={() => setScheduleForm(prev => ({ ...prev, contact_mode: 'custom' }))}
                          className="text-slate-900 focus:ring-slate-900"
                        />
                        <span className="font-medium text-slate-700">Chemist / Other</span>
                      </label>
                    </div>
                  </div>

                  {scheduleForm.contact_mode === 'doctor' ? (
                    <div>
                      <select
                        value={scheduleForm.doctor_id}
                        onChange={(e) => setScheduleForm(prev => ({ ...prev, doctor_id: e.target.value }))}
                        className="w-full bg-white border border-slate-200/80 rounded-xl px-3 py-2 text-xs focus:ring-1 focus:ring-slate-900 focus:border-slate-900 cursor-pointer"
                        required
                      >
                        <option value="">-- Select Doctor from Your List ({doctors.length} available) --</option>
                        {doctors.map(d => (
                          <option key={d.id} value={d.id}>
                            {d.name} ({d.specialization}) - {d.clinic_hospital_name}
                          </option>
                        ))}
                      </select>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <input
                        type="text"
                        placeholder="e.g. Apollo Pharmacy / City Medico"
                        value={scheduleForm.custom_contact_name}
                        onChange={(e) => setScheduleForm(prev => ({ ...prev, custom_contact_name: e.target.value }))}
                        className="w-full bg-white border border-slate-200/80 rounded-xl px-3 py-2 text-xs focus:ring-1 focus:ring-slate-900 focus:border-slate-900"
                        required
                      />
                      <select
                        value={scheduleForm.contact_type}
                        onChange={(e) => setScheduleForm(prev => ({ ...prev, contact_type: e.target.value }))}
                        className="w-full bg-white border border-slate-200/80 rounded-xl px-3 py-2 text-xs focus:ring-1 focus:ring-slate-900 focus:border-slate-900 cursor-pointer"
                      >
                        <option value="chemist">Chemist / Pharmacy</option>
                        <option value="hospital">Hospital Desk / Purchase</option>
                        <option value="stockist">Stockist / Distributor</option>
                      </select>
                    </div>
                  )}
                </div>

                {/* Date & Time */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-medium text-slate-700 mb-1">Date</label>
                    <input
                      type="date"
                      value={scheduleForm.scheduled_date}
                      onChange={(e) => setScheduleForm(prev => ({ ...prev, scheduled_date: e.target.value }))}
                      className="w-full bg-slate-50 border border-slate-200/80 rounded-xl px-3 py-2 text-xs focus:ring-1 focus:ring-slate-900 focus:border-slate-900"
                      required
                    />
                  </div>
                  <div>
                    <label className="block font-medium text-slate-700 mb-1">Preferred Time Slot</label>
                    <input
                      type="text"
                      placeholder="e.g. Morning OPD (10:30 AM)"
                      value={scheduleForm.scheduled_time}
                      onChange={(e) => setScheduleForm(prev => ({ ...prev, scheduled_time: e.target.value }))}
                      className="w-full bg-slate-50 border border-slate-200/80 rounded-xl px-3 py-2 text-xs focus:ring-1 focus:ring-slate-900 focus:border-slate-900"
                    />
                  </div>
                </div>

                {/* Priority */}
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Priority Level</label>
                  <div className="flex items-center gap-2">
                    {['high', 'normal', 'low'].map(p => (
                      <button
                        key={p}
                        type="button"
                        onClick={() => setScheduleForm(prev => ({ ...prev, priority: p }))}
                        className={`flex-1 py-1.5 rounded-xl border font-semibold capitalize text-xs transition-colors cursor-pointer ${
                          scheduleForm.priority === p 
                            ? (p === 'high' ? 'bg-rose-50 border-rose-300 text-rose-700' : 'bg-slate-900 border-slate-900 text-white')
                            : 'border-slate-200/80 text-slate-600 hover:bg-slate-50'
                        }`}
                      >
                        {p}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Purpose & Molecule tag clickers */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="font-medium text-slate-700">
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
                          className="text-[10px] font-medium bg-white hover:bg-slate-100 text-slate-700 border border-slate-200/80 px-2 py-0.5 rounded-md cursor-pointer transition-colors"
                        >
                          + {prod.brand_name}
                        </button>
                      ))}
                    </div>
                  )}

                  <textarea
                    rows="2"
                    placeholder="e.g. Detailing AmoxiClav 625 Duo; follow up on prescription feedback..."
                    value={scheduleForm.purpose}
                    onChange={(e) => setScheduleForm(prev => ({ ...prev, purpose: e.target.value }))}
                    className="w-full bg-slate-50 border border-slate-200/80 rounded-xl p-2.5 text-xs focus:ring-1 focus:ring-slate-900 focus:border-slate-900"
                    required
                  />
                </div>

                {/* Internal Notes */}
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Internal Notes (Optional)</label>
                  <input
                    type="text"
                    placeholder="e.g. Doctor prefers evening OPD after 6 PM"
                    value={scheduleForm.notes}
                    onChange={(e) => setScheduleForm(prev => ({ ...prev, notes: e.target.value }))}
                    className="w-full bg-slate-50 border border-slate-200/80 rounded-xl px-3 py-2 text-xs focus:ring-1 focus:ring-slate-900 focus:border-slate-900"
                  />
                </div>

                <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setIsScheduleModalOpen(false)}
                    className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 text-xs font-medium cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isPlannerSubmitting}
                    className="px-5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-medium transition-colors cursor-pointer disabled:opacity-50"
                  >
                    {isPlannerSubmitting ? 'Scheduling...' : 'Save to Schedule'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* MODAL 2: OUTCOME FEEDBACK DRAWER                                         */}
        {/* ========================================================================= */}
        {outcomeModalSchedule && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
            <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-xl border border-slate-100">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2.5">
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${
                    outcomeModalSchedule.action_type === 'call' ? 'bg-sky-50 text-sky-700' : 'bg-slate-100 text-slate-700'
                  }`}>
                    {outcomeModalSchedule.action_type === 'call' ? <PhoneCall className="w-4 h-4" /> : <CheckCircle2 className="w-4 h-4" />}
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-slate-800">
                      Mark as {outcomeModalSchedule.action_type === 'call' ? 'Called' : 'Visited'}
                    </h3>
                    <p className="text-[11px] text-slate-400">
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
                  <label className="block font-medium text-slate-700 mb-1.5">
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
                            ? 'bg-emerald-50 border-emerald-300 text-emerald-800 font-semibold' 
                            : 'bg-slate-50 border-slate-200/80 text-slate-700 hover:bg-slate-100'
                        }`}
                      >
                        {outcome}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block font-medium text-slate-700 mb-1">
                    Outcome Feedback / Discussion Notes
                  </label>
                  <textarea
                    rows="3"
                    placeholder="Add notes on doctor's feedback, prescription commitments, or follow-up needs..."
                    value={outcomeNote}
                    onChange={(e) => setOutcomeNote(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200/80 rounded-xl p-2.5 text-xs focus:ring-1 focus:ring-slate-900 focus:border-slate-900"
                  />
                </div>

                <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setOutcomeModalSchedule(null)}
                    className="px-3.5 py-1.5 rounded-xl text-slate-600 hover:bg-slate-100 text-xs font-medium cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    disabled={isPlannerSubmitting}
                    onClick={() => handlePlannerStatusUpdate(outcomeModalSchedule.id, 'completed', outcomeNote)}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-medium transition-colors cursor-pointer disabled:opacity-50"
                  >
                    <Check className="w-4 h-4 stroke-[2]" />
                    <span>Confirm Completion</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* MODAL 3: RESCHEDULE MODAL                                                 */}
        {/* ========================================================================= */}
        {rescheduleItem && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
            <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-xl border border-slate-100">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <h3 className="text-sm font-semibold text-slate-800">Reschedule Activity</h3>
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
                  <label className="block font-medium text-slate-700 mb-1">New Date</label>
                  <input
                    type="date"
                    value={rescheduleDate}
                    onChange={(e) => setRescheduleDate(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200/80 rounded-xl px-3 py-2 text-xs focus:ring-1 focus:ring-slate-900 focus:border-slate-900"
                    required
                  />
                </div>
                <div>
                  <label className="block font-medium text-slate-700 mb-1">New Time Slot</label>
                  <input
                    type="text"
                    value={rescheduleTime}
                    onChange={(e) => setRescheduleTime(e.target.value)}
                    placeholder="e.g. Tomorrow Evening OPD (06:00 PM)"
                    className="w-full bg-slate-50 border border-slate-200/80 rounded-xl px-3 py-2 text-xs focus:ring-1 focus:ring-slate-900 focus:border-slate-900"
                  />
                </div>

                <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setRescheduleItem(null)}
                    className="px-3.5 py-1.5 rounded-xl text-slate-600 hover:bg-slate-100 text-xs font-medium cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isPlannerSubmitting}
                    className="px-4 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-medium transition-colors cursor-pointer disabled:opacity-50"
                  >
                    Save Reschedule
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* MODAL 4: LOG DETAILING & SAMPLES MODAL (DCR)                              */}
        {/* ========================================================================= */}
        {detailModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs overflow-y-auto">
            <div className="bg-white rounded-3xl max-w-xl w-full p-6 shadow-xl border border-slate-100 my-8">
              
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center font-semibold">
                    <Pill className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-slate-800">
                      {editingVisit ? 'Edit Detailing Record' : 'Record In-Clinic Detailing & Samples'}
                    </h3>
                    <p className="text-xs text-slate-400 font-normal">Log formulations pitched, samples given, and physician response.</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setDetailModalOpen(false)}
                  className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleSubmitDetailing} className="space-y-4 pt-3 text-xs">
                
                {/* Doctor Selection */}
                <div>
                  <label className="block font-medium text-slate-700 mb-1">
                    Doctor Detailed <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={detailForm.doctor_id}
                    onChange={(e) => setDetailForm({ ...detailForm, doctor_id: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200/80 rounded-xl px-3 py-2 text-xs focus:ring-1 focus:ring-slate-900 focus:border-slate-900 cursor-pointer"
                    required
                  >
                    <option value="">-- Select Doctor --</option>
                    {doctors.map(d => (
                      <option key={d.id} value={d.id}>
                        {d.name} ({d.specialization}) - {d.clinic_hospital_name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Date & Time & Call Type */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  <div>
                    <label className="block font-medium text-slate-700 mb-1">Visit Date</label>
                    <input
                      type="date"
                      value={detailForm.visit_date}
                      onChange={(e) => setDetailForm({ ...detailForm, visit_date: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200/80 rounded-xl px-3 py-2 text-xs focus:ring-1 focus:ring-slate-900 focus:border-slate-900"
                      required
                    />
                  </div>
                  <div>
                    <label className="block font-medium text-slate-700 mb-1">Time</label>
                    <input
                      type="text"
                      value={detailForm.visit_time}
                      onChange={(e) => setDetailForm({ ...detailForm, visit_time: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200/80 rounded-xl px-3 py-2 text-xs focus:ring-1 focus:ring-slate-900 focus:border-slate-900"
                    />
                  </div>
                  <div>
                    <label className="block font-medium text-slate-700 mb-1">Call Type</label>
                    <select
                      value={detailForm.call_type}
                      onChange={(e) => setDetailForm({ ...detailForm, call_type: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200/80 rounded-xl px-2.5 py-2 text-xs focus:ring-1 focus:ring-slate-900 focus:border-slate-900 cursor-pointer"
                    >
                      {CALL_TYPES.map(ct => (
                        <option key={ct.value} value={ct.value}>{ct.label}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Products Detailed Multi-Select */}
                <div>
                  <label className="block font-medium text-slate-700 mb-1.5">
                    Molecules Detailed (Tap to toggle)
                  </label>
                  <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto p-2 bg-slate-50 rounded-xl border border-slate-200/80">
                    {products.map(prod => {
                      const selected = (detailForm.products_detailed || []).includes(prod.brand_name);
                      return (
                        <button
                          key={prod.id}
                          type="button"
                          onClick={() => toggleDetailProduct(prod.brand_name)}
                          className={`px-2.5 py-1 rounded-lg text-xs font-medium border transition-colors cursor-pointer ${
                            selected 
                              ? 'bg-slate-900 text-white border-slate-900' 
                              : 'bg-white text-slate-700 border-slate-200/80 hover:bg-slate-100'
                          }`}
                        >
                          {selected ? '✓ ' : '+ '}
                          {prod.brand_name}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Doctor Prescribing Response / Feedback */}
                <div>
                  <label className="block font-medium text-slate-700 mb-1">
                    Doctor Prescribing Response & Commitment <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={detailForm.doctor_feedback}
                    onChange={(e) => setDetailForm({ ...detailForm, doctor_feedback: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200/80 rounded-xl px-3 py-2 text-xs focus:ring-1 focus:ring-slate-900 focus:border-slate-900 cursor-pointer"
                    required
                  >
                    {FEEDBACK_OPTIONS.map(f => (
                      <option key={f.value} value={f.value}>{f.label}</option>
                    ))}
                  </select>
                </div>

                {/* Physician Samples & Inputs Given */}
                <div>
                  <label className="block font-medium text-slate-700 mb-1">
                    Physician Samples & Promo Inputs Given
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 10 strips AmoxiClav 625 Duo + 1 Pen Stand + 5 Trial Kits"
                    value={detailForm.samples_given}
                    onChange={(e) => setDetailForm({ ...detailForm, samples_given: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200/80 rounded-xl px-3 py-2 text-xs focus:ring-1 focus:ring-slate-900 focus:border-slate-900"
                  />
                </div>

                {/* Next Visit Date & Remarks */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <div>
                    <label className="block font-medium text-slate-700 mb-1">Next Follow-up Date</label>
                    <input
                      type="date"
                      value={detailForm.next_visit_date}
                      onChange={(e) => setDetailForm({ ...detailForm, next_visit_date: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200/80 rounded-xl px-3 py-2 text-xs focus:ring-1 focus:ring-slate-900 focus:border-slate-900"
                    />
                  </div>
                  <div>
                    <label className="block font-medium text-slate-700 mb-1">Remarks / Objections</label>
                    <input
                      type="text"
                      placeholder="e.g. Doctor requested efficacy reprint"
                      value={detailForm.remarks}
                      onChange={(e) => setDetailForm({ ...detailForm, remarks: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200/80 rounded-xl px-3 py-2 text-xs focus:ring-1 focus:ring-slate-900 focus:border-slate-900"
                    />
                  </div>
                </div>

                {/* Form Buttons */}
                <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setDetailModalOpen(false)}
                    className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 text-xs font-medium cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isDcrSubmitting}
                    className="px-5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-medium transition-colors cursor-pointer disabled:opacity-50"
                  >
                    {isDcrSubmitting ? 'Saving...' : 'Save Detailing Record'}
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
