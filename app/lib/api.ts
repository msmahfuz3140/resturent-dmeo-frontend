export const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5050/api";

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

// Fetch all restaurants
export async function fetchRestaurants(params?: {
  search?: string;
  cuisine?: string;
  area?: string;
  featured?: boolean;
  sort?: string;
}): Promise<Restaurant[]> {
  const query = new URLSearchParams();
  if (params?.search) query.append("search", params.search);
  if (params?.cuisine && params.cuisine !== "all") query.append("cuisine", params.cuisine);
  if (params?.area && params.area !== "all") query.append("area", params.area);
  if (params?.featured) query.append("featured", "true");
  if (params?.sort) query.append("sort", params.sort);

  const res = await fetch(`${API_BASE}/restaurants?${query.toString()}`, { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to load restaurants");
  const json = await res.json();
  return json.data || [];
}

// Fetch single restaurant with menu and reviews
export async function fetchRestaurantDetails(idOrSlug: string): Promise<{
  restaurant: Restaurant;
  groupedMenu: { category: string; items: MenuItem[] }[];
  allItems: MenuItem[];
  reviews: Review[];
}> {
  const res = await fetch(`${API_BASE}/restaurants/${idOrSlug}`, { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to load restaurant details");
  const json = await res.json();
  return json.data;
}

// Fetch categories
export async function fetchCategories(): Promise<Category[]> {
  const res = await fetch(`${API_BASE}/categories`, { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to load categories");
  const json = await res.json();
  return json.data || [];
}

// Fetch deals
export async function fetchDeals(): Promise<Deal[]> {
  const res = await fetch(`${API_BASE}/deals`, { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to load deals");
  const json = await res.json();
  return json.data || [];
}

// Apply coupon code
export async function applyCoupon(code: string, subtotal: number) {
  const res = await fetch(`${API_BASE}/deals/apply`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ code, subtotal }),
  });
  return res.json();
}

// Place Order
export async function submitOrder(orderData: Partial<Order>) {
  const res = await fetch(`${API_BASE}/orders`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(orderData),
  });
  return res.json();
}

// Fetch Order tracking details
export async function fetchOrder(idOrNumber: string): Promise<Order> {
  const res = await fetch(`${API_BASE}/orders/${idOrNumber}`, { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to load order");
  const json = await res.json();
  return json.data;
}

// Upload Image / PDF (Cloudinary via backend endpoint)
export async function uploadToCloudinaryEndpoint(file: File, folder = "feastora"): Promise<{
  success: boolean;
  data: { url: string; publicId: string; format: string; bytes: number };
  message: string;
}> {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("folder", folder);

  const res = await fetch(`${API_BASE}/upload`, {
    method: "POST",
    body: formData,
  });
  return res.json();
}

// Demo Login
export async function apiDemoLogin(role: "user" | "partner" = "user") {
  const res = await fetch(`${API_BASE}/auth-demo-login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ role }),
  });
  return res.json();
}
