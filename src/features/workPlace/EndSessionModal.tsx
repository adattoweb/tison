import { useState } from "react"
import { useForm } from "react-hook-form"
import clsx from "clsx"
import { NotebookPenIcon } from "lucide-react"

import Modal from "@/components/Modal/Modal"
import Button from "@/components/UI/Button"
import { Textarea } from "@/components/UI/Textarea"
import { useToast } from "@/components/Toast/useToast"
import { TOAST_DURATION } from "@/constants/app"
import { useEndWorkSession } from "@/hooks/api/workSessions/useEndWorkSession"
import type { SessionStatus } from "@/api/types/workSession"

const RESULT_OPTIONS: { value: SessionStatus; label: string; description: string }[] = [
   { value: "COMPLETED", label: "Завершено", description: "Операцію виконано повністю" },
   { value: "PAUSED", label: "Пауза", description: "Роботу призупинено, можна продовжити пізніше" },
]

interface EndSessionModalProps {
   isOpen: boolean
   onClose: () => void
   sessionId: string
}

export function EndSessionModal({ isOpen, onClose, sessionId }: EndSessionModalProps) {
   const { mutate: doEnd, isPending } = useEndWorkSession()
   const { addToast } = useToast()
   const [result, setResult] = useState<SessionStatus>("COMPLETED")
   const { register, handleSubmit, reset } = useForm<{ note: string }>()

   const handleClose = () => {
      reset()
      setResult("COMPLETED")
      onClose()
   }

   const onSubmit = ({ note }: { note: string }) => {
      doEnd(
         { id: sessionId, payload: { result, note: note.trim() || undefined } },
         {
            onSuccess: () => {
               addToast("Сесію завершено", { duration: TOAST_DURATION, type: "success" })
               handleClose()
            },
            onError: () => addToast("Не вдалося завершити сесію", { duration: TOAST_DURATION, type: "error" }),
         },
      )
   }

   return (
      <Modal isOpen={isOpen} onClose={handleClose}>
         <Modal.Header>Завершення сесії</Modal.Header>
         <form onSubmit={handleSubmit(onSubmit)}>
            <Modal.Content>
               <Modal.Label>Результат сесії</Modal.Label>
               <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                  {RESULT_OPTIONS.map(option => (
                     <button
                        key={option.value}
                        type="button"
                        onClick={() => setResult(option.value)}
                        className={clsx(
                           "flex cursor-pointer flex-col items-start gap-1 rounded-md border px-4 py-3 text-left",
                           result === option.value
                              ? "border-white/60 bg-(--bg-trans-hover-color)"
                              : "border-(--stroke-color) bg-(--bg-trans-color) hover:bg-(--bg-trans-hover-color)",
                        )}
                     >
                        <span className="text-sm font-medium text-white md:text-base">{option.label}</span>
                        <span className="text-xs text-[#D9D9D9] md:text-sm">{option.description}</span>
                     </button>
                  ))}
               </div>

               <Textarea
                  label="Примітка"
                  Icon={NotebookPenIcon}
                  placeholder="Необов'язково"
                  rows={3}
                  maxLength={512}
                  {...register("note")}
               />
            </Modal.Content>
            <footer className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end sm:gap-4">
               <Button type="transparent" onClick={handleClose}>
                  <Button.Paragraph>Скасувати</Button.Paragraph>
               </Button>
               <Button type="accentFilled" isSubmit={true}>
                  <Button.Paragraph>{isPending ? "Збереження..." : "Підтвердити"}</Button.Paragraph>
               </Button>
            </footer>
         </form>
      </Modal>
   )
}
