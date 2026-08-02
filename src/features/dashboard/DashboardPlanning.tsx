import { createContext, useContext, useEffect, useMemo, useRef, useState } from "react"
import {
   useReactTable,
   getCoreRowModel,
   getSortedRowModel,
   flexRender,
   type ColumnDef,
   type SortingState,
} from "@tanstack/react-table"
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer } from "recharts"
import { Box, ChevronUp, ChevronDown } from "lucide-react"
import type { WithClassName } from "@/types/common"
import clsx from "clsx"

// ---------- Дані ----------

type ProductStatus = "onTrack" | "atRisk" | "notStarted"

interface ProductStat {
   id: string
   name: string
   model: string
   plan: number
   inProgress: number
   completed: number
   progress: number
   status: ProductStatus
}

const STATUS_CONFIG: Record<ProductStatus, { label: string; color: string }> = {
   onTrack: { label: "В процесі", color: "#4a9d5c" },
   atRisk: { label: "В процесі", color: "#e8ba6f" },
   notStarted: { label: "Не розпочато", color: "#6b6b6b" },
}

const mockProducts: ProductStat[] = [
   {
      id: "1",
      name: "Корпус A",
      model: "Модель A-12",
      plan: 120,
      inProgress: 80,
      completed: 75,
      progress: 62,
      status: "onTrack",
   },
   {
      id: "2",
      name: "Модуль B",
      model: "Модель B-7",
      plan: 80,
      inProgress: 50,
      completed: 30,
      progress: 37,
      status: "atRisk",
   },
   {
      id: "3",
      name: "Плата C",
      model: "Модель C-3",
      plan: 60,
      inProgress: 40,
      completed: 40,
      progress: 67,
      status: "onTrack",
   },
   {
      id: "4",
      name: "Блок D",
      model: "Модель D-9",
      plan: 40,
      inProgress: 16,
      completed: 16,
      progress: 40,
      status: "onTrack",
   },
   {
      id: "5",
      name: "Пристрій E",
      model: "Модель E-1",
      plan: 20,
      inProgress: 0,
      completed: 0,
      progress: 0,
      status: "notStarted",
   },
]

// ---------- Адаптивність: ширина контейнера -> "щільність" ----------

type Density = "lg" | "md" | "sm" | "xs"

// Пороги ширини (px), від яких колонки/елементи ховаються.
// Порядок зникнення: Статус -> Прогрес-бар -> В роботі
const BREAKPOINTS = {
   hideStatus: 900,
   hideProgressBar: 680,
   hideInProgress: 480,
} as const

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
   if (width >= BREAKPOINTS.hideStatus) return "lg"
   if (width >= BREAKPOINTS.hideProgressBar) return "md"
   if (width >= BREAKPOINTS.hideInProgress) return "sm"
   return "xs"
}

// Текстові розміри для кожної щільності — задаються один раз, декларативно
const DENSITY_TEXT: Record<Density, { primary: string; secondary: string; value: string; header: string }> = {
   lg: { primary: "text-base", secondary: "text-sm", value: "text-lg", header: "text-sm" },
   md: { primary: "text-sm", secondary: "text-xs", value: "text-base", header: "text-xs" },
   sm: { primary: "text-sm", secondary: "text-xs", value: "text-sm", header: "text-xs" },
   xs: { primary: "text-xs", secondary: "text-xs", value: "text-xs", header: "text-xs" },
}

const DensityContext = createContext<Density>("lg")
const useDensity = () => useContext(DensityContext)

// ---------- Дрібні презентаційні компоненти ----------

function MiniProgressBar({ progress, color }: { progress: number; color: string }) {
   const data = [{ name: "progress", value: progress, rest: 100 - progress }]

   return (
      <div className="h-2 w-full rounded-xl bg-(--stroke-color)">
         <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} layout="vertical" margin={{ top: 0, right: 0, bottom: 0, left: 0 }}>
               <XAxis type="number" domain={[0, 100]} hide />
               <YAxis type="category" dataKey="name" hide />
               <Bar dataKey="value" stackId="progress" fill={color} radius={4} barSize={8} />
               <Bar dataKey="rest" stackId="progress" fill="var(--stroke-color)" radius={4} barSize={8} />
            </BarChart>
         </ResponsiveContainer>
      </div>
   )
}

function NameCell({ product }: { product: ProductStat }) {
   const t = DENSITY_TEXT[useDensity()]
   return (
      <div className="flex min-w-0 items-center gap-3">
         <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-(--bg-trans-color)">
            <Box className="size-5 text-(--accent-color)" strokeWidth={1.5} />
         </div>
         <div className="flex min-w-0 flex-col">
            <span className={clsx("truncate font-medium text-white", t.primary)}>{product.name}</span>
            <span className={clsx("truncate text-(--second-color)", t.secondary)}>{product.model}</span>
         </div>
      </div>
   )
}

function StatCell({ value }: { value: number }) {
   const t = DENSITY_TEXT[useDensity()]
   return (
      <div className="flex flex-col items-center">
         <span className={clsx("font-medium text-white", t.value)}>{value}</span>
         <span className={clsx("text-(--second-color)", t.secondary)}>од.</span>
      </div>
   )
}

function ProgressCell({ product, showBar }: { product: ProductStat; showBar: boolean }) {
   const density = useDensity()
   const t = DENSITY_TEXT[density]
   const status = STATUS_CONFIG[product.status]

   return (
      <div className="flex min-w-0 items-center gap-4 pr-2 sm:pr-6">
         {showBar && (
            <div className="min-w-0 flex-1">
               <MiniProgressBar progress={product.progress} color={status.color} />
            </div>
         )}
         <span className={clsx("shrink-0 font-medium text-white", t.value, showBar ? "w-10 text-right" : "text-left")}>
            {product.progress}%
         </span>
      </div>
   )
}

