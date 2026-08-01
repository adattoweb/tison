import clsx from "clsx"
import type { LucideIcon } from "lucide-react"
import { NavLink } from "react-router"

interface NavItemProps {
   to: string
   label: string
   Icon: LucideIcon
   labelRef: (el: HTMLParagraphElement | null) => void
}

export function NavItem({ to, label, Icon, labelRef }: NavItemProps) {
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
