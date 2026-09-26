import type { ProfileRead } from "@/api/types/profile"
import avatar from "@/assets/images/avatar.png"
import { titleClassName } from "@/utils/classNames"
import { formatDate, formatTenure } from "@/utils/time"

interface ListItemProps {
   label: string
   value: string | number | null
}

function ListItem({ label, value }: ListItemProps) {
   return (
      <li className="flex justify-between">
         <p className="text-(--second-color) text-base">{label}</p>
         <p className="text-white font-medium text-base text-right">{value ?? "—"}</p>
      </li>
   )
}

interface InfoProps {
   profile: ProfileRead
}

export function Info({ profile }: InfoProps) {
   return (
      <div
         className="flex flex-col ibm-plex-sans bg-(--bg-trans-color) border border-(--stroke-color) rounded-xl py-(--components-py) px-(--components-py) gap-2"
         style={{ gridArea: "info" }}
      >
         <div
            className="aspect-square size-56 self-center bg-center bg-cover bg-no-repeat rounded-full"
            style={{ backgroundImage: `url(${profile.avatar_url ?? avatar})` }}
         ></div>
         <h1 className="text-white text-3xl font-semibold self-center">
            {profile.first_name} {profile.last_name} {profile.middle_name}
         </h1>
         <p className="text-(--second-color)">
            Відповідальний та досвідчений оператор верстатів. Спеціалізується на обробці складних деталей з високими
            вимогами до точності. Дотримується стандартів якості та техніки безпеки.
         </p>
         <h2 className={`${titleClassName} mt-auto`}>Контактна інформація</h2>
         <ul className="flex flex-col gap-1">
            <ListItem label="Телефон" value={profile.phone} />
            <ListItem label="Пошта" value={profile.email} />
         </ul>
         <h2 className={`${titleClassName} mt-2`}>Інформація про працівника</h2>
         <ul className="flex flex-col gap-1">
            <ListItem label="Серійний номер" value={profile.code} />
            <ListItem label="Посада" value={profile.position} />
            <ListItem label="Акаунт створено" value={formatDate(profile.created_at)} />
            {profile.shift !== null && <ListItem label="Графік роботи" value={profile.shift.name} />}
            <ListItem label="У системі" value={formatTenure(profile.created_at)} />
            <ListItem label="Кількість балів" value={profile.points} />
         </ul>
      </div>
   )
}
