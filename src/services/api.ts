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

// Product and cart related types
export type Restriction =
  | "GLUTEN_FREE"
  | "LACTOSE_FREE"
  | "SUGAR_FREE"
  | "VEGAN";

export type ProductType = "FOOD" | "BEVERAGE" | string;

export interface Side {
    id: string;
    name: string;
    isActive: boolean;
}

export interface Product {
    id: string;
    name: string;
    description: string;
    price: number;
    photo?: string;
    restrictions: Restriction[];
    sides: Side[];
    admitsClarifications: boolean;
    type: string;
    stock: number;
    createdAt: string;
    updatedAt: string;
}

// Cart-specific types that extend the base types
export interface CartItem {
  productId: string; // Changed to string to match API
  quantity: number;
  selectedSideId?: string | null; // Changed to string to match API
  clarifications?: string | null;
}

export interface ProductsResponse {
    success: boolean;
    message: string;
    data: Product[];
}

export interface ProductResponse {
    success: boolean;
    message: string;
    data: Product;
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
            const responseData = await response.json();

            if (!response.ok) {
                const error = new Error(responseData.message || `HTTP error! status: ${response.status}`);
                (error as any).status = response.status;
                throw error;
            }

            return responseData;
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

    async getProductById(id: string): Promise<ProductResponse> {
        return this.request<ProductResponse>(`/products/${id}`, {
            method: 'GET',
        });
    }
}

export const apiService = new ApiService();


export function mapRestrictionToChip(restriction: Restriction) {
  const restrictionLabels: Record<Restriction, string> = {
    GLUTEN_FREE: "Sin TACC",
    LACTOSE_FREE: "Sin lactosa", 
    SUGAR_FREE: "Sin azúcar",
    VEGAN: "Vegano",
  };

  return {
    id: restriction,
    label: restrictionLabels[restriction] || restriction,
    icon: undefined // Will be set by component
  };
}