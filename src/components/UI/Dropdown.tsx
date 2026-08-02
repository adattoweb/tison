import {
   createContext,
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
import { useCheckContext } from "@/hooks/useCheckContext"

type Direction = "down" | "up"

interface DropdownContextValue {
   open: boolean
   setOpen: (open: boolean) => void
   direction: Direction
   triggerRef: RefObject<HTMLButtonElement | null>
   contentRef: RefObject<HTMLDivElement | null>
}

const DropdownContext = createContext<DropdownContextValue | null>(null)

const GAP = 12

interface DropdownProps {
   children: ReactNode
   className?: string
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
      else setDirection(spaceAbove > spaceBelow ? "up" : "down")
   }, [open])

   return (
      <DropdownContext.Provider value={{ open, setOpen, direction, triggerRef, contentRef }}>
         <div ref={containerRef} className={clsx("relative inline-block self-start w-fit", className)}>
            {children}
         </div>
      </DropdownContext.Provider>
   )
}

interface DropdownButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
   children: ReactNode
}

function DropdownButton({ children, className, onClick, ...props }: DropdownButtonProps) {
   const { open, setOpen, triggerRef } = useCheckContext(DropdownContext)

   return (
      <button
         ref={triggerRef}
         type="button"
         onClick={e => {
            onClick?.(e)
            setOpen(!open)
         }}
         className={clsx(
            "inline-flex items-center justify-between rounded-md border border-(--stroke-color) bg-(--bg-trans-color) px-2 md:px-4 py-1 md:py-2 gap-3 md:gap-4 cursor-pointer text-sm md:text-base",
            className,
         )}
         {...props}
      >
         {children}
      </button>
   )
}

function DropdownChevron({ className }: { className?: string }) {
   const { open } = useCheckContext(DropdownContext)
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

   return <ChevronDownIcon ref={chevronRef} className={clsx("size-4 md:size-5 shrink-0 text-[#D9D9D9]", className)} />
}

interface DropdownContentProps extends HTMLAttributes<HTMLDivElement> {
   children: ReactNode
}

function DropdownContent({ children, className, ...props }: DropdownContentProps) {
   const { open, direction, contentRef } = useCheckContext(DropdownContext)

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

interface DropdownItemProps extends ButtonHTMLAttributes<HTMLButtonElement> {
   children: ReactNode
}

function DropdownItem({ children, className, onClick, ...props }: DropdownItemProps) {
   const { setOpen } = useCheckContext(DropdownContext)

   return (
      <button
         type="button"
         onClick={e => {
            onClick?.(e)
            setOpen(false)
         }}
         className={clsx(
            "w-full cursor-pointer whitespace-nowrap px-3 md:px-4 py-1 md:py-2 text-left text-white transition-colors hover:bg-(--bg-trans-hover-color)",
            className,
         )}
         {...props}
      >
         {children}
      </button>
   )
}

Dropdown.Button = DropdownButton
Dropdown.Content = DropdownContent
Dropdown.Item = DropdownItem
Dropdown.Chevron = DropdownChevron

export default Dropdown
