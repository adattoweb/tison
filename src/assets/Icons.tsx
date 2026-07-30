import type { ComponentType } from "react"

export interface IconProps {
   width: number
   height: number
   color?: string
   strokeWidth?: number
}

export type IconType = ComponentType<IconProps>

export function DashboardIcon({ width, height, color = "#C7C7C7", strokeWidth = 1.5 }: IconProps) {
   return (
      <svg width={width} height={height} viewBox="0 0 21 21" fill="none" xmlns="http://www.w3.org/2000/svg">
         <path
            d="M7.625 2.54166H3.38889C2.92098 2.54166 2.54167 2.92098 2.54167 3.38889V9.31944C2.54167 9.78735 2.92098 10.1667 3.38889 10.1667H7.625C8.09291 10.1667 8.47222 9.78735 8.47222 9.31944V3.38889C8.47222 2.92098 8.09291 2.54166 7.625 2.54166Z"
            stroke={color}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeLinejoin="round"
         />
         <path
            d="M16.9444 2.54166H12.7083C12.2404 2.54166 11.8611 2.92098 11.8611 3.38889V5.93055C11.8611 6.39846 12.2404 6.77778 12.7083 6.77778H16.9444C17.4124 6.77778 17.7917 6.39846 17.7917 5.93055V3.38889C17.7917 2.92098 17.4124 2.54166 16.9444 2.54166Z"
            stroke={color}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeLinejoin="round"
         />
         <path
            d="M16.9444 10.1667H12.7083C12.2404 10.1667 11.8611 10.546 11.8611 11.0139V16.9444C11.8611 17.4123 12.2404 17.7917 12.7083 17.7917H16.9444C17.4124 17.7917 17.7917 17.4123 17.7917 16.9444V11.0139C17.7917 10.546 17.4124 10.1667 16.9444 10.1667Z"
            stroke={color}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeLinejoin="round"
         />
         <path
            d="M7.625 13.5556H3.38889C2.92098 13.5556 2.54167 13.9349 2.54167 14.4028V16.9444C2.54167 17.4124 2.92098 17.7917 3.38889 17.7917H7.625C8.09291 17.7917 8.47222 17.4124 8.47222 16.9444V14.4028C8.47222 13.9349 8.09291 13.5556 7.625 13.5556Z"
            stroke={color}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeLinejoin="round"
         />
      </svg>
   )
}
