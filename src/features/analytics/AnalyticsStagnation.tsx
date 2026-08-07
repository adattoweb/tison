import { titleClassName } from "@/utils/classNames"

interface ListItemProps {
   reason: string
   time: string
}

function ListItem({ reason, time }: ListItemProps) {
   return (
      <li className="flex justify-between items-center flex-1 py-3 border-b border-(--stroke-color) last:border-b-0">
         <p className="text-(--second-color) truncate pr-4 text-sm md:text-base">{reason}</p>
         <p className="text-(--second-color) text-nowrap text-sm md:text-base">{time}</p>
      </li>
   )
}

export function AnalyticsStagnation() {
   return (
      <div
         className="flex flex-col bg-(--bg-trans-color) border border-(--stroke-color) rounded-xl px-(--components-px) py-(--components-py)"
         style={{ gridArea: "stagnation" }}
      >
         <h2 className={titleClassName}>Причини простою</h2>
         <ul className="flex flex-col flex-1 mt-2">
            <li className="flex justify-between">
               <p className="text-white font-medium truncate pr-4 text-sm md:text-base">Причина</p>
               <p className="text-white font-medium text-nowrap text-sm md:text-base">Час</p>
            </li>
            <ListItem reason="Помилка" time="1 год 32 хв" />
            <ListItem reason="Нестача матеріалів" time="1 год 2 хв" />
            <ListItem reason="Очікування" time="53 хв" />
            <ListItem reason="Налаштування обладнання" time="22 хв" />
         </ul>
      </div>
   )
}
