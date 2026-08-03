import InfoCard from "@/components/UI/InfoCard"
import InfoCardWrapper from "@/components/UI/InfoCardWrapper"
import type { WithClassName } from "@/types/common"
import { WrenchIcon, PauseCircleIcon, CpuIcon, CheckCircle2Icon } from "lucide-react"

export function OperationsHeader({ className = "" }: WithClassName) {
   return (
      <InfoCardWrapper className={className}>
         <InfoCard
            title="Всього операцій"
            value="1253"
            diff="+25 за сьогодні"
            diffColor="#61D381"
            Icon={WrenchIcon}
            className="col-span-3 lg:col-span-2 4xl:col-span-1!"
         />
         <InfoCard
            title="Активні"
            value="12"
            diff="50% за сьогодні"
            diffColor="#61D381"
            Icon={WrenchIcon}
            className="col-span-3 lg:col-span-2 4xl:col-span-1!"
         />
         <InfoCard
            title="Середній час"
            value="25 хв"
            diff="+1.2 хв за вчора"
            diffColor="#F2A65A"
            Icon={PauseCircleIcon}
            className="col-span-3 lg:col-span-2 4xl:col-span-1!"
         />
         <InfoCard
            title="Найчастіша операція"
            value="Тестування"
            diff="51% серед усіх"
            diffColor="#61D381"
            Icon={CpuIcon}
            className="col-span-3 4xl:col-span-1!"
         />
         <InfoCard
            title="Завершено сьогодні"
            value="47"
            diff="+12% до вчора"
            diffColor="#61D381"
            Icon={CheckCircle2Icon}
            className="col-span-6 lg:col-span-3 4xl:col-span-1!"
         />
      </InfoCardWrapper>
   )
}
