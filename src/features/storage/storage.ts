interface StorageItem {
   material: string
   unit: string
   stock: number
   min: number
}

export const mockStorage: StorageItem[] = [
   {
      material: "Сталь",
      unit: "кг",
      stock: 100,
      min: 50,
   },
   {
      material: "Пластик",
      unit: "кг",
      stock: 5,
      min: 2,
   },
   {
      material: "Резина",
      unit: "кг",
      stock: 10,
      min: 5,
   },
   {
      material: "Модуль стабілізації",
      unit: "шт",
      stock: 5,
      min: 2,
   },
   {
      material: "Модуль GPS",
      unit: "шт",
      stock: 20,
      min: 30,
   },
]
