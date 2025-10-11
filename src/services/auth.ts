import { apiService } from './api';
import { tokenStorage } from '../utils/tokenStorage';
import type { LoginRequest, RegisterRequest, ResetPasswordRequest, ValidationError } from './api';
import { clearAllCartStorage } from '../cart/cart';
import type { TokenData } from '../utils/tokenStorage.ts';

export interface AuthUser {
    email: string;
}

export interface AuthState {
    user: AuthUser | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    error: string | null;
}

class AuthService {
    private listeners: ((state: AuthState) => void)[] = [];
    private state: AuthState = {
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
    };

    constructor() {
        this.initializeAuth();
    }

    private initializeAuth(): void {
        try {
            const email = tokenStorage.getUserEmail();
            const hasValidTokens = tokenStorage.hasValidTokens();

            if (email && hasValidTokens) {
                this.setState({
                    user: { email },
                    isAuthenticated: true,
                    isLoading: false,
                    error: null,
                });
            } else {
                // Clear invalid tokens and cart
                tokenStorage.clearTokens();
                clearAllCartStorage();
                this.setState({
                    user: null,
                    isAuthenticated: false,
                    isLoading: false,
                    error: null,
                });
            }
        } catch (error) {
            console.error('Error initializing auth:', error);
            clearAllCartStorage();
            this.setState({
                user: null,
                isAuthenticated: false,
                isLoading: false,
                error: 'Error initializing authentication',
            });
        }
    }

    private setState(newState: Partial<AuthState>): void {
        this.state = { ...this.state, ...newState };
        this.notifyListeners();
    }

    private notifyListeners(): void {
        this.listeners.forEach(listener => listener(this.state));
    }

    public subscribe(listener: (state: AuthState) => void): () => void {
        this.listeners.push(listener);
        // Return unsubscribe function
        return () => {
            this.listeners = this.listeners.filter(l => l !== listener);
        };
    }

    public getState(): AuthState {
        return this.state;
    }

    public async login(credentials: LoginRequest): Promise<void> {
        this.setState({ isLoading: true, error: null });

        try {
            const response = await apiService.login(credentials);

            if (response.success) {
                // Validate that all required tokens are present
                if (!response.accessToken || !response.refreshToken || !response.idToken) {
                    throw new Error('Invalid response: missing required tokens');
                }

                const tokenData: TokenData = {
                    accessToken: response.accessToken,
                    refreshToken: response.refreshToken,
                    idToken: response.idToken,
                    email: response.data.email,
                    expiresIn: response.data.expiresIn,
                };

                tokenStorage.setTokens(tokenData);

                this.setState({
                    user: { email: response.data.email },
                    isAuthenticated: true,
                    isLoading: false,
                    error: null,
                });
            } else {
                throw new Error(response.message || 'Credenciales inválidas');
            }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Error de autenticación';
            this.setState({
                isLoading: false,
                error: errorMessage,
            });
            throw error;
        }
    }

    public async register(userData: RegisterRequest): Promise<void> {
        this.setState({ isLoading: true, error: null });

        try {
            const response = await apiService.register(userData);

            if (response.success) {
                this.setState({
                    isLoading: false,
                    error: null,
                });
            } else {
                throw new Error(response.message || 'Error al crear la cuenta');
            }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Error al registrar usuario';
            const validationErrors = (error as any)?.errors;
            this.setState({
                isLoading: false,
                error: errorMessage,
            });
            
            const detailedErrorMessage = new Error(errorMessage);
            (detailedErrorMessage as any).validationErrors = validationErrors;
            throw detailedErrorMessage;
        }
    }

    public logout(): void {
        tokenStorage.clearTokens();
        clearAllCartStorage();
        this.setState({
            user: null,
            isAuthenticated: false,
            isLoading: false,
            error: null,
        });
    }

    public clearError(): void {
        this.setState({ error: null });
    }

    public isAuthenticated(): boolean {
        return tokenStorage.hasValidTokens();
    }

    public getCurrentUser(): AuthUser | null {
        const email = tokenStorage.getUserEmail();
        return email ? { email } : null;
    }

    public async forgotPassword(email: string): Promise<void> {
        this.setState({ isLoading: true, error: null });

        try {
            const response = await apiService.forgotPassword(email);

            if (response.success) {
                this.setState({
                    isLoading: false,
                    error: null,
                });
            } else {
                throw new Error(response.message || 'Error al enviar el código de recuperación');
            }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Error al enviar el código de recuperación';
            this.setState({
                isLoading: false,
                error: errorMessage,
            });
            throw error;
        }
    }

    public async resetPassword(data: ResetPasswordRequest): Promise<void> {
        this.setState({ isLoading: true, error: null });

        try {
            const response = await apiService.resetPassword(data);

            if (response.success) {
                this.setState({
                    isLoading: false,
                    error: null,
                });
            } else {
                throw new Error(response.message || 'Error al restablecer la contraseña');
            }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Error al restablecer la contraseña';
            this.setState({
                isLoading: false,
                error: errorMessage,
            });
            throw error;
        }
    }
}

export const authService = new AuthService();