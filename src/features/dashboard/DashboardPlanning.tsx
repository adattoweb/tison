import { useEffect, useRef, useState } from "react"
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer } from "recharts"
import { Box } from "lucide-react"
import type { WithClassName } from "@/types/common"
import clsx from "clsx"

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

interface MiniProgressBarProps {
   progress: number
   color: string
}

function MiniProgressBar({ progress, color }: MiniProgressBarProps) {
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

const COMPACT_BREAKPOINT = 640

function useIsCompact(ref: React.RefObject<HTMLElement | null>) {
   const [isCompact, setIsCompact] = useState(false)

   useEffect(() => {
      const el = ref.current
      if (!el) return

      const observer = new ResizeObserver(entries => {
         const width = entries[0]?.contentRect.width
         if (width === undefined) return
         setIsCompact(width < COMPACT_BREAKPOINT)
      })

      observer.observe(el)
      return () => observer.disconnect()
   }, [ref])

   return isCompact
}

function getRowTemplateColumns(isCompact: boolean) {
   return [
      isCompact ? "minmax(140px, 1fr)" : "minmax(180px, 280px)",
      "minmax(64px, 100px)",
      "minmax(64px, 100px)",
      "minmax(64px, 100px)",
      isCompact ? "56px" : "minmax(160px, 1fr)",
      isCompact ? "24px" : "minmax(120px, 160px)",
   ].join(" ")
}

interface TableHeaderProps {
   isCompact: boolean
}

function TableHeader({ isCompact }: TableHeaderProps) {
   return (
      <div
         className="grid items-center gap-2 border-b border-(--stroke-color) px-4 py-4 sm:px-6"
         style={{ gridTemplateColumns: getRowTemplateColumns(isCompact) }}
      >
         <span className="text-sm text-(--second-color)">Виріб</span>
         <span className="text-center text-sm text-(--second-color)">План</span>
         <span className="text-center text-sm text-(--second-color)">В роботі</span>
         <span className="text-center text-sm text-(--second-color)">Завершено</span>
         <span className="text-sm text-(--second-color)">{isCompact ? "%" : "Прогрес"}</span>
         {!isCompact && <span className="text-sm text-(--second-color)">Статус</span>}
      </div>
   )
}

interface TableRowProps {
   product: ProductStat
   isCompact: boolean
}

function TableRow({ product, isCompact }: TableRowProps) {
   const status = STATUS_CONFIG[product.status]

   return (
      <div
         className="grid items-center gap-2 border-b border-(--stroke-color) px-4 py-(--components-py) transition-colors last:border-0 hover:bg-(--bg-trans-color) sm:px-6"
         style={{ gridTemplateColumns: getRowTemplateColumns(isCompact) }}
      >
         <div className="flex min-w-0 items-center gap-3">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-(--bg-trans-color)">
               <Box className="size-5 text-(--accent-color)" strokeWidth={1.5} />
            </div>
            <div className="flex min-w-0 flex-col">
               <span className="truncate text-base font-medium text-white">{product.name}</span>
               <span className="truncate text-sm text-(--second-color)">{product.model}</span>
            </div>
         </div>

         <div className="flex flex-col items-center">
            <span className="text-lg font-medium text-white">{product.plan}</span>
            <span className="text-sm text-(--second-color)">од.</span>
         </div>

         <div className="flex flex-col items-center">
            <span className="text-lg font-medium text-white">{product.inProgress}</span>
            <span className="text-sm text-(--second-color)">од.</span>
         </div>

         <div className="flex flex-col items-center">
            <span className="text-lg font-medium text-white">{product.completed}</span>
            <span className="text-sm text-(--second-color)">од.</span>
         </div>

         <div className="flex min-w-0 items-center gap-4 pr-2 sm:pr-6">
            {!isCompact && (
               <div className="min-w-0 flex-1">
                  <MiniProgressBar progress={product.progress} color={status.color} />
               </div>
            )}
            <span
               className={clsx(
                  "shrink-0 text-base font-medium text-white",
                  isCompact ? "text-left" : "w-10 text-right",
               )}
            >
               {product.progress}%
            </span>
         </div>

         {!isCompact && (
            <div className="flex min-w-0 items-center gap-2">
               <span className="size-2.5 shrink-0 rounded-full" style={{ backgroundColor: status.color }} />
               <span className="truncate text-base text-(--second-color)">{status.label}</span>
            </div>
         )}
      </div>
   )
}

interface DashboardPlanningProps extends WithClassName {
   style?: React.CSSProperties
}

export function DashboardPlanning({ className, style }: DashboardPlanningProps) {
   const wrapperRef = useRef<HTMLDivElement>(null)
   const isCompact = useIsCompact(wrapperRef)

   return (
      <div
         className={clsx(
            className,
            "w-full overflow-hidden rounded-2xl border border-(--stroke-color) bg-(--bg-trans-color)",
         )}
         style={style}
      >
         <div ref={wrapperRef} className="overflow-x-auto">
            <TableHeader isCompact={isCompact} />
            {mockProducts.map(product => (
               <TableRow key={product.id} product={product} isCompact={isCompact} />
            ))}
         </div>
      </div>
   )
}
