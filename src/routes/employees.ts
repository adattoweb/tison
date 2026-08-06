import { Employees } from "@/features/employees/Employees"
import { Employee } from "@/features/employees/employer/Employee"
import { UserIcon } from "@heroicons/react/24/outline"

export const employees = {
   path: "employees",
   handle: {
      label: "Працівники",
      Icon: UserIcon,
      nav: true,
   },
   children: [
      {
         index: true,
         Component: Employees,
      },
      {
         path: ":id",
         Component: Employee,
      },
   ],
}
