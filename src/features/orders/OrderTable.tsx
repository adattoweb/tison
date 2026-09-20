import { useState } from "react"
import { RotateCcw } from "lucide-react"
import clsx from "clsx"
import Dropdown from "@/components/UI/Dropdown"
import Button from "@/components/UI/Button"
import Table from "@/components/Table/Table"
import { TablePagination } from "@/components/Table/TablePagination"
import { useAllOrders } from "@/hooks/api/orders/useAllOrders"
import { useAllProductModels } from "@/hooks/api/productModels/useAllProductModels"
import type { OrderListRead } from "@/api/types/order"
import type { StatusType } from "@/types/status"
import type { DateRange } from "@daypicker/react"
import { DateRangeFilter } from "@/components/UI/DateRangeFilter"
import { endOfDay, startOfDay } from "@/utils/time"

interface StatusOption {
   value: StatusType | undefined
   label: string
}

const STATUS_OPTIONS: StatusOption[] = [
   { value: undefined, label: "Всі статуси" },
   { value: "IDLE", label: "Очікує" },
   { value: "ACTIVE", label: "У роботі" },
   { value: "DONE", label: "Завершено" },
]

const ALL_MODELS_LABEL = "Всі вироби"

const columns = ["Виріб", "План", "Факт", "Прогрес", "Статус", "Почати з", "Закінчити до", ""]

const tableClassNames = "min-w-300 grid-cols-[1.5fr_1fr_1fr_2fr_1.2fr_1.5fr_1.5fr_48px]"

const DEFAULT_PAGE_SIZE = 10

interface Filters {
   status: StatusType | undefined
   productModelId: number | undefined
   plannedStart: DateRange | undefined
   plannedEnd: DateRange | undefined
}

const INITIAL_FILTERS: Filters = {
   status: undefined,
   productModelId: undefined,
   plannedStart: undefined,
   plannedEnd: undefined,
}

// Якщо обрано лише одну дату, фільтруємо по цьому дню
const rangeFrom = (range: DateRange | undefined) => (range?.from ? startOfDay(range.from) : undefined)
const rangeTo = (range: DateRange | undefined) => {
   const to = range?.to ?? range?.from
   return to ? endOfDay(to) : undefined
}

// Бекенд вимагає дату з часовим поясом, тому перетворюємо локальну дату в ISO (UTC).
// Початок діапазону: 00:00 локального дня, кінець: 23:59:59.999, щоб останній день входив у вибірку.

const formatDate = (iso: string) => new Date(iso).toLocaleDateString("uk-UA")

const getProgress = (order: OrderListRead) => (order.plan > 0 ? Math.round((order.fact / order.plan) * 100) : 0)

const getStatusLabel = (status: StatusType) => STATUS_OPTIONS.find(o => o.value === status)?.label ?? status

export function OrderTable() {
   const [filters, setFilters] = useState<Filters>(INITIAL_FILTERS)
   const [page, setPage] = useState(1)
   const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE)

   const { data, isLoading, isError, isPlaceholderData } = useAllOrders({
      page,
      pageSize,
      status: filters.status,
      productModelId: filters.productModelId,
      startFrom: rangeFrom(filters.plannedStart),
      startTo: rangeTo(filters.plannedStart),
      endFrom: rangeFrom(filters.plannedEnd),
      endTo: rangeTo(filters.plannedEnd),
   })

   const { data: modelsData } = useAllProductModels({ page: 1, pageSize: 100, isActive: true })
   const productModels = modelsData?.items ?? []
   const modelTitleById = new Map(productModels.map(model => [model.id, model.title]))

   const orders = data?.items ?? []

   // Будь-яка зміна фільтра повертає на першу сторінку
   function setFilter<K extends keyof Filters>(key: K, value: Filters[K]) {
      setFilters(prev => ({ ...prev, [key]: value }))
      setPage(1)
   }

   function resetFilters() {
      setFilters(INITIAL_FILTERS)
      setPage(1)
   }

   const statusLabel = STATUS_OPTIONS.find(o => o.value === filters.status)?.label ?? STATUS_OPTIONS[0].label

   const modelLabel =
      filters.productModelId === undefined
         ? ALL_MODELS_LABEL
         : (modelTitleById.get(filters.productModelId) ?? `Виріб #${filters.productModelId}`)

   return (
      <Table.Wrapper>
         <Table.Header>
            <Dropdown>
               <Dropdown.Button>
                  <span className="max-w-48 truncate text-base font-normal text-white whitespace-nowrap">
                     {modelLabel}
                  </span>
                  <Dropdown.Chevron />
               </Dropdown.Button>
               <Dropdown.Content>
                  <Dropdown.Item onClick={() => setFilter("productModelId", undefined)}>
                     {ALL_MODELS_LABEL}
                  </Dropdown.Item>
                  {productModels.map(model => (
                     <Dropdown.Item key={model.id} onClick={() => setFilter("productModelId", model.id)}>
                        {model.title}
                     </Dropdown.Item>
                  ))}
               </Dropdown.Content>
            </Dropdown>

            <Dropdown>
               <Dropdown.Button>
                  <span className="text-base font-normal text-white whitespace-nowrap">{statusLabel}</span>
                  <Dropdown.Chevron />
               </Dropdown.Button>
               <Dropdown.Content>
                  {STATUS_OPTIONS.map(option => (
                     <Dropdown.Item key={option.label} onClick={() => setFilter("status", option.value)}>
                        {option.label}
                     </Dropdown.Item>
                  ))}
               </Dropdown.Content>
            </Dropdown>

            <DateRangeFilter
               label="Початок"
               value={filters.plannedStart}
               onChange={range => setFilter("plannedStart", range)}
            />

            <DateRangeFilter
               label="Кінець"
               value={filters.plannedEnd}
               onChange={range => setFilter("plannedEnd", range)}
            />

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
            {isLoading && <p className="min-w-300 px-4 py-8 text-center text-(--second-color)">Завантаження...</p>}

            {isError && (
               <p className="min-w-300 px-4 py-8 text-center text-red-400">Не вдалося завантажити замовлення</p>
            )}

            {!isLoading && !isError && orders.length === 0 && (
               <p className="min-w-300 px-4 py-8 text-center text-(--second-color)">Замовлень не знайдено</p>
            )}

            {orders.map(order => (
               <Table.Row key={order.id} to={`/orders/${order.id}`}>
                  <Table.Text
                     text={modelTitleById.get(order.product_model_id) ?? `#${order.product_model_id}`}
                     className="font-medium"
                  />
                  <Table.Text text={order.plan} className="font-medium" />
                  <Table.Text text={order.fact} className="font-medium" />
                  <Table.Percent value={getProgress(order)} goodThreshold={100} />
                  <Table.Text text={getStatusLabel(order.status)} className="font-medium" />
                  <Table.Text text={formatDate(order.planned_start_at)} className="font-medium" />
                  <Table.Text text={formatDate(order.planned_end_at)} className="font-medium" />
                  <Table.MenuButton onClick={() => console.log("menu", order.id)} />
               </Table.Row>
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
               entityLabel="замовлень"
               className="min-w-300"
            />
         </Table>
      </Table.Wrapper>
   )
}
