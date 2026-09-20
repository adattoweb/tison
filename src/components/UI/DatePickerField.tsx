import "react-day-picker/style.css"

import Modal from "@/components/Modal/Modal"
import Dropdown from "@/components/UI/Dropdown"
import { DayPicker } from "@daypicker/react"
import clsx from "clsx"
import { CalendarIcon } from "lucide-react"
import { useState } from "react"

interface DatePickerFieldProps {
   label: string
   value: string // ISO-рядок або ""
   onChange: (date: Date) => void
   minDate?: Date
   hasError: boolean
}

export function DatePickerField({ label, value, onChange, minDate, hasError }: DatePickerFieldProps) {
   const [open, setOpen] = useState(false)
   const selected = value ? new Date(value) : undefined

   return (
      <div className="flex flex-col gap-1.5 w-full">
         <Modal.Label>{label}</Modal.Label>
         <Dropdown className="w-full!" open={open} onOpenChange={setOpen}>
            <Dropdown.Button className={clsx("w-full h-11", hasError && "border-red-400!")}>
               <span className="flex items-center gap-2 min-w-0">
                  <CalendarIcon className="size-5 stroke-white shrink-0" strokeWidth={2} />
                  <span className={clsx("truncate", !selected && "opacity-60")}>
                     {selected ? selected.toLocaleDateString("uk-UA") : "Оберіть день"}
                  </span>
               </span>
               <Dropdown.Chevron />
            </Dropdown.Button>
            <Dropdown.Content className="w-auto! px-4 py-2">
               <DayPicker
                  mode="single"
                  className="rdp-custom"
                  startMonth={minDate}
                  defaultMonth={selected ?? minDate}
                  selected={selected}
                  onSelect={date => {
                     if (!date) return
                     onChange(date)
                     setOpen(false)
                  }}
                  disabled={minDate ? { before: minDate } : undefined}
               />
            </Dropdown.Content>
         </Dropdown>
      </div>
   )
}
