import InfoCard from "@/components/UI/InfoCard"
import { useOperationsOverview } from "@/hooks/api/operationAnalytics/useOperationOverview"
import type { WithClassName } from "@/types/common"
import { WrenchIcon, PauseCircleIcon, CpuIcon, CheckCircle2Icon } from "lucide-react"

export function OperationsHeader({ className = "" }: WithClassName) {
   const { data, isLoading } = useOperationsOverview()

   const value = (n: number | undefined | null) => (isLoading || n === undefined || n === null ? "—" : n)

   return (
      <InfoCard.Wrapper className={className}>
         <InfoCard className="col-span-3 lg:col-span-2 4xl:col-span-1!">
            <InfoCard.Icon Icon={WrenchIcon} />
            <InfoCard.TextWrapper>
               <InfoCard.Title>Всього операцій</InfoCard.Title>
               <InfoCard.Value>{value(data?.total)}</InfoCard.Value>
               <InfoCard.Description className="text-[#61D381]">
                  {isLoading || data === undefined ? "—" : `+${data.created_today} за сьогодні`}
               </InfoCard.Description>
            </InfoCard.TextWrapper>
         </InfoCard>

         <InfoCard className="col-span-3 lg:col-span-2 4xl:col-span-1!">
            <InfoCard.Icon Icon={WrenchIcon} />
            <InfoCard.TextWrapper>
               <InfoCard.Title>Активні</InfoCard.Title>
               <InfoCard.Value>{value(data?.active_count)}</InfoCard.Value>
               <InfoCard.Description className="text-[#61D381]">
                  {isLoading || data === undefined ? "—" : `${data.active_percent_of_today}% за сьогодні`}
               </InfoCard.Description>
            </InfoCard.TextWrapper>
         </InfoCard>

         <InfoCard className="col-span-3 lg:col-span-2 4xl:col-span-1!">
            <InfoCard.Icon Icon={PauseCircleIcon} />
            <InfoCard.TextWrapper>
               <InfoCard.Title>Середній час</InfoCard.Title>
               <InfoCard.Value>
                  {isLoading || !data || data.average_duration_minutes === null
                     ? "—"
                     : `${data.average_duration_minutes} хв`}
               </InfoCard.Value>
            </InfoCard.TextWrapper>
         </InfoCard>

         <InfoCard className="col-span-3 4xl:col-span-1!">
            <InfoCard.Icon Icon={CpuIcon} />
            <InfoCard.TextWrapper>
               <InfoCard.Title>Найчастіша операція</InfoCard.Title>
               <InfoCard.Value>
                  {isLoading ? "—" : (data?.most_frequent_operation_type_name ?? "Немає даних")}
               </InfoCard.Value>
               {data?.most_frequent_operation_type_percent !== null &&
                  data?.most_frequent_operation_type_percent !== undefined && (
                     <InfoCard.Description className="text-[#61D381]">
                        {data.most_frequent_operation_type_percent}% серед усіх
                     </InfoCard.Description>
                  )}
            </InfoCard.TextWrapper>
         </InfoCard>

         <InfoCard className="col-span-6 lg:col-span-3 4xl:col-span-1!">
            <InfoCard.Icon Icon={CheckCircle2Icon} />
            <InfoCard.TextWrapper>
               <InfoCard.Title>Завершено сьогодні</InfoCard.Title>
               <InfoCard.Value>{value(data?.completed_today)}</InfoCard.Value>
            </InfoCard.TextWrapper>
         </InfoCard>
      </InfoCard.Wrapper>
   )
}
