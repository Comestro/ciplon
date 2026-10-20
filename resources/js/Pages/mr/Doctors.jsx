import { useState, useEffect, useMemo } from 'react';
import { Link } from '@inertiajs/react';
import axios from 'axios';
import { 
  UserCheck, 
  Search, 
  Plus, 
  MapPin, 
  Phone, 
  Mail, 
  Clock, 
  Calendar, 
  Filter, 
  MoreVertical, 
  Edit2, 
  Trash2, 
  Eye, 
  Target, 
  Sparkles, 
  RefreshCw, 
  X, 
  Building2, 
  Stethoscope,
  CheckCircle2,
  AlertCircle,
  LayoutGrid,
  List
} from 'lucide-react';
import toast from 'react-hot-toast';
import MRLayout from '../../layouts/MR/MRLayout';

const SPECIALTY_OPTIONS = [
  'General Medicine',
  'Cardiology',
  'Diabetology',
  'Orthopedics',
  'Pediatrics',
  'Pulmonology',
  'Gynecology',
  'Dermatology',
  'Neurology',
  'Gastroenterology',
  'ENT',
  'Ophthalmology'
];

const TIER_CONFIG = {
  core: { label: 'Core KOL', bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200', dot: 'bg-emerald-500' },
  class_a: { label: 'Class A', bg: 'bg-teal-50', text: 'text-teal-700', border: 'border-teal-200', dot: 'bg-teal-500' },
  class_b: { label: 'Class B', bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200', dot: 'bg-amber-500' },
  class_c: { label: 'Class C', bg: 'bg-slate-100', text: 'text-slate-600', border: 'border-slate-200', dot: 'bg-slate-400' }
};

export default function Doctors({ initialFilters = {} }) {
  const [doctors, setDoctors] = useState([]);
  const [meta, setMeta] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filters state
  const [search, setSearch] = useState(initialFilters.search || '');
  const [specialization, setSpecialization] = useState(initialFilters.specialization || 'all');
  const [tier, setTier] = useState(initialFilters.tier || 'all');
  const [territory, setTerritory] = useState(initialFilters.territory || 'all');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'table'

  // Profile drawer & delete dialog
  const [profileDoctor, setProfileDoctor] = useState(null);
  const [deleteDoctorId, setDeleteDoctorId] = useState(null);

  // Fetch doctors from REST API
  const fetchDoctors = async () => {
    setLoading(true);
    setError(null);
    try {
      const params = {};
      if (search.trim()) params.search = search.trim();
      if (specialization !== 'all') params.specialization = specialization;
      if (tier !== 'all') params.tier = tier;
      if (territory !== 'all') params.territory = territory;

      const res = await axios.get('/api/v1/mr/doctors', { params });
      if (res.data?.success) {
        setDoctors(res.data.data || []);
        setMeta(res.data.meta || null);
      }
    } catch (err) {
      console.error('Failed to load doctors:', err);
      setError(err.response?.data?.message || 'Unable to connect to field service. Please retry.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchDoctors();
    }, 250);
    return () => clearTimeout(timer);
  }, [search, specialization, tier, territory]);

  const handleDeleteDoctor = async (id) => {
    try {
      const res = await axios.delete(`/api/v1/mr/doctors/${id}`);
      if (res.data?.success) {
        toast.success('Doctor removed from directory');
        setDeleteDoctorId(null);
        fetchDoctors();
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to remove doctor.');
    }
  };

  const handleResetFilters = () => {
    setSearch('');
    setSpecialization('all');
    setTier('all');
    setTerritory('all');
  };

  return (
    <MRLayout title="Doctor Directory">
      <div className="space-y-5 max-w-7xl mx-auto">
        
        {/* Top Header & Action */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-slate-200/80">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-semibold text-slate-800 tracking-tight">Doctor Directory</h1>
              {meta?.total !== undefined && (
                <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-slate-100 text-slate-700 border border-slate-200">
                  {meta.total} Doctors
                </span>
              )}
            </div>
            <p className="text-xs text-slate-500 font-normal mt-0.5">
              Healthcare professionals mapped to your field territory & visit schedules
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={fetchDoctors}
              disabled={loading}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200/80 bg-white hover:bg-slate-50 text-slate-700 text-xs font-medium transition-colors cursor-pointer"
              title="Refresh directory"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-slate-900' : 'text-slate-500'}`} />
              <span>Refresh</span>
            </button>

            <Link
              href="/mr/doctors/create"
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-medium text-xs transition-colors cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5 stroke-[2]" />
              <span>Add Doctor</span>
            </Link>
          </div>
        </div>

        {/* Metrics Overview Strip */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-slate-500">Total Directory</span>
              <div className="w-7 h-7 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center">
                <UserCheck className="w-3.5 h-3.5" />
              </div>
            </div>
            <div className="text-2xl font-semibold text-slate-800">
              {meta ? meta.total : '—'}
            </div>
            <p className="text-[11px] text-slate-400 font-normal">
              {meta?.active_count ?? 0} active in territory
            </p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-slate-500">Core KOLs</span>
              <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-100 flex items-center justify-center">
                <Sparkles className="w-3.5 h-3.5" />
              </div>
            </div>
            <div className="text-2xl font-semibold text-emerald-700">
              {meta ? meta.core_count : '—'}
            </div>
            <p className="text-[11px] text-emerald-600 font-medium">Top priority prescribers</p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-slate-500">Monthly Call Target</span>
              <div className="w-7 h-7 rounded-lg bg-violet-50 text-violet-700 border border-violet-100 flex items-center justify-center">
                <Target className="w-3.5 h-3.5" />
              </div>
            </div>
            <div className="text-2xl font-semibold text-violet-700">
              {meta ? meta.total_monthly_target_visits : '—'}
            </div>
            <p className="text-[11px] text-slate-400 font-normal">Scheduled field visits</p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-slate-500">Field Zones</span>
              <div className="w-7 h-7 rounded-lg bg-amber-50 text-amber-700 border border-amber-100 flex items-center justify-center">
                <MapPin className="w-3.5 h-3.5" />
              </div>
            </div>
            <div className="text-2xl font-semibold text-amber-700">
              {meta ? (meta.territories?.length || 0) : '—'}
            </div>
            <p className="text-[11px] text-slate-400 font-normal">Assigned territories</p>
          </div>
        </div>

        {/* Filter & Search Bar */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 space-y-3">
          <div className="flex flex-col md:flex-row items-stretch md:items-center gap-2.5">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by doctor name, clinic, territory, or phone..."
                className="w-full pl-9 pr-8 py-2 bg-slate-50 border border-slate-200/80 focus:border-slate-900 focus:bg-white rounded-xl text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-slate-900 transition-all"
              />
              {search && (
                <button
                  type="button"
                  onClick={() => setSearch('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Specialization Filter */}
            <div className="w-full md:w-48">
              <select
                value={specialization}
                onChange={(e) => setSpecialization(e.target.value)}
                className="w-full py-2 px-3 bg-slate-50 border border-slate-200/80 focus:border-slate-900 focus:bg-white rounded-xl text-xs text-slate-700 focus:outline-none focus:ring-1 focus:ring-slate-900 cursor-pointer"
              >
                <option value="all">All Specialties</option>
                {SPECIALTY_OPTIONS.map((spec) => (
                  <option key={spec} value={spec}>{spec}</option>
                ))}
              </select>
            </div>

            {/* Tier Filter */}
            <div className="w-full md:w-36">
              <select
                value={tier}
                onChange={(e) => setTier(e.target.value)}
                className="w-full py-2 px-3 bg-slate-50 border border-slate-200/80 focus:border-slate-900 focus:bg-white rounded-xl text-xs text-slate-700 focus:outline-none focus:ring-1 focus:ring-slate-900 cursor-pointer"
              >
                <option value="all">All Tiers</option>
                <option value="core">Core KOL</option>
                <option value="class_a">Class A</option>
                <option value="class_b">Class B</option>
                <option value="class_c">Class C</option>
              </select>
            </div>

            {/* View Mode Toggle */}
            <div className="flex items-center gap-1 border border-slate-200/80 rounded-xl p-0.5 bg-slate-50 self-end md:self-auto">
              <button
                type="button"
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                  viewMode === 'grid' ? 'bg-white text-slate-900 font-semibold shadow-2xs' : 'text-slate-400 hover:text-slate-700'
                }`}
                title="Card grid view"
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => setViewMode('table')}
                className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                  viewMode === 'table' ? 'bg-white text-slate-900 font-semibold shadow-2xs' : 'text-slate-400 hover:text-slate-700'
                }`}
                title="Table view"
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Active Filter Chips / Clear */}
          {(search || specialization !== 'all' || tier !== 'all' || territory !== 'all') && (
            <div className="flex items-center gap-2 pt-1 text-[11px] text-slate-500 flex-wrap">
              <span>Active filters:</span>
              {search && (
                <span className="inline-flex items-center gap-1 bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md font-medium border border-slate-200">
                  Search: "{search}"
                  <X className="w-3 h-3 cursor-pointer" onClick={() => setSearch('')} />
                </span>
              )}
              {specialization !== 'all' && (
                <span className="inline-flex items-center gap-1 bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md font-medium border border-slate-200">
                  {specialization}
                  <X className="w-3 h-3 cursor-pointer" onClick={() => setSpecialization('all')} />
                </span>
              )}
              {tier !== 'all' && (
                <span className="inline-flex items-center gap-1 bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md font-medium border border-slate-200">
                  Tier: {TIER_CONFIG[tier]?.label || tier}
                  <X className="w-3 h-3 cursor-pointer" onClick={() => setTier('all')} />
                </span>
              )}
              <button
                type="button"
                onClick={handleResetFilters}
                className="text-slate-700 hover:text-slate-900 hover:underline font-semibold ml-1 cursor-pointer"
              >
                Clear all
              </button>
            </div>
          )}
        </div>

        {/* Content Section: Loading / Error / Empty / Grid / Table */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <div key={n} className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs animate-pulse space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-slate-100" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-slate-100 rounded w-3/4" />
                    <div className="h-3 bg-slate-100 rounded w-1/2" />
                  </div>
                </div>
                <div className="h-3 bg-slate-100 rounded w-full" />
                <div className="h-3 bg-slate-100 rounded w-2/3" />
                <div className="h-8 bg-slate-100 rounded-xl mt-4" />
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="bg-rose-50 border border-rose-200 rounded-2xl p-6 text-center space-y-2">
            <AlertCircle className="w-8 h-8 text-rose-600 mx-auto" />
            <h3 className="text-sm font-bold text-rose-900">{error}</h3>
            <button
              type="button"
              onClick={fetchDoctors}
              className="text-xs font-semibold text-rose-700 hover:underline cursor-pointer"
            >
              Retry Loading
            </button>
          </div>
        ) : doctors.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200/80 p-12 text-center space-y-3">
            <div className="w-14 h-14 rounded-2xl bg-slate-100 text-slate-700 flex items-center justify-center mx-auto">
              <Stethoscope className="w-7 h-7 stroke-[1.8]" />
            </div>
            <h3 className="text-base font-bold text-slate-800">No Doctors Found</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              {search || specialization !== 'all' || tier !== 'all' 
                ? 'No healthcare professionals match your current search criteria or filters.' 
                : 'Your doctor directory is currently empty. Add your first doctor to begin planning visits.'}
            </p>
            {search || specialization !== 'all' || tier !== 'all' ? (
              <button
                type="button"
                onClick={handleResetFilters}
                className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-colors cursor-pointer"
              >
                Clear Filters
              </button>
            ) : (
              <Link href="/mr/doctors/create" className="px-3.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-medium transition-colors cursor-pointer">+ Add First Doctor</Link>
            )}
          </div>
        ) : viewMode === 'grid' ? (
          /* Cards Grid View */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {doctors.map((doc) => {
              const tierInfo = TIER_CONFIG[doc.tier] || TIER_CONFIG.class_a;
              return (
                <div
                  key={doc.id}
                  className="bg-white rounded-2xl border border-slate-200/80 hover:border-slate-300 transition-colors flex flex-col overflow-hidden group"
                >
                  {/* Card Header */}
                  <div className="p-5 pb-3 space-y-3 flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-3 min-w-0">
                        {/* Avatar Initials */}
                        <div className="w-10 h-10 rounded-xl bg-slate-900 text-white font-semibold text-xs flex items-center justify-center shrink-0">
                          {doc.name.replace('Dr. ', '').charAt(0)}
                        </div>
                        <div className="min-w-0 flex-1">
                          <h3 className="text-sm font-semibold text-slate-800 truncate leading-tight">
                            {doc.name}
                          </h3>
                          {doc.qualification && (
                            <p className="text-[11px] text-slate-400 truncate mt-0.5">{doc.qualification}</p>
                          )}
                        </div>
                      </div>

                      {/* Tier Badge */}
                      <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[10px] font-semibold uppercase tracking-wider shrink-0 border ${tierInfo.bg} ${tierInfo.text} ${tierInfo.border}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${tierInfo.dot}`} />
                        {tierInfo.label}
                      </span>
                    </div>

                    {/* Specialization & Calls Target */}
                    <div className="flex items-center gap-2 pt-1 flex-wrap">
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium bg-slate-100 text-slate-700">
                        <Stethoscope className="w-3.5 h-3.5 text-slate-500" />
                        {doc.specialization}
                      </span>
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium bg-slate-100 text-slate-700">
                        <Target className="w-3.5 h-3.5 text-violet-600" />
                        {doc.target_frequency_per_month} calls / mo
                      </span>
                    </div>

                    {/* Clinic Details */}
                    <div className="space-y-1.5 pt-2 text-xs text-slate-600 border-t border-slate-100">
                      <div className="flex items-start gap-2">
                        <Building2 className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                        <span className="font-medium text-slate-700 line-clamp-1">{doc.clinic_hospital_name}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span className="truncate text-slate-500">{doc.territory}{doc.city ? `, ${doc.city}` : ''}</span>
                      </div>
                      {doc.visiting_hours && (
                        <div className="flex items-center gap-2 text-[11px] text-slate-400 font-normal">
                          <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <span className="truncate">{doc.visiting_hours} ({doc.visiting_days || 'Daily'})</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Card Bottom Actions */}
                  <div className="px-5 py-3 bg-slate-50/70 border-t border-slate-100 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      {doc.phone && (
                        <a
                          href={`tel:${doc.phone.replace(/\s+/g, '')}`}
                          className="flex items-center gap-1.5 text-slate-700 hover:text-slate-900 font-medium"
                          title="Click to call"
                        >
                          <Phone className="w-3.5 h-3.5 text-sky-600" />
                          <span>{doc.phone}</span>
                        </a>
                      )}
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => setProfileDoctor(doc)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-white transition-colors cursor-pointer"
                        title="View Full Profile"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <Link href={`/mr/doctors/${doc.id}/edit`} className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-white transition-colors cursor-pointer" title="Edit Doctor Details"><Edit2 className="w-4 h-4" /></Link>
                      <button
                        type="button"
                        onClick={() => setDeleteDoctorId(doc.id)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-white transition-colors cursor-pointer"
                        title="Remove Doctor"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          /* Table View */
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-semibold border-b border-slate-200 text-[10px]">
                  <tr>
                    <th className="py-3 px-4">Doctor</th>
                    <th className="py-3 px-4">Specialty</th>
                    <th className="py-3 px-4">Clinic & Location</th>
                    <th className="py-3 px-4">Tier</th>
                    <th className="py-3 px-4">Target Calls</th>
                    <th className="py-3 px-4">Contact</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {doctors.map((doc) => {
                    const tierInfo = TIER_CONFIG[doc.tier] || TIER_CONFIG.class_a;
                    return (
                      <tr key={doc.id} className="hover:bg-slate-50/60 transition-colors">
                        <td className="py-3.5 px-4 font-bold text-slate-900">
                          <div>{doc.name}</div>
                          {doc.qualification && <div className="text-[10px] text-slate-500 font-normal">{doc.qualification}</div>}
                        </td>
                        <td className="py-3.5 px-4">
                          <span className="font-semibold text-slate-800">{doc.specialization}</span>
                        </td>
                        <td className="py-3.5 px-4">
                          <div className="font-medium text-slate-900">{doc.clinic_hospital_name}</div>
                          <div className="text-[10px] text-slate-500">{doc.territory}</div>
                        </td>
                        <td className="py-3.5 px-4">
                          <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider border ${tierInfo.bg} ${tierInfo.text} ${tierInfo.border}`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${tierInfo.dot}`} />
                            {tierInfo.label}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 font-semibold text-slate-800">
                          {doc.target_frequency_per_month} / mo
                        </td>
                        <td className="py-3.5 px-4">
                          <div className="font-medium text-slate-900">{doc.phone}</div>
                          {doc.email && <div className="text-[10px] text-slate-500">{doc.email}</div>}
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <div className="flex items-center justify-end gap-1">
                            <button
                              type="button"
                              onClick={() => setProfileDoctor(doc)}
                              className="p-1 text-slate-400 hover:text-slate-900 transition-colors cursor-pointer"
                              title="View"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            <Link href={`/mr/doctors/${doc.id}/edit`} className="p-1 text-slate-400 hover:text-slate-900 transition-colors cursor-pointer" title="Edit"><Edit2 className="w-4 h-4" /></Link>
                            <button
                              type="button"
                              onClick={() => setDeleteDoctorId(doc.id)}
                              className="p-1 text-slate-400 hover:text-rose-600 transition-colors cursor-pointer"
                              title="Delete"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

      </div>

      {/* Doctor Profile Drawer / Modal */}
      {profileDoctor && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-slate-900 text-white font-bold text-base flex items-center justify-center shadow-xs">
                  {profileDoctor.name.replace('Dr. ', '').charAt(0)}
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">{profileDoctor.name}</h3>
                  <p className="text-xs text-slate-500">{profileDoctor.qualification || profileDoctor.specialization}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setProfileDoctor(null)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="bg-slate-50 p-3.5 rounded-xl space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Tier / Classification:</span>
                <span className="font-bold text-slate-800 capitalize">{profileDoctor.tier.replace('_', ' ')}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Target Field Calls:</span>
                <span className="font-bold text-slate-900">{profileDoctor.target_frequency_per_month} visits / month</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Clinic / Hospital:</span>
                <span className="font-semibold text-slate-800">{profileDoctor.clinic_hospital_name}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Territory:</span>
                <span className="font-medium text-slate-700">{profileDoctor.territory}, {profileDoctor.city}</span>
              </div>
              {profileDoctor.visiting_hours && (
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Visiting Hours:</span>
                  <span className="text-slate-700">{profileDoctor.visiting_hours}</span>
                </div>
              )}
            </div>

            {profileDoctor.notes && (
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 text-xs">
                <span className="font-bold text-slate-900 block mb-0.5">Detailing & Prescribing Notes:</span>
                <p className="text-slate-600">{profileDoctor.notes}</p>
              </div>
            )}

            <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
              <a
                href={`tel:${profileDoctor.phone.replace(/\s+/g, '')}`}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-medium transition-colors"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>Call Doctor</span>
              </a>

              <Link href={`/mr/doctors/${profileDoctor.id}/edit`} className="px-4 py-2 rounded-xl border border-slate-200/80 hover:bg-slate-50 text-slate-700 text-xs font-medium transition-colors cursor-pointer">Edit Profile</Link>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteDoctorId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl max-w-sm w-full p-5 shadow-2xl border border-slate-200 text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center mx-auto">
              <Trash2 className="w-6 h-6 stroke-[1.8]" />
            </div>
            <h3 className="text-sm font-bold text-slate-900">Remove Doctor?</h3>
            <p className="text-xs text-slate-500">
              Are you sure you want to remove this healthcare professional from your active territory directory?
            </p>
            <div className="flex items-center justify-center gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setDeleteDoctorId(null)}
                className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 text-xs font-semibold cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => handleDeleteDoctor(deleteDoctorId)}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold cursor-pointer shadow-xs"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}

    </MRLayout>
  );
}
