import {
  createContext,
  useContext,
  useReducer,
  useEffect,
  type ReactNode,
} from "react";
import type { Producto, CartItem } from "../types";

interface CartState {
  items: CartItem[];
  isOpen: boolean;
}

type CartAction =
  | { type: "ADD_ITEM"; producto: Producto; talla: string }
  | { type: "REMOVE_ITEM"; productoId: string; talla: string }
  | { type: "UPDATE_QUANTITY"; productoId: string; talla: string; cantidad: number }
  | { type: "CLEAR_CART" }
  | { type: "TOGGLE_CART" }
  | { type: "OPEN_CART" }
  | { type: "CLOSE_CART" }
  | { type: "LOAD_CART"; items: CartItem[] };

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case "ADD_ITEM": {
      const existingIndex = state.items.findIndex(
        (item) =>
          item.producto.id === action.producto.id && item.talla === action.talla
      );

      if (existingIndex >= 0) {
        const newItems = [...state.items];
        newItems[existingIndex] = {
          ...newItems[existingIndex],
          cantidad: newItems[existingIndex].cantidad + 1,
        };
        return { ...state, items: newItems, isOpen: true };
      }

      return {
        ...state,
        items: [
          ...state.items,
          { producto: action.producto, cantidad: 1, talla: action.talla },
        ],
        isOpen: true,
      };
    }

    case "REMOVE_ITEM":
      return {
        ...state,
        items: state.items.filter(
          (item) =>
            !(item.producto.id === action.productoId && item.talla === action.talla)
        ),
      };

    case "UPDATE_QUANTITY": {
      if (action.cantidad <= 0) {
        return {
          ...state,
          items: state.items.filter(
            (item) =>
              !(item.producto.id === action.productoId && item.talla === action.talla)
          ),
        };
      }

      const newItems = state.items.map((item) =>
        item.producto.id === action.productoId && item.talla === action.talla
          ? { ...item, cantidad: action.cantidad }
          : item
      );
      return { ...state, items: newItems };
    }

    case "CLEAR_CART":
      return { ...state, items: [] };

    case "TOGGLE_CART":
      return { ...state, isOpen: !state.isOpen };

    case "OPEN_CART":
      return { ...state, isOpen: true };

    case "CLOSE_CART":
      return { ...state, isOpen: false };

    case "LOAD_CART":
      return { ...state, items: action.items };

    default:
      return state;
  }
}

interface CartContextType {
  items: CartItem[];
  isOpen: boolean;
  addItem: (producto: Producto, talla: string) => void;
  removeItem: (productoId: string, talla: string) => void;
  updateQuantity: (productoId: string, talla: string, cantidad: number) => void;
  clearCart: () => void;
  toggleCart: () => void;
  openCart: () => void;
  closeCart: () => void;
  itemCount: number;
  subtotal: number;
  shipping: number;
  total: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const SHIPPING_THRESHOLD = 50000;
const SHIPPING_COST = 5000;

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, {
    items: [],
    isOpen: false,
  });

  // Load cart from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem("hanafuku-cart");
      if (saved) {
        const items = JSON.parse(saved) as CartItem[];
        dispatch({ type: "LOAD_CART", items });
      }
    } catch {
      // Ignore parse errors
    }
  }, []);

  // Save cart to localStorage on change
  useEffect(() => {
    localStorage.setItem("hanafuku-cart", JSON.stringify(state.items));
  }, [state.items]);

  const itemCount = state.items.reduce((sum, item) => sum + item.cantidad, 0);
  const subtotal = state.items.reduce(
    (sum, item) => sum + item.producto.precioActual * item.cantidad,
    0
  );
  const shipping = subtotal >= SHIPPING_THRESHOLD ? 0 : SHIPPING_COST;
  const total = subtotal + shipping;

  const value: CartContextType = {
    items: state.items,
    isOpen: state.isOpen,
    addItem: (producto, talla) => dispatch({ type: "ADD_ITEM", producto, talla }),
    removeItem: (productoId, talla) =>
      dispatch({ type: "REMOVE_ITEM", productoId, talla }),
    updateQuantity: (productoId, talla, cantidad) =>
      dispatch({ type: "UPDATE_QUANTITY", productoId, talla, cantidad }),
    clearCart: () => dispatch({ type: "CLEAR_CART" }),
    toggleCart: () => dispatch({ type: "TOGGLE_CART" }),
    openCart: () => dispatch({ type: "OPEN_CART" }),
    closeCart: () => dispatch({ type: "CLOSE_CART" }),
    itemCount,
    subtotal,
    shipping,
    total,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
