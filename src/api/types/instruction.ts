import type { OperationTypeRead } from "./operationType"

export type InstructionDetails = Record<string, string | number>[] | null

export type InstructionSteps = string[] | null

export type InstructionCheckpoints = string[] | null

export interface InstructionListRead {
   id: number

   order: number
   product_model_id: number
   details: InstructionDetails
   steps: InstructionSteps
   checkpoints: InstructionCheckpoints
   operation_type_id: number
   operation_type: OperationTypeRead
   title: string
   description: string
   planned_time: number | null
}

export interface InstructionRead extends InstructionListRead {}
