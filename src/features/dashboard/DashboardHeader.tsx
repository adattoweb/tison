import InfoCard from "@/components/UI/InfoCard"
import { PackageSearchIcon, TargetIcon, UsersIcon, TrendingUpIcon, BugIcon } from "lucide-react"

export function DashboardHeader() {
   return (
      <div style={{ gridArea: "header" }} className="grid grid-cols-[repeat(5,1fr)] gap-(--components-gap)">
         <InfoCard
            title="Кількість готової продукції"
            value="256"
            diff="+8.3% за сьогодні"
            diffColor="#61D381"
            Icon={PackageSearchIcon}
         />
         <InfoCard title="Виконання плану" value="94.2%" diff="+4.6% до плану" diffColor="#61D381" Icon={TargetIcon} />
         <InfoCard title="Потреба в персоналі" value="18" diff="з 30 потрібно" diffColor="#61D381" Icon={UsersIcon} />
         <InfoCard
            title="Завантаження виробничих дільниць"
            value="94.2%"
            diff="+5.2% за вчора"
            diffColor="#61D381"
            Icon={TrendingUpIcon}
         />
         <InfoCard title="Кількість дефектів" value="20" diff="-10% за вчора" diffColor="#F2A65A" Icon={BugIcon} />
      </div>
   )
}
