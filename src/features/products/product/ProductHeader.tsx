import InfoCard from "@/components/UI/InfoCard"
import { ClipboardCheck, CheckCircle2, Factory, Timer, UserCog } from "lucide-react"

export function ProductHeader() {
   return (
      <InfoCard.Wrapper style={{ gridArea: "header" }}>
         <InfoCard className="col-span-3 lg:col-span-2 4xl:col-span-1!">
            <InfoCard.Icon Icon={ClipboardCheck} />
            <InfoCard.TextWrapper>
               <InfoCard.Title>Статус</InfoCard.Title>
               <InfoCard.Value className="text-[#5B8DEF]">Очікує перевірки</InfoCard.Value>
            </InfoCard.TextWrapper>
         </InfoCard>

         <InfoCard className="col-span-3 lg:col-span-2 4xl:col-span-1!">
            <InfoCard.Icon Icon={CheckCircle2} />
            <InfoCard.TextWrapper>
               <InfoCard.Title>Прогрес</InfoCard.Title>
               <InfoCard.Value className="text-[#61D381]">100%</InfoCard.Value>
               <InfoCard.Description>Виконано операцій: 6 з 6</InfoCard.Description>
            </InfoCard.TextWrapper>
         </InfoCard>

         <InfoCard className="col-span-3 lg:col-span-2 4xl:col-span-1!">
            <InfoCard.Icon Icon={Factory} />
            <InfoCard.TextWrapper>
               <InfoCard.Title>Дільниця</InfoCard.Title>
               <InfoCard.Value>Збірний цех</InfoCard.Value>
               <InfoCard.Description>Дільниця 2</InfoCard.Description>
            </InfoCard.TextWrapper>
         </InfoCard>

         <InfoCard className="col-span-3 4xl:col-span-1!">
            <InfoCard.Icon Icon={Timer} />
            <InfoCard.TextWrapper>
               <InfoCard.Title>Час виконання</InfoCard.Title>
               <InfoCard.Value>2 години 32 хв</InfoCard.Value>
               <InfoCard.Description className="text-[#F2A65A]">Середня швидкість</InfoCard.Description>
            </InfoCard.TextWrapper>
         </InfoCard>

         <InfoCard className="col-span-6 lg:col-span-3 4xl:col-span-1!">
            <InfoCard.Icon Icon={UserCog} />
            <InfoCard.TextWrapper>
               <InfoCard.Title>Відповідальний</InfoCard.Title>
               <InfoCard.Value>Шевченко Т.</InfoCard.Value>
               <InfoCard.Description>Оператор</InfoCard.Description>
            </InfoCard.TextWrapper>
         </InfoCard>
      </InfoCard.Wrapper>
   )
}
