import { Operations } from "@/features/operations/Operations"
import { WrenchScrewdriverIcon } from "@heroicons/react/24/outline"

export const operations = {
   path: "operations",
   Component: Operations,
   handle: {
      label: "Операції",
      Icon: WrenchScrewdriverIcon,
      nav: true,
   },
}
