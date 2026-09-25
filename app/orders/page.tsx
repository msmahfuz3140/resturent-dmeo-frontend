"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Navbar from "../components/Navbar";
import CartDrawer from "../components/CartDrawer";
import ItemModal from "../components/ItemModal";
import AuthModal from "../components/AuthModal";
import TableReservationModal from "../components/TableReservationModal";
import Footer from "../components/Footer";
import { Order, API_BASE } from "../lib/api";
import { useCart } from "../context/CartContext";
import { ShoppingBagIcon, ClockIcon, BikeIcon, ChevronRightIcon } from "../components/Icons";

export default function OrdersHistoryPage() {
  const { user, setIsReservationOpen } = useCart();
  const [activeTab, setActiveTab] = useState<"orders" | "reservations">("orders");
  const [orders, setOrders] = useState<Order[]>([]);
  const [reservations, setReservations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [ordRes, resRes] = await Promise.all([
          fetch(`${API_BASE}/orders?limit=25`).then((r) => r.json()).catch(() => ({ data: [] })),
          fetch(`${API_BASE}/reservations`).then((r) => r.json()).catch(() => ({ data: [] })),
        ]);
        setOrders(ordRes.data || []);
        setReservations(resRes.data || []);
      } catch (e) {
        console.error("Orders load error:", e);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);


  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">
        <div className="flex items-center justify-between mb-8">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-amber-700">
              Diner Portal
            </span>
            <h1 className="text-3xl font-black text-slate-900 font-serif">
              My Feast Orders
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              View your past dining orders and track live dispatches in real-time
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setIsReservationOpen(true)}
              className="px-3.5 py-2 bg-white hover:bg-slate-100 text-slate-800 text-xs font-bold rounded-xl border border-slate-200 shadow-xs transition"
            >
              + Reserve Table
            </button>
            <Link
              href="/"
              className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold rounded-xl shadow-xs transition"
            >
              Explore Kitchens ➔
            </Link>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-200 mb-6 gap-2">
          <button
            type="button"
            onClick={() => setActiveTab("orders")}
            className={`pb-3 px-4 text-xs font-bold transition border-b-2 ${
              activeTab === "orders"
                ? "border-amber-500 text-amber-700"
                : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            📦 Food Delivery Orders ({orders.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("reservations")}
            className={`pb-3 px-4 text-xs font-bold transition border-b-2 ${
              activeTab === "reservations"
                ? "border-amber-500 text-amber-700"
                : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            🍷 Table Reservations ({reservations.length})
          </button>
        </div>

        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-28 rounded-3xl bg-white border border-slate-200 animate-pulse shadow-xs" />
            ))}
          </div>
        ) : activeTab === "orders" ? (
          orders.length === 0 ? (
            <div className="text-center py-20 bg-white border border-slate-200 rounded-3xl p-8 shadow-xs">
              <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 mx-auto mb-3">
                <ShoppingBagIcon size={30} />
              </div>
              <h3 className="text-lg font-bold text-slate-800">No Orders Placed Yet</h3>
              <p className="text-xs text-slate-500 mt-1 max-w-xs mx-auto">
                Your dining history is empty. Choose from royal kacchi, smash burgers, or artisanal pizzas to get started!
              </p>
              <Link
                href="/"
                className="inline-block mt-5 px-6 py-2.5 bg-slate-900 text-white text-xs font-bold rounded-xl hover:bg-slate-800 shadow-xs"
              >
                Order Now
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map((order) => (
                <div
                  key={order._id}
                  className="p-5 rounded-3xl bg-white border border-slate-200 shadow-xs hover:border-amber-300 transition flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-xs text-slate-900">
                        #{order.orderNumber}
                      </span>
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                          order.orderStatus === "delivered"
                            ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                            : order.orderStatus === "on_the_way"
                            ? "bg-blue-50 text-blue-800 border border-blue-200"
                            : order.orderStatus === "cancelled"
                            ? "bg-red-50 text-red-800 border border-red-200"
                            : "bg-amber-50 text-amber-800 border border-amber-200"
                        }`}
                      >
                        {order.orderStatus.replace("_", " ")}
                      </span>
                    </div>

                    <h4 className="text-sm font-bold text-slate-900 font-serif">
                      {order.restaurant?.name || "Artisanal Kitchen"}
                    </h4>

                    <p className="text-xs text-slate-500 line-clamp-1">
                      {order.items.map((i) => `${i.quantity}x ${i.name}`).join(", ")}
                    </p>

                    <p className="text-[11px] text-slate-400">
                      Delivered to: {order.deliveryAddress?.area || "Dhaka"} • {new Date(order.createdAt).toLocaleDateString()}
                    </p>
                  </div>

                  <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-3 pt-3 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                    <span className="text-base font-black text-amber-800 font-serif">
                      {order.total} ৳
                    </span>

                    <Link
                      href={`/orders/${order.orderNumber}`}
                      className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl shadow-xs transition flex items-center gap-1.5"
                    >
                      <span>Track Live</span>
                      <ChevronRightIcon size={14} />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )
        ) : (
          /* RESERVATIONS TAB */
          reservations.length === 0 ? (
            <div className="text-center py-20 bg-white border border-slate-200 rounded-3xl p-8 shadow-xs">
              <h3 className="text-lg font-bold text-slate-800">No Table Reservations Found</h3>
              <p className="text-xs text-slate-500 mt-1 max-w-xs mx-auto">
                Experience VIP dining at Dhaka's premier restaurants with zero booking fee.
              </p>
              <button
                type="button"
                onClick={() => setIsReservationOpen(true)}
                className="mt-5 px-6 py-2.5 bg-amber-500 text-slate-950 text-xs font-bold rounded-xl hover:bg-amber-400 shadow-xs"
              >
                Book a Table Now
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {reservations.map((res) => (
                <div
                  key={res._id}
                  className="p-5 rounded-3xl bg-white border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-xs text-amber-700 bg-amber-50 px-2 py-0.5 rounded-lg border border-amber-200">
                        {res.confirmationCode}
                      </span>
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                          res.status === "seated"
                            ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                            : "bg-blue-50 text-blue-800 border border-blue-200"
                        }`}
                      >
                        {res.status}
                      </span>
                    </div>

                    <h4 className="text-sm font-bold text-slate-900 font-serif">
                      {res.restaurantName}
                    </h4>

                    <p className="text-xs text-slate-600">
                      Party Size: <b>{res.guests}</b> • Zone: <b>{res.seatingArea}</b>
                    </p>

                    <p className="text-[11px] text-slate-400">
                      Reserved for: {res.date} • {res.occasion || "Casual Dining"}
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200">
                      ✓ Table Reserved
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )
        )}
      </main>


      <CartDrawer />
      <ItemModal />
      <AuthModal />
      <TableReservationModal />
      <Footer />
    </div>
  );
}
