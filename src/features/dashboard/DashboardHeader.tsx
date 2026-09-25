import InfoCard from "@/components/UI/InfoCard"
import type { WithClassName } from "@/types/common"
import { PackageCheckIcon, TargetIcon, UsersIcon, TrendingUpIcon, BugIcon } from "lucide-react"
import { useDashboardOverview } from "@/hooks/api/dashboardAnalytics/useDashboardOverview"

export function DashboardHeader({ className = "" }: WithClassName) {
   const { data, isLoading } = useDashboardOverview()

   return (
      <InfoCard.Wrapper style={{ gridArea: "header" }} className={className}>
         <InfoCard className="col-span-3 lg:col-span-2 4xl:col-span-1!">
            <InfoCard.Icon Icon={PackageCheckIcon} />
            <InfoCard.TextWrapper>
               <InfoCard.Title>Готова продукція</InfoCard.Title>
               <InfoCard.Value>{isLoading || !data ? "—" : data.ready_products}</InfoCard.Value>
            </InfoCard.TextWrapper>
         </InfoCard>

         <InfoCard className="col-span-3 lg:col-span-2 4xl:col-span-1!">
            <InfoCard.Icon Icon={TargetIcon} />
            <InfoCard.TextWrapper>
               <InfoCard.Title>Виконання плану</InfoCard.Title>
               <InfoCard.Value>
                  {isLoading || !data || data.plan_completion_percent === null
                     ? "—"
                     : `${data.plan_completion_percent}%`}
               </InfoCard.Value>
            </InfoCard.TextWrapper>
         </InfoCard>

         <InfoCard className="col-span-3 lg:col-span-2 4xl:col-span-1!">
            <InfoCard.Icon Icon={UsersIcon} />
            <InfoCard.TextWrapper>
               <InfoCard.Title>Станцій у простої</InfoCard.Title>
               <InfoCard.Value>{isLoading || !data ? "—" : data.idle_stations}</InfoCard.Value>
               <InfoCard.Description className="text-(--second-color)">
                  {isLoading || !data ? "—" : `з ${data.total_active_stations} активних`}
               </InfoCard.Description>
            </InfoCard.TextWrapper>
         </InfoCard>

         <InfoCard className="col-span-3 4xl:col-span-1!">
            <InfoCard.Icon Icon={TrendingUpIcon} />
            <InfoCard.TextWrapper>
               <InfoCard.Title>Завантаження</InfoCard.Title>
               <InfoCard.Value>{isLoading || !data ? "—" : `${data.workload_percent}%`}</InfoCard.Value>
            </InfoCard.TextWrapper>
         </InfoCard>

         <InfoCard className="col-span-6 lg:col-span-3 4xl:col-span-1!">
            <InfoCard.Icon Icon={BugIcon} />
            <InfoCard.TextWrapper>
               <InfoCard.Title>Кількість дефектів</InfoCard.Title>
               <InfoCard.Value>{isLoading || !data ? "—" : data.open_defects}</InfoCard.Value>
               <InfoCard.Description className="text-(--second-color)">відкритих зараз</InfoCard.Description>
            </InfoCard.TextWrapper>
         </InfoCard>
      </InfoCard.Wrapper>
   )
}
