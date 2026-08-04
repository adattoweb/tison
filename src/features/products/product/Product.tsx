import { useParams } from "react-router"
import { mockProducts } from "../products"
import PageHeader from "@/components/UI/PageHeader"
import { ErrorPage } from "@/components/ErrorPage/ErrorPage"
import PageDescription from "@/components/UI/PageDescription"
import { ProductHeader } from "./ProductHeader"

export function Product() {
   const { id } = useParams()
   const product = mockProducts.find(el => el.id === Number(id))
   if (product === undefined) return <ErrorPage />
   return (
      <div className="flex flex-col gap-(--components-gap)">
         <PageHeader>{product.code}</PageHeader>
         <PageDescription>{product.model}</PageDescription>
         <ProductHeader />
      </div>
   )
}
