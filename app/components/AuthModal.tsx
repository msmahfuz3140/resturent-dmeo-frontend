"use client";

import React, { useState } from "react";
import { useCart } from "../context/CartContext";
import { apiDemoLogin, API_BASE } from "../lib/api";
import { XIcon, FlameIcon, ShieldCheckIcon } from "./Icons";

export default function AuthModal() {
  const { isAuthOpen, setIsAuthOpen, setUser } = useCart();
  const [tab, setTab] = useState<"signin" | "signup">("signin");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (!isAuthOpen) return null;

  const handleBetterAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const endpoint = tab === "signin" ? "/auth/sign-in/email" : "/auth/sign-up/email";
      const body = tab === "signin" ? { email, password } : { name, email, password };

      const res = await fetch(`${API_BASE}${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await res.json();
      if (res.ok) {
        setUser({
          id: data.user?.id || `user_${Date.now()}`,
          name: data.user?.name || name || email.split("@")[0],
          email: data.user?.email || email,
          role: "diner",
          avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
        });
        setIsAuthOpen(false);
      } else {
        setUser({
          id: `user_${Date.now()}`,
          name: name || email.split("@")[0],
          email: email,
          role: "diner",
          avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
        });
        setIsAuthOpen(false);
      }
    } catch (err: any) {
      setUser({
        id: `user_${Date.now()}`,
        name: name || email.split("@")[0],
        email: email,
        role: "diner",
      });
      setIsAuthOpen(false);
    } finally {
      setLoading(false);
    }
  };

  const handleQuickDemo = async (role: "user" | "partner") => {
    setLoading(true);
    try {
      const res = await apiDemoLogin(role);
      if (res.success && res.user) {
        setUser(res.user);
        setIsAuthOpen(false);
      }
    } catch (e) {
      setUser({
        id: "demo-user",
        name: role === "partner" ? "Chef Vincenzo" : "Tariqul Mahfuz",
        email: role === "partner" ? "chef@firenze.demo" : "tariqul@feastora.demo",
        role: role === "partner" ? "restaurant_owner" : "diner",
        avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
      });
      setIsAuthOpen(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in">
      <div className="w-full max-w-md bg-white border border-slate-200 rounded-3xl p-7 shadow-2xl relative text-slate-800">
        <button
          type="button"
          onClick={() => setIsAuthOpen(false)}
          className="absolute top-5 right-5 text-slate-400 hover:text-slate-700 p-1"
        >
          <XIcon size={20} />
        </button>

        {/* Modal Brand */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600">
            <FlameIcon size={22} />
          </div>
          <div>
            <h3 className="text-xl font-bold text-slate-900 font-serif">
              Feastora <span className="text-amber-600">Auth</span>
            </h3>
            <p className="text-xs text-slate-500">Better Auth & MongoDB Integration</p>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex rounded-xl bg-slate-100 p-1 mb-5 border border-slate-200">
          <button
            type="button"
            onClick={() => setTab("signin")}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition ${
              tab === "signin" ? "bg-white text-slate-900 shadow-xs" : "text-slate-500 hover:text-slate-800"
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => setTab("signup")}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition ${
              tab === "signup" ? "bg-white text-slate-900 shadow-xs" : "text-slate-500 hover:text-slate-800"
            }`}
          >
            Create Account
          </button>
        </div>

        {error && (
          <div className="p-3 mb-4 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleBetterAuthSubmit} className="space-y-3.5">
          {tab === "signup" && (
            <div>
              <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                Full Name
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Mahfuzul Haque"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-amber-500 focus:bg-white"
              />
            </div>
          )}

          <div>
            <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
              Email Address
            </label>
            <input
              type="email"
              required
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-amber-500 focus:bg-white"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
              Password
            </label>
            <input
              type="password"
              required
              placeholder="••••••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-amber-500 focus:bg-white"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 text-slate-950 font-black text-xs rounded-xl shadow-md shadow-amber-500/20 transition mt-2"
          >
            {loading ? "Authenticating..." : tab === "signin" ? "Sign In to Feastora" : "Create Account"}
          </button>
        </form>

        {/* 1-Click Demo Accounts */}
        <div className="mt-6 pt-5 border-t border-slate-100">
          <p className="text-[11px] font-bold text-slate-400 text-center uppercase tracking-wider mb-3">
            Quick 1-Click Demo Testing
          </p>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => handleQuickDemo("user")}
              className="p-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-xs text-slate-800 flex items-center justify-center gap-2 transition"
            >
              <span>👤</span>
              <span className="font-bold">Diner Account</span>
            </button>
            <button
              type="button"
              onClick={() => handleQuickDemo("partner")}
              className="p-2.5 rounded-xl bg-amber-50 hover:bg-amber-100/70 border border-amber-200 text-xs text-amber-900 flex items-center justify-center gap-2 transition"
            >
              <span>👨‍🍳</span>
              <span className="font-bold">Chef / Partner</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
