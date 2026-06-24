/**
 * ProgressSteps
 * Cortexa UI — horizontal pipeline stepper matching the Job History view's
 * Inject → Extract → Evidence → Score → Report steps
 */

import { Check } from 'lucide-react'
import { cn } from '../../lib/util'

export type StepStatus = 'completed' | 'active' | 'pending'

export interface Step {
  id: string
  label: string
  status: StepStatus
}

interface ProgressStepsProps {
  steps: Step[]
  className?: string
}

export const ProgressSteps = ({ steps, className }: ProgressStepsProps) => (
  <div className={cn('flex items-center gap-0', className)}>
    {steps.map((step, i) => (
      <div key={step.id} className="flex items-center">
        {/* connector line before (except first) */}
        {i > 0 && (
          <div
            className={cn(
              'h-px w-8 transition-colors duration-300',
              steps[i - 1].status === 'completed' ? 'bg-[#2F6FED]' : 'bg-[#E4E4E7]'
            )}
          />
        )}

        <div className="flex flex-col items-center gap-1">
          {/* dot */}
          <div
            className={cn(
              'flex h-5 w-5 items-center justify-center rounded-full border-2 transition-all duration-300',
              step.status === 'completed' && 'border-[#2F6FED] bg-[#2F6FED]',
              step.status === 'active'    && 'border-[#2F6FED] bg-white',
              step.status === 'pending'   && 'border-[#D4D4D8] bg-white'
            )}
          >
            {step.status === 'completed' && (
              <Check size={11} className="text-white" strokeWidth={3} />
            )}
            {step.status === 'active' && (
              <span className="h-2 w-2 rounded-full bg-[#2F6FED]" />
            )}
          </div>

          {/* label */}
          <span
            className={cn(
              'text-[11px] font-medium whitespace-nowrap',
              step.status === 'completed' && 'text-[#2F6FED]',
              step.status === 'active'    && 'text-[#18181B]',
              step.status === 'pending'   && 'text-[#A1A1AA]'
            )}
          >
            {step.label}
          </span>
        </div>
      </div>
    ))}
  </div>
)
