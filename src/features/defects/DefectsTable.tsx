import { useMemo, useState } from "react"
import { Search, RotateCcw } from "lucide-react"
import Dropdown from "@/components/UI/Dropdown"
import Button from "@/components/UI/Button"
import Table from "@/components/Table/Table"
import { TablePagination } from "@/components/Table/TablePagination"
import { mockDefects } from "./defects"
import { STATUS } from "@/constants/status"
import type { StatusType } from "@/types/status"
import { defects } from "@/routes/defects"

const ALL = {
   type: "Всі типи",
   period: "За сьогодні",
   section: "Всі дільниці",
   status: "Статус",
} as const

const TYPE_OPTIONS = [ALL.type, "Пайка", "Складання", "Електроніка", "Калібрування"]
const PERIOD_OPTIONS = [ALL.period, "За тиждень", "За місяць", "За весь час"]
const SECTION_OPTIONS = [ALL.section, "Механічний цех", "Складальний цех", "Цех пайки", "Тестовий цех"]
const STATUS_OPTIONS = [ALL.status, "open", "closed"] as (typeof ALL.status | StatusType)[]

const columns = [
   "Фото",
   "ID дефекту",
   "Виріб",
   "Тип дефекту",
   "Дільниця",
   "Дата виявлення",
   "Статус",
   "Відповідальний",
   "",
]

const tableClassNames = "min-w-320 grid-cols-[100px_1.3fr_1.3fr_1.5fr_1.6fr_1.3fr_1fr_1.8fr_48px]"

const DEFAULT_PAGE_SIZE = 10

export function DefectsTable() {
   const [search, setSearch] = useState("")
   const [type, setType] = useState<string>(ALL.type)
   const [period, setPeriod] = useState<string>(ALL.period)
   const [section, setSection] = useState<string>(ALL.section)
   const [status, setStatus] = useState<string>(ALL.status)
   const [page, setPage] = useState(1)
   const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE)

   const filtered = useMemo(() => {
      return mockDefects.filter(defect => {
         if (
            search &&
            !defect.code.toLowerCase().includes(search.toLowerCase()) &&
            !defect.productCode.toLowerCase().includes(search.toLowerCase())
         )
            return false
         if (type !== ALL.type && defect.defectType !== type) return false
         if (section !== ALL.section && defect.section !== section) return false
         if (status !== ALL.status && defect.status !== status) return false
         // TODO: period фільтрація по реальних датах, коли з'явиться справжнє API
         return true
      })
   }, [search, type, section, status])

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
      setPeriod(ALL.period)
      setSection(ALL.section)
      setStatus(ALL.status)
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
                  <span className="text-base font-normal text-white whitespace-nowrap">{period}</span>
                  <Dropdown.Chevron />
               </Dropdown.Button>
               <Dropdown.Content>
                  {PERIOD_OPTIONS.map(option => (
                     <Dropdown.Item key={option} onClick={() => withPageReset(setPeriod)(option)}>
                        {option}
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

            <Button onClick={resetFilters} className="ml-auto sm:ml-0">
               <Button.Icon Icon={RotateCcw} strokeWidth={1.5} />
               <Button.Paragraph>Скинути фільтри</Button.Paragraph>
            </Button>
         </Table.Header>

         <Table columns={columns} tableClassNames={tableClassNames} className="">
            {pageItems.map(defect => (
               <Table.Row key={defect.id} to={`/${defects.path}/${defect.id}`}>
                  <Table.Photo src={defect.photoUrl} alt={defect.code} />
                  <Table.Text text={defect.code} className="font-medium" />
                  <Table.Text text={defect.productCode} />
                  <Table.TextGroup primary={defect.defectType} secondary={defect.defectDetail} />
                  <Table.TextGroup primary={defect.department} secondary={defect.section} />
                  <Table.TextGroup primary={defect.detectedDate} secondary={defect.detectedTime} />
                  <Table.Status status={defect.status} />
                  <Table.Person
                     avatarUrl={defect.responsibleAvatarUrl}
                     name={defect.responsibleName}
                     code={defect.responsibleCode}
                  />
                  <Table.MenuButton onClick={() => console.log("menu", defect.id)} />
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
               entityLabel="фото"
               className="min-w-7xl"
            />
         </Table>
      </Table.Wrapper>
   )
}
