// ─────────────────────────────────────────────────────────────
// Feastora API — Demo Mode (All data served from mockData.ts)
// No backend required. Safe to deploy on Vercel without backend.
// ─────────────────────────────────────────────────────────────

import {
  mockCategories,
  mockDeals,
  mockRestaurants,
  mockMenuItems,
  mockReviews,
  mockOrders,
  getMockRestaurantDetails,
  validateMockCoupon,
} from "./mockData";

// Keep API_BASE exported so existing imports don't break
export const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5050/api";

// ─── Interfaces ───────────────────────────────────────────────

export interface MenuItemOption {
  name: string;
  type?: "radio" | "checkbox";
  required?: boolean;
  choices: {
    label: string;
    extraPrice: number;
  }[];
}

export interface MenuItem {
  _id: string;
  restaurantId: string | { _id: string; name: string; slug: string; logo?: string };
  name: string;
  description: string;
  price: number;
  discountPrice?: number | null;
  category: string;
  image: string;
  isVeg?: boolean;
  isSpicy?: boolean;
  isPopular?: boolean;
  isChefSpecial?: boolean;
  preparationTime?: string;
  dietaryTags?: string[];
  options?: MenuItemOption[];
}

export interface Restaurant {
  _id: string;
  name: string;
  slug: string;
  tagline: string;
  description: string;
  logo: string;
  banner: string;
  pdfMenuUrl?: string;
  rating: number;
  ratingCount: number;
  deliveryTime: string;
  deliveryFee: number;
  minOrder: number;
  priceTier: "$" | "$$" | "$$$" | "$$$$";
  cuisines: string[];
  area: string;
  address: string;
  openingHours: string;
  isOpen: boolean;
  isFeatured: boolean;
  isPromoted?: boolean;
  discountText?: string;
  tags?: string[];
  menuCategories?: string[];
}

export interface Category {
  _id: string;
  name: string;
  slug: string;
  icon: string;
  image: string;
  description: string;
  displayOrder: number;
}

export interface Deal {
  _id: string;
  code: string;
  title: string;
  description: string;
  discountPercent: number;
  flatDiscount: number;
  maxDiscount: number;
  minSpend: number;
  badgeText: string;
  icon: string;
}

export interface Review {
  _id: string;
  restaurantId: string;
  userName: string;
  rating: number;
  comment: string;
  tag?: string;
  createdAt?: string;
}

export interface CartItem {
  id: string;
  menuItem: MenuItem;
  restaurantId: string;
  restaurantName: string;
  selectedOptions?: string[];
  quantity: number;
  itemTotal: number;
}

export interface Order {
  _id: string;
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  deliveryAddress: {
    area: string;
    fullAddress: string;
    instructions?: string;
  };
  serviceType: "delivery" | "pickup" | "dinein";
  restaurant: {
    id: string;
    name: string;
  };
  items: {
    menuItemId: string;
    name: string;
    price: number;
    quantity: number;
    selectedOptions?: string[];
    itemTotal: number;
  }[];
  subtotal: number;
  deliveryFee: number;
  discount: number;
  couponCode?: string;
  total: number;
  paymentMethod: "cod" | "bkash" | "card";
  paymentStatus: "pending" | "paid" | "refunded";
  orderStatus: "placed" | "confirmed" | "cooking" | "on_the_way" | "delivered" | "cancelled";
  estimatedDeliveryTime: string;
  createdAt: string;
}

// ─── Data Fetch Functions (Demo Mode — no HTTP calls) ─────────

export async function fetchRestaurants(params?: {
  search?: string;
  cuisine?: string;
  area?: string;
  featured?: boolean;
  sort?: string;
}): Promise<Restaurant[]> {
  // Simulate async
  await Promise.resolve();
  let list = [...mockRestaurants];
  if (params?.featured) list = list.filter((r) => r.isFeatured);
  if (params?.cuisine && params.cuisine !== "all") {
    list = list.filter((r) =>
      r.cuisines.some((c) => c.toLowerCase().includes(params.cuisine!.toLowerCase()))
    );
  }
  if (params?.search) {
    const term = params.search.toLowerCase();
    list = list.filter(
      (r) =>
        r.name.toLowerCase().includes(term) ||
        r.cuisines.some((c) => c.toLowerCase().includes(term)) ||
        r.tagline?.toLowerCase().includes(term)
    );
  }
  return list;
}

