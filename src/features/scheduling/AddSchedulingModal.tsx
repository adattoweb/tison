import "react-day-picker/style.css"

import Modal from "@/components/Modal/Modal"
import Button from "@/components/UI/Button"
import { Input } from "@/components/UI/Input"
import { SquareChartGantt } from "lucide-react"
import { useState } from "react"
import Dropdown from "@/components/UI/Dropdown"
import { DayPicker } from "@daypicker/react"

interface ModalProps {
   isOpen: boolean
   setIsOpen: React.Dispatch<React.SetStateAction<boolean>>
}

export function AddSchedulingModal({ isOpen, setIsOpen }: ModalProps) {
   const types = ["Не обрано", "Плата керування V4", "Плата керування V5", "Плата керування V6"]
   const [type, setType] = useState(types[0])
   const onClose = () => setIsOpen(false)

   const [start, setStart] = useState<Date>()
   const [end, setEnd] = useState<Date>()
   return (
      <Modal isOpen={isOpen} onClose={onClose}>
         <Modal.Header>Створення плана</Modal.Header>
         <Modal.Content className="flex flex-col  md:flex-row md:flex-wrap gap-4">
            <div className="flex flex-col gap-1.5 flex-1">
               <Modal.Label>Оберіть тип виробу</Modal.Label>
               <Dropdown className="w-full!">
                  <Dropdown.Button className="w-full">
                     {type}
                     <Dropdown.Chevron />
                  </Dropdown.Button>
                  <Dropdown.Content>
                     {types.map((el, id) => (
                        <Dropdown.Item key={id} onClick={() => setType(el)}>
                           {el}
                        </Dropdown.Item>
                     ))}
                  </Dropdown.Content>
               </Dropdown>
            </div>
            <Input label="План" Icon={SquareChartGantt} placeholder="100" />
            <div className="flex flex-col gap-1.5 flex-1">
               <Modal.Label>Оберіть дату початку виконання</Modal.Label>
               <Dropdown>
                  <Dropdown.Button>{start ? start.toLocaleDateString() : "Оберіть день"}</Dropdown.Button>
                  <Dropdown.Content className="w-auto! px-4 py-2">
                     <DayPicker
                        mode="single"
                        startMonth={new Date()}
                        footer={start ? `Обрано: ${start.toLocaleDateString()}` : "Оберіть день"}
                        selected={start}
                        onSelect={setStart}
                        disabled={{ before: new Date() }}
                     />
                  </Dropdown.Content>
               </Dropdown>
            </div>
            <div className="flex flex-col gap-1.5 flex-1">
               <Modal.Label>Оберіть дату кінця виконання</Modal.Label>
               <Dropdown>
                  <Dropdown.Button>{end ? end.toLocaleDateString() : "Оберіть день"}</Dropdown.Button>
                  <Dropdown.Content className="w-auto! px-4 py-2">
                     <DayPicker
                        mode="single"
                        startMonth={start ?? new Date()}
                        footer={end ? `Обрано: ${end.toLocaleDateString()}` : "Оберіть день"}
                        selected={end}
                        onSelect={setEnd}
                        disabled={{ before: start ?? new Date() }}
                     />
                  </Dropdown.Content>
               </Dropdown>
            </div>
         </Modal.Content>
         <footer className="flex justify-end gap-4">
            <Button type="transparent">
               <Button.Paragraph>Скасувати</Button.Paragraph>
            </Button>
            <Button type="accentFilled">
               <Button.Paragraph>Створити</Button.Paragraph>
            </Button>
         </footer>
      </Modal>
   )
}
