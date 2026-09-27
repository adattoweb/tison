import { ChevronLeftIcon, ChevronRightIcon, XIcon } from "lucide-react"
import { useEffect, useState } from "react"
import { createPortal } from "react-dom"

interface ImageGalleryModalProps {
   images: string[]
   initialIndex?: number
   isOpen: boolean
   onClose: () => void
   alt?: string
}

export function ImageGalleryModal({ images, initialIndex = 0, isOpen, onClose, alt }: ImageGalleryModalProps) {
   const [currentIndex, setCurrentIndex] = useState(initialIndex)

   // Скидаємо індекс на той, з якого відкрили галерею, щоразу при відкритті
   useEffect(() => {
      if (isOpen) setCurrentIndex(initialIndex)
   }, [isOpen, initialIndex])

   const hasMultiple = images.length > 1

   const goPrev = () => setCurrentIndex(index => (index === 0 ? images.length - 1 : index - 1))
   const goNext = () => setCurrentIndex(index => (index === images.length - 1 ? 0 : index + 1))

   // Керування клавіатурою: Esc закриває, стрілки перемикають
   useEffect(() => {
      if (!isOpen) return

      const handleKeyDown = (event: KeyboardEvent) => {
         if (event.key === "Escape") onClose()
         if (hasMultiple && event.key === "ArrowLeft") goPrev()
         if (hasMultiple && event.key === "ArrowRight") goNext()
      }

      window.addEventListener("keydown", handleKeyDown)
      return () => window.removeEventListener("keydown", handleKeyDown)
   }, [isOpen, hasMultiple, onClose])

   if (!isOpen) return null

   return createPortal(
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4 sm:p-8" onClick={onClose}>
         <button
            type="button"
            aria-label="Закрити"
            onClick={onClose}
            className="absolute top-4 right-4 sm:top-6 sm:right-6 text-white/80 hover:text-white transition-colors p-2 rounded-full hover:bg-white/10"
         >
            <XIcon className="size-6 sm:size-7" strokeWidth={1.5} />
         </button>

         {hasMultiple && (
            <button
               type="button"
               aria-label="Попереднє зображення"
               onClick={event => {
                  event.stopPropagation()
                  goPrev()
               }}
               className="absolute left-2 sm:left-6 top-1/2 -translate-y-1/2 text-white/80 hover:text-white transition-colors p-2 sm:p-3 rounded-full hover:bg-white/10"
            >
               <ChevronLeftIcon className="size-7 sm:size-9" strokeWidth={1.5} />
            </button>
         )}

         <img
            src={images[currentIndex]}
            alt={alt ?? `Зображення ${currentIndex + 1}`}
            className="max-w-[95vw] max-h-[90vh] object-contain rounded-lg select-none"
            onClick={event => event.stopPropagation()}
         />

         {hasMultiple && (
            <button
               type="button"
               aria-label="Наступне зображення"
               onClick={event => {
                  event.stopPropagation()
                  goNext()
               }}
               className="absolute right-2 sm:right-6 top-1/2 -translate-y-1/2 text-white/80 hover:text-white transition-colors p-2 sm:p-3 rounded-full hover:bg-white/10"
            >
               <ChevronRightIcon className="size-7 sm:size-9" strokeWidth={1.5} />
            </button>
         )}

         {hasMultiple && (
            <div className="absolute bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 text-white/80 text-sm select-none">
               {currentIndex + 1} / {images.length}
            </div>
         )}
      </div>,
      document.body,
   )
}
