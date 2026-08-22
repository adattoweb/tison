import Modal from "@/components/Modal/Modal"
import Button from "@/components/UI/Button"
import Dropdown from "@/components/UI/Dropdown"
import { Toggle } from "@/components/UI/Toggle"
import { useState } from "react"

interface ModalProps {
   isOpen: boolean
   setIsOpen: React.Dispatch<React.SetStateAction<boolean>>
}

export function AddStationModal({ isOpen, setIsOpen }: ModalProps) {
   const employees = ["Немає", "Василь Вишиваний", "Павло Шевченко", "Григорій Поліщук", "Данило Мельник"]
   const types = ["Не обрано", "Паяльна станція", "Виробнича станція"]
   const [selected, setSelected] = useState(employees[0])
   const [type, setType] = useState(types[0])
   const onClose = () => setIsOpen(false)
   const [isChecked, setIsChecked] = useState(true)
   return (
      <Modal isOpen={isOpen} onClose={onClose}>
         <Modal.Header>Створення станції</Modal.Header>
         <Modal.Content className="flex flex-col  md:flex-row md:flex-wrap gap-4">
            <div className="flex flex-col gap-1.5 flex-1">
               <Modal.Label>Оберіть відповідального</Modal.Label>
               <Dropdown className="w-full!">
                  <Dropdown.Button className="w-full">
                     {selected}
                     <Dropdown.Chevron />
                  </Dropdown.Button>
                  <Dropdown.Content>
                     {employees.map((el, id) => (
                        <Dropdown.Item key={id} onClick={() => setSelected(el)}>
                           {el}
                        </Dropdown.Item>
                     ))}
                  </Dropdown.Content>
               </Dropdown>
            </div>
            <div className="flex flex-col gap-1.5 flex-1">
               <Modal.Label>Оберіть тип станції</Modal.Label>
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
            <Toggle label="Активна" checked={isChecked} onChange={setIsChecked} className="min-w-full" />
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
