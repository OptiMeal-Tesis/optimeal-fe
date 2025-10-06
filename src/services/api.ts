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

export interface ForgotPasswordRequest {
    email: string;
}

export interface ResetPasswordRequest {
    email: string;
    confirmationCode: string;
    newPassword: string;
}

export interface ForgotPasswordResponse extends AuthResponse {
    data?: {
        email: string;
    };
}

// User related types
export interface User {
    id: number;
    email: string;
    name?: string;
    national_id?: string;
}

export interface UserResponse {
    success: boolean;
    message: string;
    data?: User;
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

// Checkout types for Mercado Pago integration
export interface CheckoutItem {
  productId: number;
  quantity: number;
  sideId?: number;
  notes?: string;
}

export interface CheckoutRequest {
  items: CheckoutItem[];
  pickUpTime: string; // ISO datetime string
}

export interface CheckoutResponse {
  success: boolean;
  message: string;
  data?: {
    checkoutId: number;
    initPoint: string;
    preferenceId: string;
  };
}

// Order related types
export type OrderStatus = 'PENDING' | 'PREPARING' | 'READY' | 'DELIVERED' | 'CANCELLED';

export interface OrderItemResponse {
    id: number;
    productId: number;
    product: {
        id: number;
        name: string;
        price: number;
        photo?: string;
        sides: Side[];
    };
    quantity: number;
    sideId?: number;
    side?: {
        id: number;
        name: string;
    };
    notes?: string;
    price: number;
}

export interface OrderResponse {
    id: number;
    userId: number;
    user: {
        id: number;
        name?: string;
        email: string;
        nationalId?: string;
    };
    status: OrderStatus;
    totalPrice: number;
    pickUpTime: Date;
    createdAt: Date;
    updatedAt: Date;
    orderItems: OrderItemResponse[];
}

export interface ProductsResponse {
    success: boolean;
    message: string;
    data: {
        foods: Product[];
        beverages: Product[];
    };
    total: number;
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

    async createCheckout(checkoutData: CheckoutRequest): Promise<CheckoutResponse> {
        return this.request<CheckoutResponse>('/payments/checkout', {
            method: 'POST',
            body: JSON.stringify(checkoutData),
        });
    }

    async getOrderById(orderId: number): Promise<ApiResponse<OrderResponse>> {
        // Simular delay para probar loading state
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        return this.request<ApiResponse<OrderResponse>>(`/orders/${orderId}`, {
            method: 'GET',
        });
    }

    async getUserOrders(): Promise<ApiResponse<OrderResponse[]>> {
        return this.request<ApiResponse<OrderResponse[]>>('/orders/my', {
            method: 'GET',
        });
    }

    async getCurrentUser(): Promise<UserResponse> {
        return this.request<UserResponse>('/users/me', {
            method: 'GET',
        });
    }

    async forgotPassword(email: string): Promise<ForgotPasswordResponse> {
        return this.request<ForgotPasswordResponse>('/auth/forgot-password', {
            method: 'POST',
            body: JSON.stringify({ email }),
        });
    }

    async resetPassword(data: ResetPasswordRequest): Promise<AuthResponse> {
        return this.request<AuthResponse>('/auth/confirm-forgot-password', {
            method: 'POST',
            body: JSON.stringify(data),
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