import { Station } from "@/features/stations/station/Station"
import { Stations } from "@/features/stations/Stations"
import { MonitorCog } from "lucide-react"

export const stations = {
   path: "stations",
   handle: {
      label: "Робочі станції",
      Icon: MonitorCog,
      nav: true,
   },
   children: [
      {
         index: true,
         Component: Stations,
      },
      {
         path: ":id",
         Component: Station,
      },
   ],
}
