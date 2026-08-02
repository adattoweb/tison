import { useEffect, useLayoutEffect, useRef, useState, type PropsWithChildren } from "react"
import { Menu, X } from "lucide-react"
import { NAME } from "@/constants/app"
import { routes } from "@/routes/routes"
import gsap from "gsap"
import { COLLAPSED_WIDTH, EXPANDED_WIDTH } from "@/constants/sidebar"
import { NavItem } from "./NavItem"
import { Profile } from "./Profile"
import type { WithClassName } from "@/types/common"
import clsx from "clsx"
import { useIsMobile } from "@/hooks/useIsMobile"

const FIRST_LETTER = NAME.charAt(0)
const REST_OF_NAME = NAME.slice(1)

interface ButtonProps extends PropsWithChildren, WithClassName {
   onClick: () => void
}
function MenuButton({ children, onClick, className = "" }: ButtonProps) {
   return (
      <button
         type="button"
         onClick={onClick}
         aria-label="Відкрити меню"
         className={clsx(
            className,
            "fixed top-5 left-4 z-20 flex size-10 items-center justify-center rounded-md border border-(--stroke-color) bg-[#090A0B] text-white cursor-pointer",
         )}
      >
         {children}
      </button>
   )
}

export function Sidebar() {
   const isMobile = useIsMobile()
   const [isHoverOpen, setIsHoverOpen] = useState(false)
   const [mobileOpen, setMobileOpen] = useState(false)

   const isOpen = isMobile ? mobileOpen : isHoverOpen

   const asideRef = useRef<HTMLElement>(null)
   const profileRef = useRef<HTMLDivElement>(null)
   const titleRestRef = useRef<HTMLSpanElement>(null)
   const labelRefs = useRef<(HTMLParagraphElement | null)[]>([])
   const timelineRef = useRef<gsap.core.Timeline | null>(null)
   const titleRestWidthRef = useRef(0)
   const profileTextsRef = useRef<HTMLDivElement>(null)

   useLayoutEffect(() => {
      if (titleRestRef.current) {
         titleRestWidthRef.current = titleRestRef.current.scrollWidth
      }
   }, [])

   useEffect(() => {
      if (!isMobile) setMobileOpen(false)
   }, [isMobile])

   useEffect(() => {
      if (!isMobile) return
      document.body.style.overflow = mobileOpen ? "hidden" : ""
      return () => {
         document.body.style.overflow = ""
      }
   }, [isMobile, mobileOpen])

   useLayoutEffect(() => {
      const labels = labelRefs.current.filter(Boolean)

      timelineRef.current?.kill()

      const tl = gsap.timeline({ defaults: { ease: "power2.inOut", overwrite: "auto" } })

      if (isMobile) {
         tl.set(asideRef.current, { width: "100vw" }, 0)
         tl.to(asideRef.current, { xPercent: isOpen ? 0 : -100, duration: 0.35 }, 0)
      } else {
         tl.set(asideRef.current, { xPercent: 0 }, 0)
         tl.to(asideRef.current, { width: isOpen ? EXPANDED_WIDTH : COLLAPSED_WIDTH, duration: 0.35 }, 0)
      }

      tl.to(
         titleRestRef.current,
         { opacity: isOpen ? 1 : 0, width: isOpen ? titleRestWidthRef.current : 0, display: "block", duration: 0.3 },
         0,
      )
      tl.to([...labels, profileTextsRef.current], { opacity: isOpen ? 1 : 0, duration: 0.25 }, isOpen ? 0.12 : 0)

      timelineRef.current = tl

      return () => {
         tl.kill()
      }
   }, [isOpen, isMobile])

   return (
      <>
         {isMobile && !mobileOpen && (
            <MenuButton onClick={() => setMobileOpen(true)}>
               <Menu className="size-5" strokeWidth={1.5} />
            </MenuButton>
         )}

         <aside
            ref={asideRef}
            onMouseEnter={() => !isMobile && setIsHoverOpen(true)}
            onMouseLeave={() => !isMobile && setIsHoverOpen(false)}
            style={{ width: COLLAPSED_WIDTH, contain: "layout style", willChange: "width, transform" }}
            className="fixed top-0 left-0 bottom-0 z-11 flex flex-col items-start overflow-hidden border-r-2 border-(--stroke-color) bg-[#090A0B] py-7 px-4 max-h-screen"
         >
            {isMobile && mobileOpen && (
               <MenuButton onClick={() => setMobileOpen(false)} className="right-4! left-auto!">
                  <X className="size-5" strokeWidth={1.5} />
               </MenuButton>
            )}

            <div className="flex w-full items-center justify-center overflow-hidden">
               <h1 className="ibm-plex-sans flex items-baseline text-3xl font-semibold whitespace-nowrap text-white">
                  <span>{FIRST_LETTER}</span>

                  <span ref={titleRestRef} className="overflow-hidden hidden" style={{ willChange: "width, opacity" }}>
                     {REST_OF_NAME} <span className="text-(--accent-color)">MES</span>
                  </span>
               </h1>
            </div>

            <nav onClick={() => isMobile && setMobileOpen(false)} className="my-6 flex w-full flex-col gap-1">
               {routes.map((el, index) => (
                  <NavItem
                     key={el.path}
                     to={el.path}
                     label={el.handle.label}
                     Icon={el.handle.Icon}
                     labelRef={node => {
                        labelRefs.current[index] = node
                     }}
                  />
               ))}
            </nav>
            <Profile ref={profileRef} textsRef={profileTextsRef} />
         </aside>
      </>
   )
}
