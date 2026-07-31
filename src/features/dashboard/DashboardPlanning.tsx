import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer } from "recharts"
import { Box } from "lucide-react"

type ProductStatus = "onTrack" | "atRisk" | "notStarted"

interface ProductStat {
   id: string
   name: string
   model: string
   plan: number
   inProgress: number
   completed: number
   progress: number // %
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
      <div className="h-2 w-full">
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

const COLUMN_WIDTHS = {
   product: "w-72",
   metric: "w-28",
   progress: "flex-1",
   status: "w-40",
}

function TableHeader() {
   return (
      <div className="flex items-center px-6 py-4 border-b border-(--stroke-color)">
         <span className={`${COLUMN_WIDTHS.product} text-(--second-color) text-sm`}>Виріб</span>
         <span className={`${COLUMN_WIDTHS.metric} text-(--second-color) text-sm text-center`}>План</span>
         <span className={`${COLUMN_WIDTHS.metric} text-(--second-color) text-sm text-center`}>В роботі</span>
         <span className={`${COLUMN_WIDTHS.metric} text-(--second-color) text-sm text-center`}>Завершено</span>
         <span className={`${COLUMN_WIDTHS.progress} text-(--second-color) text-sm`}>Прогрес</span>
         <span className={`${COLUMN_WIDTHS.status} text-(--second-color) text-sm`}>Статус</span>
      </div>
   )
}

interface TableRowProps {
   product: ProductStat
}

function TableRow({ product }: TableRowProps) {
   const status = STATUS_CONFIG[product.status]

   return (
      <div className="flex items-center px-6 py-5 border-b border-(--stroke-color) last:border-0 hover:bg-(--bg-trans-color) transition-colors">
         <div className={`${COLUMN_WIDTHS.product} flex items-center gap-3`}>
            <div className="flex items-center justify-center size-10 rounded-xl bg-(--bg-trans-color) shrink-0">
               <Box className="size-5 text-(--accent-color)" strokeWidth={1.5} />
            </div>
            <div className="flex flex-col">
               <span className="text-white font-medium text-base">{product.name}</span>
               <span className="text-(--second-color) text-sm">{product.model}</span>
            </div>
         </div>

         <div className={`${COLUMN_WIDTHS.metric} flex flex-col items-center`}>
            <span className="text-white text-lg font-medium">{product.plan}</span>
            <span className="text-(--second-color) text-sm">од.</span>
         </div>

         <div className={`${COLUMN_WIDTHS.metric} flex flex-col items-center`}>
            <span className="text-white text-lg font-medium">{product.inProgress}</span>
            <span className="text-(--second-color) text-sm">од.</span>
         </div>

         <div className={`${COLUMN_WIDTHS.metric} flex flex-col items-center`}>
            <span className="text-white text-lg font-medium">{product.completed}</span>
            <span className="text-(--second-color) text-sm">од.</span>
         </div>

         <div className={`${COLUMN_WIDTHS.progress} flex items-center gap-4 pr-8`}>
            <MiniProgressBar progress={product.progress} color={status.color} />
            <span className="text-white text-base font-medium shrink-0 w-12 text-right">{product.progress}%</span>
         </div>

         <div className={`${COLUMN_WIDTHS.status} flex items-center gap-2`}>
            <span className="size-2.5 rounded-full shrink-0" style={{ backgroundColor: status.color }} />
            <span className="text-(--second-color) text-base">{status.label}</span>
         </div>
      </div>
   )
}

export function DashboardPlanning() {
   return (
      <div className="bg-(--bg-trans-color) border border-(--stroke-color) rounded-2xl overflow-hidden w-full">
         <TableHeader />
         {mockProducts.map(product => (
            <TableRow key={product.id} product={product} />
         ))}
      </div>
   )
}
