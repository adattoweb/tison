import Modal from "@/components/Modal/Modal"
import { Avatar } from "@/components/UI/Avatar"
import Button from "@/components/UI/Button"
import { Input } from "@/components/UI/Input"
import { AtSign, HandCoins, Phone, Send, UserIcon } from "lucide-react"

interface ModalProps {
   isOpen: boolean
   setIsOpen: React.Dispatch<React.SetStateAction<boolean>>
}

export function AddEmployeeModal({ isOpen, setIsOpen }: ModalProps) {
   const onClose = () => setIsOpen(false)
   return (
      <Modal isOpen={isOpen} onClose={onClose}>
         <Modal.Header>Створення нового працівника</Modal.Header>
         <Modal.Content className="">
            <div className="flex gap-4">
               <div className="flex flex-col gap-1.5 w-40">
                  <Modal.Label>Аватар</Modal.Label>
                  <Avatar />
                  <p className="text-(--second-color) text-center">Натисніть, щоб завантажити</p>
               </div>
               <div className="flex flex-col w-full gap-4">
                  <div className="flex w-full gap-2">
                     <Input label="Ім'я" Icon={UserIcon} placeholder="Ім'я" />
                     <Input label="Прізвище" Icon={UserIcon} placeholder="Прізвище" />
                     <Input label="По батькові" Icon={UserIcon} placeholder="По батькові" />
                  </div>
                  <Input label="Email" Icon={AtSign} placeholder="@example@mail.com" />
                  <Input label="Telegram" Icon={Send} placeholder="@username" />
                  <Input label="Phone" Icon={Phone} placeholder="+380 XX XXX XX XX" />
                  <Input label="Salary" Icon={HandCoins} placeholder="0.00" />
               </div>
            </div>
         </Modal.Content>
         <footer className="flex justify-end gap-4">
            <Button type="transparent">
               <Button.Paragraph>Скасувати</Button.Paragraph>
            </Button>
            <Button type="accentFilled">
               <Button.Paragraph>Створити користувача</Button.Paragraph>
            </Button>
         </footer>
      </Modal>
   )
}
