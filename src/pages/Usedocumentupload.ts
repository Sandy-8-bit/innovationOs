import { useCallback, useEffect, useMemo, useReducer, useRef } from 'react'
import { mockUploadFile } from '../utils/Mockuploadservice'

export type UploadStatus = 'queued' | 'uploading' | 'done' | 'failed'

export interface UploadItem {
  id: string
  file: File
  status: UploadStatus
  progress: number
  error?: string
}

export interface UploadSummary {
  total: number
  done: number
  failed: number
  left: number
  overallProgress: number
}

interface State {
  items: UploadItem[]
}

type Action =
  | { type: 'ADD'; items: UploadItem[] }
  | { type: 'STATUS'; id: string; status: UploadStatus; error?: string }
  | { type: 'PROGRESS'; id: string; progress: number }
  | { type: 'REMOVE'; id: string }
  | { type: 'RETRY'; id: string }

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'ADD':
      return { items: [...state.items, ...action.items] }
    case 'STATUS':
      return {
        items: state.items.map((it) =>
          it.id === action.id
            ? {
                ...it,
                status: action.status,
                error: action.error,
                progress: action.status === 'done' ? 100 : it.progress,
              }
            : it
        ),
      }
    case 'PROGRESS':
      return {
        items: state.items.map((it) =>
          it.id === action.id ? { ...it, progress: action.progress } : it
        ),
      }
    case 'REMOVE':
      return { items: state.items.filter((it) => it.id !== action.id) }
    case 'RETRY':
      return {
        items: state.items.map((it) =>
          it.id === action.id
            ? { ...it, status: 'queued', progress: 0, error: undefined }
            : it
        ),
      }
    default:
      return state
  }
}

export const ACCEPTED_EXTENSIONS = ['pdf', 'doc', 'docx']
export const MAX_FILE_SIZE = 50 * 1024 * 1024 // 50MB
const CONCURRENCY = 4

export function isAcceptedFile(file: File): boolean {
  const ext = file.name.split('.').pop()?.toLowerCase()
  return !!ext && ACCEPTED_EXTENSIONS.includes(ext) && file.size <= MAX_FILE_SIZE
}

function makeId(): string {
  return typeof crypto !== 'undefined' && 'randomUUID' in crypto
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(36).slice(2)}`
}

export function useDocumentUpload() {
  const [state, dispatch] = useReducer(reducer, { items: [] })
  const cancelersRef = useRef<Map<string, () => void>>(new Map())
  const inFlightRef = useRef<Set<string>>(new Set())

  // Queue processor: starts up to CONCURRENCY queued items at a time.
  useEffect(() => {
    const availableSlots = CONCURRENCY - inFlightRef.current.size
    if (availableSlots <= 0) return

    const toStart = state.items
      .filter((it) => it.status === 'queued' && !inFlightRef.current.has(it.id))
      .slice(0, availableSlots)

    if (toStart.length === 0) return

    toStart.forEach((item) => {
      inFlightRef.current.add(item.id)
      dispatch({ type: 'STATUS', id: item.id, status: 'uploading' })

      const { promise, cancel } = mockUploadFile(item.file, (progress) => {
        dispatch({ type: 'PROGRESS', id: item.id, progress })
      })
      cancelersRef.current.set(item.id, cancel)

      promise
        .then(() => dispatch({ type: 'STATUS', id: item.id, status: 'done' }))
        .catch((err: Error) =>
          dispatch({ type: 'STATUS', id: item.id, status: 'failed', error: err.message })
        )
        .finally(() => {
          inFlightRef.current.delete(item.id)
          cancelersRef.current.delete(item.id)
        })
    })
  }, [state.items])

  // Cancel any in-flight mock uploads on unmount.
  useEffect(() => {
    return () => {
      cancelersRef.current.forEach((cancel) => cancel())
      cancelersRef.current.clear()
      inFlightRef.current.clear()
    }
  }, [])

  const addFiles = useCallback(
    (files: File[]): { addedCount: number; rejectedCount: number } => {
      const accepted = files.filter(isAcceptedFile)
      if (accepted.length > 0) {
        dispatch({
          type: 'ADD',
          items: accepted.map((file) => ({
            id: makeId(),
            file,
            status: 'queued',
            progress: 0,
          })),
        })
      }
      return { addedCount: accepted.length, rejectedCount: files.length - accepted.length }
    },
    []
  )

  const retry = useCallback((id: string) => dispatch({ type: 'RETRY', id }), [])

  const remove = useCallback((id: string) => {
    cancelersRef.current.get(id)?.()
    cancelersRef.current.delete(id)
    inFlightRef.current.delete(id)
    dispatch({ type: 'REMOVE', id })
  }, [])

  const summary: UploadSummary = useMemo(() => {
    const total = state.items.length
    let done = 0
    let failed = 0
    let progressSum = 0

    for (const it of state.items) {
      if (it.status === 'done') done += 1
      else if (it.status === 'failed') failed += 1
      progressSum += it.status === 'done' ? 100 : it.progress
    }

    return {
      total,
      done,
      failed,
      left: total - done - failed,
      overallProgress: total === 0 ? 0 : Math.round(progressSum / total),
    }
  }, [state.items])

  return { items: state.items, addFiles, retry, remove, summary }
}