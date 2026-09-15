import { roles } from "@/constants/role"
import { useCurrentUser } from "@/hooks/api/auth/useCurrentUser"
import { useCurrentProfile } from "@/hooks/api/profile/useCurrentProfile"
import { UserCircleIcon } from "@heroicons/react/24/outline"

interface ProfileProps {
   ref: React.RefObject<HTMLDivElement | null>
   textsRef: React.RefObject<HTMLDivElement | null>
}

export function Profile({ ref, textsRef }: ProfileProps) {
   const { data: profile, isError } = useCurrentProfile()
   const { data: user } = useCurrentUser()

   return (
      <div
         ref={ref}
         className="mt-auto flex h-16 w-full shrink-0 items-center gap-2 px-2 rounded-lg border border-(--stroke-color) overflow-hidden"
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
      </div>
   )
}
