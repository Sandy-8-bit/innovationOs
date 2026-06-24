/**
 * Card
 * Cortexa UI — white surface card with optional header, padding variants, and hover state
 */

import { cn } from '../../lib/util'

interface CardProps {
  children: React.ReactNode
  className?: string
  /** Adds a subtle hover lift — useful for clickable cards */
  hoverable?: boolean
  padding?: 'none' | 'sm' | 'md' | 'lg'
}

export const Card = ({
  children,
  className,
  hoverable = false,
  padding = 'md',
}: CardProps) => (
  <div
    className={cn(
      'rounded-2xl border border-[#E4E4E7] bg-white',
      padding === 'none' && 'p-0',
      padding === 'sm'  && 'p-4',
      padding === 'md'  && 'p-6',
      padding === 'lg'  && 'p-8',
      hoverable && 'cursor-pointer transition-all duration-150 hover:border-[#2F6FED]/30 hover:shadow-[0_4px_16px_rgba(47,111,237,0.08)]',
      className
    )}
  >
    {children}
  </div>
)

/* ── Composable sub-parts ── */

interface CardHeaderProps {
  title: string
  description?: string
  action?: React.ReactNode
  className?: string
}

export const CardHeader = ({ title, description, action, className }: CardHeaderProps) => (
  <div className={cn('flex items-start justify-between gap-4 border-b border-[#F4F4F5] pb-4 mb-4', className)}>
    <div>
      <h3 className="text-sm font-semibold text-[#18181B]">{title}</h3>
      {description && (
        <p className="mt-0.5 text-[13px] text-[#A1A1AA]">{description}</p>
      )}
    </div>
    {action && <div className="shrink-0">{action}</div>}
  </div>
)
