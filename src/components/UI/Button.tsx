import type { WithClassName } from "@/types/common"
import type { LucideIcon, LucideProps } from "lucide-react"
import type { PropsWithChildren } from "react"

type ButtonTheme = "transparent" | "accent"

interface ButtonProps extends WithClassName, PropsWithChildren {
   onClick: () => void
   type?: ButtonTheme
}

function Button({ className = "", children, onClick, type = "transparent" }: ButtonProps) {
   const typeClassName =
      type === "transparent"
         ? "border-(--stroke-color) bg-(--bg-trans-color) text-white stroke-white"
         : "border-(--accent-color) text-(--accent-color) stroke-(--accent-color)"
   return (
      <div
         className={`${className} px-3 py-2 flex gap-2 border rounded-md cursor-pointer ${typeClassName}`}
         onClick={onClick}
      >
         {children}
      </div>
   )
}

interface ParagraphProps extends WithClassName {
   children: string
}

function Paragraph({ className = "", children }: ParagraphProps) {
   return <p className={`${className} font-medium text-normal text-inherit`}>{children}</p>
}

interface IconProps extends WithClassName, LucideProps {
   Icon: LucideIcon
}

function Icon({ Icon, className = "", ...props }: IconProps) {
   return <Icon className={`${className} size-6 stroke-inherit`} {...props} />
}

Button.Paragraph = Paragraph
Button.Icon = Icon

export default Button
