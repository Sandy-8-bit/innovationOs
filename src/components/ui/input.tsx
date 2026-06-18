import * as React from 'react'
import { Eye, EyeOff } from 'lucide-react'
import { cn } from '../../lib/util'

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type = 'text', label, ...props }, ref) => {
    const [showPassword, setShowPassword] = React.useState(false)

    const isPassword = type === 'password'

    return (
      <div className="flex flex-col gap-2">
        {label && (
          <label className="text-sm font-medium text-[#52525B]">
            {label}
            {props.required && (
              <span className="ml-1 text-red-500">*</span>
            )}
          </label>
        )}

        <div className="relative">
          <input
            ref={ref}
            type={
              isPassword
                ? showPassword
                  ? 'text'
                  : 'password'
                : type
            }
            className={cn(
              'h-12 w-full rounded-xl',
              'border border-[#E4E4E7]',
              'bg-white',
              'px-4',
              isPassword && 'pr-12',
              'text-sm text-[#18181B]',
              'placeholder:text-[#A1A1AA]',
              'outline-none',
              'transition-all duration-200',
              'focus:border-[#2F6FED]',
              className
            )}
            {...props}
          />

          {isPassword && (
            <button
              type="button"
              onClick={() =>
                setShowPassword(!showPassword)
              }
              className="absolute right-4 top-1/2 -translate-y-1/2 text-[#A1A1AA]"
            >
              {showPassword ? (
                <Eye size={18} />
              ) : (
                <EyeOff size={18} />
              )}
            </button>
          )}
        </div>
      </div>
    )
  }
)

Input.displayName = 'Input'