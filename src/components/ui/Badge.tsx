import React from 'react';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'secondary' | 'success' | 'warning' | 'danger' | 'info';
  outline?: boolean;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'default',
  outline = false,
  className = '',
  ...props
}) => {
  const baseStyles = 'inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border transition-colors';
  
  const solidStyles = {
    default: 'bg-primary/10 border-primary/20 text-primary dark:bg-primary/20 dark:border-primary/30 dark:text-indigo-300',
    secondary: 'bg-slate-100 border-slate-200 text-slate-700 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-300',
    success: 'bg-emerald-500/10 border-emerald-500/20 text-emerald-600 dark:bg-emerald-500/20 dark:border-emerald-500/30 dark:text-emerald-400',
    warning: 'bg-amber-500/10 border-amber-500/20 text-amber-600 dark:bg-amber-500/20 dark:border-amber-500/30 dark:text-amber-400',
    danger: 'bg-rose-500/10 border-rose-500/20 text-rose-600 dark:bg-rose-500/20 dark:border-rose-500/30 dark:text-rose-400',
    info: 'bg-sky-500/10 border-sky-500/20 text-sky-600 dark:bg-sky-500/20 dark:border-sky-500/30 dark:text-sky-400',
  };

  const outlineStyles = {
    default: 'bg-transparent border-primary/40 text-primary',
    secondary: 'bg-transparent border-slate-300 text-slate-600 dark:border-slate-700 dark:text-slate-400',
    success: 'bg-transparent border-emerald-500/40 text-emerald-600 dark:text-emerald-400',
    warning: 'bg-transparent border-amber-500/40 text-amber-600 dark:text-amber-400',
    danger: 'bg-transparent border-rose-500/40 text-rose-600 dark:text-rose-400',
    info: 'bg-transparent border-sky-500/40 text-sky-600 dark:text-sky-400',
  };

  const selectedStyles = outline ? outlineStyles[variant] : solidStyles[variant];

  return (
    <span
      className={`${baseStyles} ${selectedStyles} ${className}`}
      {...props}
    >
      {children}
    </span>
  );
};
export default Badge;
