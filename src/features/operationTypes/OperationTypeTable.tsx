// OperationTypesTable.tsx

import { useState } from "react"
import { Pencil, RotateCcw, Search, Trash2 } from "lucide-react"
import Table from "@/components/Table/Table"
import { TablePagination } from "@/components/Table/TablePagination"
import { RowMenu } from "@/components/Table/RowMenu"
import { ConfirmModal } from "@/components/Modal/ConfirmModal"
import { useToast } from "@/components/Toast/useToast"
import Dropdown from "@/components/UI/Dropdown"
import type { OperationTypeRead } from "@/api/types/operationType"
import { UpdateOperationTypesModal } from "./UpdateOperationTypesModal"

import { useDebouncedValue } from "@/hooks/api/useDebouncedValue"
import { useAllOperationTypes } from "@/hooks/api/operationTypes/useAllOperationTypes"
import { useDeleteOperationType } from "@/hooks/api/operationTypes/useDeleteOperationTypes"
import { TOAST_DURATION } from "@/constants/app"
import { useDearchiveOperationType } from "@/hooks/api/operationTypes/useDearchiveOperationTypes"

const columns = ["Назва", "Бали", ""]

const tableClassNames = "min-w-275 grid-cols-[1fr_1fr_48px]"

const DEFAULT_PAGE_SIZE = 10

const ACTIVE_FILTER_OPTIONS: { label: string; value: boolean }[] = [
   { label: "Активні", value: true },
   { label: "Неактивні", value: false },
]

export function OperationTypesTable() {
   const [search, setSearch] = useState("")
   const [page, setPage] = useState(1)
   const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE)
   const [isActive, setIsActive] = useState<boolean>(true)

   // Тип операції зберігаємо окремо від isOpen, щоб форма не порожніла під час закриття модалки
   const [editingType, setEditingType] = useState<OperationTypeRead | undefined>()
   const [isEditOpen, setIsEditOpen] = useState(false)
   const [deletingType, setDeletingType] = useState<OperationTypeRead | null>(null)

   const debouncedSearch = useDebouncedValue(search, 400)
   const { addToast } = useToast()

   const { data, isFetching } = useAllOperationTypes({
      page,
      pageSize,
      search: debouncedSearch,
      isActive,
   })
   const { mutate: doDeleteOperationType } = useDeleteOperationType()
   const { mutate: doDearchiveOperationType } = useDearchiveOperationType()

   function handleSearchChange(value: string) {
      setSearch(value)
      setPage(1)
   }

   function handleActiveChange(value: boolean) {
      setIsActive(value)
      setPage(1)
   }

   function handleEdit(type: OperationTypeRead) {
      setEditingType(type)
      setIsEditOpen(true)
   }

   function handleRestore(type: OperationTypeRead) {
      doDearchiveOperationType(type.id, {
         onSuccess: () => {
            addToast("Тип операції відновлено!", { duration: TOAST_DURATION, type: "success" })
            // відновили останній запис на сторінці неактивних, повертаємось на попередню
            if (operationTypes.length === 1 && page > 1) setPage(page - 1)
         },
      })
   }

   const operationTypes = data?.items ?? []
   const total = data?.total ?? 0
   const activeLabel = ACTIVE_FILTER_OPTIONS.find(option => option.value === isActive)?.label ?? "Усі"

   return (
      <>
         <Table.Wrapper>
            <Table.Header>
               <div className="flex flex-wrap items-center gap-4">
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
                        <span className="font-normal text-white whitespace-nowrap">{activeLabel}</span>
                        <Dropdown.Chevron />
                     </Dropdown.Button>

                     <Dropdown.Content>
                        {ACTIVE_FILTER_OPTIONS.map(option => (
                           <Dropdown.Item key={option.label} onClick={() => handleActiveChange(option.value)}>
                              {option.label}
                           </Dropdown.Item>
                        ))}
                     </Dropdown.Content>
                  </Dropdown>
               </div>
            </Table.Header>

            <Table
               columns={columns}
               tableClassNames={tableClassNames}
               className={isFetching ? "opacity-60 transition-opacity" : ""}
            >
               {operationTypes.map(type => (
                  <Table.Row key={type.id}>
                     <Table.Text text={type.name} />
                     <Table.Text text={type.points} />
                     <RowMenu
                        actions={
                           isActive
                              ? [
                                   { label: "Редагувати", Icon: Pencil, onClick: () => handleEdit(type) },
                                   {
                                      label: "Видалити",
                                      Icon: Trash2,
                                      danger: true,
                                      onClick: () => setDeletingType(type),
                                   },
                                ]
                              : [
                                   { label: "Редагувати", Icon: Pencil, onClick: () => handleEdit(type) },
                                   {
                                      label: "Відновити",
                                      Icon: RotateCcw,
                                      onClick: () => handleRestore(type),
                                   },
                                ]
                        }
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
                  entityLabel="типів операцій"
                  className="min-w-300"
               />
            </Table>
         </Table.Wrapper>

         {editingType && <UpdateOperationTypesModal type={editingType} isOpen={isEditOpen} setIsOpen={setIsEditOpen} />}

         <ConfirmModal
            isOpen={deletingType !== null}
            onClose={() => setDeletingType(null)}
            onConfirm={() => {
               if (!deletingType) return
               doDeleteOperationType(deletingType.id, {
                  onSuccess: () => {
                     addToast("Успішно видалено тип операції!", { duration: TOAST_DURATION, type: "success" })
                     // видалили останній запис на сторінці, повертаємось на попередню
                     if (operationTypes.length === 1 && page > 1) setPage(page - 1)
                  },
               })
            }}
            title="Видалити тип операції?"
            description={deletingType ? `Тип операції «${deletingType.name}» буде видалено безповоротно.` : undefined}
            confirmLabel="Видалити"
            cancelLabel="Скасувати"
         />
      </>
   )
}
