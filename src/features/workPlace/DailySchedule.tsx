import { useState } from "react"
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react"

import { Block, Placeholder } from "./Block"
import { useOperatorDailySchedule } from "@/hooks/api/operatorAnalytics/useOperatorDailySchedule"

const toDayString = (d: Date) => d.toLocaleDateString("sv-SE") // YYYY-MM-DD за локальним часом

function shiftDay(day: string, delta: number) {
   const d = new Date(`${day}T12:00:00`)
   d.setDate(d.getDate() + delta)
   return toDayString(d)
}

interface DailyScheduleProps {
   area: string
   userId: string | undefined
}

export function DailySchedule({ area, userId }: DailyScheduleProps) {
   const [day, setDay] = useState(() => toDayString(new Date()))
   const { data: schedule, isLoading, isError } = useOperatorDailySchedule(userId)

   const dayControls = (
      <div className="flex items-center gap-1">
         <button
            type="button"
            aria-label="Попередній день"
            className="cursor-pointer rounded-md p-1 text-[#D9D9D9] hover:bg-(--bg-trans-hover-color)"
            onClick={() => setDay(d => shiftDay(d, -1))}
         >
            <ChevronLeftIcon className="size-4 md:size-5" />
         </button>
         <span className="min-w-24 text-center text-sm text-white md:text-base">
            {new Date(`${day}T12:00:00`).toLocaleDateString("uk-UA", { day: "numeric", month: "long" })}
         </span>
         <button
            type="button"
            aria-label="Наступний день"
            className="cursor-pointer rounded-md p-1 text-[#D9D9D9] hover:bg-(--bg-trans-hover-color)"
            onClick={() => setDay(d => shiftDay(d, 1))}
         >
            <ChevronRightIcon className="size-4 md:size-5" />
         </button>
      </div>
   )

   return (
      <Block area={area} title="Розпланування на день" action={dayControls}>
         {isLoading || !userId ? (
            <Placeholder>Завантаження...</Placeholder>
         ) : isError || !schedule ? (
            <Placeholder>Не вдалося завантажити розпланування</Placeholder>
         ) : !schedule.is_working_day ? (
            <Placeholder>Цей день вихідний. Завдань немає</Placeholder>
         ) : (
            <>
               <div className="grid grid-cols-2 gap-2">
                  <div className="rounded-md border border-(--stroke-color) px-3 py-2">
                     <p className="text-xs text-[#D9D9D9] md:text-sm">Зміна</p>
                     {/* (*) */}
                     <p className="text-sm text-white md:text-base">
                        {schedule.shift.start_at} – {schedule.shift.end_at}
                     </p>
                  </div>
                  <div className="rounded-md border border-(--stroke-color) px-3 py-2">
                     <p className="text-xs text-[#D9D9D9] md:text-sm">Всього до виконання</p>
                     <p className="text-sm text-white md:text-base">{schedule.total_scheduled_quantity} шт.</p>
                  </div>
               </div>

               <div className="flex min-h-0 flex-1 flex-col gap-2 overflow-y-auto">
                  {schedule.items.length === 0 && <Placeholder>На цей день завдань немає</Placeholder>}
                  {schedule.items.map((item, index) => (
                     <div
                        key={index}
                        className="flex items-center gap-3 rounded-md border border-(--stroke-color) bg-(--bg-trans-color) px-3 py-2"
                     >
                        <span className="w-5 shrink-0 text-center text-sm text-[#D9D9D9]">{index + 1}</span>
                        {/* (*) */}
                        <span className="flex-1 truncate text-sm text-white md:text-base">
                           Замовлення №{item.order_id}
                        </span>
                        <span className="shrink-0 text-sm text-white md:text-base">{item.quantity}1 шт.</span>
                     </div>
                  ))}

                  {schedule.skipped.length > 0 && (
                     <div className="mt-2 flex flex-col gap-2">
                        <p className="text-sm text-yellow-400">Не вмістилось у зміну</p>
                        {schedule.skipped.map((s, index) => (
                           <div
                              key={index}
                              className="flex items-center justify-between gap-3 rounded-md border border-dashed border-(--stroke-color) px-3 py-2 text-sm text-[#D9D9D9] md:text-base"
                           >
                              {/* (*) */}
                              <span className="truncate">Замовлення №{s.order_id}</span>
                              <span className="truncate text-right">{s.reason}</span>
                           </div>
                        ))}
                     </div>
                  )}
               </div>
            </>
         )}
      </Block>
   )
}
