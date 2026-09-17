import { createPortal } from "react-dom"
import type { ToastData } from "./types"
import { Toast } from "./Toast"

interface ToastContainerProps {
   toasts: ToastData[]
   onRemove: (id: string) => void
}

export function ToastContainer({ toasts, onRemove }: ToastContainerProps) {
   if (typeof document === "undefined") return null

   return createPortal(
      <div className="pointer-events-none fixed bottom-4 right-4 z-50 flex flex-col-reverse gap-2">
         {toasts.map(toast => (
            <Toast key={toast.id} toast={toast} onRemove={onRemove} />
         ))}
      </div>,
      document.body,
   )
}
