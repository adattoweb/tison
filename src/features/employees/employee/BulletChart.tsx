import clsx from "clsx"
import { useMemo } from "react"
import { Bar, BarChart, ReferenceDot, ReferenceLine, ResponsiveContainer, XAxis, YAxis } from "recharts"

interface Zone {
   key: string
   label: string
   to?: number
   color: string
}

interface Segment extends Zone {
   from: number
   to: number
   width: number
}

function getNiceMax(rawMax: number) {
   if (rawMax <= 0) return 10
   const magnitude = Math.pow(10, Math.floor(Math.log10(rawMax)))
   const step = magnitude / 2 || 1
   return Math.ceil((rawMax * 1.1) / step) * step
}

function buildSegments(zones: Zone[], min: number, max: number): Segment[] {
   let prev = min
   return zones.map(zone => {
      const to = zone.to ?? max
      const segment: Segment = { ...zone, from: prev, to, width: to - prev }
      prev = to
      return segment
   })
}

const CHART_MARGIN = { top: 8, right: 12, bottom: 28, left: 12 }

interface BulletChartProps {
   segments: Segment[]
   min: number
   max: number
   plan: number
   fact: number
   height?: number
}

function BulletChart({ segments, min, max, plan, fact, height = 96 }: BulletChartProps) {
   const dataRow = useMemo(() => {
      const row: Record<string, number | string> = { name: "kpi", __fact: fact }
      segments.forEach(s => {
         row[s.key] = s.width
      })
      return row
   }, [segments, fact])

   const data = [dataRow]

   const ticks = useMemo(() => {
      const raw = [min, ...segments.map(s => s.to)]
      return Array.from(new Set(raw)).sort((a, b) => a - b)
   }, [segments, min])

   return (
      <div className="relative" style={{ height }}>
         <ResponsiveContainer width="100%" height={height}>
            <BarChart data={data} layout="vertical" margin={CHART_MARGIN} barCategoryGap={0}>
               <XAxis
                  type="number"
                  domain={[min, max]}
                  ticks={ticks}
                  tickFormatter={v => `${v}%`}
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "var(--second-color)", fontSize: 13 }}
               />
               <YAxis type="category" dataKey="name" hide />
               {segments.map((s, i) => (
                  <Bar
                     key={s.key}
                     dataKey={s.key}
                     stackId="zones"
                     fill={s.color}
                     barSize={40}
                     radius={i === 0 ? [8, 0, 0, 8] : i === segments.length - 1 ? [0, 8, 8, 0] : [0, 0, 0, 0]}
                     isAnimationActive={false}
                  />
               ))}
            </BarChart>
         </ResponsiveContainer>

         <div className="absolute left-0 top-0 h-full w-full">
            <ResponsiveContainer width="100%" height={height}>
               <BarChart data={data} layout="vertical" margin={CHART_MARGIN} barCategoryGap={0}>
                  <XAxis type="number" domain={[min, max]} hide />
                  <YAxis type="category" dataKey="name" hide />
                  <Bar dataKey="__fact" barSize={16} radius={8} fill="var(--right-color)" isAnimationActive={false} />
                  <ReferenceLine x={plan} stroke="#ffffff" strokeWidth={2} />
                  <ReferenceDot
                     x={fact}
                     y="kpi"
                     r={7}
                     fill="var(--right-color)"
                     stroke="#ffffff"
                     strokeWidth={2}
                     isFront
                  />
               </BarChart>
            </ResponsiveContainer>
         </div>
      </div>
   )
}

// ---- Тут "зашиті" дефолтні дані під одного співробітника/один кейс ----
const DEFAULT_TITLE = "KPI виконання плану"
const DEFAULT_PLAN = 100
const DEFAULT_FACT = 120
const DEFAULT_ZONES: Zone[] = [
   { key: "bad", label: "Погано", to: 60, color: "var(--bad-color)" },
   { key: "ok", label: "Задовільно", to: 90, color: "var(--accent-color)" },
   { key: "good", label: "Добре", to: 110, color: "var(--right-color)" },
   { key: "excellent", label: "Відмінно", color: "color-mix(in srgb, var(--right-color) 55%, black)" },
]

interface KpiBulletCardProps {
   title?: string
   plan?: number
   fact?: number
   zones?: Zone[]
   min?: number
   max?: number
   unit?: string
   className?: string
}

export function KpiBulletCard({
   title = DEFAULT_TITLE,
   plan = DEFAULT_PLAN,
   fact = DEFAULT_FACT,
   zones = DEFAULT_ZONES,
   min = 0,
   max,
   unit = "%",
   className = "",
}: KpiBulletCardProps) {
   const resolvedMax = useMemo(() => {
      const bounds = zones.map(z => z.to ?? 0)
      return max ?? getNiceMax(Math.max(fact, plan, ...bounds))
   }, [zones, plan, fact, max])

   const segments = useMemo(() => buildSegments(zones, min, resolvedMax), [zones, min, resolvedMax])

   return (
      <div
         className={clsx("rounded-2xl border border-(--stroke-color) bg-(--bg-color)", className)}
         style={{ padding: "var(--components-py) var(--components-px)" }}
      >
         <h3 className="text-xl font-semibold text-white">{title}</h3>

         <div className="mt-5 flex flex-wrap items-start gap-x-10 gap-y-3 border-b border-(--stroke-color) pb-5">
            {segments.map(s => (
               <div key={s.key} className="flex flex-col gap-1">
                  <div className="flex items-center gap-2">
                     <span className="size-2.5 shrink-0 rounded-full" style={{ backgroundColor: s.color }} />
                     <span className="text-base font-medium text-white">{s.label}</span>
                  </div>
                  <span className="text-(--second-color)">
                     {s.to === resolvedMax && zones.find(z => z.key === s.key)?.to === undefined
                        ? `${s.from}${unit}+`
                        : `${s.from} - ${s.to}${unit}`}
                  </span>
               </div>
            ))}
         </div>

         <div className="mt-6">
            <BulletChart segments={segments} min={min} max={resolvedMax} plan={plan} fact={fact} />
         </div>

         <div className="mt-4 flex flex-wrap items-center gap-6">
            <div className="flex items-center gap-2">
               <span className="inline-block h-3.5 w-0.5 bg-white" />
               <span className="text-(--second-color)">
                  План{" "}
                  <span className="font-semibold text-white">
                     {plan}
                     {unit}
                  </span>
               </span>
            </div>
            <div className="flex items-center gap-2">
               <span className="size-2.5 rounded-full" style={{ backgroundColor: "var(--right-color)" }} />
               <span className="text-(--second-color)">
                  Факт{" "}
                  <span className="font-semibold text-white">
                     {fact}
                     {unit}
                  </span>
               </span>
            </div>
         </div>
      </div>
   )
}

export default KpiBulletCard
