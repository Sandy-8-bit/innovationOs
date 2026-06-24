/**
 * Button
 * Cortexa UI — primary action button with variant support
 */

import * as React from 'react'
import { cn } from '../../lib/util'

export type ButtonVariant =
  | 'primary'
  | 'secondary'
  | 'ghost'
  | 'danger'
  | 'microsoft'

export type ButtonSize = 'sm' | 'md' | 'lg'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  size?: ButtonSize
  loading?: boolean
  icon?: React.ReactNode
  iconPosition?: 'left' | 'right'
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = 'primary',
      size = 'md',
      loading = false,
      icon,
      iconPosition = 'left',
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    const isDisabled = disabled || loading

    return (
      <button
        ref={ref}
        disabled={isDisabled}
        className={cn(
          // base
          'inline-flex items-center justify-center gap-2 font-medium transition-all duration-200 focus:outline-none',
          'disabled:opacity-50 disabled:cursor-not-allowed',

          // size
          size === 'sm' && 'h-8 rounded-lg px-3 text-[12px]',
          size === 'md' && 'h-11 rounded-xl px-4 text-sm',
          size === 'lg' && 'h-12 rounded-xl px-5 text-[15px]',

          // variant: primary
          variant === 'primary' && [
            'bg-[#2F6FED] text-white shadow-sm',
            'hover:bg-[#265fd0]',
            'focus:ring-4 focus:ring-[#2F6FED]/20',
          ],

          // variant: secondary
          variant === 'secondary' && [
            'bg-white text-[#1A1917] border border-[#E4E4E7]',
            'hover:bg-[#F9FAFB]',
            'focus:ring-4 focus:ring-black/5',
          ],

          // variant: ghost
          variant === 'ghost' && [
            'bg-transparent text-[#52525B]',
            'hover:bg-[#F4F4F5]',
            'focus:ring-4 focus:ring-black/5',
          ],

          // variant: danger
          variant === 'danger' && [
            'bg-red-500 text-white shadow-sm',
            'hover:bg-red-600',
            'focus:ring-4 focus:ring-red-500/20',
          ],

          // variant: microsoft (oauth)
          variant === 'microsoft' && [
            'bg-white text-[#3F3F46] border border-[#E5E7EB]',
            'hover:bg-[#F9FAFB]',
          ],

          className
        )}
        {...props}
      >
        {loading ? (
          <>
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
            {children}
          </>
        ) : (
          <>
            {icon && iconPosition === 'left' && (
              <span className="shrink-0">{icon}</span>
            )}
            {children}
            {icon && iconPosition === 'right' && (
              <span className="shrink-0">{icon}</span>
            )}
          </>
        )}
      </button>
    )
  }
)

Button.displayName = 'Button'