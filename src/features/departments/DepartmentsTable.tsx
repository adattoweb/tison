import { useState } from "react"
import { Pencil, Search, Trash2 } from "lucide-react"
import Table from "@/components/Table/Table"
import { TablePagination } from "@/components/Table/TablePagination"
import { RowMenu } from "@/components/Table/RowMenu"
import { ConfirmModal } from "@/components/Modal/ConfirmModal"
import { useToast } from "@/components/Toast/useToast"
import type { DepartmentRead } from "@/api/types/department"
import { UpdateDepartmentModal } from "./UpdateDepartmentModal"

import { useAllDepartments } from "@/hooks/api/departments/useAllDepartments"
import { useDeleteDepartment } from "@/hooks/api/departments/useDeleteDepartment"
import { useDebouncedValue } from "@/hooks/api/useDebouncedValue"
import { DEFAULT_PAGE_SIZE } from "@/constants/pagination"

const columns = ["Назва", ""]

const tableClassNames = "min-w-275 grid-cols-[1.3fr_48px]"

export function DepartmentsTable() {
   const [search, setSearch] = useState("")
   const [page, setPage] = useState(1)
   const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE)

   // Департамент зберігаємо окремо від isOpen, щоб форма не порожніла під час закриття модалки
   const [editingDepartment, setEditingDepartment] = useState<DepartmentRead | undefined>()
   const [isEditOpen, setIsEditOpen] = useState(false)
   const [deletingDepartment, setDeletingDepartment] = useState<DepartmentRead | null>(null)

   const debouncedSearch = useDebouncedValue(search, 400)
   const { addToast } = useToast()

   const { data, isFetching } = useAllDepartments({
      page,
      pageSize,
      search: debouncedSearch || undefined,
   })
   const { mutate: doDeleteDepartment } = useDeleteDepartment()

   function handleSearchChange(value: string) {
      setSearch(value)
      setPage(1)
   }

   function handleEdit(department: DepartmentRead) {
      setEditingDepartment(department)
      setIsEditOpen(true)
   }

   const departments = data?.items ?? []
   const total = data?.total ?? 0

   return (
      <>
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
                  <Table.Row key={department.id}>
                     <Table.Text text={department.name} />
                     <RowMenu
                        actions={[
                           { label: "Редагувати", Icon: Pencil, onClick: () => handleEdit(department) },
                           {
                              label: "Видалити",
                              Icon: Trash2,
                              danger: true,
                              onClick: () => setDeletingDepartment(department),
                           },
                        ]}
                     />
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

         <UpdateDepartmentModal department={editingDepartment} isOpen={isEditOpen} setIsOpen={setIsEditOpen} />

         <ConfirmModal
            isOpen={deletingDepartment !== null}
            onClose={() => setDeletingDepartment(null)}
            onConfirm={() => {
               if (!deletingDepartment) return
               doDeleteDepartment(deletingDepartment.id, {
                  onSuccess: () => {
                     addToast("Успішно видалено департамент!", { duration: 3000, type: "success" })
                     // видалили останній запис на сторінці, повертаємось на попередню
                     if (departments.length === 1 && page > 1) setPage(page - 1)
                  },
               })
            }}
            title="Видалити департамент?"
            description={
               deletingDepartment ? `Департамент «${deletingDepartment.name}» буде видалено безповоротно.` : undefined
            }
            confirmLabel="Видалити"
            cancelLabel="Скасувати"
         />
      </>
   )
}
