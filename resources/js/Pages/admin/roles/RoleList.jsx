import { useState } from 'react';
import { Link, router } from '@inertiajs/react';
import { Shield, Plus, Edit2, Trash2, Users, Lock, ShieldCheck, Briefcase } from 'lucide-react';
import AdminLayout from '../../../layouts/AdminLayout';
import ConfirmModal from '../../../components/common/ConfirmModal';

export default function RoleList({ roles = [] }) {
  const [deletingRole, setDeletingRole] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const confirmDeleteRole = () => {
    if (!deletingRole) return;
    setIsDeleting(true);
    router.delete(`/admin/roles/${deletingRole.id}`, {
      onFinish: () => {
        setIsDeleting(false);
        setDeletingRole(null);
      },
    });
  };

  const getRoleMeta = (name) => {
    switch (name) {
      case 'super_admin':
        return {
          title: 'Super Administrator',
          desc: 'Unrestricted master access across all formulations, team members, and configuration modules.',
          icon: ShieldCheck,
          iconBg: 'bg-purple-50 text-purple-700',
        };
      case 'manager':
        return {
          title: 'Area / Regulatory Manager',
          desc: 'Oversees product catalogs, categories, batch status, settings, and daily doctor interaction reports.',
          icon: Users,
          iconBg: 'bg-blue-50 text-blue-700',
        };
      case 'mr':
        return {
          title: 'Medical Representative (MR)',
          desc: 'Field operations specialist with direct access to drug catalogs, sample allocations, and DCR submissions.',
          icon: Briefcase,
          iconBg: 'bg-teal-50 text-teal-700',
        };
      default:
        return {
          title: name.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()),
          desc: 'Custom access level configured with designated module permissions.',
          icon: Shield,
          iconBg: 'bg-slate-100 text-slate-700',
        };
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-5 pb-8">
        {/* Clean Header Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white rounded-xl border border-slate-200/80 p-4 sm:p-5 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
          <div>
            <p className="text-xs sm:text-sm text-slate-500 font-medium">
              Configure system roles, access privileges, and module permission policies.
            </p>
            <div className="flex items-center gap-2 mt-1">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-slate-100 text-slate-600">
                {roles.length} Access Roles
              </span>
            </div>
          </div>

          <Link
            href="/admin/roles/create"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-teal-700 hover:bg-teal-800 text-white text-xs font-semibold transition-colors shadow-sm shrink-0 self-start sm:self-auto cursor-pointer"
          >
            <Plus className="w-4 h-4 stroke-[2.2]" />
            <span>Create New Role</span>
          </Link>
        </div>

        {/* Roles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          {roles.map((role) => {
            const isProtected = role.name === 'super_admin';
            const meta = getRoleMeta(role.name);
            const RoleIcon = meta.icon;

            return (
              <div
                key={role.id}
                className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-[0_1px_3px_rgba(0,0,0,0.04)] hover:shadow-sm hover:border-teal-300 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className={`w-9 h-9 rounded-xl flex items-center justify-center ${meta.iconBg}`}>
                      <RoleIcon className="w-5 h-5" />
                    </span>

                    <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600">
                      {role.permissions_count || 0} Permissions
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-slate-900 tracking-tight">
                    {meta.title}
                  </h3>
                  <span className="text-[11px] text-slate-400 font-mono block mt-0.5">
                    {role.name}
                  </span>

                  <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                    {meta.desc}
                  </p>

                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center gap-2 text-xs text-slate-600">
                    <Users className="w-3.5 h-3.5 text-slate-400" />
                    <span><strong>{role.users_count || 0}</strong> assigned team members</span>
                  </div>
                </div>

                <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between">
                  {isProtected ? (
                    <span className="inline-flex items-center gap-1.5 text-[11px] text-purple-700 font-semibold bg-purple-50 px-2.5 py-1 rounded-full">
                      <Lock className="w-3 h-3" />
                      <span>System Protected Role</span>
                    </span>
                  ) : (
                    <div className="flex items-center justify-between w-full">
                      <Link
                        href={`/admin/roles/${role.id}/edit`}
                        className="inline-flex items-center gap-1.5 text-xs font-semibold text-teal-700 hover:text-teal-800 hover:bg-teal-50 px-2.5 py-1.5 rounded-lg transition-colors cursor-pointer"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                        <span>Edit Permissions</span>
                      </Link>

                      <button
                        type="button"
                        onClick={() => setDeletingRole(role)}
                        className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                        title="Delete Role"
                        aria-label="Delete Role"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <ConfirmModal
        isOpen={!!deletingRole}
        onClose={() => !isDeleting && setDeletingRole(null)}
        onConfirm={confirmDeleteRole}
        title="Delete Access Role"
        message={`Are you sure you want to delete role "${deletingRole?.name}"? Assigned users will lose this role's permissions.`}
        confirmText="Delete Role"
        cancelText="Cancel"
        isDanger={true}
        isLoading={isDeleting}
      />
    </AdminLayout>
  );
}
