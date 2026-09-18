import type { StationListRead } from "@/api/types/station"
import Table from "@/components/Table/Table"
import { avatarUrl } from "@/constants/global"
import { useProfile } from "@/hooks/api/profile/useProfile"

const columns = ["Оператор", "Дільниця", "Статус", "Поточне завдання", ""]

const tableClassNames = "min-w-275 grid-cols-[1.8fr_1.5fr_1fr_1.5fr_48px]"

interface TableProps {
   station: StationListRead
}

export function StationTable({ station }: TableProps) {
   const { data: responsible } = useProfile(station.responsible_id ?? undefined)
   return (
      <Table.Wrapper style={{ gridArea: "table" }}>
         <Table columns={columns} tableClassNames={tableClassNames} isFlexible={true}>
            <Table.Row key={station.id} to={`/stations/${station.id}`}>
               {responsible && (
                  <Table.Person avatarUrl={avatarUrl} name={responsible?.first_name} code={responsible?.code} />
               )}
               <Table.TextGroup primary={station.department.name} secondary={station.department.description} />
               <Table.Status status={station.status} />
               {/* <Table.TextGroup primary={station.taskName} secondary={station.taskCode} /> */}
               <Table.MenuButton onClick={() => console.log("menu", station.id)} />
            </Table.Row>
         </Table>
      </Table.Wrapper>
   )
}
