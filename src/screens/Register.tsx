import { useState, FormEvent, useEffect } from "react";
import Logo from "../assets/icons/Logo";
import CustomButton from "../components/CustomButton";
import CustomTextField from "../components/CustomTextField";
import EyeIcon from "../assets/icons/EyeIcon";
import EyeClosedIcon from "../assets/icons/EyeClosedIcon";
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
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
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
    
    // Validaciones frontend (matching backend rules)
    if (!formData.name.trim()) {
      next.name = "El nombre es obligatorio";
    } else if (formData.name.trim().length < 2) {
      next.name = "El nombre debe tener al menos 2 caracteres";
    }
    
    if (!formData.national_id.trim()) {
      next.national_id = "El DNI es obligatorio";
    } else if (!/^\d{7,10}$/.test(formData.national_id)) {
      next.national_id = "El DNI debe tener entre 7-10 dígitos";
    }
    
    if (!formData.email.trim()) {
      next.email = "El email es obligatorio";
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        next.email = "Formato de email inválido";
      }
    }
    
    if (!formData.password.trim()) {
      next.password = "La contraseña es obligatoria";
    } else if (formData.password.length < 8) {
      next.password = "La contraseña debe tener al menos 8 caracteres";
    } else {
      // Check password security requirements
      const hasUpperCase = /[A-Z]/.test(formData.password);
      const hasLowerCase = /[a-z]/.test(formData.password);
      const hasNumbers = /\d/.test(formData.password);
      const hasSpecialChar = /[^A-Za-z0-9]/.test(formData.password);
      
      if (!hasUpperCase || !hasLowerCase || !hasNumbers || !hasSpecialChar) {
        next.password = "Use al menos 1 mayúscula, 1 minúscula, 1 número y 1 símbolo (./?$#@)";
      }
    }
    
    if (!formData.confirmPassword.trim()) {
      next.confirmPassword = "Confirmar contraseña es obligatorio";
    } else if (formData.password && formData.confirmPassword && formData.password !== formData.confirmPassword) {
      next.confirmPassword = "Las contraseñas no coinciden";
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
        navigate('/success');
      } catch (error) {
        if (error instanceof Error) {
          setApiError(error.message);
        } else {
          setApiError('Error al crear la cuenta');
        }
      } finally {
        setIsLoading(false);
      }
    }
  }

  function handleInputChange(field: keyof typeof formData) {
    return (e: React.ChangeEvent<HTMLInputElement>) => {
      setFormData(prev => ({ ...prev, [field]: e.target.value }));
      if (errors[field]) {
        setErrors(prev => ({ ...prev, [field]: undefined }));
      }
      if (apiError) {
        setApiError(null);
      }
    };
  }

  return (
    <div className="min-h-screen flex items-center p-7 bg-white">
      <div className="w-full flex flex-col gap-4 text-center">
        <div className="flex justify-center">
          <Logo width={222} height={74}/>
        </div>

        <p className="text-sub1">Crear Cuenta</p>

        <form className="w-full flex flex-col gap-6" onSubmit={onSubmit} noValidate>
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
            type={showPassword ? "text" : "password"}
            autoComplete="new-password"
            value={formData.password}
            onChange={handleInputChange('password')}
            error={Boolean(errors.password)}
            helperText={errors.password}
            rightIcon={showPassword ? <EyeIcon /> : <EyeClosedIcon />}
            onRightIconClick={() => setShowPassword(prev => !prev)}
          />

          <CustomTextField
            label="Confirmar Contraseña"
            placeholder="Repita su contraseña"
            type={showConfirmPassword ? "text" : "password"}
            autoComplete="new-password"
            value={formData.confirmPassword}
            onChange={handleInputChange('confirmPassword')}
            error={Boolean(errors.confirmPassword)}
            helperText={errors.confirmPassword}
            rightIcon={showConfirmPassword ? <EyeIcon color="var(--color-gray-500)"/> : <EyeClosedIcon color="var(--color-gray-500)"/>}
            onRightIconClick={() => setShowConfirmPassword(prev => !prev)}
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