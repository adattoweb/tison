// ProductHeader.tsx

import clsx from "clsx"
import type { ProductSpeed, ProductSummary } from "@/api/types/productionAnalytics"
import InfoCard from "@/components/UI/InfoCard"
import { useProductSummary } from "@/hooks/api/productionAnalytics/useProductSummary"
import { ClipboardCheck, CheckCircle2, Factory, Timer, UserCog } from "lucide-react"

const SPEED_META: Record<ProductSpeed, { label: string; className: string }> = {
   fast: { label: "Швидше середнього", className: "text-[#61D381]" },
   average: { label: "Середня швидкість", className: "text-[#F2A65A]" },
   slow: { label: "Повільніше середнього", className: "text-[#E06767]" },
}

function getStatusDisplay(summary: ProductSummary): { label: string; className: string } {
   if (summary.status === "DONE") return { label: "Завершено", className: "text-[#61D381]" }
   if (summary.status === "ACTIVE" && summary.completed_steps >= summary.total_steps) {
      return { label: "Очікує перевірки", className: "text-[#5B8DEF]" }
   }
   if (summary.status === "ACTIVE") return { label: "У виробництві", className: "text-[#F2A65A]" }
   return { label: "Очікує початку", className: "text-(--second-color)" }
}

function formatDuration(totalSeconds: number): string {
   const hours = Math.floor(totalSeconds / 3600)
   const minutes = Math.floor((totalSeconds % 3600) / 60)
   if (hours === 0) return `${minutes} хв`
   if (minutes === 0) return `${hours} год`
   return `${hours} год ${minutes} хв`
}

interface ProductHeaderProps {
   productId: number
}

export function ProductHeader({ productId }: ProductHeaderProps) {
   const { data: summary, isLoading } = useProductSummary(productId)

   const status = summary ? getStatusDisplay(summary) : null
   const speed = summary?.speed ? SPEED_META[summary.speed] : null

   return (
      <InfoCard.Wrapper style={{ gridArea: "header" }}>
         <InfoCard className="col-span-3 lg:col-span-2 4xl:col-span-1!">
            <InfoCard.Icon Icon={ClipboardCheck} />
            <InfoCard.TextWrapper>
               <InfoCard.Title>Статус</InfoCard.Title>
               <InfoCard.Value className={clsx(status?.className)}>
                  {isLoading ? "—" : (status?.label ?? "—")}
               </InfoCard.Value>
            </InfoCard.TextWrapper>
         </InfoCard>

         <InfoCard className="col-span-3 lg:col-span-2 4xl:col-span-1!">
            <InfoCard.Icon Icon={CheckCircle2} />
            <InfoCard.TextWrapper>
               <InfoCard.Title>Прогрес</InfoCard.Title>
               <InfoCard.Value className="text-[#61D381]">
                  {isLoading || !summary ? "—" : `${summary.progress}%`}
               </InfoCard.Value>
               <InfoCard.Description>
                  {isLoading || !summary
                     ? "Виконано операцій: — з —"
                     : `Виконано операцій: ${summary.completed_steps} з ${summary.total_steps}`}
               </InfoCard.Description>
            </InfoCard.TextWrapper>
         </InfoCard>

         <InfoCard className="col-span-3 lg:col-span-2 4xl:col-span-1!">
            <InfoCard.Icon Icon={Factory} />
            <InfoCard.TextWrapper>
               <InfoCard.Title>Дільниця</InfoCard.Title>
               <InfoCard.Value>{isLoading ? "—" : (summary?.department_name ?? "Не призначено")}</InfoCard.Value>
            </InfoCard.TextWrapper>
         </InfoCard>

         <InfoCard className="col-span-3 4xl:col-span-1!">
            <InfoCard.Icon Icon={Timer} />
            <InfoCard.TextWrapper>
               <InfoCard.Title>Час виконання</InfoCard.Title>
               <InfoCard.Value>{isLoading || !summary ? "—" : formatDuration(summary.duration_seconds)}</InfoCard.Value>
               {speed && <InfoCard.Description className={clsx(speed.className)}>{speed.label}</InfoCard.Description>}
            </InfoCard.TextWrapper>
         </InfoCard>

         <InfoCard className="col-span-6 lg:col-span-3 4xl:col-span-1!">
            <InfoCard.Icon Icon={UserCog} />
            <InfoCard.TextWrapper>
               <InfoCard.Title>Відповідальний</InfoCard.Title>
               <InfoCard.Value>
                  {isLoading || !summary?.responsible
                     ? "Не призначено"
                     : `${summary.responsible.first_name} ${summary.responsible.last_name}`}
               </InfoCard.Value>
               {summary?.responsible?.position && (
                  <InfoCard.Description>{summary.responsible.position}</InfoCard.Description>
               )}
            </InfoCard.TextWrapper>
         </InfoCard>
      </InfoCard.Wrapper>
   )
}
