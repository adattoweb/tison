import { createContext, useContext, useEffect, useMemo, useRef, useState } from "react"
import {
   useReactTable,
   getCoreRowModel,
   getFilteredRowModel,
   getPaginationRowModel,
   flexRender,
   type ColumnDef,
   type ColumnFiltersState,
   type PaginationState,
} from "@tanstack/react-table"
import { Search, RotateCcw, MoreVertical } from "lucide-react"
import clsx from "clsx"
import Dropdown from "@/components/UI/Dropdown"
import Button from "@/components/UI/Button"
import { TablePagination } from "@/components/Table/TablePagination"
import { mockEmployees, type Employee } from "./employees"

// ---------------------------------------------------------------------------
// Довідники фільтрів
// ---------------------------------------------------------------------------

const ALL = {
   department: "Всі відділи",
   position: "Всі посади",
   shift: "Всі зміни",
   experience: "Стаж",
} as const

const DEPARTMENT_OPTIONS = [ALL.department, "Виробництво", "Логістика", "Продажі"]
const POSITION_OPTIONS = [ALL.position, "Тестувальник", "Інженер", "Оператор"]
const SHIFT_OPTIONS = [ALL.shift, "Денна", "Нічна"]
const EXPERIENCE_OPTIONS = [ALL.experience, "До 1 року", "1-3 роки", "3-5 років", "5+ років"]

function getExperienceBucket(years: number): string {
   if (years < 1) return "До 1 року"
   if (years < 3) return "1-3 роки"
   if (years < 5) return "3-5 років"
   return "5+ років"
}

// ---------------------------------------------------------------------------
// Адаптивність: ширина контейнера -> "щільність"
//
// До DENSITY_BREAKPOINT (768px) таблиця гнучка (fr-колонки, менший текст) —
// вона стискається разом з контейнером. Нижче порогу подальше стиснення
// вже унеможливлює читабельність вмісту, тож колонки фіксуються мінімальною
// px-шириною і замість стиснення з'являється горизонтальний скрол.
// ---------------------------------------------------------------------------

type Density = "lg" | "md"

const DENSITY_BREAKPOINT = 768

function useContainerWidth(ref: React.RefObject<HTMLElement | null>) {
   const [width, setWidth] = useState<number>(Infinity)

   useEffect(() => {
      const el = ref.current
      if (!el) return

      const observer = new ResizeObserver(entries => {
         const w = entries[0]?.contentRect.width
         if (w !== undefined) setWidth(w)
      })

      observer.observe(el)
      return () => observer.disconnect()
   }, [ref])

   return width
}

function getDensity(width: number): Density {
   return width >= DENSITY_BREAKPOINT ? "lg" : "md"
}

const DENSITY_TEXT: Record<Density, { primary: string; secondary: string; header: string }> = {
   lg: { primary: "text-base", secondary: "text-sm", header: "text-sm" },
   md: { primary: "text-sm", secondary: "text-xs", header: "text-xs" },
}

// На md ховаємо лише "Стаж" — все інше лишається доступним через скрол
const COLUMN_VISIBILITY_BY_DENSITY: Record<Density, string[]> = {
   lg: [],
   md: ["experience"],
}

const DensityContext = createContext<Density>("lg")
const useDensity = () => useContext(DensityContext)

// ---------------------------------------------------------------------------
// Дрібні презентаційні компоненти
// ---------------------------------------------------------------------------

function Money({ value, className }: { value: number; className?: string }) {
   return <span className={clsx("text-white", className)}>{value.toLocaleString("uk-UA")}₴</span>
}

function PercentBadge({ value, goodThreshold = 90 }: { value: number; goodThreshold?: number }) {
   return (
      <span
         className={clsx("font-semibold", value >= goodThreshold ? "text-(--right-color)" : "text-(--accent-color)")}
      >
         {value}%
      </span>
   )
}

