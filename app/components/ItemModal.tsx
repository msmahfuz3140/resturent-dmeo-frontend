"use client";

import React, { useState } from "react";
import { useCart } from "../context/CartContext";
import { XIcon, PlusIcon, MinusIcon, CheckIcon, FlameIcon } from "./Icons";

export default function ItemModal() {
  const { activeItemModal, setActiveItemModal, addToCart } = useCart();
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
  const [extraTotal, setExtraTotal] = useState(0);
  const [quantity, setQuantity] = useState(1);

  if (!activeItemModal) return null;

  const { item, restaurant } = activeItemModal;
  const basePrice = item.discountPrice || item.price;
  const finalUnitPrice = basePrice + extraTotal;
  const finalTotal = finalUnitPrice * quantity;

  const handleToggleOption = (label: string, price: number, groupType: string = "checkbox") => {
    if (groupType === "radio") {
      setSelectedOptions([label]);
      setExtraTotal(price);
    } else {
      if (selectedOptions.includes(label)) {
        setSelectedOptions((prev) => prev.filter((o) => o !== label));
        setExtraTotal((prev) => prev - price);
      } else {
        setSelectedOptions((prev) => [...prev, label]);
        setExtraTotal((prev) => prev + price);
      }
    }
  };

  const handleConfirmAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addToCart(item, restaurant, selectedOptions);
    }
    setActiveItemModal(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in">
      <div className="w-full max-w-lg bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-2xl relative flex flex-col max-h-[90vh] text-slate-800">
        
        {/* Close Button */}
        <button
          type="button"
          onClick={() => setActiveItemModal(null)}
          className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-white/90 backdrop-blur border border-slate-200 text-slate-600 hover:text-slate-900 flex items-center justify-center shadow-md"
        >
          <XIcon size={18} />
        </button>

        {/* Modal Image Banner */}
        <div className="relative h-56 w-full bg-slate-100">
          <img
            src={item.image}
            alt={item.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent" />
          
          <div className="absolute bottom-4 left-6 right-6">
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 text-[10px] font-bold uppercase rounded-md bg-amber-500 text-slate-950">
                {restaurant.name}
              </span>
              {item.isChefSpecial && (
                <span className="px-2.5 py-0.5 text-[10px] font-bold uppercase rounded-md bg-red-600 text-white flex items-center gap-1">
                  <FlameIcon size={12} /> Chef Signature
                </span>
              )}
            </div>
            <h3 className="text-xl font-bold text-white font-serif">{item.name}</h3>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-6 overflow-y-auto space-y-5 flex-1">
          <p className="text-xs text-slate-600 leading-relaxed">
            {item.description || "Freshly curated artisanal dish prepared on-demand with premium culinary ingredients."}
          </p>

          <div className="flex items-center gap-3">
            <span className="text-xl font-black text-amber-700 font-serif">
              {basePrice} ৳
            </span>
            {item.discountPrice && (
              <span className="text-sm text-slate-400 line-through">
                {item.price} ৳
              </span>
            )}
            <span className="text-xs text-slate-600 bg-slate-100 px-2.5 py-1 rounded-lg border border-slate-200 font-medium">
              Prep: {item.preparationTime || "15-20 min"}
            </span>
          </div>

          {/* Options / Addons */}
          {item.options && item.options.length > 0 && (
            <div className="space-y-4 pt-2 border-t border-slate-100">
              {item.options.map((optGroup, gIdx) => (
                <div key={gIdx} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                      {optGroup.name}
                    </span>
                    <span className="text-[11px] text-slate-500 font-medium">
                      {optGroup.type === "radio" ? "Select one" : "Optional"}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 gap-2">
                    {optGroup.choices.map((choice, cIdx) => {
                      const isSelected = selectedOptions.includes(choice.label);
                      return (
                        <button
                          key={cIdx}
                          type="button"
                          onClick={() => handleToggleOption(choice.label, choice.extraPrice, optGroup.type)}
                          className={`p-3 rounded-xl border text-xs text-left flex items-center justify-between transition ${
                            isSelected
                              ? "bg-amber-50 border-amber-500 text-amber-900 font-bold shadow-xs"
                              : "bg-slate-50 border-slate-200 text-slate-700 hover:border-slate-300"
                          }`}
                        >
                          <div className="flex items-center gap-2.5">
                            <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                              isSelected ? "border-amber-600 bg-amber-500 text-slate-950" : "border-slate-400"
                            }`}>
                              {isSelected && <CheckIcon size={10} />}
                            </div>
                            <span>{choice.label}</span>
                          </div>
                          {choice.extraPrice > 0 && (
                            <span className="text-slate-500">+{choice.extraPrice} ৳</span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-5 bg-slate-50 border-t border-slate-100 flex items-center justify-between gap-4">
          {/* Quantity selector */}
          <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-xl p-1.5 shadow-xs">
            <button
              type="button"
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              className="w-7 h-7 rounded-lg flex items-center justify-center text-slate-500 hover:text-slate-900 hover:bg-slate-100"
            >
              <MinusIcon size={14} />
            </button>
            <span className="w-8 text-center text-xs font-bold text-slate-900">
              {quantity}
            </span>
            <button
              type="button"
              onClick={() => setQuantity((q) => q + 1)}
              className="w-7 h-7 rounded-lg flex items-center justify-center text-slate-500 hover:text-slate-900 hover:bg-slate-100"
            >
              <PlusIcon size={14} />
            </button>
          </div>

          {/* Add to Cart Confirm */}
          <button
            type="button"
            onClick={handleConfirmAddToCart}
            className="flex-1 py-3 px-5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 text-slate-950 font-black text-xs rounded-xl shadow-md shadow-amber-500/20 transition flex items-center justify-between"
          >
            <span>Add to Dining Bag</span>
            <span className="font-serif text-sm">{finalTotal} ৳</span>
          </button>
        </div>

      </div>
    </div>
  );
}
