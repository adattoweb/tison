import InfoCard from "@/components/UI/InfoCard"
import type { WithClassName } from "@/types/common"
import { PackageSearchIcon, WrenchIcon, PauseCircleIcon, BugIcon, PackageCheckIcon } from "lucide-react"

export function ProductsHeader({ className = "" }: WithClassName) {
   return (
      <InfoCard.Wrapper className={className}>
         <InfoCard className="col-span-3 lg:col-span-2 4xl:col-span-1!">
            <InfoCard.Icon Icon={PackageSearchIcon} />
            <InfoCard.TextWrapper>
               <InfoCard.Title>Всього виробів</InfoCard.Title>
               <InfoCard.Value>200</InfoCard.Value>
               <InfoCard.Description className="text-[#61D381]">+5 за сьогодні</InfoCard.Description>
            </InfoCard.TextWrapper>
         </InfoCard>

         <InfoCard className="col-span-3 lg:col-span-2 4xl:col-span-1!">
            <InfoCard.Icon Icon={WrenchIcon} />
            <InfoCard.TextWrapper>
               <InfoCard.Title>Виробляються</InfoCard.Title>
               <InfoCard.Value>8</InfoCard.Value>
               <InfoCard.Description className="text-[#F2A65A]">4% від всіх</InfoCard.Description>
            </InfoCard.TextWrapper>
         </InfoCard>

         <InfoCard className="col-span-3 lg:col-span-2 4xl:col-span-1!">
            <InfoCard.Icon Icon={PauseCircleIcon} />
            <InfoCard.TextWrapper>
               <InfoCard.Title>Очікують перевірки</InfoCard.Title>
               <InfoCard.Value>10</InfoCard.Value>
               <InfoCard.Description className="text-[#F2A65A]">5% від всіх</InfoCard.Description>
            </InfoCard.TextWrapper>
         </InfoCard>

         <InfoCard className="col-span-3 4xl:col-span-1!">
            <InfoCard.Icon Icon={BugIcon} />
            <InfoCard.TextWrapper>
               <InfoCard.Title>Брак</InfoCard.Title>
               <InfoCard.Value>2</InfoCard.Value>
               <InfoCard.Description className="text-[#F2A65A]">1% від всіх</InfoCard.Description>
            </InfoCard.TextWrapper>
         </InfoCard>

         <InfoCard className="col-span-6 lg:col-span-3 4xl:col-span-1!">
            <InfoCard.Icon Icon={PackageCheckIcon} />
            <InfoCard.TextWrapper>
               <InfoCard.Title>Готово до відвантаження</InfoCard.Title>
               <InfoCard.Value>180</InfoCard.Value>
               <InfoCard.Description className="text-[#61D381]">90% від всіх</InfoCard.Description>
            </InfoCard.TextWrapper>
         </InfoCard>
      </InfoCard.Wrapper>
   )
}
