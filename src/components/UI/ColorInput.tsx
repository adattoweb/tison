import clsx from "clsx"
import type { LucideIcon } from "lucide-react"
import { forwardRef } from "react"

interface ColorInputProps {
   label: string
   Icon?: LucideIcon
   value: string
   onChange: (value: string) => void
   onBlur?: () => void
   name?: string
   hasError?: boolean
   className?: string
}

// <input type="color"> приймає лише #rrggbb, інакше скидає на чорний
const toPickerValue = (v: string) => {
   if (/^#[0-9a-fA-F]{6}$/.test(v)) return v
   if (/^#[0-9a-fA-F]{3}$/.test(v)) return "#" + [...v.slice(1)].map(c => c + c).join("")
   return "#000000"
}

export const ColorInput = forwardRef<HTMLInputElement, ColorInputProps>(
   ({ label, Icon, value, onChange, onBlur, name, hasError, className }, ref) => {
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
                  ref={ref}
                  name={name}
                  type="text"
                  value={value}
                  maxLength={7}
                  placeholder="#61D381"
                  onChange={e => onChange(e.target.value)}
                  onBlur={onBlur}
                  className="flex-1 focus:outline-0 w-full appearance-none rounded-md"
               />
               <input
                  type="color"
                  value={toPickerValue(value)}
                  onChange={e => onChange(e.target.value)}
                  className="w-5 h-5 cursor-pointer"
               />
            </div>
         </div>
      )
   },
)
