const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';

// Auth interfaces
export interface LoginRequest {
    email: string;
    password: string;
}

export interface AuthResponse {
    success: boolean;
    message: string;
    data?: any;
}

export interface LoginResponse extends AuthResponse {
    accessToken?: string;
    refreshToken?: string;
    idToken?: string;
}

export interface RegisterRequest {
    email: string;
    password: string;
    name: string;
    national_id: string;
}

export interface RegisterResponse extends AuthResponse {
    data?: {
        email: string;
        name: string;
        national_id: string;
    };
}

export interface Product {
    id: string;
    name: string;
    description: string;
    price: number;
    photo?: string;
    restrictions: string[];
}

export interface ProductsResponse {
    success: boolean;
    message: string;
    data: Product[];
}

// Generic API interfaces
export interface ApiError {
    message: string;
    status?: number;
}

export interface ApiResponse<T = any> {
    success: boolean;
    message?: string;
    data?: T;
}

class ApiService {
    private baseURL: string;

    constructor(baseURL: string = API_BASE_URL) {
        this.baseURL = baseURL;
    }

    private getAccessToken(): string | null {
        try {
            return localStorage.getItem('optimeal_access_token');
        } catch (error) {
            console.error('Error retrieving access token:', error);
            return null;
        }
    }

    private async request<T>(
        endpoint: string,
        options: RequestInit = {}
    ): Promise<T> {
        const url = `${this.baseURL}${endpoint}`;

        const accessToken = this.getAccessToken();

        const config: RequestInit = {
            headers: {
                'Content-Type': 'application/json',
                ...(accessToken && { 'Authorization': `Bearer ${accessToken}` }),
                ...options.headers,
            },
            ...options,
        };

        try {
            const response = await fetch(url, config);

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            if (error instanceof Error) {
                throw error;
            }
            throw new Error('An unexpected error occurred');
        }
    }

    async login(credentials: LoginRequest): Promise<LoginResponse> {
        return this.request<LoginResponse>('/auth/login', {
            method: 'POST',
            body: JSON.stringify(credentials),
        });
    }

    async register(userData: RegisterRequest): Promise<RegisterResponse> {
        return this.request<RegisterResponse>('/auth/signup', {
            method: 'POST',
            body: JSON.stringify(userData),
        });
    }

    async getProducts(): Promise<ProductsResponse> {
        return this.request<ProductsResponse>('/products', {
            method: 'GET',
        });
    }
}

export const apiService = new ApiService();