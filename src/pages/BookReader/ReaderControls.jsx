import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const ReaderControls = ({ page, totalPages, onPrev, onNext }) => {
  return (
    <>
      <button
        onClick={onPrev}
        className="fixed text-5xl left-4 top-1/2 -translate-y-1/2 z-10 p-3 rounded-full text-gray-500 dark:text-white dark:hover:bg-white/20 hover:bg-gray-600 hover:text-gray-200"
        title="Trang trước"
      >
        <ChevronLeft size={32} />
      </button>
      <button
        onClick={onNext}
        className="fixed right-4 text-5xl top-1/2 -translate-y-1/2 z-10 p-3 rounded-full text-gray-500 dark:text-white dark:hover:bg-white/20 hover:bg-gray-600 hover:text-gray-200"
        title="Trang sau"
      >
        <ChevronRight size={32} />
      </button>
      <div className="fixed bottom-2 inset-x-0 text-center text-black dark:text-gray-200  z-10">
        {totalPages ? `${page}/${totalPages}` : ""}
      </div>
    </>
  );
};

export default React.memo(ReaderControls);
