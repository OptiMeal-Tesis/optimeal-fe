import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { Product, ProductId, CartState, CartItem, persistCart, readCart, generateCartItemKey, clearCartFromStorage } from './cart';
import { authService } from '../services/auth';

// Action types
type Action =
  | { type: "ADD"; product: Product }
  | { type: "UPDATE_ITEM"; item: CartItem }
  | { type: "ADD_ITEM"; item: CartItem }
  | { type: "INCREASE"; itemKey: string }
  | { type: "DECREASE"; itemKey: string }
  | { type: "REMOVE"; itemKey: string }
  | { type: "CLEAR" };


  export type CartActions = {
  add: (product: Product) => void;
  updateItem: (item: CartItem) => void;
  addItem: (item: CartItem) => void;
  increase: (itemKey: string) => void;
  decrease: (itemKey: string) => void;
  remove: (itemKey: string) => void;
  clear: () => void;
  // Helper functions
  getItemsByProductId: (productId: ProductId) => CartItem[];
  getTotalQuantityByProductId: (productId: ProductId) => number;
};

// Cart API interface
export type CartApi = CartState & CartActions;

// Calculate subtotal from items
const calculateSubtotal = (items: Record<ProductId, CartItem>): number => {
  return Object.values(items).reduce((sum, item) => sum + item.price * item.quantity, 0);
};

// Cart reducer
const cartReducer = (state: CartState, action: Action): CartState => {
  let newState: CartState;

  switch (action.type) {
    case "ADD": {
      const { product } = action;
      const itemKey = generateCartItemKey(product.id, null);
      const existingItem = state.items[itemKey];
      
      if (existingItem) {
        // Check stock before increasing quantity
        if (existingItem.quantity >= existingItem.stock) {
          // Don't allow increase if it would exceed stock
          newState = state;
        } else {
          // Increase quantity if product already exists
          newState = {
            ...state,
            items: {
              ...state.items,
              [itemKey]: {
                ...existingItem,
                quantity: existingItem.quantity + 1,
              },
            },
          };
        }
      } else {
        // Add new item
        newState = {
          ...state,
          items: {
            ...state.items,
            [itemKey]: {
              productId: product.id,
              quantity: 1,
              price: product.price,
              name: product.name,
              photo: product.photo,
              sides: product.sides || [],
              selectedSide: null,
              stock: product.stock,
            },
          },
        };
      }
      break;
    }

    case "UPDATE_ITEM": {
      const { item } = action;
      const itemKey = generateCartItemKey(item.productId, item.selectedSide);
      newState = {
        ...state,
        items: {
          ...state.items,
          [itemKey]: item,
        },
      };
      break;
    }

    case "ADD_ITEM": {
      const { item } = action;
      const itemKey = generateCartItemKey(item.productId, item.selectedSide);
      const existingItem = state.items[itemKey];
      if (existingItem) {
        const requestedQuantity = item.quantity;
        const currentQuantity = existingItem.quantity;
        const maxStock = existingItem.stock;
        const mergedQuantity = Math.min(currentQuantity + requestedQuantity, maxStock);

        newState = {
          ...state,
          items: {
            ...state.items,
            [itemKey]: {
              ...existingItem,
              ...item,
              quantity: mergedQuantity,
            },
          },
        };
      } else {
        newState = {
          ...state,
          items: {
            ...state.items,
            [itemKey]: item,
          },
        };
      }
      break;
    }

    case "INCREASE": {
      const { itemKey } = action;
      const item = state.items[itemKey];
      
      if (item) {
        // Check stock before increasing quantity
        if (item.quantity >= item.stock) {
          // Don't allow increase if it would exceed stock
          newState = state;
        } else {
          newState = {
            ...state,
            items: {
              ...state.items,
              [itemKey]: {
                ...item,
                quantity: item.quantity + 1,
              },
            },
          };
        }
      } else {
        newState = state;
      }
      break;
    }

    case "DECREASE": {
      const { itemKey } = action;
      const item = state.items[itemKey];
      
      if (item) {
        if (item.quantity <= 1) {
          // Remove item when quantity reaches 0
          const { [itemKey]: removed, ...remainingItems } = state.items;
          newState = {
            ...state,
            items: remainingItems,
          };
        } else {
          // Decrease quantity
          newState = {
            ...state,
            items: {
              ...state.items,
              [itemKey]: {
                ...item,
                quantity: item.quantity - 1,
              },
            },
          };
        }
      } else {
        newState = state;
      }
      break;
    }

    case "REMOVE": {
      const { itemKey } = action;
      const { [itemKey]: removed, ...remainingItems } = state.items;
      newState = {
        ...state,
        items: remainingItems,
      };
      break;
    }

    case "CLEAR": {
      newState = { items: {}, subtotal: 0 };
      break;
    }

    default:
      newState = state;
  }

  // Calculate subtotal
  newState.subtotal = calculateSubtotal(newState.items);
  
  return newState;
};

