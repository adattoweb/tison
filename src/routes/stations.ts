import { Stations } from "@/features/stations/Stations"
import { MonitorCog } from "lucide-react"

export const stations = {
   path: "stations",
   Component: Stations,
   handle: {
      label: "Робочі станції",
      Icon: MonitorCog,
      nav: true,
   },
}
