import InfoCard from "@/components/UI/InfoCard"
import type { WithClassName } from "@/types/common"

export function DefectHeader({ className = "" }: WithClassName) {
   return (
      <InfoCard.Wrapper style={{ gridArea: "header" }} className={className}>
         <InfoCard className="col-span-3 lg:col-span-2 4xl:col-span-1!">
            <InfoCard.TextWrapper>
               <InfoCard.Title>Статус</InfoCard.Title>
               <InfoCard.Value className="text-[#E36977]">Відкрито</InfoCard.Value>
            </InfoCard.TextWrapper>
         </InfoCard>

         <InfoCard className="col-span-3 lg:col-span-2 4xl:col-span-1!">
            <InfoCard.TextWrapper>
               <InfoCard.Title>Дефект</InfoCard.Title>
               <InfoCard.Value>Пайка</InfoCard.Value>
               <InfoCard.Description>Нерівний шов</InfoCard.Description>
            </InfoCard.TextWrapper>
         </InfoCard>

         <InfoCard className="col-span-3 lg:col-span-2 4xl:col-span-1!">
            <InfoCard.TextWrapper>
               <InfoCard.Title>Виріб</InfoCard.Title>
               <InfoCard.Value>ORK4-2026-1234</InfoCard.Value>
            </InfoCard.TextWrapper>
         </InfoCard>

         <InfoCard className="col-span-3 4xl:col-span-1!">
            <InfoCard.TextWrapper>
               <InfoCard.Title>Дата</InfoCard.Title>
               <InfoCard.Value>07.06.2026</InfoCard.Value>
            </InfoCard.TextWrapper>
         </InfoCard>

         <InfoCard className="col-span-6 lg:col-span-3 4xl:col-span-1!">
            <InfoCard.TextWrapper>
               <InfoCard.Title>Виявив</InfoCard.Title>
               <InfoCard.Value>Шевченко Т.</InfoCard.Value>
               <InfoCard.Description>Оператор</InfoCard.Description>
            </InfoCard.TextWrapper>
         </InfoCard>
      </InfoCard.Wrapper>
   )
}
