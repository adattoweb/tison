import productImg from "@/assets/images/product.jpg"
import type { Product } from "../products"
import { STATUS } from "@/constants/status"

interface InfoBlockProps {
   product: Product
}

interface ListItemProps {
   label: string
   value: string | null
}

function ListItem({ label, value }: ListItemProps) {
   return (
      <li className="flex justify-between">
         <p className="text-(--second-color) text-base">{label}</p>
         <p className="text-white font-medium text-base text-right">{value ?? "—"}</p>
      </li>
   )
}

export function Info({ product }: InfoBlockProps) {
   return (
      <div
         className="flex flex-col flex-1 ibm-plex-sans bg-(--bg-trans-color) border border-(--stroke-color) rounded-xl py-(--components-py) px-(--components-py) gap-2"
         style={{ gridArea: "info" }}
      >
         <div
            className="flex-1 rounded-lg aspect-video bg-center bg-cover bg-no-repeat"
            style={{ backgroundImage: `url(${productImg})` }}
         ></div>
         <h2 className="text-white text-xl font-medium">Інформація про виріб</h2>
         <ul className="flex flex-col gap-1">
            <ListItem label="Серійний номер" value={product.code} />
            <ListItem label="Тип виробу" value={product.modelType} />
            <ListItem label="Статус" value={STATUS[product.status].label} />
            <ListItem label="Дільниця" value={product.department} />
            <ListItem label="Дата створення" value={product.createdAt} />
            <ListItem label="Планова дата завершення" value={product.plannedStartDate} />
            <ListItem label="Фактична дата завершення" value={product.actualEndDate} />
            <ListItem label="Відповідальний" value={product.executorName} />
         </ul>
      </div>
   )
}
