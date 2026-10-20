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
  Activity,
  Award,
  Presentation
} from 'lucide-react';
import MRLayout from '../../layouts/MR/MRLayout';
import api from '../../services/api';

export default function Dashboard() {
  const { props } = usePage();
  const userName = props.auth?.user?.name || 'Representative';

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dashboardData, setDashboardData] = useState(null);

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

  return (
    <MRLayout title="MR Dashboard">
      <div className="space-y-6 pb-12">
        {/* Welcome Banner */}
        <div className="bg-white rounded-xl border border-slate-200/80 p-5 sm:p-6 shadow-[0_1px_3px_rgba(0,0,0,0.04)] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-teal-700 mb-1">
              <Activity className="w-4 h-4" />
              <span>Medical Representative Daily Command</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight capitalize">
              Welcome Back, {userName}
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              Track doctor visits, sample distributions, and monthly sales quota achievement.
            </p>
          </div>

          <div className="flex items-center gap-2.5 self-start sm:self-auto flex-wrap">
            <Link
              href="/mr/detailing"
              className="inline-flex items-center gap-2 px-4 py-2 text-xs font-bold text-white bg-[#0c2340] hover:bg-slate-800 border border-[#c59324]/40 rounded-xl transition-all shadow-xs cursor-pointer"
            >
              <Presentation className="w-4 h-4 text-[#dfad36]" />
              <span>Doctor E-Detailing</span>
            </Link>

            <button
              type="button"
              onClick={fetchDashboardData}
              disabled={loading}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 rounded-lg transition-colors cursor-pointer shadow-xs disabled:opacity-50"
              title="Refresh dashboard metrics"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
              <span>Refresh Data</span>
            </button>
          </div>
        </div>

        {/* Error State */}
        {error && (
          <div className="bg-rose-50 border border-rose-200 rounded-xl p-4 flex items-start justify-between gap-3 text-rose-900">
            <div className="flex items-start gap-2.5">
              <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
              <div>
                <strong className="block text-xs font-bold text-rose-950">Error Loading Dashboard</strong>
                <p className="text-xs text-rose-700 mt-0.5">{error}</p>
              </div>
            </div>
            <button
              type="button"
              onClick={fetchDashboardData}
              className="px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer shrink-0"
            >
              Retry
            </button>
          </div>
        )}

        {/* 1. Summary Cards (4 stats: 4 desktop, 2 tablet, 1 mobile) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Card 1: Today's Visits */}
          <div className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-[0_1px_3px_rgba(0,0,0,0.04)] flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500">Today's Visits</span>
              <span className="w-9 h-9 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center">
                <Users className="w-4.5 h-4.5" />
              </span>
            </div>
            <div className="mt-4">
              {loading ? (
                <div className="h-8 w-16 bg-slate-100 animate-pulse rounded" />
              ) : (
                <span className="text-2xl font-bold text-slate-900 tracking-tight">{summary.today_visits}</span>
              )}
              <span className="text-[11px] text-slate-400 block mt-1">Scheduled appointments</span>
            </div>
          </div>

          {/* Card 2: Completed Visits */}
          <div className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-[0_1px_3px_rgba(0,0,0,0.04)] flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500">Completed Visits</span>
              <span className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
                <CheckCircle2 className="w-4.5 h-4.5" />
              </span>
            </div>
            <div className="mt-4">
              {loading ? (
                <div className="h-8 w-16 bg-slate-100 animate-pulse rounded" />
              ) : (
                <span className="text-2xl font-bold text-emerald-700 tracking-tight">{summary.completed_visits}</span>
              )}
              <span className="text-[11px] text-slate-400 block mt-1">DCR logged</span>
            </div>
          </div>

          {/* Card 3: Pending Visits */}
          <div className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-[0_1px_3px_rgba(0,0,0,0.04)] flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500">Pending Visits</span>
              <span className="w-9 h-9 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center">
                <Clock className="w-4.5 h-4.5" />
              </span>
            </div>
            <div className="mt-4">
              {loading ? (
                <div className="h-8 w-16 bg-slate-100 animate-pulse rounded" />
              ) : (
                <span className="text-2xl font-bold text-amber-700 tracking-tight">{summary.pending_visits}</span>
              )}
              <span className="text-[11px] text-slate-400 block mt-1">Remaining for today</span>
            </div>
          </div>

          {/* Card 4: Follow-ups Due */}
          <div className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-[0_1px_3px_rgba(0,0,0,0.04)] flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500">Follow-ups Due</span>
              <span className="w-9 h-9 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center">
                <CalendarClock className="w-4.5 h-4.5" />
              </span>
            </div>
            <div className="mt-4">
              {loading ? (
                <div className="h-8 w-16 bg-slate-100 animate-pulse rounded" />
              ) : (
                <span className="text-2xl font-bold text-blue-700 tracking-tight">{summary.follow_ups_due}</span>
              )}
              <span className="text-[11px] text-slate-400 block mt-1">Scheduled for this week</span>
            </div>
          </div>
        </div>

        {/* 2. Monthly Performance Section */}
        <div className="bg-white rounded-xl border border-slate-200/80 p-5 sm:p-6 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-5">
            <div>
              <h3 className="text-sm font-bold text-slate-900 tracking-tight flex items-center gap-2">
                <Target className="w-4 h-4 text-teal-700" />
                <span>Monthly Target & Performance</span>
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">Coverage and promotion targets for the active operational cycle.</p>
            </div>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-teal-50 text-teal-800">
              Active Cycle
            </span>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-20 bg-slate-100 animate-pulse rounded-lg" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Metric 1: Visits */}
              <div className="p-4 rounded-xl bg-slate-50/70 border border-slate-150 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-700">Visits</span>
                  <span className="font-bold text-slate-900">
                    {performance.visits.completed} / {performance.visits.target}
                  </span>
                </div>
                <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                  <div 
                    className="bg-teal-600 h-full rounded-full transition-all duration-500"
                    style={{ 
                      width: `${performance.visits.target > 0 ? Math.min(100, Math.round((performance.visits.completed / performance.visits.target) * 100)) : 0}%` 
                    }}
                  />
                </div>
                <span className="text-[11px] text-slate-400 block text-right font-medium">
                  {performance.visits.target > 0 ? Math.round((performance.visits.completed / performance.visits.target) * 100) : 0}% completed
                </span>
              </div>

              {/* Metric 2: Doctor Coverage */}
              <div className="p-4 rounded-xl bg-slate-50/70 border border-slate-150 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-700">Doctor Coverage</span>
                  <span className="font-bold text-slate-900">
                    {performance.doctors.covered} / {performance.doctors.target}
                  </span>
                </div>
                <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                  <div 
                    className="bg-blue-600 h-full rounded-full transition-all duration-500"
                    style={{ 
                      width: `${performance.doctors.target > 0 ? Math.min(100, Math.round((performance.doctors.covered / performance.doctors.target) * 100)) : 0}%` 
                    }}
                  />
                </div>
                <span className="text-[11px] text-slate-400 block text-right font-medium">
                  {performance.doctors.target > 0 ? Math.round((performance.doctors.covered / performance.doctors.target) * 100) : 0}% reached
                </span>
              </div>

              {/* Metric 3: Product Promotion */}
              <div className="p-4 rounded-xl bg-slate-50/70 border border-slate-150 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-700">Product Promotion</span>
                  <span className="font-bold text-slate-900">
                    {performance.product_promotions.completed} / {performance.product_promotions.target}
                  </span>
                </div>
                <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                  <div 
                    className="bg-purple-600 h-full rounded-full transition-all duration-500"
                    style={{ 
                      width: `${performance.product_promotions.target > 0 ? Math.min(100, Math.round((performance.product_promotions.completed / performance.product_promotions.target) * 100)) : 0}%` 
                    }}
                  />
                </div>
                <span className="text-[11px] text-slate-400 block text-right font-medium">
                  {performance.product_promotions.target > 0 ? Math.round((performance.product_promotions.completed / performance.product_promotions.target) * 100) : 0}% detailed
                </span>
              </div>

              {/* Metric 4: Target Achievement */}
              <div className="p-4 rounded-xl bg-teal-50/60 border border-teal-200/70 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-teal-950">Target Achievement</span>
                  <Award className="w-4 h-4 text-teal-700" />
                </div>
                <div className="text-2xl font-black text-teal-800 tracking-tight">
                  {performance.achievement}%
                </div>
                <span className="text-[11px] text-teal-700 block font-medium">
                  Overall metric index
                </span>
              </div>
            </div>
          )}
        </div>

        {/* 3. Today's Visits & Upcoming Follow-ups (2-column layout) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Today's Visits Preview */}
          <div className="bg-white rounded-xl border border-slate-200/80 p-5 sm:p-6 shadow-[0_1px_3px_rgba(0,0,0,0.04)] flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <Clock className="w-4 h-4 text-teal-700" />
                  <span>Today's Doctor Visits</span>
                </h3>
                <span className="text-[11px] font-semibold text-slate-500">
                  {todayVisits.length} Scheduled
                </span>
              </div>

              <div className="mt-4">
                {loading ? (
                  <div className="space-y-3">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="h-12 bg-slate-100 animate-pulse rounded-lg" />
                    ))}
                  </div>
                ) : todayVisits.length === 0 ? (
                  <div className="py-10 text-center text-slate-400 font-medium">
                    <Building2 className="w-8 h-8 mx-auto mb-2 opacity-40 text-slate-400" />
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
                          <span className="text-[10px] text-teal-700 bg-teal-50 px-2 py-0.5 rounded-full font-medium">
                            {visit.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Upcoming Follow-ups Preview */}
          <div className="bg-white rounded-xl border border-slate-200/80 p-5 sm:p-6 shadow-[0_1px_3px_rgba(0,0,0,0.04)] flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <CalendarClock className="w-4 h-4 text-teal-700" />
                  <span>Upcoming Follow-ups</span>
                </h3>
                <span className="text-[11px] font-semibold text-slate-500">
                  {upcomingFollowups.length} Queued
                </span>
              </div>

              <div className="mt-4">
                {loading ? (
                  <div className="space-y-3">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="h-12 bg-slate-100 animate-pulse rounded-lg" />
                    ))}
                  </div>
                ) : upcomingFollowups.length === 0 ? (
                  <div className="py-10 text-center text-slate-400 font-medium">
                    <Calendar className="w-8 h-8 mx-auto mb-2 opacity-40 text-slate-400" />
                    <p className="text-xs">No upcoming follow-ups.</p>
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

        {/* 4. Recent Activity Preview */}
        <div className="bg-white rounded-xl border border-slate-200/80 p-5 sm:p-6 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-teal-700" />
              <span>Recent Field Activity</span>
            </h3>
            <span className="text-[11px] font-semibold text-slate-500">Live Feed</span>
          </div>

          {loading ? (
            <div className="space-y-2.5">
              {[1, 2].map((i) => (
                <div key={i} className="h-10 bg-slate-100 animate-pulse rounded-lg" />
              ))}
            </div>
          ) : recentActivities.length === 0 ? (
            <div className="py-8 text-center text-slate-400 font-medium">
              <p className="text-xs">No recent activity.</p>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {recentActivities.map((act, idx) => (
                <div key={idx} className="py-2.5 text-xs flex items-center justify-between">
                  <span className="text-slate-800">{act.description}</span>
                  <span className="text-slate-400 text-[11px]">{act.time}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </MRLayout>
  );
}
