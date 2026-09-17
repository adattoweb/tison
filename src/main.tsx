import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import "./index.css"

import { createBrowserRouter } from "react-router"
import { RouterProvider } from "react-router"

import { AppLayout, AppLayoutWithoutSidebar } from "@/layouts/AppLayout"
import { routes } from "./routes/routes"
import { ErrorPage } from "@/components/ErrorPage/ErrorPage"

import gsap from "gsap"
import { useGSAP } from "@gsap/react"

import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { ReactQueryDevtools } from "@tanstack/react-query-devtools"
import { protectedLoader } from "./routes/protectedLoader"
import { login } from "./routes/login"
import { ToastProvider } from "./components/Toast/ToastProvider"

gsap.registerPlugin(useGSAP)

export const queryClient = new QueryClient({
   defaultOptions: {
      queries: {
         retry: false,
         refetchOnWindowFocus: false,
      },
   },
})

const router = createBrowserRouter([
   {
      path: "/",
      Component: AppLayout,
      errorElement: <ErrorPage />,
      children: routes,
      loader: protectedLoader,
   },
   {
      path: "/",
      Component: AppLayoutWithoutSidebar,
      errorElement: <ErrorPage />,
      children: [login],
   },
])

createRoot(document.getElementById("root")!).render(
   <StrictMode>
      <ToastProvider maxVisible={3}>
         <QueryClientProvider client={queryClient}>
            <ReactQueryDevtools initialIsOpen={false} />
            <RouterProvider router={router} />
         </QueryClientProvider>
      </ToastProvider>
   </StrictMode>,
)
