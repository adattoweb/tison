// components/UI/Select.tsx
import type { WithClassName } from "@/types/common"
import clsx from "clsx"
import type { LucideIcon } from "lucide-react"
import { forwardRef, type ComponentProps } from "react"

type SelectOption = {
   value: string | number
   label: string
}

type SelectProps = WithClassName & {
   Icon?: LucideIcon
   label: string
   hasError: boolean
   options: SelectOption[]
   placeholder?: string
} & Omit<ComponentProps<"select">, "children">

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
   ({ Icon, label, className, hasError, options, placeholder, ...props }, ref) => {
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
               <select
                  {...props}
                  ref={ref}
                  className="flex-1 focus:outline-0 w-full appearance-none rounded-md bg-transparent"
               >
                  {placeholder && (
                     <option value="" disabled>
                        {placeholder}
                     </option>
                  )}
                  {options.map(option => (
                     <option key={option.value} value={option.value}>
                        {option.label}
                     </option>
                  ))}
               </select>
            </div>
         </div>
      )
   },
)
