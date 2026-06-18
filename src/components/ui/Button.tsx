import * as React from 'react'
import { cn } from '../../lib/util'

interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'microsoft'
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          'w-full h-11 rounded-xl text-sm font-medium transition-all duration-200',
          'disabled:opacity-50 disabled:cursor-not-allowed',

          variant === 'primary' && [
            'bg-[#2F6FED]',
            'text-white',
            'hover:bg-[#265fd0]',
            'shadow-sm',
          ],

          variant === 'microsoft' && [
            'bg-white',
            'border border-[#E5E7EB]',
            'text-[#3F3F46]',
            'hover:bg-[#F9FAFB]',
          ],

          className
        )}
        {...props}
      >
        {children}
      </button>
    )
  }
)

Button.displayName = 'Button'