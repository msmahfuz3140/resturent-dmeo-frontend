"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { MenuItem, Restaurant, CartItem, applyCoupon } from "../lib/api";

interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: string;
  avatar?: string;
}

interface CartContextType {
  cart: CartItem[];
  cartCount: number;
  currentRestaurant: { id: string; name: string } | null;
  selectedArea: string;
  setSelectedArea: (area: string) => void;
  serviceType: "delivery" | "pickup" | "dinein";
  setServiceType: (mode: "delivery" | "pickup" | "dinein") => void;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  isAuthOpen: boolean;
  setIsAuthOpen: (open: boolean) => void;
  user: UserProfile | null;
  setUser: (u: UserProfile | null) => void;
  appliedDeal: { code: string; discountAmount: number } | null;
  couponError: string;
  addToCart: (item: MenuItem, restaurant: Restaurant, options?: string[]) => void;
  removeFromCart: (cartItemId: string) => void;
  updateQuantity: (cartItemId: string, delta: number) => void;
  clearCart: () => void;
  applyVoucher: (code: string) => Promise<boolean>;
  removeVoucher: () => void;
  subtotal: number;
  deliveryFee: number;
  discount: number;
  total: number;
  isReservationOpen: boolean;
  setIsReservationOpen: (open: boolean) => void;
  activeItemModal: { item: MenuItem; restaurant: Restaurant } | null;
  setActiveItemModal: (modal: { item: MenuItem; restaurant: Restaurant } | null) => void;
  reservations: any[];
  bookTable: (resData: any) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [currentRestaurant, setCurrentRestaurant] = useState<{ id: string; name: string } | null>(null);
  const [selectedArea, setSelectedArea] = useState<string>("Gulshan 2, Dhaka");
  const [serviceType, setServiceType] = useState<"delivery" | "pickup" | "dinein">("delivery");
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isReservationOpen, setIsReservationOpen] = useState(false);
  const [reservations, setReservations] = useState<any[]>([]);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [appliedDeal, setAppliedDeal] = useState<{ code: string; discountAmount: number } | null>(null);
  const [couponError, setCouponError] = useState("");
  const [activeItemModal, setActiveItemModal] = useState<{ item: MenuItem; restaurant: Restaurant } | null>(null);

  // Demo mode: reservations stored in local state only (no backend)
  const bookTable = async (resData: any) => {
    const confirmationCode = `FST-RES-${Math.floor(1000 + Math.random() * 9000)}`;
    const newReservation = {
      id: `res_${Date.now()}`,
      confirmationCode,
      ...resData,
      status: "confirmed",
    };
    setReservations((prev) => [newReservation, ...prev]);
    return newReservation;
  };


  // Load cart and user from localStorage on mount
  useEffect(() => {
    try {
      const savedUser = localStorage.getItem("feastora_user");
      if (savedUser) setUser(JSON.parse(savedUser));

      const savedCart = localStorage.getItem("feastora_cart");
      if (savedCart) setCart(JSON.parse(savedCart));

      const savedRest = localStorage.getItem("feastora_rest");
      if (savedRest) setCurrentRestaurant(JSON.parse(savedRest));
    } catch (e) {
      console.error("Storage error:", e);
    }
  }, []);

  // Save changes
  useEffect(() => {
    try {
      localStorage.setItem("feastora_cart", JSON.stringify(cart));
      if (currentRestaurant) {
        localStorage.setItem("feastora_rest", JSON.stringify(currentRestaurant));
      } else {
        localStorage.removeItem("feastora_rest");
      }
    } catch (e) {
      console.error("Storage save error:", e);
    }
  }, [cart, currentRestaurant]);

  useEffect(() => {
    try {
      if (user) {
        localStorage.setItem("feastora_user", JSON.stringify(user));
      } else {
        localStorage.removeItem("feastora_user");
      }
    } catch (e) {}
  }, [user]);

  const addToCart = (item: MenuItem, restaurant: Restaurant, options: string[] = []) => {
    // If cart has items from different restaurant, confirm switch
    if (cart.length > 0 && currentRestaurant && currentRestaurant.id !== restaurant._id) {
      const confirmSwitch = window.confirm(
        `Your cart contains items from "${currentRestaurant.name}". Would you like to clear your cart and start a new order from "${restaurant.name}"?`
      );
      if (!confirmSwitch) return;
      setCart([]);
      setAppliedDeal(null);
    }

    setCurrentRestaurant({ id: restaurant._id, name: restaurant.name });

    // Item unit price calculation
    const basePrice = item.discountPrice || item.price;
    const itemUniqueKey = `${item._id}-${options.sort().join("-")}`;

    setCart((prev) => {
      const existingIndex = prev.findIndex((ci) => ci.id === itemUniqueKey);
      if (existingIndex > -1) {
        const next = [...prev];
        next[existingIndex].quantity += 1;
        next[existingIndex].itemTotal = next[existingIndex].quantity * basePrice;
        return next;
      } else {
        return [
          ...prev,
          {
            id: itemUniqueKey,
            menuItem: item,
            restaurantId: restaurant._id,
            restaurantName: restaurant.name,
            selectedOptions: options,
            quantity: 1,
            itemTotal: basePrice,
          },
        ];
      }
    });

    setIsCartOpen(true);
  };

  const removeFromCart = (cartItemId: string) => {
    setCart((prev) => {
      const next = prev.filter((item) => item.id !== cartItemId);
      if (next.length === 0) {
        setCurrentRestaurant(null);
        setAppliedDeal(null);
      }
      return next;
    });
  };

  const updateQuantity = (cartItemId: string, delta: number) => {
    setCart((prev) => {
      return prev
        .map((item) => {
          if (item.id === cartItemId) {
            const nextQty = item.quantity + delta;
            if (nextQty <= 0) return null;
            const unitPrice = item.menuItem.discountPrice || item.menuItem.price;
            return {
              ...item,
              quantity: nextQty,
              itemTotal: nextQty * unitPrice,
            };
          }
          return item;
        })
        .filter(Boolean) as CartItem[];
    });
  };

  const clearCart = () => {
    setCart([]);
    setCurrentRestaurant(null);
    setAppliedDeal(null);
    setCouponError("");
  };

  const subtotal = cart.reduce((sum, item) => sum + item.itemTotal, 0);
  const deliveryFee = serviceType === "delivery" && cart.length > 0 ? 49 : 0;
  const discount = appliedDeal ? appliedDeal.discountAmount : 0;
  const total = Math.max(0, subtotal + deliveryFee - discount);
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const applyVoucher = async (code: string) => {
    setCouponError("");
    try {
      const res = await applyCoupon(code, subtotal);
      if (res.success && res.deal) {
        setAppliedDeal({
          code: res.deal.code,
          discountAmount: res.deal.discountAmount,
        });
        return true;
      } else {
        setCouponError(res.message || "Invalid voucher code");
        return false;
      }
    } catch (err: any) {
      setCouponError(err.message || "Could not validate voucher");
      return false;
    }
  };

  const removeVoucher = () => {
    setAppliedDeal(null);
    setCouponError("");
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        cartCount,
        currentRestaurant,
        selectedArea,
        setSelectedArea,
        serviceType,
        setServiceType,
        isCartOpen,
        setIsCartOpen,
        isAuthOpen,
        setIsAuthOpen,
        user,
        setUser,
        appliedDeal,
        couponError,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        applyVoucher,
        removeVoucher,
        subtotal,
        deliveryFee,
        discount,
        total,
        activeItemModal,
        setActiveItemModal,
        isReservationOpen,
        setIsReservationOpen,
        reservations,
        bookTable,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
