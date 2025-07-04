import React from 'react';
import { IoArrowBack } from "react-icons/io5";
import { FaDownload, FaExpand, FaCompress } from "react-icons/fa";
import { MdClose } from "react-icons/md";

interface SideBySideCompareProps {
  beforeImage?: string;
  afterImage?: string;
  onClose?: () => void;
}

const SideBySideCompare: React.FC<SideBySideCompareProps> = ({
  beforeImage,
  afterImage,
  onClose
}) => {
  const [isFullscreen, setIsFullscreen] = React.useState(false);
  const containerRef = React.useRef<HTMLDivElement>(null);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  React.useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);

  const handleDownload = () => {
    // Download the after image
    if (afterImage) {
      const link = document.createElement('a');
      link.href = afterImage;
      link.download = 'renovated-home.jpg';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <div 
      ref={containerRef}
      className="relative w-full h-full bg-gray-100 rounded-lg overflow-hidden"
    >
      {/* Top toolbar */}
      <div className="absolute top-0 left-0 right-0 z-10 flex justify-between items-center p-3 bg-gradient-to-b from-black/50 to-transparent">
        <div className="flex items-center">
          <button 
            onClick={onClose}
            className="text-white rounded-full p-1 hover:bg-black/20"
          >
            <IoArrowBack size={24} />
          </button>
        </div>
        <div className="text-white font-medium">Side by Side</div>
        <div className="flex gap-2">
          <button 
            onClick={handleDownload}
            className="text-white rounded-full p-1 hover:bg-black/20"
          >
            <FaDownload size={20} />
          </button>
          <button 
            onClick={toggleFullscreen}
            className="text-white rounded-full p-1 hover:bg-black/20"
          >
            {isFullscreen ? <FaCompress size={20} /> : <FaExpand size={20} />}
          </button>
          <button 
            onClick={onClose}
            className="text-white rounded-full p-1 hover:bg-black/20"
          >
            <MdClose size={24} />
          </button>
        </div>
      </div>

      {/* Side by side container */}
      <div className="flex h-full">
        {/* Before image (left side) */}
        <div className="flex-1 relative">
          <img 
            src={beforeImage} 
            alt="Original home" 
            className="w-full h-full object-cover"
          />
          <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/50 to-transparent">
            <p className="text-white text-center font-medium">Original</p>
          </div>
        </div>

        {/* After image (right side) */}
        <div className="flex-1 relative">
          <img 
            src={afterImage} 
            alt="Renovated home" 
            className="w-full h-full object-cover"
          />
          <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/50 to-transparent">
            <p className="text-white text-center font-medium">Renovated</p>
          </div>
        </div>
      </div>

      {/* Watermark button */}
      <button
        className="absolute left-1/2 bottom-6 transform -translate-x-1/2 px-4 py-2 bg-yellow-400 hover:bg-yellow-500 text-black font-medium rounded flex items-center gap-2 shadow-md"
      >
        <span className="text-lg">👑</span> Remove Watermark
      </button>
    </div>
  );
};

export default SideBySideCompare;
