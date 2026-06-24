/**
 * Toggle (Switch)
 * Cortexa UI — accessible on/off switch
 */

import { cn } from '../../lib/util'

interface ToggleProps {
  checked: boolean
  onChange: (checked: boolean) => void
  label?: string
  description?: string
  disabled?: boolean
  size?: 'sm' | 'md'
}

export const Toggle = ({
  checked,
  onChange,
  label,
  description,
  disabled = false,
  size = 'md',
}: ToggleProps) => {
  return (
    <label
      className={cn(
        'flex items-center gap-3',
        disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'
      )}
    >
      {/* track */}
      <div className="relative shrink-0">
        <input
          type="checkbox"
          className="sr-only"
          checked={checked}
          disabled={disabled}
          onChange={(e) => onChange(e.target.checked)}
        />
        <div
          className={cn(
            'rounded-full transition-colors duration-200',
            size === 'sm' ? 'h-5 w-9' : 'h-6 w-11',
            checked ? 'bg-[#2F6FED]' : 'bg-[#D4D4D8]'
          )}
        />
        {/* thumb */}
        <div
          className={cn(
            'absolute top-0.5 rounded-full bg-white shadow-sm transition-transform duration-200',
            size === 'sm' ? 'h-4 w-4' : 'h-5 w-5',
            size === 'sm'
              ? checked ? 'translate-x-4' : 'translate-x-0.5'
              : checked ? 'translate-x-5' : 'translate-x-0.5'
          )}
        />
      </div>

      {(label || description) && (
        <div>
          {label && (
            <span className="text-sm font-medium text-[#18181B]">{label}</span>
          )}
          {description && (
            <p className="text-[12px] text-[#A1A1AA]">{description}</p>
          )}
        </div>
      )}
    </label>
  )
}
