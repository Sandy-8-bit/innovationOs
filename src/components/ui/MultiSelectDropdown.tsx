/**
 * MultiSelectDropdown
 * Cortexa UI — multi (or single) select with chips, search, and checkboxes
 */

import { useState, useRef, useMemo, useEffect } from 'react'
import { ChevronDown, X } from 'lucide-react'
import { cn } from '../../lib/util'

export interface MultiSelectOption {
  label: string
  value: string
}

interface MultiSelectDropdownProps {
  options: MultiSelectOption[]
  value: string[]
  onChange: (value: string[]) => void
  placeholder?: string
  label?: string
  required?: boolean
  disabled?: boolean
  /** false = single-select mode (no checkboxes, no chips) */
  multiSelect?: boolean
}

export const MultiSelectDropdown = ({
  options,
  value,
  onChange,
  placeholder = 'Select…',
  label,
  required = false,
  disabled = false,
  multiSelect = true,
}: MultiSelectDropdownProps) => {
  const [isOpen, setIsOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const containerRef = useRef<HTMLDivElement>(null)

  const filteredOptions = useMemo(
    () => options.filter((o) => o.label.toLowerCase().includes(searchTerm.toLowerCase())),
    [options, searchTerm]
  )

  const selectedLabels = useMemo(
    () =>
      value
        .map((v) => options.find((o) => o.value === v)?.label)
        .filter(Boolean) as string[],
    [value, options]
  )

  const toggleOption = (val: string) => {
    if (multiSelect) {
      onChange(value.includes(val) ? value.filter((v) => v !== val) : [...value, val])
    } else {
      onChange([val])
      close()
    }
  }

  const removeItem = (val: string, e: React.MouseEvent) => {
    e.stopPropagation()
    onChange(value.filter((v) => v !== val))
  }

  const close = () => {
    setIsOpen(false)
    setSearchTerm('')
  }

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) close()
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') close() }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [])

  return (
    <div className="relative w-full" ref={containerRef}>
      {label && (
        <label className="mb-1.5 block text-[11px] font-bold uppercase tracking-[0.08em] text-[#52525B]">
          {label}
          {required && <span className="ml-0.5 text-red-500">*</span>}
        </label>
      )}

      {/* trigger */}
      <div
        onClick={() => !disabled && setIsOpen((p) => !p)}
        className={cn(
          'relative flex min-h-[48px] w-full cursor-pointer items-center rounded-xl border bg-white px-3 py-1.5 pr-9 transition-all duration-150',
          isOpen
            ? 'border-[#2F6FED] ring-4 ring-[#2F6FED]/10'
            : 'border-[#E4E4E7] hover:border-[#C4C4C7]',
          disabled && 'cursor-not-allowed bg-[#F9FAFB] opacity-60'
        )}
      >
        {value.length === 0 ? (
          <span className="text-sm text-[#A1A1AA]">{placeholder}</span>
        ) : (
          <div className="flex flex-wrap gap-1.5">
            {selectedLabels.slice(0, multiSelect ? undefined : 1).map((lbl, i) => (
              <span
                key={value[i]}
                className="inline-flex items-center gap-1 rounded-full border border-[#BFDBFE] bg-[#EFF6FF] px-2.5 py-0.5 text-[11px] font-semibold text-[#2F6FED]"
              >
                {lbl}
                {multiSelect && (
                  <button
                    type="button"
                    onClick={(e) => removeItem(value[i], e)}
                    className="text-[#2F6FED]/60 hover:text-[#2F6FED] transition-colors"
                  >
                    <X size={10} />
                  </button>
                )}
              </span>
            ))}
          </div>
        )}

        <span className="pointer-events-none absolute right-3 top-0 bottom-0 flex items-center">
          <ChevronDown
            size={15}
            className={`text-[#A1A1AA] transition-transform duration-150 ${isOpen ? 'rotate-180' : ''}`}
          />
        </span>
      </div>

      {/* dropdown */}
      {isOpen && !disabled && (
        <div className="absolute left-0 right-0 top-[calc(100%+4px)] z-50 overflow-hidden rounded-xl border border-[#E4E4E7] bg-white shadow-[0_8px_24px_rgba(0,0,0,0.10)]">
          <div className="border-b border-[#F4F4F5] p-2">
            <input
              autoFocus
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onClick={(e) => e.stopPropagation()}
              placeholder="Search…"
              className="h-9 w-full rounded-lg border border-[#E4E4E7] bg-[#F9FAFB] px-3 text-[13px] text-[#18181B] outline-none placeholder:text-[#A1A1AA] focus:border-[#2F6FED] focus:ring-4 focus:ring-[#2F6FED]/10"
            />
          </div>

          <div className="max-h-[200px] overflow-y-auto p-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {filteredOptions.length > 0 ? (
              filteredOptions.map((option) => {
                const selected = value.includes(option.value)
                return (
                  <button
                    key={option.value}
                    type="button"
                    onClick={(e) => { e.stopPropagation(); toggleOption(option.value) }}
                    className={cn(
                      'flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-left text-[13px] transition-colors duration-100',
                      selected
                        ? 'bg-[#EFF4FF] font-medium text-[#2F6FED]'
                        : 'text-[#18181B] hover:bg-[#F9FAFB]'
                    )}
                  >
                    {multiSelect && (
                      <span
                        className={cn(
                          'flex h-4 w-4 shrink-0 items-center justify-center rounded-[4px] border transition-colors duration-150',
                          selected
                            ? 'border-[#2F6FED] bg-[#2F6FED]'
                            : 'border-[#D4D4D8] bg-white'
                        )}
                      >
                        {selected && (
                          <svg className="h-full w-full text-white" viewBox="0 0 16 16" fill="none">
                            <path
                              d="M13 4L6 11L3 8"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        )}
                      </span>
                    )}
                    {option.label}
                  </button>
                )
              })
            ) : (
              <p className="px-3 py-4 text-center text-[13px] text-[#A1A1AA]">No results found</p>
            )}
          </div>
        </div>
      )}
    </div>
  )
}