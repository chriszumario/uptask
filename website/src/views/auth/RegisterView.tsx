import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import { useMutation } from '@tanstack/react-query'
import { UserRegistrationForm } from "@/types/index";
import ErrorMessage from "@/components/ErrorMessage";
import { createAccount } from "@/services/auth.service";
import { toast } from "react-toastify";
import { useState } from "react";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/20/solid";

export default function RegisterView() {

  const [showPassword, setShowPassword] = useState(false);
  const initialValues: UserRegistrationForm = {
    name: '',
    email: '',
    password: '',
    password_confirmation: '',
  }

  const { register, handleSubmit, watch, reset, formState: { errors } } = useForm<UserRegistrationForm>({ defaultValues: initialValues });

  const { mutate } = useMutation({
    mutationFn: createAccount,
    onError: (error) => {
      toast.error(error.message)
    },
    onSuccess: (data) => {
      toast.success(data.message)
      reset()
    }
  })

  const password = watch('password');

  const handleRegister = (formData: UserRegistrationForm) => mutate(formData)

  return (
    <>
      <div className="text-center space-y-3">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
          Crear Cuenta
        </h1>
        <p className="text-gray-400">Llena el formulario para {''}
          <span className=" text-emerald-500 font-bold"> crear tu cuenta</span></p>
      </div>

      <form onSubmit={handleSubmit(handleRegister)} className="space-y-6" noValidate>
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
          <label htmlFor="name" className="text-sm font-medium text-gray-300 block">
            Nombre
          </label>
          <input
            id="name"
            type="name"
            {...register('name', {
              required: 'El nombre de usuario es requerido',
            })}
            className="w-full px-4 py-3 rounded-xl border border-gray-700 bg-gray-800/50 text-gray-100 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors placeholder-gray-500"
            placeholder="Dancing Panda"
          />
          {errors.name && (
            <ErrorMessage>{errors.name.message}</ErrorMessage>
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

        <div className="space-y-2">
          <label htmlFor="password_confirmation" className="text-sm font-medium text-gray-300 block">
            Confirmar Contraseña
          </label>
          <div className="relative">
            <input
              id="password_confirmation"
              type={showPassword ? 'text' : 'password'}
              {...register('password_confirmation', {
                required: 'La confirmación de la contraseña es requerida',
                validate: value => value === password || 'Los Passwords no son iguales'
              })}
              className="w-full px-4 py-3 rounded-xl border border-gray-700 bg-gray-800/50 text-gray-100 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors placeholder-gray-500"
              placeholder="********"
            />
          </div>
          {errors.password_confirmation && (
            <ErrorMessage>{errors.password_confirmation.message}</ErrorMessage>
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
          Crear Cuenta
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