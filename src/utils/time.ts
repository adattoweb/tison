/** Форматує тривалість у секундах як "1 год 20 хв" / "45 хв" / "30 с" */
export function formatDuration(seconds: number | null | undefined): string {
   if (seconds === null || seconds === undefined) return "—"
   if (seconds < 60) return `${Math.max(0, Math.round(seconds))} с`

   const totalMinutes = Math.floor(seconds / 60)
   const hours = Math.floor(totalMinutes / 60)
   const minutes = totalMinutes % 60

   if (hours === 0) return `${minutes} хв`
   if (minutes === 0) return `${hours} год`
   return `${hours} год ${minutes} хв`
}

export const formatDate = (iso: string | null | undefined) => (iso ? new Date(iso).toLocaleDateString("uk-UA") : null)

/** "18.09.2026, 14:30" або "—" */
export function formatDateTime(value: string | null | undefined): string {
   if (!value) return "—"
   const date = new Date(value)
   if (Number.isNaN(date.getTime())) return "—"
   return date.toLocaleString("uk-UA", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
   })
}

/** ISO -> значення для <input type="datetime-local"> */
export function toDateTimeLocal(value: string | null | undefined): string {
   if (!value) return ""
   const date = new Date(value)
   if (Number.isNaN(date.getTime())) return ""
   const pad = (n: number) => String(n).padStart(2, "0")
   return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(
      date.getMinutes(),
   )}`
}

/** значення <input type="datetime-local"> -> ISO */
export function fromDateTimeLocal(value: string | null | undefined): string | null {
   if (!value) return null
   const date = new Date(value)
   if (Number.isNaN(date.getTime())) return null
   return date.toISOString()
}

// Бекенд вимагає дату з часовим поясом, тому локальний день перетворюємо в ISO (UTC)
export const startOfDay = (date: Date) => {
   const d = new Date(date)
   d.setHours(0, 0, 0, 0)
   return d.toISOString()
}

export const endOfDay = (date: Date) => {
   const d = new Date(date)
   d.setHours(23, 59, 59, 999)
   return d.toISOString()
}

// const startOfDay = (date: string) => (date ? new Date(`${date}T00:00:00`).toISOString() : undefined)
// const endOfDay = (date: string) => (date ? new Date(`${date}T23:59:59.999`).toISOString() : undefined)

const pad = (n: number) => String(n).padStart(2, "0")

// ISO з бекенду -> значення для <input type="datetime-local"> (локальний час)
export const toLocalInput = (iso: string) => {
   const d = new Date(iso)
   return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`
}

// значення з <input type="datetime-local"> -> ISO (UTC) для бекенду
export const fromLocalInput = (value: string) => new Date(value).toISOString()

// Українська множина: 1 рік, 2-4 роки, 5+ років (11-14 завжди "many")
const plural = (n: number, one: string, few: string, many: string) => {
   const m10 = n % 10
   const m100 = n % 100
   if (m10 === 1 && m100 !== 11) return one
   if (m10 >= 2 && m10 <= 4 && !(m100 >= 12 && m100 <= 14)) return few
   return many
}

/** Стаж від дати `iso` до сьогодні: "2 роки 3 місяці", а для нових працівників "12 днів" */
export function formatTenure(iso: string | null | undefined, now: Date = new Date()): string {
   if (!iso) return "—"
   const start = new Date(iso)
   if (Number.isNaN(start.getTime()) || start > now) return "—"

   // повні календарні місяці; якщо день місяця ще не настав, останній місяць неповний
   let months = (now.getFullYear() - start.getFullYear()) * 12 + (now.getMonth() - start.getMonth())
   if (now.getDate() < start.getDate()) months--
   months = Math.max(months, 0)

   const years = Math.floor(months / 12)
   const restMonths = months % 12

   const parts: string[] = []
   if (years > 0) parts.push(`${years} ${plural(years, "рік", "роки", "років")}`)
   if (restMonths > 0) parts.push(`${restMonths} ${plural(restMonths, "місяць", "місяці", "місяців")}`)
   if (parts.length > 0) return parts.join(" ")

   // менше місяця показуємо в днях
   const days = Math.floor((now.getTime() - start.getTime()) / 86_400_000)
   return days < 1 ? "Менше доби" : `${days} ${plural(days, "день", "дні", "днів")}`
}
