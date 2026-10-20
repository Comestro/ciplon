import { useState, useEffect } from 'react';
import { usePage, Link } from '@inertiajs/react';
import { 
  Users, 
  CheckCircle2, 
  Clock, 
  CalendarClock, 
  TrendingUp, 
  Target, 
  AlertCircle, 
  RefreshCw, 
  Building2, 
  Calendar, 
  Award, 
  Presentation,
  Plus,
  Sparkles,
  ArrowRight,
  Pill,
  ChevronRight,
  Play
} from 'lucide-react';
import MRLayout from '../../layouts/MR/MRLayout';
import api from '../../services/api';

export default function Dashboard() {
  const { props } = usePage();
  const userName = props.auth?.user?.name || 'Representative';

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dashboardData, setDashboardData] = useState(null);
  const [activeFilter, setActiveFilter] = useState('all');

  const fetchDashboardData = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get('/api/v1/mr/dashboard');
      if (response.data?.success) {
        setDashboardData(response.data.data);
      } else {
        setError('Unable to load dashboard data.');
      }
    } catch (err) {
      if (err.response?.status === 401) {
        setError('Your session has expired. Please log in again.');
      } else if (err.response?.status === 403) {
        setError('Access denied. You do not have MR authorization.');
      } else {
        setError('Unable to load dashboard data. Please check your network connection.');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const summary = dashboardData?.summary || {
    today_visits: 0,
    completed_visits: 0,
    pending_visits: 0,
    follow_ups_due: 0,
  };

  const performance = dashboardData?.performance || {
    visits: { completed: 0, target: 0 },
    doctors: { covered: 0, target: 0 },
    product_promotions: { completed: 0, target: 0 },
    achievement: 0,
  };

  const todayVisits = dashboardData?.today_visits || [];
  const upcomingFollowups = dashboardData?.upcoming_followups || [];
  const recentActivities = dashboardData?.recent_activities || [];

  // SpaceWork Style Visual Presentation Cards Data
  const presentationDecks = [
    {
      id: 'brand-overview',
      title: 'Company Overview & Trust',
      category: 'Brand Heritage',
      categoryColor: 'text-violet-600',
      tag: 'ISO 9001:2015',
      updated: 'Updated just now',
      bgGradient: 'from-violet-600 via-purple-600 to-indigo-700',
      image: '/images/ciplon_logo.png',
      isLogo: true,
      slidesCount: 'Fixed #1',
    },
    {
      id: 'amoxiclav',
      title: 'AmoxiClav 625 Duo',
      category: 'Antibiotics',
      categoryColor: 'text-sky-600',
      tag: 'Amoxicillin + Clavulanic',
      updated: 'Updated 10m ago',
      bgGradient: 'from-sky-500 via-blue-600 to-indigo-600',
      image: '/images/box_factocel_ix.jpg',
      slidesCount: '12 Slides',
    },
    {
      id: 'ciplocid-dsr',
      title: 'Ciplocid-DSR Capsules',
      category: 'Gastroenterology',
      categoryColor: 'text-purple-600',
      tag: 'Rabeprazole + Domperidone',
      updated: 'Updated 30m ago',
      bgGradient: 'from-purple-600 via-fuchsia-600 to-pink-600',
      image: '/images/box_globucel_sc.jpg',
      slidesCount: '8 Slides',
    },
    {
      id: 'cardiovast',
      title: 'Cardiovast 20',
      category: 'Cardiology Care',
      categoryColor: 'text-blue-600',
      tag: 'Atorvastatin Calcium IP',
      updated: 'Updated 1h ago',
      bgGradient: 'from-blue-600 via-indigo-600 to-cyan-600',
      image: '/images/box_fibrogen_i.jpg',
      slidesCount: '10 Slides',
    },
    {
      id: 'aerobreathe',
      title: 'AeroBreathe 200 Inhaler',
      category: 'Pulmonology',
      categoryColor: 'text-violet-600',
      tag: 'Budesonide + Formoterol',
      updated: 'Updated 2h ago',
      bgGradient: 'from-indigo-600 via-violet-600 to-purple-800',
      image: '/images/box_globucel_sc.jpg',
      slidesCount: '14 Slides',
    },
    {
      id: 'ciplonpara',
      title: 'CiplonPara 650',
      category: 'Analgesics',
      categoryColor: 'text-purple-600',
      tag: 'Paracetamol Tablets IP',
      updated: 'Updated today',
      bgGradient: 'from-fuchsia-600 via-purple-700 to-indigo-800',
      image: '/images/box_factocel_ix.jpg',
      slidesCount: '6 Slides',
    },
  ];

  return (
    <MRLayout title="MR Dashboard">
      <div className="space-y-8 pb-12 font-sans">

        {/* 1. SpaceWork Header & Quick Action Template Cards */}
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
                Recents
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                Doctor visual aid decks, daily call planning, and performance metrics.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={fetchDashboardData}
                disabled={loading}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 rounded-xl transition-colors cursor-pointer shadow-2xs disabled:opacity-50"
                title="Refresh metrics"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-violet-600' : ''}`} />
                <span>Refresh</span>
              </button>
            </div>
          </div>

          {/* 3 Quick Action Cards (SpaceWork Inspired) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
            {/* Action 1: Start New Presentation */}
            <Link
              href="/mr/detailing"
              className="group p-4 rounded-2xl bg-white border border-slate-200/90 hover:border-violet-400 hover:shadow-xs transition-all flex items-center gap-3.5 cursor-pointer"
            >
              <div className="w-10 h-10 rounded-xl bg-violet-50 text-violet-600 border border-violet-100 flex items-center justify-center shrink-0 group-hover:scale-105 group-hover:bg-violet-600 group-hover:text-white transition-all">
                <Plus className="w-5 h-5 stroke-[2.5]" />
              </div>
              <div className="min-w-0 flex-1">
                <h4 className="text-xs font-bold text-slate-900 group-hover:text-violet-700 transition-colors truncate">
                  Start new presentation
                </h4>
                <p className="text-[11px] text-slate-500 truncate mt-0.5">
                  Choose from 17+ formulation slides
                </p>
              </div>
            </Link>

            {/* Action 2: Doctor Detailing Mode */}
            <Link
              href="/mr/detailing"
              className="group p-4 rounded-2xl bg-white border border-slate-200/90 hover:border-purple-400 hover:shadow-xs transition-all flex items-center gap-3.5 cursor-pointer"
            >
              <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 border border-purple-100 flex items-center justify-center shrink-0 group-hover:scale-105 group-hover:bg-purple-600 group-hover:text-white transition-all">
                <Sparkles className="w-5 h-5" />
              </div>
              <div className="min-w-0 flex-1">
                <h4 className="text-xs font-bold text-slate-900 group-hover:text-purple-700 transition-colors truncate">
                  Quick Doctor E-Detailing
                </h4>
                <p className="text-[11px] text-slate-500 truncate mt-0.5">
                  Launch interactive touch slide show
                </p>
              </div>
            </Link>

            {/* Action 3: Schedule Visit */}
            <Link
              href="/mr/visits"
              className="group p-4 rounded-2xl bg-white border border-slate-200/90 hover:border-amber-400 hover:shadow-xs transition-all flex items-center gap-3.5 cursor-pointer"
            >
              <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 border border-amber-100 flex items-center justify-center shrink-0 group-hover:scale-105 group-hover:bg-amber-600 group-hover:text-white transition-all">
                <Calendar className="w-5 h-5" />
              </div>
              <div className="min-w-0 flex-1">
                <h4 className="text-xs font-bold text-slate-900 group-hover:text-amber-700 transition-colors truncate">
                  Schedule Doctor Visit
                </h4>
                <p className="text-[11px] text-slate-500 truncate mt-0.5">
                  Add appointment to daily call planner
                </p>
              </div>
            </Link>
          </div>
        </div>

        {/* 2. Segmented Pill Switcher Filter */}
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-200/50 w-fit">
          <button
            type="button"
            onClick={() => setActiveFilter('all')}
            className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              activeFilter === 'all'
                ? 'bg-white text-slate-900 shadow-2xs font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            All Decks
          </button>
          <button
            type="button"
            onClick={() => setActiveFilter('priority')}
            className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              activeFilter === 'priority'
                ? 'bg-white text-slate-900 shadow-2xs font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Core Formulations
          </button>
          <button
            type="button"
            onClick={() => setActiveFilter('today')}
            className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              activeFilter === 'today'
                ? 'bg-white text-slate-900 shadow-2xs font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Today's Visits ({summary.today_visits})
          </button>
        </div>

        {/* 3. SpaceWork 16:9 Presentation Cards Grid */}
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {presentationDecks.map((deck) => (
              <Link
                key={deck.id}
                href="/mr/detailing"
                className="group flex flex-col space-y-2.5 cursor-pointer select-none"
              >
                {/* 16:9 Aspect Visual Card Thumbnail */}
                <div className={`relative aspect-[16/10] w-full rounded-2xl bg-gradient-to-br ${deck.bgGradient} p-5 overflow-hidden shadow-xs group-hover:shadow-md group-hover:scale-[1.015] transition-all duration-200 flex flex-col justify-between border border-white/10`}>
                  
                  {/* Card Top Label */}
                  <div className="flex items-center justify-between z-10">
                    <span className="text-[10px] font-bold tracking-widest uppercase text-white/80">
                      CIPLON
                    </span>
                    <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-white/20 text-white backdrop-blur-xs">
                      {deck.slidesCount}
                    </span>
                  </div>

                  {/* 3D Product Pack Image / Logo Asset */}
                  <div className="absolute right-3 -bottom-2 w-32 h-32 sm:w-36 sm:h-36 flex items-center justify-center opacity-90 group-hover:scale-105 group-hover:rotate-1 transition-transform duration-300">
                    <img
                      src={deck.image}
                      alt={deck.title}
                      className={`max-h-full max-w-full ${deck.isLogo ? 'object-contain brightness-0 invert drop-shadow-md' : 'object-contain drop-shadow-xl'}`}
                      onError={(e) => {
                        e.currentTarget.src = '/images/box_globucel_sc.jpg';
                      }}
                    />
                  </div>

                  {/* Card Title on Artwork */}
                  <div className="z-10 max-w-[65%]">
                    <h3 className="text-lg sm:text-xl font-black text-white leading-tight tracking-tight drop-shadow-xs">
                      {deck.title}
                    </h3>
                    <p className="text-[11px] text-white/80 font-medium truncate mt-0.5">
                      {deck.tag}
                    </p>
                  </div>

                  {/* Hover Play Button Overlay */}
                  <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <div className="w-11 h-11 rounded-full bg-white text-slate-900 shadow-xl flex items-center justify-center transform scale-75 group-hover:scale-100 transition-transform">
                      <Play className="w-5 h-5 fill-slate-900 ml-0.5" />
                    </div>
                  </div>
                </div>

                {/* Subtitle Under Thumbnail (Exact SpaceWork Style) */}
                <div className="px-0.5">
                  <h4 className="text-sm font-bold text-slate-900 group-hover:text-violet-700 transition-colors truncate">
                    {deck.title}
                  </h4>
                  <div className="flex items-center gap-1.5 text-xs text-slate-400 mt-0.5">
                    <span className={`font-semibold ${deck.categoryColor}`}>
                      In {deck.category}
                    </span>
                    <span>&bull;</span>
                    <span>{deck.updated}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* 4. Operational Metrics Summary (4 Cards) */}
        <div className="space-y-4 pt-4 border-t border-slate-200/80">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-900">
              Daily Field Execution
            </h3>
            <span className="text-xs text-slate-500">Live operational sync</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Metric 1 */}
            <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-2xs">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-500">Today's Visits</span>
                <span className="w-8 h-8 rounded-xl bg-violet-50 text-violet-700 flex items-center justify-center">
                  <Users className="w-4 h-4" />
                </span>
              </div>
              <div className="mt-3">
                <span className="text-2xl font-bold text-slate-900">{summary.today_visits}</span>
                <span className="text-[11px] text-slate-400 block mt-0.5">Assigned appointments</span>
              </div>
            </div>

            {/* Metric 2 */}
            <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-2xs">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-500">Completed Calls</span>
                <span className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
                  <CheckCircle2 className="w-4 h-4" />
                </span>
              </div>
              <div className="mt-3">
                <span className="text-2xl font-bold text-emerald-700">{summary.completed_visits}</span>
                <span className="text-[11px] text-slate-400 block mt-0.5">DCR reports submitted</span>
              </div>
            </div>

            {/* Metric 3 */}
            <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-2xs">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-500">Pending Visits</span>
                <span className="w-8 h-8 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center">
                  <Clock className="w-4 h-4" />
                </span>
              </div>
              <div className="mt-3">
                <span className="text-2xl font-bold text-amber-700">{summary.pending_visits}</span>
                <span className="text-[11px] text-slate-400 block mt-0.5">Remaining for today</span>
              </div>
            </div>

            {/* Metric 4 */}
            <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-2xs">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-500">Target Achievement</span>
                <span className="w-8 h-8 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center">
                  <Award className="w-4 h-4" />
                </span>
              </div>
              <div className="mt-3">
                <span className="text-2xl font-bold text-blue-700">{performance.achievement}%</span>
                <span className="text-[11px] text-slate-400 block mt-0.5">Monthly coverage index</span>
              </div>
            </div>
          </div>
        </div>

        {/* 5. Today's Appointments & Follow-ups */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Today's Visits */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-6 shadow-2xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Clock className="w-4 h-4 text-violet-600" />
                <span>Today's Doctor Visits</span>
              </h3>
              <Link href="/mr/visits" className="text-xs font-semibold text-violet-600 hover:text-violet-800">
                View Planner &rarr;
              </Link>
            </div>

            <div className="mt-4">
              {todayVisits.length === 0 ? (
                <div className="py-8 text-center text-slate-400">
                  <Building2 className="w-8 h-8 mx-auto mb-2 opacity-30 text-slate-400" />
                  <p className="text-xs">No visits scheduled for today.</p>
                </div>
              ) : (
                <div className="divide-y divide-slate-100">
                  {todayVisits.map((visit, idx) => (
                    <div key={idx} className="py-2.5 flex items-center justify-between text-xs">
                      <div>
                        <strong className="block text-slate-900">{visit.doctor}</strong>
                        <span className="text-slate-500 text-[11px]">{visit.hospital}</span>
                      </div>
                      <div className="text-right">
                        <span className="font-semibold text-slate-700 block">{visit.time}</span>
                        <span className="text-[10px] text-violet-700 bg-violet-50 px-2 py-0.5 rounded-full font-medium">
                          {visit.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Follow-ups */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-6 shadow-2xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <CalendarClock className="w-4 h-4 text-violet-600" />
                <span>Upcoming Follow-ups</span>
              </h3>
              <span className="text-xs text-slate-400">{upcomingFollowups.length} queued</span>
            </div>

            <div className="mt-4">
              {upcomingFollowups.length === 0 ? (
                <div className="py-8 text-center text-slate-400">
                  <Calendar className="w-8 h-8 mx-auto mb-2 opacity-30 text-slate-400" />
                  <p className="text-xs">No upcoming follow-ups scheduled.</p>
                </div>
              ) : (
                <div className="divide-y divide-slate-100">
                  {upcomingFollowups.map((item, idx) => (
                    <div key={idx} className="py-2.5 flex items-center justify-between text-xs">
                      <div>
                        <strong className="block text-slate-900">{item.doctor}</strong>
                        <span className="text-slate-500 text-[11px]">{item.purpose}</span>
                      </div>
                      <div className="text-right">
                        <span className="text-slate-600 block text-[11px]">{item.date}</span>
                        <span className="text-[10px] text-blue-700 bg-blue-50 px-2 py-0.5 rounded-full font-medium">
                          {item.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

      </div>
    </MRLayout>
  );
}
