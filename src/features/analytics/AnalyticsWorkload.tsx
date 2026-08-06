import { ProgressBar } from "@/components/UI/ProgressBar"
import { titleClassName } from "@/utils/classNames"
import { getCSSVar } from "@/utils/getCSSVar"

function WorkloadItem() {
   return (
      <div className="flex flex-col">
         <div className="flex flex-1 justify-between mb-2">
            <p className="text-(--second-color) text-sm">Монтажний цех</p>
            <p className="text-(--second-color) text-sm">50%</p>
         </div>
         <ProgressBar progress={50} color={getCSSVar("--right-color")} />
      </div>
   )
}

export function AnalyticsWorkload() {
   return (
      <div className="flex flex-col py-(--components-py) px-(--components-px) rounded-xl border border-(--stroke-color) gap-3 ibm-plex-sans bg-(--bg-trans-color)">
         <h2 className={titleClassName}>Завантаження дільниць</h2>
         <WorkloadItem />
         <WorkloadItem />
         <WorkloadItem />
         <WorkloadItem />
         <WorkloadItem />
      </div>
   )
}
