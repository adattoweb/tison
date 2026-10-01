import { useState } from "react"
import { keepPreviousData, useQuery } from "@tanstack/react-query"
import { ProductModelFormSchema, type ProductModelFormInput } from "@/api/schemas/productModel"
import { getAllProductModels } from "@/api/endpoints/productModels"
import type { ProductModelListRead } from "@/api/types/product_model"
import Modal from "@/components/Modal/Modal"
import { useToast } from "@/components/Toast/useToast"
import Button from "@/components/UI/Button"
import { FieldError } from "@/components/UI/FieldError"
import { Input } from "@/components/UI/Input"
import { Textarea } from "@/components/UI/Textarea"
import { MultiImageUpload, type ImageItem } from "@/components/UI/MultiImageUpload"
import { TOAST_DURATION } from "@/constants/app"
import { useCreateProductModel } from "@/hooks/api/productModels/useCreateProductModel"
import { useUploadImage } from "@/hooks/api/media/useUploadImage"
import { zodResolver } from "@hookform/resolvers/zod"
import { NotebookPenIcon, ShapesIcon } from "lucide-react"
import { useForm, type SubmitHandler } from "react-hook-form"
import { Checkbox } from "@/components/UI/Checkbox"
import { useDebouncedValue } from "@/hooks/api/useDebouncedValue"
import { ChildModelsPicker } from "./Model/ChildModelsPicker"

interface ModalProps {
   isOpen: boolean
   setIsOpen: React.Dispatch<React.SetStateAction<boolean>>
}

const MAX_IMAGES = 10
const PARTS_PAGE_SIZE = 100

export function AddModelModal({ isOpen, setIsOpen }: ModalProps) {
   const { mutate: doCreateProductModel, isPending: isCreating } = useCreateProductModel()
   const { mutateAsync: doUploadImage } = useUploadImage()
   const { addToast } = useToast()

   const [images, setImages] = useState<ImageItem[]>([])
   const [isUploadingImages, setIsUploadingImages] = useState(false)

   const {
      register,
      handleSubmit,
      reset,
      watch,
      setValue,
      formState: { errors },
   } = useForm<ProductModelFormInput>({
      resolver: zodResolver(ProductModelFormSchema),
      defaultValues: {
         title: "",
         type: "",
         description: "",
         is_detail: false,
         details_ids: [],
      },
   })

   const [selectedParts, setSelectedParts] = useState<ProductModelListRead[]>([])
   const [partsSearch, setPartsSearch] = useState("")
   const debouncedSearch = useDebouncedValue(partsSearch.trim(), 300)

   const isDetail = watch("is_detail")

   const partsQuery = useQuery({
      queryKey: ["product-models", "parts", debouncedSearch],
      queryFn: () =>
         getAllProductModels({
            page: 1,
            pageSize: PARTS_PAGE_SIZE,
            is_active: true,
            is_detail: true,
            search: debouncedSearch,
         }),
      enabled: isOpen && !isDetail,
      staleTime: 60000,
      placeholderData: keepPreviousData,
   })
   const parts = (partsQuery.data?.items ?? []).filter(m => m.is_detail)

   const handleSelectedChange = (items: ProductModelListRead[]) => {
      setSelectedParts(items)
      setValue(
         "details_ids",
         items.map(p => p.id),
         { shouldValidate: true },
      )
   }

   const onClose = () => {
      images.forEach(img => URL.revokeObjectURL(img.url))
      setImages([])
      setSelectedParts([])
      setPartsSearch("")
      reset()
      setIsOpen(false)
   }

   const onSubmit: SubmitHandler<ProductModelFormInput> = async data => {
      let uploadedUrls: string[] = []

      if (images.length > 0) {
         setIsUploadingImages(true)
         try {
            const uploaded = await Promise.all(
               images.map(img => doUploadImage({ category: "product_models", file: img.file! })),
            )
            uploadedUrls = uploaded.map(u => u.url)
         } catch {
            addToast("Не вдалося завантажити одне або кілька зображень", { duration: TOAST_DURATION, type: "error" })
            setIsUploadingImages(false)
            return
         }
         setIsUploadingImages(false)
      }

      doCreateProductModel(
         {
            title: data.title,
            type: data.type,
            description: data.description?.trim() ? data.description : null,
            is_detail: data.is_detail,
            // для деталі завжди порожній масив
            details_ids: data.is_detail ? [] : data.details_ids,
            images: uploadedUrls,
         },
         {
            onSuccess: () => {
               addToast("Успішно створено модель виробу!", { duration: TOAST_DURATION, type: "success" })
               onClose()
            },
            onError: () => {
               addToast("Не вдалося створити модель виробу!", { duration: TOAST_DURATION, type: "error" })
            },
         },
      )
   }

   const isSaving = isUploadingImages || isCreating

   return (
      <Modal isOpen={isOpen} onClose={onClose}>
         <Modal.Header>Створення моделі виробу</Modal.Header>
         <form onSubmit={handleSubmit(onSubmit)}>
            <Modal.Content>
               <div className="flex flex-col w-full gap-2">
                  <div className="flex flex-col sm:flex-row w-full gap-2">
                     <div className="w-full">
                        <Input
                           label="Назва"
                           Icon={NotebookPenIcon}
                           placeholder="Плата керування V4"
                           hasError={!!errors.title}
                           {...register("title")}
                        />
                        <FieldError message={errors.title?.message} />
                     </div>

                     <div className="w-full">
                        <Input
                           label="Тип"
                           Icon={ShapesIcon}
                           placeholder="Плата керування"
                           hasError={!!errors.type}
                           {...register("type")}
                        />
                        <FieldError message={errors.type?.message} />
                     </div>
                  </div>

                  <div className="w-full">
                     <Textarea
                        label="Опис"
                        Icon={NotebookPenIcon}
                        placeholder="Опис"
                        hasError={!!errors.description}
                        {...register("description")}
                     />
                     <FieldError message={errors.description?.message} />
                  </div>

                  <MultiImageUpload images={images} onChange={setImages} maxImages={MAX_IMAGES} disabled={isSaving} />

                  <div className="flex items-center gap-2">
                     <Checkbox
                        checked={isDetail}
                        {...register("is_detail", {
                           onChange: e => {
                              if (e.target.checked) {
                                 setSelectedParts([])
                                 setPartsSearch("")
                                 setValue("details_ids", [], { shouldValidate: true })
                              }
                           },
                        })}
                     />
                     <p className="text-base font-medium">Чи це деталь?</p>
                  </div>

                  {!isDetail && (
                     <div className="w-full">
                        <ChildModelsPicker
                           parts={parts}
                           selected={selectedParts}
                           onChange={handleSelectedChange}
                           search={partsSearch}
                           onSearchChange={setPartsSearch}
                           isLoading={partsQuery.isLoading}
                           isFetching={partsQuery.isFetching}
                           isError={partsQuery.isError}
                           disabled={isSaving}
                        />
                        <FieldError message={errors.details_ids?.message} />
                     </div>
                  )}
               </div>
            </Modal.Content>

            <footer className="flex flex-col-reverse sm:flex-row sm:justify-end gap-2 sm:gap-4">
               <Button type="transparent" onClick={onClose} disabled={isSaving}>
                  <Button.Paragraph>Скасувати</Button.Paragraph>
               </Button>
               <Button type="accentFilled" isSubmit={true} disabled={isSaving}>
                  <Button.Paragraph>
                     {isUploadingImages ? "Завантаження фото..." : isCreating ? "Створення..." : "Створити"}
                  </Button.Paragraph>
               </Button>
            </footer>
         </form>
      </Modal>
   )
}
