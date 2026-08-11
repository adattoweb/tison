import { useMemo, useState } from "react"
import { Search, RotateCcw } from "lucide-react"
import Dropdown from "@/components/UI/Dropdown"
import Button from "@/components/UI/Button"
import Table from "@/components/Table/Table"
import { TablePagination } from "@/components/Table/TablePagination"
import { mockPlan, type Plan } from "./plan"

const ALL = {
   type: "Всі типи",
   progress: "Прогрес",
} as const

const TYPE_OPTIONS = [ALL.type, "Плата керування", "Корпус", "Модуль живлення", "Датчик"]
const PROGRESS_OPTIONS = [ALL.progress, "До 25%", "25-50%", "50-75%", "75-100%"]

function getProgressBucket(progress: number): string {
   if (progress < 25) return "До 25%"
   if (progress < 50) return "25-50%"
   if (progress < 75) return "50-75%"
   return "75-100%"
}

const columns = ["Модель", "План", "Факт", "Прогресс", "Почати з", "Закінчити до", ""]

const tableClassNames = "min-w-300 grid-cols-[1.5fr_1fr_1fr_2fr_2fr_2fr_48px]"

const DEFAULT_PAGE_SIZE = 10

export function SchedulingTable() {
   const [search, setSearch] = useState("")
   const [type, setType] = useState<string>(ALL.type)
   const [progressBucket, setProgressBucket] = useState<string>(ALL.progress)
   const [page, setPage] = useState(1)
   const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE)

   const getProgress = (plan: Plan) => Math.round((plan.fact / plan.plan) * 100)

   const filtered = useMemo(() => {
      return mockPlan.filter(plan => {
         if (search && !plan.model.toLowerCase().includes(search.toLowerCase())) return false
         if (progressBucket !== ALL.progress && getProgressBucket(getProgress(plan)) !== progressBucket) return false
         return true
      })
   }, [search, type, progressBucket])

   const pageItems = filtered.slice((page - 1) * pageSize, page * pageSize)

   function withPageReset<T>(setter: (value: T) => void) {
      return (value: T) => {
         setter(value)
         setPage(1)
      }
   }

   function resetFilters() {
      setSearch("")
      setType(ALL.type)
      setProgressBucket(ALL.progress)
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
                  <span className="text-base font-normal text-white whitespace-nowrap">{type}</span>
                  <Dropdown.Chevron />
               </Dropdown.Button>
               <Dropdown.Content>
                  {TYPE_OPTIONS.map(option => (
                     <Dropdown.Item key={option} onClick={() => withPageReset(setType)(option)}>
                        {option}
                     </Dropdown.Item>
                  ))}
               </Dropdown.Content>
            </Dropdown>

            <Dropdown>
               <Dropdown.Button>
                  <span className="text-base font-normal text-white whitespace-nowrap">{progressBucket}</span>
                  <Dropdown.Chevron />
               </Dropdown.Button>
               <Dropdown.Content>
                  {PROGRESS_OPTIONS.map(option => (
                     <Dropdown.Item key={option} onClick={() => withPageReset(setProgressBucket)(option)}>
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
            {pageItems.map((plan, index) => (
               <Table.Row key={index} to="#">
                  <Table.Text text={plan.model} className="font-medium" />
                  <Table.Text text={plan.plan} className="font-medium" />
                  <Table.Text text={plan.fact} className="font-medium" />
                  <Table.Percent value={getProgress(plan)} goodThreshold={100} />
                  <Table.Text text={plan.startAt} className="font-medium" />
                  <Table.Text text={plan.endAt} className="font-medium" />
                  <Table.MenuButton onClick={() => console.log("menu", index)} />
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
               entityLabel="виробів"
               className="min-w-300"
            />
         </Table>
      </Table.Wrapper>
   )
}
