import { useMemo, useState } from "react"
import { Search, RotateCcw } from "lucide-react"
import Dropdown from "@/components/UI/Dropdown"
import Button from "@/components/UI/Button"
import { Table } from "@/components/Table/Table"
import { EmployeeRow } from "./EmployeeRow"
import { mockEmployees } from "./employees"
import { TablePagination } from "@/components/Table/TablePagination"

const COLUMN_WIDTHS = ["2.2fr", "1.4fr", "1.4fr", "1.3fr", "0.9fr", "1.2fr", "1fr", "1.1fr", "40px"]

const DEPARTMENT_OPTIONS = ["Всі відділи", "Виробництво", "Логістика", "Продажі"]
const POSITION_OPTIONS = ["Всі посади", "Тестувальник", "Інженер", "Оператор"]
const SHIFT_OPTIONS = ["Всі зміни", "Денна", "Нічна"]
const EXPERIENCE_OPTIONS = ["Стаж", "До 1 року", "1-3 роки", "3-5 років", "5+ років"]

export function EmployeesTable() {
   const [search, setSearch] = useState("")
   const [department, setDepartment] = useState(DEPARTMENT_OPTIONS[0])
   const [position, setPosition] = useState(POSITION_OPTIONS[0])
   const [shift, setShift] = useState(SHIFT_OPTIONS[0])
   const [experience, setExperience] = useState(EXPERIENCE_OPTIONS[0])
   const [page, setPage] = useState(1)
   const [pageSize, setPageSize] = useState(10)

   const filtered = useMemo(() => {
      return mockEmployees.filter(e => {
         const matchesSearch = e.fullName.toLowerCase().includes(search.toLowerCase())
         const matchesDepartment = department === DEPARTMENT_OPTIONS[0] || e.department === department
         const matchesPosition = position === POSITION_OPTIONS[0] || e.position === position
         const matchesShift = shift === SHIFT_OPTIONS[0] || e.shiftName === shift
         return matchesSearch && matchesDepartment && matchesPosition && matchesShift
      })
   }, [search, department, position, shift])

   const paged = useMemo(() => {
      const start = (page - 1) * pageSize
      return filtered.slice(start, start + pageSize)
   }, [filtered, page, pageSize])

   function resetFilters() {
      setSearch("")
      setDepartment(DEPARTMENT_OPTIONS[0])
      setPosition(POSITION_OPTIONS[0])
      setShift(SHIFT_OPTIONS[0])
      setExperience(EXPERIENCE_OPTIONS[0])
      setPage(1)
   }

   return (
      <div className="flex flex-col mt-4" style={{ gap: "var(--components-gap)" }}>
         <div className="flex flex-wrap items-center" style={{ gap: "var(--components-gap)" }}>
            <div className="relative min-w-55 max-w-100">
               <Search
                  size={18}
                  className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-(--second-color)"
               />
               <input
                  value={search}
                  onChange={e => {
                     setSearch(e.target.value)
                     setPage(1)
                  }}
                  placeholder="Пошук..."
                  className="w-full rounded-md border border-(--stroke-color) bg-(--bg-trans-color) py-2.5 pl-11 pr-4 text-sm text-white placeholder:text-(--second-color) outline-none focus:border-(--stroke-active-color)"
               />
            </div>
            <Dropdown
               value={department}
               options={DEPARTMENT_OPTIONS}
               onChange={v => {
                  setDepartment(v)
                  setPage(1)
               }}
            />
            <Dropdown
               value={position}
               options={POSITION_OPTIONS}
               onChange={v => {
                  setPosition(v)
                  setPage(1)
               }}
            />
            <Dropdown
               value={shift}
               options={SHIFT_OPTIONS}
               onChange={v => {
                  setShift(v)
                  setPage(1)
               }}
            />
            <Dropdown value={experience} options={EXPERIENCE_OPTIONS} onChange={setExperience} />
            <Button onClick={resetFilters}>
               <Button.Icon Icon={RotateCcw} strokeWidth={1.5} />
               <Button.Paragraph>Скинути фільтри</Button.Paragraph>
            </Button>
         </div>

         <Table columns={COLUMN_WIDTHS}>
            <Table.Header>
               <Table.HeaderCell>Працівник</Table.HeaderCell>
               <Table.HeaderCell>Посада</Table.HeaderCell>
               <Table.HeaderCell>Відділ</Table.HeaderCell>
               <Table.HeaderCell>Зміна</Table.HeaderCell>
               <Table.HeaderCell>Стаж</Table.HeaderCell>
               <Table.HeaderCell>Заробітна плата</Table.HeaderCell>
               <Table.HeaderCell>Бонуси</Table.HeaderCell>
               <Table.HeaderCell>Продуктивність</Table.HeaderCell>
               <Table.HeaderCell />
            </Table.Header>

            <Table.Body>
               {paged.map(employee => (
                  <EmployeeRow key={employee.id} employee={employee} />
               ))}
            </Table.Body>

            <TablePagination
               page={page}
               pageSize={pageSize}
               total={filtered.length}
               onPageChange={setPage}
               onPageSizeChange={size => {
                  setPageSize(size)
                  setPage(1)
               }}
               entityLabel="працівників"
            />
         </Table>
      </div>
   )
}
