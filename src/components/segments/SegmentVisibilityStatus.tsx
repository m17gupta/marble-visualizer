import { Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface SegmentVisibilityStatusProps {
  isVisible: boolean;
  onToggle: () => void;
  className?: string;
  showLabel?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export function SegmentVisibilityStatus({ 
  isVisible, 
  onToggle, 
  className,
  showLabel = true,
  size = 'sm' 
}: SegmentVisibilityStatusProps) {
  const iconSize = size === 'sm' ? 'h-3 w-3' : size === 'md' ? 'h-4 w-4' : 'h-5 w-5';
  
  return (
    <Button
      variant={isVisible ? "default" : "outline"}
      size="sm"
      className={cn(
        "h-6 px-1.5 gap-1 text-[10px] font-medium",
        isVisible ? "bg-green-500/90 hover:bg-green-500 text-white" : "border-red-400 text-red-500",
        className
      )}
      onClick={onToggle}
    >
      {isVisible ? (
        <>
          <Eye className={iconSize} />
          {showLabel && <span>Visible</span>}
        </>
      ) : (
        <>
          <EyeOff className={iconSize} />
          {showLabel && <span>Hidden</span>}
        </>
      )}
    </Button>
  );
}
