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

        // backend response ke hisab se adjust karna
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
      <main className="flex min-h-screen items-center justify-center bg-slate-950 text-white">
        <p className="text-slate-400">Checking authentication...</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <section className="mx-auto flex min-h-screen max-w-7xl flex-col items-center justify-center px-6 text-center">
        <div className="mb-6 rounded-full border border-slate-700 bg-slate-900 px-4 py-2 text-sm text-slate-300">
          Smart Inventory Management System
        </div>

        <h1 className="max-w-4xl text-4xl font-bold tracking-tight md:text-6xl">
          Manage your stock, billing and business inventory in one place.
        </h1>

        <p className="mt-6 max-w-2xl text-lg text-slate-400">
          Track products, monitor stock levels, manage sales, and reduce manual
          billing errors with a clean and simple inventory dashboard.
        </p>

        {user ? (
          <div className="mt-8">
            <p className="mb-4 text-slate-300">
              Welcome back, <span className="font-semibold">{user.name}</span>
            </p>

            <Link
              to="/dashboard"
              className="rounded-xl bg-blue-600 px-6 py-3 font-medium text-white hover:bg-blue-700"
            >
              Go to Dashboard
            </Link>
          </div>
        ) : (
          <div className="mt-8 flex flex-col gap-4 sm:flex-row">
            <Link
              to="/register"
              className="rounded-xl bg-blue-600 px-6 py-3 font-medium text-white hover:bg-blue-700"
            >
              Get Started
            </Link>

            <Link
              to="/login"
              className="rounded-xl border border-slate-700 px-6 py-3 font-medium text-slate-200 hover:bg-slate-900"
            >
              Login
            </Link>
          </div>
        )}
      </section>
    </main>
  );
};

export default Home;