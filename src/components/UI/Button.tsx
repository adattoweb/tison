import type { WithClassName } from "@/types/common"
import type { LucideIcon, LucideProps } from "lucide-react"
import type { PropsWithChildren } from "react"
import { Link, type LinkProps } from "react-router"

type ButtonTheme = "transparent" | "accent" | "accentFilled"

interface ButtonProps extends WithClassName, PropsWithChildren {
   onClick?: () => void
   type?: ButtonTheme
}

const buttonClassName = "px-3 py-2 flex gap-2 border rounded-md cursor-pointer transition-colors duration-300"

const themes = {
   transparent:
      "border-(--stroke-color) bg-(--bg-trans-color) text-white stroke-white hover:bg-(--bg-trans-hover-color)",
   accent: "border-(--accent-color) text-(--accent-color) stroke-(--accent-color)",
   accentFilled: "border-0 text-(--accent-color) bg-(--accent-trans-color) stroke-(--accent-color)",
}

const getTypeClassName = (type: ButtonTheme) => {
   return themes[type]
}

function Button({ className = "", children, onClick, type = "transparent" }: ButtonProps) {
   const typeClassName = getTypeClassName(type)
   return (
      <div className={`${className} ${buttonClassName} ${typeClassName}`} onClick={onClick}>
         {children}
      </div>
   )
}

type ButtonLinkProps = Omit<ButtonProps, "onClick"> & LinkProps

function ButtonLink({ className = "", children, onClick, type = "transparent", ...props }: ButtonLinkProps) {
   const typeClassName = getTypeClassName(type)
   return (
      <Link {...props} className={`${className} ${buttonClassName} ${typeClassName}`} onClick={onClick}>
         {children}
      </Link>
   )
}

interface ParagraphProps extends WithClassName {
   children: string
}

function Paragraph({ className = "", children }: ParagraphProps) {
   return <p className={`${className} font-base text-normal text-inherit`}>{children}</p>
}

interface IconProps extends WithClassName, LucideProps {
   Icon: LucideIcon
}

function Icon({ Icon, className = "", ...props }: IconProps) {
   return <Icon className={`${className} size-6 stroke-inherit`} {...props} />
}

Button.Paragraph = Paragraph
Button.Icon = Icon
Button.ButtonLink = ButtonLink

export default Button
