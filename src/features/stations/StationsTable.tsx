import { useMemo, useState } from "react"
import { Search, RotateCcw } from "lucide-react"
import Dropdown from "@/components/UI/Dropdown"
import Button from "@/components/UI/Button"
import Table from "@/components/Table/Table"
import { TablePagination } from "@/components/Table/TablePagination"
import { mockStations } from "./stations"
import { STATUS } from "@/constants/status"
import type { StatusType } from "@/types/status"

const ALL = {
   section: "Всі дільниці",
   status: "Всі статуси",
   task: "Всі завдання",
   load: "Завантаження",
} as const

const SECTION_OPTIONS = [ALL.section, "Механічний цех", "Складальний цех", "Цех пайки", "Тестовий цех"]
const STATUS_OPTIONS = [ALL.status, ...Object.keys(STATUS)] as (typeof ALL.status | StatusType)[]
const LOAD_OPTIONS = [ALL.load, "До 50%", "50-75%", "75-90%", "90-100%"]

function getLoadBucket(load: number): string {
   if (load < 50) return "До 50%"
   if (load < 75) return "50-75%"
   if (load < 90) return "75-90%"
   return "90-100%"
}

const columns = ["ID Станції", "Дільниця", "Статус", "Поточне завдання", "Завантаження", "Оператор", ""]

const tableClassNames = "min-w-275 grid-cols-[1.3fr_1.6fr_1.3fr_1.8fr_1fr_1.8fr_48px]"

const DEFAULT_PAGE_SIZE = 10

export function StationsTable() {
   const [search, setSearch] = useState("")
   const [section, setSection] = useState<string>(ALL.section)
   const [status, setStatus] = useState<string>(ALL.status)
   const [task, setTask] = useState<string>(ALL.task)
   const [loadBucket, setLoadBucket] = useState<string>(ALL.load)
   const [page, setPage] = useState(1)
   const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE)

   const taskOptions = useMemo(() => {
      const uniqueTasks = Array.from(new Set(mockStations.map(s => s.taskName)))
      return [ALL.task, ...uniqueTasks]
   }, [])

   const filtered = useMemo(() => {
      return mockStations.filter(station => {
         if (
            search &&
            !station.code.toLowerCase().includes(search.toLowerCase()) &&
            !station.operatorName.toLowerCase().includes(search.toLowerCase())
         )
            return false
         if (section !== ALL.section && station.section !== section) return false
         if (status !== ALL.status && station.status !== status) return false
         if (task !== ALL.task && station.taskName !== task) return false
         if (loadBucket !== ALL.load && getLoadBucket(station.load) !== loadBucket) return false
         return true
      })
   }, [search, section, status, task, loadBucket])

   const pageItems = filtered.slice((page - 1) * pageSize, page * pageSize)

   function withPageReset<T>(setter: (value: T) => void) {
      return (value: T) => {
         setter(value)
         setPage(1)
      }
   }

   function resetFilters() {
      setSearch("")
      setSection(ALL.section)
      setStatus(ALL.status)
      setTask(ALL.task)
      setLoadBucket(ALL.load)
      setPage(1)
   }

   return (
      <Table.Wrapper>
         <Table.Header>
            <div className="relative w-full min-w-0 sm:w-auto sm:min-w-55 sm:max-w-100">
               <Search
                  size={18}
                  className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-(--second-color)"
               />
               <input
                  value={search}
                  onChange={e => withPageReset(setSearch)(e.target.value)}
                  placeholder="Пошук..."
                  className="w-full rounded-md border border-(--stroke-color) bg-(--bg-trans-color) py-2.5 pl-11 pr-4 text-sm text-white placeholder:text-(--second-color) outline-none focus:border-(--stroke-active-color)"
               />
            </div>

            <Dropdown>
               <Dropdown.Button>
                  <span className="text-base font-normal text-white whitespace-nowrap">{section}</span>
                  <Dropdown.Chevron />
               </Dropdown.Button>
               <Dropdown.Content>
                  {SECTION_OPTIONS.map(option => (
                     <Dropdown.Item key={option} onClick={() => withPageReset(setSection)(option)}>
                        {option}
                     </Dropdown.Item>
                  ))}
               </Dropdown.Content>
            </Dropdown>

            <Dropdown>
               <Dropdown.Button>
                  <span className="text-base font-normal text-white whitespace-nowrap">
                     {status === ALL.status ? ALL.status : STATUS[status as StatusType].label}
                  </span>
                  <Dropdown.Chevron />
               </Dropdown.Button>
               <Dropdown.Content>
                  {STATUS_OPTIONS.map(option => (
                     <Dropdown.Item key={option} onClick={() => withPageReset(setStatus)(option)}>
                        {option === ALL.status ? ALL.status : STATUS[option as StatusType].label}
                     </Dropdown.Item>
                  ))}
               </Dropdown.Content>
            </Dropdown>

            <Dropdown>
               <Dropdown.Button>
                  <span className="text-base font-normal text-white whitespace-nowrap">{task}</span>
                  <Dropdown.Chevron />
               </Dropdown.Button>
               <Dropdown.Content>
                  {taskOptions.map(option => (
                     <Dropdown.Item key={option} onClick={() => withPageReset(setTask)(option)}>
                        {option}
                     </Dropdown.Item>
                  ))}
               </Dropdown.Content>
            </Dropdown>

            <Dropdown>
               <Dropdown.Button>
                  <span className="text-base font-normal text-white whitespace-nowrap">{loadBucket}</span>
                  <Dropdown.Chevron />
               </Dropdown.Button>
               <Dropdown.Content>
                  {LOAD_OPTIONS.map(option => (
                     <Dropdown.Item key={option} onClick={() => withPageReset(setLoadBucket)(option)}>
                        {option}
                     </Dropdown.Item>
                  ))}
               </Dropdown.Content>
            </Dropdown>

            <Button onClick={resetFilters} className="ml-auto sm:ml-0">
               <Button.Icon Icon={RotateCcw} strokeWidth={1.5} />
               <Button.Paragraph>Скинути фільтри</Button.Paragraph>
            </Button>
         </Table.Header>

         <Table columns={columns} tableClassNames={tableClassNames} className="">
            {pageItems.map(station => (
               <Table.Row key={station.id} to={`/stations/${station.id}`}>
                  <Table.Text text={station.code} className="font-medium" />
                  <Table.TextGroup primary={station.department} secondary={station.section} />
                  <Table.Status status={station.status} />
                  <Table.TextGroup primary={station.taskName} secondary={station.taskCode} />
                  <Table.Percent value={station.load} goodThreshold={90} />
                  <Table.Person
                     avatarUrl={station.operatorAvatarUrl}
                     name={station.operatorName}
                     code={station.operatorCode}
                  />
                  <Table.MenuButton onClick={() => console.log("menu", station.id)} />
               </Table.Row>
            ))}
            <TablePagination
               page={page}
               pageSize={pageSize}
               total={filtered.length}
               onPageChange={setPage}
               onPageSizeChange={size => {
                  setPageSize(size)
                  setPage(1)
               }}
               entityLabel="станцій"
               className="min-w-275"
            />
         </Table>
      </Table.Wrapper>
   )
}
