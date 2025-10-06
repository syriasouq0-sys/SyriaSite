import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Product, CartItem, Currency } from '@/types/product';

interface CartStore {
  items: CartItem[];
  currency: Currency;
  isOpen: boolean;
  discountCode: string;
  discountPercentage: number;
  addItem: (product: Product) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  setCurrency: (currency: Currency) => void;
  toggleCart: () => void;
  getTotalItems: () => number;
  getSubtotal: () => number;
  getDiscount: () => number;
  getTotalPrice: () => number;
  applyDiscountCode: (code: string) => boolean;
  clearDiscount: () => void;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      currency: 'SEK',
      isOpen: false,
      discountCode: '',
      discountPercentage: 0,

      addItem: (product) => {
        const items = get().items;
        const existingItem = items.find((item) => item.product.id === product.id);

        if (existingItem) {
          set({
            items: items.map((item) =>
              item.product.id === product.id
                ? { ...item, quantity: item.quantity + 1 }
                : item
            ),
          });
        } else {
          set({ items: [...items, { product, quantity: 1 }] });
        }
      },

      removeItem: (productId) => {
        set({ items: get().items.filter((item) => item.product.id !== productId) });
      },

      updateQuantity: (productId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(productId);
          return;
        }
        set({
          items: get().items.map((item) =>
            item.product.id === productId ? { ...item, quantity } : item
          ),
        });
      },

      clearCart: () => {
        set({ items: [] });
      },

      setCurrency: (currency) => {
        set({ currency });
      },

      toggleCart: () => {
        set({ isOpen: !get().isOpen });
      },

      getTotalItems: () => {
        return get().items.reduce((total, item) => total + item.quantity, 0);
      },

      getSubtotal: () => {
        // Get active event for potential discount
        const activeEvent = window.activeEvent; // Access from window object (set in Layout)
        
        return get().items.reduce(
          (total, item) => {
            // First check product discount, then event discount
            const productDiscount = item.product.discount_percentage && item.product.discount_percentage > 0;
            const eventDiscount = activeEvent?.discount_percentage && activeEvent.discount_percentage > 0;
            
            // Use product discount first, fall back to event discount
            const hasDiscount = productDiscount || eventDiscount;
            const discountPercentage = productDiscount 
              ? item.product.discount_percentage 
              : (eventDiscount ? activeEvent?.discount_percentage : 0);
            
            // Calculate final price
            const price = hasDiscount && discountPercentage
              ? Math.round(item.product.price * (1 - discountPercentage / 100))
              : item.product.price;
            
            return total + price * item.quantity;
          },
          0
        );
      },

      getDiscount: () => {
        const subtotal = get().getSubtotal();
        return Math.round(subtotal * (get().discountPercentage / 100));
      },

      getTotalPrice: () => {
        const subtotal = get().getSubtotal();
        const discount = get().getDiscount();
        return subtotal - discount;
      },

      applyDiscountCode: (code) => {
        // Check for our special discount code
        if (code === 'FreeSyria2025') {
          set({ discountCode: code, discountPercentage: 20 });
          return true;
        }
        return false;
      },

      clearDiscount: () => {
        set({ discountCode: '', discountPercentage: 0 });
      },
    }),
    {
      name: 'syria-cart-storage',
    }
  )
);
