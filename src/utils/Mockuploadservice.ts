export interface MockUploadHandle {
  promise: Promise<void>
  cancel: () => void
}

interface MockUploadOptions {
  minDurationMs?: number
  maxDurationMs?: number
  failureRate?: number
  tickMs?: number
}

const FAILURE_REASONS = [
  'Network connection lost',
  'Server rejected the file (500)',
  'File appears to be corrupted',
  'Upload timed out',
]

function pickFailureReason(): string {
  return FAILURE_REASONS[Math.floor(Math.random() * FAILURE_REASONS.length)]
}

/**
 * Simulates an upload: reports progress 0-100 via onProgress, resolves on
 * success, rejects with an Error on (randomly chosen) failure.
 */
export function mockUploadFile(
  file: File,
  onProgress: (progress: number) => void,
  options: MockUploadOptions = {}
): MockUploadHandle {
  const {
    minDurationMs = 600,
    maxDurationMs = 2400,
    failureRate = 0.08,
    tickMs = 90,
  } = options

  const duration = minDurationMs + Math.random() * (maxDurationMs - minDurationMs)
  const willFail = Math.random() < failureRate
  const failAtProgress = 30 + Math.random() * 50 // fail somewhere in the 30-80% range

  let cancelled = false
  let timer: ReturnType<typeof setInterval> | null = null

  const promise = new Promise<void>((resolve, reject) => {
    const start = Date.now()
    onProgress(0)

    timer = setInterval(() => {
      if (cancelled) return
      const elapsed = Date.now() - start
      const pct = Math.min(99, Math.round((elapsed / duration) * 100))

      if (willFail && pct >= failAtProgress) {
        clearInterval(timer!)
        onProgress(pct)
        reject(new Error(pickFailureReason()))
        return
      }

      if (elapsed >= duration) {
        clearInterval(timer!)
        onProgress(100)
        resolve()
        return
      }

      onProgress(pct)
    }, tickMs)
  })

  return {
    promise,
    cancel: () => {
      cancelled = true
      if (timer) clearInterval(timer)
    },
  }
}