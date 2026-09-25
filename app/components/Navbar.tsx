"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCart } from "../context/CartContext";
import { fetchRestaurants, Restaurant, MenuItem, fetchAllItems } from "../lib/api";
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

  const [isAreaModalOpen, setIsAreaModalOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
  const [customAreaInput, setCustomAreaInput] = useState("");
  const [navSearch, setNavSearch] = useState("");
  const [mobileSearch, setMobileSearch] = useState("");
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [allItems, setAllItems] = useState<MenuItem[]>([]);
  const [isDesktopSearchActive, setIsDesktopSearchActive] = useState(false);
  const mobileSearchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchRestaurants().then(setRestaurants).catch(() => {});
    fetchAllItems().then(setAllItems).catch(() => {});
  }, []);

  // Lock scroll when overlays open
  useEffect(() => {
    const locked = isMobileMenuOpen || isMobileSearchOpen || isAreaModalOpen;
    document.body.style.overflow = locked ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isMobileMenuOpen, isMobileSearchOpen, isAreaModalOpen]);

  useEffect(() => {
    if (isMobileSearchOpen) {
      setTimeout(() => mobileSearchInputRef.current?.focus(), 150);
    }
  }, [isMobileSearchOpen]);

  const handleSelectArea = (area: string) => {
    setSelectedArea(area);
    setIsAreaModalOpen(false);
    setCustomAreaInput("");
  };

  const handleModeClick = (mode: "delivery" | "pickup" | "dinein") => {
    setServiceType(mode);
    if (mode === "dinein") setIsReservationOpen(true);
  };

  // Mobile live search
  const mobileQ = mobileSearch.trim().toLowerCase();
  const mobileMatchedRestaurants = mobileQ
    ? restaurants.filter(r =>
        r.name.toLowerCase().includes(mobileQ) ||
        r.cuisines.some(c => c.toLowerCase().includes(mobileQ))
      ).slice(0, 3)
    : [];
  const mobileMatchedItems = mobileQ
    ? allItems.filter(item =>
        item.name.toLowerCase().includes(mobileQ) ||
        item.description?.toLowerCase().includes(mobileQ) ||
        item.category?.toLowerCase().includes(mobileQ)
      ).slice(0, 6)
    : [];

  return (
    <>
      {/* ═══════════════════════════════════════════════════════════
          STICKY TOP HEADER
      ═══════════════════════════════════════════════════════════ */}
      <header className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-[0_2px_12px_-2px_rgba(0,0,0,0.05)]">

        {/* ── Main Row ─────────────────────────────────────────── */}
        <div className="max-w-7xl mx-auto px-3 sm:px-5 lg:px-8 h-14 sm:h-16 lg:h-18 flex items-center gap-2">

          {/* ── Hamburger (Mobile / Tablet < lg) ─── */}
          <button
            type="button"
            onClick={() => setIsMobileMenuOpen(true)}
            aria-label="Open menu"
            className="lg:hidden flex-shrink-0 p-2 rounded-xl text-slate-600 hover:text-amber-600 hover:bg-slate-100 transition active:scale-95"
          >
            <MenuIcon size={20} />
          </button>

          {/* ── Brand Logo ──────────────────────────────────────── */}
          <Link href="/" className="flex items-center gap-2 group flex-shrink-0">
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-gradient-to-tr from-amber-500 to-amber-400 p-px shadow-md shadow-amber-500/20 group-hover:scale-105 transition-transform duration-200">
              <div className="w-full h-full bg-white rounded-[11px] flex items-center justify-center">
                <FlameIcon size={16} className="text-amber-500" />
              </div>
            </div>
            <div className="hidden xs:flex flex-col leading-none">
              <div className="flex items-center gap-1">
                <span className="text-lg sm:text-xl font-black tracking-tight text-slate-900 font-serif">
                  FEAST<span className="text-amber-600">ORA</span>
                </span>
                <span className="hidden sm:inline-block px-1.5 py-0.5 text-[8px] font-black bg-amber-50 text-amber-700 border border-amber-200 rounded">
                  PRIME
                </span>
              </div>
              <span className="hidden md:block text-[9px] tracking-wider text-slate-400 uppercase font-semibold">
                Artisanal Dining
              </span>
            </div>
          </Link>

          {/* ── Service Switcher (Desktop lg+) ──────────────────── */}
          <div className="hidden lg:flex items-center p-1 bg-slate-100 rounded-full border border-slate-200 text-xs font-semibold flex-shrink-0">
            {[
              { id: "delivery" as const, icon: <BikeIcon size={13} />, label: "Delivery" },
              { id: "pickup" as const, icon: <ShoppingBagIcon size={13} />, label: "Takeaway" },
              { id: "dinein" as const, icon: <ClocheIcon size={13} />, label: "Dine-In" },
            ].map(m => (
              <button
                key={m.id}
                type="button"
                onClick={() => handleModeClick(m.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full transition-all duration-200 ${
                  serviceType === m.id
                    ? "bg-amber-500 text-slate-950 font-bold shadow-sm"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                {m.icon}
                <span>{m.label}</span>
              </button>
            ))}
          </div>

          {/* ── Location Button (sm+ visible) ───────────────────── */}
          <button
            type="button"
            onClick={() => setIsAreaModalOpen(true)}
            className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-2xl bg-slate-50 hover:bg-slate-100 border border-slate-200 transition shadow-xs group flex-shrink-0 min-w-0 max-w-[160px] lg:max-w-[180px]"
          >
            <div className="relative w-6 h-6 rounded-lg bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600 group-hover:bg-amber-500 group-hover:text-white transition flex-shrink-0">
              <MapPinIcon size={13} />
              <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-[9px] text-slate-500 font-semibold leading-none">Deliver to</span>
              <span className="text-[11px] font-bold text-slate-800 truncate">{selectedArea}</span>
            </div>
            <span className="text-slate-400 text-[10px] flex-shrink-0">▼</span>
          </button>

          {/* ── Search Bar (xl+ only) ─────────────────────────── */}
          <div className="hidden xl:block relative flex-1 max-w-64">
            <SearchIcon size={13} className="absolute left-3 top-2.5 text-slate-400 pointer-events-none" />
            <input
              type="text"
              placeholder="Search kitchens or dishes..."
              value={navSearch}
              onChange={e => { setNavSearch(e.target.value); setIsDesktopSearchActive(true); }}
              onFocus={() => setIsDesktopSearchActive(true)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-8 pr-8 py-2 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-amber-400 focus:bg-white transition"
            />
            {navSearch && (
              <button
                type="button"
                onClick={() => { setNavSearch(""); setIsDesktopSearchActive(false); }}
                className="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-600"
              >
                <XIcon size={12} />
              </button>
            )}
            {isDesktopSearchActive && navSearch.trim() && (
              <SearchPopover
                searchTerm={navSearch}
                restaurants={restaurants}
                items={allItems}
                className="w-[420px] right-0 left-auto"
                onClose={() => { setIsDesktopSearchActive(false); setNavSearch(""); }}
              />
            )}
          </div>

          {/* ── Spacer ─────────────────────────────────────────── */}
          <div className="flex-1" />

          {/* ── Right Actions ──────────────────────────────────── */}
          <div className="flex items-center gap-1.5 sm:gap-2 flex-shrink-0">

            {/* Search icon (mobile/tablet < xl) */}
            <button
              type="button"
              onClick={() => setIsMobileSearchOpen(true)}
              aria-label="Search"
              className="xl:hidden p-2 rounded-xl text-slate-600 hover:text-amber-600 hover:bg-slate-100 transition active:scale-95"
            >
              <SearchIcon size={18} />
            </button>

            {/* Deals (md+) */}
            <Link
              href="/#deals-section"
              className="hidden md:flex items-center gap-1 px-2.5 py-1.5 text-xs font-bold text-amber-700 hover:bg-amber-50 rounded-xl transition"
            >
              <TagIcon size={13} className="text-amber-600" />
              <span>Deals</span>
            </Link>

            {/* Partner (lg+) */}
            <Link
              href="/partner"
              className="hidden lg:flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-100 rounded-xl border border-slate-200 transition"
            >
              <ClocheIcon size={13} className="text-amber-600" />
              <span>Partner</span>
            </Link>

            {/* Admin (md+) */}
            <Link
              href="/admin"
              className="hidden md:flex items-center gap-1 px-2.5 py-1.5 text-xs font-bold text-amber-900 bg-amber-50 hover:bg-amber-100 rounded-xl border border-amber-200 transition"
            >
              <span>⚡</span>
              <span className="hidden lg:inline">Admin</span>
            </Link>

            {/* User Profile / Sign In */}
            {user ? (
              <div className="relative group">
                <button
                  type="button"
                  className="flex items-center gap-1.5 p-1 pr-2 sm:pr-3 rounded-full bg-slate-50 border border-slate-200 hover:border-slate-300 transition"
                >
                  <img
                    src={user.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&auto=format&fit=crop&q=80"}
                    alt={user.name}
                    className="w-7 h-7 rounded-full object-cover border border-amber-500 flex-shrink-0"
                  />
                  <span className="text-xs font-bold text-slate-800 hidden sm:inline max-w-[72px] truncate">
                    {user.name.split(" ")[0]}
                  </span>
                </button>
                {/* Hover Dropdown */}
                <div className="absolute right-0 mt-2 w-52 py-2 bg-white rounded-2xl border border-slate-200 shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                  <div className="px-4 py-2 border-b border-slate-100">
                    <p className="text-xs font-bold text-slate-900 truncate">{user.name}</p>
                    <p className="text-[11px] text-slate-500 truncate">{user.email}</p>
                  </div>
                  <Link href="/orders" className="block px-4 py-2 text-xs text-slate-700 hover:text-amber-600 hover:bg-slate-50 font-medium">📦 My Feast Orders</Link>
                  <button type="button" onClick={() => setIsReservationOpen(true)} className="w-full text-left px-4 py-2 text-xs text-slate-700 hover:text-amber-600 hover:bg-slate-50 font-medium">🍷 Book Dine-In Table</button>
                  <Link href="/admin" className="block px-4 py-2 text-xs text-amber-800 font-bold hover:bg-amber-50">⚡ Admin Dashboard</Link>
                  <Link href="/partner" className="block px-4 py-2 text-xs text-slate-700 hover:text-amber-600 hover:bg-slate-50">👨‍🍳 Partner Studio</Link>
                  <div className="border-t border-slate-100 my-1" />
                  <button type="button" onClick={() => setUser(null)} className="w-full text-left px-4 py-2 text-xs text-red-600 hover:bg-red-50 font-semibold">Sign Out</button>
                </div>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setIsAuthOpen(true)}
                className="hidden sm:flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold border border-slate-200 transition"
              >
                <UserIcon size={13} className="text-amber-600" />
                <span>Sign In</span>
              </button>
            )}

            {/* Cart Button — always visible, never overflows */}
            <button
              type="button"
              onClick={() => setIsCartOpen(true)}
              className="relative flex items-center justify-center gap-1.5 px-3 py-1.5 sm:py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-xs shadow-md shadow-amber-500/20 transition hover:scale-[1.02] flex-shrink-0"
            >
              <div className="relative flex-shrink-0">
                <ShoppingBagIcon size={15} />
                {cartCount > 0 && (
                  <span className="absolute -top-2.5 -right-2.5 w-4 h-4 rounded-full bg-red-600 text-white text-[9px] font-black flex items-center justify-center animate-pulse">
                    {cartCount}
                  </span>
                )}
              </div>
              <span className="hidden sm:inline">Bag</span>
              {cartCount > 0 && (
                <span className="hidden sm:inline text-[11px] font-bold pl-1 border-l border-black/20">
                  {total}৳
                </span>
              )}
            </button>
          </div>
        </div>

        {/* ── Mobile Sub-Bar (< sm: location + mode switcher) ─── */}
        <div className="sm:hidden flex items-center gap-2 px-3 py-1.5 bg-slate-50 border-t border-slate-200/80">
          {/* Location chip */}
          <button
            type="button"
            onClick={() => setIsAreaModalOpen(true)}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-[11px] font-bold text-slate-700 hover:border-amber-400 transition min-w-0 flex-1 max-w-[52%]"
          >
            <MapPinIcon size={11} className="text-amber-600 flex-shrink-0" />
            <span className="truncate">{selectedArea.split(",")[0]}</span>
            <span className="text-[9px] text-slate-400 flex-shrink-0 ml-auto">▾</span>
          </button>

          {/* Mode switcher pills */}
          <div className="flex items-center p-0.5 bg-white border border-slate-200 rounded-lg text-[10px] font-bold flex-shrink-0">
            {[
              { id: "delivery" as const, label: "Delivery" },
              { id: "pickup" as const, label: "Takeaway" },
              { id: "dinein" as const, label: "Dine-In" },
            ].map(m => (
              <button
                key={m.id}
                type="button"
                onClick={() => handleModeClick(m.id)}
                className={`px-2 py-0.5 rounded-md transition ${
                  serviceType === m.id
                    ? "bg-amber-500 text-slate-950 shadow-xs"
                    : "text-slate-500 hover:text-slate-800"
                }`}
              >
                {m.label}
              </button>
            ))}
          </div>
        </div>

        {/* ── Tablet Sub-Bar (sm – lg: compact mode switcher row) ─ */}
        <div className="hidden sm:flex lg:hidden items-center gap-3 px-4 py-1.5 bg-slate-50 border-t border-slate-200/70">
          <div className="flex items-center p-0.5 bg-white border border-slate-200 rounded-full text-[11px] font-bold flex-shrink-0">
            {[
              { id: "delivery" as const, icon: <BikeIcon size={11} />, label: "Delivery" },
              { id: "pickup" as const, icon: <ShoppingBagIcon size={11} />, label: "Takeaway" },
              { id: "dinein" as const, icon: <ClocheIcon size={11} />, label: "Dine-In" },
            ].map(m => (
              <button
                key={m.id}
                type="button"
                onClick={() => handleModeClick(m.id)}
                className={`flex items-center gap-1 px-3 py-1 rounded-full transition ${
                  serviceType === m.id
                    ? "bg-amber-500 text-slate-950 shadow-sm"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                {m.icon}
                <span>{m.label}</span>
              </button>
            ))}
          </div>
          <span className="text-slate-300 text-xs">|</span>
          <span className="text-[10px] text-slate-500 font-medium truncate">
            📍 {selectedArea}
          </span>
        </div>
      </header>

      {/* ═══════════════════════════════════════════════════════════
          MOBILE SLIDE-OVER DRAWER
      ═══════════════════════════════════════════════════════════ */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-slate-950/50 backdrop-blur-sm"
            onClick={() => setIsMobileMenuOpen(false)}
          />

          {/* Drawer */}
          <div className="absolute inset-y-0 left-0 w-[300px] sm:w-[320px] bg-white shadow-2xl flex flex-col overflow-y-auto border-r border-slate-100 animate-slide-in-left">
            {/* Drawer Header */}
            <div className="flex items-center justify-between px-4 py-3.5 border-b border-slate-100">
              <Link href="/" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-amber-500 to-amber-400 p-px shadow-sm">
                  <div className="w-full h-full bg-white rounded-[11px] flex items-center justify-center">
                    <FlameIcon size={15} className="text-amber-500" />
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
                <XIcon size={18} />
              </button>
            </div>

            {/* User Section */}
            <div className="px-4 py-3.5 bg-slate-50 border-b border-slate-100">
              {user ? (
                <div className="flex items-center gap-3">
                  <img
                    src={user.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&auto=format&fit=crop&q=80"}
                    alt={user.name}
                    className="w-10 h-10 rounded-full object-cover border-2 border-amber-500 flex-shrink-0"
                  />
                  <div className="min-w-0">
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
                  <p className="text-[11px] text-slate-500 mb-3">Sign in to track orders & unlock VIP offers</p>
                  <button
                    type="button"
                    onClick={() => { setIsMobileMenuOpen(false); setIsAuthOpen(true); }}
                    className="w-full py-2 bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-bold text-xs rounded-xl shadow-sm"
                  >
                    Sign In / Register
                  </button>
                </div>
              )}
            </div>

            {/* Service Mode */}
            <div className="px-4 py-3 border-b border-slate-100">
              <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-2">Ordering Mode</p>
              <div className="grid grid-cols-3 gap-1.5">
                {[
                  { id: "delivery" as const, icon: <BikeIcon size={15} />, label: "Delivery" },
                  { id: "pickup" as const, icon: <ShoppingBagIcon size={15} />, label: "Takeaway" },
                  { id: "dinein" as const, icon: <ClocheIcon size={15} />, label: "Dine-In" },
                ].map(m => (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => { handleModeClick(m.id); setIsMobileMenuOpen(false); }}
                    className={`p-2.5 rounded-xl border text-center transition flex flex-col items-center gap-1 ${
                      serviceType === m.id
                        ? "bg-amber-50 border-amber-400 text-amber-900 font-bold"
                        : "bg-white border-slate-200 text-slate-600"
                    }`}
                  >
                    <span className="text-amber-600">{m.icon}</span>
                    <span className="text-[10px]">{m.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Location */}
            <div className="px-4 py-3 border-b border-slate-100">
              <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-2">Delivery Destination</p>
              <button
                type="button"
                onClick={() => { setIsMobileMenuOpen(false); setIsAreaModalOpen(true); }}
                className="w-full flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200 hover:bg-amber-50 hover:border-amber-300 transition"
              >
                <div className="flex items-center gap-2 min-w-0">
                  <MapPinIcon size={14} className="text-amber-600 flex-shrink-0" />
                  <span className="text-xs font-bold text-slate-800 truncate">{selectedArea}</span>
                </div>
                <span className="text-[10px] font-bold text-amber-700 bg-amber-100 px-2 py-0.5 rounded-md flex-shrink-0">Change</span>
              </button>
            </div>

            {/* Navigation Links */}
            <nav className="flex-1 px-3 py-3 space-y-1">
              {[
                { href: "/", icon: <HomeIcon size={15} />, label: "Home & Discovery", active: pathname === "/" },
                { href: "/#deals-section", icon: <TagIcon size={15} />, label: "VIP Deals & Vouchers", badge: "UP TO 50%", active: false },
                { href: "/orders", icon: <ReceiptIcon size={15} />, label: "My Feast Orders", active: pathname.startsWith("/orders") },
                { href: "/admin", icon: <span className="text-[13px]">⚡</span>, label: "Admin Dashboard", active: pathname.startsWith("/admin"), adminStyle: true },
                { href: "/partner", icon: <ClocheIcon size={15} />, label: "Partner Studio", active: pathname.startsWith("/partner") },
                { href: "/faq", icon: <span className="text-[13px]">❓</span>, label: "FAQ & Help", active: pathname.startsWith("/faq") },
              ].map(item => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold transition ${
                    item.adminStyle
                      ? item.active
                        ? "bg-amber-500 text-slate-950"
                        : "text-amber-900 bg-amber-50 hover:bg-amber-100"
                      : item.active
                        ? "bg-amber-50 text-amber-900 border border-amber-200"
                        : "text-slate-700 hover:bg-slate-100"
                  }`}
                >
                  <span className="text-amber-600 flex-shrink-0">{item.icon}</span>
                  <span className="flex-1">{item.label}</span>
                  {item.badge && (
                    <span className="text-[9px] font-black bg-red-100 text-red-600 px-1.5 py-0.5 rounded-full">{item.badge}</span>
                  )}
                </Link>
              ))}

              {/* Book Table */}
              <button
                type="button"
                onClick={() => { setIsMobileMenuOpen(false); setIsReservationOpen(true); }}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-100 transition text-left"
              >
                <ClocheIcon size={15} className="text-amber-600 flex-shrink-0" />
                <span>Book Dine-In Table</span>
              </button>
            </nav>

            {/* Drawer Footer */}
            <div className="px-4 py-4 border-t border-slate-100 bg-slate-50">
              {user && (
                <button
                  type="button"
                  onClick={() => { setUser(null); setIsMobileMenuOpen(false); }}
                  className="w-full mb-3 py-2 text-xs font-bold text-red-600 bg-red-50 hover:bg-red-100 rounded-xl transition"
                >
                  Sign Out
                </button>
              )}
              <div className="flex items-center justify-between text-[10px] text-slate-500">
                <span>Concierge:</span>
                <span className="font-bold text-slate-800">+880 1800-FEASTORA</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════
          MOBILE FULL-SCREEN SEARCH OVERLAY
      ═══════════════════════════════════════════════════════════ */}
      {isMobileSearchOpen && (
        <div className="fixed inset-0 z-50 bg-white flex flex-col">
          {/* Search Header */}
          <div className="flex items-center gap-3 px-4 py-3 border-b border-slate-200 bg-white">
            <div className="relative flex-1">
              <SearchIcon size={16} className="absolute left-3.5 top-3 text-slate-400 pointer-events-none" />
              <input
                ref={mobileSearchInputRef}
                type="text"
                placeholder="Search biryani, burgers, sushi, pizza..."
                value={mobileSearch}
                onChange={e => setMobileSearch(e.target.value)}
                className="w-full bg-slate-100 border border-slate-200 rounded-2xl pl-10 pr-9 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-amber-400 focus:bg-white transition"
              />
              {mobileSearch && (
                <button
                  type="button"
                  onClick={() => setMobileSearch("")}
                  className="absolute right-3 top-3 text-slate-400 hover:text-slate-600"
                >
                  <XIcon size={15} />
                </button>
              )}
            </div>
            <button
              type="button"
              onClick={() => { setIsMobileSearchOpen(false); setMobileSearch(""); }}
              className="text-xs font-bold text-slate-700 hover:text-amber-600 px-2 py-1.5 rounded-xl hover:bg-slate-100 flex-shrink-0"
            >
              Cancel
            </button>
          </div>

          {/* Quick Chips */}
          <div className="flex items-center gap-2 px-4 py-2.5 overflow-x-auto no-scrollbar border-b border-slate-100">
            <span className="text-[10px] font-bold text-slate-400 flex-shrink-0">Popular:</span>
            {SEARCH_SUGGESTIONS.map(tag => (
              <button
                key={tag}
                type="button"
                onClick={() => setMobileSearch(tag)}
                className="px-2.5 py-1 rounded-full bg-slate-100 hover:bg-amber-100 text-slate-700 hover:text-amber-900 text-xs font-semibold flex-shrink-0 transition"
              >
                {tag}
              </button>
            ))}
          </div>

          {/* Results */}
          <div className="flex-1 overflow-y-auto px-4 py-4 space-y-5">
            {!mobileSearch.trim() ? (
              <div className="text-center py-16 text-slate-400">
                <SearchIcon size={36} className="mx-auto mb-3 text-slate-300" />
                <p className="text-sm font-semibold">Search 10 kitchens & 36+ dishes</p>
                <p className="text-xs text-slate-400 mt-1">Type a cuisine, dish name, or restaurant</p>
              </div>
            ) : mobileMatchedRestaurants.length === 0 && mobileMatchedItems.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-sm font-semibold text-slate-700">No results for "{mobileSearch}"</p>
                <p className="text-xs text-slate-400 mt-1">Try another keyword or category.</p>
              </div>
            ) : (
              <>
                {mobileMatchedRestaurants.length > 0 && (
                  <div>
                    <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Kitchens</h4>
                    <div className="space-y-2">
                      {mobileMatchedRestaurants.map(r => (
                        <Link
                          key={r._id}
                          href={`/restaurant/${r.slug || r._id}`}
                          onClick={() => { setIsMobileSearchOpen(false); setMobileSearch(""); }}
                          className="flex items-center gap-3 p-3 rounded-2xl bg-slate-50 hover:bg-amber-50 border border-slate-200 transition"
                        >
                          <img src={r.logo} alt={r.name} className="w-12 h-12 rounded-xl object-cover border border-slate-200 flex-shrink-0" />
                          <div className="min-w-0 flex-1">
                            <h5 className="text-xs font-bold text-slate-900 truncate">{r.name}</h5>
                            <p className="text-[10px] text-slate-500 truncate">{r.cuisines.join(", ")}</p>
                            <div className="flex items-center gap-2 mt-0.5 text-[10px]">
                              <span className="font-bold text-amber-600 flex items-center gap-0.5"><StarIcon size={10} /> {r.rating.toFixed(1)}</span>
                              <span className="text-slate-400">·</span>
                              <span className="text-slate-500">{r.deliveryTime}</span>
                            </div>
                          </div>
                          <ChevronRightIcon size={14} className="text-slate-400 flex-shrink-0" />
                        </Link>
                      ))}
                    </div>
                  </div>
                )}

                {mobileMatchedItems.length > 0 && (
                  <div>
                    <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Dishes</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      {mobileMatchedItems.map(dish => {
                        const matchedRest = restaurants.find(r => r._id === dish.restaurantId || (dish.restaurantId as any)?._id === r._id) || restaurants[0];
                        return (
                          <div key={dish._id} className="flex items-center gap-3 p-3 rounded-2xl bg-slate-50 border border-slate-200">
                            <img src={dish.image} alt={dish.name} className="w-14 h-14 rounded-xl object-cover border border-slate-200 flex-shrink-0" />
                            <div className="flex-1 min-w-0">
                              <h5 className="text-xs font-bold text-slate-900 truncate">{dish.name}</h5>
                              <p className="text-[11px] text-amber-700 font-bold mt-0.5">{dish.discountPrice || dish.price}৳</p>
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
                              className="px-2.5 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold rounded-xl flex items-center gap-1 flex-shrink-0"
                            >
                              <PlusIcon size={11} />
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

      {/* ═══════════════════════════════════════════════════════════
          STICKY BOTTOM NAV (Mobile / Tablet < md)
      ═══════════════════════════════════════════════════════════ */}
      <nav className="fixed bottom-0 inset-x-0 z-40 md:hidden bg-white/95 backdrop-blur-lg border-t border-slate-200 shadow-[0_-2px_16px_rgba(0,0,0,0.06)] safe-area-pb">
        <div className="grid grid-cols-5 max-w-md mx-auto px-2 py-1">
          {[
            { href: "/", icon: <HomeIcon size={20} />, label: "Home", active: pathname === "/" },
          ].map(item => (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center justify-center py-1.5 rounded-xl transition ${
                item.active ? "text-amber-600" : "text-slate-400 hover:text-slate-700"
              }`}
            >
              {item.icon}
              <span className="text-[10px] mt-0.5 font-semibold">{item.label}</span>
            </Link>
          ))}

          {/* Search */}
          <button
            type="button"
            onClick={() => setIsMobileSearchOpen(true)}
            className="flex flex-col items-center justify-center py-1.5 rounded-xl text-slate-400 hover:text-amber-600 transition"
          >
            <SearchIcon size={20} />
            <span className="text-[10px] mt-0.5 font-semibold">Search</span>
          </button>

          {/* Dine-In */}
          <button
            type="button"
            onClick={() => setIsReservationOpen(true)}
            className="flex flex-col items-center justify-center py-1.5 rounded-xl text-slate-400 hover:text-amber-600 transition"
          >
            <ClocheIcon size={20} />
            <span className="text-[10px] mt-0.5 font-semibold">Dine-In</span>
          </button>

          {/* Orders */}
          <Link
            href="/orders"
            className={`flex flex-col items-center justify-center py-1.5 rounded-xl transition ${
              pathname.startsWith("/orders") ? "text-amber-600" : "text-slate-400 hover:text-slate-700"
            }`}
          >
            <ReceiptIcon size={20} />
            <span className="text-[10px] mt-0.5 font-semibold">Orders</span>
          </Link>

          {/* Bag */}
          <button
            type="button"
            onClick={() => setIsCartOpen(true)}
            className="relative flex flex-col items-center justify-center py-1.5 rounded-xl text-slate-400 hover:text-amber-600 transition"
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

      {/* ═══════════════════════════════════════════════════════════
          DELIVERY AREA MODAL
      ═══════════════════════════════════════════════════════════ */}
      {isAreaModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="w-full max-w-sm sm:max-w-md bg-white border border-slate-200 rounded-3xl p-5 sm:p-6 shadow-2xl relative">
            <button
              type="button"
              onClick={() => setIsAreaModalOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 p-1"
            >
              <XIcon size={18} />
            </button>

            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600 flex-shrink-0">
                <MapPinIcon size={18} />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900 font-serif">Delivery Address</h3>
                <p className="text-xs text-slate-500">Pick your neighborhood</p>
              </div>
            </div>

            {/* Custom Input */}
            <div className="mb-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Enter street, apartment, or road..."
                  value={customAreaInput}
                  onChange={e => setCustomAreaInput(e.target.value)}
                  onKeyDown={e => { if (e.key === "Enter" && customAreaInput.trim()) handleSelectArea(customAreaInput.trim()); }}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-amber-400 transition pr-24"
                />
                {customAreaInput.trim() && (
                  <button
                    type="button"
                    onClick={() => handleSelectArea(customAreaInput.trim())}
                    className="absolute right-2 top-1.5 px-3 py-1.5 bg-amber-500 text-slate-950 text-xs font-bold rounded-lg"
                  >
                    Confirm
                  </button>
                )}
              </div>
            </div>

            {/* Predefined Areas */}
            <p className="text-[10px] font-bold text-slate-400 mb-2 uppercase tracking-wider">Dhaka Culinary Hubs</p>
            <div className="grid grid-cols-2 gap-2">
              {POPULAR_AREAS.map(area => (
                <button
                  key={area}
                  type="button"
                  onClick={() => handleSelectArea(area)}
                  className={`p-2.5 rounded-xl text-xs font-semibold text-left border transition ${
                    selectedArea === area
                      ? "bg-amber-50 border-amber-400 text-amber-800 shadow-sm"
                      : "bg-slate-50 border-slate-200 text-slate-700 hover:border-slate-300 hover:bg-slate-100"
                  }`}
                >
                  📍 {area}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
