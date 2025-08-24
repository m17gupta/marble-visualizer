import { cn } from "@/lib/utils"
import { Slider } from "@/components/ui/slider"

type SliderProps = React.ComponentProps<typeof Slider>

export function CanvasSizeSlider({ className, ...props }: SliderProps) {
  return (
    <div>
      <label className="block mb-2 text-sm font-medium text-gray-700">Change the canvas Size</label>
      <Slider
        defaultValue={[1100]}
        max={2000}
        min={100}
        step={100}
        className={cn("w-[100%]", className)}
        {...props}
      />
      <div className="flex justify-between text-xs text-gray-500 mt-1">
        <span>100</span>
        <span>2000</span>
      </div>
    </div>
  )
}
