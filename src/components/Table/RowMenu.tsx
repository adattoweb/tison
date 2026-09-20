import { useEffect, useState } from "react"
import { Ellipsis, type LucideIcon } from "lucide-react"
import clsx from "clsx"
import Dropdown from "@/components/UI/Dropdown"

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
 * Меню дій у рядку таблиці на базі Dropdown.
 * Список рендериться в порталі, тому його не обрізає overflow таблиці.
 * preventDefault + stopPropagation потрібні, щоб клік не запускав навігацію Table.Row:
 * React-події з порталу спливають по React-дереву, тобто аж до посилання рядка.
 */
export function RowMenu({ actions, className }: RowMenuProps) {
   const [open, setOpen] = useState(false)

   // Dropdown сам не закривається по Escape, додаємо це через керований режим
   useEffect(() => {
      if (!open) return
      const onKeyDown = (event: KeyboardEvent) => {
         if (event.key === "Escape") setOpen(false)
      }
      document.addEventListener("keydown", onKeyDown)
      return () => document.removeEventListener("keydown", onKeyDown)
   }, [open])

   return (
      <Dropdown open={open} onOpenChange={setOpen} className={clsx("flex items-center justify-center", className)}>
         <Dropdown.Button
            aria-haspopup="menu"
            aria-expanded={open}
            aria-label="Дії"
            onClick={event => {
               event.preventDefault()
               event.stopPropagation()
            }}
            className="border-0! bg-transparent! p-1.5! text-(--second-color) transition-colors hover:bg-(--bg-trans-color)! hover:text-white focus-visible:outline focus-visible:outline-(--stroke-active-color)"
         >
            <Ellipsis size={18} className="rotate-90" />
         </Dropdown.Button>

         <Dropdown.Content
            role="menu"
            onClick={event => {
               event.preventDefault()
               event.stopPropagation()
            }}
            className="w-max! min-w-48 overflow-y-auto! py-1"
         >
            {actions.map(action => (
               <Dropdown.Item
                  key={action.label}
                  role="menuitem"
                  disabled={action.disabled}
                  onClick={event => {
                     event.preventDefault()
                     event.stopPropagation()
                     action.onClick()
                  }}
                  className={clsx(
                     "flex items-center gap-2 text-sm md:text-sm disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-transparent",
                     action.danger && "text-[#E06767]! hover:bg-[#E06767]/10!",
                  )}
               >
                  {action.Icon && <action.Icon size={16} strokeWidth={1.5} />}
                  {action.label}
               </Dropdown.Item>
            ))}
         </Dropdown.Content>
      </Dropdown>
   )
}
