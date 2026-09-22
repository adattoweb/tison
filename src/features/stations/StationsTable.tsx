import { useState } from "react"
import { Search, RotateCcw } from "lucide-react"
import Dropdown from "@/components/UI/Dropdown"
import Button from "@/components/UI/Button"
import Table from "@/components/Table/Table"
import { TablePagination } from "@/components/Table/TablePagination"
import { STATUS } from "@/constants/status"
import type { StatusType } from "@/types/status"

import { useAllStations } from "@/hooks/api/station/useAllStations"
import { useAllDepartments } from "@/hooks/api/departments/useAllDepartments"
import type { DepartmentRead } from "@/api/types/department"
import { useProfile } from "@/hooks/api/profile/useProfile"
import type { StationListRead } from "@/api/types/station"

const ALL = { department: "Всі дільниці", status: "Всі статуси" } as const
const STATUS_OPTIONS = [ALL.status, ...Object.keys(STATUS)] as (typeof ALL.status | StatusType)[]

const columns = ["ID Станції", "Дільниця", "Статус", "Час роботи", "Відповідальний"]
const tableClassNames = "min-w-275 grid-cols-[1.3fr_1.6fr_1.3fr_1.8fr_1.8fr]"
const DEFAULT_PAGE_SIZE = 10

function Station({ station }: { station: StationListRead }) {
   const { data: responsible } = useProfile(station.responsible_id ?? undefined)
   return (
      <Table.Row key={station.id} to={`/stations/${station.id}`}>
         <Table.Text text={station.code} className="font-medium" />
         <Table.Text text={station.department.name} />
         <Table.Status status={station.status} />
         <Table.TextGroup primary={station.start_at} secondary={station.end_at} />
         <Table.Text
            text={
               responsible === null || responsible === undefined
                  ? "Немає"
                  : `${responsible?.first_name} ${responsible?.last_name}`
            }
         />
      </Table.Row>
   )
}

export function StationsTable() {
   const [search, setSearch] = useState("")
   const [department, setDepartment] = useState<DepartmentRead | null>(null)
   const [status, setStatus] = useState<StatusType | undefined>(undefined)
   const [page, setPage] = useState(1)
   const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE)

   const { data } = useAllStations({
      page,
      pageSize,
      departmentId: department?.id,
      status,
      search: search || undefined,
   })
   const { data: departments } = useAllDepartments({ page: 1, pageSize: 100 })
   const stations = data?.items ?? []

   function withPageReset<T>(setter: (value: T) => void) {
      return (value: T) => {
         setter(value)
         setPage(1)
      }
   }

   function resetFilters() {
      setSearch("")
      setDepartment(null)
      setStatus(undefined)
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
                  <span className="text-base font-normal text-white whitespace-nowrap">
                     {department?.name ?? ALL.department}
                  </span>
                  <Dropdown.Chevron />
               </Dropdown.Button>
               <Dropdown.Content>
                  <Dropdown.Item onClick={() => withPageReset(setDepartment)(null)}>{ALL.department}</Dropdown.Item>
                  {departments?.items.map((el, id) => (
                     <Dropdown.Item key={id} onClick={() => withPageReset(setDepartment)(el)}>
                        {el.name}
                     </Dropdown.Item>
                  ))}
               </Dropdown.Content>
            </Dropdown>

            <Dropdown>
               <Dropdown.Button>
                  <span className="text-base font-normal text-white whitespace-nowrap">
                     {status ? STATUS[status].label : ALL.status}
                  </span>
                  <Dropdown.Chevron />
               </Dropdown.Button>
               <Dropdown.Content>
                  {STATUS_OPTIONS.map(option => (
                     <Dropdown.Item
                        key={option}
                        onClick={() =>
                           withPageReset(setStatus)(option === ALL.status ? undefined : (option as StatusType))
                        }
                     >
                        {option === ALL.status ? ALL.status : STATUS[option as StatusType].label}
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
            {stations.map((station, id) => (
               <Station key={id} station={station} />
            ))}
            <TablePagination
               page={page}
               pageSize={pageSize}
               total={data?.total ?? 0}
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
