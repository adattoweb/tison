import type { DefectRead } from "@/api/types/defect"
import type { OperationListRead } from "@/api/types/operation"
import { titleClassName } from "@/utils/classNames"
import { MonitorCogIcon, UserIcon } from "lucide-react"
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
            <div className="flex flex-col gap-1 min-w-0">
               <p className="font-medium text-white truncate">{name}</p>
               <p className="text-(--second-color) truncate">{code}</p>
            </div>
         </div>
      </li>
   )
}

const shortId = (id: string) => `ID ${id.slice(0, 8)}`

interface DefectResponsibleProps {
   defect: DefectRead
   operation?: OperationListRead
}

export function DefectResponsible({ defect, operation }: DefectResponsibleProps) {
   return (
      <div
         className="flex flex-col flex-1 ibm-plex-sans bg-(--bg-trans-color) border border-(--stroke-color) rounded-xl py-(--components-py) px-(--components-py) gap-2"
         style={{ gridArea: "responsible" }}
      >
         <h2 className={titleClassName}>Відповідальні</h2>
         <ul className="flex flex-col gap-2 mt-2 flex-1">
            <ListItem
               description="Виявив дефект"
               component={<UserIcon className="stroke-(--second-color) size-8" />}
               name="Оператор"
               code={shortId(defect.operator_id)}
            />
            <ListItem
               description="Виконавець операції"
               component={<UserIcon className="stroke-(--second-color) size-8" />}
               name={operation?.operator_id ? "Оператор" : "Не призначено"}
               code={operation?.operator_id ? shortId(operation.operator_id) : "—"}
            />
            <ListItem
               description="Робоча станція"
               component={<MonitorCogIcon className="stroke-(--second-color) size-8" />}
               name={operation?.station?.code ?? "Не призначено"}
               code={operation?.operation_type?.name ?? "—"}
            />
         </ul>
      </div>
   )
}
