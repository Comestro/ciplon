import { useState } from 'react';
import { useForm, usePage, router, Link } from '@inertiajs/react';
import { 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  ArrowRight, 
  AlertCircle,
  KeyRound,
  ShieldCheck,
  Stethoscope,
  ChevronRight,
  Shield,
  Building2,
  Sparkles
} from 'lucide-react';

export default function LoginPage() {
  const { props } = usePage();
  const companyProfile = props.company || {};
  const [showPassword, setShowPassword] = useState(false);
  const [demoLoading, setDemoLoading] = useState(null);
  const [selectedRole, setSelectedRole] = useState('mr'); // 'mr' or 'admin'

  const { data, setData, post, processing, errors, reset } = useForm({
    email: 'mr@ciplon.com',
    password: '123456789',
    remember: true,
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    post('/login', {
      onFinish: () => reset('password'),
    });
  };

  // Switch role and pre-fill credentials cleanly
  const selectRoleTab = (role) => {
    setSelectedRole(role);
    if (role === 'mr') {
      setData({
        email: 'mr@ciplon.com',
        password: '123456789',
        remember: true,
      });
    } else {
      setData({
        email: 'admin@gmail.com',
        password: '123456789',
        remember: true,
      });
    }
  };

  const handleQuickLogin = (role) => {
    const email = role === 'mr' ? 'mr@ciplon.com' : 'admin@gmail.com';
    const password = '123456789';

    setDemoLoading(role);
    setData('email', email);
    setData('password', password);

    router.post('/login', {
      email,
      password,
      remember: true,
    }, {
      onFinish: () => {
        setDemoLoading(null);
        reset('password');
      },
    });
  };

  const companyName = companyProfile?.company_name || 'Ciplon Pharma Private Limited';
  const logoUrl = companyProfile?.logo_url || '/images/ciplon_logo.png';

  return (
    <div className="min-h-screen bg-[#fbfbfd] flex flex-col justify-between p-4 sm:p-6 font-sans text-slate-800">
      {/* Top Header Bar */}
      <header className="max-w-6xl w-full mx-auto flex items-center justify-between py-2 border-b border-slate-100">
        <Link href="/" className="flex items-center gap-2.5 group cursor-pointer">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-violet-600 via-indigo-600 to-purple-700 text-white flex items-center justify-center font-semibold text-xs shrink-0">
            CP
          </div>
          <div className="flex flex-col">
            <span className="text-xs font-semibold tracking-tight text-slate-800">
              {companyName}
            </span>
            <span className="text-[10px] text-slate-400 font-normal">
              Enterprise Field & Admin Suite
            </span>
          </div>
        </Link>

        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100 text-[10px] font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            System Operational
          </span>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 flex items-center justify-center py-10 px-2 sm:px-4">
        <div className="w-full max-w-sm space-y-6">
          
          {/* Brand Heading */}
          <div className="text-center space-y-1.5">
            <h1 className="text-xl sm:text-2xl font-semibold tracking-tight text-slate-900">
              Welcome back
            </h1>
            <p className="text-xs text-slate-500 font-normal">
              Sign in with your verified credentials to access your portal.
            </p>
          </div>

          {/* Role Segmented Switcher (SpaceWork Pills) */}
          <div className="p-1 bg-slate-100/80 rounded-xl flex items-center gap-1 border border-slate-200/60">
            <button
              type="button"
              onClick={() => selectRoleTab('mr')}
              className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-medium transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                selectedRole === 'mr'
                  ? 'bg-white text-slate-900 shadow-2xs font-semibold'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <Stethoscope className={`w-3.5 h-3.5 ${selectedRole === 'mr' ? 'text-violet-600' : 'text-slate-400'}`} />
              <span>MR Portal</span>
            </button>

            <button
              type="button"
              onClick={() => selectRoleTab('admin')}
              className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-medium transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                selectedRole === 'admin'
                  ? 'bg-white text-slate-900 shadow-2xs font-semibold'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <ShieldCheck className={`w-3.5 h-3.5 ${selectedRole === 'admin' ? 'text-violet-600' : 'text-slate-400'}`} />
              <span>Admin Panel</span>
            </button>
          </div>

          {/* Flash error */}
          {props.flash?.error && (
            <div className="p-3 rounded-xl bg-rose-50 text-rose-700 text-xs border border-rose-200/60 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-500" />
              <span>{props.flash.error}</span>
            </div>
          )}

          {/* Card Form */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-6 sm:p-7 space-y-4">
            <form onSubmit={handleSubmit} noValidate className="space-y-4">
              
              {/* Email */}
              <div className="space-y-1">
                <label className="text-xs font-medium text-slate-700 block">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="email"
                    value={data.email}
                    onChange={(e) => setData('email', e.target.value)}
                    placeholder="name@ciplon.com"
                    autoComplete="email"
                    className={`w-full bg-slate-50/60 hover:bg-slate-50 focus:bg-white border rounded-xl pl-8 pr-3 py-2 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none transition-all font-normal ${
                      errors.email
                        ? 'border-rose-300 focus:border-rose-500 focus:ring-1 focus:ring-rose-500/20'
                        : 'border-slate-200 focus:border-slate-300 focus:ring-2 focus:ring-violet-500/10'
                    }`}
                  />
                </div>
                {errors.email && (
                  <p className="text-[11px] text-rose-600 flex items-center gap-1 font-normal mt-1">
                    <AlertCircle className="w-3 h-3 shrink-0" />
                    <span>{errors.email}</span>
                  </p>
                )}
              </div>

              {/* Password */}
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-medium text-slate-700 block">
                    Password
                  </label>
                  <button
                    type="button"
                    onClick={() => alert('Please contact administrator at support@ciplon.com to reset your credentials.')}
                    className="text-[11px] font-normal text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
                  >
                    Forgot password?
                  </button>
                </div>
                <div className="relative">
                  <Lock className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={data.password}
                    onChange={(e) => setData('password', e.target.value)}
                    placeholder="•••••••••"
                    autoComplete="current-password"
                    className={`w-full bg-slate-50/60 hover:bg-slate-50 focus:bg-white border rounded-xl pl-8 pr-9 py-2 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none transition-all font-normal ${
                      errors.password
                        ? 'border-rose-300 focus:border-rose-500 focus:ring-1 focus:ring-rose-500/20'
                        : 'border-slate-200 focus:border-slate-300 focus:ring-2 focus:ring-violet-500/10'
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
                    tabIndex={-1}
                  >
                    {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-[11px] text-rose-600 flex items-center gap-1 font-normal mt-1">
                    <AlertCircle className="w-3 h-3 shrink-0" />
                    <span>{errors.password}</span>
                  </p>
                )}
              </div>

              {/* Remember */}
              <div className="flex items-center justify-between pt-0.5">
                <label className="flex items-center gap-2 text-xs text-slate-600 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={data.remember}
                    onChange={(e) => setData('remember', e.target.checked)}
                    className="w-3.5 h-3.5 rounded border-slate-300 text-slate-900 focus:ring-slate-900"
                  />
                  <span className="font-normal">Keep me signed in</span>
                </label>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={processing || demoLoading !== null}
                className="w-full mt-2 py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-medium flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-60"
              >
                {processing && demoLoading === null ? (
                  <>
                    <div className="w-3.5 h-3.5 border-2 border-white/60 border-t-white rounded-full animate-spin" />
                    <span>Authenticating...</span>
                  </>
                ) : (
                  <>
                    <span>Sign In to {selectedRole === 'mr' ? 'MR Portal' : 'Admin Panel'}</span>
                    <ArrowRight className="w-3.5 h-3.5 text-violet-400" />
                  </>
                )}
              </button>
            </form>

            {/* Quick Demo Access Bar */}
            <div className="pt-3 border-t border-slate-100 space-y-2">
              <div className="flex items-center justify-between text-[11px] text-slate-400 font-normal">
                <span>1-Click Fast Login</span>
                <span className="font-mono text-[10px] text-violet-600 bg-violet-50 px-1.5 py-0.2 rounded">Demo Ready</span>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  disabled={processing || demoLoading !== null}
                  onClick={() => handleQuickLogin('mr')}
                  className="py-1.5 px-2.5 rounded-xl border border-slate-200/80 hover:bg-slate-50 text-slate-700 text-xs font-medium flex items-center justify-center gap-1.5 transition-colors cursor-pointer disabled:opacity-50"
                  title="Sign in as Medical Representative"
                >
                  {demoLoading === 'mr' ? (
                    <div className="w-3 h-3 border-2 border-slate-400 border-t-slate-800 rounded-full animate-spin" />
                  ) : (
                    <Stethoscope className="w-3.5 h-3.5 text-violet-600" />
                  )}
                  <span>Demo MR</span>
                </button>

                <button
                  type="button"
                  disabled={processing || demoLoading !== null}
                  onClick={() => handleQuickLogin('admin')}
                  className="py-1.5 px-2.5 rounded-xl border border-slate-200/80 hover:bg-slate-50 text-slate-700 text-xs font-medium flex items-center justify-center gap-1.5 transition-colors cursor-pointer disabled:opacity-50"
                  title="Sign in as System Admin"
                >
                  {demoLoading === 'admin' ? (
                    <div className="w-3 h-3 border-2 border-slate-400 border-t-slate-800 rounded-full animate-spin" />
                  ) : (
                    <ShieldCheck className="w-3.5 h-3.5 text-indigo-600" />
                  )}
                  <span>Demo Admin</span>
                </button>
              </div>
            </div>

          </div>

          {/* Security & Regulatory Note */}
          <div className="text-center">
            <p className="text-[11px] text-slate-400 font-normal">
              Protected by 256-bit encryption • ISO 9001:2015 Compliant
            </p>
          </div>

        </div>
      </main>

      {/* Bottom Footer */}
      <footer className="max-w-6xl w-full mx-auto py-3 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-slate-400 font-normal">
        <span>© {new Date().getFullYear()} {companyName}. All rights reserved.</span>
        <div className="flex items-center gap-4">
          <Link href="/quality" className="hover:text-slate-600 transition-colors">Quality Assurance</Link>
          <Link href="/contact" className="hover:text-slate-600 transition-colors">Support</Link>
        </div>
      </footer>
    </div>
  );
}
