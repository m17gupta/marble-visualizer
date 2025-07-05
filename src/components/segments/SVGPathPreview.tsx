import { useRef, useState, useMemo } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SVGPathPreviewProps {
  path: string;
  color: string;
  isVisible?: boolean;
}

export function SVGPathPreview({ path, color, isVisible = true }: SVGPathPreviewProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [viewBox, setViewBox] = useState<string>("0 0 100 100");

  // Calculate the bounding box of the path
  const calculateViewBox = () => {
    if (svgRef.current) {
      try {
        const pathElement = svgRef.current.querySelector('path');
        if (pathElement) {
          const bbox = pathElement.getBBox();
          // Add padding
          const padding = 5;
          setViewBox(`${bbox.x - padding} ${bbox.y - padding} ${bbox.width + padding * 2} ${bbox.height + padding * 2}`);
        }
      } catch (error) {
        console.error("Error calculating viewBox:", error);
      }
    }
  };

  // When the component mounts, calculate the viewBox
  useMemo(() => {
    // Use a setTimeout to ensure the SVG has rendered
    setTimeout(calculateViewBox, 0);
  }, []); // Empty dependency array as we only need to run this once on mount

  return (
    <div className={cn(
      "rounded p-1 w-full h-16 mt-1 relative",
      isVisible 
        ? "border border-green-200 bg-green-50/30" 
        : "border border-red-200 bg-red-50/20"
    )}>
      <svg 
        ref={svgRef} 
        viewBox={viewBox} 
        preserveAspectRatio="xMidYMid meet"
        className={cn("w-full h-full", !isVisible && "opacity-60")}
      >
        <path d={path} fill={color} stroke="black" strokeWidth="0.5" opacity="0.7" />
      </svg>
      {/* Visibility indicator */}
      <div className="absolute top-1 right-1">
        {isVisible ? (
          <div className="bg-green-500 text-white rounded-full p-0.5 shadow-sm">
            <Eye className="h-2.5 w-2.5" />
          </div>
        ) : (
          <div className="bg-red-400 text-white rounded-full p-0.5 shadow-sm">
            <EyeOff className="h-2.5 w-2.5" />
          </div>
        )}
      </div>
    </div>
  );
}
