import InfoCard from "@/components/UI/InfoCard"
import type { WithClassName } from "@/types/common"
import type { DefectRead } from "@/api/types/defect"
import type { OperationListRead } from "@/api/types/operation"
import { DEFECT_STATUS } from "@/constants/status"
import { formatDate } from "@/utils/time"

interface DefectHeaderProps extends WithClassName {
   defect: DefectRead
   operation?: OperationListRead
}

export function DefectHeader({ defect, operation, className = "" }: DefectHeaderProps) {
   const status = DEFECT_STATUS[defect.status]

   return (
      <InfoCard.Wrapper style={{ gridArea: "header" }} className={className}>
         <InfoCard className="col-span-3 lg:col-span-2 4xl:col-span-1!">
            <InfoCard.TextWrapper>
               <InfoCard.Title>Статус</InfoCard.Title>
               <InfoCard.Value className={status.className}>{status.label}</InfoCard.Value>
            </InfoCard.TextWrapper>
         </InfoCard>

         <InfoCard className="col-span-3 lg:col-span-2 4xl:col-span-1!">
            <InfoCard.TextWrapper>
               <InfoCard.Title>Дефект</InfoCard.Title>
               <InfoCard.Value>{defect.title}</InfoCard.Value>
            </InfoCard.TextWrapper>
         </InfoCard>

         <InfoCard className="col-span-3 lg:col-span-2 4xl:col-span-1!">
            <InfoCard.TextWrapper>
               <InfoCard.Title>Виріб</InfoCard.Title>
               <InfoCard.Value>{operation?.product?.code ?? "—"}</InfoCard.Value>
            </InfoCard.TextWrapper>
         </InfoCard>

         <InfoCard className="col-span-3 4xl:col-span-1!">
            <InfoCard.TextWrapper>
               <InfoCard.Title>Виявлено</InfoCard.Title>
               <InfoCard.Value>{formatDate(defect.start_at) ?? "—"}</InfoCard.Value>
            </InfoCard.TextWrapper>
         </InfoCard>

         <InfoCard className="col-span-6 lg:col-span-3 4xl:col-span-1!">
            <InfoCard.TextWrapper>
               <InfoCard.Title>Закрито</InfoCard.Title>
               <InfoCard.Value>{formatDate(defect.end_at) ?? "Ще не закрито"}</InfoCard.Value>
            </InfoCard.TextWrapper>
         </InfoCard>
      </InfoCard.Wrapper>
   )
}
