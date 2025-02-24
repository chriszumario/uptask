import { useState } from "react";
import { Link } from "react-router-dom";
import { PinInput, PinInputField } from '@chakra-ui/pin-input'
import { useMutation } from '@tanstack/react-query'
import { ConfirmToken } from "@/types/index";
import { confirmAccount } from "@/services/auth.service";
import { toast } from "react-toastify";

export default function ConfirmAccountView() {
    const [token, setToken] = useState<ConfirmToken['token']>('')

    const { mutate } = useMutation({
        mutationFn: confirmAccount,
        onError: (error) => {
            toast.error(error.message)
        },
        onSuccess: (data) => {
            toast.success(data.message)
        }
    })

    const handleChange = (token: ConfirmToken['token']) => {
        setToken(token)
    }

    const handleComplete = (token: ConfirmToken['token']) => mutate({ token })

    return (
        <>
            <div className="text-center space-y-3">
                <h1 className="text-4xl font-bold bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
                    Confirma tu Cuenta
                </h1>
                <p className="text-gray-400">Ingresa el código que recibiste {''}
                    <span className=" text-emerald-500 font-bold"> en tu correo electrónico</span></p>
            </div>

            <form className="space-y-6" noValidate>
                <div className="space-y-2">
                    <label htmlFor="email" className="text-sm font-medium text-gray-300 block">
                        Código de 6 dígitos
                    </label>
                    <div className="flex justify-center gap-5">
                        <PinInput value={token} onChange={handleChange} onComplete={handleComplete}>
                            <PinInputField className="w-10 h-10 p-3 rounded-lg border-gray-300 border placeholder-white" />
                            <PinInputField className="w-10 h-10 p-3 rounded-lg border-gray-300 border placeholder-white" />
                            <PinInputField className="w-10 h-10 p-3 rounded-lg border-gray-300 border placeholder-white" />
                            <PinInputField className="w-10 h-10 p-3 rounded-lg border-gray-300 border placeholder-white" />
                            <PinInputField className="w-10 h-10 p-3 rounded-lg border-gray-300 border placeholder-white" />
                            <PinInputField className="w-10 h-10 p-3 rounded-lg border-gray-300 border placeholder-white" />
                        </PinInput>
                    </div>
                </div>


            </form>

            <div className="text-center text-gray-400">
                ¿No tines el código {' '}
                <Link
                    to='/auth/request-code' className="text-emerald-500 hover:text-emerald-300 font-medium">
                    Solicitar un nuevo código
                </Link>
            </div>
        </>
    )
}