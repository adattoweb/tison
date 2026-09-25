import InfoCard from "@/components/UI/InfoCard"
import type { WithClassName } from "@/types/common"
import { MonitorCogIcon, WrenchIcon, CheckCircle2Icon, PauseCircleIcon } from "lucide-react"
import { useStationsOverview } from "@/hooks/api/stationAnalytics/useStationsOverview"

function percentOf(value: number, total: number): number {
   return total > 0 ? Math.round((value / total) * 100) : 0
}

export function StationsHeader({ className = "" }: WithClassName) {
   const { data, isLoading } = useStationsOverview()

   const total = data?.total ?? 0
   const value = (n: number | undefined) => (isLoading || n === undefined ? "—" : n)

   return (
      <InfoCard.Wrapper className={className}>
         <InfoCard className="col-span-3 lg:col-span-2 4xl:col-span-1!">
            <InfoCard.Icon Icon={MonitorCogIcon} />
            <InfoCard.TextWrapper>
               <InfoCard.Title>Всього станцій</InfoCard.Title>
               <InfoCard.Value>{value(data?.total)}</InfoCard.Value>
            </InfoCard.TextWrapper>
         </InfoCard>

         <InfoCard className="col-span-3 lg:col-span-2 4xl:col-span-1!">
            <InfoCard.Icon Icon={WrenchIcon} />
            <InfoCard.TextWrapper>
               <InfoCard.Title>Активні</InfoCard.Title>
               <InfoCard.Value>{value(data?.active)}</InfoCard.Value>
               <InfoCard.Description className="text-[#61D381]">
                  {isLoading || data === undefined ? "—" : `${percentOf(data.active, total)}% від всіх`}
               </InfoCard.Description>
            </InfoCard.TextWrapper>
         </InfoCard>

         <InfoCard className="col-span-3 lg:col-span-2 4xl:col-span-1!">
            <InfoCard.Icon Icon={CheckCircle2Icon} />
            <InfoCard.TextWrapper>
               <InfoCard.Title>Загальна ефективність</InfoCard.Title>
               <InfoCard.Value>
                  {isLoading || data === undefined ? "—" : `${data.average_workload_percent}%`}
               </InfoCard.Value>
            </InfoCard.TextWrapper>
         </InfoCard>

         <InfoCard className="col-span-3 4xl:col-span-1!">
            <InfoCard.Icon Icon={MonitorCogIcon} />
            <InfoCard.TextWrapper>
               <InfoCard.Title>Найпродуктивніша станція</InfoCard.Title>
               <InfoCard.Value>{isLoading ? "—" : (data?.top_station?.code ?? "Немає даних")}</InfoCard.Value>
               {data?.top_station && (
                  <InfoCard.Description className="text-[#61D381]">
                     на {Math.abs(data.top_station.diff_from_rest_percent)}%{" "}
                     {data.top_station.diff_from_rest_percent >= 0 ? "більше" : "менше"} ніж інші
                  </InfoCard.Description>
               )}
            </InfoCard.TextWrapper>
         </InfoCard>

         <InfoCard className="col-span-6 lg:col-span-3 4xl:col-span-1!">
            <InfoCard.Icon Icon={PauseCircleIcon} />
            <InfoCard.TextWrapper>
               <InfoCard.Title>Станцій у простої</InfoCard.Title>
               <InfoCard.Value>{value(data?.idle)}</InfoCard.Value>
               <InfoCard.Description className="text-[#61D381]">
                  {isLoading || data === undefined ? "—" : `${percentOf(data.idle, total)}% від всіх`}
               </InfoCard.Description>
            </InfoCard.TextWrapper>
         </InfoCard>
      </InfoCard.Wrapper>
   )
}
