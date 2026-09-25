import React from "react";
import Link from "next/link";
import { FlameIcon } from "./Icons";

export default function Footer() {
  return (
    <footer className="w-full bg-white border-t border-slate-200 pt-16 pb-12 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-slate-200">
          
          {/* Col 1: Brand */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-500 to-amber-400 p-[1px] shadow-md shadow-amber-500/20">
                <div className="w-full h-full bg-white rounded-2xl flex items-center justify-center">
                  <FlameIcon size={20} className="text-amber-500" />
                </div>
              </div>
              <span className="text-2xl font-black tracking-tight text-slate-900 font-serif">
                FEAST<span className="text-amber-600">ORA</span>
              </span>
            </Link>
            <p className="text-xs text-slate-500 leading-relaxed">
              Dhaka’s premier artisanal dining & instant gourmet delivery platform. Powered by Next.js, Express.js, MongoDB, Better Auth, and Cloudinary.
            </p>
            <div className="flex items-center gap-2 pt-2 text-xs text-emerald-700 font-semibold">
              <span>● Live Kitchens Accepting Orders</span>
              <span className="text-slate-300">|</span>
              <span>● 25-35 Min Average ETA</span>
            </div>
          </div>

          {/* Col 2: Popular Hubs */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider font-serif">
              Delivery Hubs
            </h4>
            <ul className="space-y-2 text-xs text-slate-500">
              <li><Link href="/?search=Gulshan#restaurants-section" className="hover:text-amber-700 transition">Gulshan 1 & 2</Link></li>
              <li><Link href="/?search=Banani#restaurants-section" className="hover:text-amber-700 transition">Banani & Block 11</Link></li>
              <li><Link href="/?search=Dhanmondi#restaurants-section" className="hover:text-amber-700 transition">Dhanmondi Lakefront</Link></li>
              <li><Link href="/?search=Uttara#restaurants-section" className="hover:text-amber-700 transition">Uttara Sectors 1-14</Link></li>
              <li><Link href="/?search=Bashundhara#restaurants-section" className="hover:text-amber-700 transition">Bashundhara R/A</Link></li>
            </ul>
          </div>

          {/* Col 3: Cuisines */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider font-serif">
              Signature Cuisines
            </h4>
            <ul className="space-y-2 text-xs text-slate-500">
              <li><Link href="/?search=Kacchi#restaurants-section" className="hover:text-amber-700 transition">Royal Saffron Kacchi Biryani</Link></li>
              <li><Link href="/?search=Burger#restaurants-section" className="hover:text-amber-700 transition">Artisanal Smash Burgers</Link></li>
              <li><Link href="/?search=Pizza#restaurants-section" className="hover:text-amber-700 transition">Woodfired Sourdough Pizzas</Link></li>
              <li><Link href="/?search=Ramen#restaurants-section" className="hover:text-amber-700 transition">Black Garlic Hakata Ramen</Link></li>
              <li><Link href="/?search=Patisserie#restaurants-section" className="hover:text-amber-700 transition">French Viennoiserie & Patisserie</Link></li>
            </ul>
          </div>

          {/* Col 4: For Partners & Technology */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider font-serif">
              Partner Kitchens
            </h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              Are you a restaurant or master chef? Showcase your culinary creations on Feastora with Cloudinary integration.
            </p>
            <div className="pt-2 flex flex-col gap-2">
              <Link
                href="/partner"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition shadow-xs"
              >
                <span>Partner Studio & Uploads ➔</span>
              </Link>
              <Link
                href="/admin"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 text-xs font-bold transition shadow-xs"
              >
                <span>⚡ Admin Command Center ➔</span>
              </Link>
            </div>
          </div>

        </div>

        {/* Bottom Credits */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} Feastora Prime. Built with Next.js, Express & MongoDB.</p>
          <div className="flex items-center gap-4">
            <Link href="/faq#privacy" className="hover:text-slate-800 transition">Privacy & Policies</Link>
            <Link href="/faq#terms" className="hover:text-slate-800 transition">Terms of Service</Link>
            <Link href="/faq#security" className="hover:text-slate-800 transition">Better Auth Verified</Link>
            <Link href="/admin" className="text-amber-700 font-bold hover:underline">Admin Portal</Link>
          </div>
        </div>
      </div>
    </footer>

  );
}
