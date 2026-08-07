import { ProgressBar } from "@/components/UI/ProgressBar"
import { titleClassName } from "@/utils/classNames"
import { getCSSVar } from "@/utils/getCSSVar"

function EfficiencyItem() {
   return (
      <div className="flex flex-col py-2">
         <div className="flex flex-1 justify-between mb-2">
            <p className="text-(--second-color) text-sm">Доступність</p>
            <p className="text-(--second-color) text-sm">96%</p>
         </div>
         <ProgressBar progress={96} color={getCSSVar("--right-color")} />
      </div>
   )
}

export function AnalyticsEfficiency() {
   return (
      <div
         className="flex flex-col py-(--components-py) px-(--components-px) rounded-xl border border-(--stroke-color) gap-3 ibm-plex-sans bg-(--bg-trans-color)"
         style={{ gridArea: "efficiency" }}
      >
         <h2 className={titleClassName}>Загальна ефективність</h2>
         <ul className="flex flex-col justify-between flex-1 mb-2">
            <EfficiencyItem />
            <EfficiencyItem />
            <EfficiencyItem />
            <EfficiencyItem />
            <EfficiencyItem />
         </ul>
      </div>
   )
}
