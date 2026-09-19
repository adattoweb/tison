import type { WithClassName } from "@/types/common"
import clsx from "clsx"
import type { LucideIcon } from "lucide-react"
import { forwardRef, type ComponentProps } from "react"

type InputProps = WithClassName & {
   Icon?: LucideIcon
   label: string
   hasError: boolean
} & ComponentProps<"input">

export const Input = forwardRef<HTMLInputElement, InputProps>(
   ({ Icon, label, placeholder = "", className, type = "text", hasError, ...props }, ref) => {
      return (
         <div className={clsx(className, "flex flex-col gap-1.5 w-full")}>
            <p className="text-base font-medium">{label}</p>
            <div
               className={clsx(
                  hasError && "border-red-400!",
                  "flex items-center gap-2 border border-(--stroke-color) focus-within:border-(--stroke-light-color) rounded-md bg-(--bg-trans-color) py-2 px-2.5 h-11",
               )}
            >
               {Icon && <Icon className="size-5 stroke-white" strokeWidth={2} />}
               <input
                  {...props}
                  ref={ref}
                  type={type}
                  className="flex-1 focus:outline-0 w-full appearance-none rounded-md"
                  placeholder={placeholder}
               />
            </div>
         </div>
      )
   },
)
