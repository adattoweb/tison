import { useState } from "react"
import { Search, RotateCcw } from "lucide-react"
import Dropdown from "@/components/UI/Dropdown"
import Button from "@/components/UI/Button"
import Table from "@/components/Table/Table"
import { TablePagination } from "@/components/Table/TablePagination"
import { useAllProfiles } from "@/hooks/api/profile/useAllProfiles"
import { useShifts } from "@/hooks/api/shifts/useShifts"
import { useDebouncedValue } from "@/hooks/api/useDebouncedValue"

const ALL_SHIFT_LABEL = "Всі зміни"

const columns = ["Працівник", "Посада", "Зміна", "Стаж", "Заробітна плата", "Бонуси", "Продуктивність", ""]

const tableClassNames = "min-w-300 grid-cols-[2fr_1.5fr_1.5fr_1fr_1fr_1fr_1fr_48px]"

const DEFAULT_PAGE_SIZE = 10

export function EmployeesTable() {
   const [search, setSearch] = useState("")
   const [shiftId, setShiftId] = useState<number | undefined>(undefined)
   const [shiftLabel, setShiftLabel] = useState(ALL_SHIFT_LABEL)
   const [page, setPage] = useState(1)
   const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE)

   const debouncedSearch = useDebouncedValue(search, 400)

   const { data: shifts } = useShifts()

   const { data, isLoading, isFetching } = useAllProfiles({
      page,
      pageSize,
      search: debouncedSearch || undefined,
      shiftId,
   })

   const profiles = data?.items ?? []
   const total = data?.total ?? 0

   function handleSearchChange(value: string) {
      setSearch(value)
      setPage(1)
   }

   function handleShiftChange(id: number | undefined, label: string) {
      setShiftId(id)
      setShiftLabel(label)
      setPage(1)
   }

   function resetFilters() {
      setSearch("")
      setShiftId(undefined)
      setShiftLabel(ALL_SHIFT_LABEL)
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
                  onChange={e => handleSearchChange(e.target.value)}
                  placeholder="Пошук..."
                  className="w-full rounded-md border border-(--stroke-color) bg-(--bg-trans-color) py-2.5 pl-11 pr-4 text-sm text-white placeholder:text-(--second-color) outline-none focus:border-(--stroke-active-color)"
               />
            </div>

            <Dropdown>
               <Dropdown.Button>
                  <span className="text-base font-normal text-white whitespace-nowrap">{shiftLabel}</span>
                  <Dropdown.Chevron />
               </Dropdown.Button>
               <Dropdown.Content>
                  <Dropdown.Item onClick={() => handleShiftChange(undefined, ALL_SHIFT_LABEL)}>
                     {ALL_SHIFT_LABEL}
                  </Dropdown.Item>
                  {shifts?.map(shift => (
                     <Dropdown.Item key={shift.id} onClick={() => handleShiftChange(shift.id, shift.name)}>
                        {shift.name}
                     </Dropdown.Item>
                  ))}
               </Dropdown.Content>
            </Dropdown>

            <Button onClick={resetFilters} className="ml-auto sm:ml-0">
               <Button.Icon Icon={RotateCcw} strokeWidth={1.5} />
               <Button.Paragraph>Скинути фільтри</Button.Paragraph>
            </Button>
         </Table.Header>

         {isLoading ? (
            <p className="py-8 text-center text-(--second-color)">Завантаження...</p>
         ) : (
            <Table
               columns={columns}
               tableClassNames={tableClassNames}
               className={isFetching ? "opacity-60 transition-opacity" : ""}
            >
               {profiles.map(employee => (
                  <Table.Row key={employee.id} to={`/employees/${employee.user_id}`}>
                     <Table.Person avatarUrl={"123"} name={employee.first_name} code={employee.code} />
                     <Table.Text text={employee.position} />
                     <Table.Shift shift={employee.shift} />
                     <Table.Text text="1 рік" className="text-(--second-color)" />
                     <Table.Money value={employee.salary} className="font-medium" />
                     <Table.Money value={employee.points} className="font-medium" />
                     <Table.Percent value={123} />
                     <Table.MenuButton />
                  </Table.Row>
               ))}
               <TablePagination
                  page={page}
                  pageSize={pageSize}
                  total={total}
                  onPageChange={setPage}
                  onPageSizeChange={size => {
                     setPageSize(size)
                     setPage(1)
                  }}
                  entityLabel="працівників"
                  className="min-w-300"
               />
            </Table>
         )}
      </Table.Wrapper>
   )
}
