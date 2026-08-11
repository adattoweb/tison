import { titleClassName } from "@/utils/classNames"
import product from "@/assets/images/product.jpg"
import { ChevronDownIcon } from "lucide-react"
import { useLayoutEffect, useRef, useState } from "react"
import clsx from "clsx"
import gsap from "gsap"

interface ItemProps {
   isActive: boolean
   index: number
   name: string
}

function ListItem({ isActive, index, name }: ItemProps) {
   return (
      <li
         className={clsx(
            "flex flex-1 gap-2 items-center hover:bg-(--bg-trans-color) py-2 px-2 rounded-lg duration-200",
            isActive && "bg-(--accent-trans-color) hover:bg-(--accent-trans-color)!",
         )}
      >
         <div
            className={clsx(
               "size-8 text-center flex justify-center items-center rounded-full border border-(--stroke-color) text-lg font-medium text-(--second-color)",
               isActive && "text-(--accent-color)! border-(--accent-color)!",
            )}
         >
            {index}
         </div>
         <p className={clsx("ibm-plex-sans text-(--second-color)", isActive && "text-(--accent-color)!")}>{name}</p>
      </li>
   )
}

function Content() {
   const parameters = [
      { label: "Тип операції:", value: "Паяльна" },
      { label: "Обладнання:", value: "Піч оплавлення" },
      { label: "Температура:", value: "245 °C" },
      { label: "Час:", value: "180 с" },
      { label: "Атмосфера:", value: "Азот" },
   ]

   const instructions = [
      "Завантажити плату в піч оплавлення",
      "Встановити температурний профіль згідно специфікації",
      "Запустити цикл оплавлення",
      "Дочекатись завершення циклу",
      "Перевірити якість пайки візуально",
   ]

   const checkpoints = ["Температура профілю", "Час оплавлення", "Якість пайки"]
   return (
      <main className="flex gap-4">
         <div className="flex flex-col rounded-lg border-(--stroke-color) border px-(--components-py) py-(--components-py)">
            <p className="text-(--second-color)">Інструкція (6) операцій</p>
            <ul className="flex flex-col gap-2 mt-2">
               <ListItem isActive={true} index={1} name="Пайка" />
               <ListItem isActive={false} index={2} name="Тестування" />
               <ListItem isActive={false} index={3} name="Установка компонентів" />
               <ListItem isActive={false} index={4} name="Програмування" />
               <ListItem isActive={false} index={5} name="Фінальне тестування" />
               <ListItem isActive={false} index={6} name="Пакування" />
            </ul>
         </div>
         <div className="flex flex-col gap-(--components-gap) ibm-plex-sans border border-(--stroke-color) rounded-lg px-(--components-py) py-(--components-py) flex-1">
            <div className="flex flex-col gap-1">
               <h2 className="text-white text-xl font-semibold">1. Пайка</h2>
               <p className="text-(--second-color)">
                  Паяльна операція - встановлення SMD компонентів на плату методом оплавлення.
               </p>
            </div>

            <div className="flex flex-col gap-(--components-gap)">
               <div className="flex gap-(--components-gap)">
                  <div className="flex flex-col gap-3 flex-1">
                     <h3 className="text-white font-semibold">Параметри операції</h3>
                     <div className="flex flex-col gap-2.5">
                        {parameters.map(param => (
                           <div key={param.label} className="flex gap-2">
                              <span className="text-(--second-color) w-36 shrink-0">{param.label}</span>
                              <span className="text-white font-medium">{param.value}</span>
                           </div>
                        ))}
                     </div>
                  </div>

                  <div className="flex flex-col gap-3 flex-1">
                     <h3 className="text-white font-semibold">Інструкція виконання</h3>
                     <div className="flex flex-col gap-2.5">
                        {instructions.map((step, index) => (
                           <div key={index} className="flex gap-2">
                              <span className="text-(--second-color) shrink-0">{index + 1}.</span>
                              <span className="text-(--second-color)">{step}</span>
                           </div>
                        ))}
                     </div>
                  </div>
               </div>

               <div className="flex flex-col gap-3">
                  <h3 className="text-white font-semibold">Контрольні точки</h3>
                  <div className="flex gap-2 flex-wrap">
                     {checkpoints.map(point => (
                        <span
                           key={point}
                           className="text-(--accent-color) bg-(--accent-trans-color) border border-(--accent-color) rounded-md px-3 py-1 text-sm font-medium"
                        >
                           {point}
                        </span>
                     ))}
                  </div>
               </div>
            </div>
         </div>
      </main>
   )
}

