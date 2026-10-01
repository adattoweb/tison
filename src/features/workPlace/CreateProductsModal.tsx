import { useEffect, useRef, useState } from "react"
import clsx from "clsx"
import { useMutation, useQueries, useQuery, useQueryClient } from "@tanstack/react-query"
import { CheckIcon, GripVerticalIcon, PlusIcon, Trash2Icon } from "lucide-react"
import {
   DndContext,
   KeyboardSensor,
   PointerSensor,
   closestCenter,
   useSensor,
   useSensors,
   type DragEndEvent,
} from "@dnd-kit/core"
import {
   SortableContext,
   arrayMove,
   sortableKeyboardCoordinates,
   useSortable,
   verticalListSortingStrategy,
} from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"

import Modal from "@/components/Modal/Modal"
import Dropdown from "@/components/UI/Dropdown"
// TODO: перевір шляхи імпортів під свій проєкт
import { createProduct, deleteProduct, getAllProducts } from "@/api/endpoints/products"
import { getAllProductModels, getProductModelById } from "@/api/endpoints/productModels"
import { getAllOrders } from "@/api/endpoints/orders"
import type { ProductModelListRead } from "@/api/types/product_model"
import type { OrderListRead } from "@/api/types/order"

/* ---------------------------- config ----------------------------- */

const MODELS_PAGE_SIZE = 100
const ORDERS_PAGE_SIZE = 100
/** Якщо замовлення необов'язкове — постав false */
const REQUIRE_ORDER = true

/** Чиста синхронна функція: назва моделі приходить уже завантаженою */
const orderLabel = (o: OrderListRead, modelTitle?: string) =>
   modelTitle ? `Замовлення №${o.id}, ${modelTitle}` : `Замовлення №${o.id}`

const QUERY_KEYS = {
   models: ["product-models", "active"] as const,
   productModel: (id: number) => ["product-model", id] as const,
   orders: ["orders", "products-modal"] as const,
   products: ["products"] as const,
}

/* ------------------- scanner input (layout-independent) ------------------- */

/** Якщо Enter не прийшов, вважаємо скан завершеним після цієї паузи між символами */
const SCAN_IDLE_MS = 120

/** Українська розкладка -> латиниця (запасний варіант, коли немає e.code) */
const CYR_TO_LAT: Record<string, string> = {
   й: "q",
   ц: "w",
   у: "e",
   к: "r",
   е: "t",
   н: "y",
   г: "u",
   ш: "i",
   щ: "o",
   з: "p",
   х: "[",
   ї: "]",
   ґ: "\\",
   ф: "a",
   і: "s",
   в: "d",
   а: "f",
   п: "g",
   р: "h",
   о: "j",
   л: "k",
   д: "l",
   ж: ";",
   є: "'",
   я: "z",
   ч: "x",
   с: "c",
   м: "v",
   и: "b",
   т: "n",
   ь: "m",
   б: ",",
   ю: ".",
}

/** Фізична клавіша -> [без Shift, з Shift] */
const CODE_CHARS: Record<string, [string, string]> = {
   Minus: ["-", "_"],
   Equal: ["=", "+"],
   Slash: ["/", "?"],
   Period: [".", ">"],
   Comma: [",", "<"],
   Semicolon: [";", ":"],
   Quote: ["'", '"'],
   BracketLeft: ["[", "{"],
   BracketRight: ["]", "}"],
   Backslash: ["\\", "|"],
   Backquote: ["`", "~"],
   NumpadSubtract: ["-", "-"],
   NumpadDecimal: [".", "."],
   NumpadDivide: ["/", "/"],
}
const SHIFT_DIGITS = ")!@#$%^&*("

