import productImg from "@/assets/images/product.jpg"
import type { ProductListRead } from "@/api/types/product"
import type { ProductModelListRead } from "@/api/types/product_model"
import type { OrderListRead } from "@/api/types/order"
import { STATUS } from "@/constants/status"
import { titleClassName } from "@/utils/classNames"
import { formatDate, formatDateTime } from "@/utils/time"

interface InfoProps {
   product: ProductListRead
   model?: ProductModelListRead
   order?: OrderListRead
}

interface ListItemProps {
   label: string
   value: string | null | undefined
}

function ListItem({ label, value }: ListItemProps) {
   return (
      <li className="flex justify-between gap-4">
         <p className="text-(--second-color) text-base">{label}</p>
         <p className="text-white font-medium text-base text-right">{value ?? "—"}</p>
      </li>
   )
}

export function Info({ product, model, order }: InfoProps) {
   const image = model?.images?.[0] ?? productImg

   return (
      <div
         className="flex flex-col flex-1 ibm-plex-sans bg-(--bg-trans-color) border border-(--stroke-color) rounded-xl py-(--components-py) px-(--components-py) gap-2"
         style={{ gridArea: "info" }}
      >
         <div
            className="flex-1 rounded-lg aspect-video bg-center bg-cover bg-no-repeat"
            style={{ backgroundImage: `url("${productImg}")` }}
         />
         <h2 className={titleClassName}>Інформація про виріб</h2>
         <ul className="flex flex-col gap-1">
            <ListItem label="Серійний номер" value={product.code} />
            <ListItem label="Модель" value={model?.title} />
            <ListItem label="Тип виробу" value={model?.type} />
            <ListItem label="Статус" value={STATUS[product.status].label} />
            <ListItem label="Замовлення" value={product.order_id ? `#${product.order_id}` : "Без замовлення"} />
            <ListItem label="Батьківський виріб" value={product.parent_id ? `#${product.parent_id}` : null} />
            <ListItem label="Крок" value={`${product.current_step ?? 0} з ${product.steps}`} />
            <ListItem label="Прогрес" value={`${Math.round(product.progress)}%`} />
            <ListItem label="Початок виготовлення" value={formatDateTime(product.start_at)} />
            <ListItem label="Планове завершення замовлення" value={formatDate(order?.planned_end_at)} />
            <ListItem label="Фактичне завершення" value={formatDateTime(product.end_at)} />
         </ul>
      </div>
   )
}