const EASE_OPEN = "cubic-bezier(0.16, 1, 0.3, 1)"
const EASE_CLOSE = "cubic-bezier(0.4, 0, 0.2, 1)"
const GAP_PX = 16 // те саме значення, що й gap-4 / --components-gap: 16px

export function TypeElement() {
   const [isOpen, setIsOpen] = useState(false)
   const [shouldRender, setShouldRender] = useState(false)

   const clipRef = useRef<HTMLDivElement>(null)
   const innerRef = useRef<HTMLDivElement>(null)
   const chevronRef = useRef<HTMLDivElement>(null)

   const switchOpen = () => setIsOpen(prev => !prev)

   // ВІДКРИТТЯ
   useLayoutEffect(() => {
      if (isOpen) {
         setShouldRender(true)
      }
   }, [isOpen])

   useLayoutEffect(() => {
      if (!isOpen || !shouldRender) return

      const clipEl = clipRef.current
      const innerEl = innerRef.current
      if (!clipEl || !innerEl) return

      gsap.killTweensOf([clipEl, innerEl])

      gsap.set(clipEl, { height: 0, marginTop: 0, overflow: "hidden" })
      gsap.set(innerEl, { opacity: 0, y: -8 })

      const targetHeight = innerEl.scrollHeight

      const tl = gsap.timeline({
         defaults: { ease: EASE_OPEN },
         onComplete: () => {
            gsap.set(clipEl, { height: "auto", overflow: "visible" })
         },
      })

      // marginTop і height анімуються РАЗОМ — простір під header'ом
      // росте синхронно з висотою контенту, без "прихованого" gap
      tl.to(clipEl, { height: targetHeight, marginTop: GAP_PX, duration: 0.6 }, 0).to(
         innerEl,
         { opacity: 1, y: 0, duration: 0.45 },
         0.05,
      )

      return () => {
         tl.kill()
      }
   }, [isOpen, shouldRender])

   // ЗАКРИТТЯ
   useLayoutEffect(() => {
      if (isOpen || !shouldRender) return

      const clipEl = clipRef.current
      const innerEl = innerRef.current
      if (!clipEl || !innerEl) return

      gsap.killTweensOf([clipEl, innerEl])

      const currentHeight = clipEl.getBoundingClientRect().height
      gsap.set(clipEl, { height: currentHeight, overflow: "hidden" })

      const tl = gsap.timeline({
         defaults: { ease: EASE_CLOSE },
         onComplete: () => setShouldRender(false),
      })

      // marginTop доходить до 0 РАЗОМ з height — на момент unmount
      // реальний зайнятий простір уже точно дорівнює нулю
      tl.to(innerEl, { opacity: 0, y: -8, duration: 0.3 }, 0).to(
         clipEl,
         { height: 0, marginTop: 0, duration: 0.4 },
         0.05,
      )

      return () => {
         tl.kill()
      }
   }, [isOpen, shouldRender])

   useLayoutEffect(() => {
      const el = chevronRef.current
      if (!el) return

      gsap.to(el, {
         rotate: isOpen ? 180 : 0,
         duration: 0.5,
         ease: EASE_OPEN,
      })
   }, [isOpen])

   return (
      // gap-4 прибрано з батька — тепер відступ повністю контролює marginTop на clipRef
      <div className="flex flex-col bg-(--bg-trans-color) border-(--stroke-color) border py-(--components-py) px-(--components-py) rounded-lg ibm-plex-sans cursor-pointer">
         <header className="flex flex-1 justify-between h-20 items-center" onClick={switchOpen}>
            <div className="flex gap-4 h-20">
               <img src={product} className="h-full w-auto rounded-lg object-contain" />
               <div className="flex flex-col gap-1">
                  <h2 className={titleClassName}>Плата керування V5</h2>
                  <p className="text-(--second-color)">Модуль керування</p>
               </div>
            </div>
            <div ref={chevronRef}>
               <ChevronDownIcon className="size-7" strokeWidth={1.5} />
            </div>
         </header>

         {shouldRender && (
            <div ref={clipRef} style={{ height: 0, marginTop: 0, overflow: "hidden" }}>
               <div ref={innerRef}>
                  <Content />
               </div>
            </div>
         )}
      </div>
   )
}
