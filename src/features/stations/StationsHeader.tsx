import InfoCard from "@/components/UI/InfoCard"
import type { WithClassName } from "@/types/common"
import { MonitorCogIcon, WrenchIcon, CheckCircle2Icon, PauseCircleIcon } from "lucide-react"

export function StationsHeader({ className = "" }: WithClassName) {
   return (
      <InfoCard.Wrapper className={className}>
         <InfoCard className="col-span-3 lg:col-span-2 4xl:col-span-1!">
            <InfoCard.Icon Icon={MonitorCogIcon} />
            <InfoCard.TextWrapper>
               <InfoCard.Title>Всього станцій</InfoCard.Title>
               <InfoCard.Value>7</InfoCard.Value>
               <InfoCard.Description className="text-[#61D381]">STATION-02</InfoCard.Description>
            </InfoCard.TextWrapper>
         </InfoCard>

         <InfoCard className="col-span-3 lg:col-span-2 4xl:col-span-1!">
            <InfoCard.Icon Icon={WrenchIcon} />
            <InfoCard.TextWrapper>
               <InfoCard.Title>Активні</InfoCard.Title>
               <InfoCard.Value>7</InfoCard.Value>
               <InfoCard.Description className="text-[#61D381]">100% від всіх</InfoCard.Description>
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
               <InfoCard.Title>Найпродуктивніша станція</InfoCard.Title>
               <InfoCard.Value>STATION-02</InfoCard.Value>
               <InfoCard.Description className="text-[#61D381]">на 10% більше ніж інші</InfoCard.Description>
            </InfoCard.TextWrapper>
         </InfoCard>

         <InfoCard className="col-span-6 lg:col-span-3 4xl:col-span-1!">
            <InfoCard.Icon Icon={PauseCircleIcon} />
            <InfoCard.TextWrapper>
               <InfoCard.Title>Станцій у простої</InfoCard.Title>
               <InfoCard.Value>0</InfoCard.Value>
               <InfoCard.Description className="text-[#61D381]">0% від всіх</InfoCard.Description>
            </InfoCard.TextWrapper>
         </InfoCard>
      </InfoCard.Wrapper>
   )
}
