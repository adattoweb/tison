import { useMemo, useState } from "react"
import { Search, RotateCcw } from "lucide-react"
import Dropdown from "@/components/UI/Dropdown"
import Button from "@/components/UI/Button"
import Table from "@/components/Table/Table"
import { TablePagination } from "@/components/Table/TablePagination"
import { mockEmployees } from "./employees"

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

const columns = ["Працівник", "Посада", "Відділ", "Зміна", "Стаж", "Заробітна плата", "Бонуси", "Продуктивність", ""]

const tableClassNames = "min-w-300 grid-cols-[2fr_1.5fr_1.5fr_1.5fr_1fr_1fr_1fr_1fr_48px]"

const DEFAULT_PAGE_SIZE = 10

export function EmployeesTable() {
   const [search, setSearch] = useState("")
   const [department, setDepartment] = useState<string>(ALL.department)
   const [position, setPosition] = useState<string>(ALL.position)
   const [shift, setShift] = useState<string>(ALL.shift)
   const [experience, setExperience] = useState<string>(ALL.experience)
   const [page, setPage] = useState(1)
   const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE)

   const filtered = useMemo(() => {
      return mockEmployees.filter(employee => {
         if (search && !employee.fullName.toLowerCase().includes(search.toLowerCase())) return false
         if (department !== ALL.department && employee.department !== department) return false
         if (position !== ALL.position && employee.position !== position) return false
         if (shift !== ALL.shift && employee.shiftName !== shift) return false
         if (experience !== ALL.experience && getExperienceBucket(employee.experienceYears) !== experience) return false
         return true
      })
   }, [search, department, position, shift, experience])

   const pageItems = filtered.slice((page - 1) * pageSize, page * pageSize)

   function withPageReset<T>(setter: (value: T) => void) {
      return (value: T) => {
         setter(value)
         setPage(1)
      }
   }

   function resetFilters() {
      setSearch("")
      setDepartment(ALL.department)
      setPosition(ALL.position)
      setShift(ALL.shift)
      setExperience(ALL.experience)
      setPage(1)
   }

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
                  onChange={e => withPageReset(setSearch)(e.target.value)}
                  placeholder="Пошук..."
                  className="w-full rounded-md border border-(--stroke-color) bg-(--bg-trans-color) py-2.5 pl-11 pr-4 text-sm text-white placeholder:text-(--second-color) outline-none focus:border-(--stroke-active-color)"
               />
            </div>

            <Dropdown>
               <Dropdown.Button>
                  <span className="text-base font-normal text-white whitespace-nowrap">{department}</span>
                  <Dropdown.Chevron />
               </Dropdown.Button>
               <Dropdown.Content>
                  {DEPARTMENT_OPTIONS.map(option => (
                     <Dropdown.Item key={option} onClick={() => withPageReset(setDepartment)(option)}>
                        {option}
                     </Dropdown.Item>
                  ))}
               </Dropdown.Content>
            </Dropdown>

            <Dropdown>
               <Dropdown.Button>
                  <span className="text-base font-normal text-white whitespace-nowrap">{position}</span>
                  <Dropdown.Chevron />
               </Dropdown.Button>
               <Dropdown.Content>
                  {POSITION_OPTIONS.map(option => (
                     <Dropdown.Item key={option} onClick={() => withPageReset(setPosition)(option)}>
                        {option}
                     </Dropdown.Item>
                  ))}
               </Dropdown.Content>
            </Dropdown>

            <Dropdown>
               <Dropdown.Button>
                  <span className="text-base font-normal text-white whitespace-nowrap">{shift}</span>
                  <Dropdown.Chevron />
               </Dropdown.Button>
               <Dropdown.Content>
                  {SHIFT_OPTIONS.map(option => (
                     <Dropdown.Item key={option} onClick={() => withPageReset(setShift)(option)}>
                        {option}
                     </Dropdown.Item>
                  ))}
               </Dropdown.Content>
            </Dropdown>

            <Dropdown>
               <Dropdown.Button>
                  <span className="text-base font-normal text-white whitespace-nowrap">{experience}</span>
                  <Dropdown.Chevron />
               </Dropdown.Button>
               <Dropdown.Content>
                  {EXPERIENCE_OPTIONS.map(option => (
                     <Dropdown.Item key={option} onClick={() => withPageReset(setExperience)(option)}>
                        {option}
                     </Dropdown.Item>
                  ))}
               </Dropdown.Content>
            </Dropdown>

            <Button onClick={resetFilters} className="ml-auto sm:ml-0">
               <Button.Icon Icon={RotateCcw} strokeWidth={1.5} />
               <Button.Paragraph>Скинути фільтри</Button.Paragraph>
            </Button>
         </Table.Header>

         <Table columns={columns} tableClassNames={tableClassNames} className="">
            {pageItems.map((employee, index) => (
               <Table.Row key={employee.code ?? index} to="/">
                  <Table.Person avatarUrl={employee.avatarUrl} name={employee.fullName} code={employee.code} />
                  <Table.Text text={employee.position} />
                  <Table.TextGroup primary={employee.department} secondary={employee.departmentSub} />
                  <Table.Shift name={employee.shiftName} time={employee.shiftTime} />
                  <Table.Text text={`${employee.experienceYears} років`} className="text-(--second-color)" />
                  <Table.Money value={employee.salary} className="font-medium" />
                  <Table.Money value={employee.bonus} className="font-medium" />
                  <Table.Percent value={employee.productivity} />
                  <Table.MenuButton />
               </Table.Row>
            ))}
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
               className="min-w-300"
            />
         </Table>
      </Table.Wrapper>
   )
}
