"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Navbar from "../../components/Navbar";
import CartDrawer from "../../components/CartDrawer";
import ItemModal from "../../components/ItemModal";
import AuthModal from "../../components/AuthModal";
import TableReservationModal from "../../components/TableReservationModal";
import Footer from "../../components/Footer";
import DishCard from "../../components/DishCard";
import { fetchRestaurantDetails, Restaurant, MenuItem, Review, API_BASE } from "../../lib/api";
import { useCart } from "../../context/CartContext";
import {
  StarIcon,
  ClockIcon,
  BikeIcon,
  ShieldCheckIcon,
  SearchIcon,
  FilePdfIcon,
  ShoppingBagIcon,
  ClocheIcon,
} from "../../components/Icons";

export default function RestaurantDetailPage() {
  const params = useParams();
  const slug = params?.slug as string;

  const { cartCount, total, setIsCartOpen, setIsReservationOpen, user } = useCart();
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [groupedMenu, setGroupedMenu] = useState<{ category: string; items: MenuItem[] }[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [menuSearch, setMenuSearch] = useState("");
  const [loading, setLoading] = useState(true);

  // Review submission state
  const [reviewName, setReviewName] = useState(user?.name || "");
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState("");
  const [submittingReview, setSubmittingReview] = useState(false);
  const [reviewSuccess, setReviewSuccess] = useState(false);

  useEffect(() => {
    if (!slug) return;
    async function loadRestaurant() {
      setLoading(true);
      try {
        const data = await fetchRestaurantDetails(slug);
        setRestaurant(data.restaurant);
        setGroupedMenu(data.groupedMenu || []);
        setReviews(data.reviews || []);
      } catch (err) {
        console.error("Error fetching restaurant:", err);
      } finally {
        setLoading(false);
      }
    }
    loadRestaurant();
  }, [slug]);

  const handleAddReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewComment.trim() || !restaurant) return;
    setSubmittingReview(true);
    try {
      const res = await fetch(`${API_BASE}/reviews`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          restaurantId: restaurant._id,
          userName: reviewName || user?.name || "Verified Patron",
          rating: reviewRating,
          comment: reviewComment,
          tag: "Verified Diner",
        }),
      });
      const data = await res.json();
      if (data.success && data.data) {
        setReviews((prev) => [data.data, ...prev]);
      } else {
        const fallbackReview: Review = {
          _id: `rev_${Date.now()}`,
          restaurantId: restaurant._id,
          userName: reviewName || "Verified Patron",
          rating: reviewRating,
          comment: reviewComment,
          tag: "Verified Diner",
        };
        setReviews((prev) => [fallbackReview, ...prev]);
      }
      setReviewComment("");
      setReviewSuccess(true);
      setTimeout(() => setReviewSuccess(false), 4000);
    } catch (e) {
      console.error("Review error:", e);
    } finally {
      setSubmittingReview(false);
    }
  };


  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 py-16 w-full space-y-6 flex-1">
          <div className="h-64 rounded-3xl bg-slate-200 animate-pulse" />
          <div className="h-12 w-64 bg-slate-200 rounded-xl animate-pulse" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="h-44 bg-slate-200 rounded-2xl animate-pulse" />
            ))}
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!restaurant) {
    return (
      <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col">
        <Navbar />
        <div className="max-w-md mx-auto text-center py-24 px-4 flex-1">
          <h2 className="text-2xl font-bold font-serif text-slate-900">Restaurant Not Found</h2>
          <p className="text-xs text-slate-500 mt-2">The kitchen you are looking for might be temporarily offline or closed.</p>
          <Link
            href="/"
            className="inline-block mt-6 px-6 py-2.5 bg-amber-500 text-slate-950 font-bold text-xs rounded-xl"
          >
            Back to Marketplace
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  // Filter menu items by active category & search query
  const filteredCategories = groupedMenu
    .filter((group) => activeCategory === "all" || group.category === activeCategory)
    .map((group) => ({
      category: group.category,
      items: group.items.filter((item) => {
        if (!menuSearch.trim()) return true;
        const q = menuSearch.toLowerCase();
        return item.name.toLowerCase().includes(q) || item.description?.toLowerCase().includes(q);
      }),
    }))
    .filter((group) => group.items.length > 0);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col">
      <Navbar />

      <main className="flex-1 pb-24">
        {/* Restaurant Hero Banner */}
        <div className="relative h-64 sm:h-80 w-full overflow-hidden bg-slate-200">
          <img
            src={restaurant.banner}
            alt={restaurant.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent" />

          {/* Breadcrumb / Back Link */}
          <div className="absolute top-6 left-4 sm:left-8 z-10">
            <Link
              href="/"
              className="px-3.5 py-1.5 rounded-xl bg-white/95 backdrop-blur border border-slate-200 text-xs font-bold text-slate-800 hover:text-slate-950 flex items-center gap-1.5 transition shadow-sm"
            >
              <span>← Back to Restaurants</span>
            </Link>
          </div>
        </div>

        {/* Restaurant Header Meta Card */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-20 relative z-20">
          <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
            
            <div className="flex items-start sm:items-center gap-5">
              {/* Logo */}
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-white border-2 border-slate-200 overflow-hidden shadow-lg shrink-0">
                <img
                  src={restaurant.logo}
                  alt={restaurant.name}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Title & Cuisines */}
              <div className="space-y-1.5">
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="text-2xl sm:text-3xl font-black text-slate-900 font-serif">
                    {restaurant.name}
                  </h1>
                  <span className="px-2 py-0.5 rounded-md bg-emerald-50 border border-emerald-200 text-emerald-800 text-[10px] font-bold">
                    ✓ Verified Kitchen
                  </span>
                </div>

                <p className="text-xs text-slate-500">
                  <span className="text-amber-700 font-bold mr-1.5">{restaurant.priceTier}</span>
                  • {restaurant.cuisines.join(", ")}
                </p>

                <p className="text-xs text-slate-600 italic max-w-xl">
                  {restaurant.tagline || restaurant.description}
                </p>

                <div className="flex items-center gap-4 pt-1 text-xs text-slate-500">
                  <span>📍 {restaurant.address || restaurant.area}</span>
                  <span>⏰ {restaurant.openingHours}</span>
                </div>
              </div>
            </div>

            {/* Right Meta Column: Rating, Actions, PDF */}
            <div className="flex flex-wrap md:flex-col items-center md:items-end gap-3 shrink-0 pt-4 md:pt-0 border-t md:border-t-0 border-slate-100">
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 font-bold text-sm">
                <StarIcon size={16} className="text-amber-500" />
                <span>{restaurant.rating.toFixed(1)}</span>
                <span className="text-xs text-slate-400 font-normal">
                  ({restaurant.ratingCount} reviews)
                </span>
              </div>

              <div className="flex items-center gap-3 text-xs text-slate-600 font-medium">
                <span className="flex items-center gap-1">
                  <ClockIcon size={13} className="text-amber-600" />
                  {restaurant.deliveryTime}
                </span>
                <span className="flex items-center gap-1">
                  <BikeIcon size={13} className="text-amber-600" />
                  {restaurant.deliveryFee === 0 ? "Free Delivery" : `${restaurant.deliveryFee} ৳ Delivery`}
                </span>
              </div>

              <div className="flex items-center gap-2">
                {/* Table reservation button */}
                <button
                  type="button"
                  onClick={() => setIsReservationOpen(true)}
                  className="px-3.5 py-1.5 rounded-xl bg-amber-50 hover:bg-amber-100 border border-amber-200 text-xs font-bold text-amber-900 flex items-center gap-1.5 transition"
                >
                  <ClocheIcon size={14} className="text-amber-700" />
                  <span>Reserve Table</span>
                </button>

                {/* PDF Menu Download button */}
                {restaurant.pdfMenuUrl && (
                  <a
                    href={restaurant.pdfMenuUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-xs font-bold text-white flex items-center gap-1.5 transition"
                  >
                    <FilePdfIcon size={14} className="text-amber-400" />
                    <span>Menu PDF</span>
                  </a>
                )}
              </div>
            </div>

          </div>
        </div>

        {/* Menu Navigation & Search Bar */}
        <div className="sticky top-20 z-30 bg-white/95 backdrop-blur-md border-y border-slate-200 my-8 py-3.5 shadow-xs">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
            
            {/* Category Pills */}
            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar w-full sm:w-auto">
              <button
                type="button"
                onClick={() => setActiveCategory("all")}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition shrink-0 ${
                  activeCategory === "all"
                    ? "bg-amber-500 text-slate-950 shadow-xs"
                    : "bg-slate-100 text-slate-700 hover:text-slate-900 border border-slate-200"
                }`}
              >
                All Dishes
              </button>

              {groupedMenu.map((group) => (
                <button
                  key={group.category}
                  type="button"
                  onClick={() => setActiveCategory(group.category)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition shrink-0 ${
                    activeCategory === group.category
                      ? "bg-amber-500 text-slate-950 shadow-xs"
                      : "bg-slate-100 text-slate-700 hover:text-slate-900 border border-slate-200"
                  }`}
                >
                  {group.category} ({group.items.length})
                </button>
              ))}
            </div>

            {/* In-menu search */}
            <div className="relative w-full sm:w-64 shrink-0">
              <SearchIcon size={14} className="absolute left-3 top-2.5 text-slate-400" />
              <input
                type="text"
                placeholder="Search in this menu..."
                value={menuSearch}
                onChange={(e) => setMenuSearch(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-amber-500 focus:bg-white"
              />
            </div>

          </div>
        </div>

        {/* Grouped Dishes Grid */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          {filteredCategories.length === 0 ? (
            <div className="py-16 text-center rounded-3xl bg-white border border-slate-200">
              <p className="text-base font-bold text-slate-800">No dishes found</p>
              <p className="text-xs text-slate-500 mt-1">Try another search keyword or category tab.</p>
            </div>
          ) : (
            filteredCategories.map((group) => (
              <section key={group.category} className="space-y-4">
                <div className="flex items-center gap-3 border-b border-slate-200 pb-2">
                  <h3 className="text-xl font-bold text-slate-900 font-serif">
                    {group.category}
                  </h3>
                  <span className="px-2 py-0.5 rounded-md bg-slate-100 text-[10px] font-bold text-slate-600">
                    {group.items.length} items
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {group.items.map((item) => (
                    <DishCard
                      key={item._id}
                      item={item}
                      restaurant={restaurant}
                    />
                  ))}
                </div>
              </section>
            ))
          )}

          {/* Customer Reviews & Submit Review Section */}
          <section className="pt-12 border-t border-slate-200 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-xl font-bold text-slate-900 font-serif">
                  Diner Testimonials & Ratings
                </h3>
                <p className="text-xs text-slate-500">Verified culinary feedback from Feastora patrons</p>
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs font-bold">
                <StarIcon size={14} className="text-amber-500" />
                <span>{restaurant.rating.toFixed(1)} / 5.0 Average</span>
              </div>
            </div>

            {/* Reviews Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {reviews.map((rev) => (
                <div
                  key={rev._id}
                  className="p-5 rounded-3xl bg-white border border-slate-200 space-y-2.5 shadow-xs"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-900">{rev.userName}</span>
                    <div className="flex text-amber-500">
                      {Array.from({ length: rev.rating }).map((_, i) => (
                        <StarIcon key={i} size={12} />
                      ))}
                    </div>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed italic">
                    "{rev.comment}"
                  </p>
                  <span className="inline-block text-[10px] text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded">
                    ✓ {rev.tag || "Verified Diner"}
                  </span>
                </div>
              ))}
            </div>

            {/* Leave a review box */}
            <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-xs max-w-xl">
              <h4 className="text-sm font-bold text-slate-900 mb-2">Leave Your Experience Review</h4>
              {reviewSuccess && (
                <div className="p-2.5 bg-emerald-50 text-emerald-800 rounded-xl text-xs font-semibold mb-3">
                  Thank you! Your verified review has been posted.
                </div>
              )}
              <form onSubmit={handleAddReview} className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <input
                    type="text"
                    required
                    placeholder="Your Name"
                    value={reviewName}
                    onChange={(e) => setReviewName(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-amber-500"
                  />
                  <select
                    value={reviewRating}
                    onChange={(e) => setReviewRating(Number(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 font-bold focus:outline-none focus:border-amber-500"
                  >
                    <option value={5}>⭐⭐⭐⭐⭐ (5 Stars)</option>
                    <option value={4}>⭐⭐⭐⭐ (4 Stars)</option>
                    <option value={3}>⭐⭐⭐ (3 Stars)</option>
                  </select>
                </div>
                <textarea
                  rows={2}
                  required
                  placeholder="Share details about the flavors, presentation, and delivery..."
                  value={reviewComment}
                  onChange={(e) => setReviewComment(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-amber-500"
                />
                <button
                  type="submit"
                  disabled={submittingReview}
                  className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl shadow-xs transition"
                >
                  Submit Review
                </button>
              </form>
            </div>
          </section>

        </div>

        {/* Floating Cart Pill if Cart has Items */}
        {cartCount > 0 && (
          <div className="fixed bottom-6 inset-x-0 z-40 flex justify-center px-4 animate-bounce-short">
            <button
              type="button"
              onClick={() => setIsCartOpen(true)}
              className="w-full max-w-lg p-3.5 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 text-slate-950 font-black shadow-xl shadow-amber-500/20 flex items-center justify-between transition transform hover:scale-[1.02]"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-slate-950 text-amber-400 flex items-center justify-center">
                  <ShoppingBagIcon size={16} />
                </div>
                <div className="text-left">
                  <p className="text-xs font-black">{cartCount} {cartCount === 1 ? "Item" : "Items"} in Bag</p>
                  <p className="text-[10px] text-slate-900 font-medium">Ready to order</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-base font-serif font-black">{total} ৳</span>
                <span className="text-xs bg-slate-950/20 px-2 py-1 rounded-lg">View Bag ➔</span>
              </div>
            </button>
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
