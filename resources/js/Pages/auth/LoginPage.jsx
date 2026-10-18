import { useState } from 'react';
import { useForm, usePage, router } from '@inertiajs/react';
import { 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  ArrowRight, 
  AlertCircle,
  KeyRound,
  ShieldCheck,
  Stethoscope
} from 'lucide-react';

export default function LoginPage() {
  const { props } = usePage();
  const companyProfile = props.company || {};
  const [showPassword, setShowPassword] = useState(false);
  const [demoLoading, setDemoLoading] = useState(null);

  const { data, setData, post, processing, errors, reset } = useForm({
    email: '',
    password: '',
    remember: true,
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    post('/login', {
      onFinish: () => reset('password'),
    });
  };

  // One-click demo login using seeder credentials
  const handleQuickLogin = (email, password, role) => {
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

  const companyName = companyProfile?.company_name || companyProfile?.name || 'Ciplon Pharma Private Limited';
  const logoUrl = companyProfile?.logo_url || companyProfile?.logoUrl || '';

  return (
    <div className="min-h-screen bg-slate-50/70 flex items-center justify-center p-4 sm:p-6 relative overflow-hidden font-sans">
      {/* Subtle ambient background glow */}
      <div className="pointer-events-none absolute -top-32 -left-32 w-96 h-96 bg-[#c59324]/10 rounded-full blur-3xl" />
      <div className="pointer-events-none absolute -bottom-32 -right-32 w-96 h-96 bg-[#0c2340]/10 rounded-full blur-3xl" />

      {/* Main Login Card - Clean & Minimal */}
      <div className="w-full max-w-sm bg-white rounded-3xl p-8 sm:p-10 border border-slate-200/90 shadow-xl relative z-10 space-y-6">
        {/* Company Header */}
        <div className="text-center space-y-3">
          <div className="h-12 flex items-center justify-center">
            <img
              src={logoUrl || '/images/ciplon_logo.png'}
              alt={companyName}
              className="h-11 w-auto object-contain"
              onError={(e) => {
                e.currentTarget.src = '/images/ciplon_logo.png';
              }}
            />
          </div>

          <div className="space-y-0.5">
            <h1 className="text-lg font-bold tracking-tight text-[#0c2340]">
              {companyName}
            </h1>
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#c59324] block">
              Authorized Portal Access
            </span>
          </div>
        </div>

        {props.flash?.error && (
          <div className="p-3.5 rounded-2xl bg-rose-50 text-rose-700 text-xs leading-relaxed text-center border border-rose-200 flex items-center justify-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
            <span>{props.flash.error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700 block">
              Email
            </label>
            <div className="relative flex items-center">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Mail className="w-4 h-4" />
              </div>
              <input
                type="email"
                value={data.email}
                onChange={(e) => setData('email', e.target.value)}
                placeholder="name@company.com"
                autoComplete="email"
                className={`w-full pl-10 pr-3.5 py-2.5 rounded-xl text-xs font-medium placeholder-slate-400 focus:outline-none transition-all ${
                  errors.email
                    ? 'bg-rose-50/40 text-slate-900 border border-rose-400 focus:bg-white focus:ring-2 focus:ring-rose-500'
                    : 'bg-slate-50/80 text-slate-900 border border-slate-200 focus:bg-white focus:ring-2 focus:ring-[#c59324]'
                }`}
              />
            </div>
            {errors.email && (
              <p className="text-[11px] text-rose-600 flex items-center gap-1 font-medium mt-1">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                {errors.email}
              </p>
            )}
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700 block">
              Password
            </label>
            <div className="relative flex items-center">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Lock className="w-4 h-4" />
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                value={data.password}
                onChange={(e) => setData('password', e.target.value)}
                placeholder="•••••••••"
                autoComplete="current-password"
                className={`w-full pl-10 pr-10 py-2.5 rounded-xl text-xs font-medium placeholder-slate-400 focus:outline-none transition-all ${
                  errors.password
                    ? 'bg-rose-50/40 text-slate-900 border border-rose-400 focus:bg-white focus:ring-2 focus:ring-rose-500'
                    : 'bg-slate-50/80 text-slate-900 border border-slate-200 focus:bg-white focus:ring-2 focus:ring-[#c59324]'
                }`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-[#c59324] transition-colors cursor-pointer"
                tabIndex={-1}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {errors.password && (
              <p className="text-[11px] text-rose-600 flex items-center gap-1 font-medium mt-1">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                {errors.password}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={processing || demoLoading !== null}
            className="w-full mt-2 py-3 px-4 rounded-xl bg-[#0c2340] hover:bg-[#c59324] text-white text-xs font-bold flex items-center justify-center gap-2 transition-all shadow-md shadow-[#0c2340]/20 disabled:opacity-60 cursor-pointer"
          >
            {processing && demoLoading === null ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Signing In...</span>
              </>
            ) : (
              <>
                <span>Sign In</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Forgot Password */}
        <div className="text-center pt-2 border-t border-slate-100">
          <button
            type="button"
            onClick={() => alert('Please contact the system administrator to reset your password.')}
            className="text-xs font-medium text-slate-500 hover:text-[#c59324] transition-colors cursor-pointer"
          >
            Forgot password?
          </button>
        </div>
      </div>

      {/* Demo Login Option at Bottom Right Corner */}
      <div className="fixed bottom-5 right-5 z-40 bg-white/95 backdrop-blur-md rounded-2xl border border-slate-200 p-3 shadow-lg max-w-xs space-y-2">
        <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-700 px-0.5">
          <KeyRound className="w-3.5 h-3.5 text-[#c59324]" />
          <span>Demo Login</span>
        </div>

        <div className="flex items-center gap-2">
          {/* MR Demo Button */}
          <button
            type="button"
            disabled={processing || demoLoading !== null}
            onClick={() => handleQuickLogin('mr@ciplon.com', '123456789', 'mr')}
            className="flex-1 px-3 py-1.5 rounded-xl bg-teal-50 hover:bg-teal-100 text-teal-800 border border-teal-200/80 text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-xs disabled:opacity-50"
            title="Log in as MR (mr@ciplon.com)"
          >
            {demoLoading === 'mr' ? (
              <div className="w-3 h-3 border-2 border-teal-800 border-t-transparent rounded-full animate-spin" />
            ) : (
              <Stethoscope className="w-3.5 h-3.5" />
            )}
            <span>MR Portal</span>
          </button>

          {/* Admin Demo Button */}
          <button
            type="button"
            disabled={processing || demoLoading !== null}
            onClick={() => handleQuickLogin('admin@gmail.com', '123456789', 'admin')}
            className="flex-1 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-300/80 text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-xs disabled:opacity-50"
            title="Log in as Admin (admin@gmail.com)"
          >
            {demoLoading === 'admin' ? (
              <div className="w-3 h-3 border-2 border-slate-800 border-t-transparent rounded-full animate-spin" />
            ) : (
              <ShieldCheck className="w-3.5 h-3.5" />
            )}
            <span>Admin</span>
          </button>
        </div>
      </div>
    </div>
  );
}
