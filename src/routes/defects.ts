import { Defects } from "@/features/defects/Defects"
import { CameraIcon } from "@heroicons/react/24/outline"

export const defects = {
   path: "defects",
   Component: Defects,
   handle: {
      label: "Архів дефектів",
      Icon: CameraIcon,
      nav: true,
   },
}
