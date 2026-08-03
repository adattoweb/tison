import type { StatusType } from "@/types/status"

export const STATUS: Record<StatusType, { label: string; color: string }> = {
   inProgress: { label: "Виробляється", color: "var(--right-color)" },
   completed: { label: "Завершено", color: "#4f8dfd" },
   waiting: { label: "Очікує", color: "#F2A65A" },
   delayed: { label: "Затримка", color: "#ef4444" },
   active: { label: "Активна", color: "#61D381" },
   idle: { label: "Очікує", color: "#F2A65A" },
   maintenance: { label: "Обслуговування", color: "#4f8dfd" },
   error: { label: "Помилка", color: "#ef4444" },
   open: { label: "Відкрито", color: "#ef4444" },
   closed: { label: "Закрито", color: "#61D381" },
}
