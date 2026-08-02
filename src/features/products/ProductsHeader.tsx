import InfoCard from "@/components/UI/InfoCard"
import InfoCardWrapper from "@/components/UI/InfoCardWrapper"
import type { WithClassName } from "@/types/common"
import { PackageSearchIcon, WrenchIcon, PauseCircleIcon, BugIcon, PackageCheckIcon } from "lucide-react"

export function ProductsHeader({ className = "" }: WithClassName) {
   return (
      <InfoCardWrapper style={{ gridArea: "header" }} className={className}>
         <InfoCard
            title="Всього виробів"
            value="200"
            diff="+5 за сьогодні"
            diffColor="#61D381"
            Icon={PackageSearchIcon}
            className="col-span-3 lg:col-span-2 4xl:col-span-1!"
         />
         <InfoCard
            title="Виробляються"
            value="8"
            diff="4% від всіх"
            diffColor="#F2A65A"
            Icon={WrenchIcon}
            className="col-span-3 lg:col-span-2 4xl:col-span-1!"
         />
         <InfoCard
            title="Очікують перевірки"
            value="10"
            diff="5% від всіх"
            diffColor="#F2A65A"
            Icon={PauseCircleIcon}
            className="col-span-3 lg:col-span-2 4xl:col-span-1!"
         />
         <InfoCard
            title="Брак"
            value="2"
            diff="1% від всіх"
            diffColor="#F2A65A"
            Icon={BugIcon}
            className="col-span-3 4xl:col-span-1!"
         />
         <InfoCard
            title="Готово до відвантаження"
            value="180"
            diff="90% від всіх"
            diffColor="#61D381"
            Icon={PackageCheckIcon}
            className="col-span-6 lg:col-span-3 4xl:col-span-1!"
         />
      </InfoCardWrapper>
   )
}
