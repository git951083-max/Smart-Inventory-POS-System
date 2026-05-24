import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getCurrentUser } from "../service/auth.service";

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

const Home = () => {
  const [user, setUser] = useState<User | null>(null);
  const [checkingAuth, setCheckingAuth] = useState(true);

  useEffect(() => {
    const checkUser = async () => {
      try {
        const res = await getCurrentUser();
        setUser(res.user);
      } catch (error) {
        setUser(null);
      } finally {
        setCheckingAuth(false);
      }
    };

    checkUser();
  }, []);

  if (checkingAuth) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="flex items-center gap-3">
          <div className="h-5 w-5 animate-spin rounded-full border-2 border-blue-600 border-t-transparent" />
          <p className="text-sm text-gray-500">Checking authentication...</p>
        </div>
      </main>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Top Navbar */}
      <header className="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-blue-600 flex items-center justify-center">
            <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10" />
            </svg>
          </div>
          <span className="font-semibold text-gray-900 text-base">Inventory Manager</span>
        </div>
        <div className="flex items-center gap-3">
          {user && (
            <span className="text-sm text-gray-600">
              Welcome, <span className="font-medium text-gray-900">{user.name}</span>
            </span>
          )}
          {user ? (
            <Link
              to="/dashboard"
              className="inline-flex items-center gap-1.5 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition-colors"
            >
              Go to Dashboard
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                to="/login"
                className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition-colors"
              >
                Get Started
              </Link>
            </div>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1 flex flex-col">
        {/* Hero */}
        <section className="bg-white border-b border-gray-200 px-6 py-14 text-center">
          <span className="inline-block mb-4 rounded-full border border-blue-100 bg-blue-50 px-4 py-1.5 text-xs font-medium text-blue-600 tracking-wide uppercase">
            Smart Inventory Management System
          </span>
          <h1 className="mx-auto max-w-3xl text-3xl font-bold text-gray-900 leading-tight md:text-5xl">
            Manage your stock, billing and business inventory in one place.
          </h1>
          <p className="mt-4 mx-auto max-w-xl text-base text-gray-500">
            Track products, monitor stock levels, manage sales, and reduce manual billing errors with a clean and simple inventory dashboard.
          </p>

          {user ? (
            <div className="mt-8">
              <Link
                to="/dashboard"
                className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-6 py-3 text-sm font-medium text-white hover:bg-blue-700 transition-colors shadow-sm"
              >
                Go to Dashboard
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          ) : (
            <div className="mt-8 flex items-center justify-center gap-3">
              <Link
                to="/register"
                className="rounded-lg bg-blue-600 px-6 py-3 text-sm font-medium text-white hover:bg-blue-700 transition-colors shadow-sm"
              >
                Get Started
              </Link>
              <Link
                to="/login"
                className="rounded-lg border border-gray-300 px-6 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Login
              </Link>
            </div>
          )}
        </section>

        {/* Stats Preview Cards */}
        <section className="px-6 py-10 max-w-6xl mx-auto w-full">
          <h2 className="text-base font-semibold text-gray-700 mb-5">Everything you need to run your business</h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {/* Card 1 */}
            <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-blue-600">Total Products</p>
                  <p className="mt-1 text-2xl font-bold text-gray-900">—</p>
                </div>
                <div className="rounded-lg bg-blue-50 p-2">
                  <svg className="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10" />
                  </svg>
                </div>
              </div>
              <p className="mt-3 text-xs text-blue-600 font-medium">View all products →</p>
            </div>

            {/* Card 2 */}
            <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-green-600">Total Categories</p>
                  <p className="mt-1 text-2xl font-bold text-gray-900">—</p>
                </div>
                <div className="rounded-lg bg-green-50 p-2">
                  <svg className="w-5 h-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
              </div>
              <p className="mt-3 text-xs text-green-600 font-medium">View all categories →</p>
            </div>

            {/* Card 3 */}
            <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-yellow-600">Low Stock Items</p>
                  <p className="mt-1 text-2xl font-bold text-gray-900">—</p>
                </div>
                <div className="rounded-lg bg-yellow-50 p-2">
                  <svg className="w-5 h-5 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
                  </svg>
                </div>
              </div>
              <p className="mt-3 text-xs text-yellow-600 font-medium">View low stock →</p>
            </div>

            {/* Card 4 */}
            <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-purple-600">Inventory Value</p>
                  <p className="mt-1 text-2xl font-bold text-gray-900">—</p>
                </div>
                <div className="rounded-lg bg-purple-50 p-2">
                  <svg className="w-5 h-5 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
              <p className="mt-3 text-xs text-purple-600 font-medium">View report →</p>
            </div>
          </div>
        </section>

        {/* Feature Highlights */}
        <section className="px-6 pb-16 max-w-6xl mx-auto w-full">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
              <div className="mb-3 inline-flex rounded-lg bg-blue-50 p-2">
                <svg className="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <h3 className="text-sm font-semibold text-gray-900">Product Management</h3>
              <p className="mt-1 text-sm text-gray-500">Add, edit, and organise your products with SKUs, categories, and pricing.</p>
            </div>

            <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
              <div className="mb-3 inline-flex rounded-lg bg-green-50 p-2">
                <svg className="w-5 h-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-sm font-semibold text-gray-900">Sales Reports</h3>
              <p className="mt-1 text-sm text-gray-500">Get clear insights on revenue, orders, and inventory value at a glance.</p>
            </div>

            <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
              <div className="mb-3 inline-flex rounded-lg bg-yellow-50 p-2">
                <svg className="w-5 h-5 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
              </div>
              <h3 className="text-sm font-semibold text-gray-900">Low Stock Alerts</h3>
              <p className="mt-1 text-sm text-gray-500">Get notified automatically when products fall below your stock threshold.</p>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-200 bg-white px-6 py-4 text-center text-xs text-gray-400">
        © {new Date().getFullYear()} Inventory Manager. All rights reserved.
      </footer>
    </div>
  );
};

export default Home;