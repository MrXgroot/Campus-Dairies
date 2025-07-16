import { Check } from "lucide-react";
import { motion } from "framer-motion";
import { Tooltip } from "react-tooltip";

const VerifiedBadge = () => {
  return (
    <div className="relative inline-flex items-center z-50 group">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="cursor-pointer"
        data-tooltip-id="verified-tooltip"
        data-tooltip-content="Premium Verified"
      >
        <div className="w-5 h-5 rounded-full bg-blue-500 flex items-center justify-center shadow-md border-2 border-white">
          <Check className="w-3 h-3 text-white" strokeWidth={3} />
        </div>
      </motion.div>

      <Tooltip
        id="verified-tooltip"
        place="top"
        className="bg-black text-white text-xs px-2 py-1 rounded shadow-lg z-50"
      />
    </div>
  );
};

export default VerifiedBadge;
