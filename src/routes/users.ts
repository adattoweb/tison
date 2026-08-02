import { Employees } from "@/features/employees/Employees"
import { UserIcon } from "@heroicons/react/24/outline"

export const users = {
   path: "users",
   Component: Employees,
   handle: {
      label: "Працівники",
      Icon: UserIcon,
      nav: true,
   },
}
