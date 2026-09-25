"use client";

import React, { useState } from "react";
import { Deal } from "../lib/api";
import { useCart } from "../context/CartContext";
import { TagIcon, CheckIcon } from "./Icons";

interface DealsBannerProps {
  deals: Deal[];
}

export default function DealsBanner({ deals }: DealsBannerProps) {
  const { applyVoucher } = useCart();
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const handleCopyAndApply = async (code: string) => {
    try {
      await navigator.clipboard.writeText(code);
    } catch (e) {}
    setCopiedCode(code);
    applyVoucher(code);
    setTimeout(() => setCopiedCode(null), 3000);
  };

  if (!deals || deals.length === 0) return null;

  return (
    <section id="deals-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600">
            <TagIcon size={16} />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900 font-serif">Curated Vouchers & Promotions</h2>
            <p className="text-xs text-slate-500">Apply promotional codes for instant discounts on your order</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        {deals.map((deal) => {
          const isCopied = copiedCode === deal.code;
          return (
            <div
              key={deal._id || deal.code}
              className="p-4 rounded-3xl bg-white border border-slate-200 hover:border-amber-400 shadow-sm hover:shadow-md relative overflow-hidden group transition-all duration-300"
            >
              {/* Subtle gold top border highlight */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-400 to-amber-500" />

              <div className="flex items-start justify-between gap-2 mb-2 pt-1">
                <span className="px-2 py-0.5 rounded-md text-[10px] font-black uppercase bg-amber-50 text-amber-800 border border-amber-200">
                  {deal.badgeText}
                </span>
                <span className="text-lg">{deal.icon || "🏷️"}</span>
              </div>

              <h3 className="text-sm font-bold text-slate-900 font-serif mb-1 group-hover:text-amber-700 transition-colors">
                {deal.title}
              </h3>
              <p className="text-xs text-slate-500 line-clamp-2 mb-3">
                {deal.description}
              </p>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                <div className="flex flex-col">
                  <span className="text-[9px] text-slate-400 uppercase font-bold">Voucher</span>
                  <span className="text-xs font-mono font-black text-amber-600 bg-amber-50/80 px-2 py-0.5 rounded-md border border-amber-200">
                    {deal.code}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => handleCopyAndApply(deal.code)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-xs ${
                    isCopied
                      ? "bg-emerald-600 text-white"
                      : "bg-slate-900 hover:bg-amber-500 hover:text-slate-950 text-white"
                  }`}
                >
                  {isCopied ? (
                    <>
                      <CheckIcon size={12} />
                      <span>Applied!</span>
                    </>
                  ) : (
                    <span>Claim</span>
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
