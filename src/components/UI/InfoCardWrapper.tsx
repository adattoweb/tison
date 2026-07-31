import type { PropsWithChildren } from "react"

export default function InfoCardWrapper({ children }: PropsWithChildren) {
   return <div className="flex gap-5">{children}</div>
}
