import { useParams } from "react-router"
import PageHeader from "@/components/UI/PageHeader"
import { ErrorPage } from "@/components/ErrorPage/ErrorPage"
import PageDescription from "@/components/UI/PageDescription"
import { useLayoutMode, type LayoutMode } from "@/hooks/ui/useLayoutMode"
import { StationHeader } from "./StationHeader"
import { Info } from "./Info"
import { History } from "@/features/employees/employee/History"
import { StationTable } from "./StationTable"
import HourlyLoadChart from "./Chart"
import Button from "@/components/UI/Button"
import { mockClick } from "@/utils/mockClick"
import { EditIcon, Trash } from "lucide-react"
import { useStation } from "@/hooks/api/station/useStation"
import { useState } from "react"
import { UpdateStationModal } from "./UpdateStationModal"

const WIDE_AREAS = `
   "header header header header header header header header header header"
   "info info info history history history table table table table"
   "chart chart chart history history history table table table table"
`

const MEDIUM_AREAS = `
   "header header header header header header header header header header"
   "info info info info info history history history history history"
   "chart chart chart chart chart history history history history history"
   "table table table table table table table table table table"
`

const STACKED_AREAS = `
   "header header header header header header header header header header"
   "info info info info info info info info info info"
   "chart chart chart chart chart chart chart chart chart chart"
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
   const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false)
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
               <Button onClick={mockClick} type="accent" className="h-min bg-(--accent-color) text-black">
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
            <StationTable station={station} />
            <HourlyLoadChart />
         </div>
         <UpdateStationModal isOpen={isUpdateModalOpen} setIsOpen={setIsUpdateModalOpen} station={station} />
      </div>
   )
}
