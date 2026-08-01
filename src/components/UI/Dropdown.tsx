// UI/Dropdown.tsx
import {
   createContext,
   useContext,
   useEffect,
   useLayoutEffect,
   useRef,
   useState,
   type ButtonHTMLAttributes,
   type HTMLAttributes,
   type ReactNode,
   type RefObject,
} from "react"
import clsx from "clsx"
import { ChevronDownIcon } from "@heroicons/react/24/outline"
import gsap from "gsap"

/* ------------------------------------------------------------------ */
/* Context                                                            */
/* ------------------------------------------------------------------ */

type Direction = "down" | "up"

interface DropdownContextValue {
   open: boolean
   setOpen: (open: boolean) => void
   direction: Direction
   triggerRef: RefObject<HTMLButtonElement | null>
   contentRef: RefObject<HTMLDivElement | null>
}

const DropdownContext = createContext<DropdownContextValue | null>(null)

function useDropdownContext(component: string) {
   const ctx = useContext(DropdownContext)
   if (!ctx) throw new Error(`<Dropdown.${component} /> має використовуватись всередині <Dropdown>`)
   return ctx
}

/* ------------------------------------------------------------------ */
/* Root                                                                */
/* ------------------------------------------------------------------ */

const GAP = 12 // синхронізовано з top/bottom-[calc(100%+12px)] у Content

interface DropdownProps {
   children: ReactNode
   className?: string
   /** Керований режим (опційно) — якщо не передати, стан керується всередині */
   open?: boolean
   onOpenChange?: (open: boolean) => void
}

function Dropdown({ children, className, open: controlledOpen, onOpenChange }: DropdownProps) {
   const [uncontrolledOpen, setUncontrolledOpen] = useState(false)
   const isControlled = controlledOpen !== undefined
   const open = isControlled ? controlledOpen : uncontrolledOpen

   const setOpen = (value: boolean) => {
      if (!isControlled) setUncontrolledOpen(value)
      onOpenChange?.(value)
   }

   const [direction, setDirection] = useState<Direction>("down")
   const containerRef = useRef<HTMLDivElement>(null)
   const triggerRef = useRef<HTMLButtonElement>(null)
   const contentRef = useRef<HTMLDivElement>(null)

   // Закриття по кліку поза дропдауном
   useEffect(() => {
      if (!open) return
      function handleClickOutside(e: MouseEvent) {
         if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
            setOpen(false)
         }
      }
      document.addEventListener("mousedown", handleClickOutside)
      return () => document.removeEventListener("mousedown", handleClickOutside)
      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, [open])

   // Визначення напрямку відкриття залежно від вільного місця на екрані.
   // Content ніколи не має display:none, тому scrollHeight доступний одразу.
   useLayoutEffect(() => {
      if (!open) return
      const trigger = triggerRef.current
      const content = contentRef.current
      if (!trigger || !content) return

      const triggerRect = trigger.getBoundingClientRect()
      const contentHeight = content.scrollHeight

      const spaceBelow = window.innerHeight - triggerRect.bottom - GAP
      const spaceAbove = triggerRect.top - GAP

      const fitsBelow = contentHeight <= spaceBelow
      const fitsAbove = contentHeight <= spaceAbove

      if (fitsBelow) setDirection("down")
      else if (fitsAbove) setDirection("up")
      else setDirection(spaceAbove > spaceBelow ? "up" : "down") // не влазить нікуди — куди більше місця
   }, [open])

   return (
      <DropdownContext.Provider value={{ open, setOpen, direction, triggerRef, contentRef }}>
         <div ref={containerRef} className={clsx("relative inline-block self-start w-fit", className)}>
            {children}
         </div>
      </DropdownContext.Provider>
   )
}

/* ------------------------------------------------------------------ */
/* Button                                                              */
/* ------------------------------------------------------------------ */

interface DropdownButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
   children: ReactNode
}

function DropdownButton({ children, className, onClick, ...props }: DropdownButtonProps) {
   const { open, setOpen, triggerRef } = useDropdownContext("Button")

   return (
      <button
         ref={triggerRef}
         type="button"
         onClick={e => {
            onClick?.(e)
            setOpen(!open)
         }}
         className={clsx(
            "inline-flex items-center justify-between rounded-md border border-(--stroke-color) bg-(--bg-trans-color) px-4 py-2 gap-4 cursor-pointer",
            className,
         )}
         {...props}
      >
         {children}
      </button>
   )
}

/* ------------------------------------------------------------------ */
/* Chevron (опційний хелпер для Button)                                */
/* ------------------------------------------------------------------ */

function DropdownChevron({ className }: { className?: string }) {
   const { open } = useDropdownContext("Chevron")
   const chevronRef = useRef<SVGSVGElement>(null)

   useEffect(() => {
      if (!chevronRef.current) return
      gsap.to(chevronRef.current, {
         rotate: open ? 180 : 0,
         duration: 0.22,
         ease: "power3.out",
         transformOrigin: "50% 50%",
      })
   }, [open])

   return <ChevronDownIcon ref={chevronRef} className={clsx("h-5 w-5 shrink-0 text-[#D9D9D9]", className)} />
}

/* ------------------------------------------------------------------ */
/* Content                                                             */
/* ------------------------------------------------------------------ */

interface DropdownContentProps extends HTMLAttributes<HTMLDivElement> {
   children: ReactNode
}

function DropdownContent({ children, className, ...props }: DropdownContentProps) {
   const { open, direction, contentRef } = useDropdownContext("Content")

   useEffect(() => {
      const content = contentRef.current
      if (!content) return

      const fromY = direction === "down" ? -8 : 8

      gsap.to(content, {
         autoAlpha: open ? 1 : 0,
         y: open ? 0 : fromY,
         scale: open ? 1 : 0.97,
         duration: open ? 0.22 : 0.15,
         ease: open ? "power3.out" : "power2.in",
         transformOrigin: direction === "down" ? "top" : "bottom",
      })
      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, [open, direction])

   return (
      <div
         ref={contentRef}
         style={{ visibility: "hidden", opacity: 0 }}
         className={clsx(
            "absolute left-0 right-0 overflow-hidden rounded-sm border border-(--stroke-color) bg-(--bg-trans-color) z-10 backdrop-blur-sm",
            direction === "down" ? "top-[calc(100%+12px)]" : "bottom-[calc(100%+12px)]",
            open ? "pointer-events-auto" : "pointer-events-none",
            className,
         )}
         {...props}
      >
         {children}
      </div>
   )
}

/* ------------------------------------------------------------------ */
/* Item (опційний хелпер — пункт, що сам закриває дропдаун при виборі) */
/* ------------------------------------------------------------------ */

interface DropdownItemProps extends ButtonHTMLAttributes<HTMLButtonElement> {
   children: ReactNode
}

function DropdownItem({ children, className, onClick, ...props }: DropdownItemProps) {
   const { setOpen } = useDropdownContext("Item")

   return (
      <button
         type="button"
         onClick={e => {
            onClick?.(e)
            setOpen(false)
         }}
         className={clsx(
            "w-full cursor-pointer whitespace-nowrap px-4 py-2 text-left text-white transition-colors hover:bg-(--bg-trans-hover-color)",
            className,
         )}
         {...props}
      >
         {children}
      </button>
   )
}

/* ------------------------------------------------------------------ */
/* Export                                                              */
/* ------------------------------------------------------------------ */

Dropdown.Button = DropdownButton
Dropdown.Content = DropdownContent
Dropdown.Item = DropdownItem
Dropdown.Chevron = DropdownChevron

export default Dropdown
