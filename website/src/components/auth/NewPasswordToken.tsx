import { Link } from 'react-router-dom';
import { PinInput, PinInputField } from '@chakra-ui/pin-input';
import { useMutation } from '@tanstack/react-query'
import { ConfirmToken } from '@/types/index';
import { validateToken } from '@/services/auth.service';
import { toast } from 'react-toastify';

type NewPasswordTokenProps = {
    token: ConfirmToken['token']
    setToken: React.Dispatch<React.SetStateAction<string>>
    setIsValidToken: React.Dispatch<React.SetStateAction<boolean>>
}

export default function NewPasswordToken({ token, setToken, setIsValidToken }: NewPasswordTokenProps) {

    const { mutate } = useMutation({
        mutationFn: validateToken,
        onError: (error) => {
            toast.error(error.message)
        },
        onSuccess: (data) => {
            toast.success(data.message)
            setIsValidToken(true)
        }
    })

    const handleChange = (token: ConfirmToken['token']) => {
        setToken(token)
    }

    const handleComplete = (token: ConfirmToken['token']) => mutate({ token })

    return (
        <>
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
                    to='/auth/forgot-password' className="text-emerald-500 hover:text-emerald-300 font-medium">
                    Solicitar un nuevo código
                </Link>
            </div>
        </>
    )
}