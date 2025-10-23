import { ChevronDown, X } from "lucide-react";

interface Brand {
  id: string | number;
  name: string;
  logo?: string;
  description?: string;
}

interface BasicInputProps {
  productdata: {
    name: string;
    description: string;
    brand_id?: string | number | null;
  };
  selectedBrand: any;
  brandSearchTerm: any;
  showBrandDropdown: any;
  filteredBrands: any;
  handleInputChangeInProductDetails: any;
  handleBrandSearchChange: (value: string) => void;
  handleBrandSelect: any;
  setShowBrandDropdown: (value: boolean) => void;
  setSelectedBrand: any;
  setProductData: any;
  setBrandSearchTerm: (value: string) => void;
}

export const BasicInput: React.FC<BasicInputProps> = ({
  productdata,
  selectedBrand,
  brandSearchTerm,
  showBrandDropdown,
  filteredBrands,
  handleInputChangeInProductDetails,
  handleBrandSearchChange,
  handleBrandSelect,
  setShowBrandDropdown,
  setSelectedBrand,
  setProductData,
  setBrandSearchTerm,
}) => {
  return (
    <div className="bg-white shadow-lg rounded-xl border border-gray-200 overflow-hidden">
      {/* Compact Header */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-6 py-3 border-b border-gray-200">
        <h2 className="text-lg font-bold text-gray-900">Basic Information</h2>
        <p className="text-xs text-gray-600">
          Enter the fundamental details of your product
        </p>
      </div>

      {/* Compact Body */}
      <div className="px-6 py-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Product Name */}
          <div className="space-y-1">
            <label className="block text-xs font-semibold text-gray-700">
              Product Name *
            </label>
            <input
              type="text"
              name="name"
              value={productdata.name}
              placeholder="Enter product name"
              className="w-full border border-gray-300 px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white shadow-sm text-sm"
              onChange={handleInputChangeInProductDetails}
            />
          </div>

          {/* Brand Selection */}
          <div className="space-y-1">
            <label className="block text-xs font-semibold text-gray-700">
              Brand *
            </label>
            <div className="relative">
              <div className="relative">
                <input
                  type="text"
                  value={selectedBrand ? selectedBrand.name : brandSearchTerm}
                  onChange={(e) => handleBrandSearchChange(e.target.value)}
                  onFocus={() => setShowBrandDropdown(true)}
                  className="w-full border border-gray-300 px-3 py-2 pr-8 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white shadow-sm text-sm"
                  placeholder="Search and select brand"
                />
                <button
                  type="button"
                  onClick={() => setShowBrandDropdown(!showBrandDropdown)}
                  className="absolute inset-y-0 right-0 flex items-center pr-2 bg-transparent hover:bg-gray-50 rounded-r-lg transition-colors"
                >
                  <ChevronDown className="h-4 w-4 text-gray-400" />
                </button>
              </div>

              {/* Compact Dropdown */}
              {showBrandDropdown && (
                <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-xl max-h-48 overflow-auto">
                  {filteredBrands.length > 0 ? (
                    <div className="py-1">
                      {filteredBrands.map((brandItem: any) => (
                        <button
                          key={brandItem.id}
                          type="button"
                          onClick={() => handleBrandSelect(brandItem)}
                          className={`w-full text-left px-3 py-2 hover:bg-blue-50 focus:bg-blue-50 focus:outline-none flex items-center justify-between transition-colors text-sm ${
                            selectedBrand?.id === brandItem.id
                              ? "bg-blue-50 text-blue-700 border-l-4 border-blue-500"
                              : ""
                          }`}
                        >
                          <div className="flex items-center space-x-2">
                            {brandItem.logo && (
                              <img
                                src={brandItem.logo}
                                alt={brandItem.name}
                                className="w-6 h-6 rounded-full object-cover"
                              />
                            )}
                            <div>
                              <div className="font-medium text-gray-900 text-sm">
                                {brandItem.name}
                              </div>
                              <div className="text-xs text-gray-500">
                                {brandItem.description}
                              </div>
                            </div>
                          </div>
                          {selectedBrand?.id === brandItem.id && (
                            <span className="text-blue-600 font-bold text-sm">
                              ✓
                            </span>
                          )}
                        </button>
                      ))}
                    </div>
                  ) : (
                    <div className="px-3 py-2 text-gray-500 text-xs">
                      No brands found matching your search
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Compact Selected Brand Display */}
            {selectedBrand && (
              <div className="mt-2">
                <div className="inline-flex items-center px-2 py-1 rounded-lg bg-gradient-to-r from-blue-100 to-blue-200 text-blue-800 font-medium shadow-sm text-xs">
                  {selectedBrand.logo && (
                    <img
                      src={selectedBrand.logo}
                      alt={selectedBrand.name}
                      className="w-4 h-4 rounded-full object-cover mr-1"
                    />
                  )}
                  <span>{selectedBrand.name}</span>
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedBrand(null);
                      setProductData((prev: any) => ({
                        ...prev,
                        brand_id: null,
                      }));
                      setBrandSearchTerm("");
                    }}
                    className="ml-1 inline-flex items-center justify-center w-4 h-4 rounded-full hover:bg-blue-300 focus:outline-none transition-colors"
                  >
                    <X className="h-2 w-2" />
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Description */}
          <div className="space-y-1">
            <label className="block text-xs font-semibold text-gray-700">
              Description
            </label>
            <textarea
              name="description"
              placeholder="Enter product description"
              rows={2}
              value={productdata.description}
              className="w-full border border-gray-300 px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white shadow-sm resize-none text-sm"
              onChange={handleInputChangeInProductDetails}
            />
          </div>
        </div>
      </div>
    </div>
  );
};




// // export const BasicInput = () => {
// //   return (
// //     <div className="bg-white shadow-xl rounded-2xl border border-gray-200 overflow-hidden">
// //       <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-8 py-6 border-b border-gray-200">
// //         <h2 className="text-xl font-bold text-gray-900">Basic Information</h2>
// //         <p className="text-sm text-gray-600 mt-1">
// //           Enter the fundamental details of your product
// //         </p>
// //       </div>
// //       <div className="px-8 py-8">
// //         <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
// //           <div className="space-y-2">
// //             <label className="block text-sm font-semibold text-gray-700">
// //               Product Name *
// //             </label>
// //             <input
// //               type="text"
// //               name="name"
// //               value={productdata.name}
// //               placeholder="Enter product name"
// //               className="w-full border border-gray-300 px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white shadow-sm"
// //               onChange={handleInputChangeInProductDetails}
// //             />
// //           </div>

// //           {/* Updated Brand Selection with Search */}
// //           <div className="space-y-2">
// //             <label className="block text-sm font-semibold text-gray-700">
// //               Brand *
// //             </label>
// //             <div className="relative">
// //               <div className="relative">
// //                 <input
// //                   type="text"
// //                   value={selectedBrand ? selectedBrand.name : brandSearchTerm}
// //                   onChange={(e) => handleBrandSearchChange(e.target.value)}
// //                   onFocus={() => setShowBrandDropdown(true)}
// //                   className="w-full border border-gray-300 px-4 py-3 pr-12 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white shadow-sm"
// //                   placeholder="Search and select brand"
// //                 />
// //                 <button
// //                   type="button"
// //                   onClick={() => setShowBrandDropdown(!showBrandDropdown)}
// //                   className="absolute inset-y-0 right-0 flex items-center pr-4 bg-transparent hover:bg-gray-50 rounded-r-lg transition-colors"
// //                 >
// //                   <ChevronDown className="h-5 w-5 text-gray-400" />
// //                 </button>
// //               </div>

// //               {showBrandDropdown && (
// //                 <div className="absolute z-10 w-full mt-2 bg-white border border-gray-200 rounded-lg shadow-xl max-h-60 overflow-auto">
// //                   {filteredBrands.length > 0 ? (
// //                     <div className="py-2">
// //                       {filteredBrands.map((brandItem) => (
// //                         <button
// //                           key={brandItem.id}
// //                           type="button"
// //                           onClick={() => handleBrandSelect(brandItem)}
// //                           className={`w-full text-left px-4 py-3 hover:bg-blue-50 focus:bg-blue-50 focus:outline-none flex items-center justify-between transition-colors ${
// //                             selectedBrand?.id === brandItem.id
// //                               ? "bg-blue-50 text-blue-700 border-l-4 border-blue-500"
// //                               : ""
// //                           }`}
// //                         >
// //                           <div className="flex items-center space-x-3">
// //                             {brandItem.logo && (
// //                               <img
// //                                 src={brandItem.logo}
// //                                 alt={brandItem.name}
// //                                 className="w-8 h-8 rounded-full object-cover"
// //                               />
// //                             )}
// //                             <div>
// //                               <div className="font-medium text-gray-900">
// //                                 {brandItem.name}
// //                               </div>
// //                               <div className="text-sm text-gray-500">
// //                                 {brandItem.description}
// //                               </div>
// //                             </div>
// //                           </div>
// //                           {selectedBrand?.id === brandItem.id && (
// //                             <span className="text-blue-600 font-bold">✓</span>
// //                           )}
// //                         </button>
// //                       ))}
// //                     </div>
// //                   ) : (
// //                     <div className="px-4 py-3 text-gray-500 text-sm">
// //                       No brands found matching your search
// //                     </div>
// //                   )}
// //                 </div>
// //               )}
// //             </div>

// //             {/* Selected Brand Display */}
// //             {selectedBrand && (
// //               <div className="mt-3">
// //                 <div className="inline-flex items-center px-3 py-2 rounded-lg bg-gradient-to-r from-blue-100 to-blue-200 text-blue-800 font-medium shadow-sm">
// //                   {selectedBrand.logo && (
// //                     <img
// //                       src={selectedBrand.logo}
// //                       alt={selectedBrand.name}
// //                       className="w-6 h-6 rounded-full object-cover mr-2"
// //                     />
// //                   )}
// //                   <span>{selectedBrand.name}</span>
// //                   <button
// //                     type="button"
// //                     onClick={() => {
// //                       setSelectedBrand(null);
// //                       setProductData((prev) => ({
// //                         ...prev,
// //                         brand_id: null,
// //                       }));
// //                       setBrandSearchTerm("");
// //                     }}
// //                     className="ml-2 inline-flex items-center justify-center w-5 h-5 rounded-full hover:bg-blue-300 focus:outline-none transition-colors"
// //                   >
// //                     <X className="h-3 w-3" />
// //                   </button>
// //                 </div>
// //               </div>
// //             )}
// //           </div>

// //           <div className="space-y-2">
// //             <label className="block text-sm font-semibold text-gray-700">
// //               Description
// //             </label>
// //             <textarea
// //               name="description"
// //               placeholder="Enter product description"
// //               rows={3}
// //               value={productdata.description}
// //               className="w-full border border-gray-300 px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white shadow-sm resize-none"
// //               onChange={handleInputChangeInProductDetails}
// //             />
// //           </div>
// //         </div>
// //       </div>
// //     </div>
// //   );
// // };

// import { ChevronDown, X } from "lucide-react";

// interface Brand {
//   id: string | number;
//   name: string;
//   logo?: string;
//   description?: string;
// }

// interface BasicInputProps {
//   productdata: {
//     name: string;
//     description: string;
//     brand_id?: string | number | null;
//   };
//   selectedBrand: any;
//   brandSearchTerm: any;
//   showBrandDropdown: any;
//   filteredBrands: any;
//   handleInputChangeInProductDetails: any;
//   handleBrandSearchChange: (value: string) => void;
//   handleBrandSelect: any;
//   setShowBrandDropdown: (value: boolean) => void;
//   setSelectedBrand: any;
//   setProductData: any;
//   setBrandSearchTerm: (value: string) => void;
// }

// export const BasicInput: React.FC<BasicInputProps> = ({
//   productdata,
//   selectedBrand,
//   brandSearchTerm,
//   showBrandDropdown,
//   filteredBrands,
//   handleInputChangeInProductDetails,
//   handleBrandSearchChange,
//   handleBrandSelect,
//   setShowBrandDropdown,
//   setSelectedBrand,
//   setProductData,
//   setBrandSearchTerm,
// }) => {
//   return (
//     <div className="bg-white shadow-xl rounded-2xl border border-gray-200 overflow-hidden">
//       {/* Header */}
//       <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-8 py-6 border-b border-gray-200">
//         <h2 className="text-xl font-bold text-gray-900">Basic Information</h2>
//         <p className="text-sm text-gray-600 mt-1">
//           Enter the fundamental details of your product
//         </p>
//       </div>

//       {/* Body */}
//       <div className="px-8 py-8">
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
//           {/* Product Name */}
//           <div className="space-y-2">
//             <label className="block text-sm font-semibold text-gray-700">
//               Product Name *
//             </label>
//             <input
//               type="text"
//               name="name"
//               value={productdata.name}
//               placeholder="Enter product name"
//               className="w-full border border-gray-300 px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white shadow-sm"
//               onChange={handleInputChangeInProductDetails}
//             />
//           </div>

//           {/* Brand Selection */}
//           <div className="space-y-2">
//             <label className="block text-sm font-semibold text-gray-700">
//               Brand *
//             </label>
//             <div className="relative">
//               <div className="relative">
//                 <input
//                   type="text"
//                   value={selectedBrand ? selectedBrand.name : brandSearchTerm}
//                   onChange={(e) => handleBrandSearchChange(e.target.value)}
//                   onFocus={() => setShowBrandDropdown(true)}
//                   className="w-full border border-gray-300 px-4 py-3 pr-12 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white shadow-sm"
//                   placeholder="Search and select brand"
//                 />
//                 <button
//                   type="button"
//                   onClick={() => setShowBrandDropdown(!showBrandDropdown)}
//                   className="absolute inset-y-0 right-0 flex items-center pr-4 bg-transparent hover:bg-gray-50 rounded-r-lg transition-colors"
//                 >
//                   <ChevronDown className="h-5 w-5 text-gray-400" />
//                 </button>
//               </div>

//               {/* Dropdown */}
//               {showBrandDropdown && (
//                 <div className="absolute w-full mt-2 bg-white border border-gray-200 rounded-lg shadow-xl max-h-60 overflow-auto">
//                   {filteredBrands.length > 0 ? (
//                     <div className="py-2">
//                       {filteredBrands.map((brandItem: any) => (
//                         <button
//                           key={brandItem.id}
//                           type="button"
//                           onClick={() => handleBrandSelect(brandItem)}
//                           className={`w-full text-left px-4 py-3 hover:bg-blue-50 focus:bg-blue-50 focus:outline-none flex items-center justify-between transition-colors ${
//                             selectedBrand?.id === brandItem.id
//                               ? "bg-blue-50 text-blue-700 border-l-4 border-blue-500"
//                               : ""
//                           }`}
//                         >
//                           <div className="flex items-center space-x-3">
//                             {brandItem.logo && (
//                               <img
//                                 src={brandItem.logo}
//                                 alt={brandItem.name}
//                                 className="w-8 h-8 rounded-full object-cover"
//                               />
//                             )}
//                             <div>
//                               <div className="font-medium text-gray-900">
//                                 {brandItem.name}
//                               </div>
//                               <div className="text-sm text-gray-500">
//                                 {brandItem.description}
//                               </div>
//                             </div>
//                           </div>
//                           {selectedBrand?.id === brandItem.id && (
//                             <span className="text-blue-600 font-bold">✓</span>
//                           )}
//                         </button>
//                       ))}
//                     </div>
//                   ) : (
//                     <div className="px-4 py-3 text-gray-500 text-sm">
//                       No brands found matching your search
//                     </div>
//                   )}
//                 </div>
//               )}
//             </div>

//             {/* Selected Brand Display */}
//             {selectedBrand && (
//               <div className="mt-3">
//                 <div className="inline-flex items-center px-3 py-2 rounded-lg bg-gradient-to-r from-blue-100 to-blue-200 text-blue-800 font-medium shadow-sm">
//                   {selectedBrand.logo && (
//                     <img
//                       src={selectedBrand.logo}
//                       alt={selectedBrand.name}
//                       className="w-6 h-6 rounded-full object-cover mr-2"
//                     />
//                   )}
//                   <span>{selectedBrand.name}</span>
//                   <button
//                     type="button"
//                     onClick={() => {
//                       setSelectedBrand(null);
//                       setProductData((prev: any) => ({
//                         ...prev,
//                         brand_id: null,
//                       }));
//                       setBrandSearchTerm("");
//                     }}
//                     className="ml-2 inline-flex items-center justify-center w-5 h-5 rounded-full hover:bg-blue-300 focus:outline-none transition-colors"
//                   >
//                     <X className="h-3 w-3" />
//                   </button>
//                 </div>
//               </div>
//             )}
//           </div>

//           {/* Description */}
//           <div className="space-y-2 md:col-span-2">
//             <label className="block text-sm font-semibold text-gray-700">
//               Description
//             </label>
//             <textarea
//               name="description"
//               placeholder="Enter product description"
//               rows={3}
//               value={productdata.description}
//               className="w-full border border-gray-300 px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white shadow-sm resize-none"
//               onChange={handleInputChangeInProductDetails}
//             />
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };



