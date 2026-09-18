import { useEffect, useRef, useState } from "react"
import { Ellipsis, type LucideIcon } from "lucide-react"

export interface RowMenuAction {
   label: string
   Icon?: LucideIcon
   onClick: () => void
   /** червоний варіант — для деструктивних дій */
   danger?: boolean
   disabled?: boolean
}

interface RowMenuProps {
   actions: RowMenuAction[]
   className?: string
}

/**
 * Меню дій у рядку таблиці. Кнопка з іконкою Ellipsis відкриває випадний список.
 * stopPropagation + preventDefault — щоб клік не тягнув за собою навігацію Table.Row.
 */
export function RowMenu({ actions, className = "" }: RowMenuProps) {
   const [isOpen, setIsOpen] = useState(false)
   const ref = useRef<HTMLDivElement>(null)

   useEffect(() => {
      if (!isOpen) return

      const onPointerDown = (event: MouseEvent) => {
         if (ref.current && !ref.current.contains(event.target as Node)) setIsOpen(false)
      }
      const onKeyDown = (event: KeyboardEvent) => {
         if (event.key === "Escape") setIsOpen(false)
      }

      document.addEventListener("mousedown", onPointerDown)
      document.addEventListener("keydown", onKeyDown)
      return () => {
         document.removeEventListener("mousedown", onPointerDown)
         document.removeEventListener("keydown", onKeyDown)
      }
   }, [isOpen])

   return (
      <div ref={ref} className={`relative flex items-center justify-center ${className}`}>
         <button
            type="button"
            aria-haspopup="menu"
            aria-expanded={isOpen}
            aria-label="Дії"
            onClick={event => {
               event.preventDefault()
               event.stopPropagation()
               setIsOpen(prev => !prev)
            }}
            className="rounded-md p-1.5 text-(--second-color) transition-colors hover:bg-(--bg-trans-color) hover:text-white focus-visible:outline focus-visible:outline-(--stroke-active-color)"
         >
            <Ellipsis size={18} />
         </button>

         {isOpen && (
            <div
               role="menu"
               className="absolute right-0 top-full z-30 mt-1 min-w-48 overflow-hidden rounded-md border border-(--stroke-color) bg-(--bg-color) py-1 shadow-lg"
            >
               {actions.map(action => (
                  <button
                     key={action.label}
                     type="button"
                     role="menuitem"
                     disabled={action.disabled}
                     onClick={event => {
                        event.preventDefault()
                        event.stopPropagation()
                        setIsOpen(false)
                        action.onClick()
                     }}
                     className={`flex w-full items-center gap-2 px-3 py-2 text-left text-sm transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${
                        action.danger
                           ? "text-[#E06767] hover:bg-[#E06767]/10"
                           : "text-white hover:bg-(--bg-trans-color)"
                     }`}
                  >
                     {action.Icon && <action.Icon size={16} strokeWidth={1.5} />}
                     {action.label}
                  </button>
               ))}
            </div>
         )}
      </div>
   )
}
