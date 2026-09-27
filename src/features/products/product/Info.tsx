import blankPhoto from "@/assets/images/blank_photo.png"
import type { ProductListRead } from "@/api/types/product"
import type { ProductModelListRead } from "@/api/types/product_model"
import type { OrderListRead } from "@/api/types/order"
import { STATUS } from "@/constants/status"
import { titleClassName } from "@/utils/classNames"
import { formatDate, formatDateTime } from "@/utils/time"
import { useState } from "react"
import { ImageGalleryModal } from "@/components/UI/ImageGalleryModal"

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
   const [activeIndex, setActiveIndex] = useState(0)
   const [isGalleryOpen, setIsGalleryOpen] = useState(false)
   const images = model?.images?.length ? model?.images : [blankPhoto]
   const activeImage = images[activeIndex] ?? images[0]

   return (
      <div
         className="flex flex-col flex-1 ibm-plex-sans bg-(--bg-trans-color) border border-(--stroke-color) rounded-xl py-(--components-py) px-(--components-py) gap-2"
         style={{ gridArea: "info" }}
      >
         <div
            className="flex-1 rounded-lg aspect-video bg-center bg-cover bg-no-repeat"
            style={{ backgroundImage: `url("${activeImage}")` }}
            onClick={() => setIsGalleryOpen(true)}
         />
         {images.length > 1 && (
            <div className="flex items-center gap-2 overflow-x-auto pb-1">
               {images.map((src, index) => (
                  <button
                     key={src + index}
                     type="button"
                     onClick={() => setActiveIndex(index)}
                     className={`shrink-0 w-16 h-16 rounded-lg overflow-hidden bg-center bg-cover bg-no-repeat border-2 transition-colors ${
                        index === activeIndex ? "border-(--accent-color,#f2a65a)" : "border-(--stroke-color)"
                     }`}
                     style={{ backgroundImage: `url("${src}")` }}
                     aria-label={`Фото дефекту ${index + 1}`}
                  />
               ))}
            </div>
         )}
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
         <ImageGalleryModal
            images={images}
            initialIndex={activeIndex}
            isOpen={isGalleryOpen}
            onClose={() => setIsGalleryOpen(false)}
            alt={model?.title}
         />
      </div>
   )
}
