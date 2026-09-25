import InfoCard from "@/components/UI/InfoCard"
import { useOperationTypesOverview } from "@/hooks/api/operationTypeAnalytics/useOperationTypeOverview"
import type { WithClassName } from "@/types/common"
import { LayersIcon, TrendingUpIcon, BugIcon, ZapIcon, HourglassIcon } from "lucide-react"

export function OperationTypesHeader({ className = "" }: WithClassName) {
   const { data, isLoading } = useOperationTypesOverview()

   return (
      <InfoCard.Wrapper className={className}>
         <InfoCard className="col-span-3 lg:col-span-2 4xl:col-span-1!">
            <InfoCard.Icon Icon={LayersIcon} />
            <InfoCard.TextWrapper>
               <InfoCard.Title>Всього типів операцій</InfoCard.Title>
               <InfoCard.Value>{isLoading || !data ? "—" : data.total_types}</InfoCard.Value>
            </InfoCard.TextWrapper>
         </InfoCard>

         <InfoCard className="col-span-3 lg:col-span-2 4xl:col-span-1!">
            <InfoCard.Icon Icon={TrendingUpIcon} />
            <InfoCard.TextWrapper>
               <InfoCard.Title>Найпоширеніший тип</InfoCard.Title>
               <InfoCard.Value>{isLoading ? "—" : (data?.most_frequent?.name ?? "Немає даних")}</InfoCard.Value>
               {data?.most_frequent && (
                  <InfoCard.Description className="text-(--second-color)">
                     {data.most_frequent.count} операцій
                  </InfoCard.Description>
               )}
            </InfoCard.TextWrapper>
         </InfoCard>

         <InfoCard className="col-span-3 lg:col-span-2 4xl:col-span-1!">
            <InfoCard.Icon Icon={BugIcon} />
            <InfoCard.TextWrapper>
               <InfoCard.Title>Найбільше дефектів</InfoCard.Title>
               <InfoCard.Value>{isLoading ? "—" : (data?.most_defects?.name ?? "Немає даних")}</InfoCard.Value>
               {data?.most_defects && (
                  <InfoCard.Description className="text-[#E06767]">
                     {data.most_defects.count} дефектів
                  </InfoCard.Description>
               )}
            </InfoCard.TextWrapper>
         </InfoCard>

         <InfoCard className="col-span-3 4xl:col-span-1!">
            <InfoCard.Icon Icon={ZapIcon} />
            <InfoCard.TextWrapper>
               <InfoCard.Title>Найшвидший тип</InfoCard.Title>
               <InfoCard.Value>{isLoading ? "—" : (data?.fastest?.name ?? "Немає даних")}</InfoCard.Value>
               {data?.fastest && (
                  <InfoCard.Description className="text-[#61D381]">
                     ~{data.fastest.average_minutes} хв
                  </InfoCard.Description>
               )}
            </InfoCard.TextWrapper>
         </InfoCard>

         <InfoCard className="col-span-6 lg:col-span-3 4xl:col-span-1!">
            <InfoCard.Icon Icon={HourglassIcon} />
            <InfoCard.TextWrapper>
               <InfoCard.Title>Найдовший тип</InfoCard.Title>
               <InfoCard.Value>{isLoading ? "—" : (data?.slowest?.name ?? "Немає даних")}</InfoCard.Value>
               {data?.slowest && (
                  <InfoCard.Description className="text-[#F2A65A]">
                     ~{data.slowest.average_minutes} хв
                  </InfoCard.Description>
               )}
            </InfoCard.TextWrapper>
         </InfoCard>
      </InfoCard.Wrapper>
   )
}
