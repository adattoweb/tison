import InfoCard from "@/components/UI/InfoCard"
import InfoCardWrapper from "@/components/UI/InfoCardWrapper"
import { UserIcon, UserPlusIcon, UsersIcon, UserMinusIcon, ClockIcon } from "@heroicons/react/24/outline"

export function EmployeesHeader() {
   return (
      <InfoCardWrapper className="flex gap-(--components-gap)">
         <InfoCard
            title="Загальна кількість"
            value="32"
            diff="+3 за місяць"
            diffColor="#61D381"
            Icon={UsersIcon}
            className="col-span-3 lg:col-span-2 4xl:col-span-1!"
         />

         <InfoCard
            title="Активні"
            value="30"
            diff="90% від всіх"
            diffColor="#61D381"
            Icon={UserIcon}
            className="col-span-3 lg:col-span-2 4xl:col-span-1!"
         />

         <InfoCard
            title="Відсутні"
            value="2"
            diff="7% від всіх"
            diffColor="#F2A65A"
            Icon={UserMinusIcon}
            className="col-span-3 lg:col-span-2 4xl:col-span-1!"
         />

         <InfoCard
            title="Нові робітники"
            value="2"
            diff="+1 за минулий місяць"
            diffColor="#61D381"
            Icon={UserPlusIcon}
            className="col-span-3 4xl:col-span-1!"
         />
         <InfoCard
            title="На зміні"
            value="24"
            diff="75% від всіх"
            diffColor="#61D381"
            Icon={ClockIcon}
            className="col-span-6 lg:col-span-3 4xl:col-span-1!"
         />
      </InfoCardWrapper>
   )
}
