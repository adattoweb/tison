import type { LucideIcon } from "lucide-react"

interface CardProps {
   title: string
   value: string
   diff: string
   diffColor: string
   Icon: LucideIcon
}

export default function InfoCard({ title, value, diff, diffColor, Icon }: CardProps) {
   return (
      <div className="flex flex-1 py-4 px-6 rounded-xl border border-(--stroke-color) gap-4 ibm-plex-sans items-center bg-(--bg-trans-color)">
         <div className="p-2 border border-(--stroke-color) rounded-md">
            <Icon className="w-9 h-9 stroke-(--accent-color)" strokeWidth={1.5} />
         </div>
         <div className="flex flex-col gap-1">
            <h4 className="text-(--second-color) text-xl">{title}</h4>
            <h3 className="text-white text-2xl font-medium">{value}</h3>
            <p style={{ color: diffColor }} className="text-(--right-color) text-xl">
               {diff}
            </p>
         </div>
      </div>
   )
}
