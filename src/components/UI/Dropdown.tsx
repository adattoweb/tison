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
import { createPortal } from "react-dom"
import clsx from "clsx"
import { ChevronDownIcon } from "@heroicons/react/24/outline"
import gsap from "gsap"
import { useCheckContext } from "@/hooks/useCheckContext"

type Direction = "down" | "up"
type Align = "left" | "right"

interface DropdownContextValue {
   open: boolean
   setOpen: (open: boolean) => void
   direction: Direction
   align: Align
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
   const [align, setAlign] = useState<Align>("left")
   const containerRef = useRef<HTMLDivElement>(null)
   const triggerRef = useRef<HTMLButtonElement>(null)
   const contentRef = useRef<HTMLDivElement>(null)

   useEffect(() => {
      if (!open) return
      function handleClickOutside(e: MouseEvent) {
         const target = e.target as Node
         const clickedContainer = containerRef.current && containerRef.current.contains(target)
         const clickedContent = contentRef.current && contentRef.current.contains(target)
         if (!clickedContainer && !clickedContent) {
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
      const contentWidth = content.scrollWidth

      const spaceBelow = window.innerHeight - triggerRect.bottom - GAP
      const spaceAbove = triggerRect.top - GAP

      const fitsBelow = contentHeight <= spaceBelow
      const fitsAbove = contentHeight <= spaceAbove

      if (fitsBelow) setDirection("down")
      else if (fitsAbove) setDirection("up")
      else setDirection(spaceAbove > spaceBelow ? "up" : "down")

      const spaceRight = window.innerWidth - triggerRect.left - GAP
      const spaceLeft = triggerRect.right - GAP

      const fitsRight = contentWidth <= spaceRight
      const fitsLeft = contentWidth <= spaceLeft

      if (fitsRight) setAlign("left")
      else if (fitsLeft) setAlign("right")
      else setAlign(spaceLeft > spaceRight ? "right" : "left")
   }, [open])

   return (
      <DropdownContext.Provider value={{ open, setOpen, direction, align, triggerRef, contentRef }}>
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
            "inline-flex items-center justify-between rounded-md border border-(--stroke-color) bg-(--bg-trans-color) px-4 py-2 gap-3 md:gap-4 cursor-pointer text-sm md:text-base",
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

interface PortalCoords {
   top?: number
   bottom?: number
   left?: number
   right?: number
   width: number
}

function DropdownContent({ children, className, ...props }: DropdownContentProps) {
   const { open, direction, align, triggerRef, contentRef } = useCheckContext(DropdownContext)
   const [coords, setCoords] = useState<PortalCoords | null>(null)
   const [mounted, setMounted] = useState(false)

   useEffect(() => {
      setMounted(true)
   }, [])

   // Обчислюємо/оновлюємо позицію відносно viewport, поки dropdown відкритий
   useLayoutEffect(() => {
      if (!open) return

      function updatePosition() {
         const trigger = triggerRef.current
         if (!trigger) return
         const rect = trigger.getBoundingClientRect()

         const vertical =
            direction === "down" ? { top: rect.bottom + GAP } : { bottom: window.innerHeight - rect.top + GAP }

         const horizontal = align === "left" ? { left: rect.left } : { right: window.innerWidth - rect.right }

         setCoords({
            ...vertical,
            ...horizontal,
            width: rect.width,
         })
      }

      updatePosition()

      window.addEventListener("scroll", updatePosition, true)
      window.addEventListener("resize", updatePosition)
      return () => {
         window.removeEventListener("scroll", updatePosition, true)
         window.removeEventListener("resize", updatePosition)
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, [open, direction, align])

   useEffect(() => {
      const content = contentRef.current
      if (!content || !coords) return

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
   }, [open, direction, coords])

   if (!mounted) return null

   return createPortal(
      <div
         ref={contentRef}
         style={{
            position: "fixed",
            top: coords?.top,
            bottom: coords?.bottom,
            left: coords?.left,
            right: coords?.right,
            width: coords?.width,
            visibility: "hidden",
            opacity: 0,
         }}
         className={clsx(
            "overflow-hidden rounded-sm border border-(--stroke-color) bg-(--bg-trans-color) z-50 backdrop-blur-sm min-w-50",
            open ? "pointer-events-auto" : "pointer-events-none",
            className,
         )}
         {...props}
      >
         {children}
      </div>,
      document.body,
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
