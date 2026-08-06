import InfoCard from "@/components/UI/InfoCard"
import { Activity, Gauge, Factory, ClipboardList, User } from "lucide-react"

export function StationHeader() {
   return (
      <InfoCard.Wrapper style={{ gridArea: "station-header" }}>
         <InfoCard className="col-span-3 lg:col-span-2 4xl:col-span-1!">
            <InfoCard.Icon Icon={Activity} />
            <InfoCard.TextWrapper>
               <InfoCard.Title>Статус</InfoCard.Title>
               <InfoCard.Value className="text-(--right-color)">Активна</InfoCard.Value>
            </InfoCard.TextWrapper>
         </InfoCard>

         <InfoCard className="col-span-3 lg:col-span-2 4xl:col-span-1!">
            <InfoCard.Icon Icon={Gauge} />
            <InfoCard.TextWrapper>
               <InfoCard.Title>Завантаження</InfoCard.Title>
               <InfoCard.Value>95%</InfoCard.Value>
            </InfoCard.TextWrapper>
         </InfoCard>

         <InfoCard className="col-span-3 lg:col-span-2 4xl:col-span-1!">
            <InfoCard.Icon Icon={Factory} />
            <InfoCard.TextWrapper>
               <InfoCard.Title>Дільниця</InfoCard.Title>
               <InfoCard.Value>Виробництво</InfoCard.Value>
               <InfoCard.Description className="text-(--second-color)">Механічний цех</InfoCard.Description>
            </InfoCard.TextWrapper>
         </InfoCard>

         <InfoCard className="col-span-3 4xl:col-span-1!">
            <InfoCard.Icon Icon={ClipboardList} />
            <InfoCard.TextWrapper>
               <InfoCard.Title>Поточне завдання</InfoCard.Title>
               <InfoCard.Value>Пайка компонентів</InfoCard.Value>
               <InfoCard.Description className="text-(--second-color)">ORK4-2026-1234</InfoCard.Description>
            </InfoCard.TextWrapper>
         </InfoCard>

         <InfoCard className="col-span-6 lg:col-span-3 4xl:col-span-1!">
            <InfoCard.Icon Icon={User} />
            <InfoCard.TextWrapper>
               <InfoCard.Title>Оператор</InfoCard.Title>
               <InfoCard.Value>Шевченко Т.</InfoCard.Value>
               <InfoCard.Description className="text-(--second-color)">EMP-1024</InfoCard.Description>
            </InfoCard.TextWrapper>
         </InfoCard>
      </InfoCard.Wrapper>
   )
}
