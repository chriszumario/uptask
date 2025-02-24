import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { useMutation } from '@tanstack/react-query'
import { UserLoginForm } from "@/types/index";
import ErrorMessage from "@/components/ErrorMessage";
import { authenticateUser } from "@/services/auth.service";
import { toast } from "react-toastify";
import { useState } from "react";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/20/solid";

export default function LoginView() {

  const [showPassword, setShowPassword] = useState(false);
  const initialValues: UserLoginForm = {
    email: '',
    password: '',
  }
  const { register, handleSubmit, formState: { errors } } = useForm({ defaultValues: initialValues })
  const navigate = useNavigate()

  const { mutate } = useMutation({
    mutationFn: authenticateUser,
    onError: (error) => {
      toast.error(error.message)
    },
    onSuccess: () => {
      navigate('/')
    }
  })

  const handleLogin = (formData: UserLoginForm) => mutate(formData)

  return (
    <>
      <div className="text-center space-y-3">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
          Iniciar Sesión
        </h1>
        <p className="text-gray-400">Inicie sesión en su cuenta para continuar</p>
      </div>

      <form onSubmit={handleSubmit(handleLogin)} className="space-y-6" noValidate>
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

        <div className="space-y-2">
          <label htmlFor="password" className="text-sm font-medium text-gray-300 block">
            Contraseña
          </label>
          <div className="relative">
            <input
              id="password"
              type={showPassword ? 'text' : 'password'}
              {...register('password', {
                required: 'La contraseña es requerida',
                minLength: {
                  value: 6,
                  message: 'La contraseña debe tener al menos 6 caracteres',
                },
              })}
              className="w-full px-4 py-3 rounded-xl border border-gray-700 bg-gray-800/50 text-gray-100 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors placeholder-gray-500"
              placeholder="********"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-300"
            >
              {showPassword ? (
                <EyeSlashIcon className="h-5 w-5" />
              ) : (
                <EyeIcon className="h-5 w-5" />
              )}
            </button>
          </div>
          {errors.password && (
            <ErrorMessage>{errors.password.message}</ErrorMessage>
          )}
        </div>

        <div className="flex items-center justify-between text-sm">
          <Link
            to={'/auth/forgot-password'} className="text-emerald-500 hover:text-emerald-300 font-medium">
            Olvidaste tu contraseña?
          </Link>
        </div>

        <button
          type="submit"
          className="w-full bg-gradient-to-r from-emerald-400 to-cyan-400 text-gray-900 py-3 px-4 rounded-xl hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 focus:ring-offset-gray-900 transition-all duration-150 font-medium shadow-lg shadow-emerald-500/20"
        >
          Iniciar Sesión
        </button>
      </form>

      <div className="text-center text-gray-400">
        ¿No tienes una cuenta?{' '}
        <Link
          to={'/auth/register'} className="text-emerald-500 hover:text-emerald-300 font-medium">
          Regístrate
        </Link>
      </div>
    </>
  )
}