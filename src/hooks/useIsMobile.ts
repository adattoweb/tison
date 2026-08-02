import { useEffect, useState } from "react"

const MOBILE_BREAKPOINT = "(max-width: 767px)"

export function useIsMobile() {
   const [isMobile, setIsMobile] = useState(() => window.matchMedia(MOBILE_BREAKPOINT).matches)

   useEffect(() => {
      const mql = window.matchMedia(MOBILE_BREAKPOINT)
      const handleChange = (e: MediaQueryListEvent) => setIsMobile(e.matches)

      mql.addEventListener("change", handleChange)
      return () => mql.removeEventListener("change", handleChange)
   }, [])

   return isMobile
}
