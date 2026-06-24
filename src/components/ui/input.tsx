/**
 * Input
 * Cortexa UI — text input with label, password toggle, and error state
 */

import * as React from 'react'
import { Eye, EyeOff, AlertCircle } from 'lucide-react'
import { cn } from '../../lib/util'

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  hint?: string
  error?: string
  /** Slot for an icon/adornment on the left side */
  leftIcon?: React.ReactNode
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type = 'text', label, hint, error, leftIcon, ...props }, ref) => {
    const [showPassword, setShowPassword] = React.useState(false)
    const isPassword = type === 'password'
    const inputType = isPassword ? (showPassword ? 'text' : 'password') : type

    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label className="text-[11px] font-bold uppercase tracking-[0.08em] text-[#52525B]">
            {label}
            {props.required && <span className="ml-1 text-red-500">*</span>}
          </label>
        )}

        <div className="relative">
          {leftIcon && (
            <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[#A1A1AA]">
              {leftIcon}
            </span>
          )}

          <input
            ref={ref}
            type={inputType}
            className={cn(
              'h-12 w-full rounded-xl',
              'border bg-white',
              'text-sm text-[#18181B] placeholder:text-[#A1A1AA]',
              'outline-none transition-all duration-200',
              // horizontal padding — grows when icons present
              leftIcon ? 'pl-10 pr-4' : 'px-4',
              (isPassword || error) && !leftIcon && 'pr-10',
              (isPassword || error) && leftIcon && 'pr-10',
              // border colour
              error
                ? 'border-red-400 focus:border-red-400 focus:ring-4 focus:ring-red-100'
                : 'border-[#E4E4E7] focus:border-[#2F6FED] focus:ring-4 focus:ring-[#2F6FED]/10',
              // disabled
              'disabled:cursor-not-allowed disabled:bg-[#F9FAFB] disabled:opacity-60',
              className
            )}
            {...props}
          />

          {/* right slot: error icon | password toggle */}
          <span className="absolute right-3.5 top-1/2 -translate-y-1/2 flex items-center gap-1">
            {error && !isPassword && (
              <AlertCircle size={16} className="text-red-400 shrink-0" />
            )}
            {isPassword && (
              <button
                type="button"
                tabIndex={-1}
                onClick={() => setShowPassword((p) => !p)}
                className="text-[#A1A1AA] hover:text-[#52525B] transition-colors"
              >
                {showPassword ? <Eye size={16} /> : <EyeOff size={16} />}
              </button>
            )}
          </span>
        </div>

        {(hint || error) && (
          <p className={cn('text-[12px]', error ? 'text-red-500' : 'text-[#A1A1AA]')}>
            {error || hint}
          </p>
        )}
      </div>
    )
  }
)

Input.displayName = 'Input'