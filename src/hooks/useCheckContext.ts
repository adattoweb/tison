import { useContext, type Context } from "react"

export function useCheckContext<T>(context: Context<T | null>, name = "Context"): T {
   const value = useContext(context)

   if (value === null) {
      throw new Error(`${name} must be used inside its Provider`)
   }

   return value
}
