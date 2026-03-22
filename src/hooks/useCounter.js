'use client'
import { useEffect, useState } from 'react'

/** Animates an integer from 0 → target over `ms` milliseconds. Call start() when ready. */
export function useCounter(target, ms = 1800) {
  const [count, setCount]   = useState(0)
  const [active, setActive] = useState(false)

  useEffect(() => {
    if (!active) return
    const t0 = performance.now()
    let raf
    const tick = (now) => {
      const p = Math.min((now - t0) / ms, 1)
      const ease = 1 - Math.pow(1 - p, 3) // cubic ease-out
      setCount(Math.round(ease * target))
      if (p < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [active, target, ms])

  return [count, () => setActive(true)]
}
