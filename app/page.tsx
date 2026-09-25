"use client";

import React, { useState, useEffect } from "react";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import DealsBanner from "./components/DealsBanner";
import LoyaltyBanner from "./components/LoyaltyBanner";
import CategoryReel from "./components/CategoryReel";
import RestaurantCard from "./components/RestaurantCard";
import DishCard from "./components/DishCard";
import CartDrawer from "./components/CartDrawer";
import ItemModal from "./components/ItemModal";
import AuthModal from "./components/AuthModal";
import TableReservationModal from "./components/TableReservationModal";
import Footer from "./components/Footer";
import {
  Restaurant,
  Category,
  Deal,
  MenuItem,
  fetchRestaurants,
  fetchCategories,
  fetchDeals,
  API_BASE,
} from "./lib/api";
import { FlameIcon, SparklesIcon, ShieldCheckIcon, BikeIcon, StarIcon } from "./components/Icons";

export default function HomePage() {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [deals, setDeals] = useState<Deal[]>([]);
  const [popularDishes, setPopularDishes] = useState<{ item: MenuItem; restaurant: Restaurant }[]>([]);
  
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [activeFilterTab, setActiveFilterTab] = useState<"all" | "top_rated" | "fast" | "offers">("all");
  const [dietaryTag, setDietaryTag] = useState<string>("all");
  const [loading, setLoading] = useState(true);

  // Sync URL search params
  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const s = params.get("search");
      if (s) setSearchTerm(s);
      const cat = params.get("category");
      if (cat) setSelectedCategory(cat);
    }
  }, []);

  // Load initial data from MongoDB API
  useEffect(() => {
    async function loadData() {

      setLoading(true);
      try {
        const [restList, catList, dealList] = await Promise.all([
          fetchRestaurants(),
          fetchCategories().catch(() => []),
          fetchDeals().catch(() => []),
        ]);

        setRestaurants(restList);
        setCategories(catList);
        setDeals(dealList);

        // Fetch popular items from MongoDB
        try {
          const res = await fetch(`${API_BASE}/items?popular=true`);
          const json = await res.json();
          if (json.data && Array.isArray(json.data)) {
            const combined = json.data.map((dish: any) => {
              const matchedRest = restList.find((r) => r._id === dish.restaurantId?._id || r._id === dish.restaurantId) || restList[0];
              return { item: dish, restaurant: matchedRest };
            });
            setPopularDishes(combined.slice(0, 8));
          }
        } catch (e) {
          console.error("Error loading dishes:", e);
        }
      } catch (err) {
        console.error("Error loading marketplace data:", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  // Filter restaurants dynamically
  const filteredRestaurants = restaurants.filter((r) => {
    // 1. Search term match
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      const matchName = r.name.toLowerCase().includes(term);
      const matchCuisine = r.cuisines.some((c) => c.toLowerCase().includes(term));
      const matchTagline = r.tagline?.toLowerCase().includes(term);
      if (!matchName && !matchCuisine && !matchTagline) return false;
    }

    // 2. Category match
    if (selectedCategory !== "all") {
      const catLower = selectedCategory.toLowerCase();
      const matchCat = r.cuisines.some((c) =>
        c.toLowerCase().includes(catLower) || catLower.includes(c.toLowerCase())
      );
      if (!matchCat) return false;
    }

    // 3. Tab filter
    if (activeFilterTab === "top_rated" && r.rating < 4.8) return false;
    if (activeFilterTab === "fast") {
      const minTime = parseInt(r.deliveryTime) || 30;
      if (minTime > 25) return false;
    }
    if (activeFilterTab === "offers" && !r.discountText) return false;

    // 4. Dietary Tag filter
    if (dietaryTag === "halal" && !r.tags?.some((t) => t.toLowerCase().includes("halal"))) return false;
    if (dietaryTag === "veg" && !r.cuisines.some((c) => c.toLowerCase().includes("salad") || c.toLowerCase().includes("healthy"))) return false;

    return true;
  });

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col">
      <Navbar />

      <main className="flex-1">
        {/* 1. Hero Section */}
        <Hero
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          onSelectTag={(tag) => setSearchTerm(tag)}
        />

        {/* 2. VIP Loyalty Perks Strip (Advanced Feature) */}
        <LoyaltyBanner />

        {/* 3. Deals and Vouchers Banner */}
        <DealsBanner deals={deals} />

        {/* 4. Horizontal Cuisines & Delights Reel */}
        <CategoryReel
          categories={categories}
          selectedCategory={selectedCategory}
          onSelectCategory={(cat) => setSelectedCategory(cat)}
        />

        {/* 5. Trending Artisanal Dishes Section */}
        {popularDishes.length > 0 && (
          <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-red-50 border border-red-200 flex items-center justify-center text-red-600">
                  <FlameIcon size={18} />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-slate-900 font-serif">Popular Culinary Delicacies</h2>
                  <p className="text-xs text-slate-500">Most savored dishes across verified Dhaka master kitchens</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {popularDishes.map(({ item, restaurant }) => (
                <DishCard
                  key={item._id}
                  item={item}
                  restaurant={restaurant}
                />
              ))}
            </div>
          </section>
        )}

        {/* 6. Main Restaurants Marketplace Section */}
        <section id="restaurants-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                <h2 className="text-2xl font-black text-slate-900 font-serif">
                  Artisanal Kitchens & Restaurants
                </h2>
              </div>
              <p className="text-xs text-slate-500 mt-1">
                Showing {filteredRestaurants.length} premium kitchens available for delivery
              </p>
            </div>

            {/* Filter Tabs & Dietary Filter Matrix */}
            <div className="flex flex-wrap items-center gap-2">
              {/* Primary Tabs */}
              <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-white border border-slate-200 text-xs font-semibold shadow-xs overflow-x-auto no-scrollbar">
                {[
                  { id: "all", label: "All Kitchens" },
                  { id: "top_rated", label: "⭐ Top Rated (4.8+)" },
                  { id: "fast", label: "⚡ Fast (< 25m)" },
                  { id: "offers", label: "🔥 Special Deals" },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveFilterTab(tab.id as any)}
                    className={`px-3 py-1.5 rounded-xl transition whitespace-nowrap ${
                      activeFilterTab === tab.id
                        ? "bg-amber-500 text-slate-950 font-bold shadow-xs"
                        : "text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Quick Dietary Pill */}
              <div className="flex items-center gap-1 text-xs">
                <button
                  type="button"
                  onClick={() => setDietaryTag((prev) => (prev === "halal" ? "all" : "halal"))}
                  className={`px-3 py-1.5 rounded-xl border font-bold transition ${
                    dietaryTag === "halal"
                      ? "bg-emerald-600 text-white border-emerald-600"
                      : "bg-white text-slate-700 border-slate-200 hover:border-slate-300"
                  }`}
                >
                  🌿 Halal Only
                </button>
              </div>
            </div>
          </div>

          {/* Restaurant Grid */}
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 py-8">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="h-80 rounded-3xl bg-white border border-slate-200 animate-pulse shadow-xs" />
              ))}
            </div>
          ) : filteredRestaurants.length === 0 ? (
            <div className="py-16 text-center rounded-3xl bg-white border border-slate-200 shadow-xs">
              <p className="text-base font-bold text-slate-800">No restaurants matched your filters</p>
              <p className="text-xs text-slate-500 mt-1">Try selecting a different cuisine or resetting the search query.</p>
              <button
                type="button"
                onClick={() => {
                  setSearchTerm("");
                  setSelectedCategory("all");
                  setActiveFilterTab("all");
                  setDietaryTag("all");
                }}
                className="mt-4 px-4 py-2 bg-amber-500 text-slate-950 text-xs font-bold rounded-xl shadow-xs"
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredRestaurants.map((restaurant) => (
                <RestaurantCard
                  key={restaurant._id}
                  restaurant={restaurant}
                />
              ))}
            </div>
          )}
        </section>

        {/* 7. Why Feastora Feature Banner */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="rounded-3xl p-8 sm:p-12 bg-white border border-slate-200/90 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 w-96 h-96 bg-amber-400/10 rounded-full blur-3xl pointer-events-none" />

            <div className="max-w-2xl relative z-10 space-y-4">
              <span className="text-xs font-black uppercase tracking-widest text-amber-700">
                The Feastora Standard
              </span>
              <h2 className="text-3xl sm:text-4xl font-black text-slate-900 font-serif">
                A Dining Journey Designed for Discerning Palates.
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Fine culinary craft deserves exceptional care during transit. Our partnered kitchens use custom thermal packaging and dedicated couriers to guarantee pristine plating, warmth, and flavor integrity.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4">
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                  <div className="text-2xl mb-1">🌡️</div>
                  <h4 className="text-xs font-bold text-slate-900 mb-0.5">Thermal Regulated</h4>
                  <p className="text-[11px] text-slate-500">Delivered piping hot or chilled</p>
                </div>
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                  <div className="text-2xl mb-1">🌿</div>
                  <h4 className="text-xs font-bold text-slate-900 mb-0.5">Fresh Farm Sourced</h4>
                  <p className="text-[11px] text-slate-500">Pure chinigura, imported cheeses, prime cuts</p>
                </div>
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                  <div className="text-2xl mb-1">⚡</div>
                  <h4 className="text-xs font-bold text-slate-900 mb-0.5">Live Courier Tracking</h4>
                  <p className="text-[11px] text-slate-500">Real-time status from kitchen to door</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Global Drawers & Modals */}
      <CartDrawer />
      <ItemModal />
      <AuthModal />
      <TableReservationModal />
      <Footer />
    </div>
  );
}
