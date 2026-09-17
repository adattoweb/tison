import { Outlet } from "react-router"
import { Sidebar } from "@/components/Sidebar/Sidebar"
import type { PropsWithChildren } from "react"

interface ShellProps extends PropsWithChildren {
   withSidebar: boolean
}

export function AppShell({ children, withSidebar }: ShellProps) {
   return (
      <div className="flex m-0 bg-(--bg-color) w-screen min-h-screen pb-24">
         {withSidebar && <Sidebar />}
         <main className="mt-16 md:mt-10 px-8 box-border w-screen md:w-[calc(100vw-80px)] flex flex-col gap-(--components-gap) ml-auto">
            {children}
         </main>
      </div>
   )
}

export function AppLayout() {
   return (
      <AppShell withSidebar={true}>
         <Outlet />
      </AppShell>
   )
}

export function AppLayoutWithoutSidebar() {
   return (
      <AppShell withSidebar={false}>
         <Outlet />
      </AppShell>
   )
}
