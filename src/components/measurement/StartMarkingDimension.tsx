// import React, { useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import {
//   changeSegmentTab,
//   getIsFinishMarkDimension,
//   switchToOutline,
//   updateIsFinishMarkDimension,
//   updateIsMarkDimension,
//   updateMarkedDimensionScaleDimension,
// } from "../../../../slice/tabControl/TabControlSlice";

// const StartMarkingDimension = () => {
//   const dispatch = useDispatch();
//   const [lengthValue, setLengthValue] = useState<string>("6");
//   const [lengthUnit, setLengthUnit] = useState<string>("ft");
//   const [widthValue, setWidthValue] = useState<string>("8");
//   const [widthUnit, setWidthUnit] = useState<string>("in");
//   const [isMarkingSection, setIsMarkingSection] = useState<boolean>(false);
//   const getIsFinishMarkDimensions = useSelector(getIsFinishMarkDimension);
//   // update isMarkingSection based on getIsMarkSections

//   React.useEffect(() => {
//     if (getIsFinishMarkDimensions) {
//       setIsMarkingSection(getIsFinishMarkDimensions);
//     } else {
//       setIsMarkingSection(false);
//     }
//   }, [getIsFinishMarkDimensions]);

//   const handleTryAgain = () => {
//     setLengthValue("6");
//     setLengthUnit("ft");
//     setWidthValue("8");
//     setWidthUnit("in");
//   };

//   const convertToMeters = (value: string, unit: string): number => {
//     const numValue = parseFloat(value);
//     if (isNaN(numValue)) return 0;

//     switch (unit) {
//       case "ft":
//         return numValue * 0.3048; // 1 foot = 0.3048 meters
//       case "in":
//         return numValue * 0.0254; // 1 inch = 0.0254 meters
//       case "cm":
//         return numValue * 0.01; // 1 cm = 0.01 meters
//       case "m":
//         return numValue; // already in meters
//       default:
//         return numValue;
//     }
//   };

//   const handleContinue = () => {
//     const lengthInMeters = convertToMeters(lengthValue, lengthUnit);
//     const widthInMeters = convertToMeters(widthValue, widthUnit);
//     const totalDistanceInMeters = lengthInMeters + widthInMeters;
//     dispatch(
//       updateMarkedDimensionScaleDimension(
//         parseFloat(totalDistanceInMeters.toFixed(2))
//       )
//     );
//     console.log("Total distance in meters:", totalDistanceInMeters.toFixed(2));
//     setIsMarkingSection(false);
//     dispatch(updateIsMarkDimension(false));
//     dispatch(updateIsFinishMarkDimension(false));
//     dispatch(switchToOutline("segment"));
//     dispatch(changeSegmentTab("segment"));
//   };

//   const handleStartMarking = () => {
//     setIsMarkingSection(true);
//     dispatch(switchToOutline("markingDimension"));
//     dispatch(changeSegmentTab("markingDimension"));
//     // Add your start marking logic here
//   };
//   return (
//     <>
//       <div
//         className="p-4 w-100 dimention-box-content"
//         style={{ borderRadius: "6px", backgroundColor: "#fafafa" }}
//       >
//         <h5> Set Reference Dimension </h5>
//         <p>
//           Draw a reference line on a known dimension (like a door, window, or
//           wall) and enter its actual measurement to establish the project scale.
//         </p>
//         {isMarkingSection && (
//           <div className="mb-4">
//             <p>Set the Project Scale</p>
//             <p className="text-sm text-gray-600 mb-3">
//               Type the length of the line:
//             </p>

