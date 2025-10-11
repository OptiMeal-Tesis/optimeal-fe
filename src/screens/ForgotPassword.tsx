import { FormEvent, useState, useEffect } from "react";
import CustomTextField from "../components/CustomTextField";
import CustomButton from "../components/CustomButton";
import EyeIcon from "../assets/icons/EyeIcon";
import EyeClosedIcon from "../assets/icons/EyeClosedIcon";
import { authService } from "../services/auth";
import Logo from "../assets/icons/Logo";
import { Link, useSearchParams } from "react-router-dom";
import toast from "react-hot-toast";

export const ForgotPassword = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const [step, setStep] = useState<'email' | 'reset'>('email');
    const [email, setEmail] = useState("");
    const [confirmationCode, setConfirmationCode] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    
    const [errors, setErrors] = useState<{ 
        email?: string;
        confirmationCode?: string;
        newPassword?: string;
        confirmPassword?: string;
    }>({});
    const [isLoading, setIsLoading] = useState(false);
    const [isResending, setIsResending] = useState(false);

    useEffect(() => {
        const stepParam = searchParams.get('step');
        if (stepParam === 'reset') {
            setStep('reset');
            const emailParam = searchParams.get('email');
            if (emailParam) {
                setEmail(emailParam);
            }
        }
    }, [searchParams]);

    const validateField = (field: string, value: string): string | undefined => {
        switch (field) {
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
            case 'confirmationCode':
                if (!value.trim()) {
                    return "El código es obligatorio";
                } else if (value.length < 4) {
                    return "El código debe tener al menos 4 caracteres";
                }
                break;
            case 'newPassword':
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
                } else if (newPassword && value && newPassword !== value) {
                    return "Las contraseñas no coinciden";
                }
                break;
        }
        return undefined;
    }

    const handleEmailSubmit = async (e: FormEvent) => {
        e.preventDefault();
        
        const emailError = validateField('email', email);
        if (emailError) {
            setErrors({ email: emailError });
            return;
        }

        setIsLoading(true);
        try {
            await authService.forgotPassword(email);
            setStep('reset');
            setSearchParams({ step: 'reset', email: email });
            setErrors({});
            toast.success('Código de verificación enviado correctamente');
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Error al enviar el código de recuperación';
            toast.error(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    const handleResetSubmit = async (e: FormEvent) => {
        e.preventDefault();
        
        const nextErrors: typeof errors = {};
        const confirmationCodeError = validateField('confirmationCode', confirmationCode);
        const passwordError = validateField('newPassword', newPassword);
        const confirmError = validateField('confirmPassword', confirmPassword);
        
        if (confirmationCodeError) nextErrors.confirmationCode = confirmationCodeError;
        if (passwordError) nextErrors.newPassword = passwordError;
        if (confirmError) nextErrors.confirmPassword = confirmError;
        
        setErrors(nextErrors);
        
        if (Object.keys(nextErrors).length === 0) {
            setIsLoading(true);
            try {
                await authService.resetPassword({
                    email,
                    confirmationCode,
                    newPassword
                });
                toast.success('Contraseña restablecida correctamente');
                setSearchParams({});
                setTimeout(() => {
                    window.location.href = '/login';
                }, 2000);
            } catch (error) {
                const errorMessage = error instanceof Error ? error.message : 'Error al restablecer la contraseña';
                toast.error(errorMessage);
            } finally {
                setIsLoading(false);
            }
        }
    };

    const handleResendCode = async () => {
        setIsResending(true);
        
        try {
            await authService.forgotPassword(email);
            toast.success('Código reenviado correctamente');
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Error al reenviar el código';
            toast.error(errorMessage);
        } finally {
            setIsResending(false);
        }
    };

    const handleInputChange = (field: string) => {
        return (e: React.ChangeEvent<HTMLInputElement>) => {
            const value = e.target.value;
            
            switch (field) {
                case 'email':
                    setEmail(value);
                    break;
                case 'confirmationCode':
                    setConfirmationCode(value);
                    break;
                case 'newPassword':
                    setNewPassword(value);
                    break;
                case 'confirmPassword':
                    setConfirmPassword(value);
                    break;
            }
            
            if (errors[field as keyof typeof errors]) {
                setErrors(prev => ({ ...prev, [field]: undefined }));
            }
        };
    };

    if (step === 'email') {
        return (
            <div className="min-h-screen flex items-center p-7 bg-white">
                <div className="w-full flex flex-col gap-4 text-center">
                    <div className="flex justify-center">
                        <Logo width={222} height={74}/>
                    </div>

                    <p className="text-sub1">Recuperar Contraseña</p>
                    <p className="text-body2 text-gray-600 mb-4">
                        Ingresa tu email para recibir un código de verificación
                    </p>

                    <form className="w-full flex flex-col gap-6" onSubmit={handleEmailSubmit} noValidate>
                        <CustomTextField
                            label="Email"
                            placeholder="Ingrese su email institucional"
                            type="email"
                            autoComplete="email"
                            value={email}
                            aria-label="Email address"
                            onChange={handleInputChange('email')}
                            error={Boolean(errors.email)}
                            helperText={errors.email}
                        />

                        <CustomButton 
                            type="submit" 
                            fullWidth 
                            loading={isLoading}
                        >
                            {isLoading ? 'Enviando código...' : 'Enviar código de recuperación'}
                        </CustomButton>
                    </form>

                    <p className="text-body2 text-gray-600">
                        ¿Recordaste tu contraseña?{" "}
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

    return (
        <div className="min-h-screen flex items-center p-7 bg-white">
            <div className="w-full flex flex-col gap-4 text-center">
                <div className="flex justify-center">
                    <Logo width={222} height={74}/>
                </div>

                <p className="text-sub1">Restablecer Contraseña</p>

                <form className="w-full flex flex-col gap-6" onSubmit={handleResetSubmit} noValidate>
                    <CustomTextField
                        label="Código de verificación"
                        placeholder="Ingrese el código de 6 dígitos"
                        type="text"
                        autoComplete="off"
                        value={confirmationCode}
                        onChange={handleInputChange('confirmationCode')}
                        error={Boolean(errors.confirmationCode)}
                        helperText={errors.confirmationCode}
                    />

                    <CustomTextField
                        label="Nueva contraseña"
                        placeholder="Ingrese su nueva contraseña"
                        type={showPassword ? "text" : "password"}
                        autoComplete="new-password"
                        value={newPassword}
                        onChange={handleInputChange('newPassword')}
                        error={Boolean(errors.newPassword)}
                        helperText={errors.newPassword}
                        rightIcon={showPassword ? <EyeIcon /> : <EyeClosedIcon />}
                        onRightIconClick={() => setShowPassword(prev => !prev)}
                    />

                    <CustomTextField
                        label="Confirmar nueva contraseña"
                        placeholder="Repita su nueva contraseña"
                        type={showConfirmPassword ? "text" : "password"}
                        autoComplete="new-password"
                        value={confirmPassword}
                        onChange={handleInputChange('confirmPassword')}
                        error={Boolean(errors.confirmPassword)}
                        helperText={errors.confirmPassword}
                        rightIcon={showConfirmPassword ? <EyeIcon color="var(--color-gray-500)"/> : <EyeClosedIcon color="var(--color-gray-500)"/>}
                        onRightIconClick={() => setShowConfirmPassword(prev => !prev)}
                    />

                    <CustomButton 
                        type="submit" 
                        fullWidth 
                        loading={isLoading}
                    >
                        {isLoading ? 'Restableciendo contraseña...' : 'Restablecer contraseña'}
                    </CustomButton>

                    <CustomButton 
                        type="button" 
                        fullWidth 
                        variant="outlined"
                        onClick={handleResendCode}
                        loading={isResending}
                    >
                        {isResending ? 'Reenviando código...' : 'Reenviar código'}
                    </CustomButton>
                </form>

                <p className="text-body2 text-gray-600">
                    ¿Recordaste tu contraseña?{" "}
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

export default ForgotPassword;