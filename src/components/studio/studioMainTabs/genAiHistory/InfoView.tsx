
import React from 'react'

const InfoView = () => {
     
  return (
    <>
     <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Model</span>
                    <span className="font-medium text-gray-800">v2.1</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Resolution</span>
                    <span className="font-medium text-gray-800">
                      1920 × 1080
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Credits Used</span>
                    <span className="font-medium text-gray-800">1</span>
                  </div>
                </div>
    </>
   
  )
}

export default InfoView