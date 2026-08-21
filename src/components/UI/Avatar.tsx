import type { WithClassName } from "@/types/common"
import clsx from "clsx"
import { UserIcon } from "lucide-react"
import { useRef, useState } from "react"

interface ImageProps extends WithClassName {
   onChange?: (file: File | null) => void
}

export function Avatar({ className, onChange }: ImageProps) {
   const inputRef = useRef<HTMLInputElement>(null)
   const [preview, setPreview] = useState<string | null>(null)

   const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0] ?? null

      if (!file) {
         setPreview(null)
         onChange?.(null)
         return
      }

      const url = URL.createObjectURL(file)
      setPreview(prev => {
         if (prev) URL.revokeObjectURL(prev)
         return url
      })
      onChange?.(file)
   }

   return (
      <div
         className={clsx(
            className,
            "relative min-w-full aspect-square rounded-2xl bg-(--bg-trans-color) border border-(--stroke-color) flex items-center justify-center overflow-hidden cursor-pointer hover:border-(--stroke-active-color) transition-colors",
         )}
         onClick={() => inputRef.current?.click()}
      >
         {preview ? (
            <img src={preview} alt="Avatar" className="w-full h-full object-cover" />
         ) : (
            <UserIcon className="w-[33%] h-[33%] text-(--second-color)" strokeWidth={2} />
         )}

         <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
      </div>
   )
}
