import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useMutation } from '@tanstack/react-query'
import { RequestConfirmationCodeForm } from "../../types";
import ErrorMessage from "@/components/ErrorMessage";
import { requestConfirmationCode } from "@/services/auth.service";
import { toast } from "react-toastify";

export default function RegisterView() {
    const initialValues: RequestConfirmationCodeForm = {
        email: ''
    }

    const { register, handleSubmit, formState: { errors } } = useForm({ defaultValues: initialValues });

    const { mutate } = useMutation({
        mutationFn: requestConfirmationCode,
        onError: (error) => {
            toast.error(error.message)
        },
        onSuccess: (data) => {
            toast.success(data.message)
        }
    })

    const handleRequestCode = (formData: RequestConfirmationCodeForm) => mutate(formData)

    return (
        <>
            <div className="text-center space-y-3">
                <h1 className="text-4xl font-bold bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
                    Solicitar código de confirmación
                </h1>
                <p className="text-gray-400">Ingrese tu correo electrónico para recibir{''}
                    <span className=" text-emerald-500 font-bold"> un nuevo código</span></p>
            </div>

            <form onSubmit={handleSubmit(handleRequestCode)} className="space-y-6" noValidate>
                <div className="space-y-2">
                    <label htmlFor="email" className="text-sm font-medium text-gray-300 block">
                        Correo Electrónico
                    </label>
                    <input
                        id="email"
                        type="email"
                        {...register('email', {
                            required: 'El correo electrónico es requerido',
                            pattern: {
                                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                message: 'Dirección de correo electrónico no válida',
                            },
                        })}
                        className="w-full px-4 py-3 rounded-xl border border-gray-700 bg-gray-800/50 text-gray-100 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors placeholder-gray-500"
                        placeholder="name@example.com"
                    />
                    {errors.email && (
                        <ErrorMessage>{errors.email.message}</ErrorMessage>
                    )}
                </div>

                <button
                    type="submit"
                    className="w-full bg-gradient-to-r from-emerald-400 to-cyan-400 text-gray-900 py-3 px-4 rounded-xl hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 focus:ring-offset-gray-900 transition-all duration-150 font-medium shadow-lg shadow-emerald-500/20"
                >
                    Enviar Código
                </button>
            </form>

            <div className="text-center text-gray-400">
                ¿Ya tienes cuenta? {' '}
                <Link
                    to={'/auth/login'} className="text-emerald-500 hover:text-emerald-300 font-medium">
                    Iniciar Sesión
                </Link>
            </div>
        </>
    )
}