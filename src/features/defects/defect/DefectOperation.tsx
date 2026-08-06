import { titleClassName } from "@/utils/classNames"

interface ListItemProps {
   label: string
   value: string | null
   href?: string
}

function ListItem({ label, value, href }: ListItemProps) {
   return (
      <li className="flex justify-between">
         <p className="text-(--second-color) text-base">{label}</p>
         {href ? (
            <a href={href} className="text-(--info-color) underline font-medium text-base text-right">
               {value ?? "—"}
            </a>
         ) : (
            <p className="text-white font-medium text-base text-right">{value ?? "—"}</p>
         )}
      </li>
   )
}

export function DefectOperation() {
   return (
      <div
         className="flex flex-col flex-1 ibm-plex-sans bg-(--bg-trans-color) border border-(--stroke-color) rounded-xl py-(--components-py) px-(--components-py) gap-2"
         style={{ gridArea: "operation" }}
      >
         <h2 className={titleClassName}>Пов'язані дані</h2>
         <ul className="flex flex-col justify-between flex-1">
            <ListItem label="ID операції" value="OP-26-06-10-5" href="/operations/" />
            <ListItem label="Серійний номер виробу" value="OP-26-06-10-5" href="/operations/" />
            <ListItem label="Операція" value="Прошивка" />
            <ListItem label="Плановий час" value="00:05 хв" />
            <ListItem label="Фактичний час" value="00:04 хв" />
            <ListItem label="Початок" value="07.06.2026 13:04" />
            <ListItem label="Завершення" value="07.06.2026 13:08" />
         </ul>
      </div>
   )
}
