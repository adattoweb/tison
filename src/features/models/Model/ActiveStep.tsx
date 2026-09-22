import { InstructionEditFormSchema, type InstructionEditFormInput } from "@/api/schemas/instruction"
import type {
   InstructionCheckpoints,
   InstructionDetails,
   InstructionListRead,
   InstructionSteps,
} from "@/api/types/instruction"
import { useToast } from "@/components/Toast/useToast"
import Button from "@/components/UI/Button"
import Dropdown from "@/components/UI/Dropdown"
import { FieldError } from "@/components/UI/FieldError"
import { Input } from "@/components/UI/Input"
import { Textarea } from "@/components/UI/Textarea"
import { TOAST_DURATION } from "@/constants/app"
import { useUpdateInstruction } from "@/hooks/api/instructions/useUpdateInstruction"
import { useAllOperationTypes } from "@/hooks/api/operationTypes/useAllOperationTypes"
import { titleClassName } from "@/utils/classNames"
import { zodResolver } from "@hookform/resolvers/zod"
import clsx from "clsx"
import { ClockIcon, EditIcon, NotebookPenIcon, PlusIcon, WrenchIcon, XIcon } from "lucide-react"
import { useState } from "react"
import { Controller, useFieldArray, useForm, type SubmitHandler } from "react-hook-form"

interface InstructionProps {
   steps: InstructionSteps | undefined
}

function Instructions({ steps }: InstructionProps) {
   if (steps === undefined) return
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
   details: InstructionDetails | undefined
}

