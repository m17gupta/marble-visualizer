// import React, { useEffect, useState } from "react";
// import StartMarkingDimension from "./StartMarkingDimension";
// import OldDimension from "./OldDimension";
// import { useSelector } from "react-redux";

// const MarkingDimensionHome = () => {
//   const [isDimensionStarted, setIsDimensionStarted] = useState(false);
//   const getSelectedSegments = useSelector(getSelectedSegment);

//   useEffect(() => {
//     if (
//       getSelectedSegments &&
//       getSelectedSegments.length > 0 &&
//       getSelectedSegments[0].details &&
//       getSelectedSegments[0].details.area !== undefined &&
//       getSelectedSegments[0].details.area !== null
//     ) {
//       setIsDimensionStarted(true);
//     } else {
//       setIsDimensionStarted(false);
//     }
//   }, [getSelectedSegments]);

//   return (
//     <>
//       {!isDimensionStarted ? (
//         <StartMarkingDimension />
//       ) : (
//         <OldDimension
//           restartDimensionRef={() => setIsDimensionStarted(false)}
//         />
//       )}
//     </>
//   );
// };

// export default MarkingDimensionHome;
