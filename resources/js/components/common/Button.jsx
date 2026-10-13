import { Link } from '@inertiajs/react';

export default function Button({
  children,
  variant = "primary",
  size = "md",
  href,
  onClick,
  type = "button",
  icon: Icon,
  iconPosition = "right",
  className = "",
  disabled = false,
  ...props
}) {
  const baseStyles = "inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none cursor-pointer";

  const variants = {
    primary: "bg-[#0c2340] text-white hover:bg-[#123055] active:bg-[#07172b] focus:ring-[#c59324] shadow-xs",
    medical: "bg-gradient-to-r from-[#c59324] via-[#d4a029] to-[#b8831b] text-white hover:from-[#b8831b] hover:to-[#9f6d0f] focus:ring-[#c59324] shadow-xs",
    secondary: "bg-amber-50 text-[#0c2340] border border-amber-200/80 hover:bg-amber-100/70 focus:ring-[#c59324]",
    outline: "bg-white text-slate-700 border border-slate-200 hover:border-[#c59324] hover:text-[#0c2340] active:bg-slate-100 focus:ring-[#c59324]",
    white: "bg-white text-slate-900 hover:bg-slate-100 active:bg-slate-200 focus:ring-white",
    ghost: "bg-transparent text-slate-700 hover:bg-amber-50/50 hover:text-[#0c2340] active:bg-slate-200 focus:ring-[#c59324]"
  };

  const sizes = {
    sm: "px-3.5 py-1.5 text-xs gap-1.5",
    md: "px-5 py-2.5 text-sm gap-2",
    lg: "px-6 py-3 text-base gap-2.5 font-semibold"
  };

  const combinedClasses = `${baseStyles} ${variants[variant] || variants.primary} ${sizes[size] || sizes.md} ${className}`;

  const content = (
    <>
      {Icon && iconPosition === "left" && <Icon className="w-4 h-4 shrink-0 transition-transform group-hover:-translate-x-0.5" />}
      <span>{children}</span>
      {Icon && iconPosition === "right" && <Icon className="w-4 h-4 shrink-0 transition-transform group-hover:translate-x-0.5" />}
    </>
  );

  if (href) {
    if (href.startsWith('/') && !href.includes('#')) {
      return (
        <Link href={href} className={`group ${combinedClasses}`} {...props}>
          {content}
        </Link>
      );
    }

    return (
      <a href={href} className={`group ${combinedClasses}`} {...props}>
        {content}
      </a>
    );
  }

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`group ${combinedClasses}`}
      {...props}
    >
      {content}
    </button>
  );
}
