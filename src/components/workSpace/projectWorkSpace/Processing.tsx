// import React from "react";

// // Pass your image as a prop or import it directly
// // For demo: supply the image URL below
// import dzinlylogo from "../../../../public/assets/image/dzinly-logo.svg";
// const CUBE_FACE_IMAGE = "/your-logo-image.jpg"; // Change to actual path!

// export default function IsProcessing({
//   message = "Processing your request..."
// }) {
//   return (
//     <div className="flex flex-col items-center justify-center min-h-40 w-full py-10">
//       <div className="cube-container">
//         <div className="cube">
//           {[...Array(6)].map((_, i) => (
//             <div key={i} className={`cube-face cube-face-${i + 1}`}>
//               <img
//                 className="w-44 text-center"
//                 src={dzinlylogo}
//                 alt="dzinly logo"
//               ></img>
//             </div>
//           ))}
//         </div>
//       </div>
//       <div className="mt-8 text-base sm:text-lg font-medium text-gray-900 dark:text-gray-100 text-center w-full">
//         {message}
//         <span
//           aria-hidden="true"
//           className="ml-1 typing-dots text-indigo-500 dark:text-cyan-400"
//         />
//       </div>
//       {/* Core CSS for cube and animation */}
//       <style>{`
//         .cube-container {
//           perspective: 700px;
//           width: 120px;
//           height: 120px;
//           display: flex;
//           align-items: center;
//           justify-content: center;
//         }
//         .cube {
//           width: 100px;
//           height: 100px;
//           position: relative;
//           transform-style: preserve-3d;
//           animation: cube-spin 2.8s linear infinite;
//         }
//         .cube-face {
//           position: absolute;
//           width: 100px;
//           height: 100px;
//           background: #f7fafc;
//           border-radius: 12px;
//           box-shadow: 0 4px 32px 0 rgba(90,100,240,0.04);
//           display: flex;
//           align-items: center;
//           justify-content: center;
//           overflow: hidden;
//         }
//         /* Cube face positioning */
//         .cube-face-1 { transform: rotateY(0deg) translateZ(50px);}
//         .cube-face-2 { transform: rotateY(90deg) translateZ(50px);}
//         .cube-face-3 { transform: rotateY(180deg) translateZ(50px);}
//         .cube-face-4 { transform: rotateY(-90deg) translateZ(50px);}
//         .cube-face-5 { transform: rotateX(90deg) translateZ(50px);}
//         .cube-face-6 { transform: rotateX(-90deg) translateZ(50px);}
//         /* 3D cube animation */
//         @keyframes cube-spin {
//           0% { transform: rotateX(15deg) rotateY(0deg);}
//           100% { transform: rotateX(15deg) rotateY(360deg);}
//         }
//         /* Typing dots */
//         .typing-dots::after {
//           display: inline-block;
//           content: '';
//           width: 1.1em;
//           animation: dots 1.5s steps(3, end) infinite;
//         }
//         @keyframes dots {
//           0%, 20% { content: ''; }
//           40% { content: '.'; }
//           60% { content: '..'; }
//           80%, 100% { content: '...'; }
//         }
//         /* Dark mode overrides */
//         .dark .cube-face {
//           background: #232938;
//           box-shadow: 0 4px 38px 0 rgba(20,200,210,0.09);
//         }
//       `}</style>
//     </div>
//   );
// }
