import { ButtonHTMLAttributes, ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'success' | 'danger' | 'outline' | 'blue' | 'blue-outline';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function Button({
  children,
  variant = 'primary',
  size = 'md',
  className,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        'inline-flex items-center justify-center rounded-xl font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none shadow-sm hover:shadow-md',
        {
          'bg-pink-500 text-white hover:bg-pink-600 focus-visible:ring-pink-400': variant === 'primary',
          'bg-purple-100 text-purple-800 hover:bg-purple-200 focus-visible:ring-purple-300': variant === 'secondary',
          'bg-green-400 text-white hover:bg-green-500 focus-visible:ring-green-300': variant === 'success',
          'bg-red-400 text-white hover:bg-red-500 focus-visible:ring-red-300': variant === 'danger',
          'border-2 border-pink-300 bg-white text-pink-600 hover:bg-pink-50 focus-visible:ring-pink-300': variant === 'outline',
          'bg-blue-500 text-white hover:bg-blue-600 focus-visible:ring-blue-400': variant === 'blue',
          'border-2 border-blue-300 bg-white text-blue-600 hover:bg-blue-50 focus-visible:ring-blue-300': variant === 'blue-outline',
          'px-3 py-1.5 text-sm rounded-lg': size === 'sm',
          'px-4 py-2 text-base': size === 'md',
          'px-6 py-3 text-lg': size === 'lg',
        },
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
} 