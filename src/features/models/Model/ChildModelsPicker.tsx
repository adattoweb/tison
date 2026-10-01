import type { ProductModelListRead } from "@/api/types/product_model"
import Modal from "@/components/Modal/Modal"
import clsx from "clsx"
import { CheckIcon, PlusIcon, XIcon } from "lucide-react"
import { useRef, useState } from "react"

interface ChildModelsPickerProps {
   parts: ProductModelListRead[]
   selected: ProductModelListRead[]
   onChange: (items: ProductModelListRead[]) => void
   search: string
   onSearchChange: (value: string) => void
   isLoading: boolean
   isFetching: boolean
   isError: boolean
   disabled: boolean
}

export function ChildModelsPicker({
   parts,
   selected,
   onChange,
   search,
   onSearchChange,
   isLoading,
   isFetching,
   isError,
   disabled,
}: ChildModelsPickerProps) {
   const [isAdding, setIsAdding] = useState(false)
   const searchInputRef = useRef<HTMLInputElement>(null)

   const selectedIds = new Set(selected.map(p => p.id))

   const toggle = (part: ProductModelListRead) =>
      onChange(selectedIds.has(part.id) ? selected.filter(p => p.id !== part.id) : [...selected, part])

   const openAdding = () => {
      setIsAdding(true)
      // чекаємо, поки input з'явиться в DOM, перш ніж фокусувати
      requestAnimationFrame(() => searchInputRef.current?.focus())
   }

   const closeAdding = () => {
      setIsAdding(false)
      onSearchChange("")
   }

   return (
      <div className="flex flex-col gap-2">
         <div className="flex items-center justify-between gap-2">
            <Modal.Label>Дочірні моделі (деталі){selected.length > 0 && ` — ${selected.length}`}</Modal.Label>
            {!isAdding && (
               <button
                  type="button"
                  disabled={disabled}
                  onClick={openAdding}
                  className="flex items-center gap-1 text-sm cursor-pointer text-(--second-color) hover:text-white transition-colors disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:text-(--second-color)"
               >
                  <PlusIcon className="size-4" />
                  Додати
               </button>
            )}
         </div>

         {selected.length === 0 && !isAdding && <p className="text-sm text-(--second-color)">Деталей не додано</p>}

         {selected.length > 0 && (
            <div className="flex flex-wrap gap-2">
               {selected.map(p => (
                  <span
                     key={p.id}
                     className="inline-flex items-center gap-1 rounded-sm border border-(--stroke-color) bg-(--bg-trans-hover-color) px-2 py-0.5 text-xs md:text-sm"
                  >
                     {p.title}
                     <button
                        type="button"
                        aria-label={`Прибрати ${p.title}`}
                        disabled={disabled}
                        className="cursor-pointer text-[#D9D9D9] hover:text-red-400"
                        onClick={() => toggle(p)}
                     >
                        <XIcon className="size-3.5" />
                     </button>
                  </span>
               ))}
            </div>
         )}

         {isAdding && (
            <div className="flex flex-col gap-2 rounded-md border border-(--stroke-color) bg-(--bg-trans-color) p-2">
               <div className="flex items-center gap-2">
                  <input
                     ref={searchInputRef}
                     type="text"
                     value={search}
                     onChange={e => onSearchChange(e.target.value)}
                     // Enter у пошуку не повинен сабмітити всю форму
                     onKeyDown={e => {
                        if (e.key === "Enter") e.preventDefault()
                        if (e.key === "Escape") closeAdding()
                     }}
                     placeholder="Введіть назву моделі-деталі"
                     disabled={disabled}
                     className="w-full min-w-0 rounded-sm border border-(--stroke-color) bg-transparent px-2 py-1.5 text-sm outline-none"
                  />
                  <button
                     type="button"
                     onClick={closeAdding}
                     aria-label="Закрити пошук"
                     className="shrink-0 cursor-pointer text-(--second-color) hover:text-white"
                  >
                     <XIcon className="size-4" />
                  </button>
               </div>

               <div
                  className={clsx(
                     "flex max-h-44 flex-col gap-1 overflow-y-auto transition-opacity",
                     isFetching && !isLoading && "opacity-60",
                  )}
               >
                  {isLoading && <p className="px-2 py-3 text-sm text-[#D9D9D9]">Завантаження…</p>}
                  {isError && <p className="px-2 py-3 text-sm text-red-400">Не вдалося завантажити деталі</p>}
                  {!isLoading && !isError && parts.length === 0 && (
                     <p className="px-2 py-3 text-sm text-[#D9D9D9]">
                        {search.trim() ? "Нічого не знайдено" : "Немає жодної моделі-деталі"}
                     </p>
                  )}

                  {parts.map(p => {
                     const checked = selectedIds.has(p.id)
                     return (
                        <button
                           key={p.id}
                           type="button"
                           aria-pressed={checked}
                           disabled={disabled}
                           onClick={() => toggle(p)}
                           className={clsx(
                              "flex cursor-pointer items-center justify-between gap-2 rounded-sm px-2 py-1.5 text-left text-sm hover:bg-(--bg-trans-hover-color) disabled:opacity-50",
                              checked && "bg-(--bg-trans-hover-color)",
                           )}
                        >
                           <span className="truncate">{p.title}</span>
                           {checked && <CheckIcon className="size-4 shrink-0 text-green-400" />}
                        </button>
                     )
                  })}
               </div>
            </div>
         )}
      </div>
   )
}
