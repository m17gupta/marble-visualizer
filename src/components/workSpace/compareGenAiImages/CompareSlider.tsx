import React, { useState, useRef, useEffect } from 'react';
import { IoArrowBack } from "react-icons/io5";
import { FaDownload, FaExpand, FaCompress } from "react-icons/fa";
import { MdClose } from "react-icons/md";
import { RootState } from '@/redux/store';
import { useSelector } from 'react-redux';

interface CompareSliderProps {
    // beforeImage?: string;
    // afterImage?: string;
    onClose?: () => void;
}

const CompareSlider: React.FC<CompareSliderProps> = ({
    // beforeImage,
    // afterImage,
    onClose
}) => {

    

    const [sliderPosition, setSliderPosition] = useState(50);
    const [isDragging, setIsDragging] = useState(false);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [beforeImageLoaded, setBeforeImageLoaded] = useState(false);
    const [afterImageLoaded, setAfterImageLoaded] = useState(false);
    const [imageError, setImageError] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);
   const[beforeImage, setBeforeImage] = useState<string>('');
   const[afterImage, setAfterImage] = useState<string>('');
    const { generatedImage, originalHouseImage } = useSelector((    state: RootState) => state.genAi);
    const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSliderPosition(Number(e.target.value));
    };

    const handleMouseDown = () => {
        setIsDragging(true);
    };

    const handleMouseUp = () => {
        setIsDragging(false);
    };

    useEffect(() => {
         if(generatedImage!=="" && originalHouseImage !=="") {
            setBeforeImage(originalHouseImage);
            setAfterImage(generatedImage);
            // setBeforeImageLoaded(true);
            // setAfterImageLoaded(true);
            // setImageError(false);
        }
    }, [generatedImage, originalHouseImage]);

    const handleMouseMove = (e: React.MouseEvent) => {
        if (isDragging && containerRef.current) {
            const rect = containerRef.current.getBoundingClientRect();
            const x = ((e.clientX - rect.left) / rect.width) * 100;
            setSliderPosition(Math.min(Math.max(x, 0), 100));
        }
    };

    const toggleFullscreen = () => {
        if (!document.fullscreenElement) {
            containerRef.current?.requestFullscreen();
            setIsFullscreen(true);
        } else {
            document.exitFullscreen();
            setIsFullscreen(false);
        }
    };

    // Handle touch events for mobile
    const handleTouchStart = () => {
        setIsDragging(true);
    };

    const handleTouchEnd = () => {
        setIsDragging(false);
    };

    const handleTouchMove = (e: React.TouchEvent) => {
        if (isDragging && containerRef.current) {
            const rect = containerRef.current.getBoundingClientRect();
            const touch = e.touches[0];
            const x = ((touch.clientX - rect.left) / rect.width) * 100;
            setSliderPosition(Math.min(Math.max(x, 0), 100));
        }
    };

    useEffect(() => {
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
        if (generatedImage) {
            const link = document.createElement('a');
            link.href = generatedImage;
            link.download = 'renovated-home.jpg';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    };

    return (
        <div className="relative w-full h-full bg-gray-100 rounded-lg overflow-hidden">
            {/* Top toolbar */}
            <div className="absolute top-0 left-0 right-0 z-10 flex justify-between items-center p-3 bg-gradient-to-b from-black/50 to-transparent">
                <div className="flex items-center">
                    <button
                        onClick={onClose}
                        className="text-white rounded-full bg-black/50  p-2 hover:bg-black/80"
                    >
                        <IoArrowBack size={16} />
                    </button>
                </div>
                {/* <div className="text-white font-medium">Side by Side 1</div> */}
                <div className="flex gap-2">
                    <button
                        onClick={handleDownload}
                        className="text-white rounded-full bg-black/50  p-2 hover:bg-black/80"
                    >
                        <FaDownload size={16} />
                    </button>
                    <button
                        onClick={toggleFullscreen}
                        className="text-white rounded-full bg-black/50  p-2 hover:bg-black/80"
                    >
                        {isFullscreen ? <FaCompress size={16} /> : <FaExpand size={16} />}
                    </button>
                    <button
                        onClick={onClose}
                        className="text-white rounded-full bg-black/50  p-2 hover:bg-black/80"
                    >
                        <MdClose size={16} />
                    </button>
                </div>
            </div>

            {/* Slider container */}
            <div
                ref={containerRef}
                className="relative w-full h-full overflow-hidden"
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
                onTouchCancel={handleTouchEnd}
            >
                {/* Loading indicator */}
                {/* {(!beforeImageLoaded || !afterImageLoaded)  && (
                    <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
                    </div>
                )} */}

                {/* Error message
                {imageError && (
                    <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
                        <div className="text-center p-4">
                            <p className="text-red-500 mb-2">Failed to load images</p>
                            <button
                                onClick={() => window.location.reload()}
                                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                            >
                                Retry
                            </button>
                        </div>
                    </div>
                )} */}

                {/* Before image (original house) */}
                <img
                    src={afterImage}
                    alt="Original House"
                    className="absolute top-0 left-0 w-full h-full object-cover"
                     onLoad={() => setBeforeImageLoaded(true)}
                    // onError={() => setImageError(true)}
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
                        // onError={() => setImageError(true)}
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
                    onChange={handleSliderChange}
                    className="absolute opacity-0 w-full"
                    style={{ height: '100%' }}
                />

                {/* Labels for before and after */}
                <div className="absolute bottom-16 left-4 bg-black/60 px-3 py-1 rounded-full text-white text-sm font-medium">
                    Original
                </div>
                <div className="absolute bottom-16 right-4 bg-black/60 px-3 py-1 rounded-full text-white text-sm font-medium">
                    Renovated
                </div>


                {/* Watermark button */}
                {/* <button
                    className="absolute left-1/2 bottom-6 transform -translate-x-1/2 px-4 py-2 bg-yellow-400 hover:bg-yellow-500 text-black font-medium rounded flex items-center gap-2 shadow-md"
                >
                    <span className="text-lg">👑</span> Remove Watermark
                </button> */}
            </div>
        </div>
    );
};

export default CompareSlider;
