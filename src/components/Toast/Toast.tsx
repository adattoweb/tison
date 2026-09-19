import { useRef, useEffect, useCallback } from "react"
import { useGSAP } from "@gsap/react"
import gsap from "gsap"
import type { ToastData } from "./types"
import clsx from "clsx"
import { XMarkIcon } from "@heroicons/react/24/outline"

gsap.registerPlugin(useGSAP)

interface ToastProps {
   toast: ToastData
   onRemove: (id: string) => void
}

const DEFAULT_DURATION = 4000

export function Toast({ toast, onRemove }: ToastProps) {
   const toastRef = useRef<HTMLDivElement>(null)
   const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

   const { contextSafe } = useGSAP(
      () => {
         gsap.fromTo(toastRef.current, { x: 100, opacity: 0 }, { x: 0, opacity: 1, duration: 0.4, ease: "power2.out" })
      },
      { scope: toastRef },
   )
   const dismiss = useCallback(() => {
      contextSafe(() => {
         if (timerRef.current) clearTimeout(timerRef.current)
         gsap.to(toastRef.current, {
            x: 100,
            opacity: 0,
            duration: 0.3,
            ease: "power2.in",
            onComplete: () => onRemove(toast.id),
         })
      })()
   }, [contextSafe, onRemove, toast.id])

   useEffect(() => {
      const duration = toast.duration ?? DEFAULT_DURATION
      timerRef.current = setTimeout(dismiss, duration)
      return () => {
         if (timerRef.current) clearTimeout(timerRef.current)
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, [dismiss])

   return (
      <div
         ref={toastRef}
         className={clsx(
            "pointer-events-auto min-w-60 max-w-100 rounded-md p-4 flex items-center justify-center gap-2",
            toast.type === "success"
               ? "bg-(--bg-right-color)!"
               : toast.type === "error"
                 ? "bg-(--bg-bad-color)!"
                 : "bg-(--bg-accent-color)!",
         )}
      >
         <p className="text-white">{toast.message}</p>
         <XMarkIcon onClick={dismiss} className="size-4 stroke-white cursor-pointer" />
      </div>
   )
}
