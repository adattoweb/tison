// src/features/settings/roles/permissionLabels.ts

import type { PermissionListRead } from "@/api/types/permission"

const RESOURCE_LABELS: Record<string, string> = {
   product: "Вироби",
   operation: "Операції",
   defect: "Дефекти",
   user: "Працівники",
   station: "Робочі станції",
   profile: "Профілі",
   analytics: "Аналітика",
   storage: "Налаштування системи",
   role: "Ролі",
   permission: "Дозволи",
   role_permission: "Права ролей",
   department: "Відділи",
   operation_type: "Типи операцій",
   instruction: "Інструкції",
   product_model: "Моделі виробів",
   order: "Замовлення",
   shift: "Зміни",
   session: "Сесії",
   work_session: "Робочі сесії",
}

const RESOURCE_GENITIVE: Record<string, string> = {
   product: "виробів",
   operation: "операцій",
   defect: "дефектів",
   user: "працівників",
   station: "робочих станцій",
   profile: "профілів",
   analytics: "аналітики",
   storage: "налаштувань системи",
   role: "ролей",
   permission: "дозволів",
   role_permission: "прав ролей",
   department: "відділів",
   operation_type: "типів операцій",
   instruction: "інструкцій",
   product_model: "моделей виробів",
   order: "замовлень",
   shift: "змін",
   session: "сесій",
   work_session: "робочих сесій",
}

const ACTION_LABELS: Record<string, string> = {
   create: "Створення",
   read: "Перегляд",
   update: "Редагування",
   delete: "Видалення",
}

// Природніші формулювання для конкретних пар, де дослівний переклад звучить незграбно
const ACTION_OVERRIDES: Record<string, string> = {
   "operation.update": "Виконання операцій",
}

// Порядок груп, як у макеті; усе, чого тут немає, йде після — за алфавітом
const GROUP_ORDER = ["product", "operation", "defect", "user", "station", "profile", "analytics", "storage"]

export function permissionLabel(permission: PermissionListRead): string {
   const key = `${permission.resource}.${permission.action}`
   if (ACTION_OVERRIDES[key]) return ACTION_OVERRIDES[key]

   const actionLabel = ACTION_LABELS[permission.action] ?? permission.action
   const genitive = RESOURCE_GENITIVE[permission.resource] ?? permission.resource
   return `${actionLabel} ${genitive}`
}

export function resourceLabel(resource: string): string {
   return RESOURCE_LABELS[resource] ?? resource
}

export interface PermissionGroup {
   resource: string
   label: string
   items: (PermissionListRead & { label: string })[]
}

export function groupPermissions(permissions: PermissionListRead[]): PermissionGroup[] {
   const byResource = new Map<string, PermissionListRead[]>()
   for (const permission of permissions) {
      const list = byResource.get(permission.resource) ?? []
      list.push(permission)
      byResource.set(permission.resource, list)
   }

   const groups: PermissionGroup[] = [...byResource.entries()].map(([resource, items]) => ({
      resource,
      label: resourceLabel(resource),
      items: [...items]
         .sort((a, b) => a.action.localeCompare(b.action))
         .map(item => ({ ...item, label: permissionLabel(item) })),
   }))

   groups.sort((a, b) => {
      const ai = GROUP_ORDER.indexOf(a.resource)
      const bi = GROUP_ORDER.indexOf(b.resource)
      if (ai === -1 && bi === -1) return a.label.localeCompare(b.label)
      if (ai === -1) return 1
      if (bi === -1) return -1
      return ai - bi
   })

   return groups
}
