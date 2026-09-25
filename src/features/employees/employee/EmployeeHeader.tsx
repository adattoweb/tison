// EmployeeHeader.tsx

import type { ProfileRead } from "@/api/types/profile"
import InfoCard from "@/components/UI/InfoCard"
import { Star, Wrench, TrendingUp, Coins, Award } from "lucide-react"
import { useEmployeeSummary } from "@/hooks/api/employeeAnalytics/useEmployeeSummary"

interface HeaderProps {
   profile: ProfileRead
}

function labelColor(label: string): string {
   if (label === "Вище середнього" || label === "Топ команди") return "text-[#61D381]"
   if (label === "Нижче середнього" || label === "Потребує уваги") return "text-[#E06767]"
   return "text-[#F2A65A]"
}

export function EmployeeHeader({ profile }: HeaderProps) {
   const { data: summary, isLoading } = useEmployeeSummary(profile.user_id)

   return (
      <InfoCard.Wrapper style={{ gridArea: "header" }}>
         <InfoCard className="col-span-3 lg:col-span-2 4xl:col-span-1!">
            <InfoCard.Icon Icon={Star} />
            <InfoCard.TextWrapper>
               <InfoCard.Title>Продуктивність</InfoCard.Title>
               <InfoCard.Value>{isLoading || !summary ? "—" : `${summary.productivity_percent}%`}</InfoCard.Value>
               {summary && (
                  <InfoCard.Description className={labelColor(summary.productivity_label)}>
                     {summary.productivity_label}
                  </InfoCard.Description>
               )}
            </InfoCard.TextWrapper>
         </InfoCard>

         <InfoCard className="col-span-3 lg:col-span-2 4xl:col-span-1!">
            <InfoCard.Icon Icon={Wrench} />
            <InfoCard.TextWrapper>
               <InfoCard.Title>Якість роботи</InfoCard.Title>
               <InfoCard.Value>{isLoading || !summary ? "—" : `${summary.quality_percent}%`}</InfoCard.Value>
               {summary && (
                  <InfoCard.Description className={labelColor(summary.quality_label)}>
                     {summary.quality_label}
                  </InfoCard.Description>
               )}
            </InfoCard.TextWrapper>
         </InfoCard>

         <InfoCard className="col-span-3 lg:col-span-2 4xl:col-span-1!">
            <InfoCard.Icon Icon={TrendingUp} />
            <InfoCard.TextWrapper>
               <InfoCard.Title>Стаж роботи</InfoCard.Title>
               <InfoCard.Value>
                  {isLoading || !summary ? "—" : `${summary.experience_years} ${yearsLabel(summary.experience_years)}`}
               </InfoCard.Value>
            </InfoCard.TextWrapper>
         </InfoCard>

         <InfoCard className="col-span-3 4xl:col-span-1!">
            <InfoCard.Icon Icon={Coins} />
            <InfoCard.TextWrapper>
               <InfoCard.Title>Нараховано бонусів</InfoCard.Title>
               <InfoCard.Value>{profile.points}</InfoCard.Value>
            </InfoCard.TextWrapper>
         </InfoCard>

         <InfoCard className="col-span-6 lg:col-span-3 4xl:col-span-1!">
            <InfoCard.Icon Icon={Award} />
            <InfoCard.TextWrapper>
               <InfoCard.Title>Рейтинг</InfoCard.Title>
               <InfoCard.Value>{isLoading || !summary ? "—" : summary.rating}</InfoCard.Value>
               {summary && (
                  <InfoCard.Description className={labelColor(summary.rating_label)}>
                     {summary.rating_label}
                  </InfoCard.Description>
               )}
            </InfoCard.TextWrapper>
         </InfoCard>
      </InfoCard.Wrapper>
   )
}

function yearsLabel(years: number): string {
   const mod100 = years % 100
   if (mod100 >= 11 && mod100 <= 14) return "років"
   const mod10 = years % 10
   if (mod10 === 1) return "рік"
   if (mod10 >= 2 && mod10 <= 4) return "роки"
   return "років"
}
