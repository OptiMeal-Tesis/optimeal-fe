export type ProductId = string;

export interface Product {
  id: ProductId;
  name: string;
  description: string;
  price: number; // integer in ARS, no decimals
  photo?: string;
  restrictions: string[];
}

export interface CartItem {
  productId: ProductId;
  quantity: number; // >= 0
  price: number; // snapshot of unit price
  name: string;  // snapshot for summary
  photo?: string;
}

export interface CartState {
  items: Record<ProductId, CartItem>;
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
