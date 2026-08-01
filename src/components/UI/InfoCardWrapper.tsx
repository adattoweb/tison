import type { PropsWithChildren } from "react"

export default function InfoCardWrapper({ children }: PropsWithChildren) {
   return <div className="flex gap-(--components-gap)">{children}</div>
}
