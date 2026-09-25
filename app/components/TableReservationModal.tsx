"use client";

import React, { useState, useEffect } from "react";
import { useCart } from "../context/CartContext";
import { fetchRestaurants, Restaurant } from "../lib/api";
import { XIcon, ClocheIcon, CheckIcon, StarIcon, ClockIcon } from "./Icons";

export default function TableReservationModal() {
  const { isReservationOpen, setIsReservationOpen, bookTable, user } = useCart();

  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [restaurantName, setRestaurantName] = useState("Sultan's Heritage Kacchi");
  const [guests, setGuests] = useState("2 Guests");
  const [date, setDate] = useState("Today, 7:30 PM");
  const [seatingArea, setSeatingArea] = useState("Window View");
  const [occasion, setOccasion] = useState("Casual Dining");
  const [customerName, setCustomerName] = useState(user?.name || "");
  const [customerPhone, setCustomerPhone] = useState("+880 1711-223344");
  const [specialRequests, setSpecialRequests] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmedBooking, setConfirmedBooking] = useState<any>(null);

  useEffect(() => {
    fetchRestaurants().then((data) => {
      setRestaurants(data);
      if (data.length > 0 && !restaurantName) {
        setRestaurantName(data[0].name);
      }
    }).catch(() => {});
  }, []);

  if (!isReservationOpen) return null;

  const handleBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await bookTable({
        restaurantName,
        guests,
        date,
        seatingArea,
        occasion,
        customerName: customerName || "Guest Diner",
        customerPhone,
        specialRequests,
        confirmationCode: "FST-RES-" + Math.floor(1000 + Math.random() * 9000),
        timestamp: new Date().toISOString(),
      });
      setConfirmedBooking(res);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-lg bg-white border border-slate-200 rounded-3xl p-7 shadow-2xl relative text-slate-800">
        
        <button
          type="button"
          onClick={() => {
            setIsReservationOpen(false);
            setConfirmedBooking(null);
          }}
          className="absolute top-5 right-5 text-slate-400 hover:text-slate-700 p-1 rounded-full hover:bg-slate-100 transition"
        >
          <XIcon size={20} />
        </button>

        {!confirmedBooking ? (
          <div>
            {/* Header */}
            <div className="flex items-center gap-3 mb-6">
              <div className="w-11 h-11 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600 shadow-sm">
                <ClocheIcon size={22} />
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-900 font-serif">
                  Artisanal Table Reservation
                </h3>
                <p className="text-xs text-slate-500">
                  Instant VIP table booking with zero reservation fees
                </p>
              </div>
            </div>

            <form onSubmit={handleBooking} className="space-y-4">
              {/* Restaurant selection */}
              <div>
                <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                  Select Kitchen / Restaurant
                </label>
                <select
                  value={restaurantName}
                  onChange={(e) => setRestaurantName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 font-semibold focus:outline-none focus:border-amber-500"
                >
                  {restaurants.length > 0 ? (
                    restaurants.map((r) => (
                      <option key={r._id} value={r.name}>
                        {r.name} ({r.area})
                      </option>
                    ))
                  ) : (
                    <>
                      <option value="Sultan's Heritage Kacchi">Sultan's Heritage Kacchi (Gulshan 2)</option>
                      <option value="The Charcoal Artisan Grill">The Charcoal Artisan Grill (Banani)</option>
                      <option value="Bella Firenze Trattoria">Bella Firenze Trattoria (Gulshan 1)</option>
                      <option value="Tokyo Drift Sushi & Ramen Bar">Tokyo Drift Sushi & Ramen (Dhanmondi)</option>
                      <option value="Green Haven Organics">Green Haven Organics (Gulshan 2)</option>
                      <option value="Velvet Crust Artisanal Patisserie">Velvet Crust Patisserie (Uttara)</option>
                    </>
                  )}
                </select>
              </div>


              {/* Guests & Date */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                    Party Size
                  </label>
                  <select
                    value={guests}
                    onChange={(e) => setGuests(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 font-medium focus:outline-none focus:border-amber-500"
                  >
                    <option value="1 Guest">1 Guest (Solo Diner)</option>
                    <option value="2 Guests">2 Guests (Couple Dining)</option>
                    <option value="4 Guests">4 Guests (Family Table)</option>
                    <option value="6 Guests">6 Guests (Group Celebration)</option>
                    <option value="8+ Guests">8+ Guests (Private Room)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                    Date & Time Slot
                  </label>
                  <select
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 font-medium focus:outline-none focus:border-amber-500"
                  >
                    <option value="Today, 7:30 PM">Today, 7:30 PM (Dinner)</option>
                    <option value="Today, 8:30 PM">Today, 8:30 PM (Prime)</option>
                    <option value="Tomorrow, 1:30 PM">Tomorrow, 1:30 PM (Lunch)</option>
                    <option value="Tomorrow, 8:00 PM">Tomorrow, 8:00 PM (Dinner)</option>
                    <option value="This Friday, 7:45 PM">This Friday, 7:45 PM (Weekend)</option>
                  </select>
                </div>
              </div>

              {/* Seating preference */}
              <div>
                <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                  Preferred Seating Zone
                </label>
                <div className="grid grid-cols-3 gap-2 text-xs">
                  {["Window View", "Chef's Table", "Terrace / Outdoor"].map((zone) => (
                    <button
                      key={zone}
                      type="button"
                      onClick={() => setSeatingArea(zone)}
                      className={`p-2.5 rounded-xl border text-center transition ${
                        seatingArea === zone
                          ? "bg-amber-50 border-amber-500 text-amber-800 font-bold shadow-sm"
                          : "bg-slate-50 border-slate-200 text-slate-600 hover:border-slate-300"
                      }`}
                    >
                      {zone}
                    </button>
                  ))}
                </div>
              </div>

              {/* Contact info */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Mahfuzul Haque"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                    Phone Number *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="+880 17..."
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 text-slate-950 font-black text-xs rounded-xl shadow-lg shadow-amber-500/20 transition mt-2 disabled:opacity-70"
              >
                {isSubmitting ? "Securing Table Reservation..." : "Confirm Table Reservation ➔"}
              </button>

            </form>
          </div>
        ) : (
          /* Confirmation View */
          <div className="text-center py-4 space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600 text-2xl mx-auto">
              ✓
            </div>

            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800 px-2.5 py-1 rounded-full">
                Booking Confirmed
              </span>
              <h3 className="text-2xl font-bold font-serif text-slate-900 mt-2">
                We're Expecting You!
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Your reservation at <b>{confirmedBooking.restaurantName}</b> is reserved.
              </p>
            </div>

            <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl text-left space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-500">Booking Code:</span>
                <span className="font-mono font-bold text-amber-600">{confirmedBooking.confirmationCode}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Party Size:</span>
                <span className="font-semibold text-slate-800">{confirmedBooking.guests}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Time:</span>
                <span className="font-semibold text-slate-800">{confirmedBooking.date}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Seating:</span>
                <span className="font-semibold text-slate-800">{confirmedBooking.seatingArea}</span>
              </div>
            </div>

            <p className="text-[11px] text-slate-400">
              An SMS confirmation with directions has been dispatched to {confirmedBooking.customerPhone}.
            </p>

            <button
              type="button"
              onClick={() => {
                setIsReservationOpen(false);
                setConfirmedBooking(null);
              }}
              className="px-6 py-2.5 bg-slate-900 text-white text-xs font-bold rounded-xl hover:bg-slate-800 transition"
            >
              Done
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
