import { useLayoutEffect, useRef, useState } from "react"
import { NAME } from "@/constants/app"
import { routes } from "@/routes/routes"
import gsap from "gsap"
import { COLLAPSED_WIDTH, EXPANDED_WIDTH } from "@/constants/sidebar"
import { NavItem } from "./NavItem"
import { Profile } from "./Profile"

const FIRST_LETTER = NAME.charAt(0)
const REST_OF_NAME = NAME.slice(1)

export function Sidebar() {
   const [isOpen, setIsOpen] = useState(false)

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

   useLayoutEffect(() => {
      const labels = labelRefs.current.filter(Boolean)

      timelineRef.current?.kill()

      const tl = gsap.timeline({ defaults: { ease: "power2.inOut", overwrite: "auto" } })

      tl.to(asideRef.current, { width: isOpen ? EXPANDED_WIDTH : COLLAPSED_WIDTH, duration: 0.35 }, 0)
      tl.to(
         titleRestRef.current,
         { opacity: isOpen ? 1 : 0, width: isOpen ? titleRestWidthRef.current : 0, duration: 0.3 },
         0,
      )
      tl.to([...labels, profileTextsRef.current], { opacity: isOpen ? 1 : 0, duration: 0.25 }, isOpen ? 0.12 : 0)

      timelineRef.current = tl

      return () => {
         tl.kill()
      }
   }, [isOpen])

   return (
      <aside
         ref={asideRef}
         onMouseEnter={() => setIsOpen(true)}
         onMouseLeave={() => setIsOpen(false)}
         style={{ width: COLLAPSED_WIDTH, contain: "layout style", willChange: "width" }}
         className="fixed top-0 left-0 bottom-0 z-11 flex flex-col items-start overflow-hidden border-r-2 border-(--stroke-color) bg-[#090A0B] py-7 px-4 max-h-screen"
      >
         <div className="flex w-full items-center justify-center overflow-hidden">
            <h1 className="ibm-plex-sans flex items-baseline overflow-hidden text-3xl font-semibold whitespace-nowrap text-white">
               <span>{FIRST_LETTER}</span>

               <span ref={titleRestRef} className="overflow-hidden" style={{ willChange: "width, opacity" }}>
                  {REST_OF_NAME} <span className="text-(--accent-color)">MES</span>
               </span>
            </h1>
         </div>

         <nav className="my-6 flex w-full flex-col gap-1">
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
   )
}
