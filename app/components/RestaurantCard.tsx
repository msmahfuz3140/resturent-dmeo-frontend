"use client";

import React from "react";
import Link from "next/link";
import { Restaurant } from "../lib/api";
import { StarIcon, ClockIcon, BikeIcon } from "./Icons";

interface RestaurantCardProps {
  restaurant: Restaurant;
}

export default function RestaurantCard({ restaurant }: RestaurantCardProps) {
  return (
    <Link
      href={`/restaurant/${restaurant.slug || restaurant._id}`}
      className="group rounded-3xl overflow-hidden bg-white border border-slate-200/90 hover:border-amber-300 shadow-xs hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-300 flex flex-col h-full relative"
    >
      {/* Banner Image Container */}
      <div className="relative h-48 w-full overflow-hidden bg-slate-100">
        <img
          src={restaurant.banner}
          alt={restaurant.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent" />

        {/* Floating Badges */}
        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
          {restaurant.discountText && (
            <span className="px-2.5 py-1 rounded-lg text-[10px] font-black uppercase bg-red-600 text-white shadow-md">
              {restaurant.discountText}
            </span>
          )}
          {restaurant.isFeatured && (
            <span className="px-2.5 py-1 rounded-lg text-[10px] font-black uppercase bg-amber-500 text-slate-950 shadow-md">
              Featured
            </span>
          )}
        </div>

        {/* Delivery Time Pill */}
        <div className="absolute bottom-3 right-3 px-2.5 py-1 rounded-xl bg-white/95 backdrop-blur border border-slate-200 text-[11px] font-bold text-slate-900 flex items-center gap-1.5 shadow-md">
          <ClockIcon size={12} className="text-amber-600" />
          <span>{restaurant.deliveryTime}</span>
        </div>

        {/* Logo Avatar */}
        <div className="absolute -bottom-4 left-4 w-12 h-12 rounded-2xl bg-white border-2 border-white overflow-hidden shadow-lg">
          <img
            src={restaurant.logo}
            alt={restaurant.name}
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      {/* Card Content */}
      <div className="p-5 pt-6 flex-1 flex flex-col justify-between">
        <div>
          {/* Header & Rating */}
          <div className="flex items-start justify-between gap-2 mb-1.5">
            <h3 className="text-base font-bold text-slate-900 font-serif group-hover:text-amber-700 transition-colors line-clamp-1">
              {restaurant.name}
            </h3>
            <div className="flex items-center gap-1 px-2 py-0.5 rounded-lg bg-amber-50 border border-amber-200 text-amber-800 text-xs font-bold shrink-0">
              <StarIcon size={12} className="text-amber-500" />
              <span>{restaurant.rating.toFixed(1)}</span>
              <span className="text-[10px] text-slate-500 font-normal">
                ({restaurant.ratingCount})
              </span>
            </div>
          </div>

          {/* Cuisines & Price Tier */}
          <p className="text-xs text-slate-500 line-clamp-1 mb-2">
            <span className="text-amber-700 font-bold mr-1.5">{restaurant.priceTier}</span>
            • {restaurant.cuisines.join(", ")}
          </p>

          {/* Tagline */}
          {restaurant.tagline && (
            <p className="text-xs text-slate-500 line-clamp-2 italic mb-3">
              "{restaurant.tagline}"
            </p>
          )}
        </div>

        {/* Footer Meta */}
        <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
          <span className="truncate max-w-[150px]">
            📍 {restaurant.area.split(",")[0]}
          </span>
          <span className="font-semibold text-slate-800 flex items-center gap-1">
            <BikeIcon size={13} className="text-amber-600" />
            {restaurant.deliveryFee === 0 ? "Free Delivery" : `${restaurant.deliveryFee} ৳ Delivery`}
          </span>
        </div>
      </div>
    </Link>
  );
}
