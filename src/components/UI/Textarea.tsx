import type { WithClassName } from "@/types/common"
import clsx from "clsx"
import type { LucideIcon } from "lucide-react"
import { forwardRef, type ComponentProps } from "react"

type TextareaProps = WithClassName & {
   Icon?: LucideIcon
   label: string
   hasError: boolean
} & ComponentProps<"textarea">

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
   ({ Icon, label, placeholder = "", className, hasError, rows = 3, ...props }, ref) => {
      return (
         <div className={clsx(className, "flex flex-col gap-1.5 w-full")}>
            <p className="text-base font-medium">{label}</p>
            <div
               className={clsx(
                  hasError && "border-red-400!",
                  "flex items-start gap-2 border border-(--stroke-color) focus-within:border-(--stroke-light-color) rounded-md bg-(--bg-trans-color) py-2 px-2.5",
               )}
            >
               {Icon && <Icon className="size-5 stroke-white mt-0.5 shrink-0" strokeWidth={2} />}
               <textarea
                  {...props}
                  ref={ref}
                  rows={rows}
                  className="flex-1 focus:outline-0 w-full appearance-none rounded-md resize-none"
                  placeholder={placeholder}
               />
            </div>
         </div>
      )
   },
)
