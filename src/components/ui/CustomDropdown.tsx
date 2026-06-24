/**
 * CustomDropdown
 * Cortexa UI — portal-based dropdown with search, position sync, and scroll tracking
 */

import { useState, useRef, useEffect, useCallback } from 'react'
import { createPortal } from 'react-dom'
import { ChevronDown, Search, Check } from 'lucide-react'

export interface DropdownOption {
  label: string
  value: string
}

interface CustomDropdownProps {
  options: DropdownOption[]
  value: string
  onChange: (value: string) => void
  placeholder?: string
  label?: string
  required?: boolean
  isLoading?: boolean
  className?: string
  disabled?: boolean
}

interface DropdownPosition {
  top: number
  left: number
  width: number
}

const CustomDropdown = ({
  options,
  value,
  onChange,
  disabled = false,
  placeholder = 'Select...',
  label,
  required = false,
  className = '',
}: CustomDropdownProps) => {
  const [isOpen, setIsOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [position, setPosition] = useState<DropdownPosition>({ top: 0, left: 0, width: 0 })

  const containerRef = useRef<HTMLDivElement>(null)
  const portalRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const listRef = useRef<HTMLUListElement>(null)
  const rafRef = useRef<number>(0)

  const filteredOptions = options.filter((o) =>
    o.label.toLowerCase().includes(searchTerm.toLowerCase())
  )

  // derive display label from current value
  const selectedLabel = options.find((o) => o.value === value)?.label ?? ''

  // ── position sync ──────────────────────────────────────────────────────────
  const syncPosition = useCallback(() => {
    if (!containerRef.current) return
    const rect = containerRef.current.getBoundingClientRect()
    setPosition({
      top: rect.bottom + window.scrollY + 4,
      left: rect.left + window.scrollX,
      width: rect.width,
    })
  }, [])

  const scheduleSync = useCallback(() => {
    cancelAnimationFrame(rafRef.current)
    rafRef.current = requestAnimationFrame(syncPosition)
  }, [syncPosition])

  useEffect(() => {
    if (!isOpen) return
    syncPosition()

    const parents: (HTMLElement | Window)[] = [window]
    let el = containerRef.current?.parentElement
    while (el) {
      const { overflow, overflowY } = getComputedStyle(el)
      if (/auto|scroll|overlay/.test(overflow + overflowY)) parents.push(el)
      el = el.parentElement
    }

    parents.forEach((p) => p.addEventListener('scroll', scheduleSync, { passive: true }))
    window.addEventListener('resize', scheduleSync, { passive: true })

    return () => {
      parents.forEach((p) => p.removeEventListener('scroll', scheduleSync))
      window.removeEventListener('resize', scheduleSync)
      cancelAnimationFrame(rafRef.current)
    }
  }, [isOpen, scheduleSync, syncPosition])

  // ── outside click ──────────────────────────────────────────────────────────
  useEffect(() => {
    if (!isOpen) return
    const handler = (e: MouseEvent) => {
      const t = e.target as Node
      if (containerRef.current?.contains(t)) return
      if (portalRef.current?.contains(t)) return
      setIsOpen(false)
    }
    document.addEventListener('mousedown', handler, true)
    return () => document.removeEventListener('mousedown', handler, true)
  }, [isOpen])

  // ── focus search on open ───────────────────────────────────────────────────
  useEffect(() => {
    if (isOpen) inputRef.current?.focus()
  }, [isOpen])

  // ── escape ─────────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!isOpen) return
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') setIsOpen(false) }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [isOpen])

  const handleSelect = (option: DropdownOption) => {
    onChange(option.value)
    setSearchTerm('')
    setIsOpen(false)
  }

  // ── portal ─────────────────────────────────────────────────────────────────
  const dropdownContent = isOpen ? (
    <div
      ref={portalRef}
      style={{
        position: 'absolute',
        top: position.top,
        left: position.left,
        width: position.width,
        zIndex: 99999,
        transform: 'translateZ(0)',
        willChange: 'transform',
      }}
    >
      <div
        className="overflow-hidden rounded-xl border border-[#E4E4E7] bg-white"
        style={{ boxShadow: '0 8px 24px rgba(0,0,0,0.10)' }}
      >
        {/* search */}
        <div className="border-b border-[#F4F4F5] p-2">
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#A1A1AA]" />
            <input
              ref={inputRef}
              type="text"
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="h-9 w-full rounded-lg border border-[#E4E4E7] bg-[#F9FAFB] pl-9 pr-3 text-[13px] text-[#18181B] placeholder:text-[#A1A1AA] outline-none transition-all focus:border-[#2F6FED] focus:ring-4 focus:ring-[#2F6FED]/10"
            />
          </div>
        </div>

        {/* list */}
        <ul
          ref={listRef}
          className="max-h-60 overflow-y-auto p-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {filteredOptions.length === 0 ? (
            <li className="px-3 py-3 text-[13px] text-[#A1A1AA]">No options found</li>
          ) : (
            filteredOptions.map((option) => {
              const selected = value === option.value
              return (
                <li key={option.value}>
                  <button
                    type="button"
                    onMouseDown={(e) => e.stopPropagation()}
                    onClick={() => handleSelect(option)}
                    className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-[13px] transition-colors duration-100 ${
                      selected
                        ? 'bg-[#EFF4FF] font-medium text-[#2F6FED]'
                        : 'text-[#18181B] hover:bg-[#F9FAFB]'
                    }`}
                  >
                    <span>{option.label}</span>
                    {selected && <Check size={14} className="text-[#2F6FED]" />}
                  </button>
                </li>
              )
            })
          )}
        </ul>
      </div>
    </div>
  ) : null

  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      {label && (
        <label className="text-[11px] font-bold uppercase tracking-[0.08em] text-[#52525B]">
          {label}
          {required && <span className="ml-1 text-red-500">*</span>}
        </label>
      )}

      <div ref={containerRef} className="relative w-full">
        <button
          type="button"
          disabled={disabled}
          onClick={() => !disabled && setIsOpen((p) => !p)}
          className={`flex h-12 w-full items-center justify-between rounded-xl border bg-white px-4 text-sm transition-all duration-200 focus:outline-none ${
            isOpen
              ? 'border-[#2F6FED] ring-4 ring-[#2F6FED]/10'
              : 'border-[#E4E4E7] hover:border-[#C4C4C7]'
          } ${disabled ? 'cursor-not-allowed bg-[#F9FAFB] opacity-60' : ''}`}
        >
          <span className={`truncate ${value ? 'text-[#18181B]' : 'text-[#A1A1AA]'}`}>
            {selectedLabel || placeholder}
          </span>
          <ChevronDown
            size={16}
            className={`shrink-0 text-[#A1A1AA] transition-transform duration-200 ${
              isOpen ? 'rotate-180' : ''
            }`}
          />
        </button>

        {typeof document !== 'undefined' && createPortal(dropdownContent, document.body)}
      </div>
    </div>
  )
}

export default CustomDropdown