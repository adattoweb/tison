import InfoCard from "@/components/UI/InfoCard"
import InfoCardWrapper from "@/components/UI/InfoCardWrapper"
import type { WithClassName } from "@/types/common"
import { MonitorCogIcon, WrenchIcon, CheckCircle2Icon, PauseCircleIcon } from "lucide-react"

export function StationsHeader({ className = "" }: WithClassName) {
   return (
      <InfoCardWrapper className={className}>
         <InfoCard
            title="Всього станцій"
            value="7"
            diff="STATION-02"
            diffColor="#61D381"
            Icon={MonitorCogIcon}
            className="col-span-3 lg:col-span-2 4xl:col-span-1!"
         />
         <InfoCard
            title="Активні"
            value="7"
            diff="100% від всіх"
            diffColor="#61D381"
            Icon={WrenchIcon}
            className="col-span-3 lg:col-span-2 4xl:col-span-1!"
         />
         <InfoCard
            title="Загальна ефективність"
            value="95.4%"
            diff="+1% за період"
            diffColor="#61D381"
            Icon={CheckCircle2Icon}
            className="col-span-3 lg:col-span-2 4xl:col-span-1!"
         />
         <InfoCard
            title="Найпродуктивніша станція"
            value="STATION-02"
            diff="на 10% більше ніж інші"
            diffColor="#61D381"
            Icon={MonitorCogIcon}
            className="col-span-3 4xl:col-span-1!"
         />
         <InfoCard
            title="Станцій у простої"
            value="0"
            diff="0% від всіх"
            diffColor="#61D381"
            Icon={PauseCircleIcon}
            className="col-span-6 lg:col-span-3 4xl:col-span-1!"
         />
      </InfoCardWrapper>
   )
}
