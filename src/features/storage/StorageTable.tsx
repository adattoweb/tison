import { useMemo, useState } from "react"
import { Search } from "lucide-react"
import Table from "@/components/Table/Table"
import { TablePagination } from "@/components/Table/TablePagination"
import { mockStorage } from "./storage"

const columns = ["Матеріал", "Одиниця", "В наявності", "Норма", ""]

const tableClassNames = "min-w-300 grid-cols-[300px_1fr_1fr_1fr_48px]"

const DEFAULT_PAGE_SIZE = 10

export function StorageTable() {
   const [search, setSearch] = useState("")
   const [page, setPage] = useState(1)
   const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE)

   const filtered = useMemo(() => {
      return mockStorage.filter(storage => {
         if (search && !storage.material.toLowerCase().includes(search.toLowerCase())) return false
         return true
      })
   }, [search])

   const pageItems = filtered.slice((page - 1) * pageSize, page * pageSize)

   function withPageReset<T>(setter: (value: T) => void) {
      return (value: T) => {
         setter(value)
         setPage(1)
      }
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
         </Table.Header>

         <Table columns={columns} tableClassNames={tableClassNames} className="">
            {pageItems.map((storage, index) => (
               <Table.Row key={index} to="#">
                  <Table.Text text={storage.material} className="font-medium" />
                  <Table.Text text={storage.unit} className="font-medium" />
                  <Table.Text text={storage.stock} className="font-medium" />
                  <Table.Text text={storage.min} className="font-medium" />
                  <Table.MenuButton onClick={() => console.log("menu", index)} />
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
               entityLabel="виробів"
               className="min-w-300"
            />
         </Table>
      </Table.Wrapper>
   )
}
