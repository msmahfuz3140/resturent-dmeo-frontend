"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import {
  API_BASE,
  Restaurant,
  Order,
  Deal,
  MenuItem,
  Review,
  fetchRestaurants,
  fetchDeals,
} from "../lib/api";
import {
  ShieldCheckIcon,
  ClockIcon,
  BikeIcon,
  TagIcon,
  ClocheIcon,
  CheckIcon,
  PlusIcon,
  XIcon,
  FlameIcon,
  StarIcon,
  ShoppingBagIcon,
  SearchIcon,
} from "../components/Icons";

export default function AdminDashboardPage() {
  const [activeTab, setActiveTab] = useState<
    "orders" | "restaurants" | "items" | "deals" | "reservations" | "reviews"
  >("orders");

  const [stats, setStats] = useState<any>({
    restaurants: 6,
    items: 24,
    orders: 12,
    deals: 4,
    reservations: 3,
    reviews: 6,
    totalRevenue: 8450,
  });

  const [orders, setOrders] = useState<Order[]>([]);
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [items, setItems] = useState<any[]>([]);
  const [deals, setDeals] = useState<Deal[]>([]);
  const [reservations, setReservations] = useState<any[]>([]);
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionMessage, setActionMessage] = useState("");
  const [reSeeding, setReSeeding] = useState(false);

  // Filters
  const [orderFilter, setOrderFilter] = useState<string>("all");
  const [dishRestFilter, setDishRestFilter] = useState<string>("all");

  // New Deal Modal
  const [isNewDealOpen, setIsNewDealOpen] = useState(false);
  const [dealCode, setDealCode] = useState("");
  const [dealTitle, setDealTitle] = useState("");
  const [dealDiscount, setDealDiscount] = useState("20");
  const [dealMinSpend, setDealMinSpend] = useState("400");

  // New Dish Modal
  const [isNewDishOpen, setIsNewDishOpen] = useState(false);
  const [dishRestId, setDishRestId] = useState("");
  const [dishName, setDishName] = useState("");
  const [dishPrice, setDishPrice] = useState("");
  const [dishCategory, setDishCategory] = useState("Signature Mains");
  const [dishImg, setDishImg] = useState("");
  const [dishDesc, setDishDesc] = useState("");

  const loadAllAdminData = async () => {
    setLoading(true);
    try {
      const [statsRes, ordersRes, restRes, dealsRes, resRes, itemsRes, reviewsRes] = await Promise.all([
        fetch(`${API_BASE}/stats`).then((r) => r.json()).catch(() => ({ stats: {} })),
        fetch(`${API_BASE}/orders?limit=100`).then((r) => r.json()).catch(() => ({ data: [] })),
        fetchRestaurants().catch(() => []),
        fetchDeals().catch(() => []),
        fetch(`${API_BASE}/reservations`).then((r) => r.json()).catch(() => ({ data: [] })),
        fetch(`${API_BASE}/items`).then((r) => r.json()).catch(() => ({ data: [] })),
        fetch(`${API_BASE}/reviews`).then((r) => r.json()).catch(() => ({ data: [] })),
      ]);

      if (statsRes.stats) setStats(statsRes.stats);
      setOrders(ordersRes.data || []);
      setRestaurants(restRes || []);
      setDeals(dealsRes || []);
      setReservations(resRes.data || []);
      setItems(itemsRes.data || []);
      setReviews(reviewsRes.data || []);

      if (restRes && restRes.length > 0 && !dishRestId) {
        setDishRestId(restRes[0]._id);
      }
    } catch (e) {
      console.error("Admin load error:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAllAdminData();
    const timer = setInterval(loadAllAdminData, 15000);
    return () => clearInterval(timer);
  }, []);

  // 1. Advance Order Status
  const handleUpdateOrderStatus = async (orderId: string, nextStatus: string) => {
    try {
      const res = await fetch(`${API_BASE}/orders/${orderId}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: nextStatus }),
      });
      const data = await res.json();
      if (data.success) {
        setActionMessage(`Order #${orderId.slice(-6)} status updated to "${nextStatus}"`);
        loadAllAdminData();
        setTimeout(() => setActionMessage(""), 3500);
      }
    } catch (e) {
      console.error(e);
    }
  };

  // 2. Cancel Order
  const handleCancelOrder = async (orderId: string) => {
    if (!window.confirm("Are you sure you want to cancel this order?")) return;
    try {
      const res = await fetch(`${API_BASE}/orders/${orderId}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "cancelled" }),
      });
      if (res.ok) {
        setActionMessage("Order marked as cancelled");
        loadAllAdminData();
        setTimeout(() => setActionMessage(""), 3500);
      }
    } catch (e) {
      console.error(e);
    }
  };

  // 3. Toggle Kitchen Open / Closed
  const handleToggleRestaurantStatus = async (restId: string, currentStatus: boolean) => {
    try {
      const res = await fetch(`${API_BASE}/restaurants/${restId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isOpen: !currentStatus }),
      });
      if (res.ok) {
        setActionMessage("Kitchen acceptance status toggled successfully");
        loadAllAdminData();
        setTimeout(() => setActionMessage(""), 3000);
      }
    } catch (e) {
      console.error(e);
    }
  };

  // 4. Delete Restaurant
  const handleDeleteRestaurant = async (restId: string, name: string) => {
    if (!window.confirm(`Delete restaurant "${name}" and all of its associated menu items?`)) return;
    try {
      const res = await fetch(`${API_BASE}/restaurants/${restId}`, { method: "DELETE" });
      if (res.ok) {
        setActionMessage(`Restaurant "${name}" removed from platform`);
        loadAllAdminData();
        setTimeout(() => setActionMessage(""), 3500);
      }
    } catch (e) {
      console.error(e);
    }
  };

  // 5. Toggle Dish Popular
  const handleToggleDishPopular = async (itemId: string, currentVal: boolean) => {
    try {
      const res = await fetch(`${API_BASE}/items/${itemId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isPopular: !currentVal }),
      });
      if (res.ok) {
        setActionMessage("Dish popularity updated");
        loadAllAdminData();
        setTimeout(() => setActionMessage(""), 3000);
      }
    } catch (e) {
      console.error(e);
    }
  };

  // 6. Delete Dish
  const handleDeleteDish = async (itemId: string, name: string) => {
    if (!window.confirm(`Remove "${name}" from restaurant menu?`)) return;
    try {
      const res = await fetch(`${API_BASE}/items/${itemId}`, { method: "DELETE" });
      if (res.ok) {
        setActionMessage(`Dish "${name}" removed from database`);
        loadAllAdminData();
        setTimeout(() => setActionMessage(""), 3500);
      }
    } catch (e) {
      console.error(e);
    }
  };

  // 7. Create New Dish
  const handleCreateDish = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!dishRestId || !dishName || !dishPrice) return;
    try {
      const res = await fetch(`${API_BASE}/items`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          restaurantId: dishRestId,
          name: dishName,
          description: dishDesc || "Chef crafted artisanal delicacy with premium ingredients.",
          price: Number(dishPrice),
          category: dishCategory,
          image: dishImg || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&auto=format&fit=crop&q=80",
          isPopular: true,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setActionMessage(`Dish "${dishName}" created successfully!`);
        setIsNewDishOpen(false);
        setDishName("");
        setDishPrice("");
        setDishDesc("");
        setDishImg("");
        loadAllAdminData();
        setTimeout(() => setActionMessage(""), 3500);
      }
    } catch (e) {
      console.error(e);
    }
  };

  // 8. Create Deal
  const handleCreateDeal = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_BASE}/deals`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code: dealCode.toUpperCase().trim(),
          title: dealTitle,
          discountPercent: Number(dealDiscount),
          minSpend: Number(dealMinSpend),
          badgeText: "HOT DEAL",
        }),
      });
      const data = await res.json();
      if (data.success) {
        setActionMessage(`Voucher ${dealCode} published successfully!`);
        setIsNewDealOpen(false);
        setDealCode("");
        setDealTitle("");
        loadAllAdminData();
        setTimeout(() => setActionMessage(""), 3500);
      }
    } catch (e) {
      console.error(e);
    }
  };

  // 9. Delete Deal
  const handleDeleteDeal = async (id: string) => {
    if (!window.confirm("Delete this promotional voucher?")) return;
    try {
      await fetch(`${API_BASE}/deals/${id}`, { method: "DELETE" });
      setActionMessage("Voucher deleted");
      loadAllAdminData();
      setTimeout(() => setActionMessage(""), 3000);
    } catch (e) {
      console.error(e);
    }
  };

  // 10. Table Reservation Status & Delete
  const handleUpdateReservationStatus = async (id: string, status: string) => {
    try {
      await fetch(`${API_BASE}/reservations/${id}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      setActionMessage("Reservation status updated");
      loadAllAdminData();
      setTimeout(() => setActionMessage(""), 3000);
    } catch (e) {
      console.error(e);
    }
  };

  const handleDeleteReservation = async (id: string) => {
    if (!window.confirm("Cancel and delete this reservation?")) return;
    try {
      await fetch(`${API_BASE}/reservations/${id}`, { method: "DELETE" });
      setActionMessage("Reservation removed");
      loadAllAdminData();
      setTimeout(() => setActionMessage(""), 3000);
    } catch (e) {
      console.error(e);
    }
  };

  // 11. Delete Review
  const handleDeleteReview = async (id: string) => {
    if (!window.confirm("Remove this customer review from platform?")) return;
    try {
      await fetch(`${API_BASE}/reviews/${id}`, { method: "DELETE" });
      setActionMessage("Review moderated and removed");
      loadAllAdminData();
      setTimeout(() => setActionMessage(""), 3000);
    } catch (e) {
      console.error(e);
    }
  };

  // 12. Re-Seed Clean Demo Data
  const handleReSeedDemo = async () => {
    if (!window.confirm("Re-seed the entire database to the pristine demo dataset (6 restaurants, 24 dishes, deals, sample orders)?")) return;
    setReSeeding(true);
    try {
      const res = await fetch(`${API_BASE}/seed`, { method: "POST" });
      const data = await res.json();
      if (data.success) {
        setActionMessage("Feastora MongoDB database re-seeded and restored to pristine demo state!");
        await loadAllAdminData();
        setTimeout(() => setActionMessage(""), 4500);
      }
    } catch (e) {
      console.error("Re-seed error:", e);
    } finally {
      setReSeeding(false);
    }
  };

  // Filtered orders
  const filteredOrders = orders.filter((o) => {
    if (orderFilter === "all") return true;
    return o.orderStatus === orderFilter;
  });

  // Filtered items
  const filteredItems = items.filter((it) => {
    if (dishRestFilter === "all") return true;
    const rId = typeof it.restaurantId === "object" ? it.restaurantId?._id : it.restaurantId;
    return rId === dishRestFilter;
  });

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">
        {/* Top Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs font-bold uppercase tracking-wider text-amber-700">
                Live Admin Operations
              </span>
            </div>
            <h1 className="text-3xl font-black text-slate-900 font-serif">
              Feastora Command Center
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Real-time MongoDB platform management: live orders, kitchens, menu items, vouchers, tables, and customer reviews.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            {/* Re-seed demo button */}
            <button
              type="button"
              disabled={reSeeding}
              onClick={handleReSeedDemo}
              className="px-3.5 py-2 bg-white hover:bg-slate-100 text-slate-800 font-bold text-xs rounded-xl border border-slate-200 shadow-xs transition flex items-center gap-1.5"
              title="Restores 6 pristine restaurants, 24 dishes, deals, and sample data for client demo"
            >
              <span>{reSeeding ? "Restoring..." : "⚡ Re-Seed Demo Data"}</span>
            </button>

            {/* Quick Add Dish button */}
            <button
              type="button"
              onClick={() => setIsNewDishOpen(true)}
              className="px-3.5 py-2 bg-white hover:bg-slate-100 text-slate-800 font-bold text-xs rounded-xl border border-slate-200 shadow-xs transition flex items-center gap-1.5"
            >
              <PlusIcon size={14} className="text-amber-600" />
              <span>Add Dish</span>
            </button>

            {/* Create Voucher button */}
            <button
              type="button"
              onClick={() => setIsNewDealOpen(true)}
              className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow-xs transition flex items-center gap-1.5"
            >
              <TagIcon size={14} className="text-amber-400" />
              <span>Create Voucher</span>
            </button>

            {/* Partner Studio Link */}
            <Link
              href="/partner"
              className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl shadow-xs transition flex items-center gap-1.5"
            >
              <PlusIcon size={14} />
              <span>Partner Studio</span>
            </Link>
          </div>
        </div>

        {/* Global Feedback Alert */}
        {actionMessage && (
          <div className="mb-6 p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl text-xs font-semibold flex items-center gap-2.5 animate-fade-in shadow-xs">
            <CheckIcon size={16} className="text-emerald-600" />
            <span>{actionMessage}</span>
          </div>
        )}

        {/* KPI Metrics Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5 mb-8">
          <div className="p-4 rounded-3xl bg-white border border-slate-200 shadow-xs">
            <span className="text-[10px] font-bold text-slate-400 uppercase">Gross Revenue</span>
            <h3 className="text-xl font-black text-slate-900 font-serif mt-1">
              {stats.totalRevenue ? `${stats.totalRevenue} ৳` : "8,450 ৳"}
            </h3>
            <span className="text-[10px] text-emerald-700 font-semibold">↑ +18.4% this week</span>
          </div>

          <div className="p-4 rounded-3xl bg-white border border-slate-200 shadow-xs">
            <span className="text-[10px] font-bold text-slate-400 uppercase">Live Orders</span>
            <h3 className="text-xl font-black text-slate-900 font-serif mt-1">
              {orders.length}
            </h3>
            <span className="text-[10px] text-slate-500">Dispatch tickets</span>
          </div>

          <div className="p-4 rounded-3xl bg-white border border-slate-200 shadow-xs">
            <span className="text-[10px] font-bold text-slate-400 uppercase">Kitchens</span>
            <h3 className="text-xl font-black text-slate-900 font-serif mt-1">
              {restaurants.length}
            </h3>
            <span className="text-[10px] text-amber-700 font-semibold">Verified partners</span>
          </div>

          <div className="p-4 rounded-3xl bg-white border border-slate-200 shadow-xs">
            <span className="text-[10px] font-bold text-slate-400 uppercase">Menu Dishes</span>
            <h3 className="text-xl font-black text-slate-900 font-serif mt-1">
              {items.length}
            </h3>
            <span className="text-[10px] text-slate-500">Live delicacies</span>
          </div>

          <div className="p-4 rounded-3xl bg-white border border-slate-200 shadow-xs">
            <span className="text-[10px] font-bold text-slate-400 uppercase">Table Bookings</span>
            <h3 className="text-xl font-black text-slate-900 font-serif mt-1">
              {reservations.length}
            </h3>
            <span className="text-[10px] text-slate-500">Dine-in guests</span>
          </div>

          <div className="p-4 rounded-3xl bg-white border border-slate-200 shadow-xs">
            <span className="text-[10px] font-bold text-slate-400 uppercase">Diner Reviews</span>
            <h3 className="text-xl font-black text-slate-900 font-serif mt-1">
              {reviews.length}
            </h3>
            <span className="text-[10px] text-emerald-700 font-semibold">★ 4.9 Foodie score</span>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-200 mb-6 gap-2 overflow-x-auto no-scrollbar">
          {[
            { id: "orders", label: `📦 Live Orders (${orders.length})` },
            { id: "restaurants", label: `🏨 Kitchens (${restaurants.length})` },
            { id: "items", label: `🍲 Menu Dishes (${items.length})` },
            { id: "deals", label: `🎟️ Vouchers (${deals.length})` },
            { id: "reservations", label: `🍷 Table Bookings (${reservations.length})` },
            { id: "reviews", label: `⭐ Reviews (${reviews.length})` },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id as any)}
              className={`pb-3 px-4 text-xs font-bold transition border-b-2 whitespace-nowrap ${
                activeTab === tab.id
                  ? "border-amber-500 text-amber-700"
                  : "border-transparent text-slate-500 hover:text-slate-800"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* ============================================================== */}
        {/* TAB 1: LIVE ORDERS QUEUE */}
        {/* ============================================================== */}
        {activeTab === "orders" && (
          <div className="rounded-3xl bg-white border border-slate-200 shadow-xs overflow-hidden">
            <div className="p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-base font-bold text-slate-900 font-serif">Customer Order Queue</h3>
                <p className="text-xs text-slate-500">Real-time status controls for live courier dispatch</p>
              </div>

              {/* Status Filter Pills */}
              <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar text-xs">
                {[
                  { id: "all", label: "All" },
                  { id: "placed", label: "Placed" },
                  { id: "cooking", label: "Cooking" },
                  { id: "on_the_way", label: "On Road" },
                  { id: "delivered", label: "Delivered" },
                  { id: "cancelled", label: "Cancelled" },
                ].map((pill) => (
                  <button
                    key={pill.id}
                    type="button"
                    onClick={() => setOrderFilter(pill.id)}
                    className={`px-3 py-1 rounded-xl font-bold transition whitespace-nowrap ${
                      orderFilter === pill.id
                        ? "bg-slate-900 text-white"
                        : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                    }`}
                  >
                    {pill.label}
                  </button>
                ))}
              </div>
            </div>

            {filteredOrders.length === 0 ? (
              <div className="text-center py-16">
                <p className="text-xs text-slate-400">No orders found for filter "{orderFilter}".</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider font-semibold text-[10px]">
                    <tr>
                      <th className="py-3 px-4">Order #</th>
                      <th className="py-3 px-4">Customer</th>
                      <th className="py-3 px-4">Kitchen</th>
                      <th className="py-3 px-4">Items</th>
                      <th className="py-3 px-4">Total</th>
                      <th className="py-3 px-4">Payment</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium">
                    {filteredOrders.map((o) => (
                      <tr key={o._id} className="hover:bg-slate-50/80 transition">
                        <td className="py-3 px-4 font-mono font-bold text-slate-900">
                          <Link href={`/orders/${o.orderNumber}`} className="hover:text-amber-600 underline">
                            {o.orderNumber}
                          </Link>
                        </td>
                        <td className="py-3 px-4">
                          <p className="font-bold text-slate-800">{o.customerName}</p>
                          <p className="text-[10px] text-slate-400">{o.customerPhone}</p>
                        </td>
                        <td className="py-3 px-4 font-semibold text-slate-700">
                          {o.restaurant?.name || "Kitchen"}
                        </td>
                        <td className="py-3 px-4 text-slate-600 max-w-[200px] truncate" title={o.items?.map((it) => `${it.quantity}x ${it.name}`).join(", ")}>
                          {o.items?.map((it) => `${it.quantity}x ${it.name}`).join(", ") || "Dishes"}
                        </td>
                        <td className="py-3 px-4 font-bold text-slate-900">
                          {o.total} ৳
                        </td>
                        <td className="py-3 px-4 uppercase text-[10px] font-bold text-slate-600">
                          {o.paymentMethod} ({o.paymentStatus})
                        </td>
                        <td className="py-3 px-4">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                              o.orderStatus === "delivered"
                                ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                                : o.orderStatus === "on_the_way"
                                ? "bg-blue-50 text-blue-800 border border-blue-200"
                                : o.orderStatus === "cooking"
                                ? "bg-amber-50 text-amber-800 border border-amber-200"
                                : o.orderStatus === "cancelled"
                                ? "bg-red-50 text-red-800 border border-red-200"
                                : "bg-slate-100 text-slate-800 border border-slate-200"
                            }`}
                          >
                            {o.orderStatus.replace("_", " ")}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right space-x-1.5 whitespace-nowrap">
                          {o.orderStatus === "placed" && (
                            <button
                              type="button"
                              onClick={() => handleUpdateOrderStatus(o._id, "confirmed")}
                              className="px-2.5 py-1 bg-amber-500 hover:bg-amber-400 text-slate-950 text-[10px] font-bold rounded-lg shadow-xs"
                            >
                              Confirm
                            </button>
                          )}
                          {o.orderStatus === "confirmed" && (
                            <button
                              type="button"
                              onClick={() => handleUpdateOrderStatus(o._id, "cooking")}
                              className="px-2.5 py-1 bg-amber-600 hover:bg-amber-500 text-white text-[10px] font-bold rounded-lg shadow-xs"
                            >
                              Start Cooking
                            </button>
                          )}
                          {o.orderStatus === "cooking" && (
                            <button
                              type="button"
                              onClick={() => handleUpdateOrderStatus(o._id, "on_the_way")}
                              className="px-2.5 py-1 bg-blue-600 hover:bg-blue-500 text-white text-[10px] font-bold rounded-lg shadow-xs"
                            >
                              Dispatch Courier
                            </button>
                          )}
                          {o.orderStatus === "on_the_way" && (
                            <button
                              type="button"
                              onClick={() => handleUpdateOrderStatus(o._id, "delivered")}
                              className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-500 text-white text-[10px] font-bold rounded-lg shadow-xs"
                            >
                              Mark Delivered
                            </button>
                          )}
                          {o.orderStatus !== "delivered" && o.orderStatus !== "cancelled" && (
                            <button
                              type="button"
                              onClick={() => handleCancelOrder(o._id)}
                              className="px-2 py-1 bg-white hover:bg-red-50 text-red-600 border border-red-200 text-[10px] font-bold rounded-lg transition"
                              title="Cancel order"
                            >
                              Cancel
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* ============================================================== */}
        {/* TAB 2: PARTNER KITCHENS */}
        {/* ============================================================== */}
        {activeTab === "restaurants" && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <p className="text-xs text-slate-500">Manage verified culinary houses, operational statuses, and menus</p>
              <Link
                href="/partner"
                className="px-3.5 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl shadow-xs transition"
              >
                + Register New Kitchen
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {restaurants.map((r) => (
                <div
                  key={r._id}
                  className="p-5 rounded-3xl bg-white border border-slate-200 shadow-xs flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <img
                        src={r.logo}
                        alt={r.name}
                        className="w-12 h-12 rounded-2xl object-cover border border-slate-200"
                      />
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                          r.isOpen
                            ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                            : "bg-red-50 text-red-800 border border-red-200"
                        }`}
                      >
                        {r.isOpen ? "Accepting Orders" : "Kitchen Paused"}
                      </span>
                    </div>

                    <h4 className="text-sm font-bold text-slate-900 font-serif">{r.name}</h4>
                    <p className="text-xs text-slate-500 mt-0.5">{r.area}</p>
                    <p className="text-[11px] text-amber-700 font-semibold mt-1">
                      {r.cuisines?.join(", ") || "Gourmet"}
                    </p>
                    <div className="flex items-center gap-3 text-[11px] text-slate-400 mt-2">
                      <span>★ {r.rating} ({r.ratingCount} reviews)</span>
                      <span>•</span>
                      <span>ETA: {r.deliveryTime}</span>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs mt-4">
                    <Link
                      href={`/restaurant/${r.slug || r._id}`}
                      className="text-slate-600 hover:text-slate-900 font-semibold underline"
                    >
                      View Live Menu ➔
                    </Link>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => handleToggleRestaurantStatus(r._id, r.isOpen)}
                        className={`px-2.5 py-1 rounded-xl text-xs font-bold transition ${
                          r.isOpen
                            ? "bg-slate-100 text-slate-700 hover:bg-amber-50 hover:text-amber-800"
                            : "bg-emerald-50 text-emerald-800 hover:bg-emerald-100"
                        }`}
                      >
                        {r.isOpen ? "Pause" : "Open"}
                      </button>

                      <button
                        type="button"
                        onClick={() => handleDeleteRestaurant(r._id, r.name)}
                        className="px-2.5 py-1 rounded-xl text-xs font-bold bg-white text-red-600 border border-red-200 hover:bg-red-50 transition"
                        title="Delete Restaurant"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* TAB 3: MENU ITEMS & DISHES */}
        {/* ============================================================== */}
        {activeTab === "items" && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              {/* Filter by restaurant */}
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-500">Filter Kitchen:</span>
                <select
                  value={dishRestFilter}
                  onChange={(e) => setDishRestFilter(e.target.value)}
                  className="bg-white border border-slate-200 rounded-xl px-3 py-1.5 text-xs text-slate-800 font-semibold focus:outline-none focus:border-amber-500"
                >
                  <option value="all">All Kitchens ({items.length} dishes)</option>
                  {restaurants.map((r) => (
                    <option key={r._id} value={r._id}>
                      {r.name}
                    </option>
                  ))}
                </select>
              </div>

              <button
                type="button"
                onClick={() => setIsNewDishOpen(true)}
                className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl shadow-xs transition flex items-center gap-1.5"
              >
                <PlusIcon size={14} />
                <span>Add New Dish</span>
              </button>
            </div>

            <div className="rounded-3xl bg-white border border-slate-200 shadow-xs overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider font-semibold text-[10px]">
                    <tr>
                      <th className="py-3 px-4">Dish</th>
                      <th className="py-3 px-4">Kitchen</th>
                      <th className="py-3 px-4">Category</th>
                      <th className="py-3 px-4">Price</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium">
                    {filteredItems.map((it) => {
                      const restObj = typeof it.restaurantId === "object" ? it.restaurantId : null;
                      const restName = restObj?.name || restaurants.find((r) => r._id === it.restaurantId)?.name || "Kitchen";
                      return (
                        <tr key={it._id} className="hover:bg-slate-50/80 transition">
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-3">
                              <img
                                src={it.image || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=100"}
                                alt={it.name}
                                className="w-10 h-10 rounded-xl object-cover border border-slate-200"
                              />
                              <div>
                                <p className="font-bold text-slate-900">{it.name}</p>
                                <p className="text-[10px] text-slate-400 max-w-[220px] truncate">{it.description}</p>
                              </div>
                            </div>
                          </td>
                          <td className="py-3 px-4 font-semibold text-slate-700">{restName}</td>
                          <td className="py-3 px-4 text-slate-600">{it.category || "Main"}</td>
                          <td className="py-3 px-4 font-bold text-slate-900">
                            {it.discountPrice ? (
                              <div className="flex items-center gap-1.5">
                                <span>{it.discountPrice} ৳</span>
                                <span className="text-[10px] text-slate-400 line-through">{it.price} ৳</span>
                              </div>
                            ) : (
                              `${it.price} ৳`
                            )}
                          </td>
                          <td className="py-3 px-4">
                            <span
                              className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                                it.isPopular
                                  ? "bg-amber-50 text-amber-800 border border-amber-200"
                                  : "bg-slate-100 text-slate-700"
                              }`}
                            >
                              {it.isPopular ? "🔥 Popular" : "Standard"}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-right space-x-1.5 whitespace-nowrap">
                            <button
                              type="button"
                              onClick={() => handleToggleDishPopular(it._id, it.isPopular)}
                              className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-800 text-[10px] font-bold rounded-lg transition"
                            >
                              {it.isPopular ? "Unmark Popular" : "Set Popular"}
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeleteDish(it._id, it.name)}
                              className="px-2 py-1 bg-white hover:bg-red-50 text-red-600 border border-red-200 text-[10px] font-bold rounded-lg transition"
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* TAB 4: VOUCHERS & DEALS */}
        {/* ============================================================== */}
        {activeTab === "deals" && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <p className="text-xs text-slate-500">Active promotional vouchers directly validated at bag checkout</p>
              <button
                type="button"
                onClick={() => setIsNewDealOpen(true)}
                className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl shadow-xs transition flex items-center gap-1.5"
              >
                <PlusIcon size={14} />
                <span>Add New Coupon</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {deals.map((d) => (
                <div
                  key={d._id}
                  className="p-5 rounded-3xl bg-white border border-slate-200 shadow-xs flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-mono font-black text-amber-700 text-sm bg-amber-50 px-2 py-0.5 rounded-lg border border-amber-200">
                        {d.code}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleDeleteDeal(d._id)}
                        className="text-slate-400 hover:text-red-600 p-1"
                        title="Delete voucher"
                      >
                        <XIcon size={14} />
                      </button>
                    </div>
                    <h4 className="text-xs font-bold text-slate-900">{d.title}</h4>
                    <p className="text-[11px] text-slate-500 mt-1">{d.description || `${d.discountPercent}% instant discount`}</p>
                  </div>

                  <div className="pt-3 border-t border-slate-100 text-[10px] text-slate-500 mt-3 flex justify-between items-center">
                    <span>Min spend: <b>{d.minSpend} ৳</b></span>
                    <span className="text-emerald-700 font-bold">{d.discountPercent}% OFF</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* TAB 5: TABLE RESERVATIONS */}
        {/* ============================================================== */}
        {activeTab === "reservations" && (
          <div className="rounded-3xl bg-white border border-slate-200 shadow-xs overflow-hidden">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-900 font-serif">Dine-In Table Bookings</h3>
                <p className="text-xs text-slate-500">Guest seating schedules saved across partner dining rooms</p>
              </div>
              <button
                type="button"
                onClick={loadAllAdminData}
                className="text-xs text-amber-700 font-bold hover:underline"
              >
                ↻ Refresh Bookings
              </button>
            </div>

            {reservations.length === 0 ? (
              <div className="text-center py-16">
                <p className="text-xs text-slate-400">No reservations placed yet. Book a table from the navbar to test!</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider font-semibold text-[10px]">
                    <tr>
                      <th className="py-3 px-4">Booking Code</th>
                      <th className="py-3 px-4">Guest Name</th>
                      <th className="py-3 px-4">Restaurant</th>
                      <th className="py-3 px-4">Party Size</th>
                      <th className="py-3 px-4">Date & Time</th>
                      <th className="py-3 px-4">Seating</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium">
                    {reservations.map((r) => (
                      <tr key={r._id} className="hover:bg-slate-50/80 transition">
                        <td className="py-3 px-4 font-mono font-bold text-amber-700">
                          {r.confirmationCode}
                        </td>
                        <td className="py-3 px-4">
                          <p className="font-bold text-slate-900">{r.customerName}</p>
                          <p className="text-[10px] text-slate-400">{r.customerPhone}</p>
                        </td>
                        <td className="py-3 px-4 font-semibold text-slate-800">
                          {r.restaurantName}
                        </td>
                        <td className="py-3 px-4 text-slate-700">{r.guests}</td>
                        <td className="py-3 px-4 font-semibold text-slate-900">{r.date}</td>
                        <td className="py-3 px-4 text-slate-600">{r.seatingArea}</td>
                        <td className="py-3 px-4">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                              r.status === "seated"
                                ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                                : "bg-amber-50 text-amber-800 border border-amber-200"
                            }`}
                          >
                            {r.status}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right space-x-1.5 whitespace-nowrap">
                          {r.status === "confirmed" && (
                            <button
                              type="button"
                              onClick={() => handleUpdateReservationStatus(r._id, "seated")}
                              className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-500 text-white text-[10px] font-bold rounded-lg shadow-xs"
                            >
                              Mark Seated
                            </button>
                          )}
                          <button
                            type="button"
                            onClick={() => handleDeleteReservation(r._id)}
                            className="px-2 py-1 bg-white hover:bg-red-50 text-red-600 border border-red-200 text-[10px] font-bold rounded-lg transition"
                          >
                            Cancel
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* ============================================================== */}
        {/* TAB 6: CUSTOMER REVIEWS */}
        {/* ============================================================== */}
        {activeTab === "reviews" && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <p className="text-xs text-slate-500">Live verified customer feedback & quality scoring</p>
              <span className="text-xs font-bold text-slate-600">{reviews.length} Total Reviews</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {reviews.map((rev) => {
                const matchedRest = restaurants.find((r) => r._id === rev.restaurantId);
                return (
                  <div
                    key={rev._id}
                    className="p-5 rounded-3xl bg-white border border-slate-200 shadow-xs flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-1 text-amber-500">
                          {[...Array(rev.rating || 5)].map((_, i) => (
                            <span key={i}>★</span>
                          ))}
                        </div>
                        <button
                          type="button"
                          onClick={() => handleDeleteReview(rev._id)}
                          className="text-slate-400 hover:text-red-600 p-1"
                          title="Delete review"
                        >
                          <XIcon size={14} />
                        </button>
                      </div>

                      <p className="text-xs text-slate-700 italic">"{rev.comment}"</p>
                    </div>

                    <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] mt-3">
                      <div>
                        <p className="font-bold text-slate-900">{rev.userName}</p>
                        <p className="text-[10px] text-slate-400">{matchedRest?.name || "Artisanal Kitchen"}</p>
                      </div>
                      <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                        {rev.tag || "Verified Diner"}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* MODAL 1: CREATE VOUCHER */}
        {/* ============================================================== */}
        {isNewDealOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
            <div className="w-full max-w-md bg-white border border-slate-200 rounded-3xl p-6 shadow-2xl relative text-slate-800">
              <button
                type="button"
                onClick={() => setIsNewDealOpen(false)}
                className="absolute top-5 right-5 text-slate-400 hover:text-slate-700"
              >
                <XIcon size={20} />
              </button>

              <h3 className="text-lg font-bold text-slate-900 font-serif mb-4">
                Publish New Discount Voucher
              </h3>

              <form onSubmit={handleCreateDeal} className="space-y-4">
                <div>
                  <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                    Coupon Code *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. VIP25"
                    value={dealCode}
                    onChange={(e) => setDealCode(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 uppercase focus:outline-none focus:border-amber-500 font-bold"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                    Title *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 25% OFF Weekend Feasts"
                    value={dealTitle}
                    onChange={(e) => setDealTitle(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                      Discount %
                    </label>
                    <input
                      type="number"
                      required
                      value={dealDiscount}
                      onChange={(e) => setDealDiscount(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 focus:outline-none focus:border-amber-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                      Min Spend (৳)
                    </label>
                    <input
                      type="number"
                      required
                      value={dealMinSpend}
                      onChange={(e) => setDealMinSpend(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 focus:outline-none focus:border-amber-500"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs rounded-xl shadow-md shadow-amber-500/20 transition mt-2"
                >
                  Publish Voucher to MongoDB
                </button>
              </form>
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* MODAL 2: ADD NEW DISH */}
        {/* ============================================================== */}
        {isNewDishOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
            <div className="w-full max-w-md bg-white border border-slate-200 rounded-3xl p-6 shadow-2xl relative text-slate-800 max-h-[90vh] overflow-y-auto">
              <button
                type="button"
                onClick={() => setIsNewDishOpen(false)}
                className="absolute top-5 right-5 text-slate-400 hover:text-slate-700"
              >
                <XIcon size={20} />
              </button>

              <h3 className="text-lg font-bold text-slate-900 font-serif mb-4">
                Add Menu Dish Directly
              </h3>

              <form onSubmit={handleCreateDish} className="space-y-4">
                <div>
                  <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                    Select Kitchen *
                  </label>
                  <select
                    value={dishRestId}
                    onChange={(e) => setDishRestId(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 focus:outline-none focus:border-amber-500 font-semibold"
                  >
                    {restaurants.map((r) => (
                      <option key={r._id} value={r._id}>
                        {r.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                    Dish Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Royal Mutton Galouti Kebab"
                    value={dishName}
                    onChange={(e) => setDishName(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                      Price (৳) *
                    </label>
                    <input
                      type="number"
                      required
                      placeholder="e.g. 590"
                      value={dishPrice}
                      onChange={(e) => setDishPrice(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                      Category *
                    </label>
                    <select
                      value={dishCategory}
                      onChange={(e) => setDishCategory(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 focus:outline-none focus:border-amber-500"
                    >
                      <option value="Signature Mains">Signature Mains</option>
                      <option value="Royal Biryani">Royal Biryani</option>
                      <option value="Artisanal Burgers">Artisanal Burgers</option>
                      <option value="Woodfired Pizzas">Woodfired Pizzas</option>
                      <option value="Japanese Ramen">Japanese Ramen</option>
                      <option value="Patisserie & Desserts">Patisserie & Desserts</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                    Photo URL (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="https://images.unsplash.com/..."
                    value={dishImg}
                    onChange={(e) => setDishImg(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                    Description
                  </label>
                  <textarea
                    rows={2}
                    placeholder="Short culinary description..."
                    value={dishDesc}
                    onChange={(e) => setDishDesc(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 focus:outline-none focus:border-amber-500"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs rounded-xl shadow-md shadow-amber-500/20 transition mt-2"
                >
                  Save Dish to Database
                </button>
              </form>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
