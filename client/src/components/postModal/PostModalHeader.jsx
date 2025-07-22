import React from "react";
import { ArrowLeft, X } from "lucide-react";

const PostModalHeader = ({
  step,
  setStep,
  handleNext,
  handleShare,
  resetAndClose,
}) => {
  return (
    <div className="flex justify-between items-center px-4 py-3 bg-white dark:bg-black border-b border-gray-200 dark:border-gray-800">
      <div className="flex items-center gap-3">
        {step > 1 && (
          <button
            onClick={() => setStep(step - 1)}
            className="p-1 hover:bg-gray-100 dark:hover:bg-gray-900 rounded-full transition-colors"
          >
            <ArrowLeft className="w-6 h-6 text-gray-900 dark:text-white" />
          </button>
        )}
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
          {step === 1 ? "New post" : step === 2 ? "New post" : "Share"}
        </h2>
      </div>

      <div className="flex items-center gap-2">
        {step === 2 && (
          <button
            onClick={handleNext}
            className="text-blue-500 font-semibold text-sm px-3 py-1 hover:text-blue-600 transition-colors"
          >
            Next
          </button>
        )}
        {step === 3 && (
          <button
            onClick={handleShare}
            className="text-blue-500 font-semibold text-sm px-3 py-1 hover:text-blue-600 transition-colors"
          >
            Share
          </button>
        )}
        <button
          onClick={resetAndClose}
          className="p-1 hover:bg-gray-100 dark:hover:bg-gray-900 rounded-full transition-colors"
        >
          <X className="w-6 h-6 text-gray-900 dark:text-white" />
        </button>
      </div>
    </div>
  );
};

export default PostModalHeader;
