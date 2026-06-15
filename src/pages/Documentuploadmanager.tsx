import { memo, useCallback, useEffect, useRef, useState } from 'react'
import type { ChangeEvent, DragEvent } from 'react'
import { useVirtualizer } from '@tanstack/react-virtual'
import {
  Upload,
  FolderOpen,
  FileText,
  X,
  RotateCw,
  CheckCircle2,
  XCircle,
  Loader2,
  Clock,
} from 'lucide-react'
import { cn } from '../lib/util'
import {
  useDocumentUpload,
  ACCEPTED_EXTENSIONS,
  MAX_FILE_SIZE,
  type UploadItem,
  type UploadStatus,
} from './Usedocumentupload'

const ACCEPT_ATTR = ACCEPTED_EXTENSIONS.map((ext) => `.${ext}`).join(',')
const ROW_HEIGHT = 64

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

function fileExt(name: string): string {
  return name.split('.').pop()?.toUpperCase() || 'FILE'
}

const STATUS_CONFIG: Record<UploadStatus, { label: string; color: string; bg: string }> = {
  queued: { label: 'Queued', color: '#92908B', bg: '#F0EFEA' },
  uploading: { label: 'Uploading', color: '#7F77DD', bg: '#EEEDFE' },
  done: { label: 'Done', color: '#3F9142', bg: '#E9F6E9' },
  failed: { label: 'Failed', color: '#D14343', bg: '#FBEAEA' },
}

function StatusIcon({ status }: { status: UploadStatus }) {
  switch (status) {
    case 'queued':
      return <Clock className="h-3.5 w-3.5" />
    case 'uploading':
      return <Loader2 className="h-3.5 w-3.5 animate-spin" />
    case 'done':
      return <CheckCircle2 className="h-3.5 w-3.5" />
    case 'failed':
      return <XCircle className="h-3.5 w-3.5" />
  }
}

interface FileRowProps {
  item: UploadItem
  onRetry: (id: string) => void
  onRemove: (id: string) => void
}

