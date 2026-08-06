import avatar from "@/assets/images/avatar.jpg"
import { titleClassName } from "@/utils/classNames"

interface ListItemProps {
   label: string
   value: string | null
}

function ListItem({ label, value }: ListItemProps) {
   return (
      <li className="flex justify-between">
         <p className="text-(--second-color) text-base">{label}</p>
         <p className="text-white font-medium text-base text-right">{value ?? "—"}</p>
      </li>
   )
}

export function Info() {
   return (
      <div
         className="flex flex-col ibm-plex-sans bg-(--bg-trans-color) border border-(--stroke-color) rounded-xl py-(--components-py) px-(--components-py) gap-2"
         style={{ gridArea: "info" }}
      >
         <div
            className="aspect-square size-56 self-center bg-center bg-cover bg-no-repeat rounded-full"
            style={{ backgroundImage: `url(${avatar})` }}
         ></div>
         <h1 className="text-white text-3xl font-semibold self-center">Іван Савченко</h1>
         <p className="text-(--second-color)">
            Відповідальний та досвідчений оператор верстатів. Спеціалізується на обробці складних деталей з високими
            вимогами до точності. Дотримується стандартів якості та техніки безпеки.
         </p>
         <h2 className={`${titleClassName} mt-auto`}>Контактна інформація</h2>
         <ul className="flex flex-col gap-1">
            <ListItem label="Телефон" value="+38 (067) 1234 45 67" />
            <ListItem label="Пошта" value="example@gmail.com" />
         </ul>
         <h2 className={`${titleClassName} mt-2`}>Інформація про працівника</h2>
         <ul className="flex flex-col gap-1">
            <ListItem label="Серійний номер" value="EMP-2026" />
            <ListItem label="Посада" value="Оператор верстату" />
            <ListItem label="Статус" value="На зміні" />
            <ListItem label="Графік роботи" value="Денна зміна" />
            <ListItem label="Керівник" value="Шевченко Тарас" />
            <ListItem label="Стаж" value="2 роки" />
         </ul>
      </div>
   )
}
