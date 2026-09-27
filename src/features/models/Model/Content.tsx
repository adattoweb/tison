import type { InstructionListRead } from "@/api/types/instruction"
import type { InstructionUpdateInput } from "@/api/schemas/instruction"
import type { ProductModelListRead } from "@/api/types/product_model"
import { useToast } from "@/components/Toast/useToast"
import { useUpdateInstruction } from "@/hooks/api/instructions/useUpdateInstruction"
import {
   closestCenter,
   DndContext,
   KeyboardSensor,
   PointerSensor,
   useSensor,
   useSensors,
   type DragEndEvent,
} from "@dnd-kit/core"
import {
   arrayMove,
   SortableContext,
   sortableKeyboardCoordinates,
   useSortable,
   verticalListSortingStrategy,
} from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { useQueryClient } from "@tanstack/react-query"
import clsx from "clsx"
import { GripVerticalIcon, ImageIcon, PlusIcon } from "lucide-react"
import { useState } from "react"
import { ActiveStep } from "./ActiveStep"
import { AddInstructionModal } from "./AddInstructionModal"
import { titleClassName } from "@/utils/classNames"
import { ImageGalleryModal } from "@/components/UI/ImageGalleryModal"

interface ListItemProps {
   isActive: boolean
   step: InstructionListRead
   onSelect: () => void
}

export function ListItem({ isActive, step, onSelect }: ListItemProps) {
   const { attributes, listeners, setNodeRef, setActivatorNodeRef, transform, transition, isDragging } = useSortable({
      id: step.id,
   })

   return (
      <li
         ref={setNodeRef}
         style={{ transform: CSS.Translate.toString(transform), transition }}
         className={clsx(
            "flex flex-1 gap-1.5 sm:gap-2 items-center hover:bg-(--bg-trans-color) py-2 px-1.5 sm:px-2 rounded-lg duration-200 cursor-pointer w-full min-w-0",
            isActive && "bg-(--accent-trans-color) hover:bg-(--accent-trans-color)!",
            isDragging && "relative z-10 shadow-lg bg-(--bg-trans-color)",
         )}
         onClick={onSelect}
      >
         <div
            className={clsx(
               "size-7 sm:size-8 shrink-0 text-center flex justify-center items-center rounded-full border border-(--stroke-color) text-base sm:text-lg font-medium text-(--second-color) select-none",
               isActive && "text-(--accent-color)! border-(--accent-color)!",
            )}
         >
            {step.order + 1}
         </div>
         <p
            title={step.title}
            className={clsx(
               "ibm-plex-sans min-w-0 text-sm md:text-base text-(--second-color) select-none truncate",
               isActive && "text-(--accent-color)!",
            )}
         >
            {step.title}
         </p>
         {/* Ручка: тільки за неї можна тягнути, тому клік по рядку не конфліктує з drag */}
         <button
            type="button"
            ref={setActivatorNodeRef}
            aria-label="Перетягнути крок"
            {...attributes}
            {...listeners}
            onClick={event => event.stopPropagation()}
            className="touch-none cursor-grab active:cursor-grabbing shrink-0 rounded-md p-0.5 text-(--second-color) hover:text-white transition-colors ml-auto"
         >
            <GripVerticalIcon className="size-4" strokeWidth={1.5} />
         </button>
      </li>
   )
}

interface AddItemProps {
   setIsOpen: React.Dispatch<React.SetStateAction<boolean>>
}

export function AddItem({ setIsOpen }: AddItemProps) {
   return (
      <li
         className="flex flex-1 gap-1.5 sm:gap-2 items-center hover:bg-(--bg-trans-color) py-2 px-1.5 sm:px-2 rounded-lg duration-200 cursor-pointer min-w-0"
         onClick={() => setIsOpen(true)}
      >
         <div className="size-7 sm:size-8 shrink-0 text-center flex justify-center items-center rounded-full border border-(--stroke-color) text-lg font-medium text-(--second-color)">
            <PlusIcon strokeWidth={1.5} className="size-4 sm:size-5" />
         </div>
         <p className="ibm-plex-sans min-w-0 text-sm md:text-base text-(--second-color) truncate">Додати новий етап</p>
      </li>
   )
}

