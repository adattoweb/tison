import { useEffect, useRef } from "react"

interface UseScannerInputOptions {
   onScan: (code: string) => void
   /** якщо код прийшов швидше, ніж за цей інтервал (мс) — це сканер, а не людина за клавіатурою */
   maxCharIntervalMs?: number
   enabled?: boolean
}

/**
 * Bluetooth-сканер у режимі "keyboard wedge" просто друкує символи в document,
 * дуже швидко, і завершує рядок Enter'ом. Хук ловить це глобально, незалежно
 * від того, який елемент у фокусі, і відсікає звичайне ручне введення за швидкістю.
 */
export function useScannerInput({ onScan, maxCharIntervalMs = 50, enabled = true }: UseScannerInputOptions) {
   const bufferRef = useRef("")
   const lastCharTimeRef = useRef(0)

   useEffect(() => {
      if (!enabled) return

      function handleKeyDown(e: KeyboardEvent) {
         const now = performance.now()
         const gap = now - lastCharTimeRef.current
         lastCharTimeRef.current = now

         if (e.key === "Enter") {
            if (bufferRef.current.length > 0) {
               onScan(bufferRef.current)
            }
            bufferRef.current = ""
            return
         }

         if (e.key.length !== 1) return // ігноруємо Shift, Tab тощо

         // якщо пауза між символами завелика — це людина набирала вручну, скидаємо буфер
         if (gap > maxCharIntervalMs && bufferRef.current.length > 0) {
            bufferRef.current = ""
         }

         bufferRef.current += e.key
      }

      window.addEventListener("keydown", handleKeyDown)
      return () => window.removeEventListener("keydown", handleKeyDown)
   }, [onScan, maxCharIntervalMs, enabled])
}
