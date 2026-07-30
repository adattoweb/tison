import { Outlet } from "react-router"
import Sidebar from "../components/Sidebar/Sidebar"

export default function AppLayout() {
   return (
      <div className="flex m-0 bg-(--bg-color) w-screen min-h-screen">
         <Sidebar />
         <main>
            <Outlet />
         </main>
      </div>
   )
}
