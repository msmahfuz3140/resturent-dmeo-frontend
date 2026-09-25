"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
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
  MenuIcon,
  HomeIcon,
  ReceiptIcon,
  ChevronRightIcon,
  StarIcon,
  PlusIcon,
} from "./Icons";

const POPULAR_AREAS = [
  "Gulshan 2, Dhaka",
  "Banani, Dhaka",
  "Dhanmondi, Dhaka",
  "Uttara, Dhaka",
  "Mirpur, Dhaka",
  "Bashundhara R/A, Dhaka",
];

const SEARCH_SUGGESTIONS = [
  "Kacchi Biryani",
  "Artisan Burger",
  "Woodfired Pizza",
  "Salmon Sushi",
  "Matcha Patisserie",
  "Mezban Beef",
];

export default function Navbar() {
  const pathname = usePathname();
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
    addToCart,
    setActiveItemModal,
  } = useCart();

  // Modals & Drawers state
  const [isAreaModalOpen, setIsAreaModalOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);

  // Search state
  const [customAreaInput, setCustomAreaInput] = useState("");
  const [navSearch, setNavSearch] = useState("");
  const [mobileSearch, setMobileSearch] = useState("");
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [allItems, setAllItems] = useState<MenuItem[]>([]);
  const [isDesktopSearchActive, setIsDesktopSearchActive] = useState(false);

  const mobileSearchInputRef = useRef<HTMLInputElement>(null);

  // Fetch search data
  useEffect(() => {
    fetchRestaurants().then(setRestaurants).catch(() => {});
    fetch(`${API_BASE}/items`)
      .then((r) => r.json())
      .then((j) => setAllItems(j.data || []))
      .catch(() => {});
  }, []);

  // Lock body scroll when mobile menu or search modal is open
  useEffect(() => {
    if (isMobileMenuOpen || isMobileSearchOpen || isAreaModalOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isMobileMenuOpen, isMobileSearchOpen, isAreaModalOpen]);

  // Focus mobile search input when opened
  useEffect(() => {
    if (isMobileSearchOpen) {
      setTimeout(() => {
        mobileSearchInputRef.current?.focus();
      }, 150);
    }
  }, [isMobileSearchOpen]);

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

  // Filter for mobile live search
  const mobileQ = mobileSearch.trim().toLowerCase();
  const mobileMatchedRestaurants = mobileQ
    ? restaurants.filter(
        (r) =>
          r.name.toLowerCase().includes(mobileQ) ||
          r.cuisines.some((c) => c.toLowerCase().includes(mobileQ))
      ).slice(0, 3)
    : [];

  const mobileMatchedItems = mobileQ
    ? allItems.filter(
        (item) =>
          item.name.toLowerCase().includes(mobileQ) ||
          item.description?.toLowerCase().includes(mobileQ) ||
          item.category?.toLowerCase().includes(mobileQ)
      ).slice(0, 6)
    : [];

  return (
    <>
      {/* ─────────────────────────────────────────────────────────────
          1. TOP MAIN HEADER
      ────────────────────────────────────────────────────────────── */}
      <header className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-md border-b border-slate-200/90 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.04)] overflow-x-clip">
        <div className="w-full max-w-7xl mx-auto px-2.5 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between gap-1.5 sm:gap-4">
          
          {/* Left section: Hamburger (Mobile) + Brand Logo */}
          <div className="flex items-center gap-1.5 sm:gap-3 lg:gap-6 min-w-0">
            {/* Mobile Hamburger Toggle (hidden on lg+) */}
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(true)}
              aria-label="Open mobile navigation menu"
              className="lg:hidden p-1.5 sm:p-2 rounded-xl text-slate-700 hover:text-amber-600 hover:bg-slate-100 transition active:scale-95 shrink-0"
            >
              <MenuIcon size={20} className="sm:w-[22px] sm:h-[22px]" />
            </button>

            {/* Brand Logo */}
            <Link href="/" className="flex items-center gap-1.5 sm:gap-3 group shrink-0">
              <div className="w-8 h-8 sm:w-11 sm:h-11 rounded-xl sm:rounded-2xl bg-gradient-to-tr from-amber-500 to-amber-400 p-[1px] shadow-md shadow-amber-500/20 group-hover:scale-105 transition-transform duration-300 shrink-0">
                <div className="w-full h-full bg-white rounded-xl sm:rounded-2xl flex items-center justify-center">
                  <FlameIcon size={16} className="text-amber-500 sm:w-[22px] sm:h-[22px]" />
                </div>
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-1 sm:gap-1.5">
                  <span className="text-lg sm:text-2xl font-black tracking-tight text-slate-900 font-serif leading-none">
                    FEAST<span className="text-amber-600">ORA</span>
                  </span>
                  <span className="hidden sm:inline-block px-1 sm:px-1.5 py-0.5 text-[8px] sm:text-[9px] font-bold bg-amber-50 text-amber-700 border border-amber-200 rounded-md">
                    PRIME
                  </span>
                </div>
                <span className="text-[9px] sm:text-[10px] tracking-wider text-slate-500 uppercase font-semibold hidden md:block">
                  Artisanal Dining
                </span>
              </div>
            </Link>

            {/* Service Type Switcher (Desktop: Delivery vs Takeaway vs Dine-In) */}
            <div className="hidden lg:flex items-center p-1 bg-slate-100/90 rounded-full border border-slate-200 text-xs font-semibold shrink-0">
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

          {/* Center section: Delivery Location (Tablet & Desktop sm+) */}
          <div className="hidden sm:flex items-center shrink min-w-0">
            <button
              type="button"
              onClick={() => setIsAreaModalOpen(true)}
              className="flex items-center gap-1.5 sm:gap-2 px-2.5 py-1.5 sm:px-3.5 sm:py-2 rounded-2xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-left transition shadow-xs group min-w-0"
            >
              <div className="relative w-6 h-6 sm:w-7 sm:h-7 rounded-lg bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600 group-hover:bg-amber-500 group-hover:text-slate-950 transition shrink-0">
                <MapPinIcon size={14} />
                <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-[9px] sm:text-[10px] text-slate-500 font-semibold leading-none">Deliver to</span>
                <span className="text-[11px] sm:text-xs font-bold text-slate-800 max-w-[100px] md:max-w-[130px] lg:max-w-[150px] truncate">
                  {selectedArea}
                </span>
              </div>
              <span className="text-slate-400 text-xs ml-0.5 shrink-0">▼</span>
            </button>
          </div>

          {/* Live Search Bar with Popover (XL Desktop) */}
          <div className="hidden xl:block relative w-60 lg:w-72 shrink-0">
            <div className="relative">
              <SearchIcon size={14} className="absolute left-3.5 top-2.5 text-slate-400" />
              <input
                type="text"
                placeholder="Instant food search..."
                value={navSearch}
                onChange={(e) => {
                  setNavSearch(e.target.value);
                  setIsDesktopSearchActive(true);
                }}
                onFocus={() => setIsDesktopSearchActive(true)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-amber-500 focus:bg-white transition"
              />
              {navSearch && (
                <button
                  type="button"
                  onClick={() => {
                    setNavSearch("");
                    setIsDesktopSearchActive(false);
                  }}
                  className="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-600"
                >
                  <XIcon size={13} />
                </button>
              )}
            </div>

            {isDesktopSearchActive && navSearch.trim() && (
              <SearchPopover
                searchTerm={navSearch}
                restaurants={restaurants}
                items={allItems}
                className="w-[450px] right-0 left-auto"
                onClose={() => {
                  setIsDesktopSearchActive(false);
                  setNavSearch("");
                }}
              />
            )}
          </div>

          {/* Right section: Mobile Search Trigger, Deals, Partner, Admin, User, Cart */}
          <div className="flex items-center gap-1 sm:gap-2 lg:gap-2.5 shrink-0">
            {/* Search Trigger Button (Mobile / Tablet - under XL) */}
            <button
              type="button"
              onClick={() => setIsMobileSearchOpen(true)}
              aria-label="Open search"
              className="xl:hidden p-1.5 sm:p-2 rounded-xl text-slate-700 hover:text-amber-600 hover:bg-slate-100 transition active:scale-95 shrink-0"
            >
              <SearchIcon size={18} className="sm:w-[19px] sm:h-[19px]" />
            </button>

            {/* Deals & Vouchers (Tablet/Desktop md+) */}
            <Link
              href="/#deals-section"
              className="hidden md:flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-amber-700 hover:text-amber-800 rounded-xl hover:bg-amber-50 transition shrink-0"
            >
              <TagIcon size={14} className="text-amber-600" />
              <span>Deals</span>
            </Link>

            {/* Partner Studio (Desktop lg+) */}
            <Link
              href="/partner"
              className="hidden lg:flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 hover:text-slate-900 rounded-xl hover:bg-slate-100 transition border border-slate-200 shrink-0"
            >
              <ClocheIcon size={14} className="text-amber-600" />
              <span>Partner</span>
            </Link>

            {/* Admin Badge (Tablet/Desktop md+) */}
            <Link
              href="/admin"
              className="hidden md:flex items-center gap-1 px-2.5 py-1.5 sm:px-3 sm:py-2 text-xs font-bold text-amber-900 bg-amber-50 hover:bg-amber-100 rounded-xl border border-amber-200 transition shadow-xs shrink-0"
            >
              <span>⚡ Admin</span>
            </Link>

            {/* User Profile / Auth Button */}
            {user ? (
              <div className="relative group shrink-0">
                <button
                  type="button"
                  className="flex items-center gap-1 sm:gap-2 p-1 sm:p-1.5 sm:pr-3 rounded-full bg-slate-50 border border-slate-200 hover:border-slate-300 transition"
                >
                  <img
                    src={user.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&auto=format&fit=crop&q=80"}
                    alt={user.name}
                    className="w-7 h-7 sm:w-8 sm:h-8 rounded-full object-cover border border-amber-500"
                  />
                  <span className="text-xs font-bold text-slate-800 hidden md:inline max-w-[85px] truncate">
                    {user.name.split(" ")[0]}
                  </span>
                </button>

                {/* Dropdown Menu (Desktop) */}
                <div className="absolute right-0 mt-2 w-52 py-2 bg-white rounded-2xl border border-slate-200 shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                  <div className="px-4 py-2 border-b border-slate-100">
                    <p className="text-xs font-bold text-slate-900 truncate">{user.name}</p>
                    <p className="text-[11px] text-slate-500 truncate">{user.email}</p>
                  </div>
                  <Link
                    href="/orders"
                    className="block px-4 py-2 text-xs text-slate-700 hover:text-amber-600 hover:bg-slate-50 font-medium"
                  >
                    📦 My Feast Orders
                  </Link>
                  <button
                    type="button"
                    onClick={() => setIsReservationOpen(true)}
                    className="w-full text-left px-4 py-2 text-xs text-slate-700 hover:text-amber-600 hover:bg-slate-50 font-medium"
                  >
                    🍷 Book Dine-In Table
                  </button>
                  <Link
                    href="/admin"
                    className="block px-4 py-2 text-xs text-amber-800 font-bold hover:bg-amber-50"
                  >
                    ⚡ Admin Dashboard
                  </Link>
                  <Link
                    href="/partner"
                    className="block px-4 py-2 text-xs text-slate-700 hover:text-amber-600 hover:bg-slate-50"
                  >
                    👨‍🍳 Partner Studio
                  </Link>
                  <div className="border-t border-slate-100 my-1" />
                  <button
                    type="button"
                    onClick={() => setUser(null)}
                    className="w-full text-left px-4 py-2 text-xs text-red-600 hover:bg-red-50 transition font-semibold"
                  >
                    Sign Out
                  </button>
                </div>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setIsAuthOpen(true)}
                className="hidden sm:flex items-center gap-1 sm:gap-1.5 px-2.5 py-1.5 sm:px-3 sm:py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold border border-slate-200 transition shrink-0"
              >
                <UserIcon size={14} className="text-amber-600" />
                <span>Sign In</span>
              </button>
            )}

            {/* Cart / Bag Button (100% responsive, never overflows) */}
            <button
              type="button"
              onClick={() => setIsCartOpen(true)}
              className="relative flex items-center justify-center gap-1 sm:gap-2 h-9 sm:h-auto px-2.5 sm:px-3.5 py-1.5 sm:py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-xs shadow-md shadow-amber-500/20 transition hover:scale-[1.02] shrink-0"
            >
              <div className="relative flex items-center justify-center">
                <ShoppingBagIcon size={16} />
                {cartCount > 0 && (
                  <span className="absolute -top-2.5 -right-2.5 w-4 h-4 rounded-full bg-red-600 text-white text-[9px] font-black flex items-center justify-center animate-pulse">
                    {cartCount}
                  </span>
                )}
              </div>
              <span className="hidden sm:inline">Bag</span>
              {cartCount > 0 && (
                <span className="hidden sm:inline pl-1 border-l border-slate-950/20 text-[11px] sm:text-xs font-bold">
                  {total} ৳
                </span>
              )}
            </button>
          </div>
        </div>

        {/* ─────────────────────────────────────────────────────────────
            2. MOBILE SUB-BAR (Under 640px: Location + Service Toggle)
        ────────────────────────────────────────────────────────────── */}
        <div className="sm:hidden px-2.5 py-1.5 bg-slate-50/95 border-t border-slate-200/80 flex items-center justify-between gap-1.5 w-full overflow-hidden">
          {/* Location Chip */}
          <button
            type="button"
            onClick={() => setIsAreaModalOpen(true)}
            className="flex items-center gap-1.5 py-1 px-2 rounded-lg bg-white border border-slate-200 text-slate-800 text-[11px] font-bold shrink min-w-0 max-w-[140px] shadow-xs hover:border-amber-400 transition"
          >
            <MapPinIcon size={12} className="text-amber-600 shrink-0" />
            <span className="truncate">{selectedArea.split(",")[0]}</span>
            <span className="text-[9px] text-slate-400 shrink-0">▾</span>
          </button>

          {/* Mode Switcher Buttons */}
          <div className="flex items-center p-0.5 bg-white rounded-lg border border-slate-200 text-[10px] font-bold shrink-0">
            <button
              type="button"
              onClick={() => handleModeClick("delivery")}
              className={`px-2 py-0.5 rounded-md transition ${
                serviceType === "delivery"
                  ? "bg-amber-500 text-slate-950 shadow-xs"
                  : "text-slate-600"
              }`}
            >
              Delivery
            </button>
            <button
              type="button"
              onClick={() => handleModeClick("pickup")}
              className={`px-2 py-0.5 rounded-md transition ${
                serviceType === "pickup"
                  ? "bg-amber-500 text-slate-950 shadow-xs"
                  : "text-slate-600"
              }`}
            >
              Takeaway
            </button>
            <button
              type="button"
              onClick={() => handleModeClick("dinein")}
              className={`px-2 py-0.5 rounded-md transition ${
                serviceType === "dinein"
                  ? "bg-amber-500 text-slate-950 shadow-xs"
                  : "text-slate-600"
              }`}
            >
              Dine-In
            </button>
          </div>
        </div>
      </header>

      {/* ─────────────────────────────────────────────────────────────
          3. MOBILE SLIDE-OVER DRAWER (lg:hidden)
      ────────────────────────────────────────────────────────────── */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm transition-opacity"
            onClick={() => setIsMobileMenuOpen(false)}
          />

          {/* Drawer Content */}
          <div className="fixed inset-y-0 left-0 max-w-[320px] w-full bg-white shadow-2xl z-10 flex flex-col justify-between overflow-y-auto animate-fade-in border-r border-slate-200">
            <div>
              {/* Header */}
              <div className="p-4 border-b border-slate-200 flex items-center justify-between">
                <Link
                  href="/"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center gap-2.5"
                >
                  <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-amber-500 to-amber-400 p-[1px] shadow-sm">
                    <div className="w-full h-full bg-white rounded-xl flex items-center justify-center">
                      <FlameIcon size={16} className="text-amber-500" />
                    </div>
                  </div>
                  <span className="text-lg font-black tracking-tight text-slate-900 font-serif">
                    FEAST<span className="text-amber-600">ORA</span>
                  </span>
                </Link>
                <button
                  type="button"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
                >
                  <XIcon size={20} />
                </button>
              </div>

              {/* User Section in Drawer */}
              <div className="p-4 bg-slate-50 border-b border-slate-200">
                {user ? (
                  <div className="flex items-center gap-3">
                    <img
                      src={user.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&auto=format&fit=crop&q=80"}
                      alt={user.name}
                      className="w-11 h-11 rounded-full object-cover border-2 border-amber-500"
                    />
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-bold text-slate-900 truncate">{user.name}</p>
                      <p className="text-[10px] text-slate-500 truncate">{user.email}</p>
                      <span className="inline-block mt-0.5 px-2 py-0.5 bg-amber-100 text-amber-800 text-[9px] font-bold rounded-full">
                        Prime Member
                      </span>
                    </div>
                  </div>
                ) : (
                  <div>
                    <p className="text-xs font-bold text-slate-900 mb-1">Welcome to Feastora Prime</p>
                    <p className="text-[11px] text-slate-500 mb-3">Sign in to track orders and unlock VIP tasting offers</p>
                    <button
                      type="button"
                      onClick={() => {
                        setIsMobileMenuOpen(false);
                        setIsAuthOpen(true);
                      }}
                      className="w-full py-2 bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-bold text-xs rounded-xl shadow-sm text-center"
                    >
                      Sign In / Register
                    </button>
                  </div>
                )}
              </div>

              {/* Service Mode Selector */}
              <div className="p-4 border-b border-slate-200">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2.5">
                  Ordering Mode
                </p>
                <div className="grid grid-cols-3 gap-1.5">
                  <button
                    type="button"
                    onClick={() => {
                      handleModeClick("delivery");
                      setIsMobileMenuOpen(false);
                    }}
                    className={`p-2.5 rounded-xl border text-center transition flex flex-col items-center gap-1 ${
                      serviceType === "delivery"
                        ? "bg-amber-50 border-amber-500 text-amber-900 font-bold shadow-xs"
                        : "bg-white border-slate-200 text-slate-700"
                    }`}
                  >
                    <BikeIcon size={16} className="text-amber-600" />
                    <span className="text-[10px]">Delivery</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      handleModeClick("pickup");
                      setIsMobileMenuOpen(false);
                    }}
                    className={`p-2.5 rounded-xl border text-center transition flex flex-col items-center gap-1 ${
                      serviceType === "pickup"
                        ? "bg-amber-50 border-amber-500 text-amber-900 font-bold shadow-xs"
                        : "bg-white border-slate-200 text-slate-700"
                    }`}
                  >
                    <ShoppingBagIcon size={16} className="text-amber-600" />
                    <span className="text-[10px]">Takeaway</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      handleModeClick("dinein");
                      setIsMobileMenuOpen(false);
                    }}
                    className={`p-2.5 rounded-xl border text-center transition flex flex-col items-center gap-1 ${
                      serviceType === "dinein"
                        ? "bg-amber-50 border-amber-500 text-amber-900 font-bold shadow-xs"
                        : "bg-white border-slate-200 text-slate-700"
                    }`}
                  >
                    <ClocheIcon size={16} className="text-amber-600" />
                    <span className="text-[10px]">Dine-In</span>
                  </button>
                </div>
              </div>

              {/* Location Picker in Drawer */}
              <div className="p-4 border-b border-slate-200">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                  Delivery Destination
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    setIsAreaModalOpen(true);
                  }}
                  className="w-full flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200 text-left hover:bg-amber-50 transition"
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <MapPinIcon size={16} className="text-amber-600 shrink-0" />
                    <span className="text-xs font-bold text-slate-800 truncate">{selectedArea}</span>
                  </div>
                  <span className="text-[10px] font-bold text-amber-700 bg-amber-100 px-2 py-0.5 rounded-md shrink-0">
                    Change
                  </span>
                </button>
              </div>

              {/* Navigation Links */}
              <div className="p-3 space-y-1">
                <Link
                  href="/"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold transition ${
                    pathname === "/" ? "bg-amber-50 text-amber-900 border border-amber-200" : "text-slate-700 hover:bg-slate-100"
                  }`}
                >
                  <HomeIcon size={16} className="text-amber-600" />
                  <span>Home & Discovery</span>
                </Link>

                <Link
                  href="/#deals-section"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-100 transition"
                >
                  <TagIcon size={16} className="text-amber-600" />
                  <span>VIP Deals & Vouchers</span>
                  <span className="ml-auto text-[9px] font-black bg-red-100 text-red-600 px-1.5 py-0.5 rounded-full">
                    UP TO 50%
                  </span>
                </Link>

                <Link
                  href="/orders"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold transition ${
                    pathname.startsWith("/orders") ? "bg-amber-50 text-amber-900 border border-amber-200" : "text-slate-700 hover:bg-slate-100"
                  }`}
                >
                  <ReceiptIcon size={16} className="text-amber-600" />
                  <span>My Feast Orders</span>
                </Link>

                <button
                  type="button"
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    setIsReservationOpen(true);
                  }}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-100 transition text-left"
                >
                  <ClocheIcon size={16} className="text-amber-600" />
                  <span>Book Dine-In Table</span>
                </button>

                <Link
                  href="/admin"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold transition ${
                    pathname.startsWith("/admin") ? "bg-amber-500 text-slate-950 font-black" : "text-amber-900 bg-amber-50/80 hover:bg-amber-100"
                  }`}
                >
                  <span>⚡ Admin Dashboard</span>
                  <span className="ml-auto text-[9px] font-bold bg-amber-200 text-amber-950 px-1.5 py-0.5 rounded-md">
                    Full Suite
                  </span>
                </Link>

                <Link
                  href="/partner"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold transition ${
                    pathname.startsWith("/partner") ? "bg-amber-50 text-amber-900 border border-amber-200" : "text-slate-700 hover:bg-slate-100"
                  }`}
                >
                  <ClocheIcon size={16} className="text-amber-600" />
                  <span>Partner Studio</span>
                </Link>

                <Link
                  href="/faq"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold transition ${
                    pathname.startsWith("/faq") ? "bg-amber-50 text-amber-900 border border-amber-200" : "text-slate-700 hover:bg-slate-100"
                  }`}
                >
                  <span>❓ FAQ & Help Center</span>
                </Link>
              </div>
            </div>

            {/* Drawer Footer */}
            <div className="p-4 border-t border-slate-200 bg-slate-50">
              {user && (
                <button
                  type="button"
                  onClick={() => {
                    setUser(null);
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full mb-3 py-2 text-xs font-bold text-red-600 bg-red-50 hover:bg-red-100 rounded-xl transition text-center"
                >
                  Sign Out
                </button>
              )}
              <div className="flex items-center justify-between text-[11px] text-slate-500">
                <span>Concierge Hotline:</span>
                <span className="font-bold text-slate-900">+880 1800-FEASTORA</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          4. MOBILE SEARCH OVERLAY (Full-Screen / xl:hidden)
      ────────────────────────────────────────────────────────────── */}
      {isMobileSearchOpen && (
        <div className="fixed inset-0 z-50 bg-white/95 backdrop-blur-md flex flex-col p-4 animate-fade-in">
          {/* Search Header */}
          <div className="flex items-center gap-3 pb-3 border-b border-slate-200">
            <div className="relative flex-1">
              <SearchIcon size={18} className="absolute left-3.5 top-3 text-slate-400" />
              <input
                ref={mobileSearchInputRef}
                type="text"
                placeholder="Search Biryani, Burgers, Sushi, Pizza..."
                value={mobileSearch}
                onChange={(e) => setMobileSearch(e.target.value)}
                className="w-full bg-slate-100 border border-slate-200 rounded-2xl pl-10 pr-10 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-amber-500 focus:bg-white transition"
              />
              {mobileSearch && (
                <button
                  type="button"
                  onClick={() => setMobileSearch("")}
                  className="absolute right-3 top-3 text-slate-400 hover:text-slate-600"
                >
                  <XIcon size={16} />
                </button>
              )}
            </div>
            <button
              type="button"
              onClick={() => {
                setIsMobileSearchOpen(false);
                setMobileSearch("");
              }}
              className="px-3 py-2 text-xs font-bold text-slate-700 hover:text-slate-900 rounded-xl hover:bg-slate-100"
            >
              Cancel
            </button>
          </div>

          {/* Quick Filter Chips */}
          <div className="py-3 flex items-center gap-1.5 overflow-x-auto no-scrollbar border-b border-slate-100">
            <span className="text-[10px] font-bold text-slate-400 shrink-0">Popular:</span>
            {SEARCH_SUGGESTIONS.map((tag) => (
              <button
                key={tag}
                type="button"
                onClick={() => setMobileSearch(tag)}
                className="px-2.5 py-1 rounded-full bg-slate-100 hover:bg-amber-100 text-slate-700 hover:text-amber-900 text-xs font-semibold shrink-0 transition"
              >
                {tag}
              </button>
            ))}
          </div>

          {/* Live Search Results */}
          <div className="flex-1 overflow-y-auto py-4 space-y-5">
            {!mobileSearch.trim() ? (
              <div className="text-center py-12 text-slate-400">
                <SearchIcon size={36} className="mx-auto mb-2 text-slate-300" />
                <p className="text-xs font-semibold">Search Dhaka's top 10 luxury kitchens & 36+ dishes</p>
              </div>
            ) : mobileMatchedRestaurants.length === 0 && mobileMatchedItems.length === 0 ? (
              <div className="text-center py-10">
                <p className="text-sm font-semibold text-slate-700">No results found for "{mobileSearch}"</p>
                <p className="text-xs text-slate-400 mt-1">Try another keyword or category name.</p>
              </div>
            ) : (
              <>
                {/* Matched Kitchens */}
                {mobileMatchedRestaurants.length > 0 && (
                  <div>
                    <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                      Matching Kitchens
                    </h4>
                    <div className="space-y-2">
                      {mobileMatchedRestaurants.map((r) => (
                        <Link
                          key={r._id}
                          href={`/restaurant/${r.slug || r._id}`}
                          onClick={() => {
                            setIsMobileSearchOpen(false);
                            setMobileSearch("");
                          }}
                          className="flex items-center gap-3 p-3 rounded-2xl bg-slate-50 hover:bg-amber-50/60 border border-slate-200 transition"
                        >
                          <img
                            src={r.logo}
                            alt={r.name}
                            className="w-12 h-12 rounded-xl object-cover border border-slate-200 shrink-0"
                          />
                          <div className="min-w-0 flex-1">
                            <h5 className="text-xs font-bold text-slate-900 truncate">{r.name}</h5>
                            <p className="text-[10px] text-slate-500 truncate">{r.cuisines.join(", ")}</p>
                            <div className="flex items-center gap-2 mt-1 text-[10px]">
                              <span className="font-bold text-amber-600 flex items-center gap-0.5">
                                <StarIcon size={10} /> {r.rating.toFixed(1)}
                              </span>
                              <span className="text-slate-400">·</span>
                              <span className="text-slate-500">{r.deliveryTime}</span>
                            </div>
                          </div>
                          <ChevronRightIcon size={16} className="text-slate-400 shrink-0" />
                        </Link>
                      ))}
                    </div>
                  </div>
                )}

                {/* Matched Dishes */}
                {mobileMatchedItems.length > 0 && (
                  <div>
                    <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                      Matching Dishes
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      {mobileMatchedItems.map((dish) => {
                        const matchedRest = restaurants.find(
                          (r) => r._id === dish.restaurantId || (dish.restaurantId as any)?._id === r._id
                        ) || restaurants[0];

                        return (
                          <div
                            key={dish._id}
                            className="p-3 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between gap-3"
                          >
                            <img
                              src={dish.image}
                              alt={dish.name}
                              className="w-14 h-14 rounded-xl object-cover border border-slate-200 shrink-0"
                            />
                            <div className="flex-1 min-w-0">
                              <h5 className="text-xs font-bold text-slate-900 truncate">{dish.name}</h5>
                              <p className="text-[11px] text-amber-700 font-bold mt-0.5">
                                {dish.discountPrice || dish.price} ৳
                              </p>
                            </div>
                            <button
                              type="button"
                              onClick={() => {
                                if (dish.options && dish.options.length > 0) {
                                  setActiveItemModal({ item: dish, restaurant: matchedRest });
                                } else {
                                  addToCart(dish, matchedRest);
                                }
                                setIsMobileSearchOpen(false);
                                setMobileSearch("");
                              }}
                              className="px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold rounded-xl flex items-center gap-1 shrink-0"
                            >
                              <PlusIcon size={12} />
                              <span>Add</span>
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          5. STICKY MOBILE BOTTOM NAVIGATION BAR (md:hidden)
      ────────────────────────────────────────────────────────────── */}
      <nav className="fixed bottom-0 inset-x-0 z-40 bg-white/95 backdrop-blur-lg border-t border-slate-200/90 py-1.5 px-2 shadow-[0_-4px_20px_rgba(0,0,0,0.06)] md:hidden">
        <div className="max-w-md mx-auto grid grid-cols-5 gap-1">
          {/* 1. Home */}
          <Link
            href="/"
            className={`flex flex-col items-center justify-center py-1 rounded-xl transition ${
              pathname === "/" ? "text-amber-600 font-bold" : "text-slate-500 hover:text-slate-800"
            }`}
          >
            <HomeIcon size={20} />
            <span className="text-[10px] mt-0.5 font-semibold">Home</span>
          </Link>

          {/* 2. Search */}
          <button
            type="button"
            onClick={() => setIsMobileSearchOpen(true)}
            className="flex flex-col items-center justify-center py-1 rounded-xl text-slate-500 hover:text-amber-600 transition"
          >
            <SearchIcon size={20} />
            <span className="text-[10px] mt-0.5 font-semibold">Search</span>
          </button>

          {/* 3. Dine-In Table */}
          <button
            type="button"
            onClick={() => setIsReservationOpen(true)}
            className="flex flex-col items-center justify-center py-1 rounded-xl text-slate-500 hover:text-amber-600 transition"
          >
            <ClocheIcon size={20} />
            <span className="text-[10px] mt-0.5 font-semibold">Dine-In</span>
          </button>

          {/* 4. Orders */}
          <Link
            href="/orders"
            className={`flex flex-col items-center justify-center py-1 rounded-xl transition ${
              pathname.startsWith("/orders") ? "text-amber-600 font-bold" : "text-slate-500 hover:text-slate-800"
            }`}
          >
            <ReceiptIcon size={20} />
            <span className="text-[10px] mt-0.5 font-semibold">Orders</span>
          </Link>

          {/* 5. Bag */}
          <button
            type="button"
            onClick={() => setIsCartOpen(true)}
            className="relative flex flex-col items-center justify-center py-1 rounded-xl text-slate-500 hover:text-amber-600 transition"
          >
            <div className="relative">
              <ShoppingBagIcon size={20} />
              {cartCount > 0 && (
                <span className="absolute -top-1.5 -right-2.5 w-4 h-4 rounded-full bg-red-600 text-white text-[9px] font-black flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </div>
            <span className="text-[10px] mt-0.5 font-semibold">Bag</span>
          </button>
        </div>
      </nav>

      {/* ─────────────────────────────────────────────────────────────
          6. DELIVERY AREA MODAL (All Devices)
      ────────────────────────────────────────────────────────────── */}
      {isAreaModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-md bg-white border border-slate-200 rounded-3xl p-5 sm:p-6 shadow-2xl relative text-slate-800">
            <button
              type="button"
              onClick={() => setIsAreaModalOpen(false)}
              className="absolute top-4 right-4 sm:top-5 sm:right-5 text-slate-400 hover:text-slate-700 p-1"
            >
              <XIcon size={20} />
            </button>

            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600 shrink-0">
                <MapPinIcon size={20} />
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-bold text-slate-900 font-serif">Delivery Address</h3>
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
                    className={`p-2.5 sm:p-3 rounded-xl text-xs font-semibold text-left border transition ${
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
