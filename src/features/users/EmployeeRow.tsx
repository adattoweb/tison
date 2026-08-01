import { Table } from "@/components/Table/Table"
import clsx from "clsx"
import type { Employee } from "./employees"

interface EmployeeRowProps {
   employee: Employee
   onOpenActions?: (employee: Employee) => void
}

interface MoneyProps {
   value: number
   currency?: string
   className?: string
}

export function Money({ value, currency = "₴", className }: MoneyProps) {
   return (
      <span className={clsx("text-white", className)}>
         {value.toLocaleString("uk-UA")}
         {currency}
      </span>
   )
}

interface PercentBadgeProps {
   value: number
   goodThreshold?: number
   className?: string
}

export function PercentBadge({ value, goodThreshold = 90, className }: PercentBadgeProps) {
   return (
      <span
         className={clsx(
            "font-semibold",
            value >= goodThreshold ? "text-(--right-color)" : "text-(--accent-color)",
            className,
         )}
      >
         {value}%
      </span>
   )
}
interface PersonCellProps {
   name: string
   code: string
   avatarUrl: string
}

interface PersonCellProps {
   name: string
   code: string
   avatarUrl: string
}

export function PersonCell({ name, code, avatarUrl }: PersonCellProps) {
   return (
      <div className="flex items-center gap-3 min-w-0">
         <img src={avatarUrl} alt={name} className="h-11 w-11 shrink-0 rounded-full object-cover" />
         <div className="min-w-0">
            <div className="truncate font-medium text-white">{name}</div>
            <div className="truncate text-sm text-(--second-color)">{code}</div>
         </div>
      </div>
   )
}
interface DepartmentCellProps {
   department: string
   subDepartment: string
}

export function DepartmentCell({ department, subDepartment }: DepartmentCellProps) {
   return (
      <div className="min-w-0">
         <div className="truncate text-white">{department}</div>
         <div className="truncate text-sm text-(--second-color)">{subDepartment}</div>
      </div>
   )
}
interface ShiftCellProps {
   name: string
   time: string
}

export function ShiftCell({ name, time }: ShiftCellProps) {
   return (
      <div>
         <span className="inline-block rounded-lg bg-(--bg-trans-color) px-3 py-1.5 text-sm text-white">{name}</span>
         <div className="mt-1 text-sm text-(--second-color)">{time}</div>
      </div>
   )
}

export function EmployeeRow({ employee, onOpenActions }: EmployeeRowProps) {
   return (
      <Table.Row>
         <Table.Cell>
            <PersonCell name={employee.fullName} code={employee.code} avatarUrl={employee.avatarUrl} />
         </Table.Cell>

         <Table.Cell>{employee.position}</Table.Cell>

         <Table.Cell>
            <DepartmentCell department={employee.department} subDepartment={employee.departmentSub} />
         </Table.Cell>

         <Table.Cell>
            <ShiftCell name={employee.shiftName} time={employee.shiftTime} />
         </Table.Cell>

         <Table.Cell>{employee.experienceYears} років</Table.Cell>

         <Table.Cell>
            <Money value={employee.salary} className="font-semibold" />
         </Table.Cell>

         <Table.Cell>
            <Money value={employee.bonus} className="font-semibold" />
         </Table.Cell>

         <Table.Cell>
            <PercentBadge value={employee.productivity} />
         </Table.Cell>

         <Table.Cell align="right">
            <Table.RowMenuButton onClick={() => onOpenActions?.(employee)} />
         </Table.Cell>
      </Table.Row>
   )
}
