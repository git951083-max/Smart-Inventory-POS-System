import { Bell, Search, UserCircle2, ChevronDown, Menu } from "lucide-react";

import { useAuth } from "../../context/AuthContext";

const Navbar = () => {
  const { user } = useAuth();

  return (
    <header className="flex h-16 items-center justify-between border-b border-gray-200 bg-white px-6 text-gray-800">
      {/* Left — hamburger + page title */}
      <div className="flex items-center gap-4">
      
      </div>

      {/* Right */}
      <div className="flex items-center gap-3">
        {/* Notification bell */}
        <button className="relative rounded-lg p-2 text-gray-500 transition hover:bg-gray-100">
          <Bell size={20} />
          <span className="absolute right-1.5 top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[9px] font-bold text-white">
            3
          </span>
        </button>

        {/* Divider */}
        <div className="h-8 w-px bg-gray-200" />

        {/* User */}
        <div className="flex cursor-pointer items-center gap-2.5 rounded-lg px-2 py-1.5 transition hover:bg-gray-100">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-200 text-gray-600">
            <UserCircle2 size={28} className="text-gray-400" />
          </div>

          <div className="hidden sm:block">
            <p className="text-sm font-semibold leading-tight text-gray-900">
              {user?.name || "Admin"}
            </p>
          </div>

          <ChevronDown size={15} className="text-gray-400" />
        </div>
      </div>
    </header>
  );
};

export default Navbar;