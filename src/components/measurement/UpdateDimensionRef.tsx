// import { useEffect, useRef, useCallback } from 'react'
// import { useDispatch, useSelector } from 'react-redux';
// import { getMarkedDimension, resetMarkedDimension, updateIsUpdateArea } from '../../../../slice/tabControl/TabControlSlice';
// import { getUserJobData, updateDinstanceRef } from '../../../../slice/userJobSlice/UserJobSlice';
// import { updateDistanceRef } from '../../../../api/jobs/JobApi';
// import { DistanceRefModel } from '../../../../Model/markedDimension/MarkedDimensionModal';
// import { startRightLoading } from '../../../../slice/loading/LoadingSlice';
// import { addApiMessage } from '../../../../slice/messageToast/ToastSlice';

// const UpdateDimensionRef = () => {

//     const getMarkedDimensions = useSelector(getMarkedDimension);

//     const getUserJobDatas = useSelector(getUserJobData);
//     const isApiProcessing = useRef<boolean>(false);
//     const lastProcessedData = useRef<string>('');
//     const dispatch = useDispatch();

//     const updateDataDistanceRef = useCallback(async () => {
//         if (!getUserJobDatas?._id || !getMarkedDimensions || isApiProcessing.current) return;

//        dispatch(startRightLoading())
//         dispatch(addApiMessage(`Request to update reference distance for job`));

//         const distanceRef: DistanceRefModel = {
//             distance_pixel: getMarkedDimensions.distance_pixel,
//             distance_meter: getMarkedDimensions.distance_meter
//         };
        
//         try {
//             isApiProcessing.current = true;
//             const response = await updateDistanceRef(
//                 getUserJobDatas._id,
//                 distanceRef
//             );
//             console.log("Response from updateDistanceRef:", response);
//             if (response && response.status === 200) {
//                 dispatch(updateDinstanceRef({
//                     distance_pixel: getMarkedDimensions.distance_pixel,
//                     distance_meter: getMarkedDimensions.distance_meter
//                 }))
//                  dispatch(updateIsUpdateArea(true))
//                 dispatch(resetMarkedDimension()); // Reset the marked dimension state
//                 // Handle successful response
//             }
//         } catch (error) {
//             console.error("Error updating distance reference:", error);
//         } finally {
//             isApiProcessing.current = false;
//         }
//     }, [getUserJobDatas, getMarkedDimensions, dispatch]);

//     useEffect(() => {
//         const currentDataKey = `${getUserJobDatas?._id}-${getMarkedDimensions?.distance_pixel}-${getMarkedDimensions?.distance_meter}`;
        
//         if (
//             !isApiProcessing.current &&
//             getUserJobDatas &&
//             getUserJobDatas._id &&
//             getMarkedDimensions &&
//             getMarkedDimensions.distance_pixel &&
//             getMarkedDimensions.distance_meter &&
//             lastProcessedData.current !== currentDataKey
//         ) {
//             lastProcessedData.current = currentDataKey;
//             updateDataDistanceRef();
//         }

//     }, [getUserJobDatas, getMarkedDimensions, updateDataDistanceRef])


//     return (
//         null
//     )
// }




// export default UpdateDimensionRef