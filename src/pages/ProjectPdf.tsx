// import React from "react";
// import bgimage from "../../public/assets/image/bg.jpg";
// import logofooter from "../../public/assets/image/logo.svg";

// const ProjectPdf = () => {
//   return (
//     <div className="bg-gray-900 py-10">

//       <div className="bg-white h-[842px] max-w-[794px] mx-auto px-6 py-8 space-y-12 shadow-xl">

//           <div className="text-center">
//             <img
//             src="https://betadzinly.s3.us-east-2.amazonaws.com/assets/images/logo-icon.svg"
//             alt="Logo"
//             className="w-16 mx-auto"
//           />
//           <h1 className="text-2xl font-bold text-gray-800">DESIGN REPORT</h1>
//           <h2 className="text-lg font-semibold text-gray-700">MY NEW PROJECT</h2>
//           <p className="text-sm text-gray-500">15 July 2025</p>
//           <img
//             src={bgimage}
//             alt="Hero Background"
//             className="w-full rounded border"
//           />
//           </div>
//         </div>

//       {/* CONTAINER */}
//       <div className="bg-white mt-12 max-w-[794px] mx-auto px-6 py-8 space-y-12 shadow-xl">
//         {/* HOUSE DETAILS */}
//         <div>
//           <img
//             src="https://s3.us-east-2.amazonaws.com/betadzinly/projects/115/styleGen/styled_output_22eaac99d4e9475aa52f435e33b02478.png"
//             alt="House"
//             className="w-full rounded border mb-6"
//           />
//           <div className="text-center text-xs text-gray-500 border p-3 mb-4">
//           <img src={logofooter} alt="Footer Logo" className="w-32 mx-auto mb-4" />
//           <p className="max-w-lg mx-auto">
//             "Products and colors may not be exactly as shown. This is due to a variance in monitor calibrations.
//             Please base your color selection on actual samples before making your final decision."
//           </p>
//         </div>

//           <div className="grid md:grid-cols-2 gap-6 text-sm text-gray-700">
//             <div className="flex gap-4">
//               <img
//                 src="https://dzinlyv2.s3.us-east-2.amazonaws.com/liv/materials/Craftsman_Light__Tan_OTgxNzQ1.jpg"
//                 alt="Door"
//                 className="w-28 h-32 object-cover border"
//               />

//               <div>
//                 <h3 className="font-bold mb-2">Door</h3>
//                 <p>
//                   Signet Single Entry Door in FrameSaver Frame<br />
//                   Door Operation to Be Determined – 420 Style<br />
//                   Signet Fir Fiberglass Door With Dentil Shelf ComforTech DC<br />
//                   All Hardware in Satin Nickel Finish<br />
//                   Georgian Lockset Key Order Alike<br />
//                   Thumbturn Deadbolt Key Order Alike<br />
//                   Frame: Bronze ZAC Auto-Adjusting Threshold<br />
//                   Satin Nickel Ball Bearing Hinges<br />
//                   Security Plate
//                 </p>
//               </div>
//             </div>
//             <div className="flex gap-4">
//               <img
//                 src="https://betadzinly.s3.us-east-2.amazonaws.com/material/window-img-1.png"
//                 alt="Window"
//                 className="w-28 h-32 object-cover border"
//               />
//               <div>
//                 <h3 className="font-bold mb-2">Windows</h3>
//                 <p>
//                   Endure Window - EN600 Series<br />
//                   Endure Deadlite Sash White<br />
//                   ComforTech DLA-UV 6mm Glass (1/4" per pane) (Tempered)<br />
//                   1 IG Thickness
//                 </p>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* MATERIAL SWATCHES */}
//         <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-sm">
//           {["Primary Siding", "Stone", "Roofing", "Trim Paint"].map((label, idx) => (
//             <div key={idx} className="border p-3 text-center bg-gray-50">
//               <img
//                 src="https://dzinlyv2.s3.us-east-2.amazonaws.com/liv/materials/Sierra_Premium_Shake_Charcoal_MjEyNDYz.jpg"
//                 className="w-full h-20 object-cover mb-2"
//                 alt={label}
//               />
//               <strong className="block font-semibold text-gray-800">{label}</strong>
//               {label === "Primary Siding" && <>CedarMAX T4" DL<br />Cream</>}
//               {label === "Stone" && <>Chisel Cut™<br />Brindle</>}
//               {label === "Roofing" && <>Metal Barrel Tile<br />Auburn</>}
//               {label === "Trim Paint" && <>Accent Colors<br />Alabaster</>}
//             </div>
//           ))}
//         </div>
//       </div>

