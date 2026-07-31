import type { PropsWithChildren } from "react"

export default function PageHeader({ children }: PropsWithChildren) {
   return <h1 className="text-3xl ibm-plex-sans font-semibold mb-0.5">{children}</h1>
}
