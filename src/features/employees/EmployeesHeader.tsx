import InfoCard from "@/components/UI/InfoCard"
import { UserIcon, UserPlusIcon, UsersIcon, UserMinusIcon, ClockIcon } from "@heroicons/react/24/outline"

export function EmployeesHeader() {
   return (
      <InfoCard.Wrapper className="flex gap-(--components-gap)">
         <InfoCard className="col-span-3 lg:col-span-2 4xl:col-span-1!">
            <InfoCard.Icon Icon={UsersIcon} />
            <InfoCard.TextWrapper>
               <InfoCard.Title>Загальна кількість</InfoCard.Title>
               <InfoCard.Value>32</InfoCard.Value>
               <InfoCard.Description className="text-[#61D381]">+3 за місяць</InfoCard.Description>
            </InfoCard.TextWrapper>
         </InfoCard>

         <InfoCard className="col-span-3 lg:col-span-2 4xl:col-span-1!">
            <InfoCard.Icon Icon={UserIcon} />
            <InfoCard.TextWrapper>
               <InfoCard.Title>Активні</InfoCard.Title>
               <InfoCard.Value>30</InfoCard.Value>
               <InfoCard.Description className="text-[#61D381]">90% від всіх</InfoCard.Description>
            </InfoCard.TextWrapper>
         </InfoCard>

         <InfoCard className="col-span-3 lg:col-span-2 4xl:col-span-1!">
            <InfoCard.Icon Icon={UserMinusIcon} />
            <InfoCard.TextWrapper>
               <InfoCard.Title>Відсутні</InfoCard.Title>
               <InfoCard.Value>2</InfoCard.Value>
               <InfoCard.Description className="text-[#F2A65A]">7% від всіх</InfoCard.Description>
            </InfoCard.TextWrapper>
         </InfoCard>

         <InfoCard className="col-span-3 4xl:col-span-1!">
            <InfoCard.Icon Icon={UserPlusIcon} />
            <InfoCard.TextWrapper>
               <InfoCard.Title>Нові робітники</InfoCard.Title>
               <InfoCard.Value>2</InfoCard.Value>
               <InfoCard.Description className="text-[#61D381]">+1 за минулий місяць</InfoCard.Description>
            </InfoCard.TextWrapper>
         </InfoCard>

         <InfoCard className="col-span-6 lg:col-span-3 4xl:col-span-1!">
            <InfoCard.Icon Icon={ClockIcon} />
            <InfoCard.TextWrapper>
               <InfoCard.Title>На зміні</InfoCard.Title>
               <InfoCard.Value>24</InfoCard.Value>
               <InfoCard.Description className="text-[#61D381]">75% від всіх</InfoCard.Description>
            </InfoCard.TextWrapper>
         </InfoCard>
      </InfoCard.Wrapper>
   )
}
