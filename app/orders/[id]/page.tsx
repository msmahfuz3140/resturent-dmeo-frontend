"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Navbar from "../../components/Navbar";
import CartDrawer from "../../components/CartDrawer";
import ItemModal from "../../components/ItemModal";
import AuthModal from "../../components/AuthModal";
import TableReservationModal from "../../components/TableReservationModal";
import Footer from "../../components/Footer";
import { fetchOrder, Order, API_BASE } from "../../lib/api";
import {
  ShieldCheckIcon,
  BikeIcon,
  CheckIcon,
  ClockIcon,
} from "../../components/Icons";

const ORDER_STEPS = [
  { key: "placed", label: "Order Placed", desc: "Received and dispatched to kitchen", icon: "📝" },
  { key: "confirmed", label: "Confirmed", desc: "Kitchen accepted ticket", icon: "👨‍🍳" },
  { key: "cooking", label: "Cooking", desc: "Artisanal preparation in progress", icon: "🍳" },
  { key: "on_the_way", label: "Dispatched", desc: "Rider on the road with thermal box", icon: "🛵" },
  { key: "delivered", label: "Delivered", desc: "Arrived at your doorstep. Bon appétit!", icon: "🎉" },
];

export default function OrderTrackingPage() {
  const params = useParams();
  const idOrNumber = params?.id as string;

  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  const loadOrderData = async () => {
    if (!idOrNumber) return;
    try {
      const data = await fetchOrder(idOrNumber);
      setOrder(data);
    } catch (err) {
      console.error("Error loading order:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrderData();
    const interval = setInterval(loadOrderData, 8000);
    return () => clearInterval(interval);
  }, [idOrNumber]);

  const handleAdvanceStatus = async () => {
    if (!order) return;
    const currentIndex = ORDER_STEPS.findIndex((s) => s.key === order.orderStatus);
    if (currentIndex < ORDER_STEPS.length - 1) {
      const nextStatus = ORDER_STEPS[currentIndex + 1].key;
      setUpdating(true);
      try {
        await fetch(`${API_BASE}/orders/${order._id}/status`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status: nextStatus }),
        });
        await loadOrderData();
      } catch (e) {
        console.error("Error updating status:", e);
      } finally {
        setUpdating(false);
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col">
        <Navbar />
        <div className="max-w-3xl mx-auto px-4 py-20 w-full space-y-6 flex-1">
          <div className="h-12 w-48 bg-slate-200 rounded-xl animate-pulse" />
          <div className="h-64 bg-slate-200 rounded-3xl animate-pulse" />
        </div>
        <Footer />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col">
        <Navbar />
        <div className="max-w-md mx-auto text-center py-24 px-4 flex-1">
          <h2 className="text-2xl font-bold font-serif text-slate-900">Order Not Found</h2>
          <p className="text-xs text-slate-500 mt-2">Could not find tracking record for "#{idOrNumber}".</p>
          <Link
            href="/"
            className="inline-block mt-6 px-6 py-2.5 bg-amber-500 text-slate-950 font-bold text-xs rounded-xl"
          >
            Back to Home
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  const currentStepIndex = ORDER_STEPS.findIndex((s) => s.key === order.orderStatus);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">
        {/* Header Breadcrumb */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-amber-700">
              Live Order Tracking
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 font-serif">
              Order #{order.orderNumber}
            </h1>
          </div>

          <Link
            href="/"
            className="px-4 py-2 rounded-xl bg-white border border-slate-200 text-xs font-bold text-slate-700 hover:text-slate-950 shadow-xs transition"
          >
            ← Back to Marketplace
          </Link>
        </div>

        {/* Live Status Tracker Card */}
        <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200 shadow-xl mb-8 space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center text-2xl">
                🛵
              </div>
              <div>
                <p className="text-xs text-slate-500">Estimated Delivery Arrival</p>
                <h3 className="text-xl font-black text-slate-900 font-serif flex items-center gap-2">
                  <ClockIcon size={18} className="text-amber-600" />
                  {order.estimatedDeliveryTime || "25-35 minutes"}
                </h3>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span
                className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                  order.orderStatus === "cancelled"
                    ? "bg-red-50 text-red-800 border border-red-200"
                    : "bg-amber-50 text-amber-800 border border-amber-200"
                }`}
              >
                Status: {order.orderStatus.replace("_", " ")}
              </span>

              {/* Demo button to advance progress */}
              {order.orderStatus !== "cancelled" && currentStepIndex < ORDER_STEPS.length - 1 && (
                <button
                  type="button"
                  disabled={updating}
                  onClick={handleAdvanceStatus}
                  className="px-3.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-xs font-bold text-white rounded-xl shadow-xs transition"
                  title="Simulate courier/kitchen progression"
                >
                  {updating ? "Advancing..." : "Simulate Next Step ➔"}
                </button>
              )}
            </div>
          </div>

          {order.orderStatus === "cancelled" && (
            <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-800 text-xs font-medium">
              ⚠️ This order has been cancelled by the kitchen or admin. If you were charged via bKash or card, a refund will automatically be credited within 24 hours.
            </div>
          )}


          {/* Stepper Timeline */}
          <div className="relative">
            {/* Connecting progress bar */}
            <div className="hidden sm:block absolute top-1/2 left-0 right-0 h-1.5 bg-slate-100 -translate-y-1/2 z-0" />
            <div
              className="hidden sm:block absolute top-1/2 left-0 h-1.5 bg-gradient-to-r from-amber-500 to-amber-400 -translate-y-1/2 z-0 transition-all duration-500"
              style={{
                width: `${(Math.max(0, currentStepIndex) / (ORDER_STEPS.length - 1)) * 100}%`,
              }}
            />

            <div className="grid grid-cols-1 sm:grid-cols-5 gap-4 relative z-10">
              {ORDER_STEPS.map((step, idx) => {
                const isPassed = idx <= currentStepIndex;
                const isCurrent = idx === currentStepIndex;

                return (
                  <div key={step.key} className="flex sm:flex-col items-center sm:text-center gap-3 sm:gap-2">
                    <div
                      className={`w-11 h-11 rounded-2xl flex items-center justify-center text-sm font-bold transition-all duration-300 ${
                        isCurrent
                          ? "bg-amber-500 text-slate-950 ring-4 ring-amber-200 shadow-md scale-110"
                          : isPassed
                          ? "bg-emerald-600 text-white shadow-sm"
                          : "bg-white border border-slate-200 text-slate-400"
                      }`}
                    >
                      {isPassed && !isCurrent ? <CheckIcon size={16} /> : step.icon}
                    </div>

                    <div>
                      <h4
                        className={`text-xs font-bold ${
                          isCurrent
                            ? "text-amber-800 font-serif"
                            : isPassed
                            ? "text-slate-900"
                            : "text-slate-400"
                        }`}
                      >
                        {step.label}
                      </h4>
                      <p className="text-[10px] text-slate-500 hidden sm:block mt-0.5">
                        {step.desc}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Simulated GPS Route Strip */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-lg shadow-xs">
                👨‍💼
              </div>
              <div>
                <p className="text-slate-900 font-bold">Assigned Rider: Tariqul Islam</p>
                <p className="text-slate-500 text-[11px]">Honda CB150 • Thermal insulated culinary box</p>
              </div>
            </div>

            <div className="text-slate-700 text-right sm:text-right">
              <p className="font-bold text-amber-700">Kitchen: {order.restaurant.name}</p>
              <p className="text-[11px] text-slate-500">Destination: {order.deliveryAddress.area}</p>
            </div>
          </div>
        </div>

        {/* Order Breakdown / Receipt */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Items Summary */}
          <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4">
            <h3 className="text-base font-bold text-slate-900 font-serif border-b border-slate-100 pb-2">
              Items Ordered
            </h3>

            <div className="space-y-3">
              {order.items.map((it, idx) => (
                <div key={idx} className="flex justify-between items-start text-xs">
                  <div>
                    <span className="font-bold text-slate-900">
                      {it.quantity}x {it.name}
                    </span>
                    {it.selectedOptions && it.selectedOptions.length > 0 && (
                      <p className="text-[10px] text-slate-500">
                        {it.selectedOptions.join(", ")}
                      </p>
                    )}
                  </div>
                  <span className="font-bold text-slate-700">{it.itemTotal} ৳</span>
                </div>
              ))}
            </div>

            {/* Price Calculations */}
            <div className="pt-4 border-t border-slate-100 space-y-1.5 text-xs text-slate-500">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="text-slate-900 font-medium">{order.subtotal} ৳</span>
              </div>
              <div className="flex justify-between">
                <span>Delivery Fee</span>
                <span className="text-slate-900 font-medium">{order.deliveryFee} ৳</span>
              </div>
              {order.discount > 0 && (
                <div className="flex justify-between text-emerald-700 font-bold">
                  <span>Discount ({order.couponCode || "Coupon"})</span>
                  <span>-{order.discount} ৳</span>
                </div>
              )}
              <div className="pt-2 border-t border-slate-200 flex justify-between text-sm font-bold text-slate-900">
                <span>Total Paid / Payable</span>
                <span className="text-amber-700 font-serif text-base">{order.total} ৳</span>
              </div>
            </div>
          </div>

          {/* Delivery & Customer Details */}
          <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4">
            <h3 className="text-base font-bold text-slate-900 font-serif border-b border-slate-100 pb-2">
              Customer & Drop-off
            </h3>

            <div className="space-y-3 text-xs">
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-bold">Recipient</span>
                <p className="text-slate-900 font-bold">{order.customerName}</p>
                <p className="text-slate-600">{order.customerPhone}</p>
              </div>

              <div>
                <span className="text-[10px] text-slate-400 uppercase font-bold">Delivery Address</span>
                <p className="text-slate-800 font-medium">{order.deliveryAddress.fullAddress}</p>
                <p className="text-amber-800 font-bold">{order.deliveryAddress.area}</p>
                {order.deliveryAddress.instructions && (
                  <p className="text-slate-500 italic text-[11px] mt-0.5">
                    "{order.deliveryAddress.instructions}"
                  </p>
                )}
              </div>

              <div className="pt-2 border-t border-slate-100 flex justify-between items-center">
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-bold">Payment Method</span>
                  <p className="text-slate-900 font-bold uppercase">{order.paymentMethod}</p>
                </div>
                <span className="px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase bg-emerald-50 border border-emerald-200 text-emerald-800">
                  {order.paymentStatus}
                </span>
              </div>
            </div>
          </div>

        </div>
      </main>

      <CartDrawer />
      <ItemModal />
      <AuthModal />
      <TableReservationModal />
      <Footer />
    </div>
  );
}
