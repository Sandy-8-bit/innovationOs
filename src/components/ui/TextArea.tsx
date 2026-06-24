/**
 * TextArea
 * Cortexa UI — resizable textarea with label, char counter, and error state
 */

import * as React from 'react'
import { cn } from '../../lib/util'

interface TextAreaProps {
  id?: string
  name?: string
  label?: string
  placeholder?: string
  value: string
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void
  required?: boolean
  disabled?: boolean
  rows?: number
  maxLength?: number
  error?: string
  hint?: string
  className?: string
}

export const TextArea = ({
  id,
  name,
  label,
  placeholder,
  value,
  onChange,
  required = false,
  disabled = false,
  rows = 4,
  maxLength,
  error,
  hint,
  className,
}: TextAreaProps) => {
  const charCount = value.length

  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <div className="flex items-baseline justify-between">
          <label
            htmlFor={id}
            className="text-[11px] font-bold uppercase tracking-[0.08em] text-[#52525B]"
          >
            {label}
            {required && <span className="ml-1 text-red-500">*</span>}
          </label>
          {maxLength && (
            <span
              className={cn(
                'text-[11px] tabular-nums',
                charCount > maxLength ? 'text-red-400' : 'text-[#A1A1AA]'
              )}
            >
              {charCount}/{maxLength}
            </span>
          )}
        </div>
      )}

      <textarea
        id={id}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        disabled={disabled}
        rows={rows}
        maxLength={maxLength}
        className={cn(
          'w-full resize-none rounded-xl',
          'border bg-white',
          'px-4 py-3',
          'text-sm text-[#18181B] placeholder:text-[#A1A1AA]',
          'outline-none transition-all duration-200',
          error
            ? 'border-red-400 focus:border-red-400 focus:ring-4 focus:ring-red-100'
            : 'border-[#E4E4E7] focus:border-[#2F6FED] focus:ring-4 focus:ring-[#2F6FED]/10',
          'disabled:cursor-not-allowed disabled:bg-[#F9FAFB] disabled:opacity-60',
          className
        )}
      />

      {(hint || error) && (
        <p className={cn('text-[12px]', error ? 'text-red-500' : 'text-[#A1A1AA]')}>
          {error || hint}
        </p>
      )}
    </div>
  )
}