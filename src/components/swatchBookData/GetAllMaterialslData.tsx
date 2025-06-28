// import { useEffect } from 'react'
// import { AppDispatch } from '@/redux/store'

// import { useDispatch } from 'react-redux'
// import { fetchMaterials } from '@/redux/slices/materialsSlice'

// const GetAllMaterials = () => {

//     const dispatch = useDispatch<AppDispatch>()
    
//     useEffect(() => {
//       // Fetch all materials when the component mounts
//       const fetchAllMaterials = async () => {
//         try {
//           // Call the fetchMaterials thunk
//           const response = await dispatch(fetchMaterials());
//           if(fetchMaterials.fulfilled.match(response)) {
//             console.log('Materials fetched successfully:', response.payload);
//           }
//         } catch (error) {
//           console.error('Error fetching materials:', error);
//         }
//       }
      
//       fetchAllMaterials();
//     }, [dispatch])
//   return (
//     null
//   ) 
// }

// export default GetAllMaterials