import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer } from "recharts"

export function ProgressBar({ progress, color }: { progress: number; color: string }) {
   const data = [{ name: "progress", value: progress, rest: 100 - progress }]

   return (
      <div className="h-2 w-full rounded-xl bg-(--stroke-color) ">
         <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} layout="vertical" margin={{ top: 0, right: 0, bottom: 0, left: 0 }}>
               <XAxis type="number" domain={[0, 100]} hide />
               <YAxis type="category" dataKey="name" hide />
               <Bar dataKey="value" stackId="progress" fill={color} radius={4} barSize={8} />
               <Bar dataKey="rest" stackId="progress" fill="var(--stroke-color)" radius={4} barSize={8} />
            </BarChart>
         </ResponsiveContainer>
      </div>
   )
}
