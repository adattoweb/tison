import { useLayoutEffect, useRef, useState } from "react"
import { NAME } from "@/constants/app"
import { routes } from "@/routes/routes"
import clsx from "clsx"
import gsap from "gsap"
import { ChevronsLeft, type LucideIcon } from "lucide-react"
import { NavLink } from "react-router"

const EXPANDED_WIDTH = 320
const COLLAPSED_WIDTH = 88

interface NavItemProps {
   to: string
   label: string
   Icon: LucideIcon
   labelRef: (el: HTMLParagraphElement | null) => void
}

function NavItem({ to, label, Icon, labelRef }: NavItemProps) {
   return (
      <NavLink
         to={to}
         draggable={false}
         className={({ isActive }) =>
            clsx("group flex h-12 w-full items-center gap-2.5 overflow-hidden rounded-md px-3.5 py-2.5 select-none", {
               "bg-[linear-gradient(90deg,rgba(103,83,49,0.2)_0%,rgba(62,52,35,0.6)_22%,rgba(77,62,39,0.6)_53%,rgba(8,9,10,0)_100%)] hover:brightness-110":
                  isActive,
               "hover:bg-[#17191C]": !isActive,
            })
         }
      >
         {({ isActive }) => (
            <>
               <Icon
                  width={24}
                  height={24}
                  strokeWidth={2}
                  className={clsx(
                     "shrink-0",
                     isActive ? "stroke-(--accent-color)" : "stroke-(--second-color) group-hover:stroke-white",
                  )}
               />

               <p
                  ref={labelRef}
                  className={clsx(
                     "montserrat overflow-hidden text-[18px] font-medium whitespace-nowrap",
                     isActive ? "text-(--accent-color)" : "text-(--second-color) group-hover:text-white",
                  )}
               >
                  {label}
               </p>
            </>
         )}
      </NavLink>
   )
}

export function Sidebar() {
   const [isOpen, setIsOpen] = useState(true)

   const asideRef = useRef<HTMLElement>(null)
   const titleWrapperRef = useRef<HTMLHeadingElement>(null)
   const buttonRef = useRef<HTMLButtonElement>(null)
   const labelRefs = useRef<(HTMLParagraphElement | null)[]>([])
   const timelineRef = useRef<gsap.core.Timeline | null>(null)
   const titleWidthRef = useRef(0)

   useLayoutEffect(() => {
      const labels = labelRefs.current.filter(Boolean)

      if (titleWrapperRef.current && titleWidthRef.current === 0) {
         titleWidthRef.current = titleWrapperRef.current.scrollWidth
      }

      timelineRef.current?.kill()

      const tl = gsap.timeline({ defaults: { ease: "power2.inOut" } })

      tl.to(
         asideRef.current,
         { width: isOpen ? EXPANDED_WIDTH : COLLAPSED_WIDTH, duration: 0.35, roundProps: "width" },
         0,
      )
      tl.to(
         titleWrapperRef.current,
         {
            opacity: isOpen ? 1 : 0,
            width: isOpen ? titleWidthRef.current : 0,
            duration: 0.3,
            roundProps: "width",
         },
         0,
      )
      tl.to(buttonRef.current, { marginLeft: isOpen ? 20 : 0, duration: 0.3, roundProps: "marginLeft" }, 0)
      tl.to(labels, { opacity: isOpen ? 1 : 0, duration: 0.25 }, isOpen ? 0.12 : 0)

      timelineRef.current = tl

      return () => {
         tl.kill()
      }
   }, [isOpen])

   return (
      <aside
         ref={asideRef}
         style={{ width: EXPANDED_WIDTH, contain: "layout style", willChange: "width" }}
         className="top-0 bottom-0 z-11 flex flex-col items-start overflow-hidden border-r-2 border-(--stroke-color) bg-[#090A0B] py-7"
      >
         <div className="flex w-full items-center justify-center overflow-hidden">
            <h1
               ref={titleWrapperRef}
               className="ibm-plex-sans overflow-hidden text-3xl font-semibold whitespace-nowrap text-white"
               style={{ willChange: "width" }}
            >
               {NAME} <span className="text-(--accent-color)">MES</span>
            </h1>

            <button
               ref={buttonRef}
               type="button"
               onClick={() => setIsOpen(prev => !prev)}
               aria-label={isOpen ? "Згорнути меню" : "Розгорнути меню"}
               className="flex size-8 shrink-0 cursor-pointer items-center justify-center rounded-full border border-(--stroke-color) bg-[#17191C] text-(--second-color) transition-colors hover:text-white ml-5"
            >
               <ChevronsLeft
                  width={24}
                  height={24}
                  className={clsx("transition-transform duration-300", !isOpen && "rotate-180")}
               />
            </button>
         </div>

         <nav className="my-6 flex w-full flex-col gap-1 px-4">
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
      </aside>
   )
}
