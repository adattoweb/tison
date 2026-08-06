import Table from "@/components/Table/Table"
import { avatarUrl } from "@/constants/global"
import { mockStations } from "../stations"

const columns = ["Оператор", "Дільниця", "Статус", "Поточне завдання", ""]

const tableClassNames = "min-w-275 grid-cols-[1.8fr_1.5fr_1fr_1.5fr_48px]"

export function StationTable() {
   return (
      <Table columns={columns} tableClassNames={tableClassNames} className="">
         {mockStations.map(station => (
            <Table.Row key={station.id} to={`/stations/${station.id}`}>
               <Table.Person avatarUrl={avatarUrl} name={station.operatorName} code={station.operatorCode} />
               <Table.TextGroup primary={station.department} secondary={station.section} />
               <Table.Status status={station.status} />
               <Table.TextGroup primary={station.taskName} secondary={station.taskCode} />
               <Table.MenuButton onClick={() => console.log("menu", station.id)} />
            </Table.Row>
         ))}
      </Table>
   )
}
