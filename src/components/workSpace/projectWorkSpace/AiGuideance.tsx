import React from 'react'
import { IoIosCloseCircleOutline } from "react-icons/io";
const AiGuideance = () => {
  return (
      <div className="bg-white border border-gray-50 p-4 rounded-md shadow-md mb-4">
        <div className="flex items-center justify-between mb-4 border-b border-gray-200 pb-2">
          <h4 className="text-lg font-semibold mb-2">Suggested Next Steps</h4>
          <span>
            <IoIosCloseCircleOutline className="text-3xl" />
          </span>
        </div>

        <div className="grid gap-2">
          <div className="border rounded-md flex align-middle justify-between p-2 gap-4 hover:bg-gray-50">
            <div>
              <h6 className="font-semibold">Floating Shelves</h6>
              <p className="text-sm text-gray-600">
                Install floating shelves above the sink area to display
                decorative items and plants, adding both style and storage.
              </p>
            </div>

            <button className="border border-gray-100 hover:bg-blue-100 hover:text-black">
              Apply
            </button>
          </div>
          <div className="border rounded-md flex align-middle justify-between p-2 gap-4 hover:bg-gray-50">
            <div>
              <h6 className="font-semibold">Floating Shelves</h6>
              <p className="text-sm text-gray-600">
                Install floating shelves above the sink area to display
                decorative items and plants, adding both style and storage.
              </p>
            </div>

            <button className="border border-gray-100 hover:bg-blue-100 hover:text-black">
              Apply
            </button>
          </div>

          <div className="border rounded-md flex align-middle justify-between p-2 gap-4 hover:bg-gray-50">
            <div>
              <h6 className="font-semibold">Floating Shelves</h6>
              <p className="text-sm text-gray-600">
                Install floating shelves above the sink area to display
                decorative items and plants, adding both style and storage.
              </p>
            </div>

            <button className="border border-gray-100 hover:bg-blue-100 hover:text-black">
              Apply
            </button>
          </div>
        </div>
      </div>
  )
}

export default AiGuideance
