import { forwardRef } from "react"
import { CheckIcon } from "lucide-react"
import clsx from "clsx"

interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type"> {}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(function Checkbox(
   { className, checked, disabled, ...props },
   ref,
) {
   return (
      <label
         className={clsx(
            "inline-flex items-center justify-center",
            disabled ? "cursor-not-allowed opacity-50" : "cursor-pointer",
            className,
         )}
      >
         <input ref={ref} type="checkbox" checked={checked} disabled={disabled} className="peer sr-only" {...props} />
         <span
            className={clsx(
               "flex items-center justify-center size-6 rounded-md border transition-colors",
               checked
                  ? "bg-(--accent-color) border-(--accent-color)"
                  : "bg-(--bg-trans-color) border-(--stroke-color) peer-hover:border-(--stroke-active-color)",
            )}
         >
            {checked && <CheckIcon className="size-4 text-black" strokeWidth={3} />}
         </span>
      </label>
   )
})
