import { type RefObject } from 'react'
import { motion, useScroll, useSpring, useTransform } from 'motion/react'

interface CustomScrollbarProps {
  containerRef: RefObject<HTMLElement | null>
  thumbHeight?: string
  className?: string
}

export const CustomScrollbar = ({
  containerRef,
  thumbHeight = '32px',
  className = '',
}: CustomScrollbarProps) => {
  const { scrollYProgress } = useScroll({ container: containerRef })

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 400,
    damping: 40,
    restDelta: 0.001,
  })

  // Maps progress to perfectly bound the thumb within its track
  const top = useTransform(smoothProgress, [0, 1], ['0%', '100%'])
  const y = useTransform(smoothProgress, [0, 1], ['0%', '-100%'])

  return (
    <div
      className={`pointer-events-none absolute top-1 right-1 bottom-1 z-10 w-1 rounded-full ${className}`}
    >
      <motion.div
        style={{ top, y, height: thumbHeight }}
        className="absolute w-full rounded-full bg-white transition-colors dark:bg-[#1e1e1e]"
      />
    </div>
  )
}
