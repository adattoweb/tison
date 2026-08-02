import { useEffect, useState } from "react"

export function useContainerWidth(ref: React.RefObject<HTMLElement | null>) {
   const [width, setWidth] = useState<number>(Infinity)

   useEffect(() => {
      const el = ref.current
      if (!el) return

      const observer = new ResizeObserver(entries => {
         const w = entries[0]?.contentRect.width
         if (w !== undefined) setWidth(w)
      })

      observer.observe(el)
      return () => observer.disconnect()
   }, [ref])

   return width
}
