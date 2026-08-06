import { useRef, useState } from "react"
import { PlusIcon } from "lucide-react"
import defectImg from "@/assets/images/defect.png"
import { STATUS } from "@/constants/status"
import { titleClassName } from "@/utils/classNames"
import type { Defect } from "../defects"

interface InfoBlockProps {
   defect: Defect
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

const DEFAULT_IMAGES = [
   defectImg,
   "https://picsum.photos/seed/defect1/600/400",
   "https://picsum.photos/seed/defect2/600/400",
   "https://picsum.photos/seed/defect3/600/400",
   "https://picsum.photos/seed/defect4/600/400",
]

export function Info({ defect }: InfoBlockProps) {
   const [images, setImages] = useState<string[]>(DEFAULT_IMAGES)
   const [activeIndex, setActiveIndex] = useState(0)
   const fileInputRef = useRef<HTMLInputElement>(null)

   const handleAddClick = () => {
      fileInputRef.current?.click()
   }

   const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0]
      if (!file) return

      const url = URL.createObjectURL(file)
      setImages(prev => {
         const next = [...prev, url]
         setActiveIndex(next.length - 1)
         return next
      })

      e.target.value = ""
   }

   return (
      <div
         className="flex flex-col flex-1 ibm-plex-sans bg-(--bg-trans-color) border border-(--stroke-color) rounded-xl py-(--components-py) px-(--components-py) gap-2"
         style={{ gridArea: "info" }}
      >
         <div
            className="flex-1 rounded-lg aspect-video bg-center bg-cover bg-no-repeat"
            style={{ backgroundImage: `url(${images[activeIndex]})` }}
         ></div>

         <div className="flex items-center gap-2 overflow-x-auto pb-1">
            {images.map((src, index) => (
               <button
                  key={src + index}
                  type="button"
                  onClick={() => setActiveIndex(index)}
                  className={`shrink-0 w-16 h-16 rounded-lg overflow-hidden bg-center bg-cover bg-no-repeat border-2 transition-colors ${
                     index === activeIndex ? "border-(--accent-color,#f2a65a)" : "border-(--stroke-color)"
                  }`}
                  style={{ backgroundImage: `url(${src})` }}
                  aria-label={`Фото дефекту ${index + 1}`}
               />
            ))}

            <button
               type="button"
               onClick={handleAddClick}
               className="shrink-0 w-16 h-16 rounded-lg border border-(--stroke-color) bg-(--bg-trans-color) flex items-center justify-center text-(--second-color) hover:text-white transition-colors"
               aria-label="Додати фото"
            >
               <PlusIcon className="w-5 h-5" />
            </button>

            <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
         </div>

         <h2 className={titleClassName}>Опис дефекту</h2>
         <p className="text-(--second-color)">
            Після прошивки плата не відповідає. Мікроконтролер не виходить на зв’язок.
         </p>

         <h2 className={titleClassName}>Деталі про дефект</h2>
         <ul className="flex flex-col gap-1">
            <ListItem label="Серійний номер" value={defect.code} />
            <ListItem label="Тип дефекту" value={defect.defectType} />
            <ListItem label="Статус" value={STATUS[defect.status].label} />
            <ListItem label="Дільниця" value={defect.department} />
            <ListItem label="Деталі" value={defect.defectDetail} />
            <ListItem label="Чи критична" value={defect.isCritical ? "Так" : "Ні"} />
            <ListItem label="Дата обнаруження" value={defect.detectedTime} />
            <ListItem label="Відповідальний" value={defect.responsibleName} />
         </ul>
      </div>
   )
}
