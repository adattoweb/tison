import { useState } from "react"
import { PlusIcon } from "lucide-react"

import PageDescription from "@/components/UI/PageDescription"
import PageHeader from "@/components/UI/PageHeader"
import Button from "@/components/UI/Button"
import { useLayoutMode, type LayoutMode } from "@/hooks/ui/useLayoutMode"
import { useCurrentUser } from "@/hooks/api/auth/useCurrentUser" // TODO: свій хук поточного користувача

import CreateProductsModal from "./CreateProductsModal"
import { AddWorkSessionModal } from "./AddWorkSessionModal"
import { CurrentSession } from "./CurrentSession"
import { CurrentProduct } from "./CurrentProduct"
import { DailySchedule } from "./DailySchedule"
import { useCurrentWorkSession } from "@/hooks/api/workSessions/useCurrentWorkSession"
import { useOperatorActiveWorkSession } from "@/hooks/api/operatorAnalytics/useOperatorActiveWorkSession"
import { Can } from "@/components/Auth/Can"

/** 5 колонок: мінімальна ширина блока 1/5, ділимо як 2/5 + 3/5 */
const WIDE_AREAS = `
   "session session schedule schedule schedule"
   "product product schedule schedule schedule"
`

const MEDIUM_AREAS = `
   "session session product product product"
   "schedule schedule schedule schedule schedule"
`

const STACKED_AREAS = `
   "session session session session session"
   "product product product product product"
   "schedule schedule schedule schedule schedule"
`

const AREAS_BY_MODE: Record<LayoutMode, string> = {
   wide: WIDE_AREAS,
   medium: MEDIUM_AREAS,
   stacked: STACKED_AREAS,
}

export function WorkPlace() {
   const mode = useLayoutMode()
   const [isCreateProductModalOpen, setIsCreateProductModalOpen] = useState(false)
   const [isAddSessionModalOpen, setIsAddSessionModalOpen] = useState(false)

   const { data: user } = useCurrentUser()
   const { data: session, isLoading: isSessionLoading } = useOperatorActiveWorkSession(user?.id)

   return (
      <>
         <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-col">
               <PageHeader>Робоче місце</PageHeader>
               <PageDescription>Керування власними сессіями</PageDescription>
            </div>
            <div className="flex gap-4">
               <Can resource="product" action="create">
                  <Button onClick={() => setIsCreateProductModalOpen(true)} type="accent" className="h-min">
                     <Button.Icon Icon={PlusIcon} />
                     <Button.Paragraph>Додати виріб</Button.Paragraph>
                  </Button>
               </Can>
               <Can resource="work_session" action="create">
                  <Button onClick={() => setIsAddSessionModalOpen(true)} type="accent" className="h-min">
                     <Button.Icon Icon={PlusIcon} />
                     <Button.Paragraph>Додати сесію</Button.Paragraph>
                  </Button>
               </Can>
            </div>
         </div>

         <div
            className="grid w-full grid-cols-5 gap-(--components-gap)"
            style={{ gridTemplateAreas: AREAS_BY_MODE[mode] }}
         >
            <CurrentSession area="session" session={session} isLoading={isSessionLoading} />
            <CurrentProduct area="product" session={session} />
            <DailySchedule area="schedule" userId={user?.id} />
         </div>

         <Can resource="product" action="create">
            <CreateProductsModal isOpen={isCreateProductModalOpen} onClose={() => setIsCreateProductModalOpen(false)} />
         </Can>

         <Can resource="work_session" action="create">
            <AddWorkSessionModal isOpen={isAddSessionModalOpen} setIsOpen={setIsAddSessionModalOpen} />
         </Can>
      </>
   )
}
