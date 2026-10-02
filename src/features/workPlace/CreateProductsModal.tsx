import { useEffect, useRef, useState } from "react"
import clsx from "clsx"
import { useMutation, useQueries, useQuery, useQueryClient } from "@tanstack/react-query"
import { CheckIcon } from "lucide-react"

import Modal from "@/components/Modal/Modal"
import Dropdown from "@/components/UI/Dropdown"
// TODO: перевір шляхи імпортів під свій проєкт
import { createProduct, deleteProduct, getAllProducts } from "@/api/endpoints/products"
import { getAllProductModels, getProductModelById } from "@/api/endpoints/productModels"
import { getAllOrders } from "@/api/endpoints/orders"
import { useCurrentUser } from "@/hooks/api/auth/useCurrentUser" // TODO: твій хук поточного користувача
import type { ProductModelListRead } from "@/api/types/product_model"
import type { OrderListRead } from "@/api/types/order"

/* ---------------------------- config ----------------------------- */

const MODELS_PAGE_SIZE = 100
const ORDERS_PAGE_SIZE = 100
/** Статуси, при яких замовлення доступне для створення виробів */
const AVAILABLE_STATUSES = ["ACTIVE", "IDLE"] as const

const orderLabel = (o: OrderListRead, modelTitle?: string) =>
   modelTitle ? `Замовлення №${o.id}, ${modelTitle}` : `Замовлення №${o.id}`

const QUERY_KEYS = {
   models: ["product-models", "active"] as const,
   productModel: (id: number) => ["product-model", id] as const,
   orders: ["orders", "products-modal"] as const,
   ordersAll: ["orders"] as const,
   products: ["products"] as const,
}

/** Список id моделей-деталей, які обов'язково треба створити разом з головним виробом */
const getRequiredDetailModelIds = (model: { details_ids?: number[] | null }): number[] => model.details_ids ?? []

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

const isTypingTarget = (target: EventTarget | null) => {
   const el = target as HTMLElement | null
   if (!el) return false
   return el.tagName === "INPUT" || el.tagName === "TEXTAREA" || el.isContentEditable
}

/* ------------------------ product id helpers ------------------------ */

/** Шукає виріб за кодом (код унікальний) і повертає його id */
const findProductIdByCode = async (code: string): Promise<number | null> => {
   const res = await getAllProducts({ page: 1, pageSize: 10, search: code } as Parameters<typeof getAllProducts>[0])
   const found = res.items.find(p => p.code === code)
   return found ? found.id : null
}

/** Дістає id зі відповіді createProduct. Якщо його там немає, шукає виріб за кодом */
const resolveProductId = async (created: unknown, code: string): Promise<number> => {
   const raw = created as { id?: unknown; data?: { id?: unknown } } | null | undefined
   const direct = raw?.id ?? raw?.data?.id
   if (typeof direct === "number") return direct
   if (typeof direct === "string" && direct !== "" && !Number.isNaN(Number(direct))) return Number(direct)

   const byCode = await findProductIdByCode(code)
   if (byCode === null) throw new Error(`Не вдалося визначити id створеного виробу (${code})`)
   return byCode
}

/* ----------------------------- types ----------------------------- */

interface DraftProduct {
   uid: string
   modelId: number
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
   orderId: number
}

interface CreatedEntry {
   code: string
   id: number | null
}

const createDraft = (modelId: number): DraftProduct => ({
   uid: crypto.randomUUID(),
   modelId,
   code: null,
   checking: false,
   codeError: null,
})

/* ------------------------------ row ------------------------------ */

interface ProductRowProps {
   item: DraftProduct
   index: number
   isRoot: boolean
   isSelected: boolean
   modelTitle?: string
   onSelect: () => void
}

function ProductRow({ item, index, isRoot, isSelected, modelTitle, onSelect }: ProductRowProps) {
   return (
      <div
         onClick={onSelect}
         className={clsx(
            "flex items-center gap-2 rounded-md border px-2 py-2 cursor-pointer select-none",
            isSelected
               ? "border-white/60 bg-(--bg-trans-hover-color)"
               : "border-(--stroke-color) bg-(--bg-trans-color)",
         )}
      >
         <span className="w-5 shrink-0 text-center text-sm text-[#D9D9D9]">{index + 1}</span>

         <div className="flex min-w-0 flex-1 flex-col">
            <span className="truncate text-sm md:text-base text-white">{modelTitle ?? `Модель #${item.modelId}`}</span>
            <span className={clsx("truncate text-xs md:text-sm", item.code ? "text-[#D9D9D9]" : "text-yellow-400")}>
               {item.code ?? (item.checking ? "Перевірка коду…" : "Без коду")}
            </span>
         </div>

         {isRoot && (
            <span className="shrink-0 rounded-sm border border-(--stroke-color) px-1.5 text-xs text-[#D9D9D9]">
               головний
            </span>
         )}
         {item.code && <CheckIcon className="size-4 shrink-0 text-green-400" />}
      </div>
   )
}

