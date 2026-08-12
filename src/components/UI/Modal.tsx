import { createContext, useEffect, useLayoutEffect, useRef, useState, type HTMLAttributes, type ReactNode } from "react"
import { createPortal } from "react-dom"
import clsx from "clsx"
import { XMarkIcon } from "@heroicons/react/24/outline"
import gsap from "gsap"
import { useCheckContext } from "@/hooks/useCheckContext"

interface ModalContextValue {
   onClose: () => void
}

const ModalContext = createContext<ModalContextValue | null>(null)

interface ModalProps {
   open: boolean
   onClose: () => void
   children: ReactNode
   className?: string
}

function Modal({ open, onClose, children, className }: ModalProps) {
   const [mounted, setMounted] = useState(false)
   const [shouldRender, setShouldRender] = useState(false)
   const backdropRef = useRef<HTMLDivElement>(null)
   const contentRef = useRef<HTMLDivElement>(null)

   useEffect(() => {
      setMounted(true)
   }, [])

   useEffect(() => {
      if (open) setShouldRender(true)
   }, [open])

   // Залежність саме від shouldRender, а не тільки від open: коли open стає true,
   // на цьому ж рендері shouldRender ще false (оновлюється в окремому useEffect вище),
   // тож backdrop/content ще не в DOM. Без shouldRender у залежностях ефект не
   // перезапуститься на рендері, де рефи вже реально існують.
   useLayoutEffect(() => {
      if (!shouldRender) return
      const backdrop = backdropRef.current
      const content = contentRef.current
      if (!backdrop || !content) return

      if (open) {
         gsap.fromTo(backdrop, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.2, ease: "power2.out" })
         gsap.fromTo(
            content,
            { autoAlpha: 0, y: 24 },
            { autoAlpha: 1, y: 0, duration: 0.25, ease: "power3.out", clearProps: "transform" },
         )
      } else {
         gsap.to(content, { autoAlpha: 0, y: 24, duration: 0.18, ease: "power2.in" })
         gsap.to(backdrop, {
            autoAlpha: 0,
            duration: 0.18,
            ease: "power2.in",
            onComplete: () => setShouldRender(false),
         })
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, [open, shouldRender])

   useEffect(() => {
      if (!open) return
      function handleKeyDown(e: KeyboardEvent) {
         if (e.key === "Escape") onClose()
      }
      document.addEventListener("keydown", handleKeyDown)
      return () => document.removeEventListener("keydown", handleKeyDown)
   }, [open, onClose])

   useEffect(() => {
      if (!open) return
      const original = document.body.style.overflow
      document.body.style.overflow = "hidden"
      return () => {
         document.body.style.overflow = original
      }
   }, [open])

   if (!mounted || !shouldRender) return null

   return createPortal(
      <ModalContext.Provider value={{ onClose }}>
         {/*
            Контейнер без backdrop-filter і без transform/opacity-анімації.
            Це лише flex-центрування, тому браузер не намагається компонувати
            весь піддерево (разом з контентом) в один blur-шар.
         */}
         <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center">
            {/* Окремий елемент лише для затемнення + блюру фону — сестра контенту, не батько */}
            <div
               ref={backdropRef}
               onMouseDown={onClose}
               className="absolute inset-0 bg-black/60 backdrop-blur-sm"
               style={{ visibility: "hidden", opacity: 0 }}
            />

            <div
               ref={contentRef}
               className={clsx(
                  "relative flex w-full flex-col border border-(--stroke-color) bg-(--bg-color)",
                  "max-h-[92vh] sm:max-h-[90vh]",
                  "rounded-t-lg sm:rounded-md",
                  "sm:m-4",
                  className,
               )}
               style={{ visibility: "hidden", opacity: 0 }}
            >
               {children}
            </div>
         </div>
      </ModalContext.Provider>,
      document.body,
   )
}

function ModalHeader({ children, className, ...props }: HTMLAttributes<HTMLDivElement>) {
   const { onClose } = useCheckContext(ModalContext)
   return (
      <div
         className={clsx(
            "flex items-center justify-between border-b border-(--stroke-color) px-4 py-3 md:px-(--components-px) md:py-(--components-py)",
            className,
         )}
         {...props}
      >
         <div className="text-base md:text-lg xl:text-xl font-medium text-white">{children}</div>
         <button
            type="button"
            onClick={onClose}
            className="cursor-pointer rounded-md p-1 text-[#D9D9D9] transition-colors hover:bg-(--bg-trans-hover-color)"
         >
            <XMarkIcon className="size-5" />
         </button>
      </div>
   )
}

function ModalBody({ children, className, ...props }: HTMLAttributes<HTMLDivElement>) {
   return (
      <div
         className={clsx(
            "flex flex-1 flex-col gap-4 md:gap-(--components-gap) overflow-y-auto px-4 py-4 md:px-(--components-px) md:py-(--components-py)",
            className,
         )}
         {...props}
      >
         {children}
      </div>
   )
}

function ModalFooter({ children, className, ...props }: HTMLAttributes<HTMLDivElement>) {
   return (
      <div
         className={clsx(
            "flex items-center justify-end gap-3 border-t border-(--stroke-color) px-4 py-3 md:px-(--components-px) md:py-(--components-py)",
            "flex-col-reverse sm:flex-row",
            className,
         )}
         {...props}
      >
         {children}
      </div>
   )
}

Modal.Header = ModalHeader
Modal.Body = ModalBody
Modal.Footer = ModalFooter

export default Modal
