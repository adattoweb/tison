import InfoCard from "@/components/UI/InfoCard"
import { Star, Wrench, TrendingUp, Coins, Award } from "lucide-react"

export function EmployeeHeader() {
   return (
      <InfoCard.Wrapper style={{ gridArea: "header" }}>
         <InfoCard className="col-span-3 lg:col-span-2 4xl:col-span-1!">
            <InfoCard.Icon Icon={Star} />
            <InfoCard.TextWrapper>
               <InfoCard.Title>Продуктивність</InfoCard.Title>
               <InfoCard.Value>98%</InfoCard.Value>
               <InfoCard.Description className="text-[#61D381]">Вище середнього</InfoCard.Description>
            </InfoCard.TextWrapper>
         </InfoCard>

         <InfoCard className="col-span-3 lg:col-span-2 4xl:col-span-1!">
            <InfoCard.Icon Icon={Wrench} />
            <InfoCard.TextWrapper>
               <InfoCard.Title>Якість роботи</InfoCard.Title>
               <InfoCard.Value>99%</InfoCard.Value>
               <InfoCard.Description className="text-[#61D381]">Вище середнього</InfoCard.Description>
            </InfoCard.TextWrapper>
         </InfoCard>

         <InfoCard className="col-span-3 lg:col-span-2 4xl:col-span-1!">
            <InfoCard.Icon Icon={TrendingUp} />
            <InfoCard.TextWrapper>
               <InfoCard.Title>Стаж роботи</InfoCard.Title>
               <InfoCard.Value>3 роки</InfoCard.Value>
            </InfoCard.TextWrapper>
         </InfoCard>

         <InfoCard className="col-span-3 4xl:col-span-1!">
            <InfoCard.Icon Icon={Coins} />
            <InfoCard.TextWrapper>
               <InfoCard.Title>Нараховано бонусів</InfoCard.Title>
               <InfoCard.Value>4500₴</InfoCard.Value>
            </InfoCard.TextWrapper>
         </InfoCard>

         <InfoCard className="col-span-6 lg:col-span-3 4xl:col-span-1!">
            <InfoCard.Icon Icon={Award} />
            <InfoCard.TextWrapper>
               <InfoCard.Title>Рейтинг</InfoCard.Title>
               <InfoCard.Value>4.9</InfoCard.Value>
               <InfoCard.Description className="text-[#61D381]">Топ команди</InfoCard.Description>
            </InfoCard.TextWrapper>
         </InfoCard>
      </InfoCard.Wrapper>
   )
}
