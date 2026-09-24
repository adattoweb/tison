import type { StationWorkSessionListRead } from "@/api/types/workSession"
import Table from "@/components/Table/Table"
import { avatarUrl } from "@/constants/global"
import { useProfile } from "@/hooks/api/profile/useProfile"
import { useStationRecentWorkSessions } from "@/hooks/api/stationAnalytics/useStationRecentWorkSessions"
import { formatDateTime, formatDuration, getDurationSeconds } from "@/utils/time"

const columns = ["Оператор", "Операція", "Виріб", "Початок", "Тривалість", "Статус"]
const tableClassNames = "min-w-275 grid-cols-[1.8fr_1.5fr_1.2fr_1.5fr_1.2fr_1fr]"

interface RowProps {
   session: StationWorkSessionListRead
}

function Row({ session }: RowProps) {
   const { data: operator } = useProfile(session.operator_id)
   const duration = getDurationSeconds(session.started_at, session.end_at)

   return (
      <Table.Row to={`/operation/${session.operation.id}`}>
         <Table.Person
            avatarUrl={avatarUrl}
            name={operator ? `${operator.first_name} ${operator.last_name}` : "—"}
            code={operator?.code ?? ""}
         />
         <Table.Text text={session.operation.operation_type.name} />
         <Table.Text text={session.operation.product?.code ?? "—"} />
         <Table.Text text={formatDateTime(session.started_at)} />
         <Table.Text text={session.end_at ? formatDuration(duration) : "Триває"} />
         <Table.Text text={session.result ?? "—"} />
      </Table.Row>
   )
}

interface RecentWorkSessionsTableProps {
   stationId: number
   limit?: number
}

export function RecentWorkSessionsTable({ stationId, limit = 5 }: RecentWorkSessionsTableProps) {
   const { data, isLoading, isError } = useStationRecentWorkSessions(stationId, { limit })

   const sessions = data ?? []

   return (
      <Table.Wrapper style={{ gridArea: "history" }}>
         <Table columns={columns} tableClassNames={tableClassNames} isFlexible={true}>
            {isLoading && <p className="min-w-275 px-4 py-6 text-center text-(--second-color)">Завантаження...</p>}

            {isError && <p className="min-w-275 px-4 py-6 text-center text-red-400">Не вдалося завантажити сесії</p>}

            {!isLoading && !isError && sessions.length === 0 && (
               <p className="min-w-275 px-4 py-6 text-center text-(--second-color)">Сесій ще не було</p>
            )}

            {!isLoading && !isError && sessions.map(session => <Row key={session.id} session={session} />)}
         </Table>
      </Table.Wrapper>
   )
}
