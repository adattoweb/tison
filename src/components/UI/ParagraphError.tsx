import type { PropsWithChildren } from "react"

export function ParagraphError({ children }: PropsWithChildren) {
   return <p className="text-red-400">{children}</p>
}
