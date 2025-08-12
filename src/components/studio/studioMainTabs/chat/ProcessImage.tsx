import React from "react";

const ProcessImage = () => {
  return (
    <div className="w-full h-full flex items-center justify-end">
      <div className="w-64 mt-4 mb-1 grid justify-end">
        <div
          role="status"
          aria-live="polite"
          className="rounded-xl border border-gray-300 bg-white p-4 shadow-sm"
        >
          {/* Heading with shimmer */}
          <div className="text-sm font-semibold text-shimmer">
            Processing image
          </div>

          {/* Subtext with shimmer */}
          <div className="mt-1 text-sm text-shimmer">
            Great things take time. Your stunning image is almost here!
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProcessImage;
