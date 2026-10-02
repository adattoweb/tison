import type { ReactNode } from "react"
import clsx from "clsx"

interface BlockProps {
   /** назва grid-area */
   area: string
   title: string
   action?: ReactNode
   className?: string
   children: ReactNode
}

/** Картка, яка займає свою область сітки на всю висоту */
export function Block({ area, title, action, className, children }: BlockProps) {
   return (
      <section
         style={{ gridArea: area }}
         className={clsx(
            "flex min-h-0 min-w-0 flex-col gap-3 rounded-md border border-(--stroke-color) bg-(--bg-trans-color) p-4",
            className,
         )}
      >
         <header className="flex items-center justify-between gap-2">
            <h2 className="text-base font-medium text-white md:text-lg">{title}</h2>
            {action}
         </header>
         {children}
      </section>
   )
}

export function Placeholder({ children }: { children: ReactNode }) {
   return <p className="m-auto py-6 text-center text-sm text-[#D9D9D9]">{children}</p>
}
