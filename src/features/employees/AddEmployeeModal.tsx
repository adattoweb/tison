import Modal from "@/components/Modal/Modal"
import { Avatar } from "@/components/UI/Avatar"
import Button from "@/components/UI/Button"
import { Input } from "@/components/UI/Input"
import { Toggle } from "@/components/UI/Toggle"
import { AtSign, HandCoins, Phone, Send, UserIcon } from "lucide-react"
import { useState } from "react"

interface ModalProps {
   isOpen: boolean
   setIsOpen: React.Dispatch<React.SetStateAction<boolean>>
}

export function AddEmployeeModal({ isOpen, setIsOpen }: ModalProps) {
   const onClose = () => setIsOpen(false)
   const [isChecked, setIsChecked] = useState(true)
   return (
      <Modal isOpen={isOpen} onClose={onClose}>
         <Modal.Header>Створення працівника</Modal.Header>
         <Modal.Content>
            <div className="flex flex-col xs:flex-row gap-4">
               <div className="flex flex-col gap-1.5 w-full xs:w-40">
                  <Modal.Label>Аватар</Modal.Label>
                  <div className="mx-auto xs:mx-0 w-40">
                     <Avatar />
                     <p className="text-(--second-color) text-center mt-1.5">Натисніть, щоб завантажити</p>
                  </div>
               </div>
               <div className="flex flex-col w-full gap-4">
                  <div className="flex flex-col sm:flex-row w-full gap-2">
                     <Input label="Ім'я" Icon={UserIcon} placeholder="Ім'я" />
                     <Input label="Прізвище" Icon={UserIcon} placeholder="Прізвище" />
                     <Input label="По батькові" Icon={UserIcon} placeholder="По батькові" />
                  </div>
                  <Input label="Електронна пошта" Icon={AtSign} placeholder="@example@mail.com" />
                  <Input label="Телеграм" Icon={Send} placeholder="@username" />
                  <Input label="Телефон" Icon={Phone} placeholder="+380 XX XXX XX XX" />
                  <Input label="Заробітна плата" Icon={HandCoins} placeholder="0.00" />
                  <Toggle label="Активний" checked={isChecked} onChange={setIsChecked} />
               </div>
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
