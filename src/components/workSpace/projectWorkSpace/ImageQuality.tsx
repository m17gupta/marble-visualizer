import { Slider } from '@/components/ui/slider';
import React from 'react'

const ImageQuality = () => {
      const ramExpansions = ["Low", "Medium", "High"];
  return (
   <div className="bg-white p-4 rounded-xl border  space-y-3">

<h3 className="font-semibold text-lg">2. Renovation Spectrum</h3>
  <p className="text-sm text-gray-600">
    The Renovation Spectrum is a range of renovation levels that you can choose from. Each level represents how much you want to change and renovate your space.
  </p>


  <div className="relative w-full pt-4">


   <div className="w-full max-w-sm">
      <Slider defaultValue={[1]} max={2} step={1} className='bg-purple-500 '/>
     <div className="mt-2 -mx-1.5 flex items-center justify-between text-gray-900 text-sm px-2">

        {ramExpansions.map((expansion) => (
          <span key={expansion}>{expansion}</span>
        ))}
      </div>
    </div>

    {/* <div className="h-2 rounded-full bg-gradient-to-r from-purple-600 to-purple-200 w-full"></div>


    <div className="absolute left-1/3 top-1/2 -translate-y-1/2 -translate-x-1/2">
      <div className="w-6 h-6 rounded-full border-4 border-white bg-purple-500 shadow-md"></div>
    </div> */}
  </div>


  
</div>

  )
}

export default ImageQuality
