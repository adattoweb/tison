import { OperationTypes } from "@/features/operationTypes/OperationTypes"
import { WrenchScrewdriverIcon } from "@heroicons/react/24/outline"
export const operationTypes = {
   path: "types",
   Component: OperationTypes,
   handle: {
      label: "Типи операцій",
      Icon: WrenchScrewdriverIcon,
      nav: true,
   },
}
