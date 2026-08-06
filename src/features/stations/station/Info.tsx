import { titleClassName } from "@/utils/classNames"
import type { Station } from "../stations"

interface ListItemProps {
   label: string
   value: string | number | null
}

function ListItem({ label, value }: ListItemProps) {
   return (
      <li className="flex justify-between">
         <p className="text-(--second-color) text-base">{label}</p>
         <p className="text-white font-medium text-base text-right">{value ?? "—"}</p>
      </li>
   )
}

interface InfoProps {
   station: Station
}

export function Info({ station }: InfoProps) {
   return (
      <div
         className="flex flex-col ibm-plex-sans bg-(--bg-trans-color) border border-(--stroke-color) rounded-xl py-(--components-py) px-(--components-py) gap-2"
         style={{ gridArea: "info" }}
      >
         <h2 className={`${titleClassName}`}>Інформація про станцію</h2>
         <ul className="flex flex-col gap-1">
            <ListItem label="Серійний номер" value={station.code} />
            <ListItem label="Завантаження" value={station.load} />
            <ListItem label="Тип станції" value="Паяльна станція" />
            <ListItem label="Статус" value="Активна" />
            <ListItem label="Графік роботи" value="08:00 - 20:00" />
            <ListItem label="Ефективність" value="95.2%" />
            <ListItem label="Відповідальний" value="Іваненко Сергій" />
         </ul>
      </div>
   )
}
