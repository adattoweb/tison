import { useEffect, useState } from "react"

const MOBILE_BREAKPOINT = "(max-width: 767px)"

const PHONE_UA_REGEX = /iPhone|iPod|Android.*Mobile|BlackBerry|IEMobile|Opera Mini|Windows Phone/i

function detectIsPhoneDevice(): boolean {
   const uaData = (navigator as Navigator & { userAgentData?: { mobile?: boolean } }).userAgentData
   if (uaData && typeof uaData.mobile === "boolean") {
      return uaData.mobile
   }

   return PHONE_UA_REGEX.test(navigator.userAgent)
}

export function useIsMobile() {
   const [isPhoneDevice] = useState(detectIsPhoneDevice)

   const [isNarrowScreen, setIsNarrowScreen] = useState(() => window.matchMedia(MOBILE_BREAKPOINT).matches)

   useEffect(() => {
      const mql = window.matchMedia(MOBILE_BREAKPOINT)
      const handleChange = (e: MediaQueryListEvent) => setIsNarrowScreen(e.matches)

      mql.addEventListener("change", handleChange)
      return () => mql.removeEventListener("change", handleChange)
   }, [])

   return isPhoneDevice || isNarrowScreen
}
