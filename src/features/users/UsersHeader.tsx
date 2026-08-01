import InfoCard from "@/components/UI/InfoCard"
import { UserIcon, UserPlusIcon, UsersIcon, UserMinusIcon, ClockIcon } from "@heroicons/react/24/outline"

export function UsersHeader() {
   return (
      <div className="flex gap-(--components-gap)">
         <InfoCard title="Загальна кількість" value="32" diff="+3 за місяць" diffColor="#61D381" Icon={UsersIcon} />

         <InfoCard title="Активні" value="30" diff="90% від всіх" diffColor="#61D381" Icon={UserIcon} />

         <InfoCard title="Відсутні" value="2" diff="7% від всіх" diffColor="#F2A65A" Icon={UserMinusIcon} />

         <InfoCard
            title="Нові робітники"
            value="2"
            diff="+1 за минулий місяць"
            diffColor="#61D381"
            Icon={UserPlusIcon}
         />
         <InfoCard title="На зміні" value="24" diff="75% від всіх" diffColor="#61D381" Icon={ClockIcon} />
      </div>
   )
}
