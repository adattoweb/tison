import { Dashboard } from "@/features/dashboard/Dashboard"
import { GitCompareIcon } from "lucide-react"

export const control = {
   path: "control",
   Component: Dashboard,
   handle: {
      label: "Контроль якості",
      Icon: GitCompareIcon,
      nav: true,
   },
}
