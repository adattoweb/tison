// ProductsHeader.tsx

import InfoCard from "@/components/UI/InfoCard"
import { useProductsOverview } from "@/hooks/api/productionAnalytics/useProductionOverview"
import type { WithClassName } from "@/types/common"
import { PackageSearchIcon, WrenchIcon, PauseCircleIcon, BugIcon, PackageCheckIcon } from "lucide-react"

function percentOf(value: number, total: number): number {
   return total > 0 ? Math.round((value / total) * 100) : 0
}

export function ProductsHeader({ className = "" }: WithClassName) {
   const { data, isLoading } = useProductsOverview()

   const total = data?.total ?? 0
   const value = (n: number | undefined) => (isLoading || n === undefined ? "—" : n)
   const percent = (n: number | undefined) => (isLoading || n === undefined ? "—" : `${percentOf(n, total)}% від всіх`)

   return (
      <InfoCard.Wrapper className={className}>
         <InfoCard className="col-span-3 lg:col-span-2 4xl:col-span-1!">
            <InfoCard.Icon Icon={PackageSearchIcon} />
            <InfoCard.TextWrapper>
               <InfoCard.Title>Всього виробів</InfoCard.Title>
               <InfoCard.Value>{value(data?.total)}</InfoCard.Value>
               <InfoCard.Description className="text-[#61D381]">
                  {isLoading || data === undefined ? "—" : `+${data.created_today} за сьогодні`}
               </InfoCard.Description>
            </InfoCard.TextWrapper>
         </InfoCard>

         <InfoCard className="col-span-3 lg:col-span-2 4xl:col-span-1!">
            <InfoCard.Icon Icon={WrenchIcon} />
            <InfoCard.TextWrapper>
               <InfoCard.Title>Виробляються</InfoCard.Title>
               <InfoCard.Value>{value(data?.in_production)}</InfoCard.Value>
               <InfoCard.Description className="text-[#F2A65A]">{percent(data?.in_production)}</InfoCard.Description>
            </InfoCard.TextWrapper>
         </InfoCard>

         <InfoCard className="col-span-3 lg:col-span-2 4xl:col-span-1!">
            <InfoCard.Icon Icon={PauseCircleIcon} />
            <InfoCard.TextWrapper>
               <InfoCard.Title>Очікують перевірки</InfoCard.Title>
               <InfoCard.Value>{value(data?.waiting_inspection)}</InfoCard.Value>
               <InfoCard.Description className="text-[#F2A65A]">
                  {percent(data?.waiting_inspection)}
               </InfoCard.Description>
            </InfoCard.TextWrapper>
         </InfoCard>

         <InfoCard className="col-span-3 4xl:col-span-1!">
            <InfoCard.Icon Icon={BugIcon} />
            <InfoCard.TextWrapper>
               <InfoCard.Title>Брак</InfoCard.Title>
               <InfoCard.Value>{value(data?.defects_count)}</InfoCard.Value>
               <InfoCard.Description className="text-[#F2A65A]">{percent(data?.defects_count)}</InfoCard.Description>
            </InfoCard.TextWrapper>
         </InfoCard>

         <InfoCard className="col-span-6 lg:col-span-3 4xl:col-span-1!">
            <InfoCard.Icon Icon={PackageCheckIcon} />
            <InfoCard.TextWrapper>
               <InfoCard.Title>Готово до відвантаження</InfoCard.Title>
               <InfoCard.Value>{value(data?.ready_to_ship)}</InfoCard.Value>
               <InfoCard.Description className="text-[#61D381]">{percent(data?.ready_to_ship)}</InfoCard.Description>
            </InfoCard.TextWrapper>
         </InfoCard>
      </InfoCard.Wrapper>
   )
}
