import InfoCard from "@/components/UI/InfoCard"
import type { WithClassName } from "@/types/common"
import { BugIcon, WrenchIcon, CheckCircle2Icon, CpuIcon, ClockIcon } from "lucide-react"
import { useDefectsOverview } from "@/hooks/api/defectAnalytics/useDefectsOverview"

function percentOf(value: number, total: number): number {
   return total > 0 ? Math.round((value / total) * 100) : 0
}

export function DefectsHeader({ className = "" }: WithClassName) {
   const { data, isLoading } = useDefectsOverview()

   const total = data?.total ?? 0
   const value = (n: number | undefined) => (isLoading || n === undefined ? "—" : n)

   return (
      <InfoCard.Wrapper className={className}>
         <InfoCard className="col-span-3 lg:col-span-2 4xl:col-span-1!">
            <InfoCard.Icon Icon={BugIcon} />
            <InfoCard.TextWrapper>
               <InfoCard.Title>Всього дефектів</InfoCard.Title>
               <InfoCard.Value>{value(data?.total)}</InfoCard.Value>
               <InfoCard.Description className="text-[#61D381]">
                  {isLoading || data === undefined ? "—" : `+${data.created_today} за сьогодні`}
               </InfoCard.Description>
            </InfoCard.TextWrapper>
         </InfoCard>

         <InfoCard className="col-span-3 lg:col-span-2 4xl:col-span-1!">
            <InfoCard.Icon Icon={WrenchIcon} />
            <InfoCard.TextWrapper>
               <InfoCard.Title>Відкритих дефектів</InfoCard.Title>
               <InfoCard.Value>{value(data?.open_count)}</InfoCard.Value>
               <InfoCard.Description className="text-[#ef4444]">
                  {isLoading || data === undefined ? "—" : `${percentOf(data.open_count, total)}% від всіх`}
               </InfoCard.Description>
            </InfoCard.TextWrapper>
         </InfoCard>

         <InfoCard className="col-span-3 lg:col-span-2 4xl:col-span-1!">
            <InfoCard.Icon Icon={CheckCircle2Icon} />
            <InfoCard.TextWrapper>
               <InfoCard.Title>Закритих дефектів</InfoCard.Title>
               <InfoCard.Value>{value(data?.closed_count)}</InfoCard.Value>
               <InfoCard.Description className="text-[#F2A65A]">
                  {isLoading || data === undefined ? "—" : `${percentOf(data.closed_count, total)}% від всіх`}
               </InfoCard.Description>
            </InfoCard.TextWrapper>
         </InfoCard>

         <InfoCard className="col-span-3 4xl:col-span-1!">
            <InfoCard.Icon Icon={CpuIcon} />
            <InfoCard.TextWrapper>
               <InfoCard.Title>Критичних дефектів</InfoCard.Title>
               <InfoCard.Value>{value(data?.critical_count)}</InfoCard.Value>
               <InfoCard.Description className="text-[#61D381]">
                  {isLoading || data === undefined ? "—" : `${percentOf(data.critical_count, total)}% серед усіх`}
               </InfoCard.Description>
            </InfoCard.TextWrapper>
         </InfoCard>

         <InfoCard className="col-span-6 lg:col-span-3 4xl:col-span-1!">
            <InfoCard.Icon Icon={ClockIcon} />
            <InfoCard.TextWrapper>
               <InfoCard.Title>Середній час усунення</InfoCard.Title>
               <InfoCard.Value>
                  {isLoading || !data || data.average_resolution_hours === null
                     ? "—"
                     : `${data.average_resolution_hours} год`}
               </InfoCard.Value>
            </InfoCard.TextWrapper>
         </InfoCard>
      </InfoCard.Wrapper>
   )
}
