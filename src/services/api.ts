const API_BASE_URL = 'http://localhost:3000/api';

// Auth interfaces
export interface LoginRequest {
    email: string;
    password: string;
}

export interface LoginResponse {
    success: boolean;
    message: string;
    accessToken: string;
    refreshToken: string;
    idToken: string;
    data: {
        email: string;
        expiresIn: number;
    };
}

export interface RegisterRequest {
    email: string;
    password: string;
    name: string;
    national_id: string;
}

export interface RegisterResponse {
    success: boolean;
    message: string;
    data?: {
        email: string;
        name: string;
        national_id: string;
    };
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

    private async request<T>(
        endpoint: string,
        options: RequestInit = {}
    ): Promise<T> {
        const url = `${this.baseURL}${endpoint}`;

        const config: RequestInit = {
            headers: {
                'Content-Type': 'application/json',
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
}

export const apiService = new ApiService();