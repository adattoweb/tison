import { useNavigate, useParams } from "react-router"
import PageHeader from "@/components/UI/PageHeader"
import { ErrorPage } from "@/components/ErrorPage/ErrorPage"
import PageDescription from "@/components/UI/PageDescription"
import { ProductHeader } from "./ProductHeader"
import { Info } from "./Info"
import { History } from "./History"
import { Chart } from "./Chart"
import { useLayoutMode, type LayoutMode } from "@/hooks/ui/useLayoutMode"
import { useProduct } from "@/hooks/api/products/useProduct"
import { useOrder } from "@/hooks/api/orders/useOrder"
import { useAllProductModels } from "@/hooks/api/productModels/useAllProductModels"
import Button from "@/components/UI/Button"
import { EditIcon, Trash } from "lucide-react"
import { useState } from "react"
import { ConfirmModal } from "@/components/Modal/ConfirmModal"
import { useDeleteProduct } from "@/hooks/api/products/useDeleteProduct"
import { UpdateProductModal } from "./UpdateProductModal"
import { useToast } from "@/components/Toast/useToast"
import { TOAST_DURATION } from "@/constants/app"
import ProductDashboard from "./ProductDashboard"
import { Can } from "@/components/Auth/Can"
import { ParentProduct } from "./ParentProduct"
import { ChildrenProducts } from "./ChildrenProducts"

const WIDE_AREAS = `
   "header header header header header header header header header header"
   "info info history history history history analysis analysis analysis analysis"
   "info info history history history history chart chart chart chart"
`

const MEDIUM_AREAS = `
   "header header header header header header header header header header"
   "info info info info info history history history history history"
   "info info info info info history history history history history"
   "analysis analysis analysis analysis analysis chart chart chart chart chart"
`

const STACKED_AREAS = `
   "header header header header header header header header header header"
   "info info info info info info info info info info"
   "analysis analysis analysis analysis analysis analysis analysis analysis analysis analysis"
   "history history history history history history history history history history"
   "chart chart chart chart chart chart chart chart chart chart"
`

const AREAS_BY_MODE: Record<LayoutMode, string> = {
   wide: WIDE_AREAS,
   medium: MEDIUM_AREAS,
   stacked: STACKED_AREAS,
}

const COLUMNS = 10

const areaRow = (...cells: [name: string, span: number][]) =>
   `"${cells.map(([name, span]) => Array(span).fill(name).join(" ")).join(" ")}"`

function buildAreas(mode: LayoutMode, hasParent: boolean, hasChildren: boolean): string {
   const rows: string[] = []

   if (hasParent && hasChildren && mode !== "stacked") {
      rows.push(areaRow(["parent", COLUMNS / 2], ["children", COLUMNS / 2]))
   } else {
      if (hasParent) rows.push(areaRow(["parent", COLUMNS]))
      if (hasChildren) rows.push(areaRow(["children", COLUMNS]))
   }

   return rows.length === 0 ? AREAS_BY_MODE[mode] : `${AREAS_BY_MODE[mode]}\n${rows.join("\n")}`
}

export function Product() {
   const mode = useLayoutMode()
   const { id } = useParams()
   const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false)
   const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false)
   const { mutate: doDelete } = useDeleteProduct()
   const { addToast } = useToast()

   const navigate = useNavigate()
   const onDelete = () => {
      doDelete(Number(id), {
         onSuccess: () => addToast("Успішно видалено виріб!", { type: "success", duration: TOAST_DURATION }),
      })
      navigate("/products")
   }

   // "abc" або відсутній id дають undefined, і запит не виконується
   const parsedId = id !== undefined ? Number(id) : NaN
   const productId = Number.isInteger(parsedId) ? parsedId : undefined

   const { data: product, isLoading, isError } = useProduct(productId)
   // планова дата завершення є в замовлення, а не у виробу
   const { data: order } = useOrder(product?.order_id ?? undefined)
   const { data: modelsData } = useAllProductModels({ page: 1, pageSize: 100, is_active: true })
   const models = modelsData?.items ?? []
   const model = models.find(m => m.id === product?.product_model_id)

   if (productId === undefined || isError) return <ErrorPage />

   if (isLoading || !product) {
      return <p className="py-8 text-center text-(--second-color)">Завантаження...</p>
   }

   // TODO: у типі ProductRead виправ на parent: ProductListRead | null та children: ProductListRead[]
   const parent = product.parent ?? null
   const children = product.children ?? []

   return (
      <div className="flex flex-col gap-(--components-gap)">
         <div className="flex justify-between items-center">
            <div>
               <PageHeader>{product.code}</PageHeader>
               <PageDescription>{model?.title ?? `Модель #${product.product_model_id}`}</PageDescription>
            </div>
            <div className="flex gap-4">
               <Can resource="product" action="update">
                  <Button onClick={() => setIsUpdateModalOpen(true)} type="accent" className="h-min">
                     <Button.Icon Icon={EditIcon} />
                     <Button.Paragraph>Редагувати</Button.Paragraph>
                  </Button>
               </Can>
               <Can resource="product" action="delete">
                  <Button
                     onClick={() => setIsConfirmModalOpen(true)}
                     type="accent"
                     className="h-min bg-(--accent-color) text-black"
                  >
                     <Button.Icon Icon={Trash} className="stroke-black!" />
                     <Button.Paragraph>Видалити</Button.Paragraph>
                  </Button>
               </Can>
            </div>
         </div>
         <div
            className="grid grid-cols-[repeat(10,1fr)] gap-(--components-gap) w-full"
            style={{ gridTemplateAreas: buildAreas(mode, !!parent, children.length > 0) }}
         >
            <ProductHeader productId={product.id} />
            <Info product={product} model={model} order={order} />
            <History productId={product.id} />
            <Chart productModelId={product.product_model_id} />
            <ProductDashboard productModelId={product.product_model_id} />
            {parent && <ParentProduct parent={parent} models={models} />}
            {children.length > 0 && <ChildrenProducts children={children} models={models} />}
         </div>
         <Can resource="product" action="update">
            <UpdateProductModal
               isOpen={isUpdateModalOpen}
               product={product}
               onClose={() => setIsUpdateModalOpen(false)}
            />
         </Can>
         <ConfirmModal
            isOpen={isConfirmModalOpen}
            onClose={() => setIsConfirmModalOpen(false)}
            onConfirm={onDelete}
            title="Видалити продукт"
            description="Ви впевнені, що хочете видалити продукт?"
         />
      </div>
   )
}
