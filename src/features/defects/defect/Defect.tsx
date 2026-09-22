import { useNavigate, useParams } from "react-router"
import PageHeader from "@/components/UI/PageHeader"
import { ErrorPage } from "@/components/ErrorPage/ErrorPage"
import PageDescription from "@/components/UI/PageDescription"
import { useLayoutMode, type LayoutMode } from "@/hooks/ui/useLayoutMode"
import Button from "@/components/UI/Button"
import { EditIcon, Trash } from "lucide-react"
import { useDefect } from "@/hooks/api/defects/useDefect"
import { useOperation } from "@/hooks/api/operations/useOperation"
import { DefectHeader } from "./DefectHeader"
import { Info } from "./Info"
import { DefectStats } from "./DefectStats"
import { DefectAnalysis } from "./DefectAnalysis"
import { DefectOperation } from "./DefectOperation"
import { DefectResponsible } from "./DefectResponsible"
import { History } from "./History"
import { useDeleteDefect } from "@/hooks/api/defects/useDeleteDefect"
import { useState } from "react"
import { UpdateDefectModal } from "./UpdateDefectModal"
import { ConfirmModal } from "@/components/Modal/ConfirmModal"
import { useToast } from "@/components/Toast/useToast"
import { TOAST_DURATION } from "@/constants/app"

const WIDE_AREAS = `
   "header header header header header header header header header header"
   "info info info responsible responsible operation operation history history history"
   "info info info analysis analysis stats stats history history history"
   `

const MEDIUM_AREAS = `
   "header header header header header header header header header header"
   "info info info info info info info info info info"
   "info info info info info info info info info info"
   "analysis analysis analysis analysis analysis stats stats stats stats stats"
   "operation operation operation operation operation responsible responsible responsible responsible responsible"
   "history history history history history history history history history history"`

const STACKED_AREAS = `
   "header header header header header header header header header header"
   "info info info info info info info info info info"
   "analysis analysis analysis analysis analysis analysis analysis analysis analysis analysis"
   "stats stats stats stats stats stats stats stats stats stats"
   "responsible responsible responsible responsible responsible responsible responsible responsible responsible responsible"
   "operation operation operation operation operation operation operation operation operation operation"
   "history history history history history history history history history history"`

const AREAS_BY_MODE: Record<LayoutMode, string> = {
   wide: WIDE_AREAS,
   medium: MEDIUM_AREAS,
   stacked: STACKED_AREAS,
}

export function Defect() {
   const mode = useLayoutMode()
   const { id } = useParams()

   // "abc" або відсутній id дають undefined, і запит не виконується
   const parsedId = id !== undefined ? Number(id) : NaN
   const defectId = Number.isInteger(parsedId) ? parsedId : undefined

   const { data: defect, isLoading, isError } = useDefect(defectId)
   const { data: operation } = useOperation(defect?.operation_id)

   const { mutate: doDelete } = useDeleteDefect()
   const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false)
   const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false)
   const { addToast } = useToast()
   const navigate = useNavigate()
   const onDelete = () => {
      doDelete(Number(id), {
         onSuccess: () => addToast("Успішно видалено дефект", { type: "success", duration: TOAST_DURATION }),
      })
      navigate("/defects")
   }

   if (defectId === undefined || isError) return <ErrorPage />

   if (isLoading || !defect) {
      return <p className="py-8 text-center text-(--second-color)">Завантаження...</p>
   }

   return (
      <>
         <div className="flex flex-col gap-(--components-gap)">
            <div className="flex justify-between items-center">
               <div className="flex flex-col">
                  <PageHeader>{defect.code}</PageHeader>
                  <PageDescription>
                     {operation?.station ? `Станція ${operation.station.code}` : defect.title}
                  </PageDescription>
               </div>
               <div className="flex gap-4">
                  <Button onClick={() => setIsUpdateModalOpen(true)} type="accent" className="h-min">
                     <Button.Icon Icon={EditIcon} />
                     <Button.Paragraph>Редагувати</Button.Paragraph>
                  </Button>
                  <Button
                     onClick={() => setIsConfirmModalOpen(true)}
                     type="accent"
                     className="h-min bg-(--accent-color) text-black"
                  >
                     <Button.Icon Icon={Trash} className="stroke-black!" />
                     <Button.Paragraph>Видалити</Button.Paragraph>
                  </Button>
               </div>
            </div>
            <div
               className="grid grid-cols-[repeat(10,1fr)] gap-(--components-gap) w-full"
               style={{ gridTemplateAreas: AREAS_BY_MODE[mode] }}
            >
               <DefectHeader defect={defect} operation={operation} />
               <Info defect={defect} operation={operation} />
               <DefectStats operationId={defect.operation_id} />
               <DefectAnalysis />
               <DefectOperation operation={operation} />
               <DefectResponsible defect={defect} operation={operation} />
               <History defect={defect} />
            </div>
         </div>
         <UpdateDefectModal defect={defect} isOpen={isUpdateModalOpen} onClose={() => setIsUpdateModalOpen(false)} />
         <ConfirmModal
            isOpen={isConfirmModalOpen}
            onClose={() => setIsConfirmModalOpen(false)}
            onConfirm={onDelete}
            title="Видалити дефект"
            description="Ви впевнені, що хочете видалити дефект?"
         />
      </>
   )
}