function PersonCell({ employee }: { employee: Employee }) {
   const t = DENSITY_TEXT[useDensity()]
   return (
      <div className="flex min-w-0 items-center gap-3">
         <img
            src={employee.avatarUrl}
            alt={employee.fullName}
            className="h-11 w-11 shrink-0 rounded-full object-cover"
         />
         <div className="min-w-0">
            <div className={clsx("truncate font-medium text-white", t.primary)}>{employee.fullName}</div>
            <div className={clsx("truncate text-(--second-color)", t.secondary)}>{employee.code}</div>
         </div>
      </div>
   )
}

function DepartmentCell({ department, subDepartment }: { department: string; subDepartment: string }) {
   const t = DENSITY_TEXT[useDensity()]
   return (
      <div className="min-w-0">
         <div className={clsx("truncate text-white", t.primary)}>{department}</div>
         <div className={clsx("truncate text-(--second-color)", t.secondary)}>{subDepartment}</div>
      </div>
   )
}

function ShiftCell({ name, time }: { name: string; time: string }) {
   const t = DENSITY_TEXT[useDensity()]
   return (
      <div>
         <span className={clsx("inline-block rounded-lg bg-(--bg-trans-color) px-3 py-1.5 text-white", t.secondary)}>
            {name}
         </span>
         <div className={clsx("mt-1 text-(--second-color)", t.secondary)}>{time}</div>
      </div>
   )
}

function RowMenuButton({ onClick }: { onClick?: () => void }) {
   return (
      <button
         onClick={onClick}
         className="flex size-8 items-center justify-center rounded-md text-(--second-color) transition-colors hover:bg-(--bg-trans-color) hover:text-white"
      >
         <MoreVertical className="size-4" strokeWidth={1.5} />
      </button>
   )
}

// ---------------------------------------------------------------------------
// Опис колонок — єдине джерело правди
// ---------------------------------------------------------------------------

interface ColumnMeta {
   width: string // fr-ширина для гнучкого (lg) режиму
   minWidth: string // px-ширина для фіксованого (md / скрол) режиму
   align?: "left" | "center" | "right"
}

function buildColumns(): ColumnDef<Employee, unknown>[] {
   return [
      {
         id: "person",
         accessorKey: "fullName",
         header: "Працівник",
         meta: { width: "2.2fr", minWidth: "220px" } satisfies ColumnMeta,
         filterFn: (row, _id, value: string) => row.original.fullName.toLowerCase().includes(value.toLowerCase()),
         cell: ({ row }) => <PersonCell employee={row.original} />,
      },
      {
         id: "position",
         accessorKey: "position",
         header: "Посада",
         meta: { width: "1.4fr", minWidth: "140px" } satisfies ColumnMeta,
         filterFn: (row, id, value: string) => row.getValue(id) === value,
         cell: ({ getValue }) => <span className="text-white">{getValue() as string}</span>,
      },
      {
         id: "department",
         accessorKey: "department",
         header: "Відділ",
         meta: { width: "1.4fr", minWidth: "160px" } satisfies ColumnMeta,
         filterFn: (row, id, value: string) => row.getValue(id) === value,
         cell: ({ row }) => (
            <DepartmentCell department={row.original.department} subDepartment={row.original.departmentSub} />
         ),
      },
      {
         id: "shift",
         accessorKey: "shiftName",
         header: "Зміна",
         meta: { width: "1.3fr", minWidth: "140px" } satisfies ColumnMeta,
         filterFn: (row, id, value: string) => row.getValue(id) === value,
         cell: ({ row }) => <ShiftCell name={row.original.shiftName} time={row.original.shiftTime} />,
      },
      {
         id: "experience",
         accessorKey: "experienceYears",
         header: "Стаж",
         meta: { width: "0.9fr", minWidth: "100px", align: "center" } satisfies ColumnMeta,
         filterFn: (row, id, value: string) => getExperienceBucket(row.getValue(id) as number) === value,
         cell: ({ getValue }) => <span className="text-white">{getValue() as number} років</span>,
      },
      {
         id: "salary",
         accessorKey: "salary",
         header: "Заробітна плата",
         meta: { width: "1.2fr", minWidth: "130px" } satisfies ColumnMeta,
         cell: ({ getValue }) => <Money value={getValue() as number} className="font-semibold" />,
      },
      {
         id: "bonus",
         accessorKey: "bonus",
         header: "Бонуси",
         meta: { width: "1fr", minWidth: "120px" } satisfies ColumnMeta,
         cell: ({ getValue }) => <Money value={getValue() as number} className="font-semibold" />,
      },
      {
         id: "productivity",
         accessorKey: "productivity",
         header: "Продуктивність",
         meta: { width: "1.1fr", minWidth: "140px" } satisfies ColumnMeta,
         cell: ({ getValue }) => <PercentBadge value={getValue() as number} />,
      },
      {
         id: "actions",
         header: "",
         meta: { width: "40px", minWidth: "48px", align: "right" } satisfies ColumnMeta,
         cell: () => <RowMenuButton />,
      },
   ]
}

