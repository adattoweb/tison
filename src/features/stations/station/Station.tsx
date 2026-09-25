import { useNavigate, useParams } from "react-router"
import PageHeader from "@/components/UI/PageHeader"
import { ErrorPage } from "@/components/ErrorPage/ErrorPage"
import PageDescription from "@/components/UI/PageDescription"
import { useLayoutMode, type LayoutMode } from "@/hooks/ui/useLayoutMode"
import { StationHeader } from "./StationHeader"
import { Info } from "./Info"
import Button from "@/components/UI/Button"
import { EditIcon, Trash } from "lucide-react"
import { useStation } from "@/hooks/api/station/useStation"
import { useState } from "react"
import { UpdateStationModal } from "./UpdateStationModal"
import { useDeleteStation } from "@/hooks/api/station/useDeleteStation"
import { ConfirmModal } from "@/components/Modal/ConfirmModal"
import { useToast } from "@/components/Toast/useToast"
import { TOAST_DURATION } from "@/constants/app"
import { Heatmap } from "./Heatmap"
import { RecentProductsTable } from "./RecentProductsTable"
import { RecentWorkSessionsTable } from "./RecentWorkSessionsTable"

const WIDE_AREAS = `
   "header header header header header header header header header header"
   "info info info table table table table table table table"
   "heatmap heatmap heatmap history history history history history history history"
`

const MEDIUM_AREAS = `
   "header header header header header header header header header header"
   "info info info info info heatmap heatmap heatmap heatmap heatmap"
   "table table table table table table table table table table"
   "history history history history history history history history history history"
`

const STACKED_AREAS = `
   "header header header header header header header header header header"
   "info info info info info info info info info info"
   "heatmap heatmap heatmap heatmap heatmap heatmap heatmap heatmap heatmap heatmap"
   "table table table table table table table table table table"
   "history history history history history history history history history history"
`

const AREAS_BY_MODE: Record<LayoutMode, string> = {
   wide: WIDE_AREAS,
   medium: MEDIUM_AREAS,
   stacked: STACKED_AREAS,
}

export function Station() {
   const mode = useLayoutMode()
   const { id } = useParams()
   const { data: station } = useStation(Number(id))
   const { mutate: doDelete } = useDeleteStation()
   const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false)
   const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false)
   const { addToast } = useToast()
   const navigate = useNavigate()
   const onDelete = () => {
      doDelete(Number(id), {
         onSuccess: () => {
            addToast("Успішно видалено станцію!", { type: "success", duration: TOAST_DURATION })
            navigate("/stations")
         },
      })
   }
   if (station === undefined) return <ErrorPage />
   return (
      <div className="flex flex-col gap-(--components-gap)">
         <div className="flex justify-between items-center">
            <div className="flex flex-col">
               <PageHeader>{station.code}</PageHeader>
               <PageDescription>{station.department.name}</PageDescription>
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
            style={{
               gridTemplateAreas: AREAS_BY_MODE[mode],
            }}
         >
            <StationHeader />
            <Info station={station} />
            {/* <History /> */}
            {/* <StationTable station={station} /> */}
            {/* <HourlyLoadChart /> */}
            <Heatmap stationId={station.id} />
            <RecentProductsTable stationId={station.id} />
            <RecentWorkSessionsTable stationId={station.id} />
         </div>
         <UpdateStationModal isOpen={isUpdateModalOpen} setIsOpen={setIsUpdateModalOpen} station={station} />
         <ConfirmModal
            isOpen={isConfirmModalOpen}
            onClose={() => setIsConfirmModalOpen(false)}
            onConfirm={onDelete}
            title="Видалити станцію"
            description="Ви впевнені, що хочете видалити станцію?"
         />
      </div>
   )
}
