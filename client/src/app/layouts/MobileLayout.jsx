import { Outlet } from "react-router-dom";

import Navbar from "../../components/navbar/Navbar";

function MobileLayout() {
  return (
    <div className="min-h-screen bg-[#0f172a] text-white">
      {/* Mobile Navbar */}
      <Navbar />

      {/* Current Page */}
      <main>
        <Outlet />
      </main>
    </div>
  );
}

export default MobileLayout;
