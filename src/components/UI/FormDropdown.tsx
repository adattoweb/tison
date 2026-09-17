// components/UI/FormDropdown.tsx
import { Controller, type Control, type FieldPath, type FieldValues } from "react-hook-form"
import clsx from "clsx"
import Dropdown from "@/components/UI/Dropdown"

interface Option {
   value: number
   label: string
}

interface FormDropdownProps<T extends FieldValues> {
   control: Control<T>
   name: FieldPath<T>
   label: string
   placeholder: string
   options: Option[]
}

export function FormDropdown<T extends FieldValues>({
   control,
   name,
   label,
   placeholder,
   options,
}: FormDropdownProps<T>) {
   return (
      <Controller
         control={control}
         name={name}
         render={({ field, fieldState }) => {
            const selected = options.find(option => option.value === field.value)

            return (
               <div className="flex flex-col gap-1.5 w-full">
                  <p className="text-base font-medium">{label}</p>
                  <Dropdown className="w-full">
                     <Dropdown.Button className={clsx("w-full", fieldState.error && "border-red-400!")}>
                        <span>{selected ? selected.label : placeholder}</span>
                        <Dropdown.Chevron />
                     </Dropdown.Button>
                     <Dropdown.Content className="w-full">
                        {options.map(option => (
                           <Dropdown.Item key={option.value} onClick={() => field.onChange(option.value)}>
                              {option.label}
                           </Dropdown.Item>
                        ))}
                     </Dropdown.Content>
                  </Dropdown>
                  {fieldState.error && <p className="text-red-400 text-sm">{fieldState.error.message}</p>}
               </div>
            )
         }}
      />
   )
}