// Create context
const Index = createContext<CartApi | undefined>(undefined);

// Cart provider component
interface CartProviderProps {
  children: ReactNode;
}

export function CartProvider({ children }: CartProviderProps) {
  const [state, dispatch] = useReducer(cartReducer, { items: {}, subtotal: 0 });
  const [currentUserEmail, setCurrentUserEmail] = React.useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = authService.subscribe((authState) => {
      const userEmail = authState.user?.email || null;
      
      // If user changed, clear current cart and load user-specific cart
      if (userEmail !== currentUserEmail) {
        // Clear current cart
        dispatch({ type: "CLEAR" });
        
        // Load user's cart
        const savedCart = readCart(userEmail);
        if (savedCart.items && Object.keys(savedCart.items).length > 0) {
          Object.values(savedCart.items).forEach(item => {
            dispatch({
              type: "ADD_ITEM",
              item: item,
            });
          });
        }
        
        setCurrentUserEmail(userEmail);
      }
    });

    // Initialize with current user
    const initialAuthState = authService.getState();
    const initialUserEmail = initialAuthState.user?.email || null;
    setCurrentUserEmail(initialUserEmail);

    return unsubscribe;
  }, [currentUserEmail]);

  // Load initial state from localStorage
  useEffect(() => {
    const savedCart = readCart(currentUserEmail);
    if (savedCart.items && Object.keys(savedCart.items).length > 0) {
      const subtotal = calculateSubtotal(savedCart.items);
      dispatch({ type: "CLEAR" });
      Object.values(savedCart.items).forEach(item => {
        dispatch({
          type: "ADD_ITEM",
          item: item,
        });
      });
    }
  }, [currentUserEmail]);

  // Persist to localStorage on every state change
  useEffect(() => {
    persistCart(state, currentUserEmail);
  }, [state, currentUserEmail]);

  // Helper functions
  const getItemsByProductId = (productId: ProductId): CartItem[] => {
    return Object.values(state.items).filter(item => item.productId === productId);
  };

  const getTotalQuantityByProductId = (productId: ProductId): number => {
    return getItemsByProductId(productId).reduce((total, item) => total + item.quantity, 0);
  };

  // Cart actions
  const actions: CartActions = {
    add: (product: Product) => dispatch({ type: "ADD", product }),
    updateItem: (item: CartItem) => dispatch({ type: "UPDATE_ITEM", item }),
    addItem: (item: CartItem) => dispatch({ type: "ADD_ITEM", item }),
    increase: (itemKey: string) => dispatch({ type: "INCREASE", itemKey }),
    decrease: (itemKey: string) => dispatch({ type: "DECREASE", itemKey }),
    remove: (itemKey: string) => dispatch({ type: "REMOVE", itemKey }),
    clear: () => dispatch({ type: "CLEAR" }),
    getItemsByProductId,
    getTotalQuantityByProductId,
  };

  const cartApi: CartApi = {
    ...state,
    ...actions,
  };

  return (
    <Index.Provider value={cartApi}>
      {children}
    </Index.Provider>
  );
}

export function useCart(): CartApi {
  const context = useContext(Index);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
