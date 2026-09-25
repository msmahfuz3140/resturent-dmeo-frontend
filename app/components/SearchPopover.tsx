"use client";

import React from "react";
import Link from "next/link";
import { Restaurant, MenuItem } from "../lib/api";
import { useCart } from "../context/CartContext";
import { StarIcon, PlusIcon, FlameIcon } from "./Icons";

interface SearchPopoverProps {
  searchTerm: string;
  restaurants: Restaurant[];
  items: MenuItem[];
  onClose: () => void;
}

export default function SearchPopover({
  searchTerm,
  restaurants,
  items,
  onClose,
}: SearchPopoverProps) {
  const { addToCart, setActiveItemModal } = useCart();

  if (!searchTerm.trim()) return null;

  const q = searchTerm.toLowerCase();

  const matchingRestaurants = restaurants.filter(
    (r) =>
      r.name.toLowerCase().includes(q) ||
      r.cuisines.some((c) => c.toLowerCase().includes(q))
  ).slice(0, 3);

  const matchingItems = items.filter(
    (item) =>
      item.name.toLowerCase().includes(q) ||
      item.description?.toLowerCase().includes(q) ||
      item.category?.toLowerCase().includes(q)
  ).slice(0, 4);

  const hasResults = matchingRestaurants.length > 0 || matchingItems.length > 0;

  return (
    <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-slate-200 rounded-3xl shadow-2xl p-5 z-50 text-slate-800 animate-fade-in max-h-[80vh] overflow-y-auto">
      {!hasResults ? (
        <div className="text-center py-6">
          <p className="text-sm font-semibold text-slate-700">No results found for "{searchTerm}"</p>
          <p className="text-xs text-slate-400 mt-1">Try searching for Biryani, Burger, Pizza, or Sushi.</p>
        </div>
      ) : (
        <div className="space-y-5">
          {/* Kitchens */}
          {matchingRestaurants.length > 0 && (
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                Matched Kitchens & Restaurants
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                {matchingRestaurants.map((r) => (
                  <Link
                    key={r._id}
                    href={`/restaurant/${r.slug || r._id}`}
                    onClick={onClose}
                    className="p-3 rounded-2xl bg-slate-50 hover:bg-amber-50/60 border border-slate-200 hover:border-amber-300 transition flex items-center gap-3"
                  >
                    <img
                      src={r.logo}
                      alt={r.name}
                      className="w-10 h-10 rounded-xl object-cover border border-slate-200"
                    />
                    <div className="min-w-0 flex-1">
                      <h4 className="text-xs font-bold text-slate-900 truncate">{r.name}</h4>
                      <p className="text-[10px] text-slate-500 truncate">{r.cuisines.join(", ")}</p>
                      <div className="flex items-center gap-1 text-[10px] font-bold text-amber-600 mt-0.5">
                        <StarIcon size={10} />
                        <span>{r.rating.toFixed(1)}</span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Dishes */}
          {matchingItems.length > 0 && (
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                Artisanal Dishes
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {matchingItems.map((dish) => {
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
                        className="w-12 h-12 rounded-xl object-cover border border-slate-200 shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <h4 className="text-xs font-bold text-slate-900 truncate">{dish.name}</h4>
                        <p className="text-[10px] text-amber-700 font-bold">
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
                          onClose();
                        }}
                        className="px-2.5 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold rounded-lg flex items-center gap-1 shrink-0"
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
        </div>
      )}
    </div>
  );
}
