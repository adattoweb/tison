import InfoCard from "@/components/UI/InfoCard"
import InfoCardWrapper from "@/components/UI/InfoCardWrapper"
import type { WithClassName } from "@/types/common"
import { PackageSearchIcon, TargetIcon, UsersIcon, TrendingUpIcon, BugIcon } from "lucide-react"

export function DashboardHeader({ className = "" }: WithClassName) {
   return (
      <InfoCardWrapper style={{ gridArea: "header" }} className={className}>
         <InfoCard
            title="Готова продукція"
            value="256"
            diff="+8.3% за сьогодні"
            diffColor="#61D381"
            Icon={PackageSearchIcon}
            className="col-span-3 lg:col-span-2 4xl:col-span-1!"
         />
         <InfoCard
            title="Виконання плану"
            value="94.2%"
            diff="+4.6% до плану"
            diffColor="#61D381"
            Icon={TargetIcon}
            className="col-span-3 lg:col-span-2 4xl:col-span-1!"
         />
         <InfoCard
            title="Потреба в персоналі"
            value="18"
            diff="з 30 потрібно"
            diffColor="#61D381"
            Icon={UsersIcon}
            className="col-span-3 lg:col-span-2 4xl:col-span-1!"
         />
         <InfoCard
            title="Завантаження"
            value="94.2%"
            diff="+5.2% за вчора"
            diffColor="#61D381"
            Icon={TrendingUpIcon}
            className="col-span-3 4xl:col-span-1!"
         />
         <InfoCard
            title="Кількість дефектів"
            value="20"
            diff="-10% за вчора"
            diffColor="#F2A65A"
            Icon={BugIcon}
            className="col-span-6 lg:col-span-3 4xl:col-span-1!"
         />
      </InfoCardWrapper>
   )
}
