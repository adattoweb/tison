import { useCurrentUser } from "@/hooks/api/auth/useCurrentUser"
import { useCurrentProfile } from "@/hooks/api/profile/useCurrentProfile"
import { UserCircleIcon } from "@heroicons/react/24/outline"
import clsx from "clsx"
import { ChevronDownIcon, LogOutIcon, type LucideIcon } from "lucide-react"
import gsap from "gsap"
import { useGSAP } from "@gsap/react"
import { useRef, useState } from "react"
import { Link } from "react-router"

interface ProfileProps {
   ref: React.RefObject<HTMLDivElement | null>
   textsRef: React.RefObject<HTMLDivElement | null>
}

interface ItemProps {
   Icon: LucideIcon
   text: string
   to: string
   onClick?: () => void
}

function MenuItem({ text, Icon, to, onClick }: ItemProps) {
   return (
      <Link
         to={to}
         className="flex px-3.5 py-2.5 gap-2 hover:bg-(--bg-trans-color) flex-1 cursor-pointer"
         onClick={onClick}
      >
         <Icon className="shrink-0 size-6" />
         <p className="profile-item whitespace-nowrap">{text}</p>
      </Link>
   )
}

export function Profile({ ref, textsRef }: ProfileProps) {
   const { data: profile, isError } = useCurrentProfile()
   const { data: user } = useCurrentUser()
   const [isOpen, setIsOpen] = useState(false)
   const menuRef = useRef<HTMLDivElement>(null)

   useGSAP(
      () => {
         if (!menuRef.current) return

         if (isOpen) {
            gsap.fromTo(
               menuRef.current,
               {
                  height: 0,
                  opacity: 0,
               },
               {
                  height: "auto",
                  opacity: 1,
                  duration: 0.3,
                  ease: "power2.out",
               },
            )
         } else {
            gsap.to(menuRef.current, {
               height: 0,
               opacity: 0,
               duration: 0.25,
               ease: "power2.in",
            })
         }
      },
      { dependencies: [isOpen] },
   )

   return (
      <div
         className="flex w-full mt-auto relative flex-col gap-2 overflow-hidden cursor-pointer"
         onClick={() => setIsOpen(!isOpen)}
      >
         <div
            ref={menuRef}
            className="flex flex-col w-full bg-(--bg-trans-color) border border-(--stroke-color) rounded-lg overflow-hidden"
            style={{ height: 0, opacity: 0 }}
         >
            <MenuItem Icon={UserCircleIcon} text="Профіль" to="profile/me" />
            <MenuItem Icon={LogOutIcon} text="Вийти" to="logout" />
         </div>

         <div
            ref={ref}
            className="flex h-16 w-full shrink-0 items-center gap-2 px-2 rounded-lg border border-(--stroke-color) overflow-hidden"
         >
            <UserCircleIcon className="size-9 shrink-0 stroke-(--accent-color)" />

            <div ref={textsRef} className="flex flex-col gap-0.5 overflow-hidden">
               {isError ? (
                  <p className="font-normal text-sm text-(--second-color) whitespace-nowrap">Неавторизовано</p>
               ) : (
                  <>
                     <p className="font-medium text-base whitespace-nowrap">{profile?.first_name}</p>
                     <p className="font-normal text-sm text-(--second-color) whitespace-nowrap"></p>
                  </>
               )}
            </div>

            <ChevronDownIcon className={clsx("transition-transform duration-300", !isOpen && "-rotate-90")} />
         </div>
      </div>
   )
}
