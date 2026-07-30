import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import "./index.css"

import { createBrowserRouter } from "react-router"
import { RouterProvider } from "react-router"

import AppLayout from "@/layouts/AppLayout"
import { routes } from "./routes/routes"

const router = createBrowserRouter([
   {
      path: "/",
      Component: AppLayout,
      children: routes,
   },
])

createRoot(document.getElementById("root")!).render(
   <StrictMode>
      <RouterProvider router={router} />
   </StrictMode>,
)
