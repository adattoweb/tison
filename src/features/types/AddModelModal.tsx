import { useRef, useState, type ChangeEvent } from "react"
import clsx from "clsx"
import { PlusIcon, TrashIcon, PhotoIcon, XMarkIcon } from "@heroicons/react/24/outline"
import Modal from "@/components/UI/Modal"
import Dropdown from "@/components/UI/Dropdown"
import Button from "@/components/UI/Button"

const MODEL_TYPES = [
   "Модуль керування",
   "Силовий модуль",
   "Плата індикації",
   "Датчик",
   "Корпус",
   "Акумуляторний блок",
   "Комунікаційний модуль",
   "Захисний модуль",
]

const OPERATION_TYPES = ["Паяльна", "Монтажна", "Тестування", "Програмування", "Пакування", "Контроль якості"]
const EQUIPMENT_TYPES = [
   "Піч оплавлення",
   "Тестовий стенд",
   "Монтажний стіл",
   "Програматор",
   "Пакувальний автомат",
   "Мікроскоп",
]

interface InstructionStep {
   id: string
   title: string
   description: string
   operationType: string
   equipment: string
   temperature: string
   time: string
   executionSteps: string[]
   controlPoints: string[]
}

function createEmptyStep(): InstructionStep {
   return {
      id: crypto.randomUUID(),
      title: "",
      description: "",
      operationType: "",
      equipment: "",
      temperature: "",
      time: "",
      executionSteps: [],
      controlPoints: [],
   }
}

function TextField({
   label,
   value,
   onChange,
   placeholder,
   suffix,
   type = "text",
}: {
   label: string
   value: string
   onChange: (value: string) => void
   placeholder?: string
   suffix?: string
   type?: string
}) {
   return (
      <div className="flex w-full flex-col gap-2">
         <span className="text-xs md:text-sm text-(--second-color)">{label}</span>
         <div className="flex items-center gap-2 rounded-md border border-(--stroke-color) bg-(--bg-trans-color) px-3 py-2 focus-within:border-(--stroke-active-color)">
            <input
               type={type}
               value={value}
               onChange={e => onChange(e.target.value)}
               placeholder={placeholder}
               className="w-full bg-transparent text-sm text-white placeholder:text-(--second-color) outline-none"
            />
            {suffix && <span className="shrink-0 text-sm text-(--second-color)">{suffix}</span>}
         </div>
      </div>
   )
}

function SelectField({
   label,
   value,
   options,
   onChange,
   placeholder = "Обрати",
}: {
   label: string
   value: string
   options: string[]
   onChange: (value: string) => void
   placeholder?: string
}) {
   return (
      <div className="flex w-full flex-col gap-2">
         <span className="text-xs md:text-sm text-(--second-color)">{label}</span>
         <Dropdown className="w-full">
            <Dropdown.Button className="w-full">
               <span className={clsx("truncate", !value && "text-(--second-color)")}>{value || placeholder}</span>
               <Dropdown.Chevron />
            </Dropdown.Button>
            <Dropdown.Content className="max-h-60 overflow-y-auto">
               {options.map(option => (
                  <Dropdown.Item key={option} onClick={() => onChange(option)}>
                     {option}
                  </Dropdown.Item>
               ))}
            </Dropdown.Content>
         </Dropdown>
      </div>
   )
}

function ExecutionStepsField({
   items,
   onAdd,
   onRemove,
}: {
   items: string[]
   onAdd: (value: string) => void
   onRemove: (index: number) => void
}) {
   const [value, setValue] = useState("")

   function handleAdd() {
      const trimmed = value.trim()
      if (!trimmed) return
      onAdd(trimmed)
      setValue("")
   }

   return (
      <div className="flex w-full flex-col gap-2">
         <span className="text-xs md:text-sm text-(--second-color)">Інструкція виконання</span>

         {items.length > 0 && (
            <div className="flex flex-col gap-2">
               {items.map((item, index) => (
                  <div
                     key={index}
                     className="flex items-center gap-2 rounded-md border border-(--stroke-color) bg-(--bg-trans-color) px-3 py-2"
                  >
                     <span className="shrink-0 text-sm text-(--accent-color)">{index + 1}.</span>
                     <span className="flex-1 text-sm text-white break-words">{item}</span>
                     <button
                        type="button"
                        onClick={() => onRemove(index)}
                        className="cursor-pointer text-(--second-color) transition-colors hover:text-(--bad-color)"
                     >
                        <XMarkIcon className="size-4" />
                     </button>
                  </div>
               ))}
            </div>
         )}

         <div className="flex items-center gap-2">
            <input
               value={value}
               onChange={e => setValue(e.target.value)}
               onKeyDown={e => {
                  if (e.key === "Enter") {
                     e.preventDefault()
                     handleAdd()
                  }
               }}
               placeholder="Новий крок виконання..."
               className="w-full rounded-md border border-(--stroke-color) bg-(--bg-trans-color) px-3 py-2 text-sm text-white placeholder:text-(--second-color) outline-none focus:border-(--stroke-active-color)"
            />
            <button
               type="button"
               onClick={handleAdd}
               className="shrink-0 cursor-pointer rounded-md border border-(--stroke-color) bg-(--bg-trans-color) p-2 text-(--second-color) transition-colors hover:bg-(--bg-trans-hover-color) hover:text-white"
            >
               <PlusIcon className="size-4" />
            </button>
         </div>
      </div>
   )
}

