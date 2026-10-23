import { Link, useForm } from '@inertiajs/react';
import { Save, Mail, Lock, User, ShieldCheck } from 'lucide-react';
import AdminLayout from '../../../layouts/AdminLayout';

// Helper function to capitalize each word in a name
const capitalizeWords = (str) => {
  if (!str || typeof str !== 'string') return '';
  return str.replace(/\b\w/g, (char) => char.toUpperCase());
};

export default function StaffForm({ isEdit = false, staff = null, roles = [] }) {
  const { data, setData, post, put, processing, errors } = useForm({
    name: capitalizeWords(staff?.name || ''),
    email: staff?.email || '',
    role: staff?.role || 'mr',
    password: '',
  });

  const handleNameChange = (e) => {
    setData('name', capitalizeWords(e.target.value));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isEdit) {
      put(`/admin/staff/${staff.id}`);
    } else {
      post('/admin/staff');
    }
  };

  return (
    <AdminLayout>
      <div className="max-w-xl mx-auto pb-10">
        <form onSubmit={handleSubmit} className="bg-white p-6 sm:p-7 rounded-xl border border-slate-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.04)] space-y-5">
          {/* Full Name */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center justify-between">
              <span>Full Name <span className="text-rose-500">*</span></span>
              <span className="text-[10px] text-slate-400 font-normal">Capitalized automatically</span>
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={data.name}
                onChange={handleNameChange}
                placeholder="e.g. Dr. Rajesh Sharma"
                className={`w-full pl-9 pr-3.5 py-2.5 bg-slate-50/70 hover:bg-slate-50 focus:bg-white border ${
                  errors.name ? 'border-rose-300 focus:border-rose-500' : 'border-slate-200 focus:border-teal-600'
                } rounded-lg text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-600/10 transition-all capitalize`}
              />
            </div>
            {errors.name && <p className="text-xs text-rose-600 mt-1 font-medium">{errors.name}</p>}
          </div>

          {/* Email Address */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Email Address <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="email"
                value={data.email}
                onChange={(e) => setData('email', e.target.value)}
                placeholder="e.g. rajesh@ciplon.com"
                className={`w-full pl-9 pr-3.5 py-2.5 bg-slate-50/70 hover:bg-slate-50 focus:bg-white border ${
                  errors.email ? 'border-rose-300 focus:border-rose-500' : 'border-slate-200 focus:border-teal-600'
                } rounded-lg text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-600/10 transition-all`}
              />
            </div>
            {errors.email && <p className="text-xs text-rose-600 mt-1 font-medium">{errors.email}</p>}
          </div>

          {/* Role Selection */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Role & Access Level <span className="text-rose-500">*</span>
            </label>
            <div className="space-y-2">
              {roles.map((r) => {
                const isSelected = data.role === r.name;
                return (
                  <label
                    key={r.id}
                    className={`p-3 rounded-lg border cursor-pointer transition-all flex items-start gap-3 ${
                      isSelected
                        ? 'border-teal-600 bg-teal-50/40 text-teal-950 font-semibold ring-1 ring-teal-600/20'
                        : 'border-slate-200 hover:border-slate-300 bg-slate-50/40 text-slate-700'
                    }`}
                  >
                    <input
                      type="radio"
                      name="role"
                      value={r.name}
                      checked={isSelected}
                      onChange={(e) => setData('role', e.target.value)}
                      className="mt-1 text-teal-600 focus:ring-teal-500"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-900">
                          {r.name === 'admin' ? 'Administrator' : r.name === 'super_admin' ? 'Super Admin' : r.name === 'mr' ? 'Medical Representative (MR)' : capitalizeWords(r.name.replace(/_/g, ' '))}
                        </span>
                        {isSelected && (
                          <span className="text-[10px] font-semibold text-teal-700 bg-teal-100/60 px-2 py-0.5 rounded-full">
                            Active
                          </span>
                        )}
                      </div>
                      <span className="text-[11px] text-slate-500 mt-0.5 block leading-tight font-normal">
                        {r.name === 'admin' ? 'Full administrative access to manage products, categories, staff, and field operations' : r.name === 'super_admin' ? 'Unrestricted master access' : r.name === 'manager' ? 'Manages products, categories, doctor call records' : 'Field catalog access & Daily Call Reports (DCR)'}
                      </span>
                    </div>
                  </label>
                );
              })}
            </div>
            {errors.role && <p className="text-xs text-rose-600 mt-1 font-medium">{errors.role}</p>}
          </div>

          {/* Password */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              {isEdit ? 'Password (Leave blank to keep existing)' : 'Password'} {!isEdit && <span className="text-rose-500">*</span>}
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="password"
                value={data.password}
                onChange={(e) => setData('password', e.target.value)}
                placeholder={isEdit ? '••••••••' : 'Minimum 8 characters'}
                className={`w-full pl-9 pr-3.5 py-2.5 bg-slate-50/70 hover:bg-slate-50 focus:bg-white border ${
                  errors.password ? 'border-rose-300 focus:border-rose-500' : 'border-slate-200 focus:border-teal-600'
                } rounded-lg text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-600/10 transition-all`}
              />
            </div>
            {errors.password && <p className="text-xs text-rose-600 mt-1 font-medium">{errors.password}</p>}
          </div>

          {/* Action Buttons */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-2.5">
            <Link
              href="/admin/staff"
              className="px-4 py-2 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold transition-colors cursor-pointer"
            >
              Cancel
            </Link>

            <button
              type="submit"
              disabled={processing}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-teal-700 hover:bg-teal-800 disabled:opacity-50 text-white text-xs font-semibold shadow-sm transition-all cursor-pointer"
            >
              <Save className="w-3.5 h-3.5" />
              <span>{processing ? 'Saving...' : isEdit ? 'Save Changes' : 'Create Staff Member'}</span>
            </button>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
}
