import PageDescription from "@/components/UI/PageDescription"
import PageHeader from "@/components/UI/PageHeader"
import { StationsHeader } from "./StationsHeader"
import { StationsTable } from "./StationsTable"

export function Stations() {
   return (
      <>
         <div>
            <PageHeader>Робочі станції</PageHeader>
            <PageDescription>Моніторинг та управління робочими місцями</PageDescription>
         </div>

         <div className="flex flex-col gap-(--components-gap)">
            <StationsHeader />
            <StationsTable />
         </div>
      </>
   )
}
