import InfoCard from "@/components/UI/InfoCard"
import type { WithClassName } from "@/types/common"
import { WarehouseIcon, BoxesIcon, TruckIcon, PackageMinusIcon, AlertTriangleIcon } from "lucide-react"

export function StorageHeader({ className = "" }: WithClassName) {
   return (
      <InfoCard.Wrapper className={className} style={{ gridArea: "header" }}>
         <InfoCard className="col-span-3 lg:col-span-2 4xl:col-span-1!">
            <InfoCard.Icon Icon={WarehouseIcon} />
            <InfoCard.TextWrapper>
               <InfoCard.Title>Загальна місткість складу</InfoCard.Title>
               <InfoCard.Value>78%</InfoCard.Value>
               <InfoCard.Description className="text-[#61D381]">3120/4000 палет</InfoCard.Description>
            </InfoCard.TextWrapper>
         </InfoCard>

         <InfoCard className="col-span-3 lg:col-span-2 4xl:col-span-1!">
            <InfoCard.Icon Icon={BoxesIcon} />
            <InfoCard.TextWrapper>
               <InfoCard.Title>Залишки на складі</InfoCard.Title>
               <InfoCard.Value>3120</InfoCard.Value>
               <InfoCard.Description className="text-[#61D381]">+140 за сьогодні</InfoCard.Description>
            </InfoCard.TextWrapper>
         </InfoCard>

         <InfoCard className="col-span-3 lg:col-span-2 4xl:col-span-1!">
            <InfoCard.Icon Icon={TruckIcon} />
            <InfoCard.TextWrapper>
               <InfoCard.Title>Надходження за сьогодні</InfoCard.Title>
               <InfoCard.Value>18</InfoCard.Value>
               <InfoCard.Description className="text-[#61D381]">+3 порівняно з учора</InfoCard.Description>
            </InfoCard.TextWrapper>
         </InfoCard>

         <InfoCard className="col-span-3 4xl:col-span-1!">
            <InfoCard.Icon Icon={PackageMinusIcon} />
            <InfoCard.TextWrapper>
               <InfoCard.Title>Відвантаження за сьогодні</InfoCard.Title>
               <InfoCard.Value>24</InfoCard.Value>
               <InfoCard.Description className="text-[#F97066]">-2 порівняно з учора</InfoCard.Description>
            </InfoCard.TextWrapper>
         </InfoCard>

         <InfoCard className="col-span-6 lg:col-span-3 4xl:col-span-1!">
            <InfoCard.Icon Icon={AlertTriangleIcon} />
            <InfoCard.TextWrapper>
               <InfoCard.Title>Критичні залишки</InfoCard.Title>
               <InfoCard.Value>7 позицій</InfoCard.Value>
               <InfoCard.Description className="text-[#F97066]">потребують поповнення</InfoCard.Description>
            </InfoCard.TextWrapper>
         </InfoCard>
      </InfoCard.Wrapper>
   )
}
