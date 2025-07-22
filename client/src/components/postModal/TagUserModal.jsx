import React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X, Search } from "lucide-react";

const TagUserModal = ({
  tagSearch,
  setTagSearch,
  setShowTagPopup,
  people,
  handleTagUser,
}) => {
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-black/80 flex items-end justify-center"
      >
        <motion.div
          initial={{ y: "100%" }}
          animate={{ y: 0 }}
          exit={{ y: "100%" }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="bg-white dark:bg-gray-900 w-full max-h-[85vh] rounded-t-xl overflow-hidden flex flex-col"
        >
          {/* Header + Search (Sticky Top) */}
          <div className="sticky top-0 z-10 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
            <div className="flex justify-between items-center px-4 py-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Tag people
              </h3>
              <button
                onClick={() => setShowTagPopup(false)}
                className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
              >
                <X className="w-6 h-6 text-gray-600 dark:text-gray-300" />
              </button>
            </div>

            {/* Search Input */}
            <div className="px-4 pb-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  value={tagSearch}
                  onChange={(e) => setTagSearch(e.target.value)}
                  placeholder="ex. mrXgroot"
                  className="w-full pl-10 pr-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 rounded-lg border-none outline-none"
                />
              </div>
            </div>
          </div>

          {/* Scrollable People List */}
          <div className="flex-1 overflow-y-auto max-h-[calc(85vh-120px)] min-h-[150px]">
            {/* Section Title */}
            {people.length > 0 && tagSearch === "" && (
              <div className="px-4 py-2 bg-gray-50 dark:bg-gray-800 sticky top-[110px] z-10">
                <h4 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                  Following
                </h4>
              </div>
            )}

            {/* List */}
            {people.map((person) => (
              <button
                key={person.username}
                onClick={() => handleTagUser(person)}
                className="flex items-center gap-3 w-full p-4 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors active:bg-gray-100 dark:active:bg-gray-700"
              >
                <div className="w-12 h-12 rounded-full overflow-hidden flex-shrink-0">
                  <img
                    referrerPolicy="no-referrer"
                    src={person.avatar || "/placeholder.svg"}
                    alt={person.username}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="text-left flex-1">
                  <div className="text-gray-900 dark:text-white font-medium text-sm">
                    {person.username}
                  </div>
                  <div className="text-gray-500 dark:text-gray-400 text-sm">
                    {person.name}
                  </div>
                </div>
              </button>
            ))}
            {people.length === 0 && tagSearch == "" && (
              <div className="p-8 text-center text-gray-500 dark:text-gray-400">
                Search you friends to tag
              </div>
            )}
            {/* No Results */}
            {people.length === 0 && tagSearch !== "" && (
              <div className="p-8 text-center text-gray-500 dark:text-gray-400">
                No results found for "{tagSearch}"
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default TagUserModal;
