import { Side } from '../services/api';

export type ProductId = string;

export interface Product {
  id: ProductId;
  name: string;
  description: string;
  price: number; // integer in ARS, no decimals
  photo?: string;
  restrictions: string[];
  sides: Side[];
  admitsClarifications: boolean;
  type: string;
  stock: number;
  createdAt: string;
  updatedAt: string;
}

export interface CartItem {
  productId: ProductId;
  quantity: number; 
  price: number; 
  name: string;  
  photo?: string;
  sides: Side[];
  selectedSide?: string | null;
  clarifications?: string | null;
  stock: number;
}

// Generate unique key for cart items based on productId + selectedSide
export const generateCartItemKey = (productId: ProductId, selectedSide?: string | null): string => {
  if (!selectedSide) {
    return productId;
  }
  return `${productId}_${selectedSide}`;
};

export interface CartState {
  items: Record<string, CartItem>; // Changed from ProductId to string for unique keys
  subtotal: number; // derived: sum(price * quantity)
}

export const LOCAL_STORAGE_KEY = "optimeal.cart.v1";

// Utility functions for localStorage persistence
export const persistCart = (state: CartState): void => {
  const persist = () => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(state));
    } catch (error) {
      console.error('Failed to persist cart to localStorage:', error);
    }
  };

  // Use requestIdleCallback if available, otherwise setTimeout
  if (typeof requestIdleCallback !== 'undefined') {
    requestIdleCallback(persist);
  } else {
    setTimeout(persist, 0);
  }
};

export const readCart = (): CartState => {
  try {
    const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (!stored) return { items: {}, subtotal: 0 };
    
    const parsed = JSON.parse(stored);
    
    // Validate structure
    if (typeof parsed !== 'object' || !parsed.items || typeof parsed.subtotal !== 'number') {
      return { items: {}, subtotal: 0 };
    }
    
    return parsed;
  } catch (error) {
    console.error('Failed to read cart from localStorage:', error);
    return { items: {}, subtotal: 0 };
  }
};

export const clearCartFromStorage = (): void => {
  try {
    localStorage.removeItem(LOCAL_STORAGE_KEY);
  } catch (error) {
    console.error('Failed to clear cart from localStorage:', error);
  }
};
