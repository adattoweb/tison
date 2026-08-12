import InfoCard from "@/components/UI/InfoCard"
import type { WithClassName } from "@/types/common"
import { LayersIcon, RepeatIcon, ClockIcon, CheckCircle2Icon, BoxIcon } from "lucide-react"

export function ModelHeader({ className = "" }: WithClassName) {
   return (
      <InfoCard.Wrapper className={className} style={{ gridArea: "header" }}>
         <InfoCard className="col-span-3 lg:col-span-2 4xl:col-span-1!">
            <InfoCard.Icon Icon={LayersIcon} />
            <InfoCard.TextWrapper>
               <InfoCard.Title>Типи продуктів</InfoCard.Title>
               <InfoCard.Value>24</InfoCard.Value>
            </InfoCard.TextWrapper>
         </InfoCard>

         <InfoCard className="col-span-3 lg:col-span-2 4xl:col-span-1!">
            <InfoCard.Icon Icon={RepeatIcon} />
            <InfoCard.TextWrapper>
               <InfoCard.Title>Найчастіший етап</InfoCard.Title>
               <InfoCard.Value>Тестування</InfoCard.Value>
            </InfoCard.TextWrapper>
         </InfoCard>

         <InfoCard className="col-span-3 lg:col-span-2 4xl:col-span-1!">
            <InfoCard.Icon Icon={ClockIcon} />
            <InfoCard.TextWrapper>
               <InfoCard.Title>Середній час виконання</InfoCard.Title>
               <InfoCard.Value>42 хв</InfoCard.Value>
            </InfoCard.TextWrapper>
         </InfoCard>

         <InfoCard className="col-span-3 4xl:col-span-1!">
            <InfoCard.Icon Icon={BoxIcon} />
            <InfoCard.TextWrapper>
               <InfoCard.Title>Найчастіший тип моделей</InfoCard.Title>
               <InfoCard.Value>Модуль керування</InfoCard.Value>
            </InfoCard.TextWrapper>
         </InfoCard>

         <InfoCard className="col-span-6 lg:col-span-3 4xl:col-span-1!">
            <InfoCard.Icon Icon={CheckCircle2Icon} />
            <InfoCard.TextWrapper>
               <InfoCard.Title>Заповненість інструкцій</InfoCard.Title>
               <InfoCard.Value>91%</InfoCard.Value>
            </InfoCard.TextWrapper>
         </InfoCard>
      </InfoCard.Wrapper>
   )
}
