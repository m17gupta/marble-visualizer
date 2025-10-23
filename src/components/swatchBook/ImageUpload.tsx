// import { Trash2, Upload } from "lucide-react";

// export const ImageUpload = ({
//   handleDrag,
//   handleDrop,
//   dragActive,
//   handleImageUpload,
//   productImages,
//   imagePreviewUrls,
//   removeImage,
// }: any) => {
//   return (
//     <div className="bg-white shadow-xl rounded-2xl border border-gray-200 overflow-hidden">
//       <div className="bg-gradient-to-r from-green-50 to-emerald-50 px-8 py-6 border-b border-gray-200">
//         <h2 className="text-xl font-bold text-gray-900">Product Images</h2>
//         <p className="text-sm text-gray-600 mt-1">
//           Upload up to 5 images for your product
//         </p>
//       </div>
//       <div className="px-8 py-8">
//         <div
//           className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-all duration-200 ${
//             dragActive
//               ? "border-blue-500 bg-blue-50"
//               : "border-gray-300 hover:border-gray-400 hover:bg-gray-50"
//           }`}
//           onDragEnter={handleDrag}
//           onDragLeave={handleDrag}
//           onDragOver={handleDrag}
//           onDrop={handleDrop}
//         >
//           <input
//             type="file"
//             multiple
//             accept="image/*"
//             onChange={(e) => handleImageUpload(e.target.files)}
//             className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
//             disabled={productImages.length >= 5}
//           />
//           <div className="space-y-4">
//             <div className="mx-auto w-16 h-16 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full flex items-center justify-center">
//               <Upload className="h-8 w-8 text-blue-600" />
//             </div>
//             <div>
//               <p className="text-lg font-semibold text-gray-700">
//                 {productImages.length >= 5
//                   ? "Maximum images reached"
//                   : "Drop images here or click to upload"}
//               </p>
//               <p className="text-sm text-gray-500 mt-1">
//                 PNG, JPG, GIF up to 10MB each ({productImages.length}/5)
//               </p>
//             </div>
//           </div>
//         </div>

//         {imagePreviewUrls.length > 0 && (
//           <div className="mt-8">
//             <h3 className="text-lg font-semibold text-gray-700 mb-4">
//               Uploaded Images
//             </h3>
//             <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
//               {imagePreviewUrls.map((url: string, index: number) => (
//                 <div key={index} className="relative group">
//                   <div className="aspect-square rounded-xl overflow-hidden border-2 border-gray-200 shadow-sm">
//                     <img
//                       src={url}
//                       alt={`Product ${index + 1}`}
//                       className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
//                     />
//                   </div>
//                   <button
//                     onClick={() => removeImage(index)}
//                     className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-2 shadow-lg hover:bg-red-600 transition-colors duration-200 opacity-0 group-hover:opacity-100"
//                   >
//                     <Trash2 className="h-4 w-4" />
//                   </button>
//                 </div>
//               ))}
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

import { Trash2, Upload } from "lucide-react";

export const ImageUpload = ({
  handleDrag,
  handleDrop,
  dragActive,
  handleImageUpload,
  productImages,
  imagePreviewUrls,
  removeImage,
}: any) => {
  return (
    <div className="bg-white shadow-lg rounded-xl border border-gray-200 overflow-hidden h-fit">
      <div className="bg-gradient-to-r from-green-50 to-emerald-50 px-6 py-3 border-b border-gray-200">
        <h2 className="text-lg font-bold text-gray-900">Product Images</h2>
        <p className="text-xs text-gray-600">Upload up to 5 images</p>
      </div>
      <div className="px-6 py-4">
        <div className="flex gap-3">
          {/* Compact Upload Area */}
          <div className="flex-shrink-0">
            <div
              className={`relative border-2 border-dashed rounded-lg p-3 text-center transition-all duration-200 w-20 h-20 ${
                dragActive
                  ? "border-blue-500 bg-blue-50"
                  : "border-gray-300 hover:border-gray-400 hover:bg-gray-50"
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={(e) => handleImageUpload(e.target.files)}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                disabled={productImages.length >= 5}
              />
              <div className="flex flex-col items-center justify-center h-full">
                <div className="w-6 h-6 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full flex items-center justify-center mb-1">
                  <Upload className="h-3 w-3 text-blue-600" />
                </div>
                <p className="text-xs font-semibold text-gray-700 leading-none">
                  {productImages.length >= 5 ? "Full" : "Upload"}
                </p>
                <p className="text-xs text-gray-500">
                  ({productImages.length}/5)
                </p>
              </div>
            </div>
          </div>

          {/* Compact Image Previews */}
          {imagePreviewUrls.length > 0 && (
            <div className="flex-1">
              <div className="flex gap-2 flex-wrap">
                {imagePreviewUrls.map((url: string, index: number) => (
                  <div key={index} className="relative group">
                    <div className="rounded-lg overflow-hidden border border-gray-200 shadow-sm w-16 h-16">
                      <img
                        src={url}
                        alt={`Product ${index + 1}`}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                      />
                    </div>
                    <button
                      onClick={() => removeImage(index)}
                      className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-0.5 shadow-lg hover:bg-red-600 transition-colors duration-200 opacity-0 group-hover:opacity-100"
                    >
                      <Trash2 className="h-2 w-2" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
