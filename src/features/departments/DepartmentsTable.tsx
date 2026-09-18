import { useState } from "react"
import { Search } from "lucide-react"
import Table from "@/components/Table/Table"
import { TablePagination } from "@/components/Table/TablePagination"

import { useAllDepartments } from "@/hooks/api/departments/useAllDepartments"
import { useDebouncedValue } from "@/hooks/api/useDebouncedValue"

const columns = ["Назва", ""]

const tableClassNames = "min-w-275 grid-cols-[1.3fr_48px]"

const DEFAULT_PAGE_SIZE = 10

export function DepartmentsTable() {
   const [search, setSearch] = useState("")
   const [page, setPage] = useState(1)
   const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE)

   const debouncedSearch = useDebouncedValue(search, 400)

   const { data, isFetching } = useAllDepartments({
      page,
      pageSize,
      search: debouncedSearch || undefined,
   })

   function handleSearchChange(value: string) {
      setSearch(value)
      setPage(1)
   }

   const departments = data?.items ?? []
   const total = data?.total ?? 0

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
         </Table.Header>

         <Table
            columns={columns}
            tableClassNames={tableClassNames}
            className={isFetching ? "opacity-60 transition-opacity" : ""}
         >
            {departments.map(department => (
               <Table.Row key={department.id} to={`/departments/${department.id}`}>
                  <Table.Text text={department.name} />
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
               entityLabel="департаментів"
               className="min-w-300"
            />
         </Table>
      </Table.Wrapper>
   )
}
