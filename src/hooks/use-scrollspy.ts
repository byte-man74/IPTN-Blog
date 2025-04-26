import { useState, useRef, useEffect } from 'react'

interface SectionConfig {
  id: string
}

export function useScrollSpy(sections: SectionConfig[], options = { threshold: 0.5 }) {
  const [activeId, setActiveId] = useState<string | null>(null)
  const refs = useRef<Record<string, HTMLElement | null>>({})

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        const id = entry.target.getAttribute('id')
        if (entry.isIntersecting && id) {
          setActiveId(id)
        }
      })
    }, options)

    const currentRefs = refs.current
    Object.values(currentRefs).forEach((el) => {
      if (el) observer.observe(el)
    })

    return () => {
      Object.values(currentRefs).forEach((el) => {
        if (el) observer.unobserve(el)
      })
      observer.disconnect()
    }
  }, [sections, options])

  const setRef = (id: string) => (el: HTMLElement | null) => {
    refs.current[id] = el
  }

  return { activeId, setRef }
}
