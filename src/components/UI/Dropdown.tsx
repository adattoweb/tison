import { useEffect, useRef, useState } from "react"
import { ChevronDownIcon } from "@heroicons/react/24/outline"
import gsap from "gsap"

interface DropdownProps {
   value: string
   options: string[]
   onChange: (value: string) => void
}

export default function Dropdown({ value, options, onChange }: DropdownProps) {
   const [open, setOpen] = useState(false)
   const menuRef = useRef<HTMLDivElement>(null)
   const chevronRef = useRef<SVGSVGElement>(null)

   useEffect(() => {
      const menu = menuRef.current
      if (!menu) return

      if (open) {
         gsap.set(menu, { display: "block" })
         gsap.fromTo(
            menu,
            { autoAlpha: 0, y: -8, scale: 0.97, transformOrigin: "top" },
            { autoAlpha: 1, y: 0, scale: 1, duration: 0.22, ease: "power3.out" },
         )
      } else {
         gsap.to(menu, {
            autoAlpha: 0,
            y: -8,
            scale: 0.97,
            duration: 0.15,
            ease: "power2.in",
            onComplete: () => {
               gsap.set(menu, { display: "none" })
            },
         })
      }
   }, [open])

   useEffect(() => {
      if (!chevronRef.current) return
      gsap.to(chevronRef.current, {
         rotate: open ? 180 : 0,
         duration: 0.22,
         ease: "power3.out",
         transformOrigin: "50% 50%",
      })
   }, [open])

   return (
      <div className="relative inline-block self-start w-fit">
         <button
            type="button"
            onClick={() => setOpen(prev => !prev)}
            className="inline-flex items-center justify-between rounded-md border border-(--stroke-color) bg-(--bg-trans-color) px-4 py-2 gap-4 cursor-pointer"
         >
            <span className="text-base font-normal text-white whitespace-nowrap">{value}</span>

            <ChevronDownIcon ref={chevronRef} className="h-5 w-5 shrink-0 text-[#D9D9D9]" />
         </button>

         <div
            ref={menuRef}
            style={{ display: "none", visibility: "hidden", opacity: 0 }}
            className="absolute left-0 right-0 top-[calc(100%+12px)] overflow-hidden rounded-sm border border-(--stroke-color) bg-(--bg-trans-color) z-10 backdrop-blur-sm"
         >
            {options.map(option => (
               <button
                  key={option}
                  type="button"
                  onClick={() => {
                     onChange(option)
                     setOpen(false)
                  }}
                  className="w-full cursor-pointer whitespace-nowrap px-4 py-2 text-left text-white transition-colors hover:bg-(--bg-trans-hover-color)"
               >
                  {option}
               </button>
            ))}
         </div>
      </div>
   )
}
