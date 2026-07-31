import type { PropsWithChildren } from "react"

export default function PageDescription({ children }: PropsWithChildren) {
   return <p className="text-(--second-color) text-[18px] font-normal ibm-plex-sans">{children}</p>
}
