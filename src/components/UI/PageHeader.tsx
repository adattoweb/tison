import type { WithClassName } from "@/types/common"
import clsx from "clsx"
import type { PropsWithChildren } from "react"

interface PageHeaderProps extends PropsWithChildren, WithClassName {}

export default function PageHeader({ children, className }: PageHeaderProps) {
   return <h1 className={clsx("text-3xl ibm-plex-sans font-semibold mb-0.5", className)}>{children}</h1>
}
