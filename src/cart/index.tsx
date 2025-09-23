import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { Product, ProductId, CartState, CartItem, persistCart, readCart } from './cart';

// Action types
type Action =
  | { type: "ADD"; product: Product }
  | { type: "UPDATE_ITEM"; item: CartItem }
  | { type: "ADD_ITEM"; item: CartItem }
  | { type: "INCREASE"; productId: ProductId }
  | { type: "DECREASE"; productId: ProductId }
  | { type: "REMOVE"; productId: ProductId }
  | { type: "CLEAR" };


  export type CartActions = {
  add: (product: Product) => void;
  updateItem: (item: CartItem) => void;
  addItem: (item: CartItem) => void;
  increase: (productId: ProductId) => void;
  decrease: (productId: ProductId) => void;
  remove: (productId: ProductId) => void;
  clear: () => void;
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
      const existingItem = state.items[product.id];
      
      if (existingItem) {
        // Increase quantity if product already exists
        newState = {
          ...state,
          items: {
            ...state.items,
            [product.id]: {
              ...existingItem,
              quantity: existingItem.quantity + 1,
            },
          },
        };
      } else {
        // Add new item
        newState = {
          ...state,
          items: {
            ...state.items,
            [product.id]: {
              productId: product.id,
              quantity: 1,
              price: product.price,
              name: product.name,
              photo: product.photo,
              sides: product.sides || [],
              selectedSide: null,
            },
          },
        };
      }
      break;
    }

    case "UPDATE_ITEM": {
      const { item } = action;
      newState = {
        ...state,
        items: {
          ...state.items,
          [item.productId]: item,
        },
      };
      break;
    }

    case "ADD_ITEM": {
      const { item } = action;
      newState = {
        ...state,
        items: {
          ...state.items,
          [item.productId]: item,
        },
      };
      break;
    }

    case "INCREASE": {
      const { productId } = action;
      const item = state.items[productId];
      
      if (item) {
        newState = {
          ...state,
          items: {
            ...state.items,
            [productId]: {
              ...item,
              quantity: item.quantity + 1,
            },
          },
        };
      } else {
        newState = state;
      }
      break;
    }

    case "DECREASE": {
      const { productId } = action;
      const item = state.items[productId];
      
      if (item) {
        if (item.quantity <= 1) {
          // Remove item when quantity reaches 0
          const { [productId]: removed, ...remainingItems } = state.items;
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
              [productId]: {
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
      const { productId } = action;
      const { [productId]: removed, ...remainingItems } = state.items;
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

  // Load initial state from localStorage
  useEffect(() => {
    const savedCart = readCart();
    if (savedCart.items && Object.keys(savedCart.items).length > 0) {
      const subtotal = calculateSubtotal(savedCart.items);
      dispatch({ type: "CLEAR" });
      Object.values(savedCart.items).forEach(item => {
        for (let i = 0; i < item.quantity; i++) {
          dispatch({
            type: "ADD",
            product: {
              id: item.productId,
              name: item.name,
              description: "",
              price: item.price,
              photo: item.photo,
              restrictions: [],
              sides: item.sides || [],
              admitsClarifications: false,
              type: "",
              stock: 0,
              createdAt: "",
              updatedAt: "",
            },
          });
        }
      });
    }
  }, []);

  // Persist to localStorage on every state change
  useEffect(() => {
    persistCart(state);
  }, [state]);

  // Cart actions
  const actions: CartActions = {
    add: (product: Product) => dispatch({ type: "ADD", product }),
    updateItem: (item: CartItem) => dispatch({ type: "UPDATE_ITEM", item }),
    addItem: (item: CartItem) => dispatch({ type: "ADD_ITEM", item }),
    increase: (productId: ProductId) => dispatch({ type: "INCREASE", productId }),
    decrease: (productId: ProductId) => dispatch({ type: "DECREASE", productId }),
    remove: (productId: ProductId) => dispatch({ type: "REMOVE", productId }),
    clear: () => dispatch({ type: "CLEAR" }),
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
