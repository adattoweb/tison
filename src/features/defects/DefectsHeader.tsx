import InfoCard from "@/components/UI/InfoCard"
import InfoCardWrapper from "@/components/UI/InfoCardWrapper"
import type { WithClassName } from "@/types/common"
import { BugIcon, WrenchIcon, CheckCircle2Icon, CpuIcon, ClockIcon } from "lucide-react"

export function DefectsHeader({ className = "" }: WithClassName) {
   return (
      <InfoCardWrapper className={className}>
         <InfoCard
            title="Всього дефектів"
            value="200"
            diff="+5 за сьогодні"
            diffColor="#61D381"
            Icon={BugIcon}
            className="col-span-3 lg:col-span-2 4xl:col-span-1!"
         />
         <InfoCard
            title="Відкритих дефектів"
            value="100"
            diff="50% від всіх"
            diffColor="#ef4444"
            Icon={WrenchIcon}
            className="col-span-3 lg:col-span-2 4xl:col-span-1!"
         />
         <InfoCard
            title="Закритих дефектів"
            value="100"
            diff="50% від всіх"
            diffColor="#F2A65A"
            Icon={CheckCircle2Icon}
            className="col-span-3 lg:col-span-2 4xl:col-span-1!"
         />
         <InfoCard
            title="Критичних дефектів"
            value="15"
            diff="5% серед усіх"
            diffColor="#61D381"
            Icon={CpuIcon}
            className="col-span-3 4xl:col-span-1!"
         />
         <InfoCard
            title="Середній час усунення"
            value="6.4 год"
            diff="-1.2 год до вчора"
            diffColor="#61D381"
            Icon={ClockIcon}
            className="col-span-6 lg:col-span-3 4xl:col-span-1!"
         />
      </InfoCardWrapper>
   )
}
