import { Department } from "@/features/departments/department/Department"
import { Departments } from "@/features/departments/Departments"
import { MonitorCog } from "lucide-react"

export const departments = {
   path: "departments",
   handle: {
      label: "Департаменти",
      Icon: MonitorCog,
      nav: true,
   },
   children: [
      {
         index: true,
         Component: Departments,
      },
      {
         path: ":id",
         Component: Department,
      },
   ],
}
