import type { StatusType } from "@/types/status"

export const STATUS: Record<StatusType, { label: string; color: string }> = {
   inProgress: { label: "Виробляється", color: "var(--right-color)" },
   completed: { label: "Завершено", color: "#4f8dfd" },
   waiting: { label: "Очікує", color: "var(--second-color)" },
   delayed: { label: "Затримка", color: "#ef4444" },
}
