import type { WithClassName } from "@/types/common"
import clsx from "clsx"
import type { LucideIcon } from "lucide-react"

type InputProps = WithClassName & {
   Icon?: LucideIcon
   label: string
   placeholder?: string
}

export function Input({ Icon, label, placeholder = "", className }: InputProps) {
   return (
      <div className={clsx(className, "flex flex-col gap-1.5 w-full")}>
         <p className="text-base font-medium">{label}</p>
         <div className="flex items-center gap-2 border border-(--stroke-color) focus-within:border-(--stroke-light-color) rounded-md bg-(--bg-trans-color) py-2 px-1.5">
            {Icon && <Icon className="size-5 stroke-white" strokeWidth={2} />}
            <input className="flex-1 focus:outline-0 w-full" placeholder={placeholder} />
         </div>
      </div>
   )
}
