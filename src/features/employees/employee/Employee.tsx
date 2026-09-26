import { useParams } from "react-router"
import PageHeader from "@/components/UI/PageHeader"
import { EmployeeHeader } from "./EmployeeHeader"
import { Info } from "./Info"
import { History } from "./History"
import DashboardAnalysis from "@/features/dashboard/DashboardAnalysis"
import { useLayoutMode, type LayoutMode } from "@/hooks/ui/useLayoutMode"
import { EmployeeWorkloadHeatmap } from "./EmployeeWorkloadHeatmap"
import { useProfile } from "@/hooks/api/profile/useProfile"
import Button from "@/components/UI/Button"
import { EditIcon } from "lucide-react"
import { UpdateProfileModal } from "./UpdateProfileModal"
import { useState } from "react"

const WIDE_AREAS = `
   "header header header header header header header header header header"
   "info info analysis analysis analysis analysis analysis history history history"
   "info info analysis analysis analysis analysis analysis history history history"
   "info info map map map map map history history history"
`

const MEDIUM_AREAS = `
   "header header header header header header header header header header"
   "info info info info info history history history history history"
   "map map map map map map map map map map"
   "analysis analysis analysis analysis analysis analysis analysis analysis analysis analysis"
   "chart chart chart chart chart chart chart chart chart chart"
`

const STACKED_AREAS = `
   "header header header header header header header header header header"
   "info info info info info info info info info info"
   "map map map map map map map map map map"
   "analysis analysis analysis analysis analysis analysis analysis analysis analysis analysis"
   "history history history history history history history history history history"
   "chart chart chart chart chart chart chart chart chart chart"
`

const AREAS_BY_MODE: Record<LayoutMode, string> = {
   wide: WIDE_AREAS,
   medium: MEDIUM_AREAS,
   stacked: STACKED_AREAS,
}

export function Employee() {
   const mode = useLayoutMode()
   const { id } = useParams<{ id: string }>()

   const { data: profile, isLoading: isProfileLoading } = useProfile(id)

   const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false)

   if (isProfileLoading) {
      return <p className="py-8 text-center text-(--second-color)">Завантаження...</p>
   }

   if (!profile) {
      return <p className="py-8 text-center text-(--second-color)">Працівника не знайдено</p>
   }

   return (
      <>
         <div className="flex flex-col gap-(--components-gap)">
            <div className="flex justify-between w-full">
               <PageHeader>
                  {profile.first_name} {profile.last_name}
               </PageHeader>
               <Button onClick={() => setIsUpdateModalOpen(true)} type="accent">
                  <Button.Icon Icon={EditIcon} />
                  <Button.Paragraph>Редагувати</Button.Paragraph>
               </Button>
            </div>
            <div
               className="grid grid-cols-[repeat(10,1fr)] gap-(--components-gap) w-full"
               style={{
                  gridTemplateAreas: AREAS_BY_MODE[mode],
               }}
            >
               <EmployeeHeader profile={profile} />
               <Info profile={profile} />
               <History employeeId={String(id)} profile={profile} />
               {/* <Chart stats={operationStats ?? []} isLoading={isStatsLoading} /> */}
               <DashboardAnalysis />
               <EmployeeWorkloadHeatmap employeeId={String(id)} />
            </div>
         </div>
         <UpdateProfileModal profile={profile} setIsOpen={setIsUpdateModalOpen} isOpen={isUpdateModalOpen} />
      </>
   )
}