function ChipsField({
   label,
   items,
   onAdd,
   onRemove,
   placeholder,
}: {
   label: string
   items: string[]
   onAdd: (value: string) => void
   onRemove: (index: number) => void
   placeholder?: string
}) {
   const [value, setValue] = useState("")

   function handleAdd() {
      const trimmed = value.trim()
      if (!trimmed) return
      onAdd(trimmed)
      setValue("")
   }

   return (
      <div className="flex w-full flex-col gap-2">
         <span className="text-xs md:text-sm text-(--second-color)">{label}</span>

         {items.length > 0 && (
            <div className="flex flex-wrap gap-2">
               {items.map((item, index) => (
                  <span
                     key={index}
                     className="flex items-center gap-2 rounded-md border border-(--accent-color) bg-(--accent-trans-color) px-3 py-1 text-xs md:text-sm text-(--accent-color)"
                  >
                     {item}
                     <button
                        type="button"
                        onClick={() => onRemove(index)}
                        className="cursor-pointer text-(--accent-color) hover:text-white"
                     >
                        <XMarkIcon className="size-3.5" />
                     </button>
                  </span>
               ))}
            </div>
         )}

         <div className="flex items-center gap-2">
            <input
               value={value}
               onChange={e => setValue(e.target.value)}
               onKeyDown={e => {
                  if (e.key === "Enter") {
                     e.preventDefault()
                     handleAdd()
                  }
               }}
               placeholder={placeholder}
               className="w-full rounded-md border border-(--stroke-color) bg-(--bg-trans-color) px-3 py-2 text-sm text-white placeholder:text-(--second-color) outline-none focus:border-(--stroke-active-color)"
            />
            <button
               type="button"
               onClick={handleAdd}
               className="shrink-0 cursor-pointer rounded-md border border-(--stroke-color) bg-(--bg-trans-color) p-2 text-(--second-color) transition-colors hover:bg-(--bg-trans-hover-color) hover:text-white"
            >
               <PlusIcon className="size-4" />
            </button>
         </div>
      </div>
   )
}

function StepCard({
   step,
   index,
   onChange,
   onRemove,
   removable,
}: {
   step: InstructionStep
   index: number
   onChange: (id: string, patch: Partial<InstructionStep>) => void
   onRemove: (id: string) => void
   removable: boolean
}) {
   return (
      <div className="flex flex-col gap-4 md:gap-(--components-gap) rounded-md border border-(--stroke-color) bg-(--bg-trans-color) p-4 md:p-(--components-px)">
         <div className="flex items-center justify-between">
            <span className="text-sm md:text-base font-medium text-white">Етап {index + 1}</span>
            {removable && (
               <button
                  type="button"
                  onClick={() => onRemove(step.id)}
                  className="cursor-pointer rounded-md p-1 text-(--second-color) transition-colors hover:bg-(--bg-trans-hover-color) hover:text-(--bad-color)"
               >
                  <TrashIcon className="size-4" />
               </button>
            )}
         </div>

         <TextField
            label="Назва етапу"
            value={step.title}
            onChange={value => onChange(step.id, { title: value })}
            placeholder="Наприклад: Пайка"
         />

         <TextField
            label="Опис"
            value={step.description}
            onChange={value => onChange(step.id, { description: value })}
            placeholder="Короткий опис операції"
         />

         <div className="flex flex-col gap-4 sm:flex-row md:gap-(--components-gap)">
            <SelectField
               label="Тип операції"
               value={step.operationType}
               options={OPERATION_TYPES}
               onChange={value => onChange(step.id, { operationType: value })}
            />
            <SelectField
               label="Обладнання"
               value={step.equipment}
               options={EQUIPMENT_TYPES}
               onChange={value => onChange(step.id, { equipment: value })}
            />
         </div>

         <div className="flex flex-col gap-4 sm:flex-row md:gap-(--components-gap)">
            <TextField
               label="Температура"
               value={step.temperature}
               onChange={value => onChange(step.id, { temperature: value })}
               placeholder="245"
               suffix="°C"
               type="number"
            />
            <TextField
               label="Час"
               value={step.time}
               onChange={value => onChange(step.id, { time: value })}
               placeholder="180"
               suffix="с"
               type="number"
            />
         </div>

         <ExecutionStepsField
            items={step.executionSteps}
            onAdd={value => onChange(step.id, { executionSteps: [...step.executionSteps, value] })}
            onRemove={idx => onChange(step.id, { executionSteps: step.executionSteps.filter((_, i) => i !== idx) })}
         />

         <ChipsField
            label="Контрольні точки"
            items={step.controlPoints}
            onAdd={value => onChange(step.id, { controlPoints: [...step.controlPoints, value] })}
            onRemove={idx => onChange(step.id, { controlPoints: step.controlPoints.filter((_, i) => i !== idx) })}
            placeholder="Наприклад: Якість пайки"
         />
      </div>
   )
}

