import { analysis } from "./analysis"
import { analytics } from "./analytics"
import { dashboard } from "./dashboard"
import { defects } from "./defects"
import { operations } from "./operations"
import { products } from "./products"
import { scheduling } from "./scheduling"
import { settings } from "./settings"
import { stations } from "./stations"
import { employees } from "./employees"
import { control } from "./control"
import { storage } from "./storage"
import { models } from "./models"
import { logout } from "./logout"
import { departments } from "./departments"
import { operationTypes } from "./operationTypes"

export const routes = [
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
   scheduling,
   control,
   storage,
   analysis,
   settings,
   logout,
]
