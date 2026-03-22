'use client'
import { useEffect, useRef, useState } from 'react'

/**
 * Measures scroll progress (0→1) through a tall sticky container.
 * Returns [containerRef, progress]
 */
export function useStickyProgress() {
  const ref      = useRef(null)
  const [prog, setProg] = useState(0)

  useEffect(() => {
    const fn = () => {
      const el = ref.current
      if (!el) return
      const { top, height } = el.getBoundingClientRect()
      const viewH  = window.innerHeight
      const scrolled = -top
      const total    = height - viewH
      setProg(Math.max(0, Math.min(1, scrolled / total)))
    }
    window.addEventListener('scroll', fn, { passive: true })
    fn()
    return () => window.removeEventListener('scroll', fn)
  }, [])

  return [ref, prog]
}
