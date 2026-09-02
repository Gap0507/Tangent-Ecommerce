"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  ShoppingBag,
  Package,
  Users,
  Ticket,
  Settings,
  ChevronDown,
  ChevronRight,
  Bell,
  Calendar,
  Lock,
  Mail,
  LogOut,
  Save,
} from "lucide-react";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [ordersOpen, setOrdersOpen] = useState(true);
  const [currentDate, setCurrentDate] = useState("");

  useEffect(() => {
    const today = new Date();
    setCurrentDate(today.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }));
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("admin_token");
    if (token === "dummy-jwt-token-for-admin") {
      setIsLoggedIn(true);
    }
    setIsCheckingAuth(false);
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (
      (email.trim() === "admin@tangentdrinks.com" || email.trim() === "admin") &&
      (password === "admin123" || password === "admin")
    ) {
      setIsLoggedIn(true);
      setError("");
      localStorage.setItem("admin_token", "dummy-jwt-token-for-admin");
    } else {
      setError("Invalid credentials. Hint: admin@tangentdrinks.com / admin123");
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    localStorage.removeItem("admin_token");
  };

  if (isCheckingAuth) {
    return <div className="min-h-screen bg-[#091E33] flex items-center justify-center" />;
  }

  // -------------------------------------------------------------
  // LOGIN MODAL
  // -------------------------------------------------------------
  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-[#091E33] flex items-center justify-center p-4 relative overflow-hidden">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-[#FCD34D]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-[#6A9A4A]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="w-full max-w-md bg-white rounded-3xl p-8 md:p-10 shadow-2xl relative z-10 border border-white/10">
          <div className="text-center mb-8">
            <h1 className="font-fraunces font-black text-navy text-[36px] tracking-tight mb-1">
              Tangent
            </h1>
            <p className="text-[13px] text-ink/60 font-medium">
              Real Ingredients. Real Refreshment.
            </p>
            <div className="mt-4 inline-block bg-cream/70 border border-navy/10 text-navy font-semibold text-[12px] px-3 py-1 rounded-full">
              Admin Portal Access
            </div>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 text-[13px] p-3.5 rounded-2xl font-medium text-center">
                {error}
              </div>
            )}

            <div>
              <label className="block text-[12px] font-bold uppercase tracking-wider text-navy/70 mb-1.5">
                Admin Email
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-ink/40 absolute left-4 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@tangentdrinks.com"
                  className="w-full bg-[#FAF7F2] border border-navy/15 rounded-2xl py-3.5 pl-11 pr-4 text-[14px] text-navy placeholder:text-ink/30 focus:outline-none focus:border-navy transition-all"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-[12px] font-bold uppercase tracking-wider text-navy/70 mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-ink/40 absolute left-4 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-[#FAF7F2] border border-navy/15 rounded-2xl py-3.5 pl-11 pr-4 text-[14px] text-navy placeholder:text-ink/30 focus:outline-none focus:border-navy transition-all"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-[#091E33] hover:bg-[#071728] text-white font-bold text-[15px] py-4 rounded-2xl transition-all shadow-lg hover:shadow-xl cursor-pointer mt-2"
            >
              Sign In to Dashboard
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-navy/10 text-center">
            <button
              type="button"
              onClick={() => {
                setEmail("admin@tangentdrinks.com");
                setPassword("admin123");
              }}
              className="text-[12px] font-bold text-navy/70 hover:text-navy underline cursor-pointer"
            >
              Autofill Demo Credentials
            </button>
          </div>
        </div>
      </div>
    );
  }

  const isDashboard = pathname === "/admin-panel";
  const isAllOrders = pathname === "/admin-panel/all-orders";
  const isPendingOrders = pathname === "/admin-panel/pending-orders";
  const isInventory = pathname === "/admin-panel/inventory";
  const isCustomers = pathname === "/admin-panel/customers";
  const isCoupons = pathname === "/admin-panel/coupons";
  const isSettings = pathname === "/admin-panel/settings";

  return (
    <div className="min-h-screen bg-[#F8F6F0] flex text-navy font-sans">
      
      {/* ---------------- SIDEBAR ---------------- */}
      <aside className="w-72 bg-[#091E33] text-white flex flex-col justify-between p-6 shrink-0 h-screen sticky top-0 overflow-hidden">
        <div>
          <div className="mb-8">
            <h1 className="font-fraunces font-black text-[32px] tracking-tight text-white leading-none">
              Tangent
            </h1>
            <p className="text-[12px] text-white/50 font-medium mt-1">
              Real Ingredients. Real Refreshment.
            </p>
          </div>

          <nav className="space-y-1.5">
            {/* Dashboard Link */}
            <Link
              href="/admin-panel"
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl font-bold text-[14px] transition-all cursor-pointer ${
                isDashboard
                  ? "bg-[#FCD34D] text-[#091E33] shadow-md"
                  : "text-white/70 hover:bg-white/5 hover:text-white"
              }`}
            >
              <LayoutDashboard className="w-5 h-5" />
              <span>Dashboard</span>
            </Link>

            {/* Orders Accordion */}
            <div>
              <button
                onClick={() => setOrdersOpen(!ordersOpen)}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl font-bold text-[14px] ${
                  isAllOrders || isPendingOrders
                    ? "bg-[#FCD34D] text-[#091E33] shadow-md font-bold"
                    : "text-white/70 hover:bg-white/5 hover:text-white"
                } transition-all cursor-pointer`}
              >
                <div className="flex items-center gap-3">
                  <ShoppingBag className="w-5 h-5" />
                  <span>Orders</span>
                </div>
                <ChevronDown className={`w-4 h-4 transition-transform ${ordersOpen ? "rotate-180" : ""}`} />
              </button>

              {ordersOpen && (
                <div className="pl-11 pr-2 py-1.5 space-y-1">
                  <Link
                    href="/admin-panel/all-orders"
                    className={`w-full flex items-center justify-between py-2 px-3 rounded-xl text-[13px] font-medium transition-colors cursor-pointer ${
                      isAllOrders ? "text-white font-bold" : "text-white/60 hover:text-white"
                    }`}
                  >
                    <span>All Orders</span>
                    {isAllOrders && <span className="w-2 h-2 rounded-full bg-[#FCD34D]" />}
                  </Link>

                  <Link
                    href="/admin-panel/pending-orders"
                    className={`w-full flex items-center justify-between py-2 px-3 rounded-xl text-[13px] font-medium transition-colors cursor-pointer ${
                      isPendingOrders ? "text-white font-bold" : "text-white/60 hover:text-white"
                    }`}
                  >
                    <span>Pending Orders</span>
                    {isPendingOrders && <span className="w-2 h-2 rounded-full bg-[#FCD34D]" />}
                  </Link>
                </div>
              )}
            </div>

            {/* Inventory */}
            <Link
              href="/admin-panel/inventory"
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl font-bold text-[14px] transition-all cursor-pointer ${
                isInventory
                  ? "bg-[#FCD34D] text-[#091E33] shadow-md"
                  : "text-white/70 hover:bg-white/5 hover:text-white"
              }`}
            >
              <Package className="w-5 h-5" />
              <span>Inventory</span>
            </Link>

            {/* Customers */}
            <Link
              href="/admin-panel/customers"
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl font-bold text-[14px] transition-all cursor-pointer ${
                isCustomers
                  ? "bg-[#FCD34D] text-[#091E33] shadow-md"
                  : "text-white/70 hover:bg-white/5 hover:text-white"
              }`}
            >
              <Users className="w-5 h-5" />
              <span>Customers</span>
            </Link>

            {/* Coupons */}
            <Link
              href="/admin-panel/coupons"
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl font-bold text-[14px] transition-all cursor-pointer ${
                isCoupons
                  ? "bg-[#FCD34D] text-[#091E33] shadow-md"
                  : "text-white/70 hover:bg-white/5 hover:text-white"
              }`}
            >
              <Ticket className="w-5 h-5" />
              <span>Coupons & Discounts</span>
            </Link>

            {/* Settings */}
            <Link
              href="/admin-panel/settings"
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl font-bold text-[14px] transition-all cursor-pointer ${
                isSettings
                  ? "bg-[#FCD34D] text-[#091E33] shadow-md"
                  : "text-white/70 hover:bg-white/5 hover:text-white"
              }`}
            >
              <Settings className="w-5 h-5" />
              <span>Settings</span>
            </Link>
          </nav>
        </div>

        {/* Sidebar Footer */}
        <div className="space-y-4 pt-4 border-t border-white/10">
          <div className="flex items-center justify-between p-2 rounded-2xl transition-all">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-[#FCD34D] text-[#091E33] font-fraunces font-black flex items-center justify-center text-[15px] shadow-sm">
                A
              </div>
              <div className="truncate max-w-[130px]">
                <h4 className="text-[13px] font-bold text-white leading-tight truncate">Admin</h4>
                <p className="text-[11px] text-white/50 truncate">admin@tangentdrinks.com</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="text-white/50 hover:text-white p-1.5 transition-colors cursor-pointer"
              title="Logout"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* ---------------- MAIN CONTENT AREA ---------------- */}
      <main className="flex-1 p-6 md:p-8 overflow-y-auto max-w-[1400px] no-scrollbar">
        
        {/* Shared Top Bar Header */}
        <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h2 className="font-fraunces font-black text-[28px] md:text-[32px] text-navy leading-tight">
              {isDashboard && "Welcome back, Admin 👋"}
              {isAllOrders && "All Orders"}
              {isPendingOrders && "Pending Orders"}
              {isInventory && "Inventory"}
              {isCustomers && "Customers"}
              {isCoupons && "Coupons & Discounts"}
              {isSettings && "Settings"}
            </h2>
            {(isAllOrders || isPendingOrders || isInventory || isCustomers || isCoupons || isSettings) && (
              <p className="text-[13px] text-ink/60 font-medium mt-1">
                {isAllOrders && "View and manage all customer orders"}
                {isPendingOrders && "These orders are waiting to be packed and shipped"}
                {isInventory && "Manage your products and stock levels"}
                {isCustomers && "Manage and view all your customers"}
                {isCoupons && "Create and manage coupons to boost sales and reward your customers."}
                {isSettings && "Manage your store configurations and integrations"}
              </p>
            )}
          </div>

          {/* Right Header Content */}
          <div className="flex items-center gap-4">
            
            {/* Create Coupon Button only on Coupons Page */}
            {isCoupons && (
              <button className="flex items-center gap-2 bg-[#091E33] hover:bg-navy text-white text-[14px] font-bold px-5 py-2.5 rounded-xl transition-all cursor-pointer shadow-sm">
                <span className="text-lg leading-none mb-0.5">+</span>
                <span>Create Coupon</span>
              </button>
            )}

            {/* Save Changes Button only on Settings Page */}
            {isSettings && (
              <button className="flex items-center gap-2 bg-[#091E33] hover:bg-navy text-white text-[14px] font-bold px-5 py-2.5 rounded-xl transition-all cursor-pointer shadow-sm">
                <Save className="w-4 h-4" />
                <span>Save Changes</span>
              </button>
            )}

          <div className="flex items-center gap-3">
            <div className="bg-white border border-navy/10 rounded-full px-4 py-2 flex items-center gap-2 text-[13px] font-bold text-navy/80 shadow-sm">
              <span>{currentDate}</span>
              <Calendar className="w-4 h-4 text-navy/40" />
            </div>

            <button className="relative bg-white border border-navy/10 w-10 h-10 rounded-full flex items-center justify-center text-navy hover:bg-cream transition-colors shadow-sm cursor-pointer">
              <Bell className="w-4 h-4 text-navy" />
              <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-red-500 ring-2 ring-white" />
            </button>
          </div>
          </div>
        </header>

        {children}
      </main>
    </div>
  );
}