interface AddModelModalProps {
   open: boolean
   onClose: () => void
}

export function AddModelModal({ open, onClose }: AddModelModalProps) {
   const [name, setName] = useState("")
   const [type, setType] = useState("")
   const [image, setImage] = useState<string | null>(null)
   const [steps, setSteps] = useState<InstructionStep[]>([createEmptyStep()])
   const fileInputRef = useRef<HTMLInputElement>(null)

   function handleImageChange(e: ChangeEvent<HTMLInputElement>) {
      const file = e.target.files?.[0]
      if (!file) return
      // TODO: тут буде реальний аплоад на сервер, поки — локальне превʼю
      const reader = new FileReader()
      reader.onload = () => setImage(reader.result as string)
      reader.readAsDataURL(file)
   }

   function handleStepChange(id: string, patch: Partial<InstructionStep>) {
      setSteps(prev => prev.map(step => (step.id === id ? { ...step, ...patch } : step)))
   }

   function handleAddStep() {
      setSteps(prev => [...prev, createEmptyStep()])
   }

   function handleRemoveStep(id: string) {
      setSteps(prev => prev.filter(step => step.id !== id))
   }

   function handleReset() {
      setName("")
      setType("")
      setImage(null)
      setSteps([createEmptyStep()])
   }

   function handleClose() {
      handleReset()
      onClose()
   }

   function handleSubmit() {
      // TODO: інтеграція з API збереження моделі
      console.log({ name, type, image, steps })
      handleClose()
   }

   return (
      <Modal open={open} onClose={handleClose} className="sm:max-w-xl md:max-w-2xl xl:max-w-3xl">
         <Modal.Header>Нова модель</Modal.Header>

         <Modal.Body>
            <div className="flex flex-col gap-4 sm:flex-row md:gap-(--components-gap)">
               <div className="flex flex-row sm:flex-col items-center sm:items-start gap-4 sm:gap-2">
                  <span className="hidden sm:block text-xs md:text-sm text-(--second-color)">Зображення</span>
                  <button
                     type="button"
                     onClick={() => fileInputRef.current?.click()}
                     className="flex size-20 sm:size-24 xl:size-28 shrink-0 cursor-pointer items-center justify-center overflow-hidden rounded-md border border-dashed border-(--stroke-color) bg-(--bg-trans-color) transition-colors hover:border-(--stroke-active-color)"
                  >
                     {image ? (
                        <img src={image} alt="Модель" className="size-full object-cover" />
                     ) : (
                        <PhotoIcon className="size-7 xl:size-8 text-(--second-color)" />
                     )}
                  </button>
                  <input
                     ref={fileInputRef}
                     type="file"
                     accept="image/*"
                     onChange={handleImageChange}
                     className="hidden"
                  />
               </div>

               <div className="flex flex-1 flex-col gap-4 md:gap-(--components-gap)">
                  <TextField
                     label="Назва моделі"
                     value={name}
                     onChange={setName}
                     placeholder="Наприклад: Плата керування V5"
                  />
                  <SelectField label="Тип моделі" value={type} options={MODEL_TYPES} onChange={setType} />
               </div>
            </div>

            <div className="flex flex-col gap-4 md:gap-(--components-gap)">
               <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <span className="text-sm md:text-base font-medium text-white">Конструктор інструкцій</span>
                  <Button type="transparent" className="h-min w-full sm:w-auto justify-center" onClick={handleAddStep}>
                     <Button.Icon Icon={PlusIcon} />
                     <Button.Paragraph>Додати етап</Button.Paragraph>
                  </Button>
               </div>

               <div className="flex flex-col gap-4 md:gap-(--components-gap)">
                  {steps.map((step, index) => (
                     <StepCard
                        key={step.id}
                        step={step}
                        index={index}
                        onChange={handleStepChange}
                        onRemove={handleRemoveStep}
                        removable={steps.length > 1}
                     />
                  ))}
               </div>
            </div>
         </Modal.Body>

         <Modal.Footer>
            <Button type="transparent" className="w-full sm:w-auto justify-center" onClick={handleClose}>
               <Button.Paragraph>Скасувати</Button.Paragraph>
            </Button>
            <Button type="accent" className="w-full sm:w-auto justify-center" onClick={handleSubmit}>
               <Button.Paragraph>Зберегти модель</Button.Paragraph>
            </Button>
         </Modal.Footer>
      </Modal>
   )
}
