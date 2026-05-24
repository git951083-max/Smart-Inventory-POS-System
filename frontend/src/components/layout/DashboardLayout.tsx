import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import { Outlet } from "react-router-dom";

const DashboardLayout = () => {
  return (
    <div style={{ display: "flex" }}>
      
      <Sidebar />

      <div style={{ flex: 1 }}>
        <Navbar />

        <div>
          <Outlet />   {/* 👈 YE MUST HAI */}
        </div>

      </div>
    </div>
  );
};

export default DashboardLayout;