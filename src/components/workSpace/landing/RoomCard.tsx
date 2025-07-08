import React, { useRef, useState, useEffect, useCallback } from 'react';

export interface RoomCardProps {
  room: {
    id: string;
    title: string;
    image: string; // Will be used as "after" image
    beforeImage?: string; 
    afterImage?: string; // New property for "after" image
    alt?: string;
  };
  onClick?: (roomId: string) => void;
}

const RoomCard: React.FC<RoomCardProps> = ({ room, onClick }) => {
   const containerRef = useRef<HTMLDivElement>(null);
  const [sliderPosition, setSliderPosition] = useState(50);
  const sliderRef = useRef<HTMLDivElement>(null);
  const beforeImage = room.beforeImage || room.image; // Fallback to the same image if no before image
  const afterImage = room.afterImage || room.image; // Fallback to the same image if no after image
   const [beforeImageLoaded, setBeforeImageLoaded] = useState(false);
    const [afterImageLoaded, setAfterImageLoaded] = useState(false);
  // Handle mouse movement over the slider area
  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!sliderRef.current) return;

    const rect = sliderRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(e.clientX - rect.left, rect.width));
    const percentage = Math.max(0, Math.min((x / rect.width) * 100, 100));

    setSliderPosition(percentage);
  }, []);

  // Handle document-wide mouse movement (when dragging)
  const handleMouseMoveDocument = useCallback((e: MouseEvent) => {
    if (!sliderRef.current) return;

    const rect = sliderRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(e.clientX - rect.left, rect.width));
    const percentage = Math.max(0, Math.min((x / rect.width) * 100, 100));

    setSliderPosition(percentage);
  }, []);

  // Handle mouse up (stop dragging)
  const handleMouseUp = useCallback(() => {
    document.removeEventListener('mousemove', handleMouseMoveDocument as unknown as EventListener);
    document.removeEventListener('mouseup', handleMouseUp);
  }, [handleMouseMoveDocument]);

  // Handle mouse down (start dragging)
  const handleMouseDown = useCallback(() => {
    document.addEventListener('mousemove', handleMouseMoveDocument as unknown as EventListener);
    document.addEventListener('mouseup', handleMouseUp);
  }, [handleMouseMoveDocument, handleMouseUp]);

  // Handle touch move
  const handleTouchMove = useCallback((e: TouchEvent) => {
    if (!sliderRef.current || !e.touches[0]) return;

    const touch = e.touches[0];
    const rect = sliderRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(touch.clientX - rect.left, rect.width));
    const percentage = Math.max(0, Math.min((x / rect.width) * 100, 100));

    setSliderPosition(percentage);

    // Prevent scrolling while dragging
    e.preventDefault();
  }, []);

  // Handle touch end
  const handleTouchEnd = useCallback(() => {
    document.removeEventListener('touchmove', handleTouchMove as unknown as EventListener);
    document.removeEventListener('touchend', handleTouchEnd);
  }, [handleTouchMove]);

  // Handle touch start
  const handleTouchStart = useCallback(() => {
    document.addEventListener('touchmove', handleTouchMove as unknown as EventListener);
    document.addEventListener('touchend', handleTouchEnd);
  }, [handleTouchMove, handleTouchEnd]);

  // Clean up event listeners on unmount
  useEffect(() => {
    return () => {
      document.removeEventListener('mousemove', handleMouseMoveDocument as unknown as EventListener);
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('touchmove', handleTouchMove as unknown as EventListener);
      document.removeEventListener('touchend', handleTouchEnd);
    };
  }, [handleMouseMoveDocument, handleMouseUp, handleTouchMove, handleTouchEnd]);

  return (
    <div
      className="relative flex-shrink-0 w-72 h-48 rounded-2xl overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105 cursor-pointer group"
      onClick={(e) => {
        // Only trigger onClick if we're not interacting with the slider
        if (!(e.target as HTMLElement).closest('.comparison-slider-handle')) {
          onClick?.(room.id);
        }
      }}
    >
    
      {/* Comparison Slider Container */}
      <div
        ref={sliderRef}
        className="absolute inset-0 overflow-hidden"
        onMouseMove={handleMouseMove}
      >
        {/* Before Image - Full width */}
        <div
          className="absolute inset-0 bg-cover bg-center w-full h-full"
          style={{ backgroundImage: `url(${beforeImage})` }}
        >
          {/* Before Label */}
          {/* <div className="absolute top-2 left-2 bg-black bg-opacity-50 text-white text-xs font-semibold py-1 px-2 rounded">
            Before
          </div> */}
        </div>

        {/* After Image - Clipped based on slider position */}
        <div
          className="absolute inset-0 bg-cover bg-center h-full"
          style={{
            backgroundImage: `url(${room.image})`,
            width: `${sliderPosition}%`,
            clipPath: `inset(0 0 0 0)`
          }}
        >
          {/* After Label */}
          {/* <div className="absolute top-2 left-2 bg-black bg-opacity-50 text-white text-xs font-semibold py-1 px-2 rounded">
            After
          </div> */}
        </div>

        {/* Slider Handle */}
        <div
          className="comparison-slider-handle absolute top-0 bottom-0 w-1 bg-white cursor-ew-resize select-none"
          style={{
            left: `${sliderPosition}%`,
            transform: 'translateX(-50%)'
          }}
          onMouseDown={handleMouseDown}
          onTouchStart={handleTouchStart}
        >
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-6 h-6 bg-white rounded-full flex items-center justify-center shadow-md">
            <div className="flex flex-col">
              <div className="w-1 h-1 bg-gray-500 mb-0.5"></div>
              <div className="w-1 h-1 bg-gray-500 mb-0.5"></div>
              <div className="w-1 h-1 bg-gray-500"></div>
            </div>
          </div>
        </div>
      </div>
      <div
        ref={containerRef}
        className="relative w-full h-full overflow-hidden"
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
       // onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onTouchCancel={handleTouchEnd}
      >
        {/* Status badge - shows if this is a comparison card */}
        
        
        {/* Title at the top */}
        <div className="absolute top-0 left-0 right-0 bg-gradient-to-b from-black/70 to-transparent p-3 z-20">
          <h3 className="text-white text-sm font-medium truncate">{room.title}</h3>
        
        </div>
        
        {/* Loading indicator */}
        {(!beforeImageLoaded || !afterImageLoaded)  && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          </div>
        )}

    

        {/* Before image (original house) */}
        <img
          src={afterImage}
          alt="Original House"
          className="absolute top-0 left-0 w-full h-full object-cover"
          onLoad={() => setBeforeImageLoaded(true)}
        //  onError={() => setImageError(true)}
        />

        {/* After image (renovated house) - controlled by slider */}
        <div
          className="absolute top-0 left-0 h-full overflow-hidden"
          style={{
            width: `${sliderPosition}%`,
          }}
        >
          <img
            src={beforeImage}
            alt="Renovated House"
            className="absolute top-0 left-0 w-full h-full object-cover"
            style={{
              width: `${100 / sliderPosition * 100}%`,
              maxWidth: 'none'
            }}
            onLoad={() => setAfterImageLoaded(true)}
            //onError={() => setImageError(true)}
          />
        </div>

        {/* Slider control */}
        <div
          className="absolute top-0 bottom-0 w-1 bg-white shadow-md cursor-ew-resize"
          style={{ left: `${sliderPosition}%` }}
          onMouseDown={handleMouseDown}
          onTouchStart={handleTouchStart}
        >
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-lg">
            <div className="w-1 h-6 bg-gray-400 rounded-full"></div>
          </div>
        </div>

        {/* Range input for slider (hidden visually but improves accessibility) */}
        <input
          type="range"
          min={0}
          max={100}
          value={sliderPosition}
        //  onChange={handleSliderChange}
          className="absolute opacity-0 w-full"
          style={{ height: '100%' }}
        />

        {/* Labels for before and after */}
        <div className="absolute top-16 left-4 bg-black/60 px-3 py-1 rounded-full text-white text-sm font-medium">
          Original
        </div>
        <div className="absolute top-16 right-4 bg-black/60 px-3 py-1 rounded-full text-white text-sm font-medium">
          Renovated
        </div>


       
      </div>

    </div>
  );
};

export default RoomCard;
