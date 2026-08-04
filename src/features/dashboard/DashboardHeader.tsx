import InfoCard from "@/components/UI/InfoCard"
import type { WithClassName } from "@/types/common"
import { PackageSearchIcon, TargetIcon, UsersIcon, TrendingUpIcon, BugIcon } from "lucide-react"

export function DashboardHeader({ className = "" }: WithClassName) {
   return (
      <InfoCard.Wrapper style={{ gridArea: "header" }} className={className}>
         <InfoCard className="col-span-3 lg:col-span-2 4xl:col-span-1!">
            <InfoCard.Icon Icon={PackageSearchIcon} />
            <InfoCard.TextWrapper>
               <InfoCard.Title>Готова продукція</InfoCard.Title>
               <InfoCard.Value>256</InfoCard.Value>
               <InfoCard.Description className="text-[#61D381]">+8.3% за сьогодні</InfoCard.Description>
            </InfoCard.TextWrapper>
         </InfoCard>

         <InfoCard className="col-span-3 lg:col-span-2 4xl:col-span-1!">
            <InfoCard.Icon Icon={TargetIcon} />
            <InfoCard.TextWrapper>
               <InfoCard.Title>Виконання плану</InfoCard.Title>
               <InfoCard.Value>94.2%</InfoCard.Value>
               <InfoCard.Description className="text-[#61D381]">+4.6% до плану</InfoCard.Description>
            </InfoCard.TextWrapper>
         </InfoCard>

         <InfoCard className="col-span-3 lg:col-span-2 4xl:col-span-1!">
            <InfoCard.Icon Icon={UsersIcon} />
            <InfoCard.TextWrapper>
               <InfoCard.Title>Потреба в персоналі</InfoCard.Title>
               <InfoCard.Value>18</InfoCard.Value>
               <InfoCard.Description className="text-[#61D381]">з 30 потрібно</InfoCard.Description>
            </InfoCard.TextWrapper>
         </InfoCard>

         <InfoCard className="col-span-3 4xl:col-span-1!">
            <InfoCard.Icon Icon={TrendingUpIcon} />
            <InfoCard.TextWrapper>
               <InfoCard.Title>Завантаження</InfoCard.Title>
               <InfoCard.Value>94.2%</InfoCard.Value>
               <InfoCard.Description className="text-[#61D381]">+5.2% за вчора</InfoCard.Description>
            </InfoCard.TextWrapper>
         </InfoCard>

         <InfoCard className="col-span-6 lg:col-span-3 4xl:col-span-1!">
            <InfoCard.Icon Icon={BugIcon} />
            <InfoCard.TextWrapper>
               <InfoCard.Title>Кількість дефектів</InfoCard.Title>
               <InfoCard.Value>20</InfoCard.Value>
               <InfoCard.Description className="text-[#F2A65A]">-10% за вчора</InfoCard.Description>
            </InfoCard.TextWrapper>
         </InfoCard>
      </InfoCard.Wrapper>
   )
}
