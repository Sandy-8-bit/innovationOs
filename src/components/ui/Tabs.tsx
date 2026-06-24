/**
 * Tabs
 * Cortexa UI — pill-style filter tabs matching the Job History filter bar
 */

import { cn } from '../../lib/util'

export interface Tab {
  id: string
  label: string
  count?: number
}

interface TabsProps {
  tabs: Tab[]
  activeTab: string
  onChange: (id: string) => void
  className?: string
}

export const Tabs = ({ tabs, activeTab, onChange, className }: TabsProps) => (
  <div className={cn('flex items-center gap-1 rounded-xl bg-[#F4F4F5] p-1', className)}>
    {tabs.map((tab) => {
      const isActive = tab.id === activeTab
      return (
        <button
          key={tab.id}
          type="button"
          onClick={() => onChange(tab.id)}
          className={cn(
            'flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-[13px] font-medium transition-all duration-150',
            isActive
              ? 'bg-white text-[#18181B] shadow-sm'
              : 'text-[#71717A] hover:text-[#18181B]'
          )}
        >
          {tab.label}
          {tab.count !== undefined && (
            <span
              className={cn(
                'rounded-full px-1.5 py-0.5 text-[10px] font-bold tabular-nums',
                isActive ? 'bg-[#2F6FED] text-white' : 'bg-[#E4E4E7] text-[#71717A]'
              )}
            >
              {tab.count}
            </span>
          )}
        </button>
      )
    })}
  </div>
)
