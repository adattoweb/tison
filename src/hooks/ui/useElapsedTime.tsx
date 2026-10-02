import { useEffect, useState } from "react"

/** Бекенд може віддавати naive-datetime без "Z" — тоді вважаємо його UTC */
const parseUtc = (iso: string) => Date.parse(/(Z|[+-]\d{2}:?\d{2})$/.test(iso) ? iso : `${iso}Z`)

/** Скільки секунд минуло від startedAt (оновлюється щосекунди) */
export function useElapsedTime(startedAt?: string | null): number {
   const [now, setNow] = useState(() => Date.now())

   useEffect(() => {
      if (!startedAt) return
      setNow(Date.now())
      const timer = setInterval(() => setNow(Date.now()), 1000)
      return () => clearInterval(timer)
   }, [startedAt])

   if (!startedAt) return 0
   return Math.max(0, Math.floor((now - parseUtc(startedAt)) / 1000))
}

export function formatDuration(totalSeconds: number): string {
   const h = Math.floor(totalSeconds / 3600)
   const m = Math.floor((totalSeconds % 3600) / 60)
   const s = totalSeconds % 60
   return [h, m, s].map(n => String(n).padStart(2, "0")).join(":")
}
