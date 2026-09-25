"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useCart } from "../context/CartContext";
import { fetchRestaurants, Restaurant, MenuItem, API_BASE } from "../lib/api";
import SearchPopover from "./SearchPopover";
import {
  ClocheIcon,
  FlameIcon,
  MapPinIcon,
  BikeIcon,
  ShoppingBagIcon,
  SearchIcon,
  UserIcon,
  TagIcon,
  XIcon,
} from "./Icons";

const POPULAR_AREAS = [
  "Gulshan 2, Dhaka",
  "Banani, Dhaka",
  "Dhanmondi, Dhaka",
  "Uttara, Dhaka",
  "Mirpur, Dhaka",
  "Bashundhara R/A, Dhaka",
];

export default function Navbar() {
  const {
    cartCount,
    setIsCartOpen,
    selectedArea,
    setSelectedArea,
    serviceType,
    setServiceType,
    user,
    setUser,
    setIsAuthOpen,
    setIsReservationOpen,
    total,
  } = useCart();

  const [isAreaModalOpen, setIsAreaModalOpen] = useState(false);
  const [customAreaInput, setCustomAreaInput] = useState("");
  const [navSearch, setNavSearch] = useState("");
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [allItems, setAllItems] = useState<MenuItem[]>([]);
  const [isSearchActive, setIsSearchActive] = useState(false);

  useEffect(() => {
    fetchRestaurants().then(setRestaurants).catch(() => {});
    fetch(`${API_BASE}/items`)
      .then((r) => r.json())
      .then((j) => setAllItems(j.data || []))
      .catch(() => {});
  }, []);

  const handleSelectArea = (area: string) => {
    setSelectedArea(area);
    setIsAreaModalOpen(false);
  };

  const handleModeClick = (mode: "delivery" | "pickup" | "dinein") => {
    setServiceType(mode);
    if (mode === "dinein") {
      setIsReservationOpen(true);
    }
  };

  return (
    <>
      <header className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-md border-b border-slate-200/90 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.04)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
          
          {/* Brand Logo */}
          <div className="flex items-center gap-6">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-amber-500 to-amber-400 p-[1px] shadow-md shadow-amber-500/20 group-hover:scale-105 transition-transform duration-300">
                <div className="w-full h-full bg-white rounded-2xl flex items-center justify-center">
                  <FlameIcon size={22} className="text-amber-500" />
                </div>
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-1.5">
                  <span className="text-2xl font-black tracking-tight text-slate-900 font-serif">
                    FEAST<span className="text-amber-600">ORA</span>
                  </span>
                  <span className="px-1.5 py-0.5 text-[9px] font-bold bg-amber-50 text-amber-700 border border-amber-200 rounded-md">
                    PRIME
                  </span>
                </div>
                <span className="text-[10px] tracking-wider text-slate-500 uppercase font-semibold">
                  Artisanal Dining
                </span>
              </div>
            </Link>

            {/* Service Type Switcher (Delivery vs Pick-up vs Dine-In) */}
            <div className="hidden lg:flex items-center p-1 bg-slate-100/90 rounded-full border border-slate-200 text-xs font-semibold">
              <button
                type="button"
                onClick={() => handleModeClick("delivery")}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full transition-all duration-200 ${
                  serviceType === "delivery"
                    ? "bg-amber-500 text-slate-950 font-bold shadow-sm"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                <BikeIcon size={14} />
                <span>Delivery</span>
              </button>
              <button
                type="button"
                onClick={() => handleModeClick("pickup")}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full transition-all duration-200 ${
                  serviceType === "pickup"
                    ? "bg-amber-500 text-slate-950 font-bold shadow-sm"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                <ShoppingBagIcon size={14} />
                <span>Takeaway</span>
              </button>
              <button
                type="button"
                onClick={() => handleModeClick("dinein")}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full transition-all duration-200 ${
                  serviceType === "dinein"
                    ? "bg-amber-500 text-slate-950 font-bold shadow-sm"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                <ClocheIcon size={14} />
                <span>Dine-In Table</span>
              </button>
            </div>
          </div>

          {/* Delivery Location Trigger */}
          <div className="hidden md:flex items-center">
            <button
              type="button"
              onClick={() => setIsAreaModalOpen(true)}
              className="flex items-center gap-2.5 px-3.5 py-2 rounded-2xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-left transition shadow-xs"
            >
              <div className="relative w-7 h-7 rounded-lg bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600">
                <MapPinIcon size={15} />
                <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] text-slate-500 font-semibold">Deliver to</span>
                <span className="text-xs font-bold text-slate-800 max-w-[140px] truncate">
                  {selectedArea}
                </span>
              </div>
              <span className="text-slate-400 text-xs ml-1">▼</span>
            </button>
          </div>

          {/* Live Search Bar with Popover */}
          <div className="hidden xl:block relative w-64">
            <div className="relative">
              <SearchIcon size={14} className="absolute left-3.5 top-2.5 text-slate-400" />
              <input
                type="text"
                placeholder="Instant food search..."
                value={navSearch}
                onChange={(e) => {
                  setNavSearch(e.target.value);
                  setIsSearchActive(true);
                }}
                onFocus={() => setIsSearchActive(true)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-amber-500 focus:bg-white transition"
              />
            </div>

            {isSearchActive && navSearch.trim() && (
              <SearchPopover
                searchTerm={navSearch}
                restaurants={restaurants}
                items={allItems}
                onClose={() => {
                  setIsSearchActive(false);
                  setNavSearch("");
                }}
              />
            )}
          </div>

          {/* Navigation Right Actions */}
          <div className="flex items-center gap-3">
            <Link
              href="/#deals-section"
              className="hidden sm:flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-amber-700 hover:text-amber-800 rounded-xl hover:bg-amber-50 transition"
            >
              <TagIcon size={14} className="text-amber-600" />
              <span>Deals & Vouchers</span>
            </Link>

            <Link
              href="/partner"
              className="hidden md:flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 hover:text-slate-900 rounded-xl hover:bg-slate-100 transition border border-slate-200"
            >
              <ClocheIcon size={14} className="text-amber-600" />
              <span>Partner</span>
            </Link>

            <Link
              href="/admin"
              className="flex items-center gap-1 px-3 py-2 text-xs font-bold text-amber-900 bg-amber-50 hover:bg-amber-100 rounded-xl border border-amber-200 transition shadow-xs"
            >
              <span>⚡ Admin</span>
            </Link>

            {/* User Profile / Auth Button */}
            {user ? (
              <div className="relative group">
                <button
                  type="button"
                  className="flex items-center gap-2 p-1.5 pr-3 rounded-full bg-slate-50 border border-slate-200 hover:border-slate-300 transition"
                >
                  <img
                    src={user.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&auto=format&fit=crop&q=80"}
                    alt={user.name}
                    className="w-7 h-7 rounded-full object-cover border border-amber-500"
                  />
                  <span className="text-xs font-bold text-slate-800 hidden sm:inline max-w-[90px] truncate">
                    {user.name.split(" ")[0]}
                  </span>
                </button>

                {/* Dropdown Menu */}
                <div className="absolute right-0 mt-2 w-48 py-2 bg-white rounded-2xl border border-slate-200 shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                  <div className="px-4 py-2 border-b border-slate-100">
                    <p className="text-xs font-bold text-slate-900">{user.name}</p>
                    <p className="text-[11px] text-slate-500 truncate">{user.email}</p>
                  </div>
                  <Link
                    href="/orders"
                    className="block px-4 py-2 text-xs text-slate-700 hover:text-amber-600 hover:bg-slate-50 font-medium"
                  >
                    My Feast Orders
                  </Link>
                  <button
                    type="button"
                    onClick={() => setIsReservationOpen(true)}
                    className="w-full text-left px-4 py-2 text-xs text-slate-700 hover:text-amber-600 hover:bg-slate-50 font-medium"
                  >
                    Book Dine-In Table
                  </button>
                  <Link
                    href="/admin"
                    className="block px-4 py-2 text-xs text-amber-800 font-bold hover:bg-amber-50"
                  >
                    Admin Dashboard ➔
                  </Link>
                  <Link
                    href="/partner"
                    className="block px-4 py-2 text-xs text-slate-700 hover:text-amber-600 hover:bg-slate-50"
                  >
                    Add Restaurant / Dish
                  </Link>
                  <button
                    type="button"
                    onClick={() => setUser(null)}
                    className="w-full text-left px-4 py-2 text-xs text-red-600 hover:bg-red-50 transition"
                  >
                    Sign Out
                  </button>
                </div>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setIsAuthOpen(true)}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold border border-slate-200 transition"
              >
                <UserIcon size={15} className="text-amber-600" />
                <span>Sign In</span>
              </button>
            )}

            {/* Cart Button */}
            <button
              type="button"
              onClick={() => setIsCartOpen(true)}
              className="relative flex items-center gap-2 px-3.5 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-xs shadow-md shadow-amber-500/20 transition hover:scale-[1.02]"
            >
              <div className="relative">
                <ShoppingBagIcon size={16} />
                {cartCount > 0 && (
                  <span className="absolute -top-2.5 -right-2.5 w-4 h-4 rounded-full bg-red-600 text-white text-[9px] font-black flex items-center justify-center animate-pulse">
                    {cartCount}
                  </span>
                )}
              </div>
              <span className="hidden sm:inline">Bag</span>
              {cartCount > 0 && (
                <span className="pl-1 border-l border-slate-900/30">
                  {total} ৳
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Delivery Area Modal */}
      {isAreaModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-md bg-white border border-slate-200 rounded-3xl p-6 shadow-2xl relative text-slate-800">
            <button
              type="button"
              onClick={() => setIsAreaModalOpen(false)}
              className="absolute top-5 right-5 text-slate-400 hover:text-slate-700 p-1"
            >
              <XIcon size={20} />
            </button>

            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600">
                <MapPinIcon size={20} />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900 font-serif">Delivery Address</h3>
                <p className="text-xs text-slate-500">Pick your neighborhood to view kitchens serving you</p>
              </div>
            </div>

            {/* Custom Input */}
            <div className="mb-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Enter street, apartment, or road..."
                  value={customAreaInput}
                  onChange={(e) => setCustomAreaInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && customAreaInput.trim()) {
                      handleSelectArea(customAreaInput.trim());
                    }
                  }}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-amber-500"
                />
                {customAreaInput.trim() && (
                  <button
                    type="button"
                    onClick={() => handleSelectArea(customAreaInput.trim())}
                    className="absolute right-2 top-2 px-3 py-1.5 bg-amber-500 text-slate-950 text-xs font-bold rounded-lg"
                  >
                    Confirm
                  </button>
                )}
              </div>
            </div>

            {/* Popular Predefined Areas */}
            <div>
              <p className="text-[11px] font-bold text-slate-400 mb-2 uppercase tracking-wider">
                Dhaka Culinary Hubs
              </p>
              <div className="grid grid-cols-2 gap-2">
                {POPULAR_AREAS.map((area) => (
                  <button
                    key={area}
                    type="button"
                    onClick={() => handleSelectArea(area)}
                    className={`p-3 rounded-xl text-xs font-semibold text-left border transition ${
                      selectedArea === area
                        ? "bg-amber-50 border-amber-500 text-amber-800 shadow-sm"
                        : "bg-slate-50 border-slate-200 text-slate-700 hover:border-slate-300 hover:bg-slate-100"
                    }`}
                  >
                    📍 {area}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
