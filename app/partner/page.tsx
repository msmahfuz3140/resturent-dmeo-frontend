"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Navbar from "../components/Navbar";
import CartDrawer from "../components/CartDrawer";
import ItemModal from "../components/ItemModal";
import AuthModal from "../components/AuthModal";
import TableReservationModal from "../components/TableReservationModal";
import Footer from "../components/Footer";
import {
  fetchRestaurants,
  uploadToCloudinaryEndpoint,
  Restaurant,
  API_BASE,
} from "../lib/api";
import {
  UploadCloudIcon,
  FilePdfIcon,
  CheckIcon,
  FlameIcon,
  ClocheIcon,
} from "../components/Icons";

export default function PartnerPortalPage() {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [activeTab, setActiveTab] = useState<"dish" | "restaurant">("dish");

  // Dish Form States
  const [selectedRestId, setSelectedRestId] = useState("");
  const [dishName, setDishName] = useState("");
  const [dishDescription, setDishDescription] = useState("");
  const [dishPrice, setDishPrice] = useState("");
  const [dishDiscountPrice, setDishDiscountPrice] = useState("");
  const [dishCategory, setDishCategory] = useState("Signature Mains");
  const [dishPrepTime, setDishPrepTime] = useState("20 min");
  const [dishFile, setDishFile] = useState<File | null>(null);
  const [dishPreview, setDishPreview] = useState<string>("");
  const [dishUploading, setDishUploading] = useState(false);
  const [dishSuccess, setDishSuccess] = useState("");
  const [dishError, setDishError] = useState("");

  // Restaurant Form States
  const [restName, setRestName] = useState("");
  const [restTagline, setRestTagline] = useState("");
  const [restCuisines, setRestCuisines] = useState("");
  const [restArea, setRestArea] = useState("Gulshan 2, Dhaka");
  const [restAddress, setRestAddress] = useState("");
  const [restDeliveryTime, setRestDeliveryTime] = useState("25-35 min");
  const [restDeliveryFee, setRestDeliveryFee] = useState("49");
  const [restBannerFile, setRestBannerFile] = useState<File | null>(null);
  const [restLogoFile, setRestLogoFile] = useState<File | null>(null);
  const [restPdfFile, setRestPdfFile] = useState<File | null>(null);
  const [restUploading, setRestUploading] = useState(false);
  const [restSuccess, setRestSuccess] = useState("");
  const [restError, setRestError] = useState("");

  useEffect(() => {
    fetchRestaurants().then((list) => {
      setRestaurants(list);
      if (list.length > 0) setSelectedRestId(list[0]._id);
    });
  }, []);

  const handleDishFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setDishFile(file);
      setDishPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmitDish = async (e: React.FormEvent) => {
    e.preventDefault();
    setDishError("");
    setDishSuccess("");

    if (!selectedRestId || !dishName || !dishPrice) {
      setDishError("Please select a restaurant, enter dish name and price.");
      return;
    }

    setDishUploading(true);
    try {
      let imageUrl = "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&auto=format&fit=crop&q=80";

      if (dishFile) {
        const uploadRes = await uploadToCloudinaryEndpoint(dishFile, "feastora/dishes");
        if (uploadRes.success && uploadRes.data?.url) {
          imageUrl = uploadRes.data.url;
        }
      }

      const res = await fetch(`${API_BASE}/items`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          restaurantId: selectedRestId,
          name: dishName,
          description: dishDescription,
          price: Number(dishPrice),
          discountPrice: dishDiscountPrice ? Number(dishDiscountPrice) : null,
          category: dishCategory,
          image: imageUrl,
          preparationTime: dishPrepTime,
          isPopular: true,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setDishSuccess(`"${dishName}" uploaded to Cloudinary & saved to MongoDB database!`);
        setDishName("");
        setDishDescription("");
        setDishPrice("");
        setDishDiscountPrice("");
        setDishFile(null);
        setDishPreview("");
      } else {
        setDishError(data.message || "Failed to create dish.");
      }
    } catch (err: any) {
      setDishError(err.message || "Error saving dish.");
    } finally {
      setDishUploading(false);
    }
  };

  const handleSubmitRestaurant = async (e: React.FormEvent) => {
    e.preventDefault();
    setRestError("");
    setRestSuccess("");

    if (!restName || !restCuisines) {
      setRestError("Restaurant name and cuisines are required.");
      return;
    }

    setRestUploading(true);
    try {
      let bannerUrl = "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=1200&auto=format&fit=crop&q=80";
      let logoUrl = "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=300&auto=format&fit=crop&q=80";
      let pdfUrl = "";

      if (restBannerFile) {
        const bRes = await uploadToCloudinaryEndpoint(restBannerFile, "feastora/restaurants");
        if (bRes.success && bRes.data?.url) bannerUrl = bRes.data.url;
      }

      if (restLogoFile) {
        const lRes = await uploadToCloudinaryEndpoint(restLogoFile, "feastora/logos");
        if (lRes.success && lRes.data?.url) logoUrl = lRes.data.url;
      }

      if (restPdfFile) {
        const pRes = await uploadToCloudinaryEndpoint(restPdfFile, "feastora/menus");
        if (pRes.success && pRes.data?.url) pdfUrl = pRes.data.url;
      }

      const res = await fetch(`${API_BASE}/restaurants`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: restName,
          tagline: restTagline,
          cuisines: restCuisines.split(",").map((c) => c.trim()),
          area: restArea,
          address: restAddress,
          deliveryTime: restDeliveryTime,
          deliveryFee: Number(restDeliveryFee),
          banner: bannerUrl,
          logo: logoUrl,
          pdfMenuUrl: pdfUrl,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setRestSuccess(`"${restName}" created in MongoDB with Cloudinary media!`);
        fetchRestaurants().then(setRestaurants);
        setRestName("");
        setRestTagline("");
        setRestCuisines("");
        setRestAddress("");
        setRestBannerFile(null);
        setRestLogoFile(null);
        setRestPdfFile(null);
      } else {
        setRestError(data.message || "Failed to create restaurant.");
      }
    } catch (err: any) {
      setRestError(err.message || "Error saving restaurant.");
    } finally {
      setRestUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
        {/* Header */}
        <div className="text-center max-w-xl mx-auto mb-10 space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-800 text-xs font-bold">
            <ClocheIcon size={14} />
            <span>Feastora Partner Studio</span>
          </div>
          <h1 className="text-3xl font-black text-slate-900 font-serif">
            Upload & Manage Kitchens
          </h1>
          <p className="text-xs text-slate-500">
            All files (Images & PDFs) are stored in <b>Cloudinary</b> and catalog records are written to <b>MongoDB</b>.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex rounded-2xl bg-white border border-slate-200 p-1 mb-8 max-w-md mx-auto shadow-xs">
          <button
            type="button"
            onClick={() => setActiveTab("dish")}
            className={`flex-1 py-2.5 text-xs font-bold rounded-xl transition ${
              activeTab === "dish"
                ? "bg-amber-500 text-slate-950 shadow-sm"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            🍳 Add New Dish (Cloudinary)
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("restaurant")}
            className={`flex-1 py-2.5 text-xs font-bold rounded-xl transition ${
              activeTab === "restaurant"
                ? "bg-amber-500 text-slate-950 shadow-sm"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            🏨 Register Kitchen (PDF Menu)
          </button>
        </div>

        {/* TAB 1: ADD DISH */}
        {activeTab === "dish" && (
          <div className="p-8 rounded-3xl bg-white border border-slate-200 shadow-xl">
            <h2 className="text-lg font-bold text-slate-900 font-serif mb-4 flex items-center gap-2">
              <FlameIcon size={18} className="text-amber-600" />
              <span>Add Dish to Restaurant Menu</span>
            </h2>

            {dishSuccess && (
              <div className="p-3 mb-5 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 flex items-center gap-2 font-medium">
                <CheckIcon size={16} />
                <span>{dishSuccess}</span>
              </div>
            )}
            {dishError && (
              <div className="p-3 mb-5 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700">
                {dishError}
              </div>
            )}

            <form onSubmit={handleSubmitDish} className="space-y-4">
              <div>
                <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                  Select Restaurant *
                </label>
                <select
                  value={selectedRestId}
                  onChange={(e) => setSelectedRestId(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 font-medium focus:outline-none focus:border-amber-500"
                >
                  {restaurants.map((r) => (
                    <option key={r._id} value={r._id}>
                      {r.name} ({r.area})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                    Dish Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Shahi Mutton Kacchi Special"
                    value={dishName}
                    onChange={(e) => setDishName(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                    Menu Category *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Signature Mains, Starters, Desserts"
                    value={dishCategory}
                    onChange={(e) => setDishCategory(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                  Description
                </label>
                <textarea
                  rows={2}
                  placeholder="Ingredients, preparation technique, flavor profile..."
                  value={dishDescription}
                  onChange={(e) => setDishDescription(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-800 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                    Price (BDT / ৳) *
                  </label>
                  <input
                    type="number"
                    required
                    placeholder="450"
                    value={dishPrice}
                    onChange={(e) => setDishPrice(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                    Discount Price (Optional)
                  </label>
                  <input
                    type="number"
                    placeholder="390"
                    value={dishDiscountPrice}
                    onChange={(e) => setDishDiscountPrice(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                    Prep Time
                  </label>
                  <input
                    type="text"
                    value={dishPrepTime}
                    onChange={(e) => setDishPrepTime(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              {/* Cloudinary Dish Image Upload */}
              <div className="pt-2">
                <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <UploadCloudIcon size={14} className="text-amber-600" />
                  <span>Upload Dish Photo to Cloudinary</span>
                </label>
                
                <div className="p-4 border-2 border-dashed border-slate-300 hover:border-amber-500 rounded-2xl bg-slate-50 flex flex-col items-center justify-center gap-2 cursor-pointer transition">
                  {dishPreview ? (
                    <div className="relative w-40 h-28 rounded-xl overflow-hidden border border-slate-300 shadow-sm">
                      <img src={dishPreview} alt="Preview" className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => {
                          setDishFile(null);
                          setDishPreview("");
                        }}
                        className="absolute top-1 right-1 bg-black/70 text-white rounded p-1 text-[10px]"
                      >
                        ✕ Remove
                      </button>
                    </div>
                  ) : (
                    <>
                      <UploadCloudIcon size={28} className="text-slate-400" />
                      <p className="text-xs text-slate-700 font-semibold">
                        Click to browse or drop food image (JPEG, PNG, WebP)
                      </p>
                      <p className="text-[10px] text-slate-400">Max size: 15MB • Uploads to Cloudinary</p>
                    </>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleDishFileChange}
                    className="mt-2 text-xs text-slate-600 file:mr-4 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-amber-500 file:text-slate-950 hover:file:bg-amber-400 cursor-pointer"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={dishUploading}
                className="w-full py-3.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 text-slate-950 font-black text-xs rounded-xl shadow-lg shadow-amber-500/20 transition flex items-center justify-center gap-2"
              >
                {dishUploading ? (
                  <span>Uploading to Cloudinary & Saving in MongoDB...</span>
                ) : (
                  <span>Publish Dish to Menu ➔</span>
                )}
              </button>
            </form>
          </div>
        )}

        {/* TAB 2: REGISTER RESTAURANT */}
        {activeTab === "restaurant" && (
          <div className="p-8 rounded-3xl bg-white border border-slate-200 shadow-xl">
            <h2 className="text-lg font-bold text-slate-900 font-serif mb-4 flex items-center gap-2">
              <ClocheIcon size={18} className="text-amber-600" />
              <span>Register Partner Kitchen</span>
            </h2>

            {restSuccess && (
              <div className="p-3 mb-5 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 flex items-center gap-2 font-medium">
                <CheckIcon size={16} />
                <span>{restSuccess}</span>
              </div>
            )}
            {restError && (
              <div className="p-3 mb-5 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700">
                {restError}
              </div>
            )}

            <form onSubmit={handleSubmitRestaurant} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                    Restaurant Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. The Imperial Kacchi House"
                    value={restName}
                    onChange={(e) => setRestName(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                    Tagline
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Royal Mughal feasts slow-cooked to perfection"
                    value={restTagline}
                    onChange={(e) => setRestTagline(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                    Cuisines (comma separated) *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Biryani, Mughlai, Kebab"
                    value={restCuisines}
                    onChange={(e) => setRestCuisines(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                    Location Area
                  </label>
                  <input
                    type="text"
                    value={restArea}
                    onChange={(e) => setRestArea(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              {/* Upload Banner & Logo to Cloudinary */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                  <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">
                    Banner Photo (Cloudinary)
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => e.target.files && setRestBannerFile(e.target.files[0])}
                    className="text-xs text-slate-600 file:mr-3 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-slate-200 file:text-slate-800 hover:file:bg-slate-300"
                  />
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                  <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">
                    Restaurant Logo (Cloudinary)
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => e.target.files && setRestLogoFile(e.target.files[0])}
                    className="text-xs text-slate-600 file:mr-3 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-slate-200 file:text-slate-800 hover:file:bg-slate-300"
                  />
                </div>
              </div>

              {/* Cloudinary PDF Upload */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <FilePdfIcon size={14} className="text-amber-600" />
                  <span>Menu PDF Catalog (Uploads to Cloudinary)</span>
                </label>
                <input
                  type="file"
                  accept="application/pdf"
                  onChange={(e) => e.target.files && setRestPdfFile(e.target.files[0])}
                  className="text-xs text-slate-600 file:mr-3 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-amber-500 file:text-slate-950 hover:file:bg-amber-400 cursor-pointer"
                />
                <p className="text-[10px] text-slate-400 mt-1">Diners can download or view this full menu PDF directly from your restaurant page.</p>
              </div>

              <button
                type="submit"
                disabled={restUploading}
                className="w-full py-3.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 text-slate-950 font-black text-xs rounded-xl shadow-lg shadow-amber-500/20 transition flex items-center justify-center gap-2"
              >
                {restUploading ? (
                  <span>Uploading Media to Cloudinary & Registering Kitchen in MongoDB...</span>
                ) : (
                  <span>Register Kitchen & Save to Database ➔</span>
                )}
              </button>
            </form>
          </div>
        )}
      </main>

      <CartDrawer />
      <ItemModal />
      <AuthModal />
      <TableReservationModal />
      <Footer />
    </div>
  );
}
