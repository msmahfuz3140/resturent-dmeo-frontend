"use client";

import React from "react";
import { MenuItem, Restaurant } from "../lib/api";
import { useCart } from "../context/CartContext";
import { PlusIcon, FlameIcon } from "./Icons";

interface DishCardProps {
  item: MenuItem;
  restaurant: Restaurant;
}

export default function DishCard({ item, restaurant }: DishCardProps) {
  const { addToCart, setActiveItemModal } = useCart();

  const handleAddClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    // If item has options, open modal
    if (item.options && item.options.length > 0) {
      setActiveItemModal({ item, restaurant });
    } else {
      addToCart(item, restaurant);
    }
  };

  const currentPrice = item.discountPrice || item.price;

  return (
    <div
      onClick={() => setActiveItemModal({ item, restaurant })}
      className="cursor-pointer group p-3.5 rounded-3xl bg-white hover:bg-white border border-slate-200 hover:border-amber-300 shadow-xs hover:shadow-lg transition-all duration-300 flex flex-col justify-between"
    >
      {/* Dish Photo */}
      <div className="relative h-44 w-full rounded-2xl overflow-hidden bg-slate-100 mb-3">
        <img
          src={item.image}
          alt={item.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent" />

        {/* Badges */}
        <div className="absolute top-2 left-2 flex flex-col gap-1">
          {item.isChefSpecial && (
            <span className="px-2 py-0.5 rounded-md text-[9px] font-black uppercase bg-red-600 text-white flex items-center gap-1 shadow-sm">
              <FlameIcon size={10} /> Chef's Pick
            </span>
          )}
          {item.isPopular && !item.isChefSpecial && (
            <span className="px-2 py-0.5 rounded-md text-[9px] font-black uppercase bg-amber-500 text-slate-950 font-bold shadow-sm">
              Popular
            </span>
          )}
        </div>

        {/* Price Tag Overlay */}
        <div className="absolute bottom-2 left-2.5 flex items-baseline gap-1.5">
          <span className="text-base font-black text-white font-serif drop-shadow-md">
            {currentPrice} ৳
          </span>
          {item.discountPrice && (
            <span className="text-xs text-slate-300 line-through">
              {item.price} ৳
            </span>
          )}
        </div>

        {/* Quick Add Button */}
        <button
          type="button"
          onClick={handleAddClick}
          className="absolute bottom-2 right-2 w-8 h-8 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 flex items-center justify-center shadow-md shadow-amber-500/30 transition-transform active:scale-95 group-hover:scale-110"
        >
          <PlusIcon size={16} />
        </button>
      </div>

      {/* Details */}
      <div className="flex-1 flex flex-col justify-between">
        <div>
          <h4 className="text-xs font-bold text-slate-900 group-hover:text-amber-700 transition-colors line-clamp-1 mb-1">
            {item.name}
          </h4>
          <p className="text-[11px] text-slate-500 line-clamp-2 leading-relaxed">
            {item.description}
          </p>
        </div>

        {/* Meta info */}
        <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-500">
          <span className="truncate max-w-[140px] font-medium">{restaurant.name}</span>
          <span className="text-amber-700 font-bold">Customize ➔</span>
        </div>
      </div>
    </div>
  );
}
