import { useState } from 'react';
import { usePage, Link, router } from '@inertiajs/react';
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
  ArrowRight,
  ChevronRight,
  Play,
  Package,
  MapPin,
  FileText
} from 'lucide-react';
import MRLayout from '../../layouts/MR/MRLayout';
import DoctorMovementMap from '../../components/maps/DoctorMovementMap';
import api from '../../services/api';

export default function Dashboard({ initialData = null }) {
  const { props } = usePage();
  const userName = props.auth?.user?.name || 'Representative';

  const [dashboardData, setDashboardData] = useState(initialData);
  const [loading, setLoading] = useState(false);
  const [activeFilter, setActiveFilter] = useState('all');

  const refreshData = async () => {
    setLoading(true);
    try {
      const response = await api.get('/api/v1/mr/dashboard');
      if (response.data?.success) {
        setDashboardData(response.data.data);
      }
    } catch {
      // Reload Inertia props as fallback
      router.reload({ only: ['initialData'] });
    } finally {
      setLoading(false);
    }
  };

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

  // Clean flat presentation cards (ZERO gradients)
  const presentationDecks = [
    {
      id: 'brand-overview',
      title: 'Company Overview & Trust',
      category: 'Brand Heritage',
      tag: 'ISO 9001:2015',
      image: '/images/ciplon_logo.png',
      isLogo: true,
      slidesCount: 'Fixed #1',
      description: 'Corporate accreditations, manufacturing standards, and clinical heritage.',
    },
    {
      id: 'amoxiclav',
      title: 'AmoxiClav 625 Duo',
      category: 'Antibiotics',
      tag: 'Amoxicillin + Clavulanic',
      image: '/images/box_factocel_ix.jpg',
      slidesCount: '12 Slides',
      description: 'Broad spectrum bactericidal coverage with beta-lactamase inhibitor.',
    },
    {
      id: 'ciplocid-dsr',
      title: 'Ciplocid-DSR Capsules',
      category: 'Gastroenterology',
      tag: 'Rabeprazole + Domperidone',
      image: '/images/box_globucel_sc.jpg',
      slidesCount: '8 Slides',
      description: 'Dual-action sustained release for GERD, dyspepsia, and acid reflux.',
    },
    {
      id: 'cardiovast',
      title: 'Cardiovast 20',
      category: 'Cardiology Care',
      tag: 'Atorvastatin Calcium IP',
      image: '/images/box_fibrogen_i.jpg',
      slidesCount: '10 Slides',
      description: 'Lipid-lowering HMG-CoA reductase inhibitor for cardiovascular prevention.',
    },
    {
      id: 'aerobreathe',
      title: 'AeroBreathe 200 Inhaler',
      category: 'Pulmonology',
      tag: 'Budesonide + Formoterol',
      image: '/images/box_globucel_sc.jpg',
      slidesCount: '14 Slides',
      description: 'Rapid onset bronchodilator with anti-inflammatory corticosteroid control.',
    },
    {
      id: 'ciplonpara',
      title: 'CiplonPara 650',
      category: 'Analgesics',
      tag: 'Paracetamol Tablets IP',
      image: '/images/box_factocel_ix.jpg',
      slidesCount: '6 Slides',
      description: 'Fast acting antipyretic & analgesic therapy for fever and pain relief.',
    },
  ];

  const filteredDecks = presentationDecks.filter((deck) => {
    if (activeFilter === 'antibiotics') return deck.category === 'Antibiotics';
    if (activeFilter === 'chronic') return deck.category === 'Cardiology Care' || deck.category === 'Pulmonology';
    return true;
  });

  return (
    <MRLayout title="MR Dashboard">
      <div className="space-y-6 pb-12 font-sans max-w-[1400px] mx-auto text-slate-800">

        {/* 1. Header Bar with Operational Greeting */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200/80">
          <div>
            <h2 className="text-xl sm:text-2xl font-semibold tracking-tight text-slate-800">
              Field Operations Dashboard
            </h2>
            <p className="text-xs text-slate-500 font-normal mt-0.5">
              Welcome back, <strong className="font-semibold text-slate-700">{userName}</strong>. Track your doctor visits, detailing decks, and territory route plan.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={refreshData}
              disabled={loading}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-white border border-slate-200/80 hover:bg-slate-50 rounded-xl transition-colors cursor-pointer disabled:opacity-50"
              title="Refresh Dashboard"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-slate-900' : 'text-slate-500'}`} />
              <span>Refresh</span>
            </button>

            <Link
              href="/mr/visits"
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-medium text-white bg-slate-900 hover:bg-slate-800 rounded-xl transition-colors cursor-pointer"
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>Daily Planner</span>
            </Link>
          </div>
        </div>

        {/* 2. 4 Execution Metric Cards (Clean Flat, Zero Gradient) */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Card 1: Today Visits */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-5 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-slate-500">Today's Visits</span>
              <span className="w-7 h-7 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center font-semibold text-xs">
                <Users className="w-3.5 h-3.5" />
              </span>
            </div>
            <p className="text-2xl font-semibold text-slate-800">{summary.today_visits}</p>
            <p className="text-[11px] text-slate-400 font-normal">Scheduled practitioner appointments</p>
          </div>

          {/* Card 2: Completed */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-5 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-slate-500">Completed Calls</span>
              <span className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-100 flex items-center justify-center font-semibold text-xs">
                <CheckCircle2 className="w-3.5 h-3.5" />
              </span>
            </div>
            <p className="text-2xl font-semibold text-emerald-700">{summary.completed_visits}</p>
            <p className="text-[11px] text-emerald-600 font-medium">Logged & verified calls</p>
          </div>

          {/* Card 3: Pending */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-5 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-slate-500">Pending Visits</span>
              <span className="w-7 h-7 rounded-lg bg-amber-50 text-amber-700 border border-amber-100 flex items-center justify-center font-semibold text-xs">
                <Clock className="w-3.5 h-3.5" />
              </span>
            </div>
            <p className="text-2xl font-semibold text-amber-700">{summary.pending_visits}</p>
            <p className="text-[11px] text-amber-600 font-medium">Scheduled for today</p>
          </div>

          {/* Card 4: Monthly Quota */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-5 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-slate-500">Monthly Coverage</span>
              <span className="w-7 h-7 rounded-lg bg-violet-50 text-violet-700 border border-violet-100 flex items-center justify-center font-semibold text-xs">
                <Award className="w-3.5 h-3.5" />
              </span>
            </div>
            <p className="text-2xl font-semibold text-violet-700">{performance.achievement}%</p>
            <p className="text-[11px] text-slate-400 font-normal">
              {performance.doctors.covered} of {performance.doctors.target} Doctors covered
            </p>
          </div>
        </div>

        {/* 3. Quick Action Shortcut Links */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <Link
            href="/mr/detailing"
            className="p-3.5 rounded-2xl bg-white border border-slate-200/80 hover:bg-slate-50 transition-colors flex items-center justify-between group cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center">
                <Presentation className="w-4 h-4" />
              </div>
              <div>
                <span className="block text-xs font-semibold text-slate-800">Doctor E-Detailing</span>
                <span className="block text-[11px] text-slate-400">Launch interactive slide deck</span>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-slate-700 transition-colors" />
          </Link>

          <Link
            href="/mrconnect/pob-order"
            className="p-3.5 rounded-2xl bg-white border border-slate-200/80 hover:bg-slate-50 transition-colors flex items-center justify-between group cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center">
                <Package className="w-4 h-4" />
              </div>
              <div>
                <span className="block text-xs font-semibold text-slate-800">Book POB Order</span>
                <span className="block text-[11px] text-slate-400">Personal chemist orders</span>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-slate-700 transition-colors" />
          </Link>

          <Link
            href="/mrconnect/tour-plan"
            className="p-3.5 rounded-2xl bg-white border border-slate-200/80 hover:bg-slate-50 transition-colors flex items-center justify-between group cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center">
                <Calendar className="w-4 h-4" />
              </div>
              <div>
                <span className="block text-xs font-semibold text-slate-800">Monthly Tour Plan</span>
                <span className="block text-[11px] text-slate-400">Submit route for approval</span>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-slate-700 transition-colors" />
          </Link>
        </div>

        {/* 4. Interactive Detailing Visual Aid Decks (Flat Clean Minimal) */}
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-base font-semibold text-slate-800">
                Visual Aid Presentation Decks
              </h3>
              <p className="text-xs text-slate-400 font-normal">
                Approved digital scientific visual aids for in-clinic physician detailing.
              </p>
            </div>

            {/* Flat Filter Pills */}
            <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-100 border border-slate-200/60 w-fit">
              <button
                type="button"
                onClick={() => setActiveFilter('all')}
                className={`px-3 py-1 rounded-lg text-xs transition-colors cursor-pointer ${
                  activeFilter === 'all'
                    ? 'bg-white text-slate-900 font-semibold shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900 font-normal'
                }`}
              >
                All Formulations
              </button>
              <button
                type="button"
                onClick={() => setActiveFilter('antibiotics')}
                className={`px-3 py-1 rounded-lg text-xs transition-colors cursor-pointer ${
                  activeFilter === 'antibiotics'
                    ? 'bg-white text-slate-900 font-semibold shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900 font-normal'
                }`}
              >
                Antibiotics
              </button>
              <button
                type="button"
                onClick={() => setActiveFilter('chronic')}
                className={`px-3 py-1 rounded-lg text-xs transition-colors cursor-pointer ${
                  activeFilter === 'chronic'
                    ? 'bg-white text-slate-900 font-semibold shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900 font-normal'
                }`}
              >
                Cardio & Respiratory
              </button>
            </div>
          </div>

          {/* Decks Grid (Clean Solid White Cards, Zero Gradients) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredDecks.map((deck) => (
              <div
                key={deck.id}
                className="bg-white rounded-2xl border border-slate-200/80 p-5 flex flex-col justify-between space-y-4 hover:border-slate-300 transition-colors"
              >
                <div className="space-y-3">
                  {/* Top Tags */}
                  <div className="flex items-center justify-between">
                    <span className="px-2 py-0.5 rounded-md text-[10px] font-semibold uppercase bg-slate-100 text-slate-700">
                      {deck.category}
                    </span>
                    <span className="text-[11px] font-mono text-slate-400">
                      {deck.slidesCount}
                    </span>
                  </div>

                  {/* Clean Product Visual Container */}
                  <div className="h-28 bg-slate-50 rounded-xl border border-slate-100 p-2 flex items-center justify-center relative overflow-hidden">
                    <img
                      src={deck.image}
                      alt={deck.title}
                      className="max-h-full max-w-full object-contain"
                      onError={(e) => {
                        e.currentTarget.src = '/images/box_factocel_ix.jpg';
                      }}
                    />
                  </div>

                  {/* Title & Description */}
                  <div>
                    <h4 className="text-sm font-semibold text-slate-800">{deck.title}</h4>
                    <p className="text-[11px] font-medium text-slate-500 mt-0.5">{deck.tag}</p>
                    <p className="text-xs text-slate-400 line-clamp-2 mt-1 leading-relaxed">
                      {deck.description}
                    </p>
                  </div>
                </div>

                {/* Launch Presentation Action */}
                <Link
                  href="/mr/detailing"
                  className="w-full py-2 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-medium flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Play className="w-3.5 h-3.5 fill-white" />
                  <span>Launch Detailing Deck</span>
                </Link>
              </div>
            ))}
          </div>
        </div>

        {/* 5. Live Doctor Route Map (Mapbox Clean) */}
        {dashboardData?.doctor_stops && (
          <div className="bg-white rounded-2xl border border-slate-200/80 p-5 space-y-3">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-violet-600" />
                <h3 className="text-sm font-semibold text-slate-800">
                  Today's Field Route & Doctor Movement
                </h3>
              </div>
              <span className="text-xs text-slate-400 font-normal">
                {dashboardData.doctor_stops.visited_count} Visited • {dashboardData.doctor_stops.pending_count} Pending
              </span>
            </div>

            <DoctorMovementMap
              mapboxConfig={dashboardData.mapbox || {}}
              doctorStops={dashboardData.doctor_stops}
              activeMR={null}
              height="360px"
            />
          </div>
        )}

        {/* 6. Today's Appointments & Follow-ups */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {/* Today's Visits */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-5 space-y-3">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-sm font-semibold text-slate-800 flex items-center gap-2">
                <Clock className="w-4 h-4 text-slate-600" />
                <span>Today's Doctor Visits</span>
              </h3>
              <Link href="/mr/visits" className="text-xs font-medium text-slate-700 hover:text-slate-900">
                View Planner &rarr;
              </Link>
            </div>

            {todayVisits.length === 0 ? (
              <div className="py-8 text-center text-slate-400 text-xs">
                No doctor visits scheduled today.
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {todayVisits.map((visit, idx) => (
                  <div key={idx} className="py-3 flex items-center justify-between text-xs">
                    <div>
                      <span className="block font-semibold text-slate-800">{visit.doctor}</span>
                      <span className="text-slate-400 text-[11px]">{visit.hospital}</span>
                    </div>
                    <div className="text-right">
                      <span className="font-mono text-slate-700 block text-xs">{visit.time}</span>
                      <span className={`inline-block mt-0.5 text-[10px] font-semibold px-2 py-0.5 rounded-md ${
                        visit.status === 'Completed'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-100'
                          : 'bg-amber-50 text-amber-700 border border-amber-100'
                      }`}>
                        {visit.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Follow-ups */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-5 space-y-3">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-sm font-semibold text-slate-800 flex items-center gap-2">
                <CalendarClock className="w-4 h-4 text-slate-600" />
                <span>Upcoming Follow-ups</span>
              </h3>
              <span className="text-xs text-slate-400">{upcomingFollowups.length} queued</span>
            </div>

            {upcomingFollowups.length === 0 ? (
              <div className="py-8 text-center text-slate-400 text-xs">
                No follow-ups scheduled.
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {upcomingFollowups.map((item, idx) => (
                  <div key={idx} className="py-3 flex items-center justify-between text-xs">
                    <div>
                      <span className="block font-semibold text-slate-800">{item.doctor}</span>
                      <span className="text-slate-400 text-[11px]">{item.purpose}</span>
                    </div>
                    <div className="text-right">
                      <span className="text-slate-600 text-xs block">{item.date}</span>
                      <span className="inline-block mt-0.5 text-[10px] font-semibold px-2 py-0.5 rounded-md bg-slate-100 text-slate-700">
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
    </MRLayout>
  );
}
