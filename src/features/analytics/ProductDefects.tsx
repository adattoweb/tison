import { defects } from "@/routes/defects"
import type { WithClassName } from "@/types/common"
import { titleClassName } from "@/utils/classNames"
import clsx from "clsx"
import { Link } from "react-router"

interface ItemProps {
   index?: number
   name: string
   points: number
   diff: number
}

function StatItem({ index, name, points, diff }: ItemProps) {
   return (
      <div className="flex-1 grid grid-cols-[12px_3fr_1fr_1fr] md:grid-cols-[24px_2fr_1fr_1fr] items-center gap-2 md:gap-4 px-2 py-4 border-(--stroke-color) border-b last:border-0">
         {index !== undefined && <p className="font-medium text-base">{index + 1}</p>}
         <p className="text-base overflow-hidden truncate">{name}</p>
         <p className="text-base text-right flex gap-2 px-2 text-white">{points}</p>
         <p className="text-(--bad-color) text-base text-right">+{diff}</p>
      </div>
   )
}

export function ProductDefects({ className }: WithClassName) {
   return (
      <div
         className={clsx(
            className,
            "ibm-plex-sans bg-(--bg-trans-color) py-(--components-py) px-(--components-px) border border-(--stroke-color) rounded-xl flex flex-col gap-2 w-150",
         )}
         style={{ gridArea: "stats" }}
      >
         <header className="flex justify-between">
            <h2 className={titleClassName}>Топ дефектних виробів</h2>
            <Link to={`/${defects.path}`} className="text-(--accent-color) underline text-sm md:text-base">
               Весь рейтинг
            </Link>
         </header>
         <div className="flex flex-1 flex-col">
            <StatItem index={0} name="Зарядна станція V4" points={5} diff={2} />
            <StatItem index={1} name="Зарядна станція V4" points={5} diff={2} />
            <StatItem index={2} name="Зарядна станція V4" points={5} diff={2} />
            <StatItem index={3} name="Зарядна станція V4" points={5} diff={2} />
            <StatItem index={4} name="Зарядна станція V4" points={5} diff={2} />
         </div>
      </div>
   )
}
