import InfoCard from "@/components/UI/InfoCard"
import type { WithClassName } from "@/types/common"
import { TargetIcon, CheckCircle2Icon, BugIcon, WrenchIcon, ClockIcon } from "lucide-react"

export function AnalyticsHeader({ className = "" }: WithClassName) {
   return (
      <InfoCard.Wrapper className={className}>
         <InfoCard className="col-span-3 lg:col-span-2 4xl:col-span-1!">
            <InfoCard.Icon Icon={TargetIcon} />
            <InfoCard.TextWrapper>
               <InfoCard.Title>Виконання плану</InfoCard.Title>
               <InfoCard.Value>102%</InfoCard.Value>
               <InfoCard.Description className="text-[#61D381]">+1% за період</InfoCard.Description>
            </InfoCard.TextWrapper>
         </InfoCard>

         <InfoCard className="col-span-3 lg:col-span-2 4xl:col-span-1!">
            <InfoCard.Icon Icon={CheckCircle2Icon} />
            <InfoCard.TextWrapper>
               <InfoCard.Title>Загальна ефективність</InfoCard.Title>
               <InfoCard.Value>95.4%</InfoCard.Value>
               <InfoCard.Description className="text-[#61D381]">+1% за період</InfoCard.Description>
            </InfoCard.TextWrapper>
         </InfoCard>

         <InfoCard className="col-span-3 lg:col-span-2 4xl:col-span-1!">
            <InfoCard.Icon Icon={BugIcon} />
            <InfoCard.TextWrapper>
               <InfoCard.Title>Дефектів за період</InfoCard.Title>
               <InfoCard.Value>35</InfoCard.Value>
               <InfoCard.Description className="text-[#61D381]">-2 за період</InfoCard.Description>
            </InfoCard.TextWrapper>
         </InfoCard>

         <InfoCard className="col-span-3 4xl:col-span-1!">
            <InfoCard.Icon Icon={WrenchIcon} />
            <InfoCard.TextWrapper>
               <InfoCard.Title>Завантаження</InfoCard.Title>
               <InfoCard.Value>87%</InfoCard.Value>
               <InfoCard.Description className="text-[#61D381]">+5.2% за період</InfoCard.Description>
            </InfoCard.TextWrapper>
         </InfoCard>

         <InfoCard className="col-span-6 lg:col-span-3 4xl:col-span-1!">
            <InfoCard.Icon Icon={ClockIcon} />
            <InfoCard.TextWrapper>
               <InfoCard.Title>Час простою</InfoCard.Title>
               <InfoCard.Value>3.2 год</InfoCard.Value>
               <InfoCard.Description className="text-[#61D381]">-0.8 год за період</InfoCard.Description>
            </InfoCard.TextWrapper>
         </InfoCard>
      </InfoCard.Wrapper>
   )
}
