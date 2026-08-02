import { useEffect, useRef, useState } from "react"

export type ContainerBreakpoint = "mobile" | "compact" | "full"

export const BREAKPOINT_ORDER: ContainerBreakpoint[] = ["mobile", "compact", "full"]

const THRESHOLDS: { minWidth: number; value: ContainerBreakpoint }[] = [
   { minWidth: 640, value: "full" },
   { minWidth: 420, value: "compact" },
   { minWidth: 0, value: "mobile" },
]

function resolveBreakpoint(width: number): ContainerBreakpoint {
   return THRESHOLDS.find(({ minWidth }) => width >= minWidth)?.value ?? "mobile"
}
export function useContainerBreakpoint<T extends HTMLElement>() {
   const ref = useRef<T>(null)
   const [breakpoint, setBreakpoint] = useState<ContainerBreakpoint>("full")

   useEffect(() => {
      const el = ref.current
      if (!el) return

      const observer = new ResizeObserver(entries => {
         const width = entries[0]?.contentRect.width
         if (width === undefined) return
         setBreakpoint(resolveBreakpoint(width))
      })

      observer.observe(el)
      return () => observer.disconnect()
   }, [])

   return { ref, breakpoint }
}
