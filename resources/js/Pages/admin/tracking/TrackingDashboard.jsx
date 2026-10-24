import { useState } from 'react';
import { router, Link } from '@inertiajs/react';
import { 
  Users, 
  MapPin, 
  Calendar, 
  CheckCircle2, 
  Clock, 
  TrendingUp, 
  Award, 
  Search, 
  Battery, 
  ChevronRight, 
  ShieldCheck, 
  Building2, 
  Filter, 
  Eye, 
  Check, 
  X, 
  AlertCircle, 
  Settings,
  Sparkles,
  ArrowUpRight,
  Layers,
  RotateCw,
  Navigation
} from 'lucide-react';
import toast from 'react-hot-toast';
import AdminLayout from '../../../layouts/AdminLayout';
import SearchBar from '../../../components/common/SearchBar';
import DoctorMovementMap from '../../../components/maps/DoctorMovementMap';

export default function TrackingDashboard({
  mapbox = {},
  kpi = {},
  field_representatives = [],
  active_mr = null,
  doctor_stops = {},
  tour_plans_for_approval = [],
  leaderboard = [],
}) {
  const [selectedMRId, setSelectedMRId] = useState(active_mr?.id || field_representatives[0]?.id || null);
  const [searchRepQuery, setSearchRepQuery] = useState('');
  const [tourMode, setTourMode] = useState('doctor'); // 'doctor' | 'distributor'
  const [tourApprovalTab, setTourApprovalTab] = useState('doctors'); // 'doctors' | 'distributors'

  // Review Modal State
  const [reviewModalPlan, setReviewModalPlan] = useState(null);
  const [reviewNotes, setReviewNotes] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  // Active MR object
  const activeRep = field_representatives.find((r) => r.id === selectedMRId) || active_mr || field_representatives[0];

  // Filter representatives by search query
  const filteredReps = field_representatives.filter((rep) =>
    rep.name.toLowerCase().includes(searchRepQuery.toLowerCase()) ||
    rep.reg_code.toLowerCase().includes(searchRepQuery.toLowerCase())
  );

  // Filter tour plans by tab
  const filteredPlans = tour_plans_for_approval.filter((plan) => {
    if (tourApprovalTab === 'doctors') return plan.type === 'doctor';
    if (tourApprovalTab === 'distributors') return plan.type === 'distributor';
    return true;
  });

  const tourSummary = tourMode === 'doctor'
    ? (kpi.tour_summary?.doctor_mode || { total_tours: 36, planned: 857, visited: 228, completion_percent: 27 })
    : (kpi.tour_summary?.distributor_mode || { total_tours: 14, planned: 210, visited: 148, completion_percent: 70 });

  // Handle MR selection change
  const handleSelectMR = (repId) => {
    setSelectedMRId(repId);
    router.get(
      '/admin/tracking',
      { user_id: repId },
      { preserveState: true, preserveScroll: true }
    );
  };

  // Handle Tour Plan Approval
  const handleApprovePlan = (planId) => {
    setIsProcessing(true);
    router.post(
      `/admin/tour-plans/${planId}/approve`,
      { notes: reviewNotes || 'Tour plan approved.' },
      {
        preserveScroll: true,
        onSuccess: () => {
          toast.success('Tour plan approved successfully!');
          setReviewModalPlan(null);
          setIsProcessing(false);
        },
        onError: () => {
          toast.error('Failed to approve tour plan.');
          setIsProcessing(false);
        },
      }
    );
  };

  // Handle Tour Plan Rejection
  const handleRejectPlan = (planId) => {
    setIsProcessing(true);
    router.post(
      `/admin/tour-plans/${planId}/reject`,
      { notes: reviewNotes || 'Tour plan rejected.' },
      {
        preserveScroll: true,
        onSuccess: () => {
          toast.success('Tour plan marked as rejected.');
          setReviewModalPlan(null);
          setIsProcessing(false);
        },
        onError: () => {
          toast.error('Failed to reject tour plan.');
          setIsProcessing(false);
        },
      }
    );
  };

  return (
    <AdminLayout>
      <div className="space-y-6 pb-12 font-sans max-w-[1600px] mx-auto">
        
        {/* 1. Clean Header matching Admin Dashboard */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200/80">
          <div>
            <h2 className="text-xl sm:text-2xl font-semibold tracking-tight text-slate-800">
              Field Operations & Live Tracking
            </h2>
            <p className="text-xs text-slate-500 font-normal mt-0.5">
              Real-time Mapbox doctor movement, field telemetry, and monthly tour plan approvals.
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200/60 text-xs font-medium">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>Mapbox Live Tracking Active</span>
            </div>

            <Link
              href="/admin/settings"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 font-medium text-xs transition-colors cursor-pointer"
            >
              <Settings className="w-3.5 h-3.5 text-slate-500" />
              <span>Mapbox Settings</span>
            </Link>
          </div>
        </div>

        {/* 2. 4 Clean White KPI Stat Cards (SpaceWork Dashboard Style) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          {/* Card 1: Medical Representatives */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-slate-500">Medical Representatives</span>
              <div className="w-9 h-9 rounded-xl bg-violet-50 text-violet-600 border border-violet-100 flex items-center justify-center">
                <Users className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-2">
              <span className="text-2xl font-semibold text-slate-800">{kpi.medical_representatives || 35}</span>
            </div>
            <div className="mt-1 flex items-center gap-1.5 text-[11px] text-slate-400 font-normal">
              <span className="text-violet-600 font-medium">{field_representatives.length} Active in Field</span>
            </div>
          </div>

          {/* Card 2: Doctors in Territory */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-slate-500">Doctors in Territory</span>
              <div className="w-9 h-9 rounded-xl bg-rose-50 text-rose-600 border border-rose-100 flex items-center justify-center">
                <MapPin className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-2">
              <span className="text-2xl font-semibold text-slate-800">{kpi.doctors || 6504}</span>
            </div>
            <div className="mt-1 flex items-center gap-1.5 text-[11px] text-slate-400 font-normal">
              <span className="text-emerald-600 font-medium">9 Assigned on Today's Route</span>
            </div>
          </div>

          {/* Card 3: Regional Managers */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-slate-500">Regional Managers</span>
              <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-100 flex items-center justify-center">
                <ShieldCheck className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-2">
              <span className="text-2xl font-semibold text-slate-800">{kpi.managers || 13}</span>
            </div>
            <div className="mt-1 flex items-center gap-1.5 text-[11px] text-slate-400 font-normal">
              <span className="text-slate-500">ABM & Regional Supervision</span>
            </div>
          </div>

          {/* Card 4: Headquarters */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-slate-500">Active Headquarters</span>
              <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 border border-amber-100 flex items-center justify-center">
                <Building2 className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-2">
              <span className="text-2xl font-semibold text-slate-800">{kpi.headquarters || 26}</span>
            </div>
            <div className="mt-1 flex items-center gap-1.5 text-[11px] text-slate-400 font-normal">
              <span className="text-slate-500">Operational Hubs</span>
            </div>
          </div>
        </div>

        {/* 3. Tour Plan Summary - Today & Tour Plan for Approval */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          
          {/* Left: Tour Plan Summary - Today */}
          <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200/80 p-5 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-violet-600" />
                <h3 className="text-sm font-semibold text-slate-800">Tour Plan Summary - Today</h3>
              </div>

              {/* Segmented Mode Toggle (SpaceWork Style) */}
              <div className="flex items-center gap-1 p-0.5 rounded-xl bg-slate-200/50 text-xs">
                <button
                  type="button"
                  onClick={() => setTourMode('doctor')}
                  className={`px-3 py-1 rounded-lg transition-colors cursor-pointer ${
                    tourMode === 'doctor'
                      ? 'bg-white text-slate-900 font-semibold shadow-2xs'
                      : 'text-slate-600 hover:text-slate-900 font-normal'
                  }`}
                >
                  Doctor Mode
                </button>
                <button
                  type="button"
                  onClick={() => setTourMode('distributor')}
                  className={`px-3 py-1 rounded-lg transition-colors cursor-pointer ${
                    tourMode === 'distributor'
                      ? 'bg-white text-slate-900 font-semibold shadow-2xs'
                      : 'text-slate-600 hover:text-slate-900 font-normal'
                  }`}
                >
                  Distributor
                </button>
              </div>
            </div>

            {/* 4 Clean Metric Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              <div className="rounded-xl p-3 bg-slate-50 border border-slate-100 text-center">
                <p className="text-base font-semibold text-slate-800">{tourSummary.total_tours}</p>
                <span className="text-[10px] font-medium text-slate-500 block mt-0.5">
                  Total Tours
                </span>
              </div>

              <div className="rounded-xl p-3 bg-slate-50 border border-slate-100 text-center">
                <p className="text-base font-semibold text-slate-800">{tourSummary.planned}</p>
                <span className="text-[10px] font-medium text-slate-500 block mt-0.5">
                  Planned
                </span>
              </div>

              <div className="rounded-xl p-3 bg-slate-50 border border-slate-100 text-center">
                <p className="text-base font-semibold text-emerald-600">{tourSummary.visited}</p>
                <span className="text-[10px] font-medium text-slate-500 block mt-0.5">
                  Visited
                </span>
              </div>

              <div className="rounded-xl p-3 bg-slate-50 border border-slate-100 text-center">
                <p className="text-base font-semibold text-violet-600">{tourSummary.completion_percent}%</p>
                <span className="text-[10px] font-medium text-slate-500 block mt-0.5">
                  Completion
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
              <span>Overall regional completion progress</span>
              <span className="font-semibold text-slate-800">{tourSummary.completion_percent}% Completed</span>
            </div>
            <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
              <div
                className="bg-emerald-500 h-full rounded-full transition-all duration-500"
                style={{ width: `${tourSummary.completion_percent}%` }}
              ></div>
            </div>
          </div>

          {/* Right: Tour Plan for Approval */}
          <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200/80 p-5 space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-violet-600" />
                <h3 className="text-sm font-semibold text-slate-800">Tour Plan for Approval</h3>
              </div>

              <div className="flex items-center gap-1 p-0.5 rounded-xl bg-slate-200/50 text-xs">
                <button
                  type="button"
                  onClick={() => setTourApprovalTab('doctors')}
                  className={`px-3 py-1 rounded-lg transition-colors cursor-pointer ${
                    tourApprovalTab === 'doctors'
                      ? 'bg-white text-slate-900 font-semibold shadow-2xs'
                      : 'text-slate-600 hover:text-slate-900 font-normal'
                  }`}
                >
                  Doctors ({tour_plans_for_approval.filter(p => p.type === 'doctor').length})
                </button>
                <button
                  type="button"
                  onClick={() => setTourApprovalTab('distributors')}
                  className={`px-3 py-1 rounded-lg transition-colors cursor-pointer ${
                    tourApprovalTab === 'distributors'
                      ? 'bg-white text-slate-900 font-semibold shadow-2xs'
                      : 'text-slate-600 hover:text-slate-900 font-normal'
                  }`}
                >
                  Distributors (0)
                </button>
              </div>
            </div>

            {/* Approval Table */}
            <div className="overflow-x-auto max-h-[195px] overflow-y-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-100 text-[11px] font-semibold text-slate-400">
                    <th className="py-2 px-2">Employee</th>
                    <th className="py-2 px-2">Month</th>
                    <th className="py-2 px-2 text-center">Days</th>
                    <th className="py-2 px-2 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredPlans.length > 0 ? (
                    filteredPlans.map((plan) => (
                      <tr key={plan.id} className="hover:bg-slate-50/70 transition-colors">
                        <td className="py-2 px-2 font-medium text-slate-800">
                          {plan.employee_name}
                        </td>
                        <td className="py-2 px-2 text-slate-500">
                          {plan.month}
                        </td>
                        <td className="py-2 px-2 text-center font-normal text-slate-700">
                          <span className="px-2 py-0.5 rounded-md bg-slate-100 text-[11px]">
                            {plan.days_count} days
                          </span>
                        </td>
                        <td className="py-2 px-2 text-right">
                          {plan.status === 'approved' ? (
                            <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200/60">
                              <Check className="w-3 h-3" /> Approved
                            </span>
                          ) : (
                            <button
                              type="button"
                              onClick={() => {
                                setReviewModalPlan(plan);
                                setReviewNotes('');
                              }}
                              className="px-3 py-1 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-medium text-xs transition-colors cursor-pointer"
                            >
                              Review
                            </button>
                          )}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="4" className="py-6 text-center text-slate-400">
                        No pending tour plans found for approval.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* 4. Main 3-Column Section: Field Representatives | Doctor Movement Map | Last 30 Days Performance */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
          
          {/* Column 1: Field Representatives List (3.5 cols) */}
          <div className="lg:col-span-3 bg-white rounded-2xl border border-slate-200/80 p-4 space-y-3.5">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div className="flex items-center gap-1.5">
                <Users className="w-4 h-4 text-violet-600" />
                <h3 className="text-sm font-semibold text-slate-800">Field Representatives</h3>
              </div>
              <span className="text-[11px] font-medium text-slate-400">
                {filteredReps.length} Active
              </span>
            </div>

            {/* Search Input */}
            <SearchBar
              value={searchRepQuery}
              onChange={(e) => setSearchRepQuery(e.target.value)}
              placeholder="Search representative..."
              className="w-full"
            />

            {/* Reps Scrollable List */}
            <div className="space-y-1.5 max-h-[580px] overflow-y-auto pr-1">
              {filteredReps.map((rep) => {
                const isSelected = rep.id === activeRep?.id;
                return (
                  <div
                    key={rep.id}
                    onClick={() => handleSelectMR(rep.id)}
                    className={`p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                      isSelected
                        ? 'bg-violet-50/70 border-violet-300 ring-1 ring-violet-300/50'
                        : 'bg-white border-slate-200/70 hover:bg-slate-50/80'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      {/* Avatar */}
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-medium text-xs shrink-0 ${
                        isSelected
                          ? 'bg-violet-600 text-white'
                          : 'bg-slate-100 text-slate-700'
                      }`}>
                        {rep.name.substring(0, 2).toUpperCase()}
                      </div>

                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                          <p className="text-xs font-medium text-slate-800 truncate">
                            {rep.name}
                          </p>
                          <span className={`text-[10px] font-medium px-1.5 py-0.2 rounded ${
                            rep.role_title === 'ABM'
                              ? 'bg-purple-100 text-purple-700'
                              : 'bg-slate-100 text-slate-600'
                          }`}>
                            {rep.role_title}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-400">
                          Reg: {rep.reg_code} • {rep.last_checkin_time}
                        </p>
                      </div>
                    </div>

                    {/* Completion Donut Circle */}
                    <div className="relative w-8 h-8 shrink-0 flex items-center justify-center">
                      <svg className="w-8 h-8 -rotate-90" viewBox="0 0 36 36">
                        <path
                          className="text-slate-100"
                          strokeWidth="3.5"
                          stroke="currentColor"
                          fill="none"
                          d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        />
                        <path
                          className={
                            rep.progress_percent >= 80
                              ? 'text-emerald-500'
                              : rep.progress_percent >= 40
                              ? 'text-violet-600'
                              : 'text-amber-500'
                          }
                          strokeDasharray={`${rep.progress_percent}, 100`}
                          strokeWidth="3.5"
                          strokeLinecap="round"
                          stroke="currentColor"
                          fill="none"
                          d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        />
                      </svg>
                      <span className="absolute text-[9px] font-semibold text-slate-700">
                        {rep.progress_percent}%
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Column 2: Doctor Movement Map & Selected MR Details (6 cols) */}
          <div className="lg:col-span-6 space-y-4">
            
            {/* Interactive Mapbox Map Component */}
            <DoctorMovementMap
              mapboxConfig={mapbox}
              doctorStops={doctor_stops}
              activeMR={activeRep}
              height="490px"
            />

            {/* Bottom Status Bar for Selected MR */}
            {activeRep && (
              <div className="bg-white rounded-2xl border border-slate-200/80 p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-600 via-indigo-600 to-purple-700 text-white flex items-center justify-center font-medium text-xs">
                    {activeRep.name.substring(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded-md bg-slate-900 text-white font-mono text-[10px] font-semibold">
                        {activeRep.reg_code}
                      </span>
                      <h4 className="text-xs font-semibold text-slate-800">
                        {activeRep.name}
                      </h4>
                    </div>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      Reg: {activeRep.reg_code} • Live Telemetry Active
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4 text-xs">
                  <div className="text-right">
                    <p className="text-slate-400 text-[10px] font-medium">Tour Schedule</p>
                    <p className="font-medium text-slate-700">
                      Start: <span className="text-emerald-600">{activeRep.start_time}</span> | End: <span className="text-amber-600">{activeRep.end_time}</span>
                    </p>
                  </div>

                  {/* Donut progress */}
                  <div className="relative w-11 h-11 shrink-0 flex items-center justify-center">
                    <svg className="w-11 h-11 -rotate-90" viewBox="0 0 36 36">
                      <path
                        className="text-slate-100"
                        strokeWidth="3.5"
                        stroke="currentColor"
                        fill="none"
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      />
                      <path
                        className="text-emerald-500"
                        strokeDasharray={`${activeRep.progress_percent || 41}, 100`}
                        strokeWidth="3.5"
                        strokeLinecap="round"
                        stroke="currentColor"
                        fill="none"
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      />
                    </svg>
                    <span className="absolute text-[11px] font-semibold text-slate-800">
                      {activeRep.progress_percent || 41}%
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Column 3: Last 30 Days Performance Leaderboard (3 cols) */}
          <div className="lg:col-span-3 bg-white rounded-2xl border border-slate-200/80 p-4 space-y-3.5">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div className="flex items-center gap-1.5">
                <Award className="w-4 h-4 text-amber-500" />
                <h3 className="text-sm font-semibold text-slate-800">Last 30 Days Performance</h3>
              </div>
              <span className="text-[10px] font-medium text-slate-400">
                Leaderboard
              </span>
            </div>

            <div className="space-y-2 max-h-[580px] overflow-y-auto pr-1">
              {leaderboard.map((item) => (
                <div
                  key={item.rank}
                  className="p-2.5 rounded-xl border border-slate-100 hover:border-slate-200 bg-white hover:bg-slate-50/50 transition-colors flex items-center justify-between text-xs"
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <span className={`w-5 h-5 rounded-full flex items-center justify-center font-semibold text-[10px] shrink-0 ${
                      item.rank === 1
                        ? 'bg-amber-100 text-amber-800 border border-amber-300'
                        : item.rank === 2
                        ? 'bg-slate-200 text-slate-700'
                        : item.rank === 3
                        ? 'bg-amber-50 text-amber-700'
                        : 'bg-slate-100 text-slate-500'
                    }`}>
                      #{item.rank}
                    </span>

                    <div className="min-w-0">
                      <p className="font-medium text-slate-800 truncate">
                        {item.name}
                      </p>
                      <p className="text-[11px] text-slate-400 truncate">
                        <span className="text-violet-600 font-medium">{item.doctors_count} doctors</span> {item.visits_multiplier} = {item.total_calls} calls
                      </p>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="font-semibold text-violet-700 text-xs">
                      {item.coverage_percent}%
                    </span>
                    <p className="text-[10px] text-slate-400">Coverage</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>

      {/* Review Tour Plan Modal */}
      {reviewModalPlan && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl border border-slate-200 max-w-lg w-full p-6 space-y-4 shadow-xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-violet-600" />
                <h3 className="text-base font-semibold text-slate-800">Review Tour Plan</h3>
              </div>
              <button
                type="button"
                onClick={() => setReviewModalPlan(null)}
                className="text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs text-slate-700">
              <div className="grid grid-cols-2 gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200/60">
                <div>
                  <span className="text-slate-400 text-[10px] font-medium">Representative</span>
                  <p className="font-semibold text-slate-800 text-sm">{reviewModalPlan.employee_name}</p>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px] font-medium">Plan Period</span>
                  <p className="font-medium text-slate-800">{reviewModalPlan.month}</p>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px] font-medium">Field Working Days</span>
                  <p className="font-medium text-slate-800">{reviewModalPlan.days_count} Days</p>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px] font-medium">Target Doctor Visits</span>
                  <p className="font-semibold text-violet-600">{reviewModalPlan.planned_visits} Visits</p>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Administrator Notes & Guidance
                </label>
                <textarea
                  rows="3"
                  value={reviewNotes}
                  onChange={(e) => setReviewNotes(e.target.value)}
                  placeholder="Optional feedback for the representative..."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500"
                ></textarea>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100">
              <button
                type="button"
                disabled={isProcessing}
                onClick={() => handleRejectPlan(reviewModalPlan.id)}
                className="px-4 py-2 rounded-xl text-xs font-medium text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200/60 transition-colors cursor-pointer"
              >
                Reject Plan
              </button>
              <button
                type="button"
                disabled={isProcessing}
                onClick={() => handleApprovePlan(reviewModalPlan.id)}
                className="px-5 py-2 rounded-xl text-xs font-medium text-white bg-slate-900 hover:bg-slate-800 transition-colors cursor-pointer"
              >
                {isProcessing ? 'Processing...' : 'Approve Tour Plan'}
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
