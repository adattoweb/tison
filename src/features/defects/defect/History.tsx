import { avatarUrl } from "@/constants/global"
import { titleClassName } from "@/utils/classNames"
import { ClockIcon } from "lucide-react"

function HistoryItem() {
   return (
      <div className="flex flex-1 border-b last:border-b-0 border-(--stroke-color) items-center gap-4 py-4 h-26 truncate">
         <ClockIcon />
         <div className="flex h-full flex-col">
            <p className="text-white text-base font-medium">Пайка компонентів</p>
            <p className="text-(--second-color) text-sm">2026.06.10 15:20</p>
            <p className="mt-auto text-(--second-color) text-sm">Зробив пайку, наче все працює.</p>
         </div>
         <div className="flex items-center gap-2 ml-auto">
            <img src={avatarUrl} className="size-9 rounded-full" />
            <div className="flex flex-col">
               <p className="text-base text-white">Іваненко Тарас</p>
               <p className="text-(--second-color) text-base row-span-1 grid-cols-1">Оператор</p>
            </div>
         </div>
      </div>
   )
}

export function History() {
   return (
      <div
         className="flex flex-col ibm-plex-sans bg-(--bg-trans-color) border border-(--stroke-color) rounded-xl py-(--components-py) px-(--components-px) gap-2"
         style={{ gridArea: "history" }}
      >
         <h2 className={titleClassName}>Історія</h2>
         <ul className="flex flex-col flex-1">
            <HistoryItem />
            <HistoryItem />
            <HistoryItem />
            <HistoryItem />
            <HistoryItem />
            <HistoryItem />
            <HistoryItem />
         </ul>
      </div>
   )
}