/** Повертає символ латиницею незалежно від поточної розкладки, або null для службових клавіш */
function keyToLatin(e: KeyboardEvent): string | null {
   const shift = e.shiftKey

   const letter = /^Key([A-Z])$/.exec(e.code)
   if (letter) {
      const upper = shift !== e.getModifierState("CapsLock")
      return upper ? letter[1] : letter[1].toLowerCase()
   }

   const digit = /^(?:Digit|Numpad)([0-9])$/.exec(e.code)
   if (digit) return shift && e.code.startsWith("Digit") ? SHIFT_DIGITS[Number(digit[1])] : digit[1]

   const mapped = CODE_CHARS[e.code]
   if (mapped) return shift ? mapped[1] : mapped[0]

   // Запасний варіант: символ прийшов без коду клавіші (софтова емуляція вводу)
   if (e.key.length === 1) {
      const lower = e.key.toLowerCase()
      const lat = CYR_TO_LAT[lower]
      if (!lat) return e.key
      return e.key === lower ? lat : lat.toUpperCase()
   }
   return null
}

/* ----------------------------- types ----------------------------- */

interface DraftProduct {
   uid: string
   modelId: number | null
   code: string | null
   checking: boolean
   codeError: string | null
}

interface CreateProductsModalProps {
   isOpen: boolean
   onClose: () => void
   onCreated?: () => void
}

interface CreatePayload {
   items: DraftProduct[]
   orderId: number | null
}

const createDraft = (): DraftProduct => ({
   uid: crypto.randomUUID(),
   modelId: null,
   code: null,
   checking: false,
   codeError: null,
})

/* ------------------------- sortable row -------------------------- */

interface SortableRowProps {
   item: DraftProduct
   index: number
   isRoot: boolean
   isSelected: boolean
   modelTitle?: string
   disabled: boolean
   onSelect: () => void
   onDelete: () => void
}

function SortableRow({ item, index, isRoot, isSelected, modelTitle, disabled, onSelect, onDelete }: SortableRowProps) {
   const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
      id: item.uid,
      disabled,
   })

   const isComplete = !!item.modelId && !!item.code

   return (
      <div
         ref={setNodeRef}
         style={{ transform: CSS.Transform.toString(transform), transition }}
         onClick={onSelect}
         className={clsx(
            "flex items-center gap-2 rounded-md border px-2 py-2 cursor-pointer select-none",
            isSelected
               ? "border-white/60 bg-(--bg-trans-hover-color)"
               : "border-(--stroke-color) bg-(--bg-trans-color)",
            isDragging && "relative z-10 opacity-80",
         )}
      >
         <button
            type="button"
            aria-label="Перемістити"
            className="cursor-grab touch-none text-[#D9D9D9] active:cursor-grabbing"
            onClick={e => e.stopPropagation()}
            {...attributes}
            {...listeners}
         >
            <GripVerticalIcon className="size-4 md:size-5" />
         </button>

         <span className="w-5 shrink-0 text-center text-sm text-[#D9D9D9]">{index + 1}</span>

         <div className="flex min-w-0 flex-1 flex-col">
            <span className="truncate text-sm md:text-base text-white">{modelTitle ?? "Новий виріб"}</span>
            <span className={clsx("truncate text-xs md:text-sm", item.code ? "text-[#D9D9D9]" : "text-yellow-400")}>
               {item.code ?? (item.checking ? "Перевірка коду…" : "Без коду")}
            </span>
         </div>

         {isRoot && (
            <span className="shrink-0 rounded-sm border border-(--stroke-color) px-1.5 text-xs text-[#D9D9D9]">
               головний
            </span>
         )}
         {isComplete && <CheckIcon className="size-4 shrink-0 text-green-400" />}

         <button
            type="button"
            aria-label="Видалити"
            className="shrink-0 cursor-pointer text-[#D9D9D9] hover:text-red-400 disabled:opacity-40"
            disabled={disabled}
            onClick={e => {
               e.stopPropagation()
               onDelete()
            }}
         >
            <Trash2Icon className="size-4 md:size-5" />
         </button>
      </div>
   )
}

/* ---------------------------- content ---------------------------- */

