// import { ArrowLeft, Save } from "lucide-react";
// import { useNavigate } from "react-router-dom";

// export const HeaderComp = ({ handleCancel, handleSubmit }: any) => {
//   const navigate = useNavigate();
//   return (
//     <div className="bg-white shadow-lg border-b border-gray-200">
//       <div className="max-w-7xl mx-auto px-6 lg:px-8">
//         <div className="flex items-center justify-between h-20">
//           <div className="flex items-center space-x-6">
//             <button
//               onClick={() => {
//                 navigate("/admin/materials");
//               }}
//               className="flex items-center text-gray-600 hover:text-gray-900 transition-colors duration-200 font-medium"
//             >
//               <ArrowLeft className="h-5 w-5 mr-3" />
//               Back to Products
//             </button>
//             <div className="h-8 border-l border-gray-300"></div>
//             <div>
//               <h1 className="text-2xl font-bold text-gray-900">
//                 Add New Product
//               </h1>
//               <p className="text-sm text-gray-500 mt-1">
//                 Create a new product with detailed attributes
//               </p>
//             </div>
//           </div>
//           <div className="flex space-x-4">
//             <button
//               type="button"
//               onClick={handleCancel}
//               className="px-6 py-3 text-sm font-medium text-gray-700 bg-white border-2 border-gray-300 rounded-lg hover:bg-gray-50 hover:border-gray-400 transition-all duration-200"
//             >
//               Cancel
//             </button>
//             <button
//               type="button"
//               onClick={handleSubmit}
//               className="px-6 py-3 text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-blue-700 border border-transparent rounded-lg hover:from-blue-700 hover:to-blue-800 flex items-center shadow-lg transition-all duration-200"
//             >
//               <Save className="h-4 w-4 mr-2" />
//               Save Product
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

import { ArrowLeft, Save } from "lucide-react";
import { useNavigate } from "react-router-dom";

export const HeaderComp = ({ handleCancel, handleSubmit }: any) => {
  const navigate = useNavigate();
  return (
    <div className="bg-white shadow-md border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between h-14">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => {
                navigate("/admin/materials");
              }}
              className="flex items-center text-gray-600 hover:text-gray-900 transition-colors duration-200 font-medium text-sm"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Products
            </button>
            <div className="h-6 border-l border-gray-300"></div>
            <div>
              <h1 className="text-lg font-bold text-gray-900">
                Add New Product
              </h1>
              <p className="text-xs text-gray-500">
                Create a new product with detailed attributes
              </p>
            </div>
          </div>
          <div className="flex space-x-3">
            <button
              type="button"
              onClick={handleCancel}
              className="px-4 py-2 text-xs font-medium text-gray-700 bg-white border-2 border-gray-300 rounded-lg hover:bg-gray-50 hover:border-gray-400 transition-all duration-200"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              className="px-4 py-2 text-xs font-medium text-white bg-gradient-to-r from-blue-600 to-blue-700 border border-transparent rounded-lg hover:from-blue-700 hover:to-blue-800 flex items-center shadow-lg transition-all duration-200"
            >
              <Save className="h-3 w-3 mr-1" />
              Save Product
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
