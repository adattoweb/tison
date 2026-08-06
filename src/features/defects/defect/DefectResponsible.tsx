import { avatarUrl } from "@/constants/global"
import { titleClassName } from "@/utils/classNames"
import { MonitorCogIcon, WrenchIcon } from "lucide-react"
import type { ReactNode } from "react"

interface ItemProps {
   description: string
   component: ReactNode
   name: string
   code: string
}

function ListItem({ description, component, name, code }: ItemProps) {
   return (
      <li className="flex flex-1 flex-col bg-(--bg-trans-color) rounded-lg py-2 px-4">
         <p className="text-(--second-color)">{description}</p>
         <div className="flex gap-2 items-center">
            {component}
            <div className="flex flex-col gap-1">
               <p className="font-medium text-white">{name}</p>
               <p className="text-(--second-color)">{code}</p>
            </div>
         </div>
      </li>
   )
}

export function DefectResponsible() {
   return (
      <div
         className="flex flex-col flex-1 ibm-plex-sans bg-(--bg-trans-color) border border-(--stroke-color) rounded-xl py-(--components-py) px-(--components-py) gap-2"
         style={{ gridArea: "responsible" }}
      >
         <h2 className={titleClassName}>Відповідальні</h2>
         <ul className=" flex flex-col gap-2 mt-2 flex-1">
            <ListItem
               description="Виконавець операції"
               component={<img src={avatarUrl} className="size-11 rounded-full" />}
               name="Шевченко Тарас"
               code="EMP-1018"
            />
            <ListItem
               description="Попередня операція"
               component={<img src={avatarUrl} className="size-11 rounded-full" />}
               name="Шевченко Тарас"
               code="EMP-1018"
            />
            <ListItem
               description="Робоча станція"
               component={<MonitorCogIcon className="stroke-(--second-color) size-8" />}
               name="STATION-05"
               code="Станція прошивки"
            />
            <ListItem
               description="Тестування"
               component={<WrenchIcon className="stroke-(--second-color) size-8" />}
               name="Тестування"
               code="Тестувальна зона"
            />
         </ul>
      </div>
   )
}
