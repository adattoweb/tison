import type { StatusType } from "@/types/status"

export interface Station {
   id: number
   code: string
   department: string
   section: string
   status: StatusType
   taskName: string
   taskCode: string
   load: number
   operatorName: string
   operatorCode: string
   operatorAvatarUrl: string
}

export const mockStations: Station[] = [
   {
      id: 1,
      code: "STATION-01",
      department: "Виробництво",
      section: "Механічний цех",
      status: "active",
      taskName: "Пайка компонентів",
      taskCode: "ORK4-2026-1234",
      load: 95,
      operatorName: "Іваненко Сергій",
      operatorCode: "EMP-1024",
      operatorAvatarUrl: "https://i.pravatar.cc/150?img=12",
   },
   {
      id: 2,
      code: "STATION-02",
      department: "Виробництво",
      section: "Складальний цех",
      status: "active",
      taskName: "Складання корпусу",
      taskCode: "ORK4-2026-1235",
      load: 98,
      operatorName: "Ковальчук Олена",
      operatorCode: "EMP-1031",
      operatorAvatarUrl: "https://i.pravatar.cc/150?img=32",
   },
   {
      id: 3,
      code: "STATION-03",
      department: "Виробництво",
      section: "Цех пайки",
      status: "idle",
      taskName: "—",
      taskCode: "—",
      load: 0,
      operatorName: "Петренко Максим",
      operatorCode: "EMP-1042",
      operatorAvatarUrl: "https://i.pravatar.cc/150?img=15",
   },
   {
      id: 4,
      code: "STATION-04",
      department: "Виробництво",
      section: "Тестовий цех",
      status: "maintenance",
      taskName: "Технічне обслуговування",
      taskCode: "—",
      load: 0,
      operatorName: "Шевченко Ірина",
      operatorCode: "EMP-1050",
      operatorAvatarUrl: "https://i.pravatar.cc/150?img=45",
   },
   {
      id: 5,
      code: "STATION-05",
      department: "Виробництво",
      section: "Механічний цех",
      status: "active",
      taskName: "Пайка компонентів",
      taskCode: "ORK4-2026-1236",
      load: 87,
      operatorName: "Бондаренко Артем",
      operatorCode: "EMP-1067",
      operatorAvatarUrl: "https://i.pravatar.cc/150?img=8",
   },
   {
      id: 6,
      code: "STATION-06",
      department: "Виробництво",
      section: "Складальний цех",
      status: "error",
      taskName: "Фарбування корпусу",
      taskCode: "ORK5-2026-2003",
      load: 40,
      operatorName: "Мельник Анастасія",
      operatorCode: "EMP-1071",
      operatorAvatarUrl: "https://i.pravatar.cc/150?img=48",
   },
   {
      id: 7,
      code: "STATION-07",
      department: "Виробництво",
      section: "Тестовий цех",
      status: "active",
      taskName: "Калібрування датчика",
      taskCode: "ORK5-2026-2002",
      load: 91,
      operatorName: "Гриценко Павло",
      operatorCode: "EMP-1088",
      operatorAvatarUrl: "https://i.pravatar.cc/150?img=51",
   },
]
