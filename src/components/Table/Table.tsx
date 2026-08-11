import { STATUS } from "@/constants/status"
import { useCheckContext } from "@/hooks/useCheckContext"
import type { WithClassName } from "@/types/common"
import type { StatusType } from "@/types/status"
import clsx from "clsx"
import { Box, MoreVertical } from "lucide-react"
import { createContext, type CSSProperties, type PropsWithChildren } from "react"
import { Link } from "react-router"
import { ProgressBar } from "../UI/ProgressBar"

const defaultTableClassNames = `min-w-225 grid items-center border-b border-(--stroke-color) last:border-b-0 py-4 px-8 gap-12`

interface TableContextType {
   tableClassNames: string
   isFlexible: boolean
}

const TableContext = createContext<TableContextType | null>(null)

interface HeaderProps {
   columns: string[]
}

function Columns({ columns }: HeaderProps) {
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
            <ProgressBar progress={value} color="#61d381" />
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
   text: string | number
}

function Text({ text, className = "" }: TextProps) {
   return <p className={clsx("font-normal text-base text-white", className)}>{text}</p>
}

interface StatusProps {
   status: StatusType
}

function Status({ status }: StatusProps) {
   return (
      <div className="flex min-w-0 items-center gap-2 ">
         <span
            className="size-2.5 shrink-0 rounded-full hidden lg:block"
            style={{ backgroundColor: STATUS[status].color }}
         />
         <span className="truncate text-(--second-color)">{STATUS[status].label}</span>
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

interface RowProps extends PropsWithChildren {
   to: string
}

function Row({ children, to }: RowProps) {
   const { tableClassNames } = useCheckContext(TableContext)
   return (
      <Link
         to={to}
         className={clsx(
            "transition-colors transition-300 hover:bg-(--bg-trans-hover-color) flex-1",
            tableClassNames,
            defaultTableClassNames,
         )}
         draggable={false}
      >
         {children}
      </Link>
   )
}

interface TableProps extends PropsWithChildren, WithClassName {
   columns: string[]
   tableClassNames: string
   style?: React.CSSProperties
   isFlexible?: boolean
}

function Table({ columns, children, tableClassNames, className = "", style, isFlexible = false }: TableProps) {
   return (
      <TableContext.Provider value={{ tableClassNames, isFlexible }}>
         <div
            className={clsx(
               "bg-(--bg-trans-color) rounded-xl border border-(--stroke-color) overflow-hidden",
               className,
               isFlexible && "h-full",
            )}
            style={style}
         >
            <div className={clsx("flex flex-col overflow-x-scroll overflow-y-clip h-full", isFlexible && "h-full")}>
               <Columns columns={columns} />
               {children}
            </div>
         </div>
      </TableContext.Provider>
   )
}

interface WrapperProps extends PropsWithChildren, WithClassName {
   style?: CSSProperties
}

function Wrapper({ children, className, style }: WrapperProps) {
   return (
      <div className={clsx("flex flex-col gap-(--components-gap) rounded-xl", className)} style={style}>
         {children}
      </div>
   )
}
function Header({ children, className }: PropsWithChildren<WithClassName>) {
   return <div className={clsx("flex flex-wrap items-center gap-(--components-gap)", className)}>{children}</div>
}
interface DurationProps {
   label: string
   startTime?: string
   endTime?: string
}

function Duration({ label, startTime, endTime }: DurationProps) {
   if (!startTime && !endTime) {
      return <span className="text-white">{label}</span>
   }

   return (
      <div className="group relative inline-block cursor-default">
         <span className="text-white">{label}</span>

         <div
            className="pointer-events-none absolute left-1/2 top-full z-20 mt-2 w-max -translate-x-1/2 rounded-md
               border border-(--stroke-color) bg-(--bg-trans-color) px-3 py-2 text-sm text-white opacity-0
               shadow-lg backdrop-blur-sm transition-opacity duration-150 group-hover:opacity-100"
         >
            {startTime && (
               <div className="whitespace-nowrap">
                  Початок: <span className="font-medium">{startTime}</span>
               </div>
            )}
            {endTime && (
               <div className="whitespace-nowrap">
                  Завершення: <span className="font-medium">{endTime}</span>
               </div>
            )}
         </div>
      </div>
   )
}

interface PhotoProps {
   src: string
   alt?: string
}

function Photo({ src, alt = "" }: PhotoProps) {
   return (
      <div className="h-16 w-16 shrink-0 overflow-hidden rounded-lg border border-(--stroke-color) bg-(--bg-trans-color)">
         <img src={src} alt={alt} className="h-full w-full object-cover" />
      </div>
   )
}

Table.Row = Row
Table.Columns = Columns
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
Table.Wrapper = Wrapper
Table.Header = Header
Table.Duration = Duration
Table.Photo = Photo

export default Table
