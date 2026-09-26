import type { WithClassName } from "@/types/common"
import clsx from "clsx"
import { UserIcon, type LucideIcon } from "lucide-react"
import { useEffect, useRef, useState } from "react"

interface AvatarProps extends WithClassName {
   value?: string | null
   onChange?: (file: File | null) => void
   FallbackIcon?: LucideIcon
   disabled?: boolean
}

export function Avatar({ className, value, onChange, FallbackIcon = UserIcon, disabled = false }: AvatarProps) {
   const inputRef = useRef<HTMLInputElement>(null)
   const [localPreview, setLocalPreview] = useState<string | null>(null)

   useEffect(() => {
      setLocalPreview(prev => {
         if (prev) URL.revokeObjectURL(prev)
         return null
      })
   }, [value])

   useEffect(() => {
      return () => {
         if (localPreview) URL.revokeObjectURL(localPreview)
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, [])

   const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0] ?? null

      if (!file) {
         setLocalPreview(prev => {
            if (prev) URL.revokeObjectURL(prev)
            return null
         })
         onChange?.(null)
         return
      }

      const url = URL.createObjectURL(file)
      setLocalPreview(prev => {
         if (prev) URL.revokeObjectURL(prev)
         return url
      })
      onChange?.(file)
   }

   const displaySrc = localPreview ?? value ?? null

   return (
      <div
         className={clsx(
            className,
            "relative min-w-full aspect-square rounded-2xl bg-(--bg-trans-color) border border-(--stroke-color) flex items-center justify-center overflow-hidden transition-colors",
            disabled ? "cursor-default opacity-60" : "cursor-pointer hover:border-(--stroke-active-color)",
         )}
         onClick={() => !disabled && inputRef.current?.click()}
      >
         {displaySrc ? (
            <img src={displaySrc} alt="Avatar" className="w-full h-full object-cover" />
         ) : (
            <FallbackIcon className="w-[33%] h-[33%] text-(--second-color)" strokeWidth={2} />
         )}

         <input
            ref={inputRef}
            type="file"
            accept="image/*"
            className="hidden"
            disabled={disabled}
            onChange={handleFileChange}
         />
      </div>
   )
}
