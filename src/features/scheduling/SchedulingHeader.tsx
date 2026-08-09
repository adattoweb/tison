import InfoCard from "@/components/UI/InfoCard"
import type { WithClassName } from "@/types/common"
import { PackageSearchIcon, TargetIcon, CheckCircle2Icon, MonitorCogIcon, ClockIcon } from "lucide-react"

export function SchedulingHeader({ className = "" }: WithClassName) {
   return (
      <InfoCard.Wrapper className={className} style={{ gridArea: "header" }}>
         <InfoCard className="col-span-3 lg:col-span-2 4xl:col-span-1!">
            <InfoCard.Icon Icon={PackageSearchIcon} />
            <InfoCard.TextWrapper>
               <InfoCard.Title>Кількість готової продукції</InfoCard.Title>
               <InfoCard.Value>1250</InfoCard.Value>
               <InfoCard.Description className="text-[#61D381]">+25 за сьогодні</InfoCard.Description>
            </InfoCard.TextWrapper>
         </InfoCard>

         <InfoCard className="col-span-3 lg:col-span-2 4xl:col-span-1!">
            <InfoCard.Icon Icon={TargetIcon} />
            <InfoCard.TextWrapper>
               <InfoCard.Title>Виконання плану</InfoCard.Title>
               <InfoCard.Value>83%</InfoCard.Value>
               <InfoCard.Description className="text-[#61D381]">1250/1500</InfoCard.Description>
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

         <InfoCard className="col-span-3 4xl:col-span-1!">
            <InfoCard.Icon Icon={MonitorCogIcon} />
            <InfoCard.TextWrapper>
               <InfoCard.Title>Завантаження дільниць</InfoCard.Title>
               <InfoCard.Value>87%</InfoCard.Value>
               <InfoCard.Description className="text-[#61D381]">на 2% менше ніж вчора</InfoCard.Description>
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
