import InfoCard from "@/components/UI/InfoCard"
import type { WithClassName } from "@/types/common"
import { WrenchIcon, PauseCircleIcon, CpuIcon, CheckCircle2Icon } from "lucide-react"

export function OperationsHeader({ className = "" }: WithClassName) {
   return (
      <InfoCard.Wrapper className={className}>
         <InfoCard className="col-span-3 lg:col-span-2 4xl:col-span-1!">
            <InfoCard.Icon Icon={WrenchIcon} />
            <InfoCard.TextWrapper>
               <InfoCard.Title>Всього операцій</InfoCard.Title>
               <InfoCard.Value>1253</InfoCard.Value>
               <InfoCard.Description className="text-[#61D381]">+25 за сьогодні</InfoCard.Description>
            </InfoCard.TextWrapper>
         </InfoCard>

         <InfoCard className="col-span-3 lg:col-span-2 4xl:col-span-1!">
            <InfoCard.Icon Icon={WrenchIcon} />
            <InfoCard.TextWrapper>
               <InfoCard.Title>Активні</InfoCard.Title>
               <InfoCard.Value>12</InfoCard.Value>
               <InfoCard.Description className="text-[#61D381]">50% за сьогодні</InfoCard.Description>
            </InfoCard.TextWrapper>
         </InfoCard>

         <InfoCard className="col-span-3 lg:col-span-2 4xl:col-span-1!">
            <InfoCard.Icon Icon={PauseCircleIcon} />
            <InfoCard.TextWrapper>
               <InfoCard.Title>Середній час</InfoCard.Title>
               <InfoCard.Value>25 хв</InfoCard.Value>
               <InfoCard.Description className="text-[#F2A65A]">+1.2 хв за вчора</InfoCard.Description>
            </InfoCard.TextWrapper>
         </InfoCard>

         <InfoCard className="col-span-3 4xl:col-span-1!">
            <InfoCard.Icon Icon={CpuIcon} />
            <InfoCard.TextWrapper>
               <InfoCard.Title>Найчастіша операція</InfoCard.Title>
               <InfoCard.Value>Тестування</InfoCard.Value>
               <InfoCard.Description className="text-[#61D381]">51% серед усіх</InfoCard.Description>
            </InfoCard.TextWrapper>
         </InfoCard>

         <InfoCard className="col-span-6 lg:col-span-3 4xl:col-span-1!">
            <InfoCard.Icon Icon={CheckCircle2Icon} />
            <InfoCard.TextWrapper>
               <InfoCard.Title>Завершено сьогодні</InfoCard.Title>
               <InfoCard.Value>47</InfoCard.Value>
               <InfoCard.Description className="text-[#61D381]">+12% до вчора</InfoCard.Description>
            </InfoCard.TextWrapper>
         </InfoCard>
      </InfoCard.Wrapper>
   )
}
