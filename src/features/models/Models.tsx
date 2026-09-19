import PageDescription from "@/components/UI/PageDescription"
import PageHeader from "@/components/UI/PageHeader"
import Button from "@/components/UI/Button"
import { FilePlus } from "lucide-react"
import { ModelList } from "./ModelList"
import { ModelHeader } from "./ModelHeader"

export function Models() {
   return (
      <>
         <div className="flex justify-between items-center">
            <div className="flex flex-col">
               <PageHeader>Моделі виробів</PageHeader>
               <PageDescription>Створення та редагування моделей та інструкцій до них</PageDescription>
            </div>
            <Button type="accent" className="h-min">
               <Button.Icon Icon={FilePlus} />
               <Button.Paragraph>Додати нову модель</Button.Paragraph>
            </Button>
         </div>

         <div className="flex flex-col gap-(--components-gap)">
            <ModelHeader />
            <ModelList />
         </div>
      </>
   )
}
