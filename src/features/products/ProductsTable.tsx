import { useState } from "react"
import { RotateCcw, Search } from "lucide-react"
import clsx from "clsx"
import Dropdown from "@/components/UI/Dropdown"
import Button from "@/components/UI/Button"
import Table from "@/components/Table/Table"
import { TablePagination } from "@/components/Table/TablePagination"
import { STATUS } from "@/constants/status"
import { DEFAULT_PAGE_SIZE } from "@/constants/pagination"
import type { StatusType } from "@/types/status"
import { useAllProducts } from "@/hooks/api/products/useAllProducts"
import { useAllProductModels } from "@/hooks/api/productModels/useAllProductModels"
import { useAllDepartments } from "@/hooks/api/departments/useAllDepartments"
import { useDebouncedValue } from "@/hooks/api/useDebouncedValue"

const ALL = {
   status: "Всі статуси",
   model: "Всі моделі",
   department: "Всі відділи",
} as const

interface ProgressOption {
   label: string
   min?: number
   max?: number
}

const PROGRESS_OPTIONS: ProgressOption[] = [
   { label: "Будь-який прогрес" },
   { label: "До 25%", min: 0, max: 25 },
   { label: "25-50%", min: 25, max: 50 },
   { label: "50-75%", min: 50, max: 75 },
   { label: "75-100%", min: 75, max: 100 },
]

const STATUS_KEYS = Object.keys(STATUS) as StatusType[]

const columns = ["Виріб", "Модель", "Замовлення", "Кроки", "Прогрес", "Статус", ""]

const tableClassNames = "min-w-250 grid-cols-[1.3fr_1.8fr_1.2fr_1.2fr_1.2fr_1.3fr_48px]"

interface Filters {
   status: StatusType | undefined
   productModelId: number | undefined
   departmentId: number | undefined
   progress: ProgressOption
}

const INITIAL_FILTERS: Filters = {
   status: undefined,
   productModelId: undefined,
   departmentId: undefined,
   progress: PROGRESS_OPTIONS[0],
}

export function ProductsTable() {
   const [filters, setFilters] = useState<Filters>(INITIAL_FILTERS)
   const [page, setPage] = useState(1)
   const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE)

   const [search, setSearch] = useState("")
   const debouncedSearch = useDebouncedValue(search, 400)

   const { data, isLoading, isError, isPlaceholderData } = useAllProducts({
      page,
      pageSize,
      search: debouncedSearch || undefined,
      status: filters.status,
      productModelId: filters.productModelId,
      departmentId: filters.departmentId,
      minProgress: filters.progress.min,
      maxProgress: filters.progress.max,
   })

   const { data: modelsData } = useAllProductModels({ page: 1, pageSize: 100, isActive: true })
   const { data: departmentsData } = useAllDepartments({ page: 1, pageSize: 100 })

   const productModels = modelsData?.items ?? []
   const departments = departmentsData?.items ?? []
   const modelTitleById = new Map(productModels.map(model => [model.id, model.title]))

   const products = data?.items ?? []

   // Будь-яка зміна фільтра повертає на першу сторінку
   function setFilter<K extends keyof Filters>(key: K, value: Filters[K]) {
      setFilters(prev => ({ ...prev, [key]: value }))
      setPage(1)
   }

   function handleSearchChange(value: string) {
      setSearch(value)
      setPage(1)
   }

   function resetFilters() {
      setSearch("")
      setFilters(INITIAL_FILTERS)
      setPage(1)
   }

   const modelLabel =
      filters.productModelId === undefined
         ? ALL.model
         : (modelTitleById.get(filters.productModelId) ?? `Модель №${filters.productModelId}`)

   const departmentLabel =
      filters.departmentId === undefined
         ? ALL.department
         : (departments.find(d => d.id === filters.departmentId)?.name ?? `Відділ №${filters.departmentId}`)

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
                     {modelLabel}
                  </span>
                  <Dropdown.Chevron />
               </Dropdown.Button>
               <Dropdown.Content>
                  <Dropdown.Item onClick={() => setFilter("productModelId", undefined)}>{ALL.model}</Dropdown.Item>
                  {productModels.map(model => (
                     <Dropdown.Item key={model.id} onClick={() => setFilter("productModelId", model.id)}>
                        {model.title}
                     </Dropdown.Item>
                  ))}
               </Dropdown.Content>
            </Dropdown>

            <Dropdown>
               <Dropdown.Button>
                  <span className="max-w-48 truncate text-base font-normal text-white whitespace-nowrap">
                     {departmentLabel}
                  </span>
                  <Dropdown.Chevron />
               </Dropdown.Button>
               <Dropdown.Content>
                  <Dropdown.Item onClick={() => setFilter("departmentId", undefined)}>{ALL.department}</Dropdown.Item>
                  {departments.map(department => (
                     <Dropdown.Item key={department.id} onClick={() => setFilter("departmentId", department.id)}>
                        {department.name}
                     </Dropdown.Item>
                  ))}
               </Dropdown.Content>
            </Dropdown>

            <Dropdown>
               <Dropdown.Button>
                  <span className="text-base font-normal text-white whitespace-nowrap">
                     {filters.status ? STATUS[filters.status].label : ALL.status}
                  </span>
                  <Dropdown.Chevron />
               </Dropdown.Button>
               <Dropdown.Content>
                  <Dropdown.Item onClick={() => setFilter("status", undefined)}>{ALL.status}</Dropdown.Item>
                  {STATUS_KEYS.map(key => (
                     <Dropdown.Item key={key} onClick={() => setFilter("status", key)}>
                        {STATUS[key].label}
                     </Dropdown.Item>
                  ))}
               </Dropdown.Content>
            </Dropdown>

            <Dropdown>
               <Dropdown.Button>
                  <span className="text-base font-normal text-white whitespace-nowrap">{filters.progress.label}</span>
                  <Dropdown.Chevron />
               </Dropdown.Button>
               <Dropdown.Content>
                  {PROGRESS_OPTIONS.map(option => (
                     <Dropdown.Item key={option.label} onClick={() => setFilter("progress", option)}>
                        {option.label}
                     </Dropdown.Item>
                  ))}
               </Dropdown.Content>
            </Dropdown>

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
            {isLoading && <p className="min-w-250 px-4 py-8 text-center text-(--second-color)">Завантаження...</p>}

            {isError && <p className="min-w-250 px-4 py-8 text-center text-red-400">Не вдалося завантажити вироби</p>}

            {!isLoading && !isError && products.length === 0 && (
               <p className="min-w-250 px-4 py-8 text-center text-(--second-color)">Виробів не знайдено</p>
            )}

            {products.map(product => (
               <Table.Row key={product.id} to={`/products/${product.id}`}>
                  <Table.Text text={product.code} className="font-medium" />
                  <Table.Text text={modelTitleById.get(product.product_model_id) ?? `№${product.product_model_id}`} />
                  <Table.Text text={product.order_id ? `№${product.order_id}` : "Без замовлення"} />
                  <Table.Text text={`${product.current_step ?? 0} з ${product.steps}`} />
                  <Table.Percent value={Math.round(product.progress)} goodThreshold={100} />
                  <Table.Status status={product.status} />
                  <Table.MenuButton onClick={() => console.log("menu", product.id)} />
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
               entityLabel="виробів"
               className="min-w-250"
            />
         </Table>
      </Table.Wrapper>
   )
}
