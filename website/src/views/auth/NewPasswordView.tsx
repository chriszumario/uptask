import NewPasswordToken from "@/components/auth/NewPasswordToken"
import NewPasswordForm from "@/components/auth/NewPasswordForm"
import { useState } from "react"
import { ConfirmToken } from "@/types/index"

export default function NewPasswordView() {
    const [token, setToken] = useState<ConfirmToken['token']>('')
    const [isValidToken, setIsValidToken] = useState(false)

    return (
        <>
            <div className="text-center space-y-3">
                <h1 className="text-4xl font-bold bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
                    Restablecer Contraseña
                </h1>
                <p className="text-gray-400">Ingresa el código que recibiste {''}
                    <span className=" text-emerald-500 font-bold"> en tu correo electrónico</span></p>
            </div>

            {!isValidToken ?
                <NewPasswordToken token={token} setToken={setToken} setIsValidToken={setIsValidToken} /> :
                <NewPasswordForm token={token} />
            }
        </>
    )
}
