import { usePage } from '@inertiajs/react';
import { 
  Users, 
  Building2, 
  Phone, 
  Mail, 
  UserCheck 
} from 'lucide-react';
import AdminLayout from '../../layouts/AdminLayout';
import MRLayout from '../../layouts/MR/MRLayout';

export default function HRSection({ employees = [] }) {
  const { props } = usePage();
  const isAdmin = props.auth?.user?.role === 'admin' || props.auth?.user?.role === 'super_admin';
  const Layout = isAdmin ? AdminLayout : MRLayout;

  return (
    <Layout title={isAdmin ? "HR Directory & Records" : "My HR & Employment Profile"}>
      <div className="space-y-6 pb-12 font-sans max-w-[1400px] mx-auto">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200/80">
          <div>
            <h2 className="text-xl sm:text-2xl font-semibold tracking-tight text-slate-800">
              {isAdmin ? "Human Resources Directory" : "My HR & Employment Profile"}
            </h2>
            <p className="text-xs text-slate-500 font-normal mt-0.5">
              {isAdmin
                ? "Official company personnel records, departments, and communication coordinates."
                : "Your official company employment record, registration code, and department designation."}
            </p>
          </div>
        </div>

        {/* Directory Table */}
        <div className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden">
          <div className="px-5 py-3.5 border-b border-slate-100 flex items-center justify-between">
            <h3 className="text-sm font-semibold text-slate-800">
              {isAdmin ? "Employee Master" : "Personal Employment Details"}
            </h3>
            <span className="text-xs text-slate-400">
              {isAdmin ? `${employees.length} employees` : "Verified Official Record"}
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-100 text-[11px] font-semibold text-slate-400 bg-slate-50/50">
                  <th className="py-2.5 px-4">Emp ID</th>
                  <th className="py-2.5 px-4">Employee Name</th>
                  <th className="py-2.5 px-4">Email Address</th>
                  <th className="py-2.5 px-4">Department</th>
                  <th className="py-2.5 px-4">Role</th>
                  <th className="py-2.5 px-4 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {employees.map((emp) => (
                  <tr key={emp.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3 px-4 font-mono font-semibold text-slate-800">
                      {emp.emp_id}
                    </td>
                    <td className="py-3 px-4 font-medium text-slate-800">
                      {emp.name}
                    </td>
                    <td className="py-3 px-4 text-slate-500">
                      {emp.email}
                    </td>
                    <td className="py-3 px-4 text-slate-600 font-medium">
                      {emp.department}
                    </td>
                    <td className="py-3 px-4 text-slate-700">
                      <span className="bg-slate-100 text-slate-700 font-medium px-2 py-0.5 rounded text-[11px]">
                        {emp.role}
                      </span>
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
    </Layout>
  );
}