// Memoized so unaffected rows skip re-render when one item's progress/status changes —
// the reducer only creates a new object reference for the item that actually changed.
const FileRow = memo(function FileRow({ item, onRetry, onRemove }: FileRowProps) {
  const cfg = STATUS_CONFIG[item.status]
  const displayProgress = item.status === 'done' ? 100 : Math.round(item.progress)

  return (
    <div className="flex h-full items-center gap-3 border-b border-black/[0.05] bg-white px-4 py-2.5">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[8px] border border-black/10 bg-[#F7F6F3]">
        <FileText className="h-4 w-4 text-[#92908B]" />
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <p className="truncate text-[13px] font-medium text-[#1A1917]">{item.file.name}</p>
          <span className="shrink-0 rounded-[4px] bg-[#F0EFEA] px-1.5 py-0.5 text-[10px] font-bold tracking-wide text-[#92908B]">
            {fileExt(item.file.name)}
          </span>
        </div>
        <div className="mt-1 flex items-center gap-2">
          <div className="h-1 flex-1 overflow-hidden rounded-full bg-[#F0EFEA]">
            <div
              className={cn(
                'h-full rounded-full transition-all duration-150',
                item.status === 'failed' ? 'bg-red-300' : 'bg-[#7F77DD]'
              )}
              style={{ width: `${displayProgress}%` }}
            />
          </div>
          <span className="w-9 shrink-0 text-right text-[11px] text-[#92908B]">
            {displayProgress}%
          </span>
        </div>
        {item.status === 'failed' && item.error && (
          <p className="mt-1 truncate text-[11px] text-red-500">{item.error}</p>
        )}
      </div>

      <div className="flex shrink-0 items-center gap-2">
        <span className="hidden text-[11px] text-[#92908B] sm:inline">
          {formatBytes(item.file.size)}
        </span>
        <span
          className="flex items-center gap-1 rounded-[6px] px-2 py-1 text-[11px] font-medium"
          style={{ color: cfg.color, backgroundColor: cfg.bg }}
        >
          <StatusIcon status={item.status} />
          {cfg.label}
        </span>
        {item.status === 'failed' && (
          <button
            type="button"
            onClick={() => onRetry(item.id)}
            title="Retry upload"
            className="flex h-7 w-7 items-center justify-center rounded-[6px] border border-black/10 bg-white text-[#92908B] transition-colors hover:bg-[#F7F6F3] hover:text-[#1A1917]"
          >
            <RotateCw className="h-3.5 w-3.5" />
          </button>
        )}
        <button
          type="button"
          onClick={() => onRemove(item.id)}
          title="Remove"
          className="flex h-7 w-7 items-center justify-center rounded-[6px] border border-red-200/60 bg-white text-[#92908B] transition-colors hover:bg-red-50 hover:text-red-500"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  )
})

export function DocumentUploadManager() {
  const { items, addFiles, retry, remove, summary } = useDocumentUpload()
  const [isDragging, setIsDragging] = useState(false)
  const [notice, setNotice] = useState<string | null>(null)

  const filesInputRef = useRef<HTMLInputElement>(null)
  const folderInputRef = useRef<HTMLInputElement>(null)
  const parentRef = useRef<HTMLDivElement>(null)

  // webkitdirectory/directory aren't part of React's input typings — set imperatively.
  useEffect(() => {
    const el = folderInputRef.current
    if (!el) return
    el.setAttribute('webkitdirectory', '')
    el.setAttribute('directory', '')
  }, [])

  const virtualizer = useVirtualizer({
    count: items.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => ROW_HEIGHT,
    overscan: 8,
    getItemKey: (index) => items[index]?.id ?? index,
  })

  const handleFiles = useCallback(
    (fileList: FileList | File[]) => {
      const files = Array.from(fileList)
      if (files.length === 0) return
      const { rejectedCount } = addFiles(files)
      if (rejectedCount > 0) {
        setNotice(
          `${rejectedCount} file${rejectedCount === 1 ? '' : 's'} skipped — only PDF and DOCX up to ${formatBytes(MAX_FILE_SIZE)} are supported.`
        )
      } else {
        setNotice(null)
      }
    },
    [addFiles]
  )

  const handleDrop = useCallback(
    (e: DragEvent<HTMLDivElement>) => {
      e.preventDefault()
      e.stopPropagation()
      setIsDragging(false)
      if (e.dataTransfer.files?.length) handleFiles(e.dataTransfer.files)
    },
    [handleFiles]
  )

  const handleDragOver = useCallback((e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
  }, [])

  const handleInputChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      if (e.target.files?.length) handleFiles(e.target.files)
      e.target.value = ''
    },
    [handleFiles]
  )

  return (
    <div className="flex flex-col gap-3">
      <div
        onDragEnter={handleDragOver}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={cn(
          'relative flex flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed px-6 py-10 text-center transition-all',
          isDragging
            ? 'border-[#7F77DD] bg-[#EEEDFE]/40'
            : 'border-black/15 bg-white hover:border-black/25 hover:bg-[#F7F6F3]'
        )}
      >
        <div
          className={cn(
            'flex h-10 w-10 items-center justify-center rounded-[10px] transition-colors',
            isDragging ? 'bg-[#EEEDFE]' : 'bg-[#F7F6F3]'
          )}
        >
          <Upload className={cn('h-5 w-5', isDragging ? 'text-[#7F77DD]' : 'text-[#92908B]')} />
        </div>
        <div>
          <p
            className={cn(
              'text-[14px] font-medium',
              isDragging ? 'text-[#7F77DD]' : 'text-[#1A1917]'
            )}
          >
            Drop documents here
          </p>
          <p className="mt-0.5 text-[12px] text-[#92908B]">
            PDF or DOCX, up to {formatBytes(MAX_FILE_SIZE)} each — drop 100+ files at once
          </p>
        </div>
        <div className="mt-2 flex gap-2">
          <button
            type="button"
            onClick={() => filesInputRef.current?.click()}
            className="flex items-center gap-1.5 rounded-[8px] border border-black/10 bg-white px-3 py-1.5 text-[12px] font-medium text-[#3D3C39] transition-colors hover:bg-[#F7F6F3]"
          >
            <FileText className="h-3.5 w-3.5" />
            Select files
          </button>
          <button
            type="button"
            onClick={() => folderInputRef.current?.click()}
            className="flex items-center gap-1.5 rounded-[8px] border border-black/10 bg-white px-3 py-1.5 text-[12px] font-medium text-[#3D3C39] transition-colors hover:bg-[#F7F6F3]"
          >
            <FolderOpen className="h-3.5 w-3.5" />
            Select folder
          </button>
        </div>

        <input
          ref={filesInputRef}
          type="file"
          accept={ACCEPT_ATTR}
          multiple
          onChange={handleInputChange}
          className="hidden"
        />
        <input
          ref={folderInputRef}
          type="file"
          accept={ACCEPT_ATTR}
          multiple
          onChange={handleInputChange}
          className="hidden"
        />
      </div>

      {notice && <p className="text-[11px] font-medium text-amber-600">{notice}</p>}

      {items.length > 0 && (
        <div className="flex flex-col gap-2.5 rounded-2xl border border-black/10 bg-white p-4">
          <div className="flex items-center justify-between gap-3">
            <p className="text-[13px] font-medium text-[#1A1917]">
              {summary.done} done · {summary.failed} failed · {summary.left} left
              <span className="ml-1.5 font-normal text-[#92908B]">
                ({summary.total} total)
              </span>
            </p>
            <p className="text-[12px] text-[#92908B]">{summary.overallProgress}%</p>
          </div>
          <div className="h-1.5 overflow-hidden rounded-full bg-[#F0EFEA]">
            <div
              className="h-full rounded-full bg-[#7F77DD] transition-all duration-200"
              style={{ width: `${summary.overallProgress}%` }}
            />
          </div>

          <div
            ref={parentRef}
            className="max-h-[420px] overflow-auto rounded-[10px] border border-black/10"
          >
            <div style={{ height: virtualizer.getTotalSize(), position: 'relative' }}>
              {virtualizer.getVirtualItems().map((virtualRow) => {
                const item = items[virtualRow.index]
                if (!item) return null
                return (
                  <div
                    key={virtualRow.key}
                    className="absolute left-0 top-0 w-full"
                    style={{
                      height: virtualRow.size,
                      transform: `translateY(${virtualRow.start}px)`,
                    }}
                  >
                    <FileRow item={item} onRetry={retry} onRemove={remove} />
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}