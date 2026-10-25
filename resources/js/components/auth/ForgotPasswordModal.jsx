import { useState, useEffect, useRef } from "react";
import axios from "axios";
import {
    X,
    Mail,
    KeyRound,
    Lock,
    Eye,
    EyeOff,
    ArrowRight,
    ArrowLeft,
    CheckCircle2,
    AlertCircle,
    RotateCcw,
    ShieldCheck,
} from "lucide-react";

function FieldError({ error }) {
    if (!error) return null;
    return (
        <p className="text-[11px] text-rose-600 flex items-center gap-1 font-normal mt-1 animate-in fade-in">
            <AlertCircle className="w-3 h-3 shrink-0" />
            <span>{error}</span>
        </p>
    );
}

function ActionButton({
    loading,
    loadingText,
    text,
    icon: Icon = ArrowRight,
    ...props
}) {
    return (
        <button
            {...props}
            disabled={loading || props.disabled}
            className="w-full mt-2 py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-medium flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-60 shadow-2xs"
        >
            {loading ? (
                <>
                    <div className="w-3.5 h-3.5 border-2 border-white/60 border-t-white rounded-full animate-spin" />
                    <span>{loadingText}</span>
                </>
            ) : (
                <>
                    <span>{text}</span>
                    <Icon className="w-3.5 h-3.5 text-violet-400" />
                </>
            )}
        </button>
    );
}

function PasswordInput({
    label,
    value,
    onChange,
    error,
    placeholder,
    show,
    onToggle,
}) {
    return (
        <div className="space-y-1">
            <label className="text-xs font-medium text-slate-700 block">
                {label}
            </label>
            <div className="relative">
                <Lock className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                    type={show ? "text" : "password"}
                    value={value}
                    onChange={onChange}
                    placeholder={placeholder}
                    className={`w-full bg-slate-50/60 hover:bg-slate-50 focus:bg-white border rounded-xl pl-8 pr-9 py-2 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none transition-all font-normal ${
                        error
                            ? "border-rose-300 focus:border-rose-500 focus:ring-2 focus:ring-rose-500/15"
                            : "border-slate-200 focus:border-slate-300 focus:ring-2 focus:ring-violet-500/10"
                    }`}
                />
                <button
                    type="button"
                    onClick={onToggle}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
                >
                    {show ? (
                        <EyeOff className="w-3.5 h-3.5" />
                    ) : (
                        <Eye className="w-3.5 h-3.5" />
                    )}
                </button>
            </div>
            <FieldError error={error} />
        </div>
    );
}

