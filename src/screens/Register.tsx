import { useState, FormEvent, useEffect } from "react";
import Logo from "../assets/icons/Logo";
import CustomButton from "../components/CustomButton";
import CustomTextField from "../components/CustomTextField";
import { Link, useNavigate } from "react-router-dom";
import { authService } from "../services/auth";

export default function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    national_id: "",
    email: "",
    password: "",
    confirmPassword: ""
  });
  
  const [errors, setErrors] = useState<{
    name?: string;
    national_id?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
  }>({});

  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setApiError(null);
    const next: typeof errors = {};
    
    // Validaciones
    if (!formData.name.trim()) next.name = "El nombre es obligatorio";
    if (!formData.national_id.trim()) next.national_id = "El DNI es obligatorio";
    if (!formData.email.trim()) next.email = "El email es obligatorio";
    if (!formData.password.trim()) next.password = "La contraseña es obligatoria";
    if (!formData.confirmPassword.trim()) next.confirmPassword = "Confirmar contraseña es obligatorio";
    
    // Validación de contraseñas coincidentes
    if (formData.password && formData.confirmPassword && formData.password !== formData.confirmPassword) {
      next.confirmPassword = "Las contraseñas no coinciden";
    }
    
    // Validación de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (formData.email && !emailRegex.test(formData.email)) {
      next.email = "Ingrese un email válido";
    }
    
    setErrors(next);
    if (Object.keys(next).length === 0) {
      setIsLoading(true);
      try {
        await authService.register({
          name: formData.name,
          national_id: formData.national_id,
          email: formData.email,
          password: formData.password
        });
        // Registration successful, redirect to login
        navigate('/login', { 
          state: { message: 'Cuenta creada exitosamente. Por favor inicia sesión.' }
        });
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Error al crear la cuenta';
        setApiError(errorMessage);
      } finally {
        setIsLoading(false);
      }
    }
  }

  function handleInputChange(field: keyof typeof formData) {
    return (e: React.ChangeEvent<HTMLInputElement>) => {
      setFormData(prev => ({ ...prev, [field]: e.target.value }));
      // Limpiar error cuando el usuario empiece a escribir
      if (errors[field]) {
        setErrors(prev => ({ ...prev, [field]: undefined }));
      }
    };
  }

  return (
    <div className="min-h-screen flex items-center p-8">
      <div className="w-full flex flex-col gap-8 text-center">
        <div className="flex justify-center">
          <Logo width={222} height={74}/>
        </div>

        <p className="text-sub1">Crear Cuenta</p>

        <form className="w-full flex flex-col gap-7" onSubmit={onSubmit} noValidate>
          {apiError && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
              {apiError}
            </div>
          )}

          <CustomTextField
            label="Nombre"
            placeholder="Ingrese su nombre completo"
            type="text"
            autoComplete="name"
            value={formData.name}
            onChange={handleInputChange('name')}
            error={Boolean(errors.name)}
            helperText={errors.name}
          />

          <CustomTextField
            label="DNI"
            placeholder="Ingrese su DNI"
            type="text"
            autoComplete="off"
            value={formData.national_id}
            onChange={handleInputChange('national_id')}
            error={Boolean(errors.national_id)}
            helperText={errors.national_id}
          />

          <CustomTextField
            label="Email"
            placeholder="Ingrese su email institucional"
            type="email"
            autoComplete="email"
            value={formData.email}
            onChange={handleInputChange('email')}
            error={Boolean(errors.email)}
            helperText={errors.email}
          />

          <CustomTextField
            label="Contraseña"
            placeholder="Ingrese su contraseña"
            type="password"
            autoComplete="new-password"
            value={formData.password}
            onChange={handleInputChange('password')}
            error={Boolean(errors.password)}
            helperText={errors.password}
          />

          <CustomTextField
            label="Confirmar Contraseña"
            placeholder="Repita su contraseña"
            type="password"
            autoComplete="new-password"
            value={formData.confirmPassword}
            onChange={handleInputChange('confirmPassword')}
            error={Boolean(errors.confirmPassword)}
            helperText={errors.confirmPassword}
          />

          <CustomButton type="submit" fullWidth disabled={isLoading}>
            {isLoading ? 'Creando cuenta...' : 'Crear cuenta'}
          </CustomButton>
        </form>

        <p className="text-body2 text-gray-600">
          ¿Ya tienes cuenta?{" "}
          <Link
            to="/login"
            className="text-label-bold text-gray-500 underline underline-offset-2">
            Iniciar sesión
          </Link>
        </p>
      </div>
    </div>
  );
}