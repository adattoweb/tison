import type { StationListRead } from "@/api/types/station"
import { STATUS } from "@/constants/status"
import { useProfile } from "@/hooks/api/profile/useProfile"
import { titleClassName } from "@/utils/classNames"

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
   station: StationListRead
}

export function Info({ station }: InfoProps) {
   const { data: responsible } = useProfile(station.responsible_id ?? undefined)
   return (
      <div
         className="flex flex-col ibm-plex-sans bg-(--bg-trans-color) border border-(--stroke-color) rounded-xl py-(--components-py) px-(--components-py) gap-2"
         style={{ gridArea: "info" }}
      >
         <h2 className={`${titleClassName}`}>Інформація про станцію</h2>
         <ul className="flex flex-col gap-1 justify-between flex-1">
            <ListItem label="Серійний номер" value={station.code} />
            {/* <ListItem label="Завантаження" value={station.load} /> */}
            <ListItem label="Відділ" value={station.department.name} />
            <ListItem label="Статус" value={STATUS[station.status].label} />
            <ListItem label="Графік роботи" value={`${station.start_at} - ${station.end_at}`} />
            <ListItem
               label="Відповідальний"
               value={
                  responsible === null || responsible === undefined
                     ? "Немає"
                     : `${responsible?.first_name} ${responsible?.last_name}`
               }
            />
         </ul>
      </div>
   )
}
