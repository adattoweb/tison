export interface Employee {
   id: string
   code: string
   fullName: string
   avatarUrl: string
   position: string
   department: string
   departmentSub: string
   shiftName: string
   shiftTime: string
   experienceYears: number
   salary: number
   bonus: number
   productivity: number
}

export const mockEmployees: Employee[] = Array.from({ length: 100 }, (_, i) => ({
   id: `EMP-${1024 + i}`,
   code: `EMP-${1024 + i}`,
   fullName: "Іваненко Сергій",
   avatarUrl: `https://i.pravatar.cc/80?img=${12}`,
   position: "Тестувальник",
   department: "Виробництво",
   departmentSub: "Механічний цех",
   shiftName: "Денна",
   shiftTime: "07:00-15:00",
   experienceYears: 5,
   salary: 28500,
   bonus: 3250,
   productivity: 98,
}))
