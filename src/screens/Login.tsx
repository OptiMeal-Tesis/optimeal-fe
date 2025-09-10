import { useState, FormEvent, useEffect } from "react";
import Logo from "../assets/icons/Logo";
import CustomButton from "../components/CustomButton";
import CustomTextField from "../components/CustomTextField";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { authService } from "../services/auth";

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  // Show success message from registration
  useEffect(() => {
    if (location.state?.message) {
      // You could show a success message here if needed
    }
  }, [location.state]);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setApiError(null);
    const next: typeof errors = {};
    
    if (!email.trim()) next.email = "El email es obligatorio";
    if (!password.trim()) next.password = "La contraseña es obligatoria";
    
    // Validación de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (email && !emailRegex.test(email)) {
      next.email = "Ingrese un email válido";
    }
    
    setErrors(next);
    if (Object.keys(next).length === 0) {
      setIsLoading(true);
      try {
        await authService.login({ email, password });
        // Login successful, redirect to dashboard or home
        navigate('/dashboard'); // or wherever you want to redirect after login
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Error de autenticación';
        setApiError(errorMessage);
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
          {apiError && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
              {apiError}
            </div>
          )}

          {location.state?.message && (
            <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded">
              {location.state.message}
            </div>
          )}

            <CustomTextField
              label="Email"
              placeholder="Ingrese su email institucional"
              type="email"
              autoComplete="email"
              value={email}
              aria-label="Email address"
              onChange={(e) => setEmail(e.target.value)}
              error={Boolean(errors.email)}
              helperText={errors.email}
            />

            <CustomTextField
              label="Contraseña"
              placeholder="Ingrese su contraseña"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              error={Boolean(errors.password)}
              helperText={errors.password}
            />

            <CustomButton type="submit" fullWidth disabled={isLoading}>
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