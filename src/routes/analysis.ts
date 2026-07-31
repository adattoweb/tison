import { Dashboard } from "@/features/dashboard/Dashboard"
import { CpuChipIcon } from "@heroicons/react/24/outline"

export const analysis = {
   path: "analysis",
   Component: Dashboard,
   handle: {
      label: "ШІ Аналіз",
      Icon: CpuChipIcon,
      nav: true,
   },
}
