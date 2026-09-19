import type { StatusType } from "@/types/status"

export const STATUS: Record<StatusType, { label: string; color: string }> = {
   DONE: { label: "Готовий", color: "#61D381" },
   ACTIVE: { label: "Активний", color: "#61D381" },
   IDLE: { label: "Очікує", color: "#F2A65A" },
}
