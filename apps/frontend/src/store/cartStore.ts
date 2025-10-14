import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface CartItem {
  id: string;
  productId: string;
  name: string;
  slug: string;
  price: number;
  quantity: number;
  image?: string;
}

interface CartStore {
  items: CartItem[];
  isLoading: boolean;
  
  // Actions
  addItem: (product: Omit<CartItem, 'quantity'> & { quantity?: number }) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  
  // Computed
  totalItems: () => number;
  subtotal: () => number;
  
  // Sync
  syncWithServer: (accessToken: string) => Promise<void>;
  loadFromServer: (accessToken: string) => Promise<void>;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      isLoading: false,

      addItem: (product) => {
        const items = get().items;
        const existingItem = items.find(item => item.productId === product.productId);

        if (existingItem) {
          set({
            items: items.map(item =>
              item.productId === product.productId
                ? { ...item, quantity: item.quantity + (product.quantity || 1) }
                : item
            ),
          });
        } else {
          set({
            items: [...items, { ...product, quantity: product.quantity || 1 }],
          });
        }
      },

      removeItem: (productId) => {
        set({
          items: get().items.filter(item => item.productId !== productId),
        });
      },

      updateQuantity: (productId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(productId);
          return;
        }

        set({
          items: get().items.map(item =>
            item.productId === productId ? { ...item, quantity } : item
          ),
        });
      },

      clearCart: () => {
        set({ items: [] });
      },

      totalItems: () => {
        return get().items.reduce((total, item) => total + item.quantity, 0);
      },

      subtotal: () => {
        return get().items.reduce((total, item) => total + item.price * item.quantity, 0);
      },

      syncWithServer: async (accessToken) => {
        if (!accessToken) return;

        const items = get().items;
        
        try {
          // Send cart to server
          await fetch(`${API_URL}/api/cart/sync`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${accessToken}`,
            },
            body: JSON.stringify({ items }),
          });
        } catch (error) {
          console.error('Failed to sync cart:', error);
        }
      },

      loadFromServer: async (accessToken) => {
        if (!accessToken) return;

        set({ isLoading: true });
        
        try {
          const response = await fetch(`${API_URL}/api/cart`, {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          });

          if (response.ok) {
            const data = await response.json();
            
            // Transform server cart to store format
            const serverItems: CartItem[] = data.cart.items.map((item: any) => ({
              id: item.id,
              productId: item.productId,
              name: item.product.name,
              slug: item.product.slug,
              price: parseFloat(item.product.price),
              quantity: item.quantity,
            }));

            set({ items: serverItems });
          }
        } catch (error) {
          console.error('Failed to load cart:', error);
        } finally {
          set({ isLoading: false });
        }
      },
    }),
    {
      name: 'cart-storage',
    }
  )
);
