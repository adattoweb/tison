import { Link } from "react-router"
import type { OperationListRead } from "@/api/types/operation"
import { titleClassName } from "@/utils/classNames"
import { formatDuration, formatDateTime } from "@/utils/time"

interface ListItemProps {
   label: string
   value: string | null | undefined
   to?: string
}

function ListItem({ label, value, to }: ListItemProps) {
   return (
      <li className="flex justify-between gap-4">
         <p className="text-(--second-color) text-base">{label}</p>
         {to && value ? (
            <Link to={to} className="text-(--info-color) underline font-medium text-base text-right">
               {value}
            </Link>
         ) : (
            <p className="text-white font-medium text-base text-right">{value ?? "—"}</p>
         )}
      </li>
   )
}

interface DefectOperationProps {
   operation?: OperationListRead
}

export function DefectOperation({ operation }: DefectOperationProps) {
   return (
      <div
         className="flex flex-col flex-1 ibm-plex-sans bg-(--bg-trans-color) border border-(--stroke-color) rounded-xl py-(--components-py) px-(--components-py) gap-2"
         style={{ gridArea: "operation" }}
      >
         <h2 className={titleClassName}>Пов'язані дані</h2>
         <ul className="flex flex-col justify-between flex-1 gap-1">
            <ListItem
               label="Код операції"
               value={operation?.code}
               to={operation ? `/operation/${operation.id}` : undefined}
            />
            <ListItem
               label="Серійний номер виробу"
               value={operation?.product?.code}
               to={operation?.product ? `/products/${operation.product.id}` : undefined}
            />
            <ListItem label="Операція" value={operation?.operation_type?.name} />
            <ListItem label="Фактичний час" value={operation ? formatDuration(operation.duration) : null} />
            <ListItem label="Початок" value={formatDateTime(operation?.start_at)} />
            <ListItem label="Завершення" value={formatDateTime(operation?.end_at)} />
         </ul>
      </div>
   )
}
