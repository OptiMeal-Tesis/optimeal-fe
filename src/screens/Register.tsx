import { useState, FormEvent, useEffect } from "react";
import Logo from "../assets/icons/Logo";
import CustomButton from "../components/CustomButton";
import CustomTextField from "../components/CustomTextField";
import EyeIcon from "../assets/icons/EyeIcon";
import EyeClosedIcon from "../assets/icons/EyeClosedIcon";
import { Link, useNavigate } from "react-router-dom";
import { authService } from "../services/auth";
import type { ValidationError } from "../services/api";
import toast from "react-hot-toast";

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

  function validateField(field: keyof typeof formData, value: string): string | undefined {
    switch (field) {
      case 'name':
        if (!value.trim()) {
          return "El nombre es obligatorio";
        } else if (value.trim().length < 2) {
          return "El nombre debe tener al menos 2 caracteres";
        }
        break;
      case 'national_id':
        if (!value.trim()) {
          return "El DNI es obligatorio";
        } else if (!/^\d{7,10}$/.test(value)) {
          return "El DNI debe tener entre 7-10 dígitos";
        }
        break;
      case 'email':
        if (!value.trim()) {
          return "El email es obligatorio";
        } else {
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (!emailRegex.test(value)) {
            return "Formato de email inválido";
          }
        }
        break;
      case 'password':
        if (!value.trim()) {
          return "La contraseña es obligatoria";
        } else if (value.length < 8) {
          return "La contraseña debe tener al menos 8 caracteres";
        } else {
          const hasUpperCase = /[A-Z]/.test(value);
          const hasLowerCase = /[a-z]/.test(value);
          const hasNumbers = /\d/.test(value);
          const hasSpecialChar = /[^A-Za-z0-9]/.test(value);
          
          if (!hasUpperCase || !hasLowerCase || !hasNumbers || !hasSpecialChar) {
            return "Use al menos 1 mayúscula, 1 minúscula, 1 número y 1 símbolo (./?$#@)";
          }
        }
        break;
      case 'confirmPassword':
        if (!value.trim()) {
          return "Confirmar contraseña es obligatorio";
        } else if (formData.password && value && formData.password !== value) {
          return "Las contraseñas no coinciden";
        }
        break;
    }
    return undefined;
  }

  function handleBlur(field: keyof typeof formData) {
    return () => {
      const error = validateField(field, formData[field]);
      setErrors(prev => ({ ...prev, [field]: error }));
    };
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    const next: typeof errors = {};
    
    // Validaciones frontend (matching backend rules)
    const fields: (keyof typeof formData)[] = ['name', 'national_id', 'email', 'password', 'confirmPassword'];
    fields.forEach(field => {
      const error = validateField(field, formData[field]);
      if (error) {
        next[field] = error;
      }
    });
    
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
          const apiValidationErrors = (error as any)?.validationErrors;
          if (apiValidationErrors && Array.isArray(apiValidationErrors) && apiValidationErrors.length > 0) {
            apiValidationErrors.forEach((validationError: ValidationError) => {
              toast.error(validationError.message);
            });
          } else {
            toast.error(error.message);
          }
        } else {
          toast.error('Error al crear la cuenta');
        }
      } finally {
        setIsLoading(false);
      }
    } else {
      toast.error("Por favor, corrige los errores del formulario");
    }
  }

  function handleInputChange(field: keyof typeof formData) {
    return (e: React.ChangeEvent<HTMLInputElement>) => {
      let value = e.target.value;
      
      // Special handling for DNI field - only allow numbers and limit to 10 characters
      if (field === 'national_id') {
        // Remove any non-numeric characters
        value = value.replace(/\D/g, '');
        value = value.slice(0, 10);
      }
      setFormData(prev => ({ ...prev, [field]: value }));
      if (errors[field]) {
        setErrors(prev => ({ ...prev, [field]: undefined }));
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

          <CustomTextField
            label="Nombre"
            placeholder="Ingrese su nombre completo"
            type="text"
            autoComplete="name"
            value={formData.name}
            onChange={handleInputChange('name')}
            onBlur={handleBlur('name')}
            error={Boolean(errors.name)}
            helperText={errors.name}
          />

          <CustomTextField
            label="DNI"
            placeholder="Ingrese su DNI"
            type="tel"
            autoComplete="off"
            value={formData.national_id}
            onChange={handleInputChange('national_id')}
            onBlur={handleBlur('national_id')}
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
            onBlur={handleBlur('email')}
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
            onBlur={handleBlur('password')}
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
            onBlur={handleBlur('confirmPassword')}
            error={Boolean(errors.confirmPassword)}
            helperText={errors.confirmPassword}
            rightIcon={showConfirmPassword ? <EyeIcon color="var(--color-gray-500)"/> : <EyeClosedIcon color="var(--color-gray-500)"/>}
            onRightIconClick={() => setShowConfirmPassword(prev => !prev)}
          />

          <CustomButton type="submit" fullWidth loading={isLoading}>
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