import type { InstructionListRead } from "@/api/types/instruction"
import type { ProductModelListRead } from "@/api/types/product_model"
import clsx from "clsx"
import { PlusIcon } from "lucide-react"
import { useState } from "react"
import { AddInstructionModal } from "./AddInstructionModal"
import { ActiveStep } from "./ActiveStep"

interface ItemProps {
   isActive: boolean
   step: InstructionListRead
   setActiveStep: React.Dispatch<React.SetStateAction<InstructionListRead | undefined>>
}

export function ListItem({ isActive, step, setActiveStep }: ItemProps) {
   return (
      <li
         className={clsx(
            "flex flex-1 gap-2 items-center hover:bg-(--bg-trans-color) py-2 px-2 rounded-lg duration-200 cursor-pointer",
            isActive && "bg-(--accent-trans-color) hover:bg-(--accent-trans-color)!",
         )}
         onClick={() => setActiveStep(step)}
      >
         <div
            className={clsx(
               "size-8 text-center flex justify-center items-center rounded-full border border-(--stroke-color) text-lg font-medium text-(--second-color)",
               isActive && "text-(--accent-color)! border-(--accent-color)!",
            )}
         >
            {step.order + 1}
         </div>
         <p className={clsx("ibm-plex-sans text-(--second-color)", isActive && "text-(--accent-color)!")}>
            {step.title}
         </p>
      </li>
   )
}

interface AddItemProps {
   setIsOpen: React.Dispatch<React.SetStateAction<boolean>>
}

export function AddItem({ setIsOpen }: AddItemProps) {
   return (
      <li
         className="flex flex-1 gap-2 items-center hover:bg-(--bg-trans-color) py-2 px-2 rounded-lg duration-200 cursor-pointer"
         onClick={() => setIsOpen(true)}
      >
         <div className="size-8 text-center flex justify-center items-center rounded-full border border-(--stroke-color) text-lg font-medium text-(--second-color)">
            <PlusIcon strokeWidth={1.5} className="size-5" />
         </div>
         <p className="ibm-plex-sans text-(--second-color)">Додати новий етап</p>
      </li>
   )
}

interface ContnentProps {
   model: ProductModelListRead
}

export function Content({ model }: ContnentProps) {
   const [activeStep, setActiveStep] = useState<InstructionListRead | undefined>(model.steps[0])
   const [isInstructionModalOpen, setIsInstructionModalOpen] = useState(false)
   console.log(model)

   return (
      <main className="flex flex-col lg:flex-row gap-4">
         <div className="flex flex-col rounded-lg border-(--stroke-color) border px-(--components-py) py-(--components-py)">
            <p className="text-(--second-color)">Інструкції, {model.steps.length} операції</p>
            <ul className="flex flex-col gap-2 mt-2">
               {model.steps.map(step => (
                  <ListItem key={step.id} isActive={false} step={step} setActiveStep={setActiveStep} />
               ))}
               <AddItem setIsOpen={setIsInstructionModalOpen} />
            </ul>
         </div>
         <ActiveStep step={activeStep} />
         <AddInstructionModal
            isOpen={isInstructionModalOpen}
            setIsOpen={setIsInstructionModalOpen}
            modelId={model.id}
         />
      </main>
   )
}
