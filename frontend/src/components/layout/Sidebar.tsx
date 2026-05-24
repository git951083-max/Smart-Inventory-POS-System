import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  BarChart3,
  Settings,
  LogOut,
} from "lucide-react";
import {logoutUser} from  "../../service/auth.service";
import { NavLink, useNavigate } from "react-router-dom";

const menuItems = [
  {
    title: "Dashboard",
    icon: LayoutDashboard,
    path: "/dashboard",
    end: true,
  },
  {
    title: "Products",
    icon: Package,
    path: "/dashboard/products",
  },
  {
    title: "Orders",
    icon: ShoppingCart,
    path: "/dashboard/orders",
  },
  {
    title: "Sales",
    icon: ShoppingCart,
    path: "/dashboard/sales",
  },
  {
    title: "Customers",
    icon: Users,
    path: "/dashboard/customers",
  },
  {
    title: "Reports",
    icon: BarChart3,
    path: "/dashboard/reports",
  },
  {
    title: "Settings",
    icon: Settings,
    path: "/dashboard/settings",
  },
];

const Sidebar = () => {
  const navigateTo = useNavigate();
  const handleLogout = async () => {
  try {
    await logoutUser(); // API call

    // clear local storage (important)
    localStorage.removeItem("token"); 
    localStorage.removeItem("user");

    navigateTo("/login");
  } catch (error) {
    console.error("Logout failed:", error);
  }
};
  return (
    <aside className="group/sidebar flex min-h-screen w-16 flex-col border-r border-gray-200 bg-white text-gray-700 transition-all duration-300 ease-in-out hover:w-64">
      {/* Logo */}
      <div className="flex h-[73px] items-center gap-3 overflow-hidden border-b border-gray-200 px-[14px]">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-600">
          <Package size={20} className="text-white" />
        </div>
        <h1 className="w-0 overflow-hidden whitespace-nowrap text-lg font-bold tracking-tight text-gray-900 opacity-0 transition-all duration-300 ease-in-out group-hover/sidebar:w-auto group-hover/sidebar:opacity-100">
          Inventory Management
        </h1>
      </div>

      {/* Menu */}
      <nav className="flex-1 space-y-0.5 overflow-hidden px-2 py-4">
        {menuItems.map((item) => {
          const Icon = item.icon;

          return (
            <NavLink
              key={item.title}
              to={item.path}
              end={item.end}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-150 ${
                  isActive
                    ? "bg-blue-700 text-white"
                    : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                }`
              }
            >
              <Icon size={18} className="shrink-0" />
              <span className="w-0 overflow-hidden whitespace-nowrap opacity-0 transition-all duration-300 ease-in-out group-hover/sidebar:w-auto group-hover/sidebar:opacity-100">
                {item.title}
              </span>
            </NavLink>
          );
        })}
      </nav>

      {/* Bottom */}
      <div className="border-t border-gray-200 p-2">
        <button 
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-gray-600 transition-all duration-150 hover:bg-red-50 hover:text-red-600"
          onClick={handleLogout}
        >
          <LogOut size={18} className="shrink-0" />
          <span className="w-0 overflow-hidden whitespace-nowrap opacity-0 transition-all duration-300 ease-in-out group-hover/sidebar:w-auto group-hover/sidebar:opacity-100">
            Logout
          </span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;