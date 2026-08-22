"use no memo"

import type { WithClassName } from "@/types/common"
import clsx from "clsx"
import { XIcon } from "lucide-react"
import { createContext, useRef, useState, useEffect, type PropsWithChildren } from "react"
import { createPortal } from "react-dom"

import gsap from "gsap"
import { useGSAP } from "@gsap/react"

interface ModalContextValue {
   onClose: () => void
}

const ModalContext = createContext<ModalContextValue | null>(null)

type HeaderProps = WithClassName & PropsWithChildren

function Header({ children, className = "" }: HeaderProps) {
   return <h2 className={clsx(className, "text-lg md:text-xl font-medium")}>{children}</h2>
}

type CommonProps = WithClassName & PropsWithChildren

function Content({ children, className = "" }: CommonProps) {
   return (
      <div className={clsx(className, "flex flex-col gap-2 py-4 my-3 border-t border-b border-(--stroke-color)")}>
         {children}
      </div>
   )
}

function Label({ children, className = "" }: CommonProps) {
   return <p className={clsx(className, "text-white text-base font-medium")}>{children}</p>
}

interface ModalProps extends PropsWithChildren, WithClassName {
   isOpen: boolean
   onClose: () => void
}

function Modal({ isOpen, onClose, className, children }: ModalProps) {
   "use no memo"
   const container = useRef<HTMLDivElement>(null)
   const modalBox = useRef<HTMLDivElement>(null)
   const [isMounted, setIsMounted] = useState(isOpen)

   if (isOpen && !isMounted) {
      setIsMounted(true)
   }

   useEffect(() => {
      if (!isMounted) return

      const originalOverflow = document.body.style.overflow
      document.body.style.overflow = "hidden"

      return () => {
         document.body.style.overflow = originalOverflow
      }
   }, [isMounted])

   const { contextSafe } = useGSAP(
      () => {
         if (!isMounted || !isOpen) return

         gsap.to(container.current, {
            opacity: 1,
            duration: 0.3,
         })
         gsap.to(modalBox.current, {
            top: 0,
            opacity: 1,
            duration: 0.6,
         })
      },
      { dependencies: [isOpen, isMounted], scope: container },
   )

   // eslint-disable-next-line react-hooks/refs
   const closeModal = contextSafe(() => {
      gsap.to(container.current, {
         opacity: 0,
         duration: 0.3,
      })
      gsap.to(modalBox.current, {
         top: 100,
         opacity: 0,
         duration: 0.6,
         onComplete: () => {
            setIsMounted(false)
            onClose()
         },
      })
   })

   if (!isMounted) return null

   return createPortal(
      <ModalContext.Provider value={{ onClose: closeModal }}>
         <div
            className="fixed inset-0 bg-black/30 flex items-center justify-center opacity-0"
            ref={container}
            onClick={closeModal}
         >
            <div
               ref={modalBox}
               className={clsx(
                  className,
                  "bg-(--bg-second-color) sm:rounded-lg border-(--stroke-color) flex flex-col w-full sm:mx-8 md:mx-0 md:w-150 xl:w-175 2xl:w-200 px-4 py-4 relative top-25 opacity-0",
               )}
               onClick={e => e.stopPropagation()}
            >
               {children}
               <XIcon className="absolute right-4 top-4 cursor-pointer" onClick={closeModal} />
            </div>
         </div>
      </ModalContext.Provider>,
      document.body,
   )
}

Modal.Header = Header
Modal.Content = Content
Modal.Label = Label

export default Modal
