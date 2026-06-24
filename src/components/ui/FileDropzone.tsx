/**
 * FileDropzone
 * Cortexa UI — drag-and-drop upload zone
 * - Custom icon via `iconSrc` prop (img element)
 * - Toggle between File / Folder upload mode
 * - Folder upload via webkitdirectory
 */

import { useRef, useState } from 'react'
import { X, FileText, FolderOpen } from 'lucide-react'
import { cn } from '../../lib/util'

interface FileDropzoneProps {
  /** URL or imported asset for the center icon */
  iconSrc: string
  iconAlt?: string
  accept?: string
  multiple?: boolean
  maxFiles?: number
  hint?: string
  label?: string
  onFilesChange?: (files: File[]) => void
}

type UploadMode = 'file' | 'folder'

export const FileDropzone = ({
  iconSrc,
  iconAlt = 'Upload',
  accept = '.pdf,.docx,.txt',
  multiple = true,
  maxFiles = 100,
  hint,
  label,
  onFilesChange,
}: FileDropzoneProps) => {
  const [isDragging, setIsDragging] = useState(false)
  const [files, setFiles] = useState<File[]>([])
  const [mode, setMode] = useState<UploadMode>('file')

  const fileInputRef   = useRef<HTMLInputElement>(null)
  const folderInputRef = useRef<HTMLInputElement>(null)

  const addFiles = (incoming: FileList | null) => {
    if (!incoming) return
    const next = [...files, ...Array.from(incoming)].slice(0, maxFiles)
    setFiles(next)
    onFilesChange?.(next)
  }

  const removeFile = (idx: number) => {
    const next = files.filter((_, i) => i !== idx)
    setFiles(next)
    onFilesChange?.(next)
  }

  const triggerInput = () => {
    if (mode === 'folder') {
      folderInputRef.current?.click()
    } else {
      fileInputRef.current?.click()
    }
  }

  const onDragOver = (e: React.DragEvent) => { e.preventDefault(); setIsDragging(true) }
  const onDragLeave = () => setIsDragging(false)
  const onDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    addFiles(e.dataTransfer.files)
  }

  const switchMode = (next: UploadMode) => {
    setMode(next)
    setFiles([])
    onFilesChange?.([])
  }

  return (
    <div className="flex flex-col gap-3">
      {label && (
        <label className="text-[11px] font-bold uppercase tracking-[0.08em] text-[#52525B]">
          {label}
        </label>
      )}

      {/* ── mode toggle ─────────────────────────────────────────────────── */}
      <div className="flex items-center justify-center">
        <div className="inline-flex rounded-lg border border-[#E4E4E7] bg-[#F4F4F5] p-0.5">
          {(['file', 'folder'] as UploadMode[]).map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => switchMode(m)}
              className={cn(
                'rounded-md px-4 py-1.5 text-[12px] font-medium capitalize transition-all duration-150',
                mode === m
                  ? 'bg-white text-[#18181B] shadow-sm'
                  : 'text-[#71717A] hover:text-[#18181B]'
              )}
            >
              {m === 'file' ? 'Upload File' : 'Upload Folder'}
            </button>
          ))}
        </div>
      </div>

      {/* ── drop zone ───────────────────────────────────────────────────── */}
      <div
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
        onClick={triggerInput}
        className={cn(
          'flex cursor-pointer flex-col items-center justify-center gap-4 rounded-2xl border-2 border-dashed py-10 px-6 transition-all duration-200',
          isDragging
            ? 'border-[#2F6FED] bg-[#EFF4FF]'
            : 'border-[#D4D4D8] bg-white hover:border-[#2F6FED]/50 hover:bg-[#F5F8FF]'
        )}
      >
        {/* icon */}
        <img
          src={iconSrc}
          alt={iconAlt}
          className={cn(
            'h-14 w-14 rounded-2xl object-contain transition-opacity duration-200 select-none pointer-events-none',
            isDragging ? 'opacity-80' : 'opacity-100'
          )}
          draggable={false}
        />

        {/* text */}
        <div className="text-center">
          <p className="text-[14px] font-semibold text-[#18181B]">
            {mode === 'folder'
              ? 'Select a folder to upload'
              : 'Drop research paper, theses or code here'}
          </p>
          <p className="mt-1 text-[12px] text-[#A1A1AA]">
            {hint ||
              (mode === 'folder'
                ? `Select an entire folder · up to ${maxFiles} documents processed automatically`
                : `Accpets PDF, Docx, Text Files - up to ${maxFiles} documents per batch`)}
          </p>
        </div>

        {/* button */}
        <button
          type="button"
          onClick={(e) => { e.stopPropagation(); triggerInput() }}
          className="h-8 rounded-lg border border-[#E4E4E7] bg-white px-4 text-[12px] font-medium text-[#18181B] shadow-sm transition-all hover:border-[#C4C4C7] hover:bg-[#F9FAFB]"
        >
          {mode === 'folder' ? 'Select Folder' : 'Upload File'}
        </button>
      </div>

      {/* ── hidden inputs ────────────────────────────────────────────────── */}
      {/* file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        multiple={multiple}
        className="hidden"
        onChange={(e) => addFiles(e.target.files)}
      />
      {/* folder input — webkitdirectory picks all files inside a folder */}
      <input
        ref={folderInputRef}
        type="file"
        // @ts-expect-error — webkitdirectory is not in React's types but works in all modern browsers
        webkitdirectory=""
        multiple
        className="hidden"
        onChange={(e) => addFiles(e.target.files)}
      />

      {/* ── file list ────────────────────────────────────────────────────── */}
      {files.length > 0 && (
        <ul className="flex flex-col gap-1.5">
          {files.map((file, i) => (
            <li
              key={i}
              className="flex items-center justify-between rounded-xl border border-[#E4E4E7] bg-white px-4 py-2.5"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                {mode === 'folder'
                  ? <FolderOpen size={15} className="shrink-0 text-[#2F6FED]" />
                  : <FileText   size={15} className="shrink-0 text-[#2F6FED]" />
                }
                <div className="min-w-0">
                  <p className="truncate text-[13px] font-medium text-[#18181B]">
                    {file.name}
                  </p>
                  <p className="text-[11px] text-[#A1A1AA]">
                    {file.size < 1024
                      ? `${file.size} B`
                      : file.size < 1024 * 1024
                      ? `${(file.size / 1024).toFixed(0)} KB`
                      : `${(file.size / (1024 * 1024)).toFixed(1)} MB`}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => removeFile(i)}
                className="ml-3 shrink-0 rounded-lg p-1 text-[#A1A1AA] transition-colors hover:bg-[#F4F4F5] hover:text-[#18181B]"
              >
                <X size={14} />
              </button>
            </li>
          ))}

          {/* summary row when many files */}
          {files.length > 1 && (
            <p className="px-1 text-[11px] text-[#A1A1AA]">
              {files.length} {files.length === 1 ? 'file' : 'files'} selected
              {files.length >= maxFiles && ` · limit of ${maxFiles} reached`}
            </p>
          )}
        </ul>
      )}
    </div>
  )
}