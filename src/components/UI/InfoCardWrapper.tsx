import type { WithClassName } from "@/types/common"
import clsx from "clsx"
import type { PropsWithChildren } from "react"

interface WrapperProps extends PropsWithChildren, WithClassName {
   style?: React.CSSProperties
}

export default function InfoCardWrapper({ className, children, style }: WrapperProps) {
   return (
      <div
         style={style}
         className={clsx(
            className,
            "flex flex-col md:grid grid-cols-[repeat(6,1fr)] 4xl:grid-cols-[repeat(5,1fr)] gap-(--components-gap)",
         )}
      >
         {children}
      </div>
   )
}
