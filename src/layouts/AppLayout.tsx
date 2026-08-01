import { Outlet } from "react-router"
import { Sidebar } from "@/components/Sidebar/Sidebar"

export default function AppLayout() {
   return (
      <div className="flex m-0 bg-(--bg-color) w-screen min-h-screen">
         <Sidebar />
         <main className="mt-10 px-8 box-border flex-1 flex flex-col gap-(--components-gap)">
            <Outlet />
         </main>
      </div>
   )
}
