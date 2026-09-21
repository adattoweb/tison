import { useState } from "react"
import { Search, RotateCcw } from "lucide-react"
import clsx from "clsx"
import type { DateRange } from "@daypicker/react"
import Dropdown from "@/components/UI/Dropdown"
import Button from "@/components/UI/Button"
import { DateRangeFilter } from "@/components/UI/DateRangeFilter"
import Table from "@/components/Table/Table"
import { TablePagination } from "@/components/Table/TablePagination"
import { defects as defectsRoute } from "@/routes/defects"
import { DEFAULT_PAGE_SIZE } from "@/constants/pagination"
import placeholderImg from "@/assets/images/product.jpg"
import type { DefectStatusType } from "@/api/types/defect"
import { useAllDefects } from "@/hooks/api/defects/useAllDefects"
import { useAllOperations } from "@/hooks/api/operations/useAllOperations"
import { useDebouncedValue } from "@/hooks/api/useDebouncedValue"
import { endOfDay, formatDate, startOfDay } from "@/utils/time"

const ALL_OPERATIONS_LABEL = "Всі операції"

const DEFECT_STATUS: Record<DefectStatusType, { label: string; className: string }> = {
   OPEN: { label: "Відкритий", className: "text-[#E06767]" },
   CLOSE: { label: "Закритий", className: "text-[#4a9d5c]" },
}

const columns = ["Фото", "Код дефекту", "Операція", "Дефект", "Виявлено", "Закрито", "Статус", ""]

const tableClassNames = "min-w-320 grid-cols-[100px_1.3fr_1.2fr_2fr_1.3fr_1.3fr_1fr_48px]"

interface Filters {
   operationId: number | undefined
   detected: DateRange | undefined
   closed: DateRange | undefined
}

const INITIAL_FILTERS: Filters = {
   operationId: undefined,
   detected: undefined,
   closed: undefined,
}

// Якщо обрано лише одну дату, фільтруємо по цьому дню
const rangeFrom = (range: DateRange | undefined) => (range?.from ? startOfDay(range.from) : undefined)
const rangeTo = (range: DateRange | undefined) => {
   const to = range?.to ?? range?.from
   return to ? endOfDay(to) : undefined
}

const formatTime = (iso: string) => new Date(iso).toLocaleTimeString("uk-UA", { hour: "2-digit", minute: "2-digit" })

export function DefectsTable() {
   const [search, setSearch] = useState("")
   const [filters, setFilters] = useState<Filters>(INITIAL_FILTERS)
   const [page, setPage] = useState(1)
   const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE)

   const debouncedSearch = useDebouncedValue(search, 400)

   const { data, isLoading, isError, isPlaceholderData } = useAllDefects({
      page,
      pageSize,
      search: debouncedSearch.trim() || undefined,
      operationId: filters.operationId,
      startFrom: rangeFrom(filters.detected),
      startTo: rangeTo(filters.detected),
      endFrom: rangeFrom(filters.closed),
      endTo: rangeTo(filters.closed),
   })

   const { data: operationsData } = useAllOperations({ page: 1, pageSize: 100 })
   const operations = operationsData?.items ?? []
   const operationCodeById = new Map(operations.map(operation => [operation.id, operation.code]))

   const defects = data?.items ?? []

   function handleSearchChange(value: string) {
      setSearch(value)
      setPage(1)
   }

   // Будь-яка зміна фільтра повертає на першу сторінку
   function setFilter<K extends keyof Filters>(key: K, value: Filters[K]) {
      setFilters(prev => ({ ...prev, [key]: value }))
      setPage(1)
   }

   function resetFilters() {
      setSearch("")
      setFilters(INITIAL_FILTERS)
      setPage(1)
   }

   const operationLabel =
      filters.operationId === undefined
         ? ALL_OPERATIONS_LABEL
         : (operationCodeById.get(filters.operationId) ?? `Операція #${filters.operationId}`)

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
                  onChange={e => handleSearchChange(e.target.value)}
                  placeholder="Пошук за кодом..."
                  className="w-full rounded-md border border-(--stroke-color) bg-(--bg-trans-color) py-2.5 pl-11 pr-4 text-sm text-white placeholder:text-(--second-color) outline-none focus:border-(--stroke-active-color)"
               />
            </div>

            <Dropdown>
               <Dropdown.Button>
                  <span className="max-w-48 truncate text-base font-normal text-white whitespace-nowrap">
                     {operationLabel}
                  </span>
                  <Dropdown.Chevron />
               </Dropdown.Button>
               <Dropdown.Content>
                  <Dropdown.Item onClick={() => setFilter("operationId", undefined)}>
                     {ALL_OPERATIONS_LABEL}
                  </Dropdown.Item>
                  {operations.map(operation => (
                     <Dropdown.Item key={operation.id} onClick={() => setFilter("operationId", operation.id)}>
                        {operation.code}
                     </Dropdown.Item>
                  ))}
               </Dropdown.Content>
            </Dropdown>

            <DateRangeFilter
               label="Виявлено"
               value={filters.detected}
               onChange={range => setFilter("detected", range)}
            />

            <DateRangeFilter label="Закрито" value={filters.closed} onChange={range => setFilter("closed", range)} />

            <Button onClick={resetFilters} className="ml-auto sm:ml-0">
               <Button.Icon Icon={RotateCcw} strokeWidth={1.5} />
               <Button.Paragraph>Скинути фільтри</Button.Paragraph>
            </Button>
         </Table.Header>

         <Table
            columns={columns}
            tableClassNames={tableClassNames}
            className={clsx("transition-opacity", isPlaceholderData && "opacity-50")}
         >
            {isLoading && <p className="min-w-320 px-4 py-8 text-center text-(--second-color)">Завантаження...</p>}

            {isError && <p className="min-w-320 px-4 py-8 text-center text-red-400">Не вдалося завантажити дефекти</p>}

            {!isLoading && !isError && defects.length === 0 && (
               <p className="min-w-320 px-4 py-8 text-center text-(--second-color)">Дефектів не знайдено</p>
            )}

            {defects.map(defect => {
               const status = DEFECT_STATUS[defect.status]

               return (
                  <Table.Row key={defect.id} to={`/${defectsRoute.path}/${defect.id}`}>
                     <Table.Photo src={defect.images?.[0] ?? placeholderImg} alt={defect.code} />
                     <Table.Text text={defect.code} className="font-medium" />
                     <Table.Text text={operationCodeById.get(defect.operation_id) ?? `#${defect.operation_id}`} />
                     <Table.TextGroup primary={defect.title} secondary={defect.description} />
                     <Table.TextGroup
                        primary={formatDate(defect.start_at) ?? "—"}
                        secondary={formatTime(defect.start_at)}
                     />
                     <Table.Text text={formatDate(defect.end_at) ?? "—"} />
                     <Table.Text text={status.label} className={clsx("font-medium", status.className)} />
                     <Table.MenuButton onClick={() => console.log("menu", defect.id)} />
                  </Table.Row>
               )
            })}

            <TablePagination
               page={page}
               pageSize={pageSize}
               total={data?.total ?? 0}
               onPageChange={setPage}
               onPageSizeChange={size => {
                  setPageSize(size)
                  setPage(1)
               }}
               entityLabel="дефектів"
               className="min-w-7xl"
            />
         </Table>
      </Table.Wrapper>
   )
}
