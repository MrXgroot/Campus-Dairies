import { Star, Settings, LogOut } from "lucide-react";
import { useState, useRef, useEffect } from "react";
// Hamburger Menu Component
const HamburgerMenu = ({ handleLogout }) => {
  const [showHamburgerMenu, setShowHamburgerMenu] = useState(false);
  const [openMenu, setOpenMenu] = useState(null);

  const menuRef = useRef(null);

  // Close menus when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setOpenMenu(null);
      }
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowHamburgerMenu(false);
      }
    };

    if (openMenu || showHamburgerMenu) {
      document.addEventListener("mousedown", handleClickOutside);
      return () =>
        document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [openMenu, showHamburgerMenu]);

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setShowHamburgerMenu(!showHamburgerMenu)}
        className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
        aria-label="Menu"
      >
        <Settings
          size={20}
          className={`text-gray-900 dark:text-white ${
            showHamburgerMenu ? "rotate-[-90deg]" : "rotate-0"
          } transition-all duration-300 ease-in-out`}
        />
      </button>
      {showHamburgerMenu && (
        <div className="absolute right-0 top-full mt-1 bg-white dark:bg-gray-900 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 min-w-[160px] z-50">
          <div className="py-1">
            <button
              onClick={() => {
                setShowFeedbackModal(true);
                setShowHamburgerMenu(false);
              }}
              className="w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-gray-50 dark:hover:bg-gray-800 text-left text-gray-900 dark:text-white"
            >
              <Star size={16} />
              <span>Feedback</span>
            </button>
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-gray-50 dark:hover:bg-gray-800 text-left"
            >
              <LogOut size={16} />
              <span>Logout</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default HamburgerMenu;