/* ---------------------------- content ---------------------------- */

function CreateProductsContent({ onClose, onCreated }: Omit<CreateProductsModalProps, "isOpen">) {
   const queryClient = useQueryClient()
   const { data: me } = useCurrentUser()
   const myId = me?.id ? String(me.id) : null

   const [items, setItems] = useState<DraftProduct[]>([])
   const [selectedUid, setSelectedUid] = useState<string | null>(null)
   const [orderId, setOrderId] = useState<number | null>(null)
   const [submitError, setSubmitError] = useState<string | null>(null)
   const scanBufferRef = useRef("")
   const scanTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
   const builtForModelRef = useRef<number | null>(null)

   /* ----- data ----- */

   const modelsQuery = useQuery({
      queryKey: QUERY_KEYS.models,
      queryFn: () =>
         getAllProductModels({ page: 1, pageSize: MODELS_PAGE_SIZE, is_active: true } as Parameters<
            typeof getAllProductModels
         >[0]),
      staleTime: 60_000,
   })

   // Статус у запиті одне поле, тому по запиту на кожен доступний статус
   const ordersQuery = useQueries({
      queries: AVAILABLE_STATUSES.map(status => ({
         queryKey: [...QUERY_KEYS.orders, status],
         queryFn: () =>
            getAllOrders({ page: 1, pageSize: ORDERS_PAGE_SIZE, status } as Parameters<typeof getAllOrders>[0]),
         staleTime: 60_000,
      })),
      combine: results => ({
         items: results.flatMap(r => r.data?.items ?? []) as OrderListRead[],
         isLoading: results.some(r => r.isLoading),
         isError: results.some(r => r.isError),
      }),
   })

   // Доступні: статус ACTIVE/IDLE + виконувати може кожен (порожній масив) або поточний користувач
   const orders = ordersQuery.items
      .filter(o => (AVAILABLE_STATUSES as readonly string[]).includes(String(o.status)))
      .filter(o => {
         const ids = (o.employees_ids ?? []).map(String)
         return ids.length === 0 || (myId !== null && ids.includes(myId))
      })
      .sort((a, b) => a.id - b.id)

   const selectedOrder = orders.find(o => o.id === orderId) ?? null
   const orderModelId = selectedOrder?.product_model_id ?? null

   // Склад моделі замовлення: з нього беремо обов'язкові деталі
   const requirementsQuery = useQuery({
      queryKey: QUERY_KEYS.productModel(orderModelId ?? 0),
      queryFn: () => getProductModelById(orderModelId as number),
      enabled: orderModelId !== null,
      staleTime: 5 * 60_000,
   })

   const models: ProductModelListRead[] = modelsQuery.data?.items ?? []
   const activeModelTitles = new Map(models.map(m => [m.id, m.title]))

   // Назви моделей, яких немає серед активних (замовлення/деталі можуть посилатись на неактивні)
   const requiredDetailIds = requirementsQuery.data ? getRequiredDetailModelIds(requirementsQuery.data) : []
   const missingModelIds = modelsQuery.isSuccess
      ? [...new Set([...orders.map(o => o.product_model_id), ...requiredDetailIds])].filter(
           id => !activeModelTitles.has(id),
        )
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

   const modelTitle = (id: number) => activeModelTitles.get(id) ?? extraModelTitles.get(id)
   const getOrderLabel = (o: OrderListRead) => orderLabel(o, modelTitle(o.product_model_id))

   const selected = items.find(i => i.uid === selectedUid) ?? null
   const rootUid = items.length > 0 ? items[0].uid : null

   /* ----- автоматична побудова рядків при виборі замовлення ----- */

   useEffect(() => {
      if (orderModelId === null) {
         builtForModelRef.current = null
         setItems([])
         setSelectedUid(null)
         return
      }
      const data = requirementsQuery.data
      // будуємо один раз на модель, щоб повторне завантаження не стирало скановані коди
      if (!data || builtForModelRef.current === orderModelId) return
      builtForModelRef.current = orderModelId

      const root = createDraft(orderModelId)
      const parts = getRequiredDetailModelIds(data).map(createDraft)
      setItems([root, ...parts])
      setSelectedUid(root.uid)
      setSubmitError(null)
   }, [orderModelId, requirementsQuery.data])

   /* ----- helpers ----- */

   const updateItem = (uid: string, patch: Partial<DraftProduct>) =>
      setItems(prev => prev.map(i => (i.uid === uid ? { ...i, ...patch } : i)))

   /* ----- create (root first, then children with parent_id = root.id) ----- */

   const createMutation = useMutation({
      mutationFn: async ({ items, orderId }: CreatePayload) => {
         if (items.length === 0) {
            throw new Error("Не вказано жодного виробу для створення")
         }

         const created: CreatedEntry[] = []

         const create = async (item: DraftProduct, parentId: number | null): Promise<number> => {
            const code = item.code?.trim()

            if (!code) {
               throw new Error("Не вказано код виробу")
            }

            const response = await createProduct({
               code,
               product_model_id: item.modelId,
               order_id: orderId,
               parent_id: parentId,
            })

            const entry: CreatedEntry = { code, id: null }
            created.push(entry)

            entry.id = await resolveProductId(response, code)

            if (entry.id === null || entry.id === undefined) {
               throw new Error(`Не вдалося визначити ID виробу ${code}`)
            }

            return entry.id
         }

         let failedNumber = 1

         try {
            const rootId = await create(items[0], null)

            for (let i = 1; i < items.length; i++) {
               failedNumber = i + 1
               await create(items[i], rootId)
            }
         } catch (error) {
            console.error("Помилка створення виробів:", error)

            const notDeleted: string[] = []

            for (const entry of [...created].reverse()) {
               try {
                  const id = entry.id ?? (await findProductIdByCode(entry.code))

                  if (id === null || id === undefined) {
                     throw new Error(`ID виробу ${entry.code} не знайдено`, { cause: error })
                  }

                  await deleteProduct(id)
               } catch (deleteError) {
                  console.error(`Не вдалося видалити виріб ${entry.code}:`, deleteError)

                  notDeleted.push(entry.code)
               }
            }

            const originalMessage = error instanceof Error ? error.message : String(error)

            if (notDeleted.length === 0) {
               throw new Error(
                  `Не вдалося створити виріб №${failedNumber}. ` +
                     `Усі створені вироби скасовано. Причина: ${originalMessage}`,
                  { cause: error },
               )
            }

            throw new Error(
               `Не вдалося створити виріб №${failedNumber}. ` +
                  `Не вдалося видалити вироби з кодами: ${notDeleted.join(", ")}. ` +
                  `Причина помилки створення: ${originalMessage}`,
               { cause: error },
            )
         }
      },
      onSuccess: () => {
         void queryClient.invalidateQueries({ queryKey: QUERY_KEYS.products })
         void queryClient.invalidateQueries({ queryKey: QUERY_KEYS.ordersAll })
         onCreated?.()
         onClose()
      },
      onError: error => {
         setSubmitError(error instanceof Error ? error.message : "Не вдалося створити вироби")
      },
   })

   const submitting = createMutation.isPending

   /* ----- scanning ----- */

   const handleScan = async (rawCode: string) => {
      const code = rawCode.trim()
      if (!code) return
      if (!selected) {
         setSubmitError("Спершу оберіть замовлення, а потім скануйте")
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
         const id = await findProductIdByCode(code)

         if (id !== null) {
            updateItem(uid, { checking: false, code: null, codeError: "Виріб з таким кодом уже існує" })
            return
         }

         updateItem(uid, { checking: false, code, codeError: null })
         // переходимо до наступного рядка без коду
         const next = items.find(i => i.uid !== uid && !i.code)
         if (next) setSelectedUid(next.uid)
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
         // не заважаємо звичайному вводу в полях (пошук, дропдауни з input)
         if (isTypingTarget(e.target)) return

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
      if (orderId === null || !selectedOrder) {
         setSubmitError("Оберіть замовлення")
         return
      }
      if (items.length === 0) {
         setSubmitError("Дочекайтесь завантаження складу виробу")
         return
      }

      const missingIdx = items.findIndex(i => !i.code)
      if (missingIdx !== -1) {
         setSelectedUid(items[missingIdx].uid)
         setSubmitError(
            missingIdx === 0
               ? "Відскануйте код головного виробу"
               : `Відскануйте код для деталі №${missingIdx + 1}. Потрібно створити всі деталі`,
         )
         return
      }

      setSubmitError(null)
      createMutation.mutate({ items, orderId })
   }

   /* ----- render ----- */

   const requirementsLoading = orderModelId !== null && requirementsQuery.isLoading
   const filled = items.filter(i => i.code).length
   const canSubmit = !submitting && items.length > 0 && !requirementsLoading

   return (
      <div>
         <Modal.Header>Створення виробів за сканом</Modal.Header>

         <Modal.Content className="!p-0 !border-0 !my-3">
            <div className="flex flex-col gap-4">
               {/* ---------- замовлення (визначає головну модель і деталі) ---------- */}
               <div className="flex flex-col gap-2">
                  <Modal.Label>Замовлення</Modal.Label>
                  <Dropdown className="w-full">
                     <Dropdown.Button className="w-full" disabled={submitting || ordersQuery.isLoading}>
                        <span className={clsx("truncate", !selectedOrder && "opacity-60")}>
                           {ordersQuery.isLoading
                              ? "Завантаження…"
                              : selectedOrder
                                ? getOrderLabel(selectedOrder)
                                : "Оберіть замовлення"}
                        </span>
                        <Dropdown.Chevron />
                     </Dropdown.Button>
                     <Dropdown.Content>
                        {orders.length === 0 && (
                           <p className="px-3 md:px-4 py-2 opacity-60">Немає доступних замовлень</p>
                        )}
                        {orders.map(o => (
                           <Dropdown.Item
                              key={o.id}
                              onClick={() => {
                                 setOrderId(o.id)
                                 setSubmitError(null)
                              }}
                           >
                              {getOrderLabel(o)}
                           </Dropdown.Item>
                        ))}
                     </Dropdown.Content>
                  </Dropdown>
                  {ordersQuery.isError && <p className="text-sm text-red-400">Не вдалося завантажити замовлення</p>}
                  {requirementsQuery.isError && (
                     <p className="text-sm text-red-400">Не вдалося завантажити склад виробу</p>
                  )}
               </div>

               <div className="grid h-[55vh] grid-cols-1 gap-4 md:grid-cols-[minmax(0,2fr)_minmax(0,3fr)]">
                  {/* ---------- ліва частина: список ---------- */}
                  <div className="flex min-h-0 flex-col gap-2 border-(--stroke-color) md:border-r md:pr-4">
                     <div className="flex min-h-0 flex-1 flex-col gap-2 overflow-y-auto">
                        {items.map((item, index) => (
                           <ProductRow
                              key={item.uid}
                              item={item}
                              index={index}
                              isRoot={item.uid === rootUid}
                              isSelected={item.uid === selectedUid}
                              modelTitle={modelTitle(item.modelId)}
                              onSelect={() => setSelectedUid(item.uid)}
                           />
                        ))}

                        {items.length === 0 && (
                           <p className="py-6 text-center text-sm text-[#D9D9D9]">
                              {requirementsLoading ? "Завантаження складу…" : "Оберіть замовлення"}
                           </p>
                        )}
                     </div>

                     {items.length > 0 && (
                        <p className="text-sm text-[#D9D9D9]">
                           Відскановано: {filled} з {items.length}
                        </p>
                     )}
                  </div>

                  {/* ---------- права частина: інформація ---------- */}
                  <div className="flex min-h-0 flex-col gap-4 overflow-y-auto">
                     {!selected ? (
                        <p className="m-auto text-sm text-[#D9D9D9]">Оберіть замовлення</p>
                     ) : (
                        <>
                           <p className="text-sm md:text-base text-[#D9D9D9]">
                              Виріб №{items.findIndex(i => i.uid === selected.uid) + 1}
                              {selected.uid === rootUid ? " · головний" : " · деталь"}
                           </p>

                           <div className="flex flex-col gap-2">
                              <Modal.Label>
                                 {selected.uid === rootUid ? "Модель головного виробу" : "Модель деталі"}
                              </Modal.Label>
                              <div className="rounded-md border border-(--stroke-color) bg-(--bg-trans-color) px-4 py-3 text-sm md:text-base text-white">
                                 {modelTitle(selected.modelId) ?? `Модель #${selected.modelId}`}
                              </div>
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
                                    <p className="text-sm md:text-base text-yellow-400">Відскануйте виріб</p>
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
                  disabled={!canSubmit}
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
