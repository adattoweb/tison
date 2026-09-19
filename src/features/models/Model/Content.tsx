import type {
   InstructionCheckpoints,
   InstructionDetails,
   InstructionListRead,
   InstructionSteps,
} from "@/api/types/instruction"
import type { ProductModelListRead } from "@/api/types/product_model"
import { titleClassName } from "@/utils/classNames"
import clsx from "clsx"
import { EditIcon, PlusIcon } from "lucide-react"
import { useState } from "react"

interface ItemProps {
   isActive: boolean
   step: InstructionListRead
   setActiveStep: React.Dispatch<React.SetStateAction<InstructionListRead>>
}

function ListItem({ isActive, step, setActiveStep }: ItemProps) {
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
            {step.operation_type.name}
         </p>
      </li>
   )
}

function AddItem() {
   return (
      <li className="flex flex-1 gap-2 items-center hover:bg-(--bg-trans-color) py-2 px-2 rounded-lg duration-200">
         <div className="size-8 text-center flex justify-center items-center rounded-full border border-(--stroke-color) text-lg font-medium text-(--second-color)">
            <PlusIcon strokeWidth={1.5} className="size-5" />
         </div>
         <p className="ibm-plex-sans text-(--second-color)">Додати новий етап</p>
      </li>
   )
}

interface InstructionProps {
   steps: InstructionSteps
}

function Instructions({ steps }: InstructionProps) {
   return (
      <div className="flex flex-col gap-3 flex-1">
         <h3 className="text-white font-medium text-base xl:text-lg">Інструкція виконання</h3>
         <div className="flex flex-col gap-2.5">
            {steps !== null ? (
               steps.map((step, index) => (
                  <div key={index} className="flex gap-2">
                     <span className="text-(--second-color) shrink-0">{index + 1}.</span>
                     <span className="text-(--second-color)">{step}</span>
                  </div>
               ))
            ) : (
               <p className="text-(--second-color)">Інструкцій виконання немає</p>
            )}
         </div>
      </div>
   )
}

interface ParametersProps {
   details: InstructionDetails
}

function Parameters({ details }: ParametersProps) {
   return (
      <div className="flex flex-col gap-3 flex-1">
         <h3 className="text-white font-medium text-base xl:text-lg">Параметри операції</h3>
         <div className="flex flex-col gap-2.5">
            {details ? (
               details.map(param => (
                  <div key={param.label} className="flex gap-2">
                     <span className="text-(--second-color) w-36 shrink-0">{param.label}</span>
                     <span className="text-white font-medium">{param.value}</span>
                  </div>
               ))
            ) : (
               <p className="text-(--second-color)">Параметрів операції немає</p>
            )}
         </div>
      </div>
   )
}

interface CheckpointsProps {
   checkpoints: InstructionCheckpoints
}

function Checkpoints({ checkpoints }: CheckpointsProps) {
   return (
      <div className="flex flex-col gap-3">
         <h3 className="text-white font-medium text-base xl:text-lg">Контрольні точки</h3>
         <div className="flex gap-2 flex-wrap">
            {checkpoints ? (
               checkpoints.map(point => (
                  <span
                     key={point}
                     className="text-(--accent-color) bg-(--accent-trans-color) border border-(--accent-color) rounded-md px-3 py-1 text-sm font-medium"
                  >
                     {point}
                  </span>
               ))
            ) : (
               <p className="text-(--second-color)">Контрольних точок немає</p>
            )}
         </div>
      </div>
   )
}

interface ContnentProps {
   model: ProductModelListRead
}

export function Content({ model }: ContnentProps) {
   const [activeStep, setActiveStep] = useState<InstructionListRead>(model.steps[0])

   const checkpoints = ["Температура профілю", "Час оплавлення", "Якість пайки"]
   return (
      <main className="flex flex-col lg:flex-row gap-4">
         <div className="flex flex-col rounded-lg border-(--stroke-color) border px-(--components-py) py-(--components-py)">
            <p className="text-(--second-color)">Інструкція (6) операцій</p>
            <ul className="flex flex-col gap-2 mt-2">
               {model.steps.map(step => (
                  <ListItem key={step.id} isActive={false} step={step} setActiveStep={setActiveStep} />
               ))}
               <AddItem />
            </ul>
         </div>
         <div className="flex flex-col gap-(--components-gap) ibm-plex-sans border border-(--stroke-color) rounded-lg px-(--components-py) py-(--components-py) flex-1">
            <div className="flex justify-between">
               <div className="flex flex-col gap-1">
                  <h2 className={titleClassName}>
                     {activeStep.order + 1}. {activeStep.operation_type.name}
                  </h2>
                  <p className="text-(--second-color)">{activeStep.operation_type.description}</p>
               </div>
               <EditIcon strokeWidth={1.5} className="cursor-pointer" />
            </div>

            <div className="flex flex-col gap-(--components-gap)">
               <div className="flex flex-col xl:flex-row gap-(--components-gap)">
                  <Parameters details={activeStep.details} />
                  <Instructions steps={activeStep.steps} />
               </div>
            </div>
            <Checkpoints checkpoints={activeStep.checkpoints} />
         </div>
      </main>
   )
}