function Parameters({ details }: ParametersProps) {
   if (details === undefined) return
   return (
      <div className="flex flex-col gap-3 flex-1">
         <h3 className="text-white font-medium text-base xl:text-lg">Параметри операції</h3>
         <div className="flex flex-col gap-2.5">
            {details ? (
               details.map((param, id) => (
                  <div key={id} className="flex gap-2">
                     <span className="text-(--second-color) shrink-0">{Object.keys(param)}</span>
                     <span className="text-white font-medium">{Object.values(param)}</span>
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
   checkpoints: InstructionCheckpoints | undefined
}

function Checkpoints({ checkpoints }: CheckpointsProps) {
   if (checkpoints === undefined) return
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

const cardClassName =
   "flex flex-col gap-(--components-gap) ibm-plex-sans border border-(--stroke-color) rounded-lg px-(--components-py) py-(--components-py) flex-1"

const fieldClassName =
   "w-full rounded-md border border-(--stroke-color) focus:border-(--stroke-light-color) bg-(--bg-trans-color) py-2 px-2.5 focus:outline-0"

interface ActiveStepProps {
   step: InstructionListRead | undefined
}

export function ActiveStep({ step }: ActiveStepProps) {
   const [editingStepId, setEditingStepId] = useState<number | null>(null)
   const isEditing = editingStepId === step?.id

   if (isEditing) {
      return <ActiveStepForm key={step.id} step={step} onClose={() => setEditingStepId(null)} />
   }

   return (
      <div className={cardClassName}>
         <div className="flex justify-between gap-4">
            <div className="flex flex-col gap-1 min-w-0">
               {step !== undefined ? (
                  <>
                     <h2 className={titleClassName}>{step?.title}</h2>
                     <p className="text-(--second-color)">Тип операції: {step?.operation_type.name ?? null}</p>
                     <p className="text-(--second-color)">{step?.operation_type?.description ?? null}</p>
                     {step?.planned_time !== null && (
                        <p className="text-(--second-color)">Запланований час: {step?.planned_time ?? null} хв</p>
                     )}
                     {step.description && <p className="wrap-break-word whitespace-pre-line">{step.description}</p>}
                  </>
               ) : (
                  <h2 className={titleClassName}>Немає інструкцій</h2>
               )}
            </div>
            {step !== undefined && (
               <EditIcon
                  strokeWidth={1.5}
                  className="cursor-pointer shrink-0"
                  onClick={() => setEditingStepId(step?.id)}
               />
            )}
         </div>

         <div className="flex flex-col gap-(--components-gap)">
            <div className="flex flex-col xl:flex-row gap-(--components-gap)">
               <Parameters details={step?.details} />
               <Instructions steps={step?.steps} />
            </div>
         </div>
         <Checkpoints checkpoints={step?.checkpoints} />
      </div>
   )
}

function toFormValues(step: InstructionListRead): InstructionEditFormInput {
   return {
      title: step.title,
      description: step.description ?? "",
      operation_type_id: step.operation_type_id,
      planned_time: step.planned_time ?? null,
      // якщо в одному записі кілька ключів, розгортаємо їх в окремі рядки
      details: (step.details ?? []).flatMap(record =>
         Object.entries(record).map(([key, value]) => ({ key, value: String(value) })),
      ),
      steps: (step.steps ?? []).map(value => ({ value })),
      checkpoints: (step.checkpoints ?? []).map(value => ({ value })),
   }
}

function SectionHeader({ title, onAdd }: { title: string; onAdd: () => void }) {
   return (
      <div className="flex items-center justify-between gap-2">
         <p className="text-base font-medium">{title}</p>
         <button
            type="button"
            onClick={onAdd}
            className="flex items-center gap-1 text-sm cursor-pointer text-(--second-color) hover:text-white transition-colors"
         >
            <PlusIcon className="size-4" />
            Додати
         </button>
      </div>
   )
}

function RemoveButton({ onClick }: { onClick: () => void }) {
   return (
      <button
         type="button"
         onClick={onClick}
         aria-label="Видалити"
         className="flex items-center justify-center size-11 shrink-0 cursor-pointer text-(--second-color) hover:text-red-400 transition-colors"
      >
         <XIcon className="size-5" />
      </button>
   )
}

interface ActiveStepFormProps {
   step: InstructionListRead
   onClose: () => void
}

function ActiveStepForm({ step, onClose }: ActiveStepFormProps) {
   const { mutate: doUpdateInstruction, isPending } = useUpdateInstruction()
   const { data: operationTypesData } = useAllOperationTypes({ page: 1, pageSize: 100, isActive: true })
   const { addToast } = useToast()

   const operationTypes = operationTypesData?.items ?? []

   const {
      register,
      handleSubmit,
      control,
      formState: { errors },
   } = useForm<InstructionEditFormInput>({
      resolver: zodResolver(InstructionEditFormSchema),
      defaultValues: toFormValues(step),
   })

   const details = useFieldArray({ control, name: "details" })
   const steps = useFieldArray({ control, name: "steps" })
   const checkpoints = useFieldArray({ control, name: "checkpoints" })

   const onSubmit: SubmitHandler<InstructionEditFormInput> = data => {
      doUpdateInstruction(
         {
            id: step.id,
            payload: {
               title: data.title,
               description: data.description,
               operation_type_id: data.operation_type_id,
               planned_time: data.planned_time,
               order: step.order, // порядок не редагуємо, беремо поточний
               details: data.details.map(d => ({ [d.key]: d.value })),
               steps: data.steps.map(s => s.value),
               checkpoints: data.checkpoints.map(c => c.value),
            },
         },
         {
            onSuccess: () => {
               addToast("Успішно оновлено інструкцію!", { duration: TOAST_DURATION, type: "success" })
               onClose()
            },
         },
      )
   }

   return (
      <form onSubmit={handleSubmit(onSubmit)} className={cardClassName}>
         {/* Основне */}
         <div className="grid grid-cols-1 md:grid-cols-2 gap-x-(--components-gap) gap-y-2">
            <div className="md:col-span-2">
               <Input
                  label="Назва"
                  Icon={NotebookPenIcon}
                  placeholder="Нанесення паяльної пасти"
                  hasError={!!errors.title}
                  {...register("title")}
               />
               <FieldError message={errors.title?.message} />
            </div>

            <div>
               <Controller
                  name="operation_type_id"
                  control={control}
                  render={({ field }) => {
                     // якщо поточний тип став неактивним, його немає в списку, тому беремо зі step
                     const selected =
                        operationTypes.find(t => t.id === field.value) ??
                        (field.value === step.operation_type_id ? step.operation_type : undefined)

                     return (
                        <div className="flex flex-col gap-1.5 w-full">
                           <p className="text-base font-medium">Тип операції</p>
                           <Dropdown className="w-full!">
                              <Dropdown.Button
                                 className={clsx("w-full h-11", errors.operation_type_id && "border-red-400!")}
                              >
                                 <span className="flex items-center gap-2 min-w-0">
                                    <WrenchIcon className="size-5 stroke-white shrink-0" strokeWidth={2} />
                                    {selected ? (
                                       <span className="flex items-center gap-2 truncate">
                                          <span
                                             className="size-3 rounded-full shrink-0"
                                             style={{ backgroundColor: selected.color }}
                                          />
                                          <span className="truncate">{selected.name}</span>
                                       </span>
                                    ) : (
                                       <span className="opacity-60 truncate">Оберіть тип операції</span>
                                    )}
                                 </span>
                                 <Dropdown.Chevron />
                              </Dropdown.Button>
                              <Dropdown.Content>
                                 {operationTypes.length === 0 && (
                                    <p className="px-3 md:px-4 py-2 opacity-60">Немає типів операцій</p>
                                 )}
                                 {operationTypes.map(type => (
                                    <Dropdown.Item key={type.id} onClick={() => field.onChange(type.id)}>
                                       <span className="flex items-center gap-2">
                                          <span
                                             className="size-3 rounded-full shrink-0"
                                             style={{ backgroundColor: type.color }}
                                          />
                                          {type.name}
                                       </span>
                                    </Dropdown.Item>
                                 ))}
                              </Dropdown.Content>
                           </Dropdown>
                        </div>
                     )
                  }}
               />
               <FieldError message={errors.operation_type_id?.message} />
            </div>

            <div>
               <Input
                  label="Запланований час (хв)"
                  Icon={ClockIcon}
                  placeholder="0"
                  type="number"
                  hasError={!!errors.planned_time}
                  {...register("planned_time", {
                     setValueAs: v => (v === "" || v == null ? null : Number(v)),
                  })}
               />
               <FieldError message={errors.planned_time?.message} />
            </div>

            <div className="md:col-span-2">
               <Textarea
                  label="Опис"
                  Icon={NotebookPenIcon}
                  placeholder="Опис"
                  hasError={!!errors.description}
                  {...register("description")}
               />
               <FieldError message={errors.description?.message} />
            </div>
         </div>

         <div className="flex flex-col xl:flex-row gap-(--components-gap)">
            {/* Параметри: власні назви й значення */}
            <div className="flex flex-col gap-2 flex-1 min-w-0">
               <SectionHeader title="Параметри" onAdd={() => details.append({ key: "", value: "" })} />
               {details.fields.length === 0 && <p className="text-sm text-(--second-color)">Параметрів немає</p>}
               {details.fields.map((field, index) => {
                  const rowErrors = errors.details?.[index]
                  return (
                     <div key={field.id} className="flex flex-col gap-1">
                        <div className="flex items-start gap-2">
                           <div className="flex flex-col sm:flex-row gap-2 flex-1 min-w-0">
                              <div className="flex-1 min-w-0">
                                 <input
                                    placeholder="Назва (напр. Температура)"
                                    className={clsx(fieldClassName, "h-11", rowErrors?.key && "border-red-400!")}
                                    {...register(`details.${index}.key`)}
                                 />
                                 <FieldError message={rowErrors?.key?.message} />
                              </div>
                              <div className="flex-1 min-w-0">
                                 <input
                                    placeholder="Значення (напр. 250 °C)"
                                    className={clsx(fieldClassName, "h-11", rowErrors?.value && "border-red-400!")}
                                    {...register(`details.${index}.value`)}
                                 />
                                 <FieldError message={rowErrors?.value?.message} />
                              </div>
                           </div>
                           <RemoveButton onClick={() => details.remove(index)} />
                        </div>
                     </div>
                  )
               })}
            </div>

            {/* Кроки */}
            <div className="flex flex-col gap-2 flex-1 min-w-0">
               <SectionHeader title="Кроки" onAdd={() => steps.append({ value: "" })} />
               {steps.fields.length === 0 && <p className="text-sm text-(--second-color)">Кроків немає</p>}
               {steps.fields.map((field, index) => (
                  <div key={field.id} className="flex items-start gap-2">
                     <span className="flex items-center justify-center h-11 w-6 shrink-0 text-(--second-color)">
                        {index + 1}.
                     </span>
                     <div className="flex-1 min-w-0">
                        <textarea
                           rows={2}
                           placeholder="Опишіть крок"
                           className={clsx(
                              fieldClassName,
                              "resize-none",
                              errors.steps?.[index]?.value && "border-red-400!",
                           )}
                           {...register(`steps.${index}.value`)}
                        />
                        <FieldError message={errors.steps?.[index]?.value?.message} />
                     </div>
                     <RemoveButton onClick={() => steps.remove(index)} />
                  </div>
               ))}
            </div>
         </div>

         {/* Контрольні точки */}
         <div className="flex flex-col gap-2">
            <SectionHeader title="Контрольні точки" onAdd={() => checkpoints.append({ value: "" })} />
            {checkpoints.fields.length === 0 && <p className="text-sm text-(--second-color)">Точок немає</p>}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-(--components-gap) gap-y-2">
               {checkpoints.fields.map((field, index) => (
                  <div key={field.id} className="flex items-start gap-2">
                     <div className="flex-1 min-w-0">
                        <input
                           placeholder="Напр. Якість пайки"
                           className={clsx(
                              fieldClassName,
                              "h-11",
                              errors.checkpoints?.[index]?.value && "border-red-400!",
                           )}
                           {...register(`checkpoints.${index}.value`)}
                        />
                        <FieldError message={errors.checkpoints?.[index]?.value?.message} />
                     </div>
                     <RemoveButton onClick={() => checkpoints.remove(index)} />
                  </div>
               ))}
            </div>
         </div>

         <footer className="flex flex-col-reverse sm:flex-row sm:justify-end gap-2 sm:gap-4">
            <Button type="transparent" onClick={onClose}>
               <Button.Paragraph>Скасувати</Button.Paragraph>
            </Button>
            <Button type="accentFilled" isSubmit={true}>
               <Button.Paragraph>{isPending ? "Збереження..." : "Зберегти"}</Button.Paragraph>
            </Button>
         </footer>
      </form>
   )
}