export default function ForgotPasswordModal({ isOpen, onClose, onSuccess }) {
    const [step, setStep] = useState(1);
    const [email, setEmail] = useState("");
    const [otp, setOtp] = useState(["", "", "", "", "", ""]);
    const [password, setPassword] = useState("");
    const [passwordConfirmation, setPasswordConfirmation] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});
    const [countdown, setCountdown] = useState(0);

    const otpInputsRef = useRef([]);

    useEffect(() => {
        let timer;
        if (countdown > 0)
            timer = setTimeout(() => setCountdown(countdown - 1), 1000);
        return () => clearTimeout(timer);
    }, [countdown]);

    useEffect(() => {
        if (isOpen) {
            setStep(1);
            setEmail("");
            setOtp(["", "", "", "", "", ""]);
            setPassword("");
            setPasswordConfirmation("");
            setErrors({});
            setCountdown(0);
        }
    }, [isOpen]);

    if (!isOpen) return null;

    const clearError = (field) => {
        if (errors[field]) setErrors((prev) => ({ ...prev, [field]: "" }));
    };

    const handleOtpChange = (index, value) => {
        clearError("otp");
        if (value.length > 1) {
            const digits = value.replace(/\D/g, "").slice(0, 6).split("");
            const newOtp = [...otp];
            digits.forEach((d, i) => (newOtp[i] = d));
            setOtp(newOtp);
            otpInputsRef.current[Math.min(digits.length, 5)]?.focus();
            return;
        }
        const cleanDigit = value.replace(/\D/g, "");
        const newOtp = [...otp];
        newOtp[index] = cleanDigit;
        setOtp(newOtp);
        if (cleanDigit && index < 5) otpInputsRef.current[index + 1]?.focus();
    };

    const handleOtpKeyDown = (index, e) => {
        if (e.key === "Backspace" && !otp[index] && index > 0) {
            otpInputsRef.current[index - 1]?.focus();
        }
    };

    const fullOtp = otp.join("");

    // Step 1: Send OTP
    const handleSendOtp = async (e) => {
        if (e) e.preventDefault();
        setErrors({});
        if (!email.trim()) {
            setErrors({ email: "Please enter your registered email address." });
            return;
        }
        setLoading(true);
        try {
            const { data } = await axios.post("/forgot-password/send-otp", {
                email,
            });
            if (data.success) {
                setStep(2);
                setCountdown(60);
                setOtp(["", "", "", "", "", ""]);
                setTimeout(() => otpInputsRef.current[0]?.focus(), 100);
            }
        } catch (err) {
            setErrors({
                email:
                    err.response?.data?.errors?.email?.[0] ||
                    err.response?.data?.message ||
                    "Unable to process request.",
            });
        } finally {
            setLoading(false);
        }
    };

    // Step 2: Resend OTP
    const handleResendOtp = async () => {
        if (countdown > 0 || loading) return;
        setErrors({});
        setLoading(true);
        try {
            const { data } = await axios.post("/forgot-password/send-otp", {
                email,
            });
            if (data.success) {
                setCountdown(60);
                setOtp(["", "", "", "", "", ""]);
                otpInputsRef.current[0]?.focus();
            }
        } catch (err) {
            setErrors({
                otp:
                    err.response?.data?.errors?.email?.[0] ||
                    err.response?.data?.message ||
                    "Failed to resend code.",
            });
        } finally {
            setLoading(false);
        }
    };

    // Step 2: Verify OTP
    const handleVerifyOtp = async (e) => {
        if (e) e.preventDefault();
        setErrors({});
        if (fullOtp.length !== 6) {
            setErrors({ otp: "Please enter all 6 digits of the code." });
            return;
        }
        setLoading(true);
        try {
            const { data } = await axios.post("/forgot-password/verify-otp", {
                email,
                otp: fullOtp,
            });
            if (data.success) setStep(3);
        } catch (err) {
            setErrors({
                otp:
                    err.response?.data?.errors?.otp?.[0] ||
                    err.response?.data?.message ||
                    "Verification failed.",
            });
        } finally {
            setLoading(false);
        }
    };

    // Step 3: Reset Password
    const handleResetPassword = async (e) => {
        if (e) e.preventDefault();
        const newErrors = {};
        if (!password) newErrors.password = "Please enter a new password.";
        else if (password.length < 8)
            newErrors.password = "Password must be at least 8 characters long.";

        if (!passwordConfirmation)
            newErrors.password_confirmation =
                "Please confirm your new password.";
        else if (password && password !== passwordConfirmation)
            newErrors.password_confirmation = "Passwords do not match.";

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        setLoading(true);
        setErrors({});
        try {
            const { data } = await axios.post(
                "/forgot-password/reset-password",
                {
                    email,
                    otp: fullOtp,
                    password,
                    password_confirmation: passwordConfirmation,
                },
            );
            if (data.success) setStep(4);
        } catch (err) {
            const resErrors = err.response?.data?.errors;
            if (resErrors) {
                setErrors({
                    password: resErrors.password?.[0],
                    password_confirmation: resErrors.password_confirmation?.[0],
                    otp: resErrors.otp?.[0],
                });
            } else {
                setErrors({
                    password:
                        err.response?.data?.message ||
                        "Failed to update password.",
                });
            }
        } finally {
            setLoading(false);
        }
    };

    const headerMeta = {
        1: {
            title: "Reset Password",
            desc: "Enter your email to receive an OTP",
            Icon: Mail,
        },
        2: {
            title: "Verify Code",
            desc: "Enter the 6-digit verification code",
            Icon: KeyRound,
        },
        3: {
            title: "New Password",
            desc: "Create a strong, secure password",
            Icon: Lock,
        },
        4: {
            title: "Password Updated",
            desc: "Your credentials are now updated",
            Icon: CheckCircle2,
        },
    }[step];

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in duration-200"
            onClick={onClose}
        >
            <div
                className="w-full max-w-sm bg-white rounded-3xl shadow-xl border border-slate-200/80 overflow-hidden transform transition-all text-slate-800"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="px-6 pt-6 pb-4 flex items-start justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-violet-500/10 via-purple-500/10 to-indigo-500/10 border border-violet-100 flex items-center justify-center text-violet-600 shrink-0">
                            <headerMeta.Icon
                                className={`w-5 h-5 ${step === 4 ? "text-emerald-600" : ""}`}
                            />
                        </div>
                        <div>
                            <h3 className="text-base font-semibold text-slate-900 tracking-tight">
                                {headerMeta.title}
                            </h3>
                            <p className="text-xs text-slate-400 font-normal">
                                {headerMeta.desc}
                            </p>
                        </div>
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
                        className="w-8 h-8 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 flex items-center justify-center transition-colors cursor-pointer shrink-0 -mr-1"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>

                {/* Step Indicator */}
                {step < 4 && (
                    <div className="px-6 pb-2">
                        <div className="flex items-center gap-1.5">
                            {[1, 2, 3].map((s) => (
                                <div
                                    key={s}
                                    className={`h-1 flex-1 rounded-full transition-all duration-300 ${s <= step ? "bg-violet-600" : "bg-slate-100"}`}
                                />
                            ))}
                        </div>
                    </div>
                )}

                {/* Forms */}
                <div className="px-6 pb-6 pt-2">
                    {step === 1 && (
                        <form
                            onSubmit={handleSendOtp}
                            noValidate
                            className="space-y-4"
                        >
                            <div className="space-y-1.5">
                                <label className="text-xs font-medium text-slate-700 block">
                                    Email Address
                                </label>
                                <div className="relative">
                                    <Mail className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => {
                                            setEmail(e.target.value);
                                            clearError("email");
                                        }}
                                        placeholder="name@example.com"
                                        autoFocus
                                        className={`w-full bg-slate-50/60 hover:bg-slate-50 focus:bg-white border rounded-xl pl-8 pr-3 py-2 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none transition-all font-normal ${
                                            errors.email
                                                ? "border-rose-300 focus:border-rose-500 focus:ring-2 focus:ring-rose-500/15"
                                                : "border-slate-200 focus:border-slate-300 focus:ring-2 focus:ring-violet-500/10"
                                        }`}
                                    />
                                </div>
                                <FieldError error={errors.email} />
                            </div>
                            <ActionButton
                                loading={loading}
                                loadingText="Sending code..."
                                text="Send Verification Code"
                            />
                        </form>
                    )}

                    {step === 2 && (
                        <form
                            onSubmit={handleVerifyOtp}
                            noValidate
                            className="space-y-4"
                        >
                            <div className="text-center space-y-0.5 pb-1">
                                <p className="text-xs text-slate-600 font-normal">
                                    Code sent to{" "}
                                    <span className="font-semibold text-slate-800">
                                        {email}
                                    </span>
                                </p>
                                <p className="text-[10px] text-slate-400">
                                    Valid for 10 minutes
                                </p>
                            </div>

                            <div className="space-y-1.5">
                                <div className="flex items-center justify-center gap-1.5 sm:gap-2">
                                    {otp.map((digit, idx) => (
                                        <input
                                            key={idx}
                                            ref={(el) =>
                                                (otpInputsRef.current[idx] = el)
                                            }
                                            type="text"
                                            inputMode="numeric"
                                            maxLength={1}
                                            value={digit}
                                            onChange={(e) =>
                                                handleOtpChange(
                                                    idx,
                                                    e.target.value,
                                                )
                                            }
                                            onKeyDown={(e) =>
                                                handleOtpKeyDown(idx, e)
                                            }
                                            autoFocus={idx === 0}
                                            className={`w-9 h-11 sm:w-10 sm:h-12 text-center text-base sm:text-lg font-semibold rounded-xl border focus:outline-none transition-all ${
                                                errors.otp
                                                    ? "border-rose-300 bg-rose-50/40 text-rose-900 focus:border-rose-500 focus:ring-2 focus:ring-rose-500/15"
                                                    : "border-slate-200 bg-slate-50/60 hover:bg-slate-50 focus:bg-white text-slate-900 focus:border-violet-600 focus:ring-2 focus:ring-violet-500/10"
                                            }`}
                                        />
                                    ))}
                                </div>
                                {errors.otp && (
                                    <p className="text-[11px] text-rose-600 flex items-center justify-center gap-1 font-normal mt-2 animate-in fade-in">
                                        <AlertCircle className="w-3 h-3 shrink-0" />
                                        <span>{errors.otp}</span>
                                    </p>
                                )}
                            </div>

                            <div className="flex items-center justify-between text-xs pt-1">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setStep(1);
                                        setErrors({});
                                    }}
                                    className="text-slate-400 hover:text-slate-700 flex items-center gap-1 transition-colors cursor-pointer text-[11px]"
                                >
                                    <ArrowLeft className="w-3 h-3" />
                                    <span>Change Email</span>
                                </button>

                                <button
                                    type="button"
                                    disabled={countdown > 0 || loading}
                                    onClick={handleResendOtp}
                                    className={`flex items-center gap-1 transition-colors text-[11px] ${
                                        countdown > 0
                                            ? "text-slate-400 cursor-not-allowed"
                                            : "text-violet-600 hover:text-violet-700 font-medium cursor-pointer"
                                    }`}
                                >
                                    <RotateCcw className="w-3 h-3" />
                                    <span>
                                        {countdown > 0
                                            ? `Resend in ${countdown}s`
                                            : "Resend Code"}
                                    </span>
                                </button>
                            </div>

                            <ActionButton
                                loading={loading}
                                loadingText="Verifying code..."
                                text="Verify Code"
                                disabled={fullOtp.length !== 6}
                            />
                        </form>
                    )}

                    {step === 3 && (
                        <form
                            onSubmit={handleResetPassword}
                            noValidate
                            className="space-y-4"
                        >
                            <PasswordInput
                                label="New Password"
                                value={password}
                                onChange={(e) => {
                                    setPassword(e.target.value);
                                    clearError("password");
                                }}
                                error={errors.password}
                                placeholder="At least 8 characters"
                                show={showPassword}
                                onToggle={() => setShowPassword(!showPassword)}
                            />
                            <PasswordInput
                                label="Confirm New Password"
                                value={passwordConfirmation}
                                onChange={(e) => {
                                    setPasswordConfirmation(e.target.value);
                                    clearError("password_confirmation");
                                }}
                                error={errors.password_confirmation}
                                placeholder="Re-enter password"
                                show={showConfirmPassword}
                                onToggle={() =>
                                    setShowConfirmPassword(!showConfirmPassword)
                                }
                            />
                            <ActionButton
                                loading={loading}
                                loadingText="Updating password..."
                                text="Reset Password"
                                icon={ShieldCheck}
                            />
                        </form>
                    )}

                    {step === 4 && (
                        <div className="text-center py-4 space-y-4">
                            <div className="w-12 h-12 mx-auto rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-100">
                                <CheckCircle2 className="w-6 h-6 text-emerald-600" />
                            </div>
                            <div className="space-y-1">
                                <h4 className="text-sm font-semibold text-slate-900">
                                    Password Reset Successfully!
                                </h4>
                                <p className="text-xs text-slate-500 max-w-xs mx-auto font-normal">
                                    Your credentials have been securely updated.
                                    You can now sign in with your new password.
                                </p>
                            </div>
                            <button
                                type="button"
                                onClick={() => {
                                    if (onSuccess) onSuccess(email);
                                    onClose();
                                }}
                                className="w-full py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-medium flex items-center justify-center gap-2 transition-all cursor-pointer shadow-2xs"
                            >
                                <span>Back to Sign In</span>
                                <ArrowRight className="w-3.5 h-3.5 text-violet-400" />
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
