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

// Generate user-specific cart key
export const getCartStorageKey = (userEmail: string | null): string => {
  if (!userEmail) {
    return "optimeal.cart.v1"; // fallback for non-authenticated users
  }
  return `optimeal.cart.v1.${userEmail}`;
};

// Utility functions for localStorage persistence
export const persistCart = (state: CartState, userEmail: string | null): void => {
  const persist = () => {
    try {
      const key = getCartStorageKey(userEmail);
      localStorage.setItem(key, JSON.stringify(state));
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

export const readCart = (userEmail: string | null): CartState => {
  try {
    const key = getCartStorageKey(userEmail);
    const stored = localStorage.getItem(key);
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

export const clearCartFromStorage = (userEmail: string | null): void => {
  try {
    const key = getCartStorageKey(userEmail);
    localStorage.removeItem(key);
  } catch (error) {
    console.error('Failed to clear cart from localStorage:', error);
  }
};

export const clearAllCartStorage = (): void => {
  try {
    // Get all localStorage keys and remove cart-related ones
    const keysToRemove: string[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith('optimeal.cart.v1')) {
        keysToRemove.push(key);
      }
    }
    keysToRemove.forEach(key => localStorage.removeItem(key));
  } catch (error) {
    console.error('Failed to clear all cart storage:', error);
  }
};
