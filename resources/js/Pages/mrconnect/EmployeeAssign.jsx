import { useState } from 'react';
import { usePage, Link } from '@inertiajs/react';
import { 
  Users, 
  MapPin, 
  Building2, 
  ShieldCheck, 
  Search, 
  ChevronRight, 
  Calendar,
  Briefcase,
  UserCheck
} from 'lucide-react';
import AdminLayout from '../../layouts/AdminLayout';
import MRLayout from '../../layouts/MR/MRLayout';

export default function EmployeeAssign({ representatives = [], isIndividualMR = false }) {
  const { props } = usePage();
  const isAdmin = props.auth?.user?.role === 'admin' || props.auth?.user?.role === 'super_admin';
  const Layout = isAdmin ? AdminLayout : MRLayout;

  const [search, setSearch] = useState('');

  const filtered = representatives.filter((r) =>
    r.name.toLowerCase().includes(search.toLowerCase()) ||
    r.reg_code.toLowerCase().includes(search.toLowerCase()) ||
    r.headquarters.toLowerCase().includes(search.toLowerCase())
  );

  const selfRep = representatives[0] || {};

  return (
    <Layout title={isAdmin ? "Employee Territory Assignment" : "My Territory Assignment"}>
      <div className="space-y-6 pb-12 font-sans max-w-[1400px] mx-auto">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200/80">
          <div>
            <h2 className="text-xl sm:text-2xl font-semibold tracking-tight text-slate-800">
              {isAdmin ? "Employee Territory Assignment" : "My Territory Assignment"}
            </h2>
            <p className="text-xs text-slate-500 font-normal mt-0.5">
              {isAdmin
                ? "Assign medical representatives to territories, operational headquarters, and reporting managers."
                : "Your official operational headquarters, territory jurisdiction, and reporting hierarchy."}
            </p>
          </div>

          {isAdmin && (
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3 pointer-events-none" />
              <input
                type="text"
                placeholder="Search representative or HQ..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-8 pr-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500"
              />
            </div>
          )}
        </div>

        {/* If MR: Show dedicated personal assignment card */}
        {!isAdmin ? (
          <div className="space-y-6">
            <div className="bg-white rounded-2xl border border-slate-200/80 p-6 space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-slate-900 text-white font-bold text-xl flex items-center justify-center shrink-0">
                    {selfRep.name?.charAt(0) || 'M'}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-slate-800">{selfRep.name}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="font-mono text-xs font-semibold bg-violet-50 text-violet-700 border border-violet-100 px-2 py-0.5 rounded-md">
                        {selfRep.reg_code}
                      </span>
                      <span className="text-xs text-slate-500 font-medium">{selfRep.role_title}</span>
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/60">
                        Active Assignment
                      </span>
                    </div>
                  </div>
                </div>

                <Link
                  href="/mr/doctors"
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-violet-600 hover:bg-violet-700 text-white font-medium text-xs transition-colors"
                >
                  <Users className="w-3.5 h-3.5" />
                  <span>View My Assigned Doctors</span>
                </Link>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <div className="p-4 rounded-xl bg-slate-50/60 border border-slate-100 space-y-1">
                  <span className="text-xs font-medium text-slate-400">Operational HQ</span>
                  <p className="text-sm font-semibold text-slate-800 flex items-center gap-1.5 pt-1">
                    <Building2 className="w-4 h-4 text-violet-600" />
                    <span>{selfRep.headquarters}</span>
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-slate-50/60 border border-slate-100 space-y-1">
                  <span className="text-xs font-medium text-slate-400">Territory Jurisdiction</span>
                  <p className="text-sm font-semibold text-slate-800 flex items-center gap-1.5 pt-1">
                    <MapPin className="w-4 h-4 text-indigo-600" />
                    <span>{selfRep.territory}</span>
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-slate-50/60 border border-slate-100 space-y-1">
                  <span className="text-xs font-medium text-slate-400">Reporting Line Manager</span>
                  <p className="text-sm font-semibold text-slate-800 flex items-center gap-1.5 pt-1">
                    <UserCheck className="w-4 h-4 text-emerald-600" />
                    <span>{selfRep.reporting_manager}</span>
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-white rounded-2xl border border-slate-200/80 p-5">
                <span className="text-xs font-medium text-slate-500">Allocated Doctors</span>
                <p className="text-2xl font-semibold text-slate-800 mt-2">{selfRep.assigned_doctors_count}</p>
                <p className="text-[11px] text-slate-400 mt-1">Exclusive practitioner coverage</p>
              </div>

              <div className="bg-white rounded-2xl border border-slate-200/80 p-5">
                <span className="text-xs font-medium text-slate-500">Appointment Date</span>
                <p className="text-2xl font-semibold text-violet-600 mt-2">{selfRep.joining_date}</p>
                <p className="text-[11px] text-slate-400 mt-1">Territory assignment inception</p>
              </div>

              <div className="bg-white rounded-2xl border border-slate-200/80 p-5">
                <span className="text-xs font-medium text-slate-500">Route Compliance</span>
                <p className="text-2xl font-semibold text-emerald-600 mt-2">100%</p>
                <p className="text-[11px] text-emerald-600 font-medium mt-1">Active verified field representative</p>
              </div>
            </div>
          </div>
        ) : (
          /* Admin View */
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
              <div className="bg-white rounded-2xl border border-slate-200/80 p-5">
                <span className="text-xs font-medium text-slate-500">Field Representatives</span>
                <p className="text-2xl font-semibold text-slate-800 mt-2">{representatives.length}</p>
                <p className="text-[11px] text-slate-400 mt-1">Active field personnel</p>
              </div>

              <div className="bg-white rounded-2xl border border-slate-200/80 p-5">
                <span className="text-xs font-medium text-slate-500">Total Headquarters</span>
                <p className="text-2xl font-semibold text-violet-600 mt-2">26 HQs</p>
                <p className="text-[11px] text-slate-400 mt-1">Assigned hubs</p>
              </div>

              <div className="bg-white rounded-2xl border border-slate-200/80 p-5">
                <span className="text-xs font-medium text-slate-500">Area Business Managers</span>
                <p className="text-2xl font-semibold text-emerald-600 mt-2">13 ABMs</p>
                <p className="text-[11px] text-slate-400 mt-1">First-line supervisors</p>
              </div>

              <div className="bg-white rounded-2xl border border-slate-200/80 p-5">
                <span className="text-xs font-medium text-slate-500">Territory Coverage</span>
                <p className="text-2xl font-semibold text-slate-800 mt-2">100%</p>
                <p className="text-[11px] text-emerald-600 font-medium mt-1">Fully allocated</p>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden">
              <div className="px-5 py-3.5 border-b border-slate-100 flex items-center justify-between">
                <h3 className="text-sm font-semibold text-slate-800">Assigned Representatives & Territories</h3>
                <span className="text-xs text-slate-400">{filtered.length} representatives</span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-slate-100 text-[11px] font-semibold text-slate-400 bg-slate-50/50">
                      <th className="py-2.5 px-4">Employee</th>
                      <th className="py-2.5 px-4">Role / Reg</th>
                      <th className="py-2.5 px-4">Headquarters</th>
                      <th className="py-2.5 px-4">Territory</th>
                      <th className="py-2.5 px-4 text-center">Assigned Doctors</th>
                      <th className="py-2.5 px-4">Reporting Manager</th>
                      <th className="py-2.5 px-4 text-center">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filtered.map((rep) => (
                      <tr key={rep.id} className="hover:bg-slate-50/70 transition-colors">
                        <td className="py-3 px-4 font-medium text-slate-800">
                          {rep.name}
                        </td>
                        <td className="py-3 px-4 text-slate-600">
                          <span className="font-mono text-[11px] font-semibold bg-slate-100 px-1.5 py-0.5 rounded mr-1.5 text-slate-700">
                            {rep.reg_code}
                          </span>
                          {rep.role_title}
                        </td>
                        <td className="py-3 px-4 text-slate-700 font-medium">
                          {rep.headquarters}
                        </td>
                        <td className="py-3 px-4 text-slate-500">
                          {rep.territory}
                        </td>
                        <td className="py-3 px-4 text-center font-medium text-violet-700">
                          {rep.assigned_doctors_count} doctors
                        </td>
                        <td className="py-3 px-4 text-slate-600">
                          {rep.reporting_manager}
                        </td>
                        <td className="py-3 px-4 text-center">
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-[11px] font-medium bg-emerald-50 text-emerald-700 border border-emerald-200/60">
                            Active
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

      </div>
    </Layout>
  );
}
