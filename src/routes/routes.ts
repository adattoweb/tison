import { analysis } from "./analysis"
import { analytics } from "./analytics"
import { dashboard } from "./dashboard"
import { defects } from "./defects"
import { operations } from "./operations"
import { products } from "./products"
import { orders } from "./scheduling"
import { settings } from "./settings"
import { stations } from "./stations"
import { employees } from "./employees"
import { control } from "./control"
import { storage } from "./storage"
import { models } from "./models"
import { logout } from "./logout"
import { departments } from "./departments"
import { operationTypes } from "./operationTypes"
import type { AppRoute } from "@/types/routes"

export const routes: AppRoute[] = [
   dashboard,
   employees,
   products,
   models,
   operations,
   operationTypes,
   defects,
   stations,
   departments,
   analytics,
   orders,
   control,
   storage,
   analysis,
   settings,
   logout,
]
