import InfoCard from "@/components/UI/InfoCard"
import { Activity, Gauge, Factory, ClipboardList, User } from "lucide-react"
import { useParams } from "react-router"
import { useStationSummary } from "@/hooks/api/stationAnalytics/useStationSummary"

export function StationHeader() {
   const { id } = useParams()
   const stationId = id !== undefined ? Number(id) : undefined

   const { data: summary, isLoading } = useStationSummary(stationId)

   const isActive = summary?.status === "active"

   return (
      <InfoCard.Wrapper style={{ gridArea: "header" }}>
         <InfoCard className="col-span-3 lg:col-span-2 4xl:col-span-1!">
            <InfoCard.Icon Icon={Activity} />
            <InfoCard.TextWrapper>
               <InfoCard.Title>Статус</InfoCard.Title>
               <InfoCard.Value className={isActive ? "text-(--right-color)" : "text-(--second-color)"}>
                  {isLoading || !summary ? "—" : isActive ? "Активна" : "Неактивна"}
               </InfoCard.Value>
            </InfoCard.TextWrapper>
         </InfoCard>

         <InfoCard className="col-span-3 lg:col-span-2 4xl:col-span-1!">
            <InfoCard.Icon Icon={Gauge} />
            <InfoCard.TextWrapper>
               <InfoCard.Title>Завантаження</InfoCard.Title>
               <InfoCard.Value>
                  {isLoading || !summary || summary.workload_percent === null ? "—" : `${summary.workload_percent}%`}
               </InfoCard.Value>
            </InfoCard.TextWrapper>
         </InfoCard>

         <InfoCard className="col-span-3 lg:col-span-2 4xl:col-span-1!">
            <InfoCard.Icon Icon={Factory} />
            <InfoCard.TextWrapper>
               <InfoCard.Title>Дільниця</InfoCard.Title>
               <InfoCard.Value>{isLoading ? "—" : (summary?.department_name ?? "—")}</InfoCard.Value>
               {summary?.department_description && (
                  <InfoCard.Description className="text-(--second-color)">
                     {summary.department_description}
                  </InfoCard.Description>
               )}
            </InfoCard.TextWrapper>
         </InfoCard>

         <InfoCard className="col-span-3 4xl:col-span-1!">
            <InfoCard.Icon Icon={ClipboardList} />
            <InfoCard.TextWrapper>
               <InfoCard.Title>Поточне завдання</InfoCard.Title>
               <InfoCard.Value>
                  {isLoading ? "—" : (summary?.current_task?.operation_type_name ?? "Немає завдання")}
               </InfoCard.Value>
               {summary?.current_task && (
                  <InfoCard.Description className="text-(--second-color)">
                     {summary.current_task.product_code}
                  </InfoCard.Description>
               )}
            </InfoCard.TextWrapper>
         </InfoCard>

         <InfoCard className="col-span-6 lg:col-span-3 4xl:col-span-1!">
            <InfoCard.Icon Icon={User} />
            <InfoCard.TextWrapper>
               <InfoCard.Title>Оператор</InfoCard.Title>
               <InfoCard.Value>
                  {isLoading
                     ? "—"
                     : summary?.operator
                       ? `${summary.operator.first_name} ${summary.operator.last_name}`
                       : "Не призначено"}
               </InfoCard.Value>
               {summary?.operator?.position && (
                  <InfoCard.Description className="text-(--second-color)">
                     {summary.operator.position}
                  </InfoCard.Description>
               )}
            </InfoCard.TextWrapper>
         </InfoCard>
      </InfoCard.Wrapper>
   )
}
