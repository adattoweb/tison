import { analysis } from "./analysis"
import { analytics } from "./analytics"
import { dashboard } from "./dashboard"
import { defects } from "./defects"
import { operations } from "./operations"
import { products } from "./products"
import { scheduling } from "./scheduling"
import { settings } from "./settings"
import { stations } from "./stations"
import { users } from "./users"

export const routes = [
   dashboard,
   users,
   products,
   operations,
   stations,
   analytics,
   scheduling,
   defects,
   analysis,
   settings,
]