interface AboutModelProps {
   isActive: boolean
   onSelect: () => void
}

// Той самий вигляд, що й у ListItem, але без ручки перетягування та номера кроку
export function AboutModel({ isActive, onSelect }: AboutModelProps) {
   return (
      <li
         className={clsx(
            "flex flex-1 gap-1.5 sm:gap-2 items-center hover:bg-(--bg-trans-color) py-2 px-1.5 sm:px-2 rounded-lg duration-200 cursor-pointer w-full min-w-0",
            isActive && "bg-(--accent-trans-color) hover:bg-(--accent-trans-color)!",
         )}
         onClick={onSelect}
      >
         <div
            className={clsx(
               "size-7 sm:size-8 shrink-0 flex justify-center items-center rounded-full border border-(--stroke-color) text-(--second-color) select-none",
               isActive && "text-(--accent-color)! border-(--accent-color)!",
            )}
         >
            <ImageIcon className="size-3.5 sm:size-4" strokeWidth={1.5} />
         </div>
         <p
            title="Про модель"
            className={clsx(
               "ibm-plex-sans min-w-0 text-sm md:text-base text-(--second-color) select-none truncate",
               isActive && "text-(--accent-color)!",
            )}
         >
            Про модель
         </p>
      </li>
   )
}

interface AboutModelInfoProps {
   model: ProductModelListRead
}

function AboutModelInfo({ model }: AboutModelInfoProps) {
   const [galleryIndex, setGalleryIndex] = useState<number | null>(null)

   return (
      <div className="flex flex-col gap-(--components-gap) ibm-plex-sans border border-(--stroke-color) rounded-lg px-(--components-py) py-(--components-py) flex-1">
         <h2 className={titleClassName}>{model.title}</h2>

         <div className="flex flex-wrap gap-3 text-sm text-(--second-color)">
            <span className="px-2 py-1 rounded-md border border-(--stroke-color)">Тип: {model.type}</span>
            <span className="px-2 py-1 rounded-md border border-(--stroke-color)">
               Інструкцій: {model.steps.length}
            </span>
            <span className="px-2 py-1 rounded-md border border-(--stroke-color)">
               Статус: {model.is_active ? "Активна" : "Неактивна"}
            </span>
         </div>

         {model.images.length > 0 && (
            <div className="flex flex-wrap gap-2">
               {model.images.map((src, index) => (
                  <img
                     key={index}
                     src={src}
                     alt={model.title}
                     onClick={() => setGalleryIndex(index)}
                     className="w-full sm:w-48 h-32 object-cover rounded-lg border border-(--stroke-color) cursor-pointer hover:opacity-80 transition-opacity"
                  />
               ))}
            </div>
         )}

         {model.description ? (
            <p className="text-(--second-color) whitespace-pre-line">{model.description}</p>
         ) : (
            <p className="text-(--second-color)">Опис відсутній</p>
         )}

         <ImageGalleryModal
            images={model.images}
            initialIndex={galleryIndex ?? 0}
            isOpen={galleryIndex !== null}
            onClose={() => setGalleryIndex(null)}
            alt={model.title}
         />
      </div>
   )
}

// Бекенд вимагає повний payload, тому беремо всі поля кроку й міняємо лише order
const toPayload = (step: InstructionListRead, order: number): InstructionUpdateInput => ({
   title: step.title,
   description: step.description ?? "",
   operation_type_id: step.operation_type_id,
   planned_time: step.planned_time ?? null,
   order,
   details: step.details,
   steps: step.steps,
   checkpoints: step.checkpoints,
})

interface ContentProps {
   model: ProductModelListRead
}

