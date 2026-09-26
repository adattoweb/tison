// src/components/UI/MultiImageUpload.tsx

import { useEffect, useRef } from "react"
import { ImageIcon, PlusIcon, XIcon } from "lucide-react"
import clsx from "clsx"

const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"]
const MAX_SIZE_MB = 10

export interface ImageItem {
   id: string
   /** URL для прев'ю: реальний з сервера (existing) або blob-URL (щойно обраний файл) */
   url: string
   /** Присутній лише для щойно обраних файлів — їх ще треба завантажити на сервер */
   file?: File
}

interface MultiImageUploadProps {
   images: ImageItem[]
   onChange: (images: ImageItem[]) => void
   maxImages?: number
   disabled?: boolean
   error?: string
}

export function MultiImageUpload({ images, onChange, maxImages = 10, disabled = false, error }: MultiImageUploadProps) {
   const inputRef = useRef<HTMLInputElement>(null)

   // прибираємо blob-url лише для локальних файлів при демонтажі (реальні URL з сервера не чіпаємо)
   useEffect(() => {
      return () => {
         images.forEach(img => {
            if (img.file) URL.revokeObjectURL(img.url)
         })
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, [])

   const handleFilesSelected = (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = Array.from(e.target.files ?? [])
      e.target.value = ""

      const remainingSlots = maxImages - images.length
      const accepted = files.filter(f => ALLOWED_TYPES.includes(f.type) && f.size <= MAX_SIZE_MB * 1024 * 1024)
      const toAdd = accepted.slice(0, remainingSlots)

      const rejected = files.length !== toAdd.length

      const newItems: ImageItem[] = toAdd.map(file => ({
         id: crypto.randomUUID(),
         url: URL.createObjectURL(file),
         file,
      }))

      if (newItems.length > 0) onChange([...images, ...newItems])

      if (rejected) {
         console.warn("Деякі файли відхилено: непідтримуваний формат, розмір > 10MB, або перевищено ліміт")
      }
   }

   const handleRemove = (id: string) => {
      const target = images.find(img => img.id === id)
      if (target?.file) URL.revokeObjectURL(target.url)
      onChange(images.filter(img => img.id !== id))
   }

   return (
      <div className="flex flex-col gap-2 w-full">
         <div className="flex items-center justify-between gap-2">
            <p className="text-base font-medium">
               Зображення{" "}
               <span className="text-sm font-normal text-(--second-color)">
                  ({images.length}/{maxImages})
               </span>
            </p>
            <button
               type="button"
               disabled={disabled || images.length >= maxImages}
               onClick={() => inputRef.current?.click()}
               className="flex items-center gap-1 text-sm cursor-pointer text-(--second-color) hover:text-white transition-colors disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:text-(--second-color)"
            >
               <PlusIcon className="size-4" />
               Додати
            </button>
            <input
               ref={inputRef}
               type="file"
               accept={ALLOWED_TYPES.join(",")}
               multiple
               className="hidden"
               onChange={handleFilesSelected}
            />
         </div>

         {images.length === 0 ? (
            <div
               className={clsx(
                  "flex flex-col items-center justify-center gap-2 rounded-md border border-dashed py-6 text-(--second-color) cursor-pointer transition-colors hover:border-(--stroke-active-color)",
                  error ? "border-red-400" : "border-(--stroke-color)",
               )}
               onClick={() => !disabled && inputRef.current?.click()}
            >
               <ImageIcon className="size-6" />
               <p className="text-sm">Немає зображень — натисни, щоб додати</p>
            </div>
         ) : (
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
               {images.map(img => (
                  <div
                     key={img.id}
                     className="group relative aspect-square rounded-md overflow-hidden border border-(--stroke-color)"
                  >
                     <img src={img.url} alt="" className="w-full h-full object-cover" />
                     <button
                        type="button"
                        onClick={() => handleRemove(img.id)}
                        aria-label="Видалити"
                        className="absolute top-1 right-1 flex items-center justify-center size-6 rounded-full bg-black/60 text-white opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer hover:bg-red-500"
                     >
                        <XIcon className="size-3.5" />
                     </button>
                  </div>
               ))}
            </div>
         )}

         {error && <p className="text-sm text-red-400">{error}</p>}
      </div>
   )
}
