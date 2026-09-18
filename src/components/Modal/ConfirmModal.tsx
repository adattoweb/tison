import Modal from "@/components/Modal/Modal"
import Button from "@/components/UI/Button"

interface ConfirmModalProps {
   isOpen: boolean
   onClose: () => void
   onConfirm: () => void
   title: string
   description?: string
   confirmLabel?: string
   cancelLabel?: string
}

export function ConfirmModal({
   isOpen,
   onClose,
   onConfirm,
   title,
   description,
   confirmLabel = "Так",
   cancelLabel = "Ні",
}: ConfirmModalProps) {
   const handleConfirm = () => {
      onConfirm()
      onClose()
   }

   return (
      <Modal isOpen={isOpen} onClose={onClose} className="md:w-100! xl:w-125! 2xl:w-150!">
         <Modal.Header>{title}</Modal.Header>
         {description && (
            <Modal.Content className="py-6!">
               <Modal.Label>{description}</Modal.Label>
            </Modal.Content>
         )}
         <footer className="flex justify-end gap-4">
            <Button type="transparent" onClick={onClose}>
               <Button.Paragraph>{cancelLabel}</Button.Paragraph>
            </Button>
            <Button type="accentFilled" onClick={handleConfirm}>
               <Button.Paragraph>{confirmLabel}</Button.Paragraph>
            </Button>
         </footer>
      </Modal>
   )
}
