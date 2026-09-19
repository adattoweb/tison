import { useState } from "react"
import { Model } from "./Model/Model"
import { DEFAULT_PAGE_SIZE } from "@/constants/pagination"
import { useDebouncedValue } from "@/hooks/api/useDebouncedValue"
import { useAllProductModels } from "@/hooks/api/product_models/useAllProductModels"
import { Search } from "lucide-react"
import { ErrorPage } from "@/components/ErrorPage/ErrorPage"
import { TablePagination } from "@/components/Table/TablePagination"
import Dropdown from "@/components/UI/Dropdown"
import Table from "@/components/Table/Table"

export function ModelList() {
   const [search, setSearch] = useState("")
   const [page, setPage] = useState(1)
   const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE)
   const [isActive, setIsActive] = useState(true)

   const debouncedSearch = useDebouncedValue(search, 400)

   const { data } = useAllProductModels({
      page,
      pageSize,
      search: debouncedSearch || undefined,
      isActive: isActive,
   })

   function withPageReset<T>(setter: (value: T) => void) {
      return (value: T) => {
         setter(value)
         setPage(1)
      }
   }

   function handleSearchChange(value: string) {
      setSearch(value)
      setPage(1)
   }
   const models = data?.items ?? []
   const total = data?.total ?? 0
   if (models === undefined) return <ErrorPage />
   return (
      <div className="flex flex-col gap-4">
         <Table.Header className="flex">
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
                  <span className="text-base font-normal text-white whitespace-nowrap">
                     {isActive ? "Активні" : "Архівовані"}
                  </span>
                  <Dropdown.Chevron />
               </Dropdown.Button>
               <Dropdown.Content>
                  <Dropdown.Item onClick={() => withPageReset(setIsActive)(true)}>Активні</Dropdown.Item>
                  <Dropdown.Item onClick={() => withPageReset(setIsActive)(false)}>Архівовані</Dropdown.Item>
               </Dropdown.Content>
            </Dropdown>
         </Table.Header>
         {models.map((model, index) => (
            <Model key={index} model={model} />
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
            entityLabel="моделей"
            className="min-w-300"
         />
      </div>
   )
}
