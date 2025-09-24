import { useState, FormEvent } from "react";
import Logo from "../assets/icons/Logo";
import CustomButton from "../components/CustomButton";
import CustomTextField from "../components/CustomTextField";
import { Link, useNavigate } from "react-router-dom";
import { authService } from "../services/auth";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);


  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setApiError(null);
    const next: typeof errors = {};
    
    if (!email.trim()) {
      next.email = "El email es obligatorio";
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        next.email = "Formato de email inválido";
      }
    }
    
    if (!password.trim()) {
      next.password = "La contraseña es requerida";
    }
    
    setErrors(next);
    if (Object.keys(next).length === 0) {
      setIsLoading(true);
      try {
        await authService.login({ email, password });
        // Login successful, redirect to home
        navigate('/home');
      } catch (error) {
        if (error instanceof Error) {
          const errorMessage = error.message.toLowerCase();
          // Check if it's a password-related error
          if (errorMessage.includes('contraseña') && errorMessage.includes('requisitos de seguridad')) {
            setApiError(error.message);
          } else if (errorMessage.includes('credenciales inválidas') || errorMessage.includes('usuario no confirmado')) {
            setApiError(error.message);
          } else {
            setApiError(error.message);
          }
        } else {
          setApiError('Error de autenticación');
        }
      } finally {
        setIsLoading(false);
      }
    }
  }

  return (
    <div className="min-h-screen flex items-center p-8">
      <div className="w-full flex flex-col gap-8 text-center">
        <div className="flex justify-center">
          <Logo width={222} height={74}/>
        </div>

        <p className="text-sub1">Iniciar Sesión</p>

        <form className="w-full flex flex-col gap-7" onSubmit={onSubmit} noValidate>
            <CustomTextField
              label="Email"
              placeholder="Ingrese su email institucional"
              type="email"
              autoComplete="email"
              value={email}
              aria-label="Email address"
              onChange={(e) => {
                setEmail(e.target.value);
                if (apiError) setApiError(null);
              }}
              error={Boolean(errors.email)}
              helperText={errors.email}
            />

            <CustomTextField
              label="Contraseña"
              placeholder="Ingrese su contraseña"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (apiError) setApiError(null);
              }}
              error={Boolean(errors.password || apiError)}
              helperText={errors.password || apiError}
            />

            <CustomButton type="submit" fullWidth disabled={isLoading} className="text-body1 py-2">
              {isLoading ? 'Iniciando sesión...' : 'Iniciar'}
            </CustomButton>
        </form>

        <p className="text-body2 text-gray-600">
          ¿No te has registrado aún?{" "}
          <Link
            to="/register"
            className="text-label-bold text-gray-500 underline underline-offset-2">
            Crear cuenta
          </Link>
        </p>
      </div>
    </div>
  );
}