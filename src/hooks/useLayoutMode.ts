import { useEffect, useState } from "react"

const WIDE_BREAKPOINT = "(min-width: 1600px)" // 3xl
const MEDIUM_BREAKPOINT = "(min-width: 1024px)" // lg — поріг між "50/50" і "100%"

export type LayoutMode = "wide" | "medium" | "stacked"

export function useLayoutMode(): LayoutMode {
   const getMode = (): LayoutMode => {
      if (window.matchMedia(WIDE_BREAKPOINT).matches) return "wide"
      if (window.matchMedia(MEDIUM_BREAKPOINT).matches) return "medium"
      return "stacked"
   }

   const [mode, setMode] = useState<LayoutMode>(getMode)

   useEffect(() => {
      const wideMql = window.matchMedia(WIDE_BREAKPOINT)
      const mediumMql = window.matchMedia(MEDIUM_BREAKPOINT)

      const handleChange = () => setMode(getMode())

      wideMql.addEventListener("change", handleChange)
      mediumMql.addEventListener("change", handleChange)

      return () => {
         wideMql.removeEventListener("change", handleChange)
         mediumMql.removeEventListener("change", handleChange)
      }
   }, [])

   return mode
}
