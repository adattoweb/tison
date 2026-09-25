import InfoCard from "@/components/UI/InfoCard"
import { useProductModelsOverview } from "@/hooks/api/productModelAnalytics/useProductModelOverview"
import type { WithClassName } from "@/types/common"
import { TrendingUpIcon, ZapIcon, HourglassIcon, ClockIcon, BugIcon } from "lucide-react"

export function ProductModelsHeader({ className = "" }: WithClassName) {
   const { data, isLoading } = useProductModelsOverview()

   return (
      <InfoCard.Wrapper className={className}>
         <InfoCard className="col-span-3 lg:col-span-2 4xl:col-span-1!">
            <InfoCard.Icon Icon={TrendingUpIcon} />
            <InfoCard.TextWrapper>
               <InfoCard.Title>Найвиробляюваніша модель</InfoCard.Title>
               <InfoCard.Value>{isLoading ? "—" : (data?.most_produced?.title ?? "Немає даних")}</InfoCard.Value>
               {data?.most_produced && (
                  <InfoCard.Description className="text-(--second-color)">
                     {data.most_produced.count} виробів
                  </InfoCard.Description>
               )}
            </InfoCard.TextWrapper>
         </InfoCard>

         <InfoCard className="col-span-3 lg:col-span-2 4xl:col-span-1!">
            <InfoCard.Icon Icon={ZapIcon} />
            <InfoCard.TextWrapper>
               <InfoCard.Title>Найшвидша модель</InfoCard.Title>
               <InfoCard.Value>{isLoading ? "—" : (data?.fastest?.title ?? "Немає даних")}</InfoCard.Value>
               {data?.fastest && (
                  <InfoCard.Description className="text-[#61D381]">
                     ~{data.fastest.average_minutes} хв
                  </InfoCard.Description>
               )}
            </InfoCard.TextWrapper>
         </InfoCard>

         <InfoCard className="col-span-3 lg:col-span-2 4xl:col-span-1!">
            <InfoCard.Icon Icon={HourglassIcon} />
            <InfoCard.TextWrapper>
               <InfoCard.Title>Найдовша модель</InfoCard.Title>
               <InfoCard.Value>{isLoading ? "—" : (data?.slowest?.title ?? "Немає даних")}</InfoCard.Value>
               {data?.slowest && (
                  <InfoCard.Description className="text-[#F2A65A]">
                     ~{data.slowest.average_minutes} хв
                  </InfoCard.Description>
               )}
            </InfoCard.TextWrapper>
         </InfoCard>

         <InfoCard className="col-span-3 4xl:col-span-1!">
            <InfoCard.Icon Icon={ClockIcon} />
            <InfoCard.TextWrapper>
               <InfoCard.Title>Середній час виконання</InfoCard.Title>
               <InfoCard.Value>
                  {isLoading || !data || data.average_duration_minutes === null
                     ? "—"
                     : `${data.average_duration_minutes} хв`}
               </InfoCard.Value>
            </InfoCard.TextWrapper>
         </InfoCard>

         <InfoCard className="col-span-6 lg:col-span-3 4xl:col-span-1!">
            <InfoCard.Icon Icon={BugIcon} />
            <InfoCard.TextWrapper>
               <InfoCard.Title>Відсоток дефектів</InfoCard.Title>
               <InfoCard.Value>
                  {isLoading || !data || data.defects_percent === null ? "—" : `${data.defects_percent}%`}
               </InfoCard.Value>
               <InfoCard.Description className="text-(--second-color)">на всіх операціях</InfoCard.Description>
            </InfoCard.TextWrapper>
         </InfoCard>
      </InfoCard.Wrapper>
   )
}
