import { NAME } from "@/constants/app"
import { routes } from "@/routes/routes"
import clsx from "clsx"
import type { LucideIcon } from "lucide-react"
import { NavLink } from "react-router"

interface NavItemProps {
   to: string
   label: string
   Icon: LucideIcon
}
function NavItem({ to, label, Icon }: NavItemProps) {
   return (
      <NavLink
         to={to}
         className={({ isActive }) =>
            clsx(
               "flex items-center py-2.5 px-4 gap-2.5 rounded-md h-12",
               isActive &&
                  "bg-[linear-gradient(90deg,rgba(103,83,49,0.2)_0%,rgba(62,52,35,0.6)_22%,rgba(77,62,39,0.6)_53%,rgba(8,9,10,0)_100%)]",
            )
         }
      >
         {({ isActive }) => (
            <>
               <Icon
                  width={24}
                  height={24}
                  className={isActive ? "stroke-(--accent-color)" : "stroke-(--second-color)"}
                  strokeWidth={2}
               />
               <p
                  className={clsx(
                     "font-medium montserrat text-[18px]",
                     isActive ? "text-(--accent-color)" : "text-(--second-color)",
                  )}
               >
                  {label}
               </p>
            </>
         )}
      </NavLink>
   )
}

export default function Sidebar() {
   return (
      <aside className="w-80 border-r border-[#2E2B25] bg-[#090A0B] flex flex-col items-center py-7 ">
         <h1 className="ibm-plex-sans text-3xl font-semibold text-white">
            {NAME} <span className="text-(--accent-color)">MES</span>
         </h1>
         <nav className="my-6">
            {routes.map(el => (
               <NavItem to={el.path} label={el.handle.label} Icon={el.handle.Icon} />
            ))}
         </nav>
      </aside>
   )
}
