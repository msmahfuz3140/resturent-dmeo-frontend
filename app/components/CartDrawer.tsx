"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "../context/CartContext";
import { submitOrder } from "../lib/api";
import {
  XIcon,
  PlusIcon,
  MinusIcon,
  ShoppingBagIcon,
  TagIcon,
  BikeIcon,
  ShieldCheckIcon,
  CheckIcon,
} from "./Icons";

export default function CartDrawer() {
  const router = useRouter();
  const {
    cart,
    isCartOpen,
    setIsCartOpen,
    currentRestaurant,
    updateQuantity,
    removeFromCart,
    clearCart,
    subtotal,
    deliveryFee,
    discount,
    total,
    appliedDeal,
    applyVoucher,
    removeVoucher,
    couponError,
    selectedArea,
    serviceType,
    user,
  } = useCart();

  const [couponInput, setCouponInput] = useState("");
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form states
  const [customerName, setCustomerName] = useState(user?.name || "");
  const [customerPhone, setCustomerPhone] = useState("+880 1712-345678");
  const [customerEmail, setCustomerEmail] = useState(user?.email || "diner@feastora.demo");
  const [fullAddress, setFullAddress] = useState("Flat 4B, House 18, Road 22");
  const [instructions, setInstructions] = useState("Ring bell twice, leave with concierge if unavailable");
  const [paymentMethod, setPaymentMethod] = useState<"cod" | "bkash" | "card">("cod");
  const [orderError, setOrderError] = useState("");

  if (!isCartOpen) return null;

  const handleApplyCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponInput.trim()) return;
    const ok = await applyVoucher(couponInput.trim().toUpperCase());
    if (ok) setCouponInput("");
  };

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setOrderError("");

    if (!customerName.trim() || !customerPhone.trim() || !fullAddress.trim()) {
      setOrderError("Please fill in your name, contact phone and delivery address.");
      return;
    }

    if (!currentRestaurant) {
      setOrderError("No restaurant selected.");
      return;
    }

    setIsSubmitting(true);
    try {
      const orderPayload = {
        userId: user?.id || null,
        customerName,
        customerEmail,
        customerPhone,
        deliveryAddress: {
          area: selectedArea,
          fullAddress,
          instructions,
        },
        serviceType,
        restaurant: {
          id: currentRestaurant.id,
          name: currentRestaurant.name,
        },
        items: cart.map((item) => ({
          menuItemId: item.menuItem._id,
          name: item.menuItem.name,
          price: item.menuItem.discountPrice || item.menuItem.price,
          quantity: item.quantity,
          selectedOptions: item.selectedOptions || [],
          itemTotal: item.itemTotal,
        })),
        subtotal,
        deliveryFee,
        discount,
        couponCode: appliedDeal?.code || "",
        total,
        paymentMethod,
      };

      const res = await submitOrder(orderPayload);
      if (res.success && res.data) {
        clearCart();
        setIsCartOpen(false);
        setIsCheckingOut(false);
        router.push(`/orders/${res.data.orderNumber}`);
      } else {
        setOrderError(res.message || "Failed to place order. Please try again.");
      }
    } catch (err: any) {
      setOrderError(err.message || "Network error placing order.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/60 backdrop-blur-xs transition-opacity duration-300">
      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white border-l border-slate-200 shadow-2xl flex flex-col text-slate-800">
          
          {/* Drawer Header */}
          <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/80">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600">
                <ShoppingBagIcon size={18} />
              </div>
              <div>
                <h2 className="text-base font-bold text-slate-900 font-serif">
                  {isCheckingOut ? "Checkout & Delivery" : "Your Dining Bag"}
                </h2>
                {currentRestaurant && (
                  <p className="text-xs text-amber-700 font-semibold truncate max-w-[200px]">
                    from {currentRestaurant.name}
                  </p>
                )}
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                setIsCartOpen(false);
                setIsCheckingOut(false);
              }}
              className="p-2 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition"
            >
              <XIcon size={20} />
            </button>
          </div>

          {/* Drawer Body */}
          <div className="flex-1 overflow-y-auto px-6 py-5">
            {cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-12">
                <div className="w-20 h-20 rounded-full bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-400 mb-4">
                  <ShoppingBagIcon size={36} />
                </div>
                <h3 className="text-lg font-bold text-slate-800">Your bag is empty</h3>
                <p className="text-xs text-slate-500 mt-1 max-w-xs">
                  Explore our curated restaurants and add artisanal dishes to start your feast!
                </p>
                <button
                  type="button"
                  onClick={() => setIsCartOpen(false)}
                  className="mt-6 px-6 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold rounded-xl shadow-md shadow-amber-500/20 transition"
                >
                  Explore Restaurants
                </button>
              </div>
            ) : !isCheckingOut ? (
              /* Items List View */
              <div className="space-y-4">
                {cart.map((item) => (
                  <div
                    key={item.id}
                    className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/90 flex gap-3.5 items-center justify-between"
                  >
                    <img
                      src={item.menuItem.image}
                      alt={item.menuItem.name}
                      className="w-16 h-16 rounded-xl object-cover border border-slate-200"
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="text-xs font-bold text-slate-900 truncate">
                        {item.menuItem.name}
                      </h4>
                      {item.selectedOptions && item.selectedOptions.length > 0 && (
                        <p className="text-[11px] text-slate-500 truncate mt-0.5">
                          {item.selectedOptions.join(", ")}
                        </p>
                      )}
                      <p className="text-xs font-bold text-amber-700 mt-1">
                        {item.itemTotal} ৳
                      </p>
                    </div>

                    {/* Quantity Controls */}
                    <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-lg p-1 shadow-xs">
                      <button
                        type="button"
                        onClick={() => updateQuantity(item.id, -1)}
                        className="w-6 h-6 flex items-center justify-center text-slate-400 hover:text-slate-800 rounded hover:bg-slate-100"
                      >
                        <MinusIcon size={12} />
                      </button>
                      <span className="text-xs font-bold text-slate-800 px-1">
                        {item.quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() => updateQuantity(item.id, 1)}
                        className="w-6 h-6 flex items-center justify-center text-slate-400 hover:text-slate-800 rounded hover:bg-slate-100"
                      >
                        <PlusIcon size={12} />
                      </button>
                    </div>
                  </div>
                ))}

                {/* Voucher Code Form */}
                <div className="pt-2">
                  <form onSubmit={handleApplyCoupon} className="flex gap-2">
                    <div className="relative flex-1">
                      <input
                        type="text"
                        placeholder="Voucher code (e.g. FEAST20)"
                        value={couponInput}
                        onChange={(e) => setCouponInput(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 uppercase placeholder-slate-400 focus:outline-none focus:border-amber-500 focus:bg-white"
                      />
                      <TagIcon size={14} className="absolute right-3 top-3 text-slate-400" />
                    </div>
                    <button
                      type="submit"
                      className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl transition"
                    >
                      Apply
                    </button>
                  </form>

                  {couponError && (
                    <p className="text-[11px] text-red-600 mt-1.5 font-medium">{couponError}</p>
                  )}

                  {appliedDeal && (
                    <div className="mt-2 p-2.5 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center justify-between text-xs text-emerald-800">
                      <div className="flex items-center gap-1.5 font-medium">
                        <CheckIcon size={14} />
                        <span>Code <b>{appliedDeal.code}</b> applied (-{appliedDeal.discountAmount} ৳)</span>
                      </div>
                      <button
                        type="button"
                        onClick={removeVoucher}
                        className="text-slate-400 hover:text-red-600"
                      >
                        <XIcon size={14} />
                      </button>
                    </div>
                  )}
                </div>

                {/* Price Breakdown */}
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2 text-xs">
                  <div className="flex justify-between text-slate-500">
                    <span>Subtotal</span>
                    <span className="text-slate-900 font-semibold">{subtotal} ৳</span>
                  </div>
                  <div className="flex justify-between text-slate-500">
                    <span className="flex items-center gap-1">
                      <BikeIcon size={13} /> Delivery Fee
                    </span>
                    <span className="text-slate-900 font-semibold">{deliveryFee} ৳</span>
                  </div>
                  {discount > 0 && (
                    <div className="flex justify-between text-emerald-700 font-bold">
                      <span>Voucher Discount</span>
                      <span>-{discount} ৳</span>
                    </div>
                  )}
                  <div className="pt-2 border-t border-slate-200 flex justify-between text-sm font-bold text-slate-900">
                    <span>Estimated Total</span>
                    <span className="text-amber-700 font-serif text-base">{total} ৳</span>
                  </div>
                </div>
              </div>
            ) : (
              /* Checkout Form View */
              <form id="checkout-form" onSubmit={handlePlaceOrder} className="space-y-4">
                {orderError && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700">
                    {orderError}
                  </div>
                )}

                <div>
                  <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 focus:outline-none focus:border-amber-500 focus:bg-white"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                      Contact Phone *
                    </label>
                    <input
                      type="text"
                      required
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 focus:outline-none focus:border-amber-500 focus:bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                      Email
                    </label>
                    <input
                      type="email"
                      value={customerEmail}
                      onChange={(e) => setCustomerEmail(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 focus:outline-none focus:border-amber-500 focus:bg-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                    Delivery Area
                  </label>
                  <div className="px-3.5 py-2.5 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900 font-bold">
                    📍 {selectedArea}
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                    Street Address & House/Flat *
                  </label>
                  <input
                    type="text"
                    required
                    value={fullAddress}
                    onChange={(e) => setFullAddress(e.target.value)}
                    placeholder="e.g. House 24, Road 11, Apartment 5B"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 focus:outline-none focus:border-amber-500 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                    Rider Delivery Notes (Optional)
                  </label>
                  <input
                    type="text"
                    value={instructions}
                    onChange={(e) => setInstructions(e.target.value)}
                    placeholder="e.g. Leave at guard room, call upon arrival"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 focus:outline-none focus:border-amber-500 focus:bg-white"
                  />
                </div>

                {/* Payment Selection */}
                <div>
                  <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">
                    Payment Method
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { id: "cod", label: "Cash on Delivery", icon: "💵" },
                      { id: "bkash", label: "bKash / Nagad", icon: "📱" },
                      { id: "card", label: "Debit / Credit", icon: "💳" },
                    ].map((p) => (
                      <button
                        key={p.id}
                        type="button"
                        onClick={() => setPaymentMethod(p.id as any)}
                        className={`p-2.5 rounded-xl border text-center transition flex flex-col items-center gap-1 ${
                          paymentMethod === p.id
                            ? "bg-amber-50 border-amber-500 text-amber-900 font-bold shadow-xs"
                            : "bg-slate-50 border-slate-200 text-slate-600 hover:border-slate-300"
                        }`}
                      >
                        <span className="text-base">{p.icon}</span>
                        <span className="text-[10px] leading-tight font-medium">{p.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Summary mini pill */}
                <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl flex items-center justify-between text-xs font-bold text-amber-900">
                  <span>Payable Amount:</span>
                  <span className="text-sm font-serif text-amber-800">{total} ৳</span>
                </div>
              </form>
            )}
          </div>

          {/* Drawer Footer Actions */}
          {cart.length > 0 && (
            <div className="p-6 border-t border-slate-100 bg-slate-50">
              {!isCheckingOut ? (
                <button
                  type="button"
                  onClick={() => setIsCheckingOut(true)}
                  className="w-full py-3.5 px-4 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-sm rounded-2xl shadow-lg shadow-amber-500/20 transition flex items-center justify-between"
                >
                  <span>Proceed to Checkout</span>
                  <span className="font-serif text-base">{total} ৳ →</span>
                </button>
              ) : (
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setIsCheckingOut(false)}
                    className="py-3 px-4 bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-bold rounded-xl transition"
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    form="checkout-form"
                    disabled={isSubmitting}
                    className="flex-1 py-3 px-4 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 disabled:opacity-50 text-slate-950 font-black text-sm rounded-xl shadow-lg shadow-amber-500/20 transition flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? (
                      <span>Placing Order in MongoDB...</span>
                    ) : (
                      <>
                        <ShieldCheckIcon size={18} />
                        <span>Confirm & Place Order ({total} ৳)</span>
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
