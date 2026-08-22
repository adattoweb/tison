import type { WithClassName } from "@/types/common"
import clsx from "clsx"

interface ToggleProps extends WithClassName {
   label?: string
   checked: boolean
   onChange: (checked: boolean) => void
   disabled?: boolean
}

export function Toggle({ label, checked, onChange, disabled = false, className }: ToggleProps) {
   return (
      <div className={clsx(className, "flex flex-col gap-1.5")}>
         {label && <p className="text-base font-medium">{label}</p>}

         <button
            type="button"
            role="switch"
            aria-checked={checked}
            disabled={disabled}
            onClick={() => onChange(!checked)}
            className={clsx(
               "relative inline-flex h-6 w-11 shrink-0 items-center rounded-full border transition-colors duration-200 outline-none",
               "focus-visible:border-(--stroke-light-color)",
               checked
                  ? "bg-(--accent-color) border-(--accent-color)"
                  : "bg-(--bg-trans-color) border-(--stroke-color)",
               disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer",
            )}
         >
            <span
               className={clsx(
                  "inline-block size-5 rounded-full bg-white shadow-sm transition-transform duration-200",
                  checked ? "translate-x-5.5" : "translate-x-0.5",
               )}
            />
         </button>
      </div>
   )
}