//             <div className="flex gap-2 mb-4 w-full max-w-xs">
//               {/* Feet Input */}
//               <div className="flex w-10">
//                 <input
//                   type="number"
//                   value={lengthValue}
//                   onChange={(e) => setLengthValue(e.target.value)}
//                   className="px-1 py-1 text-sm border border-r-0 border-gray-300 rounded-l focus:outline-none focus:ring-1 focus:ring-blue-400"
//                   placeholder="6"
//                   style={{ width: "90px" }}
//                 />
//                 <select
//                   value={lengthUnit}
//                   onChange={(e) => setLengthUnit(e.target.value)}
//                   className="w-1/3 px-1 py-1 text-sm border border-l-0 border-gray-300 rounded-r bg-gray-50 focus:outline-none focus:ring-1 focus:ring-blue-400"
//                 >
//                   <option value="ft">ft</option>
//                   <option value="in">in</option>
//                   <option value="m">m</option>
//                   <option value="cm">cm</option>
//                 </select>
//               </div>

//               {/* Inch Input */}
//               <div className="flex w-24">
//                 <input
//                   type="number"
//                   value={widthValue}
//                   onChange={(e) => setWidthValue(e.target.value)}
//                   className="w-2/3 px-1 py-1 text-sm border border-r-0 border-gray-300 rounded-l focus:outline-none focus:ring-1 focus:ring-blue-400"
//                   placeholder="8"
//                   style={{ width: "90px" }}
//                 />
//                 <select
//                   value={widthUnit}
//                   onChange={(e) => setWidthUnit(e.target.value)}
//                   className="w-1/3 px-1 py-1 text-sm border border-l-0 border-gray-300 rounded-r bg-gray-50 focus:outline-none focus:ring-1 focus:ring-blue-400"
//                 >
//                   <option value="in">in</option>
//                   <option value="ft">ft</option>
//                   <option value="m">m</option>
//                   <option value="cm">cm</option>
//                 </select>
//               </div>
//             </div>
//           </div>
//         )}

//         {isMarkingSection ? (
//           <>
//             <div className="d-flex gap-4 w-100">
//               <div className="mb-4 w-50">
//                 <button
//                   onClick={handleTryAgain}
//                   style={{
//                     width: "100%",
//                     padding: "8px 12px",
//                     fontSize: "14px",
//                     backgroundColor: "#3b82f6",
//                     color: "white",
//                     border: "none",
//                     borderRadius: "50px",
//                     cursor: "pointer",
//                     transition: "background-color 0.2s ease",
//                   }}
//                   onMouseEnter={(e) => {
//                     e.currentTarget.style.backgroundColor = "#2563eb";
//                   }}
//                   onMouseLeave={(e) => {
//                     e.currentTarget.style.backgroundColor = "#3b82f6";
//                   }}
//                 >
//                   Mark Again
//                 </button>
//               </div>

//               <div className="mb-4 w-50">
//                 <button
//                   onClick={handleContinue}
//                   style={{
//                     width: "100%",
//                     padding: "8px 12px",
//                     fontSize: "14px",
//                     backgroundColor: "#059669",
//                     color: "white",
//                     border: "none",
//                     borderRadius: "50px",
//                     cursor: "pointer",
//                     transition: "background-color 0.2s ease",
//                   }}
//                   onMouseEnter={(e) => {
//                     e.currentTarget.style.backgroundColor = "#047857";
//                   }}
//                   onMouseLeave={(e) => {
//                     e.currentTarget.style.backgroundColor = "#059669";
//                   }}
//                 >
//                   Continue
//                 </button>
//               </div>
//             </div>
//           </>
//         ) : (
//             <button
//               onClick={handleStartMarking}
//               style={{
//                 width: "100%",
//                 padding: "8px 12px",
//                 fontSize: "14px",
//                 backgroundColor: "#3b82f6",
//                 color: "white",
//                 border: "none",
//                 borderRadius: "50px",
//                 cursor: "pointer",
//                 transition: "background-color 0.2s ease",
//               }}
//               onMouseEnter={(e) => {
//                 e.currentTarget.style.backgroundColor = "#2563eb";
//               }}
//               onMouseLeave={(e) => {
//                 e.currentTarget.style.backgroundColor = "#3b82f6";
//               }}
//             >
//               Start Marking
//             </button>
       
//         )}
//       </div>
//     </>
//   );
// };

// export default StartMarkingDimension;
