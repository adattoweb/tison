import { useMemo, useState } from "react"
import { Search, RotateCcw } from "lucide-react"
import Dropdown from "@/components/UI/Dropdown"
import Button from "@/components/UI/Button"
import Table from "@/components/Table/Table"
import { TablePagination } from "@/components/Table/TablePagination"
import { mockProducts } from "./products"
import { STATUS } from "@/constants/status"
import type { StatusType } from "@/types/status"

const ALL = {
   type: "Всі типи",
   status: "Всі статуси",
   section: "Всі дільниці",
   progress: "Прогрес",
} as const

const TYPE_OPTIONS = [ALL.type, "Плата керування", "Корпус", "Модуль живлення", "Датчик"]
const STATUS_OPTIONS = [ALL.status, ...Object.keys(STATUS)] as (typeof ALL.status | StatusType)[]
const SECTION_OPTIONS = [ALL.section, "Механічний цех", "Складальний цех", "Цех пайки", "Тестовий цех"]
const PROGRESS_OPTIONS = [ALL.progress, "До 25%", "25-50%", "50-75%", "75-100%"]

function getProgressBucket(progress: number): string {
   if (progress < 25) return "До 25%"
   if (progress < 50) return "25-50%"
   if (progress < 75) return "50-75%"
   return "75-100%"
}

const columns = ["Виріб", "Модель", "Дільниця", "Операція", "Виконавець", "Прогрес", "Статус", ""]

const tableClassNames = "min-w-300 grid-cols-[1.3fr_1.6fr_1.6fr_1.8fr_1.8fr_1fr_1.3fr_48px]"

const DEFAULT_PAGE_SIZE = 10

export function ProductsTable() {
   const [search, setSearch] = useState("")
   const [type, setType] = useState<string>(ALL.type)
   const [status, setStatus] = useState<string>(ALL.status)
   const [section, setSection] = useState<string>(ALL.section)
   const [progressBucket, setProgressBucket] = useState<string>(ALL.progress)
   const [page, setPage] = useState(1)
   const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE)

   const filtered = useMemo(() => {
      return mockProducts.filter(product => {
         if (
            search &&
            !product.code.toLowerCase().includes(search.toLowerCase()) &&
            !product.model.toLowerCase().includes(search.toLowerCase())
         )
            return false
         if (type !== ALL.type && product.modelType !== type) return false
         if (status !== ALL.status && product.status !== status) return false
         if (section !== ALL.section && product.section !== section) return false
         if (progressBucket !== ALL.progress && getProgressBucket(product.progress) !== progressBucket) return false
         return true
      })
   }, [search, type, status, section, progressBucket])

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
      setStatus(ALL.status)
      setSection(ALL.section)
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
            {pageItems.map(product => (
               <Table.Row key={product.id} to={`/products/${product.id}`}>
                  <Table.Text text={product.code} className="font-medium" />
                  <Table.TextGroup primary={product.model} secondary={product.modelType} />
                  <Table.TextGroup primary={product.department} secondary={product.section} />
                  <Table.TextGroup
                     primary={product.operationName}
                     secondary={`Операція ${product.operationStep} з ${product.operationTotal}`}
                  />
                  <Table.Person
                     avatarUrl={product.executorAvatarUrl}
                     name={product.executorName}
                     code={product.executorCode}
                  />
                  <Table.Percent value={product.progress} goodThreshold={100} />
                  <Table.Status status={product.status} />
                  <Table.MenuButton onClick={() => console.log("menu", product.id)} />
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
