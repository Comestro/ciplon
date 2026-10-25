import { useState, useMemo } from 'react';
import { Link } from '@inertiajs/react';
import { 
  Users, 
  Search, 
  MapPin, 
  Stethoscope, 
  CalendarCheck, 
  ExternalLink, 
  X,
  Radio,
  ChevronRight,
  ShieldCheck
} from 'lucide-react';
import AdminLayout from '../../layouts/AdminLayout';

export default function MRDirectory({ mrs = [] }) {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredMRs = useMemo(() => {
    if (!searchQuery.trim()) return mrs;
    const q = searchQuery.toLowerCase();
    return mrs.filter((mr) => 
      mr.name?.toLowerCase().includes(q) ||
      mr.email?.toLowerCase().includes(q) ||
      mr.emp_code?.toLowerCase().includes(q)
    );
  }, [mrs, searchQuery]);

  const totalDoctors = useMemo(() => {
    return mrs.reduce((sum, mr) => sum + (mr.doctors_count || 0), 0);
  }, [mrs]);

  const totalVisits = useMemo(() => {
    return mrs.reduce((sum, mr) => sum + (mr.visits_count || 0), 0);
  }, [mrs]);

  return (
    <AdminLayout title="Medical Representatives Directory">
      <div className="space-y-6 pb-12 font-sans max-w-[1400px] mx-auto text-slate-800">
        
        {/* Header Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200/80">
          <div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-violet-50 text-violet-600 flex items-center justify-center">
                <Users className="w-4 h-4" />
              </div>
              <h2 className="text-xl sm:text-2xl font-semibold tracking-tight text-slate-900">
                Medical Representatives Directory
              </h2>
            </div>
            <p className="text-xs text-slate-500 font-normal mt-1">
              Field force roster, assigned doctor portfolio coverage, visit metrics, and real-time movement links.
            </p>
          </div>

          {/* Search Box */}
          <div className="relative w-full sm:w-72">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search MR by name, email, or ID..."
              className="w-full bg-white border border-slate-200/80 rounded-xl pl-8 pr-7 py-2 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-500/10 transition-all font-normal shadow-2xs"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Stats Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="bg-white rounded-2xl border border-slate-200/80 p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-violet-50 text-violet-600 flex items-center justify-center shrink-0">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[11px] text-slate-400 font-medium uppercase tracking-wider">Total Field Force</p>
              <h4 className="text-lg font-bold text-slate-900">{mrs.length} Representatives</h4>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200/80 p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
              <Stethoscope className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[11px] text-slate-400 font-medium uppercase tracking-wider">Total Doctors Covered</p>
              <h4 className="text-lg font-bold text-slate-900">{totalDoctors} Physicians</h4>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200/80 p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
              <CalendarCheck className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[11px] text-slate-400 font-medium uppercase tracking-wider">Total Visits Logged</p>
              <h4 className="text-lg font-bold text-slate-900">{totalVisits} Completed Calls</h4>
            </div>
          </div>
        </div>

        {/* Directory Table */}
        <div className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-2xs">
          <div className="px-5 py-3.5 border-b border-slate-100 flex items-center justify-between">
            <h3 className="text-xs font-semibold text-slate-800 uppercase tracking-wider">
              Representatives Roster
            </h3>
            <span className="text-xs text-slate-400 font-normal">
              Showing {filteredMRs.length} of {mrs.length} representatives
            </span>
          </div>

          {filteredMRs.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-100 text-[11px] font-semibold text-slate-400 bg-slate-50/50">
                    <th className="py-3 px-4">Representative</th>
                    <th className="py-3 px-4">Emp Code</th>
                    <th className="py-3 px-4">Doctor Coverage</th>
                    <th className="py-3 px-4">Visits Logged</th>
                    <th className="py-3 px-4">Last Field Location</th>
                    <th className="py-3 px-4">Joined Date</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredMRs.map((mr) => (
                    <tr key={mr.id} className="hover:bg-slate-50/70 transition-colors">
                      {/* Name & Avatar */}
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-violet-100 text-violet-700 font-semibold text-xs flex items-center justify-center shrink-0">
                            {mr.name ? mr.name.charAt(0).toUpperCase() : 'M'}
                          </div>
                          <div>
                            <span className="font-semibold text-slate-900 block">
                              {mr.name}
                            </span>
                            <span className="text-[11px] text-slate-400">
                              {mr.email}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Code */}
                      <td className="py-3 px-4">
                        <span className="font-mono text-[11px] font-medium px-2 py-0.5 rounded-md bg-slate-100 text-slate-700">
                          {mr.emp_code}
                        </span>
                      </td>

                      {/* Doctor Count */}
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-1.5 font-medium text-slate-700">
                          <Stethoscope className="w-3.5 h-3.5 text-violet-500" />
                          <span>{mr.doctors_count || 0} Doctors</span>
                        </div>
                      </td>

                      {/* Visits Count */}
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-1.5 font-medium text-slate-700">
                          <CalendarCheck className="w-3.5 h-3.5 text-emerald-500" />
                          <span>{mr.visits_count || 0} Visits</span>
                        </div>
                      </td>

                      {/* Field Location / Status */}
                      <td className="py-3 px-4">
                        {mr.latest_location ? (
                          <div className="space-y-0.5">
                            <span className="inline-flex items-center gap-1.5 text-emerald-700 text-[11px] font-medium">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                              <span className="truncate max-w-[180px]" title={mr.latest_location.address}>
                                {mr.latest_location.address || 'Active in Field'}
                              </span>
                            </span>
                            {mr.latest_location.updated_at && (
                              <span className="text-[10px] text-slate-400 block">
                                {mr.latest_location.updated_at}
                              </span>
                            )}
                          </div>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 text-slate-400 text-[11px]">
                            <span className="w-1.5 h-1.5 rounded-full bg-slate-300" />
                            No GPS ping yet
                          </span>
                        )}
                      </td>

                      {/* Joined Date */}
                      <td className="py-3 px-4 text-slate-500 font-normal">
                        {mr.created_at || 'Recent'}
                      </td>

                      {/* Actions */}
                      <td className="py-3 px-4 text-right">
                        <Link
                          href={`/admin/tracking?user_id=${mr.id}`}
                          className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-slate-200 text-slate-700 hover:bg-violet-50 hover:border-violet-200 hover:text-violet-700 text-[11px] font-medium transition-colors"
                          title="View live GPS movement & doctor visits"
                        >
                          <MapPin className="w-3 h-3 text-violet-500" />
                          <span>Track Field Route</span>
                          <ChevronRight className="w-3 h-3" />
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="p-12 text-center space-y-2">
              <Users className="w-8 h-8 mx-auto text-slate-300" />
              <p className="text-xs text-slate-500">
                {searchQuery ? 'No representatives match your search criteria.' : 'No Medical Representatives registered yet.'}
              </p>
            </div>
          )}
        </div>

      </div>
    </AdminLayout>
  );
}

