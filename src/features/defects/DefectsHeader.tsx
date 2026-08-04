import InfoCard from "@/components/UI/InfoCard"
import type { WithClassName } from "@/types/common"
import { BugIcon, WrenchIcon, CheckCircle2Icon, CpuIcon, ClockIcon } from "lucide-react"

export function DefectsHeader({ className = "" }: WithClassName) {
   return (
      <InfoCard.Wrapper className={className}>
         <InfoCard className="col-span-3 lg:col-span-2 4xl:col-span-1!">
            <InfoCard.Icon Icon={BugIcon} />
            <InfoCard.TextWrapper>
               <InfoCard.Title>Всього дефектів</InfoCard.Title>
               <InfoCard.Value>200</InfoCard.Value>
               <InfoCard.Description className="text-[#61D381]">+5 за сьогодні</InfoCard.Description>
            </InfoCard.TextWrapper>
         </InfoCard>

         <InfoCard className="col-span-3 lg:col-span-2 4xl:col-span-1!">
            <InfoCard.Icon Icon={WrenchIcon} />
            <InfoCard.TextWrapper>
               <InfoCard.Title>Відкритих дефектів</InfoCard.Title>
               <InfoCard.Value>100</InfoCard.Value>
               <InfoCard.Description className="text-[#ef4444]">50% від всіх</InfoCard.Description>
            </InfoCard.TextWrapper>
         </InfoCard>

         <InfoCard className="col-span-3 lg:col-span-2 4xl:col-span-1!">
            <InfoCard.Icon Icon={CheckCircle2Icon} />
            <InfoCard.TextWrapper>
               <InfoCard.Title>Закритих дефектів</InfoCard.Title>
               <InfoCard.Value>100</InfoCard.Value>
               <InfoCard.Description className="text-[#F2A65A]">50% від всіх</InfoCard.Description>
            </InfoCard.TextWrapper>
         </InfoCard>

         <InfoCard className="col-span-3 4xl:col-span-1!">
            <InfoCard.Icon Icon={CpuIcon} />
            <InfoCard.TextWrapper>
               <InfoCard.Title>Критичних дефектів</InfoCard.Title>
               <InfoCard.Value>15</InfoCard.Value>
               <InfoCard.Description className="text-[#61D381]">5% серед усіх</InfoCard.Description>
            </InfoCard.TextWrapper>
         </InfoCard>

         <InfoCard className="col-span-6 lg:col-span-3 4xl:col-span-1!">
            <InfoCard.Icon Icon={ClockIcon} />
            <InfoCard.TextWrapper>
               <InfoCard.Title>Середній час усунення</InfoCard.Title>
               <InfoCard.Value>6.4 год</InfoCard.Value>
               <InfoCard.Description className="text-[#61D381]">-1.2 год до вчора</InfoCard.Description>
            </InfoCard.TextWrapper>
         </InfoCard>
      </InfoCard.Wrapper>
   )
}
