import { Defect } from "@/features/defects/defect/Defect"
import { Defects } from "@/features/defects/Defects"
import type { AppRoute } from "@/types/routes"
import { CameraIcon } from "@heroicons/react/24/outline"

export const defects = {
   path: "defects",
   handle: {
      label: "Архів дефектів",
      Icon: CameraIcon,
      nav: true,
      permission: { resource: "defects", action: "read" },
   },
   children: [
      {
         index: true,
         Component: Defects,
      },
      {
         path: ":id",
         Component: Defect,
      },
   ],
} satisfies AppRoute
