import { useState, FormEvent } from "react";
import Logo from "../assets/icons/Logo";
import CustomButton from "../components/CustomButton";
import CustomTextField from "../components/CustomTextField";
import EyeIcon from "../assets/icons/EyeIcon";
import EyeClosedIcon from "../assets/icons/EyeClosedIcon";
import { Link, useNavigate } from "react-router-dom";
import { authService } from "../services/auth";
import toast from "react-hot-toast";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [isLoading, setIsLoading] = useState(false);


  async function onSubmit(e: FormEvent) {
    e.preventDefault();
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
        toast.success("¡Inicio de sesión exitoso!");
        navigate('/home');
      } catch (error) {
        if (error instanceof Error) {
          toast.error(error.message);
        } else {
          toast.error('Error de autenticación');
        }
      } finally {
        setIsLoading(false);
      }
    } else {
      toast.error("Por favor, siga las instrucciones del formulario");
    }
  }

  return (
    <div className="min-h-screen flex items-center p-8 bg-white">
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
              }}
              error={Boolean(errors.email)}
              helperText={errors.email}
            />

            <div className="flex flex-col gap-2">
              <CustomTextField
                label="Contraseña"
                placeholder="Ingrese su contraseña"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                }}
                error={Boolean(errors.password)}
                helperText={errors.password}
                rightIcon={showPassword ? <EyeIcon /> : <EyeClosedIcon />}
                onRightIconClick={() => setShowPassword(prev => !prev)}
              />
              <p className="text-body2 text-gray-600 text-left">
                ¿Olvidaste tu contraseña?{" "}
                <Link
                  to="/forgot-password"
                  className="text-label-bold text-gray-500 underline underline-offset-2">
                  Recuperarla
                </Link>
              </p>
            </div>
            <CustomButton type="submit" fullWidth loading={isLoading} className="text-body1 py-2 h-14">
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