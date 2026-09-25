"use client";

import React, { useState } from "react";
import Link from "next/link";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import CartDrawer from "../components/CartDrawer";
import ItemModal from "../components/ItemModal";
import AuthModal from "../components/AuthModal";
import TableReservationModal from "../components/TableReservationModal";

const FAQS = [
  {
    q: "How does Feastora guarantee food temperature during delivery?",
    a: "Every Feastora courier is equipped with custom insulated dual-zone thermal bags. Hot dishes (like Biryani and Woodfired Pizzas) stay above 65°C, while cold items (smoothies, desserts, salads) are segregated with chilling packs to prevent condensation.",
  },
  {
    q: "Are all restaurants on Feastora 100% Halal certified?",
    a: "Yes. All partnered kitchens in Bangladesh undergo strict verification. Meats are sourced from certified Halal abattoirs, and kitchens adhere to non-cross contamination hygiene protocols.",
  },
  {
    q: "How do flash vouchers like FEAST20 and FREEDEL work?",
    a: "During checkout or in the bag drawer, enter the code in the 'Voucher code' box and click Apply. The discount will instantly deduct from your subtotal. Minimum order limits apply as described on the vouchers strip.",
  },
  {
    q: "What is the Feastora Dine-In Table Reservation policy?",
    a: "Table reservations are 100% free of charge! When you book via the 'Dine-In Table' tab, the kitchen holds your preferred zone (Window, Terrace, or Chef's Table) for up to 20 minutes past your reserved time.",
  },
  {
    q: "How do I become a Feastora Partner Kitchen?",
    a: "Visit the Partner Studio at /partner to register your restaurant, upload your menu PDF, and add signature dishes with Cloudinary media integration. Our culinary onboarding team activates verified kitchens within 24 hours.",
  },
];

export default function FAQPolicyPage() {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
        <div className="text-center mb-10 space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-amber-700">
            Assurance & Standards
          </span>
          <h1 className="text-3xl font-black text-slate-900 font-serif">
            Frequently Asked Questions & Policies
          </h1>
          <p className="text-xs text-slate-500">
            Everything you need to know about Feastora dining, food security, and delivery logistics.
          </p>
        </div>

        <div className="space-y-3.5">
          {FAQS.map((faq, i) => {
            const isOpen = openIdx === i;
            return (
              <div
                key={i}
                className="rounded-3xl bg-white border border-slate-200 overflow-hidden shadow-xs transition"
              >
                <button
                  type="button"
                  onClick={() => setOpenIdx(isOpen ? null : i)}
                  className="w-full p-5 text-left text-xs font-bold text-slate-900 flex items-center justify-between gap-4"
                >
                  <span className="text-sm font-serif">{faq.q}</span>
                  <span className="text-amber-600 font-bold text-base">
                    {isOpen ? "−" : "+"}
                  </span>
                </button>
                {isOpen && (
                  <div className="px-5 pb-5 text-xs text-slate-600 leading-relaxed border-t border-slate-100 pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Policy Anchors & Detail Sections */}
        <div className="mt-16 space-y-8">
          {/* Privacy Policy */}
          <section id="privacy" className="p-8 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-3">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-amber-500" />
              <h3 className="text-lg font-bold text-slate-900 font-serif">Privacy & Data Governance</h3>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Feastora adheres to strict customer confidentiality. Your phone number, delivery address, and dining preferences are strictly used for culinary dispatch and order status notifications. We never sell, lease, or monetize your data to third-party ad networks.
            </p>
            <p className="text-xs text-slate-600 leading-relaxed">
              All payment details processed via bKash, Nagad, or credit card are encrypted through end-to-end SSL protocols. Feastora does not store raw credit card numbers or banking PINs.
            </p>
          </section>

          {/* Terms of Service */}
          <section id="terms" className="p-8 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-3">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-amber-500" />
              <h3 className="text-lg font-bold text-slate-900 font-serif">Terms of Service & Order Fulfillment</h3>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              By placing an order on Feastora, you engage an artisanal restaurant and our dedicated courier network. Cancellations may be requested within 3 minutes of placement before kitchen ticket acceptance. Orders in cooking or dispatched status cannot be revoked.
            </p>
            <p className="text-xs text-slate-600 leading-relaxed">
              Promotional voucher codes (such as FEAST20, FREEDEL) are subject to availability, minimum spend thresholds, and single usage per customer account.
            </p>
          </section>

          {/* Better Auth & Security */}
          <section id="security" className="p-8 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-3">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <h3 className="text-lg font-bold text-slate-900 font-serif">Better Auth & Session Security</h3>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              User identity, diner profiles, and partner access are safeguarded by Better Auth framework integrated with MongoDB. Session tokens are securely cryptographically signed and stored in HTTP-only safe storage to prevent cross-site scripting (XSS) and token spoofing.
            </p>
          </section>
        </div>

        <div className="mt-12 p-6 rounded-3xl bg-amber-50 border border-amber-200 text-center space-y-2">
          <h4 className="text-sm font-bold text-amber-900 font-serif">Need Custom Catering or Inquiries?</h4>
          <p className="text-xs text-amber-800">Our concierge support team is active 24/7 for bespoke dining and partner inquiries.</p>
          <a
            href="mailto:concierge@feastora.demo"
            className="inline-block mt-2 px-5 py-2 bg-slate-900 text-white text-xs font-bold rounded-xl hover:bg-slate-800 transition"
          >
            Contact Concierge
          </a>
        </div>

      </main>

      <CartDrawer />
      <ItemModal />
      <AuthModal />
      <TableReservationModal />
      <Footer />
    </div>
  );
}
