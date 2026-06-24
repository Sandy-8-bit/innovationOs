/**
 * Badge
 * Cortexa UI — status/label chips matching the job-history pipeline indicators
 */

import { cn } from '../../lib/util'

export type BadgeVariant =
  | 'default'
  | 'blue'
  | 'green'
  | 'orange'
  | 'red'
  | 'purple'
  | 'gray'

interface BadgeProps {
  variant?: BadgeVariant
  children: React.ReactNode
  className?: string
  /** Show a leading dot */
  dot?: boolean
}

const variantStyles: Record<BadgeVariant, string> = {
  default: 'bg-[#F4F4F5] text-[#52525B] border-[#E4E4E7]',
  blue:    'bg-[#EFF4FF] text-[#2F6FED] border-[#BFDBFE]',
  green:   'bg-[#F0FDF4] text-[#16A34A] border-[#BBF7D0]',
  orange:  'bg-[#FFF7ED] text-[#EA580C] border-[#FED7AA]',
  red:     'bg-[#FEF2F2] text-[#DC2626] border-[#FECACA]',
  purple:  'bg-[#F5F3FF] text-[#7C3AED] border-[#DDD6FE]',
  gray:    'bg-[#F9FAFB] text-[#6B7280] border-[#E5E7EB]',
}

const dotColors: Record<BadgeVariant, string> = {
  default: 'bg-[#52525B]',
  blue:    'bg-[#2F6FED]',
  green:   'bg-[#16A34A]',
  orange:  'bg-[#EA580C]',
  red:     'bg-[#DC2626]',
  purple:  'bg-[#7C3AED]',
  gray:    'bg-[#6B7280]',
}

export const Badge = ({
  variant = 'default',
  children,
  className,
  dot = false,
}: BadgeProps) => (
  <span
    className={cn(
      'inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[11px] font-semibold',
      variantStyles[variant],
      className
    )}
  >
    {dot && (
      <span className={cn('h-1.5 w-1.5 rounded-full shrink-0', dotColors[variant])} />
    )}
    {children}
  </span>
)
