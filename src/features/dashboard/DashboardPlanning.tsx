import Table from "@/components/Table/Table"
import type { StatusType } from "@/types/status"

interface Element {
   name: string
   model: string
   plan: number
   active: number
   maded: number
   progress: number
   status: StatusType
}

const data: Element[] = [
   {
      name: "Корпус A",
      model: "Модель A-12",
      plan: 120,
      active: 80,
      maded: 75,
      progress: 62,
      status: "inProgress",
   },
   {
      name: "Модуль B",
      model: "Модель B-7",
      plan: 80,
      active: 0,
      maded: 80,
      progress: 100,
      status: "completed",
   },
   {
      name: "Плата C",
      model: "Модель C-3",
      plan: 60,
      active: 40,
      maded: 40,
      progress: 67,
      status: "waiting",
   },
   {
      name: "Блок D",
      model: "Модель D-9",
      plan: 40,
      active: 16,
      maded: 16,
      progress: 40,
      status: "inProgress",
   },
   {
      name: "Пристрій E",
      model: "Модель E-1",
      plan: 20,
      active: 0,
      maded: 0,
      progress: 0,
      status: "delayed",
   },
]

const columns = ["Виріб", "План", "В роботі", "Завершено", "Прогрес", "Статус"]

const tableClassNames = "grid-cols-[2fr_1fr_1fr_1fr_1fr_1fr] 4xl:grid-cols-[2fr_1fr_1fr_1fr_2fr_1fr]"

export function DashboardPlanning() {
   return (
      <Table columns={columns} tableClassNames={tableClassNames}>
         {data.map((el, index) => (
            <Table.Row key={index} to="/">
               <Table.Name name={el.name} model={el.model} />
               <Table.StatItem value={el.plan} />
               <Table.StatItem value={el.active} />
               <Table.StatItem value={el.maded} />
               <Table.Progress value={el.progress} />
               <Table.Status status={el.status} />
            </Table.Row>
         ))}
      </Table>
   )
}
