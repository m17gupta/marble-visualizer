import React, { useEffect, useState } from "react";

const ProcessImage = () => {
    const messages = [
    "Brewing pixels to perfection… almost ready!",
    "Great things take time. Your stunning image is almost here!",
    "Just a splash of creativity left—hang tight!",
    "Good images come to those who wait—yours is nearly done!"
  ];
    const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
  
  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentMessageIndex((prevIndex) => (prevIndex + 1) % messages.length);
    }, 6000); // Change message every 6 seconds

    return () => clearInterval(intervalId); // Clean up on unmount
  }, []);
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
          {messages[currentMessageIndex]}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProcessImage;
