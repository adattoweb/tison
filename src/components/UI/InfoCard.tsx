import type { WithClassName } from "@/types/common"
import type { LucideIcon } from "lucide-react"

interface CardProps extends WithClassName {
   title: string
   value: string
   diff: string
   diffColor: string
   Icon: LucideIcon
   style?: React.CSSProperties
}

export default function InfoCard({ className, title, value, diff, diffColor, Icon, style }: CardProps) {
   return (
      <div
         className={`flex flex-1 py-3 px-5 rounded-xl border border-(--stroke-color) gap-4 ibm-plex-sans items-center bg-(--bg-trans-color) overflow-hidden ${className}`}
         style={style}
      >
         <div className="p-2 border border-(--stroke-color) rounded-md">
            <Icon className="size-9 stroke-(--accent-color)" strokeWidth={1.5} />
         </div>
         <div className="flex flex-col gap-1">
            <h4 className="text-(--second-color) truncate text-[14px] 2xl:text-base">{title}</h4>
            <h3 className="text-white text-base xl:text-lg 2xl:text-xl font-medium">{value}</h3>
            <p style={{ color: diffColor }} className="text-(--right-color) text-base 2xl:text-lg">
               {diff}
            </p>
         </div>
      </div>
   )
}
