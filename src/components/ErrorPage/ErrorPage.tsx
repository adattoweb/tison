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

   return (
      <AppShell>
         <div className="flex-1 text-center flex flex-col justify-center items-center gap-4">
            <h1 className="text-2xl md:text-3xl lg:text-4xl xl:text-5xl 2xl:text-7xl font-semibold ibm-plex-sans">
               Упс... Щось пішло не так
            </h1>
            <p className="text-base lg:text-lg 2xl:text-xl">
               {error instanceof Error ? error.message : "Невідома помилка"}
            </p>
            <Button.ButtonLink to="/">
               <Button.Paragraph>Повернутись на головну</Button.Paragraph>
            </Button.ButtonLink>
         </div>
      </AppShell>
   )
}
