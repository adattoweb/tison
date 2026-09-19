import { api } from "@/api/api"
import type { InstructionRead } from "../types/instruction"
import type { InstructionCreateInput, InstructionUpdateInput } from "../schemas/instruction"

export const createInstruction = async (data: InstructionCreateInput): Promise<InstructionCreateInput> => {
   const { data: response } = await api.post<InstructionCreateInput>("/instructions", data)
   return response
}

export const updateInstruction = async (id: number, data: InstructionUpdateInput): Promise<InstructionUpdateInput> => {
   const { data: response } = await api.put<InstructionUpdateInput>(`/instructions/${id}`, data)
   return response
}

export const deleteInstruction = async (id: number): Promise<InstructionRead> => {
   const { data: response } = await api.delete<InstructionRead>(`/instructions/${id}`)
   return response
}
