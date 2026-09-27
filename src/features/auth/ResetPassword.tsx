import { useForm, type SubmitHandler } from "react-hook-form"
import { Link, useSearchParams } from "react-router"
import { isAxiosError } from "axios"
import { MailIcon, LockKeyholeIcon } from "lucide-react"

import Button from "@/components/UI/Button"
import { Input } from "@/components/UI/Input"
import { ParagraphError } from "@/components/UI/ParagraphError"
import { useForgotPassword } from "@/hooks/api/auth/useForgotPassword"
import { useResetPassword } from "@/hooks/api/auth/useResetPassword"

interface ForgotPasswordForm {
   email: string
}

function ForgotPasswordCard() {
   const {
      register,
      handleSubmit,
      formState: { errors },
   } = useForm<ForgotPasswordForm>({ mode: "onSubmit" })

   const { mutate: doForgotPassword, isPending, isSuccess, error } = useForgotPassword()

   const onSubmit: SubmitHandler<ForgotPasswordForm> = data => {
      doForgotPassword(data.email)
   }

   // fastapi-users завжди повертає 202, навіть якщо email не знайдено — щоб не палити,
   // які email існують у системі; тому показуємо той самий успіх у будь-якому разі
   if (isSuccess) {
      return (
         <div className="flex flex-col gap-3 text-center">
            <h2 className="text-xl font-medium">Перевірте пошту</h2>
            <p className="text-(--second-color)">
               Якщо такий email зареєстровано в системі, на нього надіслано посилання для встановлення пароля.
            </p>
            <Link to="/login" className="text-(--accent-color) underline mt-2">
               Повернутись до входу
            </Link>
         </div>
      )
   }

   const errorMessage = isAxiosError(error) ? "Не вдалося надіслати лист. Спробуйте пізніше." : null

   return (
      <>
         <h2 className="text-xl font-medium mx-auto mb-5">Відновлення пароля</h2>
         <form className="flex flex-col gap-2" onSubmit={handleSubmit(onSubmit)}>
            <Input
               hasError={errors.email !== undefined}
               type="email"
               label="Електронна пошта"
               placeholder="your@gmail.com"
               Icon={MailIcon}
               {...register("email", {
                  required: "Це поле обов'язкове!",
                  pattern: {
                     value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i,
                     message: "Некоректна пошта!",
                  },
               })}
            />
            {errors.email && <ParagraphError>{errors.email.message}</ParagraphError>}
            {errorMessage && <ParagraphError>{errorMessage}</ParagraphError>}
            <Button type="accentFilled" className="gap-2 mt-4 justify-center py-3 h-11" isSubmit={true}>
               <Button.Paragraph className="font-medium">
                  {isPending ? "Надсилання..." : "Надіслати посилання"}
               </Button.Paragraph>
            </Button>
            <Link to="/login" className="text-(--accent-color) underline text-center mt-2">
               Повернутись до входу
            </Link>
         </form>
      </>
   )
}

interface SetPasswordForm {
   password: string
   confirmPassword: string
}

function SetPasswordCard({ token }: { token: string }) {
   const {
      register,
      handleSubmit,
      watch,
      formState: { errors },
   } = useForm<SetPasswordForm>({ mode: "onSubmit" })

   const { mutate: doResetPassword, isPending, error } = useResetPassword()

   const onSubmit: SubmitHandler<SetPasswordForm> = data => {
      doResetPassword({ token, password: data.password })
   }

   const errorMessage = isAxiosError(error)
      ? error.response?.data?.detail === "RESET_PASSWORD_BAD_TOKEN"
         ? "Посилання недійсне або прострочене. Запросіть нове."
         : "Не вдалося встановити пароль"
      : null

   return (
      <>
         <h2 className="text-xl font-medium mx-auto mb-5">Встановлення пароля</h2>
         <form className="flex flex-col gap-2" onSubmit={handleSubmit(onSubmit)}>
            <Input
               hasError={errors.password !== undefined}
               type="password"
               label="Новий пароль"
               Icon={LockKeyholeIcon}
               {...register("password", {
                  required: "Це поле обов'язкове!",
                  minLength: { value: 6, message: "Пароль має містити мінімум 6 символів" },
                  maxLength: { value: 30, message: "Пароль має містити максимум 30 символів" },
               })}
            />
            {errors.password && <ParagraphError>{errors.password.message}</ParagraphError>}

            <Input
               hasError={errors.confirmPassword !== undefined}
               type="password"
               label="Підтвердіть пароль"
               Icon={LockKeyholeIcon}
               {...register("confirmPassword", {
                  required: "Це поле обов'язкове!",
                  validate: value => value === watch("password") || "Паролі не збігаються",
               })}
            />
            {errors.confirmPassword && <ParagraphError>{errors.confirmPassword.message}</ParagraphError>}

            {errorMessage && <ParagraphError>{errorMessage}</ParagraphError>}

            <Button type="accentFilled" className="gap-2 mt-4 justify-center py-3 h-11" isSubmit={true}>
               <Button.Paragraph className="font-medium">
                  {isPending ? "Збереження..." : "Встановити пароль"}
               </Button.Paragraph>
            </Button>
         </form>
      </>
   )
}

export function ResetPassword() {
   const [searchParams] = useSearchParams()
   const token = searchParams.get("token")

   return (
      <div className="flex justify-center items-center flex-1">
         <div className="flex m-auto w-100 rounded-xl bg-(--bg-trans-color) border-(--stroke-color) border flex-col px-5 py-5">
            {token ? <SetPasswordCard token={token} /> : <ForgotPasswordCard />}
         </div>
      </div>
   )
}
