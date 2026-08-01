import { UserCircleIcon } from "@heroicons/react/24/outline"

interface ProfileProps {
   ref: React.RefObject<HTMLDivElement | null>
   textsRef: React.RefObject<HTMLDivElement | null>
}

export function Profile({ ref, textsRef }: ProfileProps) {
   return (
      <div
         ref={ref}
         className="mt-auto flex h-16 w-full shrink-0 items-center gap-2 px-2 rounded-lg border border-(--stroke-color) overflow-hidden"
      >
         <UserCircleIcon className="size-9 shrink-0 stroke-(--accent-color)" />
         <div ref={textsRef} className="flex flex-col gap-0.5 overflow-hidden">
            <p className="font-medium text-base whitespace-nowrap">Admin</p>
            <p className="font-normal text-sm text-(--second-color) whitespace-nowrap">Керівник системи</p>
         </div>
      </div>
   )
}
