import { employees } from "@/routes/employees"
import type { WithClassName } from "@/types/common"
import { titleClassName } from "@/utils/classNames"
import { useEmployeeRanking } from "@/hooks/api/employeeAnalytics/useEmployeeRanking"
import type { EmployeeRankingEntry } from "@/api/types/employeeAnalytics"
import clsx from "clsx"
import { Link } from "react-router"

interface StatItemProps {
   entry: EmployeeRankingEntry
}

function StatItem({ entry }: StatItemProps) {
   const fullName = `${entry.last_name} ${entry.first_name}`

   return (
      <div className="flex-1 grid grid-cols-[12px_3fr_1fr_1fr] md:grid-cols-[24px_2fr_1fr_1fr] gap-2 md:gap-4 px-2 py-4 border-(--stroke-color) border-b last:border-0">
         <p className="font-medium text-base">{entry.place}</p>
         <p className="text-base overflow-hidden truncate">{fullName}</p>
         <p className="text-base text-right flex gap-2 px-2">
            <span className="text-white">{entry.points}</span>
            <span className="hidden sm:block text-(--second-color)">балів</span>
         </p>
         <p
            className={clsx(
               "text-base text-right",
               entry.points_today > 0 ? "text-(--right-color)" : "text-(--second-color)",
            )}
         >
            {entry.points_today > 0 ? `+${entry.points_today}` : "—"}
         </p>
      </div>
   )
}

export function DashboardStats({ className }: WithClassName) {
   const { data, isLoading, isError } = useEmployeeRanking({ limit: 5, includeMyRank: true })

   const entries = data?.entries ?? []
   const myRank = data?.my_rank
   const isMeInTop = myRank ? entries.some(entry => entry.user_id === myRank.user_id) : false

   return (
      <div
         className={clsx(
            className,
            "ibm-plex-sans bg-(--bg-trans-color) py-(--components-py) px-(--components-px) border border-(--stroke-color) rounded-xl flex flex-col gap-2",
         )}
         style={{ gridArea: "stats" }}
      >
         <header className="flex justify-between">
            <h2 className={titleClassName}>Топ співробітників</h2>
            <Link to={`/${employees.path}`} className="text-(--accent-color) underline text-sm md:text-base">
               Весь рейтинг
            </Link>
         </header>

         <div className="flex flex-1 flex-col">
            {isLoading && (
               <p className="flex-1 flex items-center justify-center text-(--second-color) py-8">Завантаження...</p>
            )}

            {isError && (
               <p className="flex-1 flex items-center justify-center text-red-400 py-8">
                  Не вдалося завантажити рейтинг
               </p>
            )}

            {!isLoading && !isError && entries.length === 0 && (
               <p className="flex-1 flex items-center justify-center text-(--second-color) py-8">Даних немає</p>
            )}

            {!isLoading && !isError && entries.map(entry => <StatItem key={entry.user_id} entry={entry} />)}
            {!isLoading && !isError && myRank && !isMeInTop && (
               <>
                  <div className="my-1 border-t border-dashed border-(--stroke-color)" />
                  <StatItem entry={myRank} />
               </>
            )}
         </div>
      </div>
   )
}