function StatusCell({ status }: { status: ProductStatus }) {
   const t = DENSITY_TEXT[useDensity()]
   const config = STATUS_CONFIG[status]
   return (
      <div className="flex min-w-0 items-center gap-2">
         <span className="size-2.5 shrink-0 rounded-full" style={{ backgroundColor: config.color }} />
         <span className={clsx("truncate text-(--second-color)", t.primary)}>{config.label}</span>
      </div>
   )
}

function SortIcon({ direction }: { direction: false | "asc" | "desc" }) {
   if (!direction) return null
   const Icon = direction === "asc" ? ChevronUp : ChevronDown
   return <Icon className="size-3.5 text-(--accent-color)" strokeWidth={2} />
}

// ---------- Опис колонок ----------

interface ColumnMeta {
   width: string
   align?: "left" | "center"
}

function buildColumns(showProgressBar: boolean): ColumnDef<ProductStat, unknown>[] {
   return [
      {
         id: "name",
         accessorKey: "name",
         header: "Виріб",
         meta: { width: "minmax(140px, 280px)", align: "left" } satisfies ColumnMeta,
         cell: ({ row }) => <NameCell product={row.original} />,
      },
      {
         id: "plan",
         accessorKey: "plan",
         header: "План",
         meta: { width: "minmax(64px, 100px)", align: "center" } satisfies ColumnMeta,
         cell: ({ getValue }) => <StatCell value={getValue() as number} />,
      },
      {
         id: "inProgress",
         accessorKey: "inProgress",
         header: "В роботі",
         meta: { width: "minmax(64px, 100px)", align: "center" } satisfies ColumnMeta,
         cell: ({ getValue }) => <StatCell value={getValue() as number} />,
      },
      {
         id: "completed",
         accessorKey: "completed",
         header: "Завершено",
         meta: { width: "minmax(64px, 100px)", align: "center" } satisfies ColumnMeta,
         cell: ({ getValue }) => <StatCell value={getValue() as number} />,
      },
      {
         id: "progress",
         accessorKey: "progress",
         header: showProgressBar ? "Прогрес" : "%",
         meta: { width: showProgressBar ? "minmax(160px, 1fr)" : "56px", align: "left" } satisfies ColumnMeta,
         cell: ({ row }) => <ProgressCell product={row.original} showBar={showProgressBar} />,
      },
      {
         id: "status",
         accessorKey: "status",
         header: "Статус",
         meta: { width: "minmax(120px, 160px)", align: "left" } satisfies ColumnMeta,
         cell: ({ getValue }) => <StatusCell status={getValue() as ProductStatus} />,
      },
   ]
}

// ---------- Головний компонент ----------

interface DashboardPlanningProps extends WithClassName {
   style?: React.CSSProperties
}

export function DashboardPlanning({ className, style }: DashboardPlanningProps) {
   const wrapperRef = useRef<HTMLDivElement>(null)
   const width = useContainerWidth(wrapperRef)
   const density = getDensity(width)
   const showProgressBar = density === "lg"

   const [sorting, setSorting] = useState<SortingState>([])

   // Ховаємо колонки в заданому пріоритеті: Статус -> (бар всередині Прогресу) -> В роботі
   const columns = useMemo(() => {
      const all = buildColumns(showProgressBar)
      return all.filter(col => {
         if (col.id === "status") return density === "lg"
         if (col.id === "inProgress") return density !== "xs"
         return true
      })
   }, [density, showProgressBar])

   const table = useReactTable({
      data: mockProducts,
      columns,
      state: { sorting },
      onSortingChange: setSorting,
      getCoreRowModel: getCoreRowModel(),
      getSortedRowModel: getSortedRowModel(),
   })

   const gridTemplateColumns = table
      .getVisibleLeafColumns()
      .map(col => (col.columnDef.meta as ColumnMeta).width)
      .join(" ")

   const headerText = DENSITY_TEXT[density].header

   return (
      <DensityContext.Provider value={density}>
         <div
            className={clsx(
               className,
               "w-full overflow-hidden rounded-lg border border-(--stroke-color) bg-(--bg-trans-color)",
            )}
            style={style}
         >
            <div ref={wrapperRef} className="overflow-x-auto">
               {/* Header */}
               {table.getHeaderGroups().map(headerGroup => (
                  <div
                     key={headerGroup.id}
                     className="grid items-center gap-2 border-b border-(--stroke-color) px-4 py-4 sm:px-6"
                     style={{ gridTemplateColumns }}
                  >
                     {headerGroup.headers.map(header => {
                        const meta = header.column.columnDef.meta as ColumnMeta
                        return (
                           <button
                              key={header.id}
                              onClick={header.column.getToggleSortingHandler()}
                              className={clsx(
                                 "flex items-center gap-1 text-(--second-color) transition-colors hover:text-white",
                                 headerText,
                                 meta.align === "center" ? "justify-center" : "justify-start",
                              )}
                           >
                              {flexRender(header.column.columnDef.header, header.getContext())}
                              <SortIcon direction={header.column.getIsSorted()} />
                           </button>
                        )
                     })}
                  </div>
               ))}

               {/* Rows */}
               {table.getRowModel().rows.map(row => (
                  <div
                     key={row.id}
                     className="grid items-center gap-2 border-b border-(--stroke-color) px-4 py-(--components-py) transition-colors last:border-0 hover:bg-(--bg-trans-color) sm:px-6"
                     style={{ gridTemplateColumns }}
                  >
                     {row.getVisibleCells().map(cell => (
                        <div key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</div>
                     ))}
                  </div>
               ))}
            </div>
         </div>
      </DensityContext.Provider>
   )
}
