import Button from "@/components/UI/Button"
import { Input } from "@/components/UI/Input"
import { ParagraphError } from "@/components/UI/ParagraphError"
import { login } from "@/api/endpoints/auth"
import { LockKeyholeOpen } from "lucide-react"
import { useForm } from "react-hook-form"

interface IForm {
   email: string
   password: string
}

interface Props {
   title: string
}

function onSubmit({ email, password }: IForm) {
   login(email, password)
}

export function AuthComponent({ title }: Props) {
   const {
      register,
      handleSubmit,
      formState: { errors },
   } = useForm<IForm>({ mode: "onSubmit" })
   return (
      <div className="flex m-auto w-100 rounded-xl bg-(--bg-trans-color) border-(--stroke-color) border flex-col px-5 py-5">
         <h2 className="text-xl font-medium mx-auto mb-5">{title}</h2>
         <form className="flex flex-col gap-2" onSubmit={handleSubmit(onSubmit)}>
            <Input
               type="email"
               label="Електронна пошта"
               placeholder="your@gmail.com"
               {...register("email", {
                  required: "Це поле обов'язкове!",
                  pattern: {
                     value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i,
                     message: "Некоректна пошта!",
                  },
               })}
            />
            {errors.email && <ParagraphError>{errors.email.message}</ParagraphError>}
            <Input
               type="password"
               label="Пароль"
               {...register("password", {
                  required: "Це поле обов'язкове!",
                  minLength: {
                     value: 5,
                     message: "Пароль має містити мінімум 6 символів",
                  },
                  maxLength: {
                     value: 30,
                     message: "Пароль має містити максимум 30 символів",
                  },
               })}
            />
            {errors.password && <ParagraphError>{errors.password.message}</ParagraphError>}
            <Button type="accentFilled" className="gap-2 mt-4 justify-center py-3 h-11" isSubmit={true}>
               <Button.Icon Icon={LockKeyholeOpen} strokeWidth={1.5} className="size-5" />
               <Button.Paragraph className="font-medium">Увійти</Button.Paragraph>
            </Button>
         </form>
      </div>
   )
}
