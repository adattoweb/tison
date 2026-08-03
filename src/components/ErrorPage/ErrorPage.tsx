import { AppShell } from "@/layouts/AppLayout"
import { isRouteErrorResponse, useRouteError } from "react-router"
import Button from "../UI/Button"

export function ErrorPage() {
   const error = useRouteError()

   if (isRouteErrorResponse(error)) {
      return (
         <AppShell>
            <div className="flex-1 text-center flex flex-col justify-center items-center gap-4">
               <h1 className="text-9xl font-semibold ibm-plex-sans">{error.status}</h1>
               <p className="text-2xl">
                  {error.statusText} {";("}
               </p>
               <Button.ButtonLink to="/">
                  <Button.Paragraph>Повернутись на головну</Button.Paragraph>
               </Button.ButtonLink>
            </div>
         </AppShell>
      )
   }

   if (error instanceof Error) {
      return (
         <AppShell>
            <h1>Упс... Щось пішло не так</h1>
            <p>{error.message}</p>
         </AppShell>
      )
   }

   return <h1>Unknown error</h1>
}