export function Content({ model }: ContentProps) {
   const [activeStepId, setActiveStepId] = useState<number | null>(null)
   const [isInstructionModalOpen, setIsInstructionModalOpen] = useState(false)
   // Тимчасовий порядок id, поки зміни зберігаються на сервері (оптимістичне оновлення)
   const [localOrder, setLocalOrder] = useState<number[] | null>(null)
   const [isAboutActive, setIsAboutActive] = useState(true)

   const { mutateAsync: updateInstruction } = useUpdateInstruction()
   const queryClient = useQueryClient()
   const { addToast } = useToast()

   const sensors = useSensors(
      useSensor(PointerSensor, { activationConstraint: { distance: 4 } }),
      useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
   )

   // Базовий порядок з сервера
   const sortedSteps = [...model.steps].sort((a, b) => a.order - b.order)

   // Під час збереження показуємо локальний порядок. order нормалізуємо до індексу (0..n-1)
   const instructions = (
      localOrder
         ? localOrder.map(id => sortedSteps.find(s => s.id === id)).filter((s): s is InstructionListRead => !!s)
         : sortedSteps
   ).map((step, index) => ({ ...step, order: index }))

   // Зберігаємо id, а не об'єкт: після оновлення даних крок не залишиться застарілим
   const activeStep = instructions.find(s => s.id === activeStepId) ?? instructions[0]

   const isSaving = localOrder !== null

   const handleSelectStep = (id: number) => {
      setIsAboutActive(false)
      setActiveStepId(id)
   }

   const handleDragEnd = async ({ active, over }: DragEndEvent) => {
      if (!over || active.id === over.id || isSaving) return

      const oldIndex = instructions.findIndex(s => s.id === active.id)
      const newIndex = instructions.findIndex(s => s.id === over.id)
      if (oldIndex === -1 || newIndex === -1) return

      const reordered = arrayMove(instructions, oldIndex, newIndex)
      setLocalOrder(reordered.map(s => s.id))

      // Надсилаємо лише ті кроки, у яких order реально змінився
      const dbOrder = new Map(model.steps.map(s => [s.id, s.order]))
      const changed = reordered
         .map((step, index) => ({ step, index }))
         .filter(({ step, index }) => dbOrder.get(step.id) !== index)

      try {
         await Promise.all(
            changed.map(({ step, index }) => updateInstruction({ id: step.id, payload: toPayload(step, index) })),
         )
         // чекаємо свіжі дані, щоб список не "стрибнув" назад
         await queryClient.invalidateQueries({ queryKey: ["models"] })
      } catch {
         addToast("Не вдалося зберегти порядок", { duration: 3000, type: "error" })
      } finally {
         setLocalOrder(null)
      }
   }

   return (
      <main className="flex flex-col sm:flex-row gap-4">
         <div className="flex flex-col shrink-0 min-w-0 w-full sm:w-44 md:w-60 lg:w-80 rounded-lg border-(--stroke-color) border px-(--components-py) py-(--components-py)">
            <ul className={clsx("flex flex-col gap-2 w-full", isSaving && "opacity-70")}>
               <AboutModel isActive={isAboutActive} onSelect={() => setIsAboutActive(true)} />
            </ul>
            <p className="text-(--second-color) truncate mt-2">Інструкції, {instructions.length} операції</p>
            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
               <SortableContext items={instructions.map(s => s.id)} strategy={verticalListSortingStrategy}>
                  <ul className={clsx("flex flex-col gap-2 mt-2 w-full", isSaving && "opacity-70")}>
                     {instructions.map(step => (
                        <ListItem
                           key={step.id}
                           isActive={!isAboutActive && step.id === activeStep?.id}
                           step={step}
                           onSelect={() => handleSelectStep(step.id)}
                        />
                     ))}
                     <AddItem setIsOpen={setIsInstructionModalOpen} />
                  </ul>
               </SortableContext>
            </DndContext>
         </div>

         <div className="flex flex-1 min-w-0">
            {isAboutActive ? (
               <AboutModelInfo model={model} />
            ) : activeStep ? (
               <ActiveStep step={activeStep} />
            ) : (
               <div className="flex flex-col gap-(--components-gap) ibm-plex-sans border border-(--stroke-color) rounded-lg px-(--components-py) py-(--components-py) flex-1">
                  <h2 className={titleClassName}>Немає інструкцій</h2>
               </div>
            )}
         </div>

         <AddInstructionModal
            isOpen={isInstructionModalOpen}
            setIsOpen={setIsInstructionModalOpen}
            modelId={model.id}
         />
      </main>
   )
}
