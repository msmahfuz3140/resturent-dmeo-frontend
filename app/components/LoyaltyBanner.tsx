"use client";

import React from "react";
import { SparklesIcon, ShieldCheckIcon, BikeIcon } from "./Icons";

export default function LoyaltyBanner() {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
      <div className="p-4 sm:p-5 rounded-3xl bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-orange-500/10 border border-amber-300/40 flex flex-col md:flex-row items-center justify-between gap-4">
        
        <div className="flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-2xl bg-amber-500 text-slate-950 flex items-center justify-center font-serif text-lg font-black shadow-md shadow-amber-500/20">
            👑
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-black text-slate-900 uppercase tracking-wider">
                Feastora Gold Club
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500 text-slate-950">
                ACTIVE
              </span>
            </div>
            <p className="text-xs text-slate-600 mt-0.5">
              Enjoy <b>Unlimited Free Deliveries</b> on orders over 300 ৳ and priority culinary dispatch.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-5 text-xs">
          <div className="flex items-center gap-2 text-slate-700 font-semibold">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span>480 Gourmet Points</span>
          </div>

          <div className="h-6 w-[1px] bg-amber-200 hidden sm:block" />

          <button
            type="button"
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-amber-400 font-bold text-xs rounded-xl shadow transition"
          >
            Redeem Perks
          </button>
        </div>

      </div>
    </section>
  );
}