function CreateProductsContent({ onClose, onCreated }: Omit<CreateProductsModalProps, "isOpen">) {
   const queryClient = useQueryClient()

   const [items, setItems] = useState<DraftProduct[]>([])
   const [selectedUid, setSelectedUid] = useState<string | null>(null)
   const [orderId, setOrderId] = useState<number | null>(null)
   const [submitError, setSubmitError] = useState<string | null>(null)
   const scanBufferRef = useRef("")
   const scanTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

   const sensors = useSensors(
      useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
      useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
   )

   /* ----- data ----- */

   const modelsQuery = useQuery({
      queryKey: QUERY_KEYS.models,
      queryFn: () =>
         getAllProductModels({ page: 1, pageSize: MODELS_PAGE_SIZE, is_active: true } as Parameters<
            typeof getAllProductModels
         >[0]),
      staleTime: 60_000,
   })

   const ordersQuery = useQuery({
      queryKey: QUERY_KEYS.orders,
      queryFn: () => getAllOrders({ page: 1, pageSize: ORDERS_PAGE_SIZE } as Parameters<typeof getAllOrders>[0]),
      staleTime: 60_000,
   })

   const models: ProductModelListRead[] = modelsQuery.data?.items ?? []
   const rootModels = models.filter(m => !m.is_detail)
   const detailModels = models.filter(m => m.is_detail)

   const orders: OrderListRead[] = ordersQuery.data?.items ?? []

   const modelTitle = (id: number | null) => models.find(m => m.id === id)?.title

   const activeModelTitles = new Map(models.map(m => [m.id, m.title]))
   const missingModelIds = modelsQuery.isSuccess
      ? [...new Set(orders.map(o => o.product_model_id))].filter(id => !activeModelTitles.has(id))
      : []

   const extraModelQueries = useQueries({
      queries: missingModelIds.map(id => ({
         queryKey: QUERY_KEYS.productModel(id),
         queryFn: () => getProductModelById(id),
         staleTime: 5 * 60_000,
      })),
   })

   const extraModelTitles = new Map<number, string>()
   missingModelIds.forEach((id, i) => {
      const title = extraModelQueries[i]?.data?.title
      if (title) extraModelTitles.set(id, title)
   })

   const getOrderLabel = (o: OrderListRead) =>
      orderLabel(o, activeModelTitles.get(o.product_model_id) ?? extraModelTitles.get(o.product_model_id))

   const selected = items.find(i => i.uid === selectedUid) ?? null
   const rootUid = items.length > 0 ? items[0].uid : null

   const rootItem = items.find(i => i.uid === rootUid) ?? null
   const rootModelId = rootItem?.modelId ?? null

   const filteredOrders = rootModelId !== null ? orders.filter(o => o.product_model_id === rootModelId) : []
   const selectedOrder = filteredOrders.find(o => o.id === orderId) ?? null

   /* ----- helpers ----- */

   const updateItem = (uid: string, patch: Partial<DraftProduct>) =>
      setItems(prev => prev.map(i => (i.uid === uid ? { ...i, ...patch } : i)))

   /* ----- create (root first, then children with parent_id = root.id) ----- */

   const createMutation = useMutation({
      mutationFn: async ({ items, orderId }: CreatePayload) => {
         const createdIds: number[] = []
         // у типі ProductCreateInput немає id, а бекенд його повертає
         const create = async (item: DraftProduct, parentId: number | null) => {
            const created = (await createProduct({
               code: item.code!,
               product_model_id: item.modelId!,
               order_id: orderId,
               parent_id: parentId,
            })) as unknown as { id: number }
            createdIds.push(created.id)
            return created.id
         }

         const root = items[0]
         const children = items.slice(1)
         let failedNumber = items.length // номер виробу в списку, на якому сталась помилка

         try {
            const rootId = await create(root, null)
            for (let i = 0; i < children.length; i++) {
               failedNumber = i + 1
               await create(children[i], rootId)
            }
         } catch {
            // Відкат у зворотному порядку: спочатку діти, останнім — корінь
            const notDeleted: number[] = []
            for (const id of [...createdIds].reverse()) {
               try {
                  await deleteProduct(id)
               } catch {
                  notDeleted.push(id)
               }
            }
            throw new Error(
               notDeleted.length === 0
                  ? `Не вдалося створити виріб №${failedNumber}. Усі створені вироби скасовано`
                  : `Не вдалося створити виріб №${failedNumber}. Не вдалося видалити вироби з id: ${notDeleted.join(", ")}`,
            )
         }
      },
      onSuccess: () => {
         void queryClient.invalidateQueries({ queryKey: QUERY_KEYS.products })
         onCreated?.()
         onClose()
      },
      onError: error => {
         setSubmitError(error instanceof Error ? error.message : "Не вдалося створити вироби")
      },
   })

   const submitting = createMutation.isPending

   /* ----- list actions ----- */

   const handleAdd = () => {
      const draft = createDraft()
      setItems(prev => [...prev, draft])
      setSelectedUid(draft.uid)
      setSubmitError(null)
   }

   const handleDelete = (uid: string) => {
      const idx = items.findIndex(i => i.uid === uid)
      const next = items.filter(i => i.uid !== uid)
      setItems(next)
      if (selectedUid === uid) {
         setSelectedUid(next[Math.min(idx, next.length - 1)]?.uid ?? null)
      }
      setSubmitError(null)
   }

   const handleDragEnd = ({ active, over }: DragEndEvent) => {
      if (!over || active.id === over.id) return
      setItems(prev => {
         const from = prev.findIndex(i => i.uid === active.id)
         const to = prev.findIndex(i => i.uid === over.id)
         return arrayMove(prev, from, to)
      })
   }

   /* ----- scanning ----- */

   const handleScan = async (rawCode: string) => {
      const code = rawCode.trim()
      if (!code) return
      if (!selected) {
         setSubmitError("Спершу додайте або оберіть виріб, а потім скануйте")
         return
      }

      const uid = selected.uid
      setSubmitError(null)

      if (items.some(i => i.uid !== uid && i.code === code)) {
         updateItem(uid, { code: null, codeError: "Цей код уже відскановано в списку" })
         return
      }

      updateItem(uid, { checking: true, codeError: null })

      try {
         const res = await getAllProducts({ page: 1, pageSize: 10, search: code } as Parameters<
            typeof getAllProducts
         >[0])
         const exists = res.items.some(p => p.code === code)

         updateItem(
            uid,
            exists
               ? { checking: false, code: null, codeError: "Виріб з таким кодом уже існує" }
               : { checking: false, code, codeError: null },
         )
      } catch {
         updateItem(uid, { checking: false, code: null, codeError: "Не вдалося перевірити код. Спробуйте ще раз" })
      }
   }

   // Глобальний слухач клавіатури: працює незалежно від фокусу й розкладки.
   // Символи збираються по фізичних клавішах (e.code), тому завжди виходить латиниця.
   // Скан завершується по Enter/Tab або після паузи SCAN_IDLE_MS між символами.
   const handleScanRef = useRef(handleScan)
   useEffect(() => {
      handleScanRef.current = handleScan
   })

   useEffect(() => {
      const flush = () => {
         if (scanTimerRef.current) clearTimeout(scanTimerRef.current)
         scanTimerRef.current = null
         const value = scanBufferRef.current
         scanBufferRef.current = ""
         if (value) void handleScanRef.current(value)
      }

      const onKeyDown = (e: KeyboardEvent) => {
         if (e.ctrlKey || e.metaKey || e.altKey || e.isComposing) return

         if (e.key === "Enter" || e.key === "Tab") {
            // Якщо буфер порожній — Enter/Tab працюють як звичайно (кнопки, дропдауни)
            if (!scanBufferRef.current) return
            e.preventDefault()
            flush()
            return
         }

         // Пробіл не перехоплюємо, поки не почався скан (щоб працювали кнопки з клавіатури)
         if (e.code === "Space" && !scanBufferRef.current) return

         const char = keyToLatin(e)
         if (char === null) return

         e.preventDefault()
         scanBufferRef.current += char
         if (scanTimerRef.current) clearTimeout(scanTimerRef.current)
         scanTimerRef.current = setTimeout(flush, SCAN_IDLE_MS)
      }

      document.addEventListener("keydown", onKeyDown, true)
      return () => {
         document.removeEventListener("keydown", onKeyDown, true)
         if (scanTimerRef.current) clearTimeout(scanTimerRef.current)
      }
   }, [])

   /* ----- submit ----- */

   const handleSubmit = () => {
      if (REQUIRE_ORDER && orderId === null) {
         setSubmitError("Оберіть замовлення")
         return
      }
      if (items.length === 0) {
         setSubmitError("Додайте хоча б один виріб")
         return
      }

      const invalidIdx = items.findIndex((i, idx) => {
         if (!i.modelId || !i.code) return true
         const model = models.find(m => m.id === i.modelId)
         if (!model) return true
         const isRootRow = idx === 0
         return isRootRow ? model.is_detail : !model.is_detail
      })
      if (invalidIdx !== -1) {
         setSelectedUid(items[invalidIdx].uid)
         setSubmitError(
            invalidIdx === 0
               ? "Головний виріб: оберіть модель (не деталь) та відскануйте код"
               : `Деталь №${invalidIdx + 1}: оберіть модель-деталь та відскануйте код`,
         )
         return
      }

      setSubmitError(null)
      createMutation.mutate({ items, orderId })
   }

   /* ----- render ----- */

   return (
      <div>
         <Modal.Header>Створення виробів за сканом</Modal.Header>

         <Modal.Content className="!p-0 !border-0 !my-3">
            <div className="flex flex-col gap-4">
               {/* ---------- замовлення (одне на всі вироби) ---------- */}
               <div className="flex flex-col gap-2">
                  <Modal.Label>Замовлення</Modal.Label>
                  <Dropdown className="w-full">
                     <Dropdown.Button className="w-full" disabled={submitting || ordersQuery.isLoading}>
                        <span className="truncate">
                           {ordersQuery.isLoading
                              ? "Завантаження…"
                              : selectedOrder
                                ? getOrderLabel(selectedOrder)
                                : "Оберіть замовлення"}
                        </span>
                        <Dropdown.Chevron />
                     </Dropdown.Button>
                     <Dropdown.Content>
                        {!REQUIRE_ORDER && (
                           <Dropdown.Item onClick={() => setOrderId(null)}>Без замовлення</Dropdown.Item>
                        )}
                        {orders.map(o => (
                           <Dropdown.Item key={o.id} onClick={() => setOrderId(o.id)}>
                              {getOrderLabel(o)}
                           </Dropdown.Item>
                        ))}
                     </Dropdown.Content>
                  </Dropdown>
                  {ordersQuery.isError && <p className="text-sm text-red-400">Не вдалося завантажити замовлення</p>}
               </div>

               <div className="grid h-[55vh] grid-cols-1 gap-4 md:grid-cols-[minmax(0,2fr)_minmax(0,3fr)]">
                  {/* ---------- ліва частина: список ---------- */}
                  <div className="flex min-h-0 flex-col gap-2 border-(--stroke-color) md:border-r md:pr-4">
                     <div className="flex min-h-0 flex-1 flex-col gap-2 overflow-y-auto">
                        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                           <SortableContext items={items.map(i => i.uid)} strategy={verticalListSortingStrategy}>
                              {items.map((item, index) => (
                                 <SortableRow
                                    key={item.uid}
                                    item={item}
                                    index={index}
                                    isRoot={item.uid === rootUid}
                                    isSelected={item.uid === selectedUid}
                                    modelTitle={modelTitle(item.modelId)}
                                    disabled={submitting}
                                    onSelect={() => setSelectedUid(item.uid)}
                                    onDelete={() => handleDelete(item.uid)}
                                 />
                              ))}
                           </SortableContext>
                        </DndContext>

                        {items.length === 0 && (
                           <p className="py-6 text-center text-sm text-[#D9D9D9]">
                              Список порожній. Додайте перший виріб
                           </p>
                        )}
                     </div>

                     <button
                        type="button"
                        disabled={submitting}
                        onClick={handleAdd}
                        className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-md border border-dashed border-(--stroke-color) px-4 py-2 text-sm md:text-base hover:bg-(--bg-trans-hover-color) disabled:opacity-50"
                     >
                        <PlusIcon className="size-4 md:size-5" />
                        Додати виріб
                     </button>
                  </div>

                  {/* ---------- права частина: інформація ---------- */}
                  <div className="flex min-h-0 flex-col gap-4 overflow-y-auto">
                     {!selected ? (
                        <p className="m-auto text-sm text-[#D9D9D9]">Оберіть або додайте виріб</p>
                     ) : (
                        <>
                           <p className="text-sm md:text-base text-[#D9D9D9]">
                              Виріб №{items.findIndex(i => i.uid === selected.uid) + 1}
                              {selected.uid === rootUid && " · головний"}
                           </p>

                           <div className="flex flex-col gap-2">
                              <Modal.Label>
                                 {selected.uid === rootUid ? "Модель головного виробу" : "Модель деталі"}
                              </Modal.Label>
                              <Dropdown className="w-full">
                                 <Dropdown.Button className="w-full" disabled={submitting || modelsQuery.isLoading}>
                                    <span className="truncate">
                                       {modelsQuery.isLoading
                                          ? "Завантаження…"
                                          : (modelTitle(selected.modelId) ?? "Оберіть модель")}
                                    </span>
                                    <Dropdown.Chevron />
                                 </Dropdown.Button>
                                 <Dropdown.Content>
                                    {(selected.uid === rootUid ? rootModels : detailModels).length === 0 && (
                                       <p className="px-3 py-2 text-sm text-[#D9D9D9]">
                                          {selected.uid === rootUid ? "Немає моделей виробів" : "Немає моделей-деталей"}
                                       </p>
                                    )}
                                    {(selected.uid === rootUid ? rootModels : detailModels).map(m => (
                                       <Dropdown.Item
                                          key={m.id}
                                          onClick={() => {
                                             updateItem(selected.uid, { modelId: m.id })
                                             // якщо змінили модель головного виробу — попереднє замовлення могло стати невалідним
                                             if (selected.uid === rootUid && m.id !== rootModelId) {
                                                setOrderId(null)
                                             }
                                          }}
                                       >
                                          {m.title}
                                       </Dropdown.Item>
                                    ))}
                                 </Dropdown.Content>
                              </Dropdown>
                              {modelsQuery.isError && (
                                 <p className="text-sm text-red-400">Не вдалося завантажити моделі</p>
                              )}
                           </div>

                           <div className="flex flex-col gap-2">
                              <Modal.Label>Код виробу</Modal.Label>
                              <div className="rounded-md border border-(--stroke-color) bg-(--bg-trans-color) px-4 py-3">
                                 {selected.checking ? (
                                    <p className="text-sm md:text-base text-[#D9D9D9]">Перевірка коду…</p>
                                 ) : selected.code ? (
                                    <p className="flex items-center gap-2 break-all text-sm md:text-base text-white">
                                       <CheckIcon className="size-4 shrink-0 text-green-400" />
                                       {selected.code}
                                    </p>
                                 ) : (
                                    <p className="text-sm md:text-base text-yellow-400">Відскануйте новий виріб</p>
                                 )}
                              </div>
                              {selected.codeError && <p className="text-sm text-red-400">{selected.codeError}</p>}
                           </div>
                        </>
                     )}
                  </div>
               </div>
            </div>
         </Modal.Content>

         <div className="flex flex-col gap-3">
            {submitError && <p className="text-sm text-red-400">{submitError}</p>}
            <div className="flex justify-end gap-3">
               <button
                  type="button"
                  disabled={submitting}
                  onClick={onClose}
                  className="cursor-pointer rounded-md border border-(--stroke-color) bg-(--bg-trans-color) px-4 py-2 text-sm md:text-base hover:bg-(--bg-trans-hover-color) disabled:opacity-50"
               >
                  Скасувати
               </button>
               <button
                  type="button"
                  disabled={submitting || items.length === 0}
                  onClick={handleSubmit}
                  className="cursor-pointer rounded-md border border-(--stroke-color) bg-(--bg-trans-hover-color) px-4 py-2 text-sm md:text-base disabled:cursor-not-allowed disabled:opacity-50"
               >
                  {submitting ? "Створення…" : `Створити (${items.length})`}
               </button>
            </div>
         </div>
      </div>
   )
}

/* ----------------------------- modal ----------------------------- */

export default function CreateProductsModal({ isOpen, onClose, onCreated }: CreateProductsModalProps) {
   return (
      <Modal isOpen={isOpen} onClose={onClose} className="md:w-225! xl:w-250! 2xl:w-250!">
         {/* Modal повністю розмонтовує children при закритті, тому стан списку скидається автоматично */}
         <CreateProductsContent onClose={onClose} onCreated={onCreated} />
      </Modal>
   )
}
