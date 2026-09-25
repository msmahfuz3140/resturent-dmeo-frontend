"use client";

import React from "react";
import { useCart } from "../context/CartContext";
import { SearchIcon, MapPinIcon, FlameIcon, SparklesIcon } from "./Icons";

interface HeroProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  onSelectTag: (tag: string) => void;
}

const TRENDING_TAGS = [
  "Shahi Kacchi",
  "Truffle Burger",
  "Woodfired Pizza",
  "Black Garlic Ramen",
  "Basque Cheesecake",
  "Quinoa Salmon",
];

export default function Hero({ searchTerm, setSearchTerm, onSelectTag }: HeroProps) {
  const { selectedArea, serviceType, setIsReservationOpen } = useCart();

  return (
    <section className="relative w-full pt-10 pb-16 overflow-hidden bg-gradient-to-b from-white via-slate-50 to-slate-100 border-b border-slate-200/80">
      {/* Ambient background glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-amber-400/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-1/4 right-10 w-[350px] h-[250px] bg-orange-400/10 rounded-full blur-[90px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto space-y-6">
          
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-50 border border-amber-200 text-amber-800 text-xs font-bold shadow-xs">
            <SparklesIcon size={14} className="text-amber-600 animate-pulse" />
            <span>Dhaka’s Premier Gourmet Dining Marketplace</span>
          </div>

          {/* Headline */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight font-serif leading-[1.12]">
            Artisanal Dining,{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-600 via-amber-500 to-yellow-600">
              Delivered Flawlessly.
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-slate-600 text-sm sm:text-base leading-relaxed max-w-2xl mx-auto">
            From slow-simmered Old Dhaka mutton kacchi to 48-hour fermented sourdough pizzas and wagyu smash patties. Crafted by verified master chefs, delivered to your door in 30 minutes.
          </p>

          {/* Search Box & Location Container */}
          <div className="pt-2 max-w-2xl mx-auto">
            <div className="p-2 sm:p-2.5 rounded-3xl bg-white border border-slate-200 shadow-xl shadow-slate-200/50 flex flex-col sm:flex-row items-center gap-2">
              
              {/* Location Badge */}
              <div className="flex items-center gap-2 px-3.5 py-2.5 bg-slate-50 rounded-2xl border border-slate-200/80 text-xs w-full sm:w-auto shrink-0 text-slate-700">
                <div className="relative w-4 h-4 flex items-center justify-center text-amber-600">
                  <MapPinIcon size={15} />
                  <span className="absolute w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                </div>
                <span className="truncate font-bold">{selectedArea.split(",")[0]}</span>
              </div>

              {/* Live Search Input */}
              <div className="relative flex-1 w-full">
                <SearchIcon size={16} className="absolute left-3.5 top-3 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search restaurants, cuisines, or artisanal dishes..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-10 pr-4 py-2.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-amber-500 focus:bg-white transition"
                />
                {searchTerm && (
                  <button
                    type="button"
                    onClick={() => setSearchTerm("")}
                    className="absolute right-3 top-3 text-slate-400 hover:text-slate-700 text-xs"
                  >
                    ✕
                  </button>
                )}
              </div>

              {/* Action Button */}
              <button
                type="button"
                onClick={() => {
                  const el = document.getElementById("restaurants-section");
                  el?.scrollIntoView({ behavior: "smooth" });
                }}
                className="w-full sm:w-auto px-6 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-xs rounded-2xl shadow-md shadow-amber-500/20 transition whitespace-nowrap cursor-pointer"
              >
                Find Food
              </button>

            </div>

            {/* Trending Quick Search Tags */}
            <div className="flex flex-wrap items-center justify-center gap-2 mt-4">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                <FlameIcon size={12} className="text-amber-500" /> Trending:
              </span>
              {TRENDING_TAGS.map((tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => onSelectTag(tag)}
                  className="px-3 py-1 rounded-xl bg-white hover:bg-amber-50 text-[11px] font-semibold text-slate-600 hover:text-amber-800 border border-slate-200 hover:border-amber-300 shadow-xs transition"
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>

          {/* Stats Highlights */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5 pt-6 max-w-4xl mx-auto">
            {[
              { title: "25-35 Min", subtitle: "Express Delivery", icon: "⚡" },
              { title: "6+ Artisans", subtitle: "Curated Master Kitchens", icon: "👑" },
              { title: "4.9 / 5.0", subtitle: "Average Foodie Score", icon: "⭐" },
              { title: "100% Halal", subtitle: "Hygiene & Taste Assured", icon: "🌿" },
            ].map((stat, i) => (
              <div
                key={i}
                className="p-3.5 rounded-2xl bg-white border border-slate-200 shadow-xs text-left flex items-center gap-3 hover:border-amber-300 transition"
              >
                <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-200/60 flex items-center justify-center text-lg">
                  {stat.icon}
                </div>
                <div>
                  <p className="text-xs font-black text-slate-900 font-serif">{stat.title}</p>
                  <p className="text-[10px] text-slate-500 font-medium">{stat.subtitle}</p>
                </div>
              </div>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
}