//       {/* PAGE 2 */}
//       <div className="mt-12 bg-white max-w-[794px] mx-auto px-6 py-8 shadow-xl text-sm text-[#101828] font-sans">
//         <div className="border-b pb-4 flex justify-between items-center">
//           <img src="https://dzinly.in/img/logo.svg" alt="Logo" className="w-44" />
//           <a href="https://www.dzinly.org" className="text-blue-600 font-medium">Dzinly.org</a>
//         </div>

//         <div className="border-b py-6 flex justify-between">
//           <div>
//             <h2 className="text-2xl font-semibold mb-2">Project House</h2>
//             <p><strong>For:</strong> 90001, Los Angeles</p>
//             <p><strong>Including:</strong> Master Bedroom, Master Bathroom</p>
//             <p>03/08/2024 - 05:18am</p>
//             <p className="italic text-gray-500 mt-1">Using a general contractor</p>
//           </div>

//           <div className="w-80 bg-gray-50 border rounded-md p-4">
//             <div className="flex justify-between text-blue-700 font-semibold">
//               <span>Increase in home value</span>
//               <span className="text-2xl font-bold">$111,903</span>
//             </div>
//             <div className="mt-4 space-y-1 text-gray-800">
//               <div className="flex justify-between"><span>Homeowner selection budget</span><span>$23,949</span></div>
//               <div className="flex justify-between"><span>Total construction materials</span><span>$21,510</span></div>
//               <div className="flex justify-between"><span>Builder's labor & profit</span><span>$49,397</span></div>
//             </div>
//             <hr className="my-2" />
//             <div className="flex justify-between font-semibold">
//               <span>Total cost/investment</span>
//               <span>$94,856</span>
//             </div>
//             <div className="bg-blue-700 text-white mt-3 py-2 text-center rounded font-semibold">
//               Profit $17,047
//             </div>
//           </div>
//         </div>

//         {/* TABLE */}
//         <div className="mt-6">
//           <table className="w-full text-left border text-sm">
//             <thead className="bg-[#F8FAFC] text-[#101828]">
//               <tr>
//                 <th className="p-3 border">Your Project Summary</th>
//                 <th className="p-3 border text-center">Materials Costs</th>
//                 <th className="p-3 border text-center">Applications Costs</th>
//                 <th className="p-3 border text-center">Total Costs</th>
//               </tr>
//             </thead>
//             <tbody className="text-gray-800">
//               <tr className="border-t">
//                 <td className="p-3 border"><strong>Master Bedroom</strong><br />197 sq ft., selections for Floor, Lighting, Paint, Trim</td>
//                 <td className="p-3 border text-right">$1,255</td>
//                 <td className="p-3 border text-right">$6,774</td>
//                 <td className="p-3 border text-right">11,223</td>
//               </tr>
//               <tr className="border-t">
//                 <td className="p-3 border"><strong>Master Bathroom</strong><br />90 sq ft., selections for Cabinets, Counters, Lighting, etc.</td>
//                 <td className="p-3 border text-right">$1,048</td>
//                 <td className="p-3 border text-right">$18,064</td>
//                 <td className="p-3 border text-right">35,294</td>
//               </tr>
//               <tr className="border-t">
//                 <td className="p-3 border"><strong>Roofing</strong><br />Clay tile, metal, or concrete tiles</td>
//                 <td className="p-3 border text-right">$18,810</td>
//                 <td className="p-3 border text-right">$20,034</td>
//                 <td className="p-3 border text-right">38,844</td>
//               </tr>
//               <tr className="border-t">
//                 <td className="p-3 border"><strong>Flooring Replacement</strong><br />Hardwood, marble, tile</td>
//                 <td className="p-3 border text-right">$398</td>
//                 <td className="p-3 border text-right">$4,524</td>
//                 <td className="p-3 border text-right">9,496</td>
//               </tr>
//             </tbody>
//           </table>
//         </div>

