import { useMemo, useState } from "react"
import { Search, RotateCcw } from "lucide-react"
import Dropdown from "@/components/UI/Dropdown"
import Button from "@/components/UI/Button"
import Table from "@/components/Table/Table"
import { TablePagination } from "@/components/Table/TablePagination"
import { mockOperations } from "./operations"
import { STATUS } from "@/constants/status"
import type { StatusType } from "@/types/status"

const ALL = {
   status: "Всі статуси",
   section: "Всі дільниці",
} as const

const STATUS_OPTIONS = [ALL.status, ...Object.keys(STATUS)] as (typeof ALL.status | StatusType)[]
const SECTION_OPTIONS = [ALL.section, "Механічний цех", "Складальний цех", "Цех пайки", "Тестовий цех"]

const columns = ["Операція", "Виріб", "Дільниця", "Виконавець", "Тривалість", "Статус", ""]

const tableClassNames = "min-w-275 grid-cols-[1.8fr_1.6fr_1.6fr_1.8fr_1fr_1.3fr_48px]"

const DEFAULT_PAGE_SIZE = 10

export function OperationsTable() {
   const [search, setSearch] = useState("")
   const [status, setStatus] = useState<string>(ALL.status)
   const [section, setSection] = useState<string>(ALL.section)
   const [page, setPage] = useState(1)
   const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE)

   const filtered = useMemo(() => {
      return mockOperations.filter(operation => {
         if (
            search &&
            !operation.name.toLowerCase().includes(search.toLowerCase()) &&
            !operation.productCode.toLowerCase().includes(search.toLowerCase())
         )
            return false
         if (status !== ALL.status && operation.status !== status) return false
         if (section !== ALL.section && operation.section !== section) return false
         return true
      })
   }, [search, status, section])

   const pageItems = filtered.slice((page - 1) * pageSize, page * pageSize)

   function withPageReset<T>(setter: (value: T) => void) {
      return (value: T) => {
         setter(value)
         setPage(1)
      }
   }

   function resetFilters() {
      setSearch("")
      setStatus(ALL.status)
      setSection(ALL.section)
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

            <Button onClick={resetFilters} className="ml-auto sm:ml-0">
               <Button.Icon Icon={RotateCcw} strokeWidth={1.5} />
               <Button.Paragraph>Скинути фільтри</Button.Paragraph>
            </Button>
         </Table.Header>

         <Table columns={columns} tableClassNames={tableClassNames} className="">
            {pageItems.map(operation => (
               <Table.Row key={operation.id} to={`/products/${operation.productId}`}>
                  <Table.TextGroup primary={operation.name} secondary={operation.code} />
                  <Table.TextGroup primary={operation.productModel} secondary={operation.productCode} />
                  <Table.Text text={operation.section} className="text-(--second-color)" />
                  <Table.Person
                     avatarUrl={operation.executorAvatarUrl}
                     name={operation.executorName}
                     code={operation.executorCode}
                  />
                  <Table.Duration
                     label={operation.durationLabel}
                     startTime={operation.startTime}
                     endTime={operation.endTime}
                  />
                  <Table.Status status={operation.status} />
                  <Table.MenuButton onClick={() => console.log("menu", operation.id)} />
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
               entityLabel="операцій"
               className="min-w-275"
            />
         </Table>
      </Table.Wrapper>
   )
}
