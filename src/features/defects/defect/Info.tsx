import { useState } from "react"
import defectImg from "@/assets/images/defect.png"
import type { DefectRead } from "@/api/types/defect"
import type { OperationListRead } from "@/api/types/operation"
import { DEFECT_STATUS } from "@/constants/status"
import { titleClassName } from "@/utils/classNames"
import { formatDateTime } from "@/utils/time"

interface InfoBlockProps {
   defect: DefectRead
   operation?: OperationListRead
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

export function Info({ defect, operation }: InfoBlockProps) {
   const [activeIndex, setActiveIndex] = useState(0)

   const images = defect.images?.length ? defect.images : [defectImg]
   // після оновлення даних індекс може вийти за межі масиву
   const activeImage = images[activeIndex] ?? images[0]

   return (
      <div
         className="flex flex-col flex-1 ibm-plex-sans bg-(--bg-trans-color) border border-(--stroke-color) rounded-xl py-(--components-py) px-(--components-py) gap-2"
         style={{ gridArea: "info" }}
      >
         <div
            className="flex-1 rounded-lg aspect-video bg-center bg-cover bg-no-repeat"
            style={{ backgroundImage: `url("${activeImage}")` }}
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

         <h2 className={titleClassName}>Опис дефекту</h2>
         <p className="text-(--second-color) whitespace-pre-line wrap-break-word">
            {defect.description || "Опису немає"}
         </p>

         <h2 className={titleClassName}>Деталі про дефект</h2>
         <ul className="flex flex-col gap-1">
            <ListItem label="Код дефекту" value={defect.code} />
            <ListItem label="Назва" value={defect.title} />
            <ListItem label="Статус" value={DEFECT_STATUS[defect.status].label} />
            <ListItem label="Операція" value={operation?.operation_type?.name} />
            <ListItem label="Станція" value={operation?.station?.code} />
            <ListItem label="Виріб" value={operation?.product?.code} />
            <ListItem label="Дата виявлення" value={formatDateTime(defect.start_at)} />
            <ListItem label="Дата закриття" value={formatDateTime(defect.end_at)} />
         </ul>
      </div>
   )
}
