'use client'
import { useEffect, useRef } from 'react'

/**
 * Wraps children in a div that animates into view when scrolled to.
 * direction: 'up' | 'left' | 'right' | 'scale'
 * delay: ms delay before animation starts
 */
export default function AnimateIn({ children, className = '', delay = 0, direction = 'up', as: Tag = 'div' }) {
  const ref = useRef(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const cls = {
      up:    'reveal',
      left:  'reveal-left',
      right: 'reveal-right',
      scale: 'reveal-scale',
    }[direction] ?? 'reveal'
    el.classList.add(cls)
    if (delay) el.style.transitionDelay = `${delay}ms`
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { el.classList.add('visible'); obs.disconnect() } },
      { threshold: 0.1 }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [direction, delay])

  return <Tag ref={ref} className={className}>{children}</Tag>
}
