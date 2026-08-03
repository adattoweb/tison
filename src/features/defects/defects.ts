import type { DefectStatusType } from "@/types/status"

export interface Defect {
   id: number
   code: string
   photoUrl: string
   productCode: string
   defectType: string
   defectDetail: string
   department: string
   section: string
   detectedDate: string
   detectedTime: string
   status: DefectStatusType
   responsibleName: string
   responsibleCode: string
   responsibleAvatarUrl: string
   isCritical: boolean
}

export const mockDefects: Defect[] = [
   {
      id: 1,
      code: "DEF-2026-0320",
      photoUrl: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=200&h=200&fit=crop",
      productCode: "ORK4-2026-1234",
      defectType: "Пайка",
      defectDetail: "Нерівний шов",
      department: "Виробництво",
      section: "Механічний цех",
      detectedDate: "07.06.2026",
      detectedTime: "16:45",
      status: "open",
      responsibleName: "Іваненко Сергій",
      responsibleCode: "EMP-1024",
      responsibleAvatarUrl: "https://i.pravatar.cc/150?img=12",
      isCritical: false,
   },
   {
      id: 2,
      code: "DEF-2026-0321",
      photoUrl: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=200&h=200&fit=crop",
      productCode: "ORK4-2026-1235",
      defectType: "Складання",
      defectDetail: "Люфт корпусу",
      department: "Виробництво",
      section: "Складальний цех",
      detectedDate: "06.06.2026",
      detectedTime: "11:20",
      status: "closed",
      responsibleName: "Ковальчук Олена",
      responsibleCode: "EMP-1031",
      responsibleAvatarUrl: "https://i.pravatar.cc/150?img=32",
      isCritical: false,
   },
   {
      id: 3,
      code: "DEF-2026-0322",
      photoUrl: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=200&h=200&fit=crop",
      productCode: "ORK5-2026-2001",
      defectType: "Електроніка",
      defectDetail: "Коротке замикання",
      department: "Виробництво",
      section: "Цех пайки",
      detectedDate: "07.06.2026",
      detectedTime: "09:10",
      status: "open",
      responsibleName: "Петренко Максим",
      responsibleCode: "EMP-1042",
      responsibleAvatarUrl: "https://i.pravatar.cc/150?img=15",
      isCritical: true,
   },
   {
      id: 4,
      code: "DEF-2026-0323",
      photoUrl: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=200&h=200&fit=crop",
      productCode: "ORK5-2026-2002",
      defectType: "Калібрування",
      defectDetail: "Відхилення показників",
      department: "Виробництво",
      section: "Тестовий цех",
      detectedDate: "05.06.2026",
      detectedTime: "14:30",
      status: "closed",
      responsibleName: "Шевченко Ірина",
      responsibleCode: "EMP-1050",
      responsibleAvatarUrl: "https://i.pravatar.cc/150?img=45",
      isCritical: false,
   },
   {
      id: 5,
      code: "DEF-2026-0324",
      photoUrl: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=200&h=200&fit=crop",
      productCode: "ORK4-2026-1236",
      defectType: "Пайка",
      defectDetail: "Непропай контакту",
      department: "Виробництво",
      section: "Механічний цех",
      detectedDate: "07.06.2026",
      detectedTime: "17:05",
      status: "open",
      responsibleName: "Бондаренко Артем",
      responsibleCode: "EMP-1067",
      responsibleAvatarUrl: "https://i.pravatar.cc/150?img=8",
      isCritical: true,
   },
]
