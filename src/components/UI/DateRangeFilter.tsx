import "react-day-picker/style.css"

import { useState } from "react"
import { DayPicker, type DateRange } from "@daypicker/react"
import clsx from "clsx"
import { CalendarIcon } from "lucide-react"
import Dropdown from "@/components/UI/Dropdown"

interface DateRangeFilterProps {
   label: string
   value: DateRange | undefined
   onChange: (range: DateRange | undefined) => void
}

const formatDay = (date: Date) => date.toLocaleDateString("uk-UA")

function formatRange(range: DateRange | undefined): string | null {
   if (!range?.from) return null
   if (!range.to || range.to.getTime() === range.from.getTime()) return formatDay(range.from)
   return `${formatDay(range.from)} — ${formatDay(range.to)}`
}

export function DateRangeFilter({ label, value, onChange }: DateRangeFilterProps) {
   const [open, setOpen] = useState(false)
   const text = formatRange(value)

   return (
      <Dropdown open={open} onOpenChange={setOpen}>
         <Dropdown.Button>
            <span className="flex items-center gap-2 min-w-0">
               <CalendarIcon className="size-4 md:size-5 shrink-0 text-(--second-color)" strokeWidth={2} />
               <span className={clsx("text-base font-normal text-white whitespace-nowrap", !text && "opacity-60")}>
                  {text ? `${label}: ${text}` : label}
               </span>
            </span>
            <Dropdown.Chevron />
         </Dropdown.Button>
         <Dropdown.Content className="w-auto! max-h-none! px-4 py-2">
            <DayPicker
               mode="range"
               className="rdp-custom"
               selected={value}
               defaultMonth={value?.from}
               onSelect={range => {
                  onChange(range)
                  // закриваємо, коли обрано обидві дати
                  if (range?.from && range?.to) setOpen(false)
               }}
            />
            <div className="flex items-center justify-between gap-4 pt-1 pb-1 text-sm text-(--second-color)">
               <span>{text ?? "Оберіть діапазон"}</span>
               <button
                  type="button"
                  disabled={!value}
                  onClick={() => {
                     onChange(undefined)
                     setOpen(false)
                  }}
                  className="cursor-pointer hover:text-white transition-colors disabled:cursor-default disabled:opacity-40 disabled:hover:text-(--second-color)"
               >
                  Очистити
               </button>
            </div>
         </Dropdown.Content>
      </Dropdown>
   )
}
