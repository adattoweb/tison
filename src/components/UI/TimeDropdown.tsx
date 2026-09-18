import { useEffect } from "react"
import Dropdown from "@/components/UI/Dropdown"
import { useController, type Control, type FieldValues, type Path } from "react-hook-form"

const HOURS = Array.from({ length: 24 }, (_, i) => i)
const MINUTES = Array.from({ length: 12 }, (_, i) => i * 5)

function pad(n: number) {
   return n.toString().padStart(2, "0")
}

function normalize(value: unknown): string | null {
   if (typeof value !== "string") return null
   const match = value.match(/^(\d{1,2}):(\d{1,2})/)
   if (!match) return null
   return `${pad(Number(match[1]))}:${pad(Number(match[2]))}`
}

interface TimeDropdownProps<T extends FieldValues> {
   control: Control<T>
   name: Path<T>
   className?: string
}

export function TimeDropdown<T extends FieldValues>({ control, name, className }: TimeDropdownProps<T>) {
   const {
      field: { value, onChange },
   } = useController({ control, name })

   const normalized = normalize(value)

   useEffect(() => {
      if (typeof value === "string" && value && normalized && value !== normalized) {
         onChange(normalized)
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, [value])

   const [hour, minute] = normalized ? normalized.split(":").map(Number) : [null, null]

   const setHour = (h: number) => onChange(`${pad(h)}:${minute !== null ? pad(minute) : "00"}`)
   const setMinute = (m: number) => onChange(`${hour !== null ? pad(hour) : "00"}:${pad(m)}`)

   return (
      <div className={`flex gap-2 ${className ?? ""}`}>
         <Dropdown className="flex-1">
            <Dropdown.Button className="w-full">
               {hour !== null ? pad(hour) : "Год"}
               <Dropdown.Chevron />
            </Dropdown.Button>
            <Dropdown.Content>
               {HOURS.map(h => (
                  <Dropdown.Item key={h} onClick={() => setHour(h)}>
                     {pad(h)}
                  </Dropdown.Item>
               ))}
            </Dropdown.Content>
         </Dropdown>
         <Dropdown className="flex-1">
            <Dropdown.Button className="w-full">
               {minute !== null ? pad(minute) : "Хв"}
               <Dropdown.Chevron />
            </Dropdown.Button>
            <Dropdown.Content>
               {MINUTES.map(m => (
                  <Dropdown.Item key={m} onClick={() => setMinute(m)}>
                     {pad(m)}
                  </Dropdown.Item>
               ))}
            </Dropdown.Content>
         </Dropdown>
      </div>
   )
}