// ---------------------------------------------------------------------------
// Фільтр-дропдаун
// ---------------------------------------------------------------------------

interface FilterDropdownProps {
   value: string
   options: string[]
   onChange: (value: string) => void
}

function FilterDropdown({ value, options, onChange }: FilterDropdownProps) {
   return (
      <Dropdown>
         <Dropdown.Button>
            <span className="text-base font-normal text-white whitespace-nowrap">{value}</span>
            <Dropdown.Chevron />
         </Dropdown.Button>
         <Dropdown.Content>
            {options.map(option => (
               <Dropdown.Item key={option} onClick={() => onChange(option)}>
                  {option}
               </Dropdown.Item>
            ))}
         </Dropdown.Content>
      </Dropdown>
   )
}

// ---------------------------------------------------------------------------
// Головний компонент
// ---------------------------------------------------------------------------

export function EmployeesTable() {
   const wrapperRef = useRef<HTMLDivElement>(null)
   const width = useContainerWidth(wrapperRef)
   const density = getDensity(width)
   const isScrollMode = density === "md"

   const [globalFilter, setGlobalFilter] = useState("")
   const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
   const [pagination, setPagination] = useState<PaginationState>({ pageIndex: 0, pageSize: 10 })

   const columns = useMemo(() => buildColumns(), [])

   const table = useReactTable({
      data: mockEmployees,
      columns,
      state: { globalFilter, columnFilters, pagination },
      onGlobalFilterChange: setGlobalFilter,
      onColumnFiltersChange: setColumnFilters,
      onPaginationChange: setPagination,
      getCoreRowModel: getCoreRowModel(),
      getFilteredRowModel: getFilteredRowModel(),
      getPaginationRowModel: getPaginationRowModel(),
   })

   // Приховані колонки синхронізуємо декларативно, за щільністю
   useEffect(() => {
      const hidden = new Set(COLUMN_VISIBILITY_BY_DENSITY[density])
      table.setColumnVisibility(
         Object.fromEntries(columns.map(col => [col.id as string, !hidden.has(col.id as string)])),
      )
      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, [density])

   function setFilter(id: string, value: string, allLabel: string) {
      table.getColumn(id)?.setFilterValue(value === allLabel ? undefined : value)
      table.setPageIndex(0)
   }

   function resetFilters() {
      table.setGlobalFilter("")
      table.setColumnFilters([])
      table.setPageIndex(0)
   }

   const gridTemplateColumns = table
      .getVisibleLeafColumns()
      .map(col => {
         const meta = col.columnDef.meta as ColumnMeta
         return isScrollMode ? meta.minWidth : meta.width
      })
      .join(" ")

   const headerText = DENSITY_TEXT[density].header

   return (
      <DensityContext.Provider value={density}>
         <div className="flex flex-col mt-4" style={{ gap: "var(--components-gap)" }}>
            {/* Фільтри */}
            <div className="flex flex-wrap items-center" style={{ gap: "var(--components-gap)" }}>
               <div className="relative w-full min-w-0 sm:w-auto sm:min-w-55 sm:max-w-100">
                  <Search
                     size={18}
                     className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-(--second-color)"
                  />
                  <input
                     value={globalFilter}
                     onChange={e => {
                        setGlobalFilter(e.target.value)
                        table.setPageIndex(0)
                     }}
                     placeholder="Пошук..."
                     className="w-full rounded-md border border-(--stroke-color) bg-(--bg-trans-color) py-2.5 pl-11 pr-4 text-sm text-white placeholder:text-(--second-color) outline-none focus:border-(--stroke-active-color)"
                  />
               </div>

               <FilterDropdown
                  value={(table.getColumn("department")?.getFilterValue() as string) ?? ALL.department}
                  options={DEPARTMENT_OPTIONS}
                  onChange={v => setFilter("department", v, ALL.department)}
               />
               <FilterDropdown
                  value={(table.getColumn("position")?.getFilterValue() as string) ?? ALL.position}
                  options={POSITION_OPTIONS}
                  onChange={v => setFilter("position", v, ALL.position)}
               />
               <FilterDropdown
                  value={(table.getColumn("shift")?.getFilterValue() as string) ?? ALL.shift}
                  options={SHIFT_OPTIONS}
                  onChange={v => setFilter("shift", v, ALL.shift)}
               />
               <FilterDropdown
                  value={(table.getColumn("experience")?.getFilterValue() as string) ?? ALL.experience}
                  options={EXPERIENCE_OPTIONS}
                  onChange={v => setFilter("experience", v, ALL.experience)}
               />

               <Button onClick={resetFilters} className="ml-auto sm:ml-0">
                  <Button.Icon Icon={RotateCcw} strokeWidth={1.5} />
                  <Button.Paragraph>Скинути фільтри</Button.Paragraph>
               </Button>
            </div>

            {/* Таблиця */}
            <div className="w-full overflow-hidden rounded-lg border border-(--stroke-color) bg-(--bg-trans-color)">
               <div ref={wrapperRef} className="overflow-x-auto">
                  {table.getHeaderGroups().map(headerGroup => (
                     <div
                        key={headerGroup.id}
                        className="grid items-center gap-2 border-b border-(--stroke-color) px-4 py-4 sm:px-6"
                        style={{ gridTemplateColumns }}
                     >
                        {headerGroup.headers.map(header => {
                           const meta = header.column.columnDef.meta as ColumnMeta
                           return (
                              <span
                                 key={header.id}
                                 className={clsx(
                                    "truncate text-(--second-color)",
                                    headerText,
                                    meta.align === "center" && "text-center",
                                    meta.align === "right" && "text-right",
                                 )}
                              >
                                 {flexRender(header.column.columnDef.header, header.getContext())}
                              </span>
                           )
                        })}
                     </div>
                  ))}

                  {table.getRowModel().rows.map(row => (
                     <div
                        key={row.id}
                        className="grid items-center gap-2 border-b border-(--stroke-color) px-4 py-(--components-py) transition-colors last:border-0 hover:bg-(--bg-trans-color) sm:px-6"
                        style={{ gridTemplateColumns }}
                     >
                        {row.getVisibleCells().map(cell => {
                           const meta = cell.column.columnDef.meta as ColumnMeta
                           return (
                              <div
                                 key={cell.id}
                                 className={clsx(
                                    "min-w-0",
                                    meta.align === "center" && "flex justify-center",
                                    meta.align === "right" && "flex justify-end",
                                 )}
                              >
                                 {flexRender(cell.column.columnDef.cell, cell.getContext())}
                              </div>
                           )
                        })}
                     </div>
                  ))}
               </div>

               <TablePagination
                  page={pagination.pageIndex + 1}
                  pageSize={pagination.pageSize}
                  total={table.getFilteredRowModel().rows.length}
                  onPageChange={page => table.setPageIndex(page - 1)}
                  onPageSizeChange={size => table.setPageSize(size)}
                  entityLabel="працівників"
               />
            </div>
         </div>
      </DensityContext.Provider>
   )
}
