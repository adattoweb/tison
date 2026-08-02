import { useCheckContext } from "@/hooks/useCheckContext"
import type { WithClassName } from "@/types/common"
import clsx from "clsx"
import { Box, MoreVertical } from "lucide-react"
import { createContext, type PropsWithChildren } from "react"
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer } from "recharts"

const defaultTableClassNames = `min-w-225 grid items-center border-b border-(--stroke-color) last:border-b-0 py-4 px-8 gap-12`

interface TableContextType {
   tableClassNames: string
}

const TableContext = createContext<TableContextType | null>(null)

interface HeaderProps {
   columns: string[]
}

function Header({ columns }: HeaderProps) {
   const { tableClassNames } = useCheckContext(TableContext)
   return (
      <header className={`${tableClassNames} ${defaultTableClassNames}`}>
         {columns.map((el, index) => (
            <p key={index} className="text-base text-(--second-color)">
               {el}
            </p>
         ))}
      </header>
   )
}

function MiniProgressBar({ progress, color }: { progress: number; color: string }) {
   const data = [{ name: "progress", value: progress, rest: 100 - progress }]

   return (
      <div className="h-2 w-full rounded-xl bg-(--stroke-color) ">
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

interface StatItemProps {
   value: string | number
}

function StatItem({ value }: StatItemProps) {
   return (
      <div className="flex flex-col">
         <span className="font-medium text-white text-base 4xl:text-lg">{value}</span>
         <span className="text-(--second-color)">од.</span>
      </div>
   )
}

interface ProgressProps {
   value: number
}

function Progress({ value }: ProgressProps) {
   return (
      <div className="flex min-w-0 items-center gap-4 pr-2 sm:pr-6">
         <div className="min-w-0 flex-1 hidden 4xl:block">
            <MiniProgressBar progress={value} color="#61d381" />
         </div>
         <span className="shrink-0 font-medium text-white">{value}%</span>
      </div>
   )
}

interface NameProps {
   name: string
   model: string
}

function Name({ name, model }: NameProps) {
   return (
      <div className="flex min-w-0 items-center gap-3 col-span-1">
         <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-(--bg-trans-color)">
            <Box className="size-5 text-(--accent-color)" strokeWidth={1.5} />
         </div>
         <div className="flex min-w-0 flex-col">
            <span className="truncate font-medium text-white text-base">{name}</span>
            <span className="truncate text-(--second-color)">{model}</span>
         </div>
      </div>
   )
}

interface TextProps extends WithClassName {
   text: string
}

function Text({ text, className = "" }: TextProps) {
   return <p className={clsx("font-normal text-base text-white", className)}>{text}</p>
}

interface StatusProps {
   status: boolean
}

function Status({ status }: StatusProps) {
   return (
      <div className="flex min-w-0 items-center gap-2 ">
         <span className="size-2.5 shrink-0 rounded-full bg-(--right-color) hidden lg:block" />
         <span className="truncate text-(--second-color)">Виконується</span>
      </div>
   )
}

interface MoneyProps {
   value: number
   className?: string
}

function Money({ value, className }: MoneyProps) {
   return <span className={clsx("text-white", className)}>{value.toLocaleString("uk-UA")}₴</span>
}

interface PercentProps {
   value: number
   goodThreshold?: number
}

function Percent({ value, goodThreshold = 90 }: PercentProps) {
   return (
      <span
         className={clsx("font-semibold", value >= goodThreshold ? "text-(--right-color)" : "text-(--accent-color)")}
      >
         {value}%
      </span>
   )
}

interface PersonProps {
   avatarUrl: string
   name: string
   code: string
}

function Person({ avatarUrl, name, code }: PersonProps) {
   return (
      <div className="flex min-w-0 items-center gap-3">
         <img src={avatarUrl} alt={name} className="h-11 w-11 shrink-0 rounded-full object-cover" />
         <div className="min-w-0">
            <div className="truncate font-medium text-white text-base">{name}</div>
            <div className="truncate text-(--second-color)">{code}</div>
         </div>
      </div>
   )
}

interface TextGroupProps {
   primary: string
   secondary: string
}

function TextGroup({ primary, secondary }: TextGroupProps) {
   return (
      <div className="min-w-0">
         <div className="truncate text-white text-base">{primary}</div>
         <div className="truncate text-(--second-color)">{secondary}</div>
      </div>
   )
}

function MenuButton({ onClick }: { onClick?: () => void }) {
   return (
      <button
         onClick={onClick}
         className="flex size-8 items-center justify-center rounded-md text-(--second-color) transition-colors hover:bg-(--bg-trans-color) hover:text-white"
      >
         <MoreVertical className="size-4" strokeWidth={1.5} />
      </button>
   )
}

interface ShiftProps {
   name: string
   time: string
}

function Shift({ name, time }: ShiftProps) {
   return (
      <div>
         <span className="inline-block rounded-lg bg-(--bg-trans-color) px-3 py-1.5 text-white">{name}</span>
         <div className="mt-1 text-(--second-color)">{time}</div>
      </div>
   )
}

function Row({ children }: PropsWithChildren) {
   const { tableClassNames } = useCheckContext(TableContext)
   return (
      <div
         className={`${tableClassNames} ${defaultTableClassNames} transition-colors transition-300 hover:bg-(--bg-trans-hover-color) flex-1`}
      >
         {children}
      </div>
   )
}

interface TableProps extends PropsWithChildren, WithClassName {
   columns: string[]
   tableClassNames: string
}

function Table({ columns, children, tableClassNames, className = "" }: TableProps) {
   return (
      <TableContext.Provider value={{ tableClassNames }}>
         <div
            className={clsx(
               "bg-(--bg-trans-color) rounded-xl border border-(--stroke-color) flex flex-col overflow-x-scroll overflow-y-hidden",
               className,
            )}
            style={{ gridArea: "planning" }}
         >
            <Header columns={columns} />
            {children}
         </div>
      </TableContext.Provider>
   )
}

Table.Row = Row
Table.Header = Header
Table.Status = Status
Table.Name = Name
Table.StatItem = StatItem
Table.Progress = Progress
Table.Text = Text
Table.Shift = Shift
Table.Money = Money
Table.Percent = Percent
Table.Person = Person
Table.TextGroup = TextGroup
Table.MenuButton = MenuButton

export default Table
