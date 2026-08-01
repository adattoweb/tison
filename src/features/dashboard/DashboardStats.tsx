import type { WithClassName } from "@/types/common"
import clsx from "clsx"

const leaderboard: Omit<ItemProps, "index">[] = [
   {
      name: "Шевченко Тарас",
      points: 1245,
      diff: 15,
   },
   {
      name: "Коваленко Андрій",
      points: 1023,
      diff: 7,
   },
   {
      name: "Мельник Олександр",
      points: 875,
      diff: 5,
   },
   {
      name: "Бондаренко Максим",
      points: 679,
      diff: 24,
   },
   {
      name: "Іваненко Дмитро",
      points: 500,
      diff: 35,
   },
]

interface ItemProps {
   index: number
   name: string
   points: number
   diff: number
}

function StatItem({ index, name, points, diff }: ItemProps) {
   return (
      <div className="flex-1 grid grid-cols-[24px_1fr_1fr_1fr] items-center gap-4 px-2 py-4 border-(--stroke-color) border-b last:border-0">
         <p className="font-medium text-base">{index + 1}</p>
         <p className="text-base">{name}</p>
         <p className="text-(--second-color) text-base text-right">
            <span className="text-white">{points}</span> балів
         </p>
         <p className="text-(--right-color) text-base text-right">+{diff}</p>
      </div>
   )
}

export function DashboardStats({ className }: WithClassName) {
   return (
      <div
         className={clsx(
            className,
            "ibm-plex-sans bg-(--bg-trans-color) py-(--components-py) px-(--components-px) border border-(--stroke-color) rounded-xl flex flex-col gap-2",
         )}
         style={{ gridArea: "stats" }}
      >
         <header className="flex justify-between">
            <p className="font-medium text-lg">Топ співробітників</p>
            <a href="#" className="text-(--accent-color) underline ">
               Весь рейтинг
            </a>
         </header>
         <div className="flex flex-1 flex-col">
            {leaderboard.map((el, index) => (
               <StatItem key={index} index={index} name={el.name} points={el.points} diff={el.diff} />
            ))}
         </div>
      </div>
   )
}
