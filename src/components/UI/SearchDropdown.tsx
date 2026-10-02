import clsx from "clsx"
import { CheckIcon, SearchIcon, XIcon } from "lucide-react"
import Dropdown from "@/components/UI/Dropdown"

interface SearchDropdownProps<T> {
   items: T[]
   selected: T[]
   getKey: (item: T) => string | number
   getLabel: (item: T) => string
   getSubLabel?: (item: T) => string | null | undefined
   onToggle: (item: T) => void
   search: string
   onSearchChange: (value: string) => void
   placeholder?: string
   searchPlaceholder?: string
   emptyText?: string
   isLoading?: boolean
   hasError?: boolean
   maxVisible?: number
   className?: string
}

export function SearchDropdown<T>({
   items,
   selected,
   getKey,
   getLabel,
   getSubLabel,
   onToggle,
   search,
   onSearchChange,
   placeholder = "Оберіть",
   searchPlaceholder = "Пошук...",
   emptyText = "Нічого не знайдено",
   isLoading = false,
   hasError = false,
   maxVisible = 5,
   className,
}: SearchDropdownProps<T>) {
   const selectedKeys = new Set(selected.map(getKey))
   const visible = items.slice(0, maxVisible)

   return (
      <div className={clsx("flex flex-col gap-2 w-full", className)}>
         <Dropdown className="w-full!">
            <Dropdown.Button className={clsx("w-full h-11", hasError && "border-red-400!")}>
               <span className={clsx("truncate", selected.length === 0 && "opacity-60")}>
                  {selected.length > 0 ? `Обрано: ${selected.length}` : placeholder}
               </span>
               <Dropdown.Chevron />
            </Dropdown.Button>

            <Dropdown.Content>
               <div className="flex items-center gap-2 px-3 md:px-4 py-2 border-b border-(--stroke-color)">
                  <SearchIcon className="size-4 shrink-0 opacity-60" />
                  <input
                     value={search}
                     onChange={e => onSearchChange(e.target.value)}
                     placeholder={searchPlaceholder}
                     className="w-full bg-transparent outline-none text-sm md:text-base text-white placeholder:opacity-60"
                  />
               </div>

               {visible.length === 0 && (
                  <p className="px-3 md:px-4 py-2 opacity-60">{isLoading ? "Завантаження..." : emptyText}</p>
               )}

               {visible.map(item => {
                  const isSelected = selectedKeys.has(getKey(item))
                  const sub = getSubLabel?.(item)
                  return (
                     <button
                        key={getKey(item)}
                        type="button"
                        onClick={() => onToggle(item)}
                        className="flex w-full cursor-pointer items-center justify-between gap-3 px-3 md:px-4 py-1 md:py-2 text-left text-white transition-colors hover:bg-(--bg-trans-hover-color)"
                     >
                        <span className="flex flex-col min-w-0">
                           <span className="truncate">{getLabel(item)}</span>
                           {sub && <span className="truncate text-xs opacity-60">{sub}</span>}
                        </span>
                        {isSelected && <CheckIcon className="size-4 shrink-0" />}
                     </button>
                  )
               })}
            </Dropdown.Content>
         </Dropdown>

         {selected.length > 0 && (
            <div className="flex flex-wrap gap-2">
               {selected.map(item => (
                  <span
                     key={getKey(item)}
                     className="inline-flex items-center gap-1.5 rounded-md border border-(--stroke-color) bg-(--bg-trans-color) px-2 py-1 text-sm"
                  >
                     {getLabel(item)}
                     <button
                        type="button"
                        onClick={() => onToggle(item)}
                        className="cursor-pointer opacity-70 hover:opacity-100"
                     >
                        <XIcon className="size-3.5" />
                     </button>
                  </span>
               ))}
            </div>
         )}
      </div>
   )
}
