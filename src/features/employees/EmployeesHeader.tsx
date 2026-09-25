import InfoCard from "@/components/UI/InfoCard"
import { useEmployeesOverview } from "@/hooks/api/employeeAnalytics/useEmployeeOverview"
import { UserIcon, UserPlusIcon, UsersIcon, UserMinusIcon, ClockIcon } from "@heroicons/react/24/outline"

function percentOf(value: number, total: number): number {
   return total > 0 ? Math.round((value / total) * 100) : 0
}

export function EmployeesHeader() {
   const { data, isLoading } = useEmployeesOverview()

   const total = data?.total ?? 0
   const value = (n: number | undefined) => (isLoading || n === undefined ? "—" : n)

   return (
      <InfoCard.Wrapper className="flex gap-(--components-gap)">
         <InfoCard className="col-span-3 lg:col-span-2 4xl:col-span-1!">
            <InfoCard.Icon Icon={UsersIcon} />
            <InfoCard.TextWrapper>
               <InfoCard.Title>Загальна кількість</InfoCard.Title>
               <InfoCard.Value>{value(data?.total)}</InfoCard.Value>
            </InfoCard.TextWrapper>
         </InfoCard>

         <InfoCard className="col-span-3 lg:col-span-2 4xl:col-span-1!">
            <InfoCard.Icon Icon={UserIcon} />
            <InfoCard.TextWrapper>
               <InfoCard.Title>Активні</InfoCard.Title>
               <InfoCard.Value>{value(data?.active)}</InfoCard.Value>
               <InfoCard.Description className="text-[#61D381]">
                  {isLoading || data === undefined ? "—" : `${percentOf(data.active, total)}% від всіх`}
               </InfoCard.Description>
            </InfoCard.TextWrapper>
         </InfoCard>

         <InfoCard className="col-span-3 lg:col-span-2 4xl:col-span-1!">
            <InfoCard.Icon Icon={UserMinusIcon} />
            <InfoCard.TextWrapper>
               <InfoCard.Title>Відсутні</InfoCard.Title>
               <InfoCard.Value>{value(data?.absent)}</InfoCard.Value>
               <InfoCard.Description className="text-[#F2A65A]">
                  {isLoading || data === undefined ? "—" : `${percentOf(data.absent, total)}% від всіх`}
               </InfoCard.Description>
            </InfoCard.TextWrapper>
         </InfoCard>

         <InfoCard className="col-span-3 4xl:col-span-1!">
            <InfoCard.Icon Icon={UserPlusIcon} />
            <InfoCard.TextWrapper>
               <InfoCard.Title>Нові робітники</InfoCard.Title>
               <InfoCard.Value>{value(data?.new_this_month)}</InfoCard.Value>
            </InfoCard.TextWrapper>
         </InfoCard>

         <InfoCard className="col-span-6 lg:col-span-3 4xl:col-span-1!">
            <InfoCard.Icon Icon={ClockIcon} />
            <InfoCard.TextWrapper>
               <InfoCard.Title>На зміні</InfoCard.Title>
               <InfoCard.Value>{value(data?.on_shift)}</InfoCard.Value>
               <InfoCard.Description className="text-[#61D381]">
                  {isLoading || data === undefined ? "—" : `${percentOf(data.on_shift, total)}% від всіх`}
               </InfoCard.Description>
            </InfoCard.TextWrapper>
         </InfoCard>
      </InfoCard.Wrapper>
   )
}
