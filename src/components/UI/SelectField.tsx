import Modal from "@/components/Modal/Modal"
import Dropdown from "@/components/UI/Dropdown"
import clsx from "clsx"

export interface SelectOption {
   value: number
   label: string
}

interface SelectFieldProps {
   label: string
   value: number | null | undefined
   options: SelectOption[]
   placeholder: string
   /** Якщо задано, у списку з'являється пункт, що скидає значення в null */
   emptyLabel?: string
   emptyListLabel?: string
   disabled?: boolean
   hasError?: boolean
   onChange: (value: number | null) => void
}

export function SelectField({
   label,
   value,
   options,
   placeholder,
   emptyLabel,
   emptyListLabel = "Нічого не знайдено",
   disabled,
   hasError,
   onChange,
}: SelectFieldProps) {
   const selected = options.find(o => o.value === value)

   return (
      <div className="flex flex-col gap-1.5 w-full">
         <Modal.Label>{label}</Modal.Label>
         <Dropdown className="w-full!">
            <Dropdown.Button
               disabled={disabled}
               className={clsx(
                  "w-full h-11 disabled:cursor-not-allowed disabled:opacity-50",
                  hasError && "border-red-400!",
               )}
            >
               <span className={clsx("truncate", !selected && "opacity-60")}>
                  {selected ? selected.label : (emptyLabel ?? placeholder)}
               </span>
               <Dropdown.Chevron />
            </Dropdown.Button>
            <Dropdown.Content className="z-100!">
               {emptyLabel && <Dropdown.Item onClick={() => onChange(null)}>{emptyLabel}</Dropdown.Item>}
               {options.length === 0 && <p className="px-3 md:px-4 py-2 opacity-60">{emptyListLabel}</p>}
               {options.map(option => (
                  <Dropdown.Item key={option.value} onClick={() => onChange(option.value)}>
                     {option.label}
                  </Dropdown.Item>
               ))}
            </Dropdown.Content>
         </Dropdown>
      </div>
   )
}
