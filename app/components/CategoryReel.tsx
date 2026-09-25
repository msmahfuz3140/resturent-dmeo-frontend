"use client";

import React from "react";
import { Category } from "../lib/api";

interface CategoryReelProps {
  categories: Category[];
  selectedCategory: string;
  onSelectCategory: (cat: string) => void;
}

export default function CategoryReel({
  categories,
  selectedCategory,
  onSelectCategory,
}: CategoryReelProps) {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
          Explore Cuisines & Delights
        </h2>
        {selectedCategory !== "all" && (
          <button
            type="button"
            onClick={() => onSelectCategory("all")}
            className="text-xs text-amber-700 hover:text-amber-800 font-bold"
          >
            Clear Filter (Show All)
          </button>
        )}
      </div>

      {/* Horizontal Scroll Reel */}
      <div className="flex items-center gap-3 overflow-x-auto no-scrollbar pb-2 pt-1">
        {/* All Cuisines Pill */}
        <button
          type="button"
          onClick={() => onSelectCategory("all")}
          className={`shrink-0 flex items-center gap-2 px-4 py-2.5 rounded-2xl border transition-all duration-200 ${
            selectedCategory === "all"
              ? "bg-amber-500 text-slate-950 font-bold border-amber-400 shadow-sm scale-105"
              : "bg-white text-slate-700 border-slate-200 hover:border-slate-300 hover:text-slate-900 shadow-xs"
          }`}
        >
          <span className="text-base">✨</span>
          <span className="text-xs font-semibold whitespace-nowrap">All Cuisines</span>
        </button>

        {/* Dynamic Categories from MongoDB */}
        {categories.map((cat) => {
          const isSelected = selectedCategory.toLowerCase() === cat.name.toLowerCase() || selectedCategory === cat.slug;
          return (
            <button
              key={cat._id || cat.slug}
              type="button"
              onClick={() => onSelectCategory(cat.name)}
              className={`shrink-0 flex items-center gap-2 px-4 py-2.5 rounded-2xl border transition-all duration-200 group ${
                isSelected
                  ? "bg-amber-500 text-slate-950 font-bold border-amber-400 shadow-sm scale-105"
                  : "bg-white text-slate-700 border-slate-200 hover:border-slate-300 hover:text-slate-900 shadow-xs"
              }`}
            >
              <span className="text-base group-hover:scale-110 transition-transform">
                {cat.icon || "🍽️"}
              </span>
              <span className="text-xs font-semibold whitespace-nowrap">
                {cat.name}
              </span>
            </button>
          );
        })}
      </div>
    </section>
  );
}
