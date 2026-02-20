export default function Button({
  children,
  onClick,
  variant = 'primary',
  size = 'lg',
  disabled = false,
  className = '',
  type = 'button',
  fullWidth = true,
}) {
  const base = 'inline-flex items-center justify-center font-semibold rounded-2xl transition-all active:scale-95 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-40 disabled:pointer-events-none select-none';

  const sizes = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-5 py-2.5 text-sm',
    lg: 'px-6 py-4 text-base',
  };

  const variants = {
    primary: 'bg-indigo-600 text-white focus:ring-indigo-500 active:bg-indigo-700 shadow-sm',
    secondary: 'bg-indigo-50 text-indigo-700 focus:ring-indigo-400 active:bg-indigo-100',
    danger: 'bg-red-50 text-red-600 focus:ring-red-400 active:bg-red-100',
    ghost: 'bg-transparent text-gray-600 focus:ring-gray-300 active:bg-gray-100',
    outline: 'bg-white border border-gray-200 text-gray-700 focus:ring-gray-300 active:bg-gray-50',
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${base} ${sizes[size]} ${variants[variant]} ${fullWidth ? 'w-full' : ''} ${className}`}
    >
      {children}
    </button>
  );
}
