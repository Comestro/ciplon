import React from 'react';
import { Search, X } from 'lucide-react';

/**
 * Standard Reusable SearchBar component for all Ciplon MR & Admin pages.
 *
 * @param {Object} props
 * @param {string} props.value - Current search term
 * @param {function} props.onChange - Event handler for input changes
 * @param {function} [props.onClear] - Optional callback when clear button is clicked
 * @param {string} [props.placeholder='Search...'] - Placeholder text
 * @param {string} [props.className='flex-1 w-full'] - Container class
 * @param {string} [props.inputClassName=''] - Additional custom classes for input
 * @param {boolean} [props.showClear=true] - Whether to show the clear 'X' button
 * @param {boolean} [props.disabled=false] - Disable the input
 */
export default function SearchBar({
  value = '',
  onChange,
  onClear,
  placeholder = 'Search...',
  className = 'flex-1 w-full',
  inputClassName = '',
  showClear = true,
  disabled = false,
  ...props
}) {
  const handleClear = () => {
    if (onClear) {
      onClear();
    } else if (onChange) {
      onChange({ target: { value: '' } });
    }
  };

  const hasValue = Boolean(value && String(value).length > 0);

  // If container class already contains 'relative', don't duplicate
  const containerClasses = className.includes('relative') 
    ? className 
    : `relative ${className}`;

  return (
    <div className={containerClasses}>
      <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none shrink-0" />
      <input
        type="text"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
        className={`w-full pl-9 ${hasValue && showClear ? 'pr-8' : 'pr-3.5'} py-2 text-xs rounded-xl border border-slate-200 bg-slate-50/70 hover:bg-slate-50 focus:bg-white focus:border-slate-800 focus:outline-hidden focus:ring-1 focus:ring-slate-800 transition-all text-slate-800 placeholder:text-slate-400 disabled:opacity-60 disabled:cursor-not-allowed ${inputClassName}`}
        {...props}
      />
      {hasValue && showClear && !disabled && (
        <button
          type="button"
          onClick={handleClear}
          className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
          title="Clear search"
          aria-label="Clear search"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      )}
    </div>
  );
}