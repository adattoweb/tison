import type { StatusType } from "@/types/status"

export interface Operation {
   id: number
   code: string
   name: string
   productId: number
   productCode: string
   productModel: string
   section: string
   executorName: string
   executorCode: string
   executorAvatarUrl: string
   durationLabel: string
   startTime: string
   endTime: string
   status: StatusType
}

export const mockOperations: Operation[] = [
   {
      id: 1,
      code: "OP-1001",
      name: "Пайка компонентів",
      productId: 256,
      productCode: "ORK4-2026-1234",
      productModel: "ORK-V4",
      section: "Механічний цех",
      executorName: "Іваненко Сергій",
      executorCode: "EMP-1024",
      executorAvatarUrl: "https://i.pravatar.cc/150?img=12",
      durationLabel: "25 хв",
      startTime: "10:15",
      endTime: "10:40",
      status: "inProgress",
   },
   {
      id: 2,
      code: "OP-1002",
      name: "Складання корпусу",
      productId: 257,
      productCode: "ORK4-2026-1235",
      productModel: "ORK-V4",
      section: "Складальний цех",
      executorName: "Ковальчук Олена",
      executorCode: "EMP-1031",
      executorAvatarUrl: "https://i.pravatar.cc/150?img=32",
      durationLabel: "40 хв",
      startTime: "09:00",
      endTime: "09:40",
      status: "completed",
   },
   {
      id: 3,
      code: "OP-1003",
      name: "Монтаж плати живлення",
      productId: 258,
      productCode: "ORK5-2026-2001",
      productModel: "ORK-V5",
      section: "Цех пайки",
      executorName: "Петренко Максим",
      executorCode: "EMP-1042",
      executorAvatarUrl: "https://i.pravatar.cc/150?img=15",
      durationLabel: "15 хв",
      startTime: "11:20",
      endTime: "11:35",
      status: "waiting",
   },
   {
      id: 4,
      code: "OP-1004",
      name: "Калібрування датчика",
      productId: 259,
      productCode: "ORK5-2026-2002",
      productModel: "ORK-V5",
      section: "Тестовий цех",
      executorName: "Шевченко Ірина",
      executorCode: "EMP-1050",
      executorAvatarUrl: "https://i.pravatar.cc/150?img=45",
      durationLabel: "32 хв",
      startTime: "13:05",
      endTime: "13:37",
      status: "delayed",
   },
   {
      id: 5,
      code: "OP-1005",
      name: "Пайка компонентів",
      productId: 260,
      productCode: "ORK4-2026-1236",
      productModel: "ORK-V4",
      section: "Механічний цех",
      executorName: "Бондаренко Артем",
      executorCode: "EMP-1067",
      executorAvatarUrl: "https://i.pravatar.cc/150?img=8",
      durationLabel: "18 хв",
      startTime: "14:00",
      endTime: "14:18",
      status: "inProgress",
   },
   {
      id: 6,
      code: "OP-1006",
      name: "Фарбування корпусу",
      productId: 261,
      productCode: "ORK5-2026-2003",
      productModel: "ORK-V5",
      section: "Складальний цех",
      executorName: "Мельник Анастасія",
      executorCode: "EMP-1071",
      executorAvatarUrl: "https://i.pravatar.cc/150?img=48",
      durationLabel: "50 хв",
      startTime: "08:30",
      endTime: "09:20",
      status: "waiting",
   },
]
