/**
 * TypeSearchDropdown
 * Cortexa UI — inline type-to-search combobox with keyboard nav and clear
 */

import { useState, useRef, useMemo } from 'react'
import { ChevronDown, X } from 'lucide-react'
import { cn } from '../../lib/util'

type OptionType =
  | string
  | { label: string; value: string }

interface TypeSearchDropdownProps {
  options: OptionType[]
  value: string
  onChange: (value: string) => void
  placeholder?: string
  label?: string
  required?: boolean
  disabled?: boolean
}

export const TypeSearchDropdown = ({
  options,
  value,
  onChange,
  placeholder = 'Search...',
  label,
  required = false,
  disabled = false,
}: TypeSearchDropdownProps) => {
  const [isOpen, setIsOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [highlightedIndex, setHighlightedIndex] = useState(-1)

  const containerRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const normalizedOptions = useMemo(
    () =>
      options.map((opt) =>
        typeof opt === 'string' ? { label: opt, value: opt } : opt
      ),
    [options]
  )

  const filteredOptions = useMemo(
    () =>
      normalizedOptions.filter((o) =>
        o.label.toLowerCase().includes(searchTerm.toLowerCase())
      ),
    [normalizedOptions, searchTerm]
  )

  const selectedLabel = normalizedOptions.find((o) => o.value === value)?.label || ''

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!isOpen) {
      if (e.key === 'ArrowDown' || e.key === 'Enter') {
        setIsOpen(true)
        e.preventDefault()
      }
      return
    }
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault()
        setHighlightedIndex((p) => (p < filteredOptions.length - 1 ? p + 1 : p))
        break
      case 'ArrowUp':
        e.preventDefault()
        setHighlightedIndex((p) => (p > 0 ? p - 1 : -1))
        break
      case 'Enter':
        e.preventDefault()
        if (highlightedIndex >= 0) selectOption(filteredOptions[highlightedIndex])
        break
      case 'Escape':
        e.preventDefault()
        setIsOpen(false)
        break
    }
  }

  const selectOption = (option: { label: string; value: string }) => {
    onChange(option.value)
    setSearchTerm('')
    setIsOpen(false)
    setHighlightedIndex(-1)
  }

  const handleClear = () => {
    onChange('')
    setSearchTerm('')
    setIsOpen(false)
    setHighlightedIndex(-1)
    inputRef.current?.focus()
  }

  return (
    <div className="relative w-full" ref={containerRef}>
      {label && (
        <label className="mb-1.5 block text-[11px] font-bold uppercase tracking-[0.08em] text-[#52525B]">
          {label}
          {required && <span className="ml-1 text-red-500">*</span>}
        </label>
      )}

      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          value={isOpen ? searchTerm : selectedLabel}
          disabled={disabled}
          onChange={(e) => {
            setSearchTerm(e.target.value)
            if (!isOpen) setIsOpen(true)
          }}
          onFocus={() => {
            setIsOpen(true)
            setSearchTerm('')
          }}
          onBlur={(e) => {
            if (!containerRef.current?.contains(e.relatedTarget as Node)) {
              setIsOpen(false)
              setSearchTerm('')
            }
          }}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className={cn(
            'h-12 w-full rounded-xl border bg-white px-4 pr-12',
            'text-sm text-[#18181B] placeholder:text-[#A1A1AA]',
            'outline-none transition-all duration-200',
            isOpen
              ? 'border-[#2F6FED] ring-4 ring-[#2F6FED]/10'
              : 'border-[#E4E4E7] hover:border-[#C4C4C7]',
            'disabled:cursor-not-allowed disabled:bg-[#F9FAFB] disabled:opacity-60'
          )}
        />

        <span className="absolute right-3.5 top-1/2 -translate-y-1/2 flex items-center gap-1.5">
          {value && !disabled && (
            <button
              type="button"
              onClick={handleClear}
              className="text-[#A1A1AA] hover:text-[#52525B] transition-colors"
            >
              <X size={14} />
            </button>
          )}
          <ChevronDown
            size={16}
            className={cn(
              'text-[#A1A1AA] transition-transform duration-200',
              isOpen && 'rotate-180'
            )}
          />
        </span>
      </div>

      {isOpen && !disabled && filteredOptions.length > 0 && (
        <div className="absolute left-0 right-0 top-[calc(100%+4px)] z-50 overflow-hidden rounded-xl border border-[#E4E4E7] bg-white shadow-[0_8px_24px_rgba(0,0,0,0.10)]">
          <div className="max-h-60 overflow-y-auto p-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {filteredOptions.map((option, index) => (
              <button
                key={option.value}
                type="button"
                onClick={() => selectOption(option)}
                onMouseEnter={() => setHighlightedIndex(index)}
                className={cn(
                  'w-full rounded-lg px-3 py-2 text-left text-[13px] transition-colors duration-100',
                  highlightedIndex === index
                    ? 'bg-[#EFF4FF] font-medium text-[#2F6FED]'
                    : 'text-[#18181B] hover:bg-[#F9FAFB]'
                )}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {isOpen && !disabled && filteredOptions.length === 0 && searchTerm && (
        <div className="absolute left-0 right-0 top-[calc(100%+4px)] z-50 rounded-xl border border-[#E4E4E7] bg-white p-3 shadow-[0_8px_24px_rgba(0,0,0,0.10)]">
          <p className="text-[13px] text-[#A1A1AA]">No results found</p>
        </div>
      )}
    </div>
  )
}