import type { ProductStatusType } from "@/types/status"

export interface Product {
   id: number
   code: string
   model: string
   modelType: string
   department: string
   section: string
   operationName: string
   operationStep: number
   operationTotal: number
   executorName: string
   executorCode: string
   executorAvatarUrl: string
   progress: number
   status: ProductStatusType
   createdAt: string
   plannedStartDate: string
   plannedEndDate: string
   actualEndDate: string | null
}

export const mockProducts: Product[] = [
   {
      id: 256,
      code: "ORK4-2026-1234",
      model: "ORK-V4",
      modelType: "Плата керування",
      department: "Виробництво",
      section: "Механічний цех",
      operationName: "Пайка компонентів",
      operationStep: 3,
      operationTotal: 6,
      executorName: "Іваненко Сергій",
      executorCode: "EMP-1024",
      executorAvatarUrl: "https://i.pravatar.cc/150?img=12",
      progress: 50,
      status: "inProgress",
      createdAt: "08.06.2026 09:15",
      plannedStartDate: "08.06.2026 09:20",
      plannedEndDate: "08.06.2026 14:00",
      actualEndDate: null,
   },
   {
      id: 257,
      code: "ORK4-2026-1235",
      model: "ORK-V4",
      modelType: "Корпус",
      department: "Виробництво",
      section: "Складальний цех",
      operationName: "Складання корпусу",
      operationStep: 6,
      operationTotal: 6,
      executorName: "Ковальчук Олена",
      executorCode: "EMP-1031",
      executorAvatarUrl: "https://i.pravatar.cc/150?img=32",
      progress: 100,
      status: "completed",
      createdAt: "08.06.2026 08:00",
      plannedStartDate: "08.06.2026 08:10",
      plannedEndDate: "08.06.2026 13:00",
      actualEndDate: "08.06.2026 12:47",
   },
   {
      id: 258,
      code: "ORK5-2026-2001",
      model: "ORK-V5",
      modelType: "Модуль живлення",
      department: "Виробництво",
      section: "Цех пайки",
      operationName: "Монтаж плати живлення",
      operationStep: 1,
      operationTotal: 5,
      executorName: "Петренко Максим",
      executorCode: "EMP-1042",
      executorAvatarUrl: "https://i.pravatar.cc/150?img=15",
      progress: 10,
      status: "waiting",
      createdAt: "08.06.2026 10:30",
      plannedStartDate: "08.06.2026 11:00",
      plannedEndDate: "08.06.2026 16:00",
      actualEndDate: null,
   },
   {
      id: 259,
      code: "ORK5-2026-2002",
      model: "ORK-V5",
      modelType: "Датчик",
      department: "Виробництво",
      section: "Тестовий цех",
      operationName: "Калібрування датчика",
      operationStep: 4,
      operationTotal: 6,
      executorName: "Шевченко Ірина",
      executorCode: "EMP-1050",
      executorAvatarUrl: "https://i.pravatar.cc/150?img=45",
      progress: 65,
      status: "delayed",
      createdAt: "08.06.2026 07:45",
      plannedStartDate: "08.06.2026 08:00",
      plannedEndDate: "08.06.2026 12:30",
      actualEndDate: null,
   },
   {
      id: 260,
      code: "ORK4-2026-1236",
      model: "ORK-V4",
      modelType: "Плата керування",
      department: "Виробництво",
      section: "Механічний цех",
      operationName: "Пайка компонентів",
      operationStep: 2,
      operationTotal: 6,
      executorName: "Бондаренко Артем",
      executorCode: "EMP-1067",
      executorAvatarUrl: "https://i.pravatar.cc/150?img=8",
      progress: 33,
      status: "inProgress",
      createdAt: "08.06.2026 09:00",
      plannedStartDate: "08.06.2026 09:15",
      plannedEndDate: "08.06.2026 15:00",
      actualEndDate: null,
   },
   {
      id: 261,
      code: "ORK5-2026-2003",
      model: "ORK-V5",
      modelType: "Корпус",
      department: "Виробництво",
      section: "Складальний цех",
      operationName: "Фарбування корпусу",
      operationStep: 5,
      operationTotal: 6,
      executorName: "Мельник Анастасія",
      executorCode: "EMP-1071",
      executorAvatarUrl: "https://i.pravatar.cc/150?img=48",
      progress: 83,
      status: "inProgress",
      createdAt: "08.06.2026 06:50",
      plannedStartDate: "08.06.2026 07:00",
      plannedEndDate: "08.06.2026 13:30",
      actualEndDate: null,
   },
]
