import { Dashboard } from "@/features/dashboard/Dashboard"
import { WrenchScrewdriverIcon } from "@heroicons/react/24/outline"

export const operations = {
   path: "operations",
   Component: Dashboard,
   handle: {
      label: "Операції",
      Icon: WrenchScrewdriverIcon,
      nav: true,
   },
}
