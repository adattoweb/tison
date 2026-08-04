import type { WithClassName } from "@/types/common"
import clsx from "clsx"
import type { LucideIcon } from "lucide-react"
import type { PropsWithChildren } from "react"

interface WrapperProps extends PropsWithChildren, WithClassName {
   style?: React.CSSProperties
}

function Wrapper({ className, children, style }: WrapperProps) {
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

interface IconProps extends WithClassName {
   Icon: LucideIcon
   IconClassName?: string
}

function Icon({ className = "", Icon, IconClassName = "" }: IconProps) {
   return (
      <div className={clsx("p-2 border border-(--stroke-color) rounded-md", className)}>
         <Icon className={clsx("size-9 stroke-(--accent-color)", IconClassName)} strokeWidth={1.5} />
      </div>
   )
}

function TextWrapper({ className = "", children }: PropsWithChildren<WithClassName>) {
   return <div className={clsx("flex flex-col gap-1", className)}>{children}</div>
}
function Title({ children, className = "" }: PropsWithChildren<WithClassName>) {
   return <h4 className={clsx("text-(--second-color) truncate text-[14px] 2xl:text-base", className)}>{children}</h4>
}

function Value({ className = "", children }: PropsWithChildren<WithClassName>) {
   return <h3 className={clsx("text-white text-base xl:text-lg 2xl:text-xl font-medium", className)}>{children}</h3>
}

function Description({ className = "", children }: PropsWithChildren<WithClassName>) {
   return <p className={clsx("text-(--right-color) text-base 2xl:text-lg", className)}>{children}</p>
}

interface CardProps extends WithClassName, PropsWithChildren {
   style?: React.CSSProperties
}

function InfoCard({ className = "", children, style }: CardProps) {
   return (
      <div
         className={`flex flex-1 py-3 px-5 rounded-xl border border-(--stroke-color) gap-4 ibm-plex-sans items-center bg-(--bg-trans-color) overflow-hidden ${className}`}
         style={style}
      >
         {children}
      </div>
   )
}

InfoCard.Wrapper = Wrapper
InfoCard.TextWrapper = TextWrapper
InfoCard.Title = Title
InfoCard.Icon = Icon
InfoCard.Value = Value
InfoCard.Description = Description

export default InfoCard
