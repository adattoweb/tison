import { OperationType } from "@/features/operationTypes/operationType/OperationType"
import { OperationTypes } from "@/features/operationTypes/OperationTypes"
import { WrenchScrewdriverIcon } from "@heroicons/react/24/outline"
export const operationTypes = {
   path: "types",
   handle: {
      label: "Типи операцій",
      Icon: WrenchScrewdriverIcon,
      nav: true,
   },
   children: [
      {
         index: true,
         Component: OperationTypes,
      },
      {
         path: ":id",
         Component: OperationType,
      },
   ],
}
