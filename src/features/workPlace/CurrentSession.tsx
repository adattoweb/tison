import { useState } from "react"
import { SquareIcon } from "lucide-react"

import Button from "@/components/UI/Button"
import { Block, Placeholder } from "./Block"
import { EndSessionModal } from "./EndSessionModal"
import type { WorkSessionRead } from "@/api/types/workSession"
import { useElapsedTime } from "@/hooks/ui/useElapsedTime"
import { formatDuration } from "@/utils/time"

interface CurrentSessionProps {
   area: string
   session: WorkSessionRead | null | undefined
   isLoading: boolean
}

function InfoRow({ label, value }: { label: string; value: string }) {
   return (
      <div className="flex items-baseline justify-between gap-4 text-sm md:text-base">
         <span className="text-[#D9D9D9]">{label}</span>
         <span className="truncate text-right text-white">{value}</span>
      </div>
   )
}

function ActiveSession({ session }: { session: WorkSessionRead }) {
   const [isEndOpen, setIsEndOpen] = useState(false)
   const elapsed = useElapsedTime(session.started_at)
   const operationType = session.operation.operation_type?.name

   return (
      <>
         <p className="py-2 text-center font-mono text-4xl font-semibold tabular-nums text-white md:text-5xl">
            {formatDuration(elapsed)}
         </p>

         <div className="flex flex-col gap-1.5 border-t border-(--stroke-color) pt-3">
            <InfoRow label="Станція" value={session.station.code} />
            <InfoRow label="Операція" value={[session.operation.code, operationType].filter(Boolean).join(" · ")} />
            <InfoRow
               label="Початок"
               value={new Date(
                  session.started_at.endsWith("Z") ? session.started_at : `${session.started_at}Z`,
               ).toLocaleTimeString("uk-UA", { hour: "2-digit", minute: "2-digit" })}
            />
            {session.note && <InfoRow label="Примітка" value={session.note} />}
         </div>

         <Button onClick={() => setIsEndOpen(true)} type="accent" className="mt-auto w-full justify-center">
            <Button.Icon Icon={SquareIcon} />
            <Button.Paragraph>Завершити сесію</Button.Paragraph>
         </Button>

         <EndSessionModal isOpen={isEndOpen} onClose={() => setIsEndOpen(false)} sessionId={session.id} />
      </>
   )
}

export function CurrentSession({ area, session, isLoading }: CurrentSessionProps) {
   return (
      <Block area={area} title="Поточна сесія">
         {isLoading ? (
            <Placeholder>Завантаження...</Placeholder>
         ) : session ? (
            <ActiveSession session={session} />
         ) : (
            <Placeholder>Активної сесії немає. Натисніть «Додати сесію», щоб почати роботу</Placeholder>
         )}
      </Block>
   )
}
