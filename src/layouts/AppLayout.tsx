import { Outlet } from "react-router"
import { Sidebar } from "@/components/Sidebar/Sidebar"

export default function AppLayout() {
   return (
      <div className="flex m-0 bg-(--bg-color) w-screen min-h-screen pb-24">
         <Sidebar />
         <main className="mt-10 px-8 box-border w-screen md:w-[calc(100vw-80px)] flex flex-col gap-(--components-gap) ml-auto">
            <Outlet />
         </main>
      </div>
   )
}
