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
import DoctorMovementMap from '../../components/maps/DoctorMovementMap';

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

        {/* 1. Header & Quick Action Template Cards */}
        <div className="space-y-4">
          <div className="flex items-center justify-between gap-4">
            <h2 className="text-xl sm:text-2xl font-semibold tracking-tight text-slate-800">
              Recents
            </h2>

            <button
              type="button"
              onClick={fetchDashboardData}
              disabled={loading}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-600 bg-white border border-slate-200 hover:bg-slate-50 rounded-xl transition-colors cursor-pointer disabled:opacity-50"
              title="Refresh"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-violet-600' : ''}`} />
              <span>Refresh</span>
            </button>
          </div>

          {/* 3 Quick Action Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {/* Action 1: Start New Presentation */}
            <Link
              href="/mr/detailing"
              className="group p-3.5 rounded-2xl bg-white border border-slate-200 hover:border-violet-400 transition-colors flex items-center gap-3 cursor-pointer"
            >
              <div className="w-9 h-9 rounded-xl bg-violet-50 text-violet-600 border border-violet-100 flex items-center justify-center shrink-0 group-hover:bg-violet-600 group-hover:text-white transition-colors">
                <Plus className="w-4 h-4 stroke-[2]" />
              </div>
              <span className="text-xs font-medium text-slate-800 group-hover:text-violet-700 transition-colors truncate">
                Start Presentation
              </span>
            </Link>

            {/* Action 2: Doctor Detailing Mode */}
            <Link
              href="/mr/detailing"
              className="group p-3.5 rounded-2xl bg-white border border-slate-200 hover:border-purple-400 transition-colors flex items-center gap-3 cursor-pointer"
            >
              <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-600 border border-purple-100 flex items-center justify-center shrink-0 group-hover:bg-purple-600 group-hover:text-white transition-colors">
                <Sparkles className="w-4 h-4" />
              </div>
              <span className="text-xs font-medium text-slate-800 group-hover:text-purple-700 transition-colors truncate">
                Doctor E-Detailing
              </span>
            </Link>

            {/* Action 3: Schedule Visit */}
            <Link
              href="/mr/visits"
              className="group p-3.5 rounded-2xl bg-white border border-slate-200 hover:border-amber-400 transition-colors flex items-center gap-3 cursor-pointer"
            >
              <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 border border-amber-100 flex items-center justify-center shrink-0 group-hover:bg-amber-600 group-hover:text-white transition-colors">
                <Calendar className="w-4 h-4" />
              </div>
              <span className="text-xs font-medium text-slate-800 group-hover:text-amber-700 transition-colors truncate">
                Schedule Visit
              </span>
            </Link>
          </div>
        </div>

        {/* 2. Segmented Pill Switcher Filter */}
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-200/50 w-fit">
          <button
            type="button"
            onClick={() => setActiveFilter('all')}
            className={`px-3 py-1 rounded-lg text-xs transition-colors cursor-pointer ${
              activeFilter === 'all'
                ? 'bg-white text-slate-900 font-semibold'
                : 'text-slate-600 hover:text-slate-900 font-normal'
            }`}
          >
            All Decks
          </button>
          <button
            type="button"
            onClick={() => setActiveFilter('priority')}
            className={`px-3 py-1 rounded-lg text-xs transition-colors cursor-pointer ${
              activeFilter === 'priority'
                ? 'bg-white text-slate-900 font-semibold'
                : 'text-slate-600 hover:text-slate-900 font-normal'
            }`}
          >
            Core Formulations
          </button>
          <button
            type="button"
            onClick={() => setActiveFilter('today')}
            className={`px-3 py-1 rounded-lg text-xs transition-colors cursor-pointer ${
              activeFilter === 'today'
                ? 'bg-white text-slate-900 font-semibold'
                : 'text-slate-600 hover:text-slate-900 font-normal'
            }`}
          >
            Today's Visits ({summary.today_visits})
          </button>
        </div>

        {/* 3. Presentation Cards Grid (Clean Flat Minimal) */}
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {presentationDecks.map((deck) => (
              <Link
                key={deck.id}
                href="/mr/detailing"
                className="group flex flex-col space-y-2 cursor-pointer select-none"
              >
                {/* Visual Card Thumbnail (Zero Shadow) */}
                <div className={`relative aspect-[16/10] w-full rounded-2xl bg-gradient-to-br ${deck.bgGradient} p-4 sm:p-5 overflow-hidden flex flex-col justify-between border border-white/10`}>
                  
                  {/* Card Top Label */}
                  <div className="flex items-center justify-between z-10">
                    <span className="text-[10px] font-medium tracking-wider uppercase text-white/80">
                      Ciplon
                    </span>
                    <span className="px-2 py-0.5 rounded-full text-[9px] font-medium bg-white/20 text-white backdrop-blur-xs">
                      {deck.slidesCount}
                    </span>
                  </div>

                  {/* 3D Product Pack Image / Logo Asset (No Drop Shadow) */}
                  <div className="absolute right-3 -bottom-2 w-28 h-28 sm:w-32 sm:h-32 flex items-center justify-center opacity-90 group-hover:scale-105 transition-transform duration-200">
                    <img
                      src={deck.image}
                      alt={deck.title}
                      className={`max-h-full max-w-full ${deck.isLogo ? 'object-contain brightness-0 invert' : 'object-contain'}`}
                      onError={(e) => {
                        e.currentTarget.src = '/images/box_globucel_sc.jpg';
                      }}
                    />
                  </div>

                  {/* Card Title on Artwork */}
                  <div className="z-10 max-w-[65%]">
                    <h3 className="text-base sm:text-lg font-semibold text-white leading-snug tracking-tight">
                      {deck.title}
                    </h3>
                  </div>

                  {/* Hover Play Button Overlay (No Shadow) */}
                  <div className="absolute inset-0 bg-black/15 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <div className="w-10 h-10 rounded-full bg-white text-slate-900 border border-slate-200 flex items-center justify-center transform scale-90 group-hover:scale-100 transition-transform">
                      <Play className="w-4 h-4 fill-slate-900 ml-0.5" />
                    </div>
                  </div>
                </div>

                {/* Subtitle Under Thumbnail */}
                <div className="px-0.5 flex items-center justify-between gap-2">
                  <h4 className="text-xs font-medium text-slate-800 group-hover:text-violet-700 transition-colors truncate">
                    {deck.title}
                  </h4>
                  <span className={`text-[11px] font-medium shrink-0 ${deck.categoryColor}`}>
                    {deck.category}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* 4. Operational Metrics Summary (Clean Flat) */}
        <div className="space-y-3 pt-3 border-t border-slate-200/80">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Daily Execution
          </h3>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {/* Metric 1 */}
            <div className="bg-white rounded-xl border border-slate-200/80 p-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-slate-500">Today</span>
                <span className="w-7 h-7 rounded-lg bg-violet-50 text-violet-700 flex items-center justify-center">
                  <Users className="w-3.5 h-3.5" />
                </span>
              </div>
              <div className="mt-2">
                <span className="text-2xl font-semibold text-slate-800">{summary.today_visits}</span>
              </div>
            </div>

            {/* Metric 2 */}
            <div className="bg-white rounded-xl border border-slate-200/80 p-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-slate-500">Completed</span>
                <span className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                </span>
              </div>
              <div className="mt-2">
                <span className="text-2xl font-semibold text-emerald-700">{summary.completed_visits}</span>
              </div>
            </div>

            {/* Metric 3 */}
            <div className="bg-white rounded-xl border border-slate-200/80 p-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-slate-500">Pending</span>
                <span className="w-7 h-7 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center">
                  <Clock className="w-3.5 h-3.5" />
                </span>
              </div>
              <div className="mt-2">
                <span className="text-2xl font-semibold text-amber-700">{summary.pending_visits}</span>
              </div>
            </div>

            {/* Metric 4 */}
            <div className="bg-white rounded-xl border border-slate-200/80 p-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-slate-500">Achievement</span>
                <span className="w-7 h-7 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center">
                  <Award className="w-3.5 h-3.5" />
                </span>
              </div>
              <div className="mt-2">
                <span className="text-2xl font-semibold text-blue-700">{performance.achievement}%</span>
              </div>
            </div>
          </div>
        </div>

        {/* 5. Doctor Movement Map (Mapbox Route Tracking) */}
        {dashboardData?.doctor_stops && (
          <div className="space-y-3">
            <DoctorMovementMap
              mapboxConfig={dashboardData.mapbox || {}}
              doctorStops={dashboardData.doctor_stops}
              activeMR={null}
              height="380px"
            />
          </div>
        )}

        {/* 6. Today's Appointments & Follow-ups */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {/* Today's Visits */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-xs font-semibold text-slate-800 flex items-center gap-2">
                <Clock className="w-3.5 h-3.5 text-violet-600" />
                <span>Today's Visits</span>
              </h3>
              <Link href="/mr/visits" className="text-xs font-medium text-violet-600 hover:text-violet-800">
                Planner &rarr;
              </Link>
            </div>

            <div className="mt-3">
              {todayVisits.length === 0 ? (
                <div className="py-6 text-center text-slate-400 font-light">
                  <p className="text-xs">No visits scheduled today.</p>
                </div>
              ) : (
                <div className="divide-y divide-slate-100">
                  {todayVisits.map((visit, idx) => (
                    <div key={idx} className="py-2.5 flex items-center justify-between text-xs">
                      <div>
                        <span className="block font-medium text-slate-800">{visit.doctor}</span>
                        <span className="text-slate-400 font-light text-[11px]">{visit.hospital}</span>
                      </div>
                      <div className="text-right">
                        <span className="font-medium text-slate-700 block">{visit.time}</span>
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
          <div className="bg-white rounded-2xl border border-slate-200/80 p-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-xs font-semibold text-slate-800 flex items-center gap-2">
                <CalendarClock className="w-3.5 h-3.5 text-violet-600" />
                <span>Follow-ups</span>
              </h3>
              <span className="text-xs text-slate-400 font-light">{upcomingFollowups.length} queued</span>
            </div>

            <div className="mt-3">
              {upcomingFollowups.length === 0 ? (
                <div className="py-6 text-center text-slate-400 font-light">
                  <p className="text-xs">No follow-ups scheduled.</p>
                </div>
              ) : (
                <div className="divide-y divide-slate-100">
                  {upcomingFollowups.map((item, idx) => (
                    <div key={idx} className="py-2.5 flex items-center justify-between text-xs">
                      <div>
                        <span className="block font-medium text-slate-800">{item.doctor}</span>
                        <span className="text-slate-400 font-light text-[11px]">{item.purpose}</span>
                      </div>
                      <div className="text-right">
                        <span className="text-slate-500 font-light block text-[11px]">{item.date}</span>
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
