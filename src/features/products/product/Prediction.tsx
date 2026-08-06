export function Prediction() {
   return (
      <div
         className="ibm-plex-sans bg-(--bg-trans-color) border border-(--stroke-color) rounded-xl py-(--components-py) px-(--components-px) gap-2"
         style={{ gridArea: "predict" }}
      >
         <h2 className="text-white text-xl font-medium">ШІ Прогноз</h2>
         <p className="text-(--second-color) ">
            ШІ рекомендує збільшити масштаби виробництва моделей, адже моделі показують хороший попит і хорошу якість.
            Перевагами моделі є швидка швидкість виробництва і висока якість.
         </p>
      </div>
   )
}
