import { useState } from "react"
import { Search, RotateCcw } from "lucide-react"
import Dropdown from "@/components/UI/Dropdown"
import Button from "@/components/UI/Button"
import Table from "@/components/Table/Table"
import { TablePagination } from "@/components/Table/TablePagination"
import { STATUS } from "@/constants/status"
import type { StatusType } from "@/types/status"
import { formatDuration } from "@/utils/time"
import { useAllOperations } from "@/hooks/api/operations/useAllOperations"
import { useAllStations } from "@/hooks/api/station/useAllStations"
import type { OperationListRead } from "@/api/types/operation"
import type { StationListRead } from "@/api/types/station"
import { DEFAULT_PAGE_SIZE } from "@/constants/pagination"

const ALL = { status: "Всі статуси", station: "Всі станції", duration: "Будь-яка тривалість" } as const
const STATUS_OPTIONS = [ALL.status, ...Object.keys(STATUS)] as (typeof ALL.status | StatusType)[]

interface DurationOption {
   label: string
   min?: number
   max?: number
}

/** Пресети фільтра за часом виконання (в секундах) */
const DURATION_OPTIONS: DurationOption[] = [
   { label: ALL.duration },
   { label: "До 5 хвилин", max: 5 * 60 },
   { label: "5–30 хвилин", min: 5 * 60, max: 30 * 60 },
   { label: "30 хвилин – 2 години", min: 30 * 60, max: 2 * 3600 },
   { label: "Понад 2 години", min: 2 * 3600 },
]

const columns = ["Код", "Тип операції", "Продукт", "Замовлення", "Станція", "Час виконання", "Статус"]
const tableClassNames = "min-w-320 grid-cols-[1.2fr_1.6fr_1.2fr_1.2fr_1.2fr_1.3fr_1.2fr]"

interface OperationRowProps {
   operation: OperationListRead
}

function OperationRow({ operation }: OperationRowProps) {
   return (
      <Table.Row>
         <Table.Text text={operation.code} className="font-medium" />
         <Table.Text text={operation.operation_type?.name ?? "—"} />
         <Table.Text text={operation.product?.code ?? `#${operation.product_id}`} />
         <Table.Text text={operation.product?.order_id ? `#${operation.product.order_id}` : "Без замовлення"} />
         <Table.Text text={operation.station?.code ?? "Не призначено"} />
         <Table.Text text={formatDuration(operation.duration)} />
         <Table.Status status={operation.status} />
      </Table.Row>
   )
}

export function OperationsTable() {
   const [search, setSearch] = useState("")
   const [status, setStatus] = useState<StatusType | undefined>(undefined)
   const [station, setStation] = useState<StationListRead | null>(null)
   const [orderId, setOrderId] = useState<string>("")
   const [duration, setDuration] = useState<DurationOption>(DURATION_OPTIONS[0])
   const [page, setPage] = useState(1)
   const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE)
   const parsedOrderId = orderId.trim() === "" ? undefined : Number(orderId)

   const { data } = useAllOperations({
      page,
      pageSize,
      search: search || undefined,
      status,
      stationId: station?.id,
      orderId: Number.isFinite(parsedOrderId) ? parsedOrderId : undefined,
      minDuration: duration.min,
      maxDuration: duration.max,
   })
   const { data: stations } = useAllStations({ page: 1, pageSize: 100 })

   const operations = data?.items ?? []

   function withPageReset<T>(setter: (value: T) => void) {
      return (value: T) => {
         setter(value)
         setPage(1)
      }
   }

   function resetFilters() {
      setSearch("")
      setStatus(undefined)
      setStation(null)
      setOrderId("")
      setDuration(DURATION_OPTIONS[0])
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
                  placeholder="Пошук за кодом..."
                  className="w-full rounded-md border border-(--stroke-color) bg-(--bg-trans-color) py-2.5 pl-11 pr-4 text-sm text-white placeholder:text-(--second-color) outline-none focus:border-(--stroke-active-color)"
               />
            </div>

            <Dropdown>
               <Dropdown.Button>
                  <span className="whitespace-nowrap text-base font-normal text-white">
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

            <Dropdown>
               <Dropdown.Button>
                  <span className="whitespace-nowrap text-base font-normal text-white">
                     {station?.code ?? ALL.station}
                  </span>
                  <Dropdown.Chevron />
               </Dropdown.Button>
               <Dropdown.Content>
                  <Dropdown.Item onClick={() => withPageReset(setStation)(null)}>{ALL.station}</Dropdown.Item>
                  {stations?.items.map(el => (
                     <Dropdown.Item key={el.id} onClick={() => withPageReset(setStation)(el)}>
                        {el.code}
                     </Dropdown.Item>
                  ))}
               </Dropdown.Content>
            </Dropdown>

            <Dropdown>
               <Dropdown.Button>
                  <span className="whitespace-nowrap text-base font-normal text-white">{duration.label}</span>
                  <Dropdown.Chevron />
               </Dropdown.Button>
               <Dropdown.Content>
                  {DURATION_OPTIONS.map(option => (
                     <Dropdown.Item key={option.label} onClick={() => withPageReset(setDuration)(option)}>
                        {option.label}
                     </Dropdown.Item>
                  ))}
               </Dropdown.Content>
            </Dropdown>

            <input
               value={orderId}
               inputMode="numeric"
               onChange={e => withPageReset(setOrderId)(e.target.value.replace(/\D/g, ""))}
               placeholder="ID замовлення"
               className="w-full min-w-0 rounded-md border border-(--stroke-color) bg-(--bg-trans-color) px-4 py-2.5 text-sm text-white outline-none placeholder:text-(--second-color) focus:border-(--stroke-active-color) sm:w-40"
            />

            <Button onClick={resetFilters} className="ml-auto sm:ml-0">
               <Button.Icon Icon={RotateCcw} strokeWidth={1.5} />
               <Button.Paragraph>Скинути фільтри</Button.Paragraph>
            </Button>
         </Table.Header>

         <Table columns={columns} tableClassNames={tableClassNames}>
            {operations.map(operation => (
               <OperationRow key={operation.id} operation={operation} />
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
               entityLabel="операцій"
               className="min-w-7xl"
            />
         </Table>
      </Table.Wrapper>
   )
}