//         <div className="pt-4 text-[11px] text-gray-500 leading-snug">
//           Total selection allowance is the cost of the items selected by the user...<br />
//           Builder’s Labor & Profit is the average fees that medium-size home contractors charge.
//         </div>

//         <div className="mt-4 px-6 py-2 border-t text-[11px] bg-blue-700 text-white flex justify-between">
//           <span>Copyright © 2025 Dzinly. All rights reserved.</span>
//           <span>15/07/2025 - 05:18am</span>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ProjectPdf;

import React from "react";
import bgimage from "../../public/assets/image/bg.jpg";
import logofooter from "../../public/assets/image/logo.svg";

const ProjectPdf = () => {
  return (
    <div className="bg-gray-900 py-10 text-[#101828] font-sans">
      {/* PAGE 1: Cover */}
      <div className="bg-white w-[794px] h-[1123px] mx-auto px-10 py-12 shadow-xl flex flex-col justify-center items-center text-center space-y-6">
        <img
          src="https://betadzinly.s3.us-east-2.amazonaws.com/assets/images/logo-icon.svg"
          alt="Logo"
          className="w-20 mb-0"
        />
        <h1 className="text-4xl font-extrabold text-gray-800 tracking-wider">
          DZINLY DESIGN REPORT
        </h1>
        <h2 className="text-xl font-medium text-gray-600">MY NEW PROJECT</h2>
        <p className="text-sm text-gray-400">15 July 2025</p>
        <div className="w-full mt-6 border rounded overflow-hidden">
          <img
            src="https://s3.us-east-2.amazonaws.com/betadzinly/projects/115/styleGen/styled_output_22eaac99d4e9475aa52f435e33b02478.png"
            alt="Hero Background"
            className="w-full h-[420px] object-cover"
          />
        </div>

        <div
          className="text-center text-xs  border p-3 mb-4 rounded-sm"
          style={{ width: "100%" }}>
         <h2 className="text-2xl font-semibold mb-2">Project Summary</h2>
          <p className="max-w-lg mx-auto text-gray-500 text-sm">
            "Products and colors may not be exactly as shown. This is due to a
            variance in monitor calibrations. Please base your color selection
            on actual samples before making your final decision."
          </p>
        </div>

        <div className="py-3"  style={{ width: "100%" }}>
          <h2 className="font-semibold text-lg text-start py-2">Segements</h2>
          <div>
            <div className="flex gap-3">
              <button className="px-4 py-1 rounded-2 text-sm bg-white border border-gray-300 text-gray-800 hover:bg-gray-50 flex gap-2">
                <img
                  className="w-4"
                  src="https://betadzinly.s3.us-east-2.amazonaws.com/assets/svg_icons/wall.svg"></img>
                <h5 className="font-semibold">Wall</h5>
              </button>

              <button className="px-4 py-1 rounded-2 text-sm bg-white border border-gray-300 text-gray-800 hover:bg-gray-50 flex gap-2">
                <img
                  className="w-4"
                  src="https://betadzinly.s3.us-east-2.amazonaws.com/assets/svg_icons/wall.svg"></img>
                <h5 className="font-semibold">Window</h5>
              </button>

              <button className="px-4 py-1 rounded-2 text-sm bg-white border border-gray-300 text-gray-800 hover:bg-gray-50 flex gap-2">
                <img
                  className="w-4"
                  src="https://betadzinly.s3.us-east-2.amazonaws.com/assets/svg_icons/wall.svg"></img>
                <h5 className="font-semibold">Garage</h5>
              </button>

              <button className="px-4 py-1 rounded-2 text-sm bg-white border border-gray-300 text-gray-800 hover:bg-gray-100 flex gap-2">
                <img
                  className="w-4"
                  src="https://betadzinly.s3.us-east-2.amazonaws.com/assets/svg_icons/wall.svg"></img>
                <h5 className="font-semibold">Roof</h5>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* PAGE 2: House Details */}
      <div className="bg-white w-[794px] h-[1123px] mx-auto mt-12 px-6 py-8 shadow-xl space-y-10 text-sm text-gray-700">
        <div>
          <div className="grid md:grid-cols-2 gap-6 mt-6">
            {/* Door */}
            <div className="flex gap-4">
              <img
                src="https://dzinlyv2.s3.us-east-2.amazonaws.com/liv/materials/Craftsman_Light__Tan_OTgxNzQ1.jpg"
                alt="Door"
                className="w-28 h-32 object-cover border"
              />
              <div>
                <h3 className="font-bold mb-2">Door</h3>
                <p>
                  Signet Single Entry Door in FrameSaver Frame
                  <br />
                  Door
                </p>
              </div>
            </div>

            {/* Windows */}
            <div className="flex gap-4">
              <img
                src="https://betadzinly.s3.us-east-2.amazonaws.com/material/window-img-1.png"
                alt="Window"
                className="w-28 h-32 object-cover border"
              />
              <div>
                <h3 className="font-bold mb-2">Windows</h3>
                <p>
                  Endure Window - EN600 Series
                  <br />
                  Endure Deadlite Sash White
                  <br />
                  ComforTech DLA-UV 6mm Glass (1/4" per pane) (Tempered)
                  <br />1 IG Thickness
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Material Swatches */}
        <div className="grid grid-cols-2 md:grid-cols-2 gap-6">
          {["Primary Siding", "Stone", "Roofing", "Trim Paint"].map(
            (label, idx) => (
              <div key={idx} className="border p-3 text-start bg-gray-50 flex gap-3 items-center">
                <img
                  src="https://dzinlyv2.s3.us-east-2.amazonaws.com/liv/materials/Sierra_Premium_Shake_Charcoal_MjEyNDYz.jpg"
                  className="w-24 h-24 object-cover mb-2"
                  alt={label}
                  
                />
              <div>
                <strong className="block font-semibold text-gray-800">
                  {label}
                </strong>

                {label === "Primary Siding" && (
                  <>
                    CedarMAX T4" DL
                    <br />
                    Cream
                  </>
                )}
                {label === "Stone" && (
                  <>
                    Chisel Cut™
                    <br />
                    Brindle
                  </>
                )}
                {label === "Roofing" && (
                  <>
                    Metal Barrel Tile
                    <br />
                    Auburn
                  </>
                )}
                {label === "Trim Paint" && (
                  <>
                    Accent Colors
                    <br />
                    Alabaster
                  </>
                )}
                </div>
              </div>
            )
          )}
        </div>
      </div>

      {/* PAGE 3: Summary */}
      <div className="bg-white w-[794px] h-[1123px] mx-auto mt-12 px-6 py-8 shadow-xl text-sm">
        <div className="border-b pb-4 flex justify-between items-center">
          <img
            src="https://dzinly.in/img/logo.svg"
            alt="Logo"
            className="w-44"
          />
          <a
            href="https://www.dzinly.org"
            className="text-blue-600 font-medium">
            Dzinly.org
          </a>
        </div>

        <div className="border-b py-6 flex justify-between">
          <div>
            <h2 className="text-2xl font-semibold mb-2">Project House</h2>
            <p>
              <strong>For:</strong> 90001, Los Angeles
            </p>
            <p>
              <strong>Including:</strong> Master Bedroom, Master Bathroom
            </p>
            <p>03/08/2024 - 05:18am</p>
            <p className="italic text-gray-500 mt-1">
              Using a general contractor
            </p>
          </div>

          <div className="w-80 bg-gray-50 border rounded-md p-4">
            <div className="flex justify-between text-blue-700 font-semibold">
              <span>Increase in home value</span>
              <span className="text-2xl font-bold">$111,903</span>
            </div>
            <div className="mt-4 space-y-1 text-gray-800">
              <div className="flex justify-between">
                <span>Homeowner selection budget</span>
                <span>$23,949</span>
              </div>
              <div className="flex justify-between">
                <span>Total construction materials</span>
                <span>$21,510</span>
              </div>
              <div className="flex justify-between">
                <span>Builder's labor & profit</span>
                <span>$49,397</span>
              </div>
            </div>
            <hr className="my-2" />
            <div className="flex justify-between font-semibold">
              <span>Total cost/investment</span>
              <span>$94,856</span>
            </div>
            <div className="bg-blue-700 text-white mt-3 py-2 text-center rounded font-semibold">
              Profit $17,047
            </div>
          </div>
        </div>

        <div className="mt-6">
          <table className="w-full text-left border text-sm">
            <thead className="bg-[#F8FAFC] text-[#101828]">
              <tr>
                <th className="p-3 border">Your Project Summary</th>
                <th className="p-3 border text-center">Materials Costs</th>
                <th className="p-3 border text-center">Applications Costs</th>
                <th className="p-3 border text-center">Total Costs</th>
              </tr>
            </thead>
            <tbody className="text-gray-800">
              <tr className="border-t">
                <td className="p-3 border">
                  <strong>Master Bedroom</strong>
                  <br />
                  197 sq ft., selections for Floor, Lighting, Paint, Trim
                </td>
                <td className="p-3 border text-right">$1,255</td>
                <td className="p-3 border text-right">$6,774</td>
                <td className="p-3 border text-right">$11,223</td>
              </tr>
              <tr className="border-t">
                <td className="p-3 border">
                  <strong>Master Bathroom</strong>
                  <br />
                  90 sq ft., selections for Cabinets, Counters, Lighting, etc.
                </td>
                <td className="p-3 border text-right">$1,048</td>
                <td className="p-3 border text-right">$18,064</td>
                <td className="p-3 border text-right">$35,294</td>
              </tr>
              <tr className="border-t">
                <td className="p-3 border">
                  <strong>Roofing</strong>
                  <br />
                  Clay tile, metal, or concrete tiles
                </td>
                <td className="p-3 border text-right">$18,810</td>
                <td className="p-3 border text-right">$20,034</td>
                <td className="p-3 border text-right">$38,844</td>
              </tr>
              <tr className="border-t">
                <td className="p-3 border">
                  <strong>Flooring Replacement</strong>
                  <br />
                  Hardwood, marble, tile
                </td>
                <td className="p-3 border text-right">$398</td>
                <td className="p-3 border text-right">$4,524</td>
                <td className="p-3 border text-right">$9,496</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="pt-4 text-[11px] text-gray-500 leading-snug">
          Total selection allowance is the cost of the items selected by the
          user...
          <br />
          Builder’s Labor & Profit is the average fees that medium-size home
          contractors charge.
        </div>

        <div className="mt-4 px-6 py-2 border-t text-[11px] bg-blue-700 text-white flex justify-between">
          <span>Copyright © 2025 Dzinly. All rights reserved.</span>
          <span>15/07/2025 - 05:18am</span>
        </div>
      </div>
    </div>
  );
};

export default ProjectPdf;
