'use client'

import { useEffect, useRef, type ReactNode } from 'react'

export type RevealVariant =
  | 'fade-up'
  | 'fade-up-soft'
  | 'slide-right'
  | 'slide-left'
  | 'scale-in'
  | 'blur-in'

interface Props {
  children: ReactNode
  className?: string
  delay?: number // ms
  variant?: RevealVariant
}

const VARIANT_CLASS: Record<RevealVariant, string> = {
  'fade-up': '',
  'fade-up-soft': 'reveal-fade-up-soft',
  'slide-right': 'reveal-slide-right',
  'slide-left': 'reveal-slide-left',
  'scale-in': 'reveal-scale-in',
  'blur-in': 'reveal-blur-in',
}

export default function ScrollReveal({
  children,
  className = '',
  delay = 0,
  variant = 'fade-up',
}: Props) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            el.classList.remove('reveal-hidden')
            el.classList.add('reveal-visible')
          }, delay)
          observer.unobserve(el)
        }
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [delay])

  const variantClass = VARIANT_CLASS[variant]

  return (
    <div ref={ref} className={`reveal-hidden ${variantClass} ${className}`}>
      {children}
    </div>
  )
}
