import { AuthComponent } from "./components/AuthComponent"

export function Login() {
   return (
      <div className="flex justify-center items-center flex-1">
         <AuthComponent title="Вхід в систему" />
      </div>
   )
}
