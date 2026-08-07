import { ProgressBar } from "@/components/UI/ProgressBar"
import { titleClassName } from "@/utils/classNames"
import { getCSSVar } from "@/utils/getCSSVar"

function WorkloadItem() {
   return (
      <li className="flex flex-col py-2">
         <div className="flex flex-1 justify-between mb-2">
            <p className="text-(--second-color) text-sm">Монтажний цех</p>
            <p className="text-(--second-color) text-sm">50%</p>
         </div>
         <ProgressBar progress={50} color={getCSSVar("--right-color")} />
      </li>
   )
}

export function AnalyticsWorkload() {
   return (
      <div
         className="flex flex-col py-(--components-py) px-(--components-px) rounded-xl border border-(--stroke-color) gap-3 ibm-plex-sans bg-(--bg-trans-color)"
         style={{ gridArea: "workload" }}
      >
         <h2 className={titleClassName}>Завантаження дільниць</h2>
         <ul className="flex flex-col justify-between flex-1 mb-2">
            <WorkloadItem />
            <WorkloadItem />
            <WorkloadItem />
            <WorkloadItem />
            <WorkloadItem />
         </ul>
      </div>
   )
}