export async function fetchRestaurantDetails(idOrSlug: string): Promise<{
  restaurant: Restaurant;
  groupedMenu: { category: string; items: MenuItem[] }[];
  allItems: MenuItem[];
  reviews: Review[];
}> {
  await Promise.resolve();
  const data = getMockRestaurantDetails(idOrSlug);
  if (!data) throw new Error("Restaurant not found");
  return data;
}

export async function fetchCategories(): Promise<Category[]> {
  await Promise.resolve();
  return [...mockCategories];
}

export async function fetchDeals(): Promise<Deal[]> {
  await Promise.resolve();
  return [...mockDeals];
}

export async function fetchPopularDishes(): Promise<{ item: MenuItem; restaurant: Restaurant }[]> {
  await Promise.resolve();
  const popular = mockMenuItems.filter((m) => m.isPopular);
  return popular.slice(0, 8).map((item) => {
    const restaurant = mockRestaurants.find((r) => r._id === item.restaurantId) || mockRestaurants[0];
    return { item, restaurant };
  });
}

export async function fetchAllOrders(): Promise<Order[]> {
  await Promise.resolve();
  return [...mockOrders];
}

export async function fetchAllItems(): Promise<MenuItem[]> {
  await Promise.resolve();
  return [...mockMenuItems];
}

export async function fetchAllReviews(): Promise<Review[]> {
  await Promise.resolve();
  return [...mockReviews];
}

// ─── Apply Coupon (local validation, no backend) ──────────────
export async function applyCoupon(code: string, subtotal: number) {
  await Promise.resolve();
  return validateMockCoupon(code, subtotal);
}

// ─── Place Order (demo — just resolves with a mock confirmation) ─
export async function submitOrder(orderData: Partial<Order>) {
  await Promise.resolve();
  return {
    success: true,
    message: "Order placed successfully! (Demo Mode)",
    data: {
      ...orderData,
      _id: `demo_${Date.now()}`,
      orderNumber: `FST-${Math.floor(Math.random() * 900) + 100}`,
      orderStatus: "placed",
      paymentStatus: "pending",
      estimatedDeliveryTime: "30-45 min",
      createdAt: new Date().toISOString(),
    },
  };
}

// ─── Fetch Order tracking (demo — look up from mockOrders) ───
export async function fetchOrder(idOrNumber: string): Promise<Order> {
  await Promise.resolve();
  const found = mockOrders.find(
    (o) => o._id === idOrNumber || o.orderNumber === idOrNumber
  );
  if (found) return found;
  // Return a generic demo order if not found
  return mockOrders[0];
}

// ─── Upload (demo — not available without backend) ────────────
export async function uploadToCloudinaryEndpoint(
  _file: File,
  _folder = "feastora"
): Promise<{
  success: boolean;
  data: { url: string; publicId: string; format: string; bytes: number };
  message: string;
}> {
  return {
    success: false,
    data: { url: "", publicId: "", format: "", bytes: 0 },
    message: "Upload unavailable in demo mode.",
  };
}

// ─── Demo Login ───────────────────────────────────────────────
export async function apiDemoLogin(role: "user" | "partner" = "user") {
  await Promise.resolve();
  if (role === "partner") {
    return {
      success: true,
      user: { id: "partner_demo", name: "Kitchen Partner Demo", email: "partner@feastora.demo", role: "partner" },
    };
  }
  return {
    success: true,
    user: { id: "user_demo", name: "Mahfuz Demo", email: "mahfuz@feastora.demo", role: "user" },
  };
}
