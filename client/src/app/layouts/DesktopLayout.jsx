import { Outlet } from "react-router-dom";

import DesktopSidebar from "../../components/navbar/DesktopNavbar";
function DesktopLayout() {
  return (
    <div className="min-h-screen bg-[#0b0b0b] text-white">
      <div className="flex min-h-screen">
        {/* Left Sidebar */}
        <DesktopSidebar />

        {/* Main Content */}
        <main className="flex-1 flex justify-center px-8 py-6">
          <div className="w-full max-w-3xl">
            <Outlet />
          </div>
        </main>

        {/* Right Sidebar */}
        <aside className="hidden xl:block w-80 border-l border-gray-800 bg-[#111111]">
          <div className="sticky top-0 p-6">{/* Right sidebar content */}</div>
        </aside>
      </div>
    </div>
  );
}

export default DesktopLayout;
