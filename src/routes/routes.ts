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
import { types } from "./types"

export const routes = [
   dashboard,
   employees,
   products,
   operations,
   stations,
   analytics,
   scheduling,
   defects,
   control,
   storage,
   types,
   analysis,
   settings,
]
