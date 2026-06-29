import React from 'react';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  hoverable?: boolean;
  glass?: boolean;
}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ children, className = '', hoverable = false, glass = false, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={`rounded-2xl border transition-all duration-200
          ${glass 
            ? 'glass' 
            : 'bg-white border-slate-200/60 dark:bg-slate-900/40 dark:border-slate-800/40 shadow-premium'
          }
          ${hoverable 
            ? 'hover:shadow-lg hover:border-slate-300 dark:hover:border-slate-700/60 cursor-pointer active:scale-[0.99]' 
            : ''
          }
          ${className}
        `}
        {...props}
      />
    );
  }
);

Card.displayName = 'Card';
export default Card;
