
import { fetchDoorMaterials, fetchRoofMaterials, fetchTrimMaterials, fetchWallMaterials, fetchWindowMaterials } from '@/redux/slices/materialSlices/materialsSlice';
import { AppDispatch, RootState } from '@/redux/store';
import { useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'sonner';

const MaterialData = () => {
    const dispatch = useDispatch<AppDispatch>();
    const { wallMaterials, doorMaterials, roofMaterials, windowMaterials, trimMaterials } = useSelector((state: RootState) => state.materials);
    const isWall = useRef(true);
    const isDoor = useRef(true);
    const isRoof = useRef(true);
    const isWindow = useRef(true);
    const isTrim = useRef(true);
    useEffect(() => {

        if (!wallMaterials || wallMaterials.length === 0 && isWall.current) {
            isWall.current = false; // Set the flag to true after the first fetch
            getFetchWallMMaterials()
        }

        if (!doorMaterials || doorMaterials.length === 0 && isDoor.current) {
            isDoor.current = false; // Set the flag to true after the first fetch
            getFetchDoorMaterials()
        }
        if (!roofMaterials || roofMaterials.length === 0 && isRoof.current) {
            isRoof.current = false; // Set the flag to true after the first fetch
            getFetchRoofMaterials()
        }
        if (!windowMaterials || windowMaterials.length === 0 && isWindow.current) {
           isWindow.current = false; // Set the flag to true after the first fetch
            getFetchWindowMaterials()
        }
            if (!trimMaterials || trimMaterials.length === 0 && isTrim.current) {
                isTrim.current = false; // Set the flag to true after the first fetch
            getFetchTrimMaterials()
        }
    }, [wallMaterials, doorMaterials, roofMaterials, windowMaterials, trimMaterials]);

    const getFetchWallMMaterials = async () => {
        try {
           await dispatch(fetchWallMaterials({ page: 0, limit: 30 })).unwrap();
           
        } catch (error) {
            toast.error('Error fetching wall materials');

            console.error('Error fetching wall materials:', error);
        }
    }
    const getFetchDoorMaterials = async () => {
        try {
             await dispatch(fetchDoorMaterials({ page: 0, limit: 30 })).unwrap();
            
        } catch (error) {
            toast.error('Error fetching door materials');

          
        }
    }

    const getFetchRoofMaterials = async () => {
        try {
          await dispatch(fetchRoofMaterials({ page: 0, limit: 30 })).unwrap();
            
        } catch (error) {
            toast.error('Error fetching roof materials');

            console.error('Error fetching roof materials:', error);
        }
    }

    const getFetchWindowMaterials = async () => {
        try {
            await dispatch(fetchWindowMaterials({ page: 0, limit: 30 })).unwrap();
            
        } catch (error) {
            toast.error('Error fetching window materials');

            console.error('Error fetching window materials:', error);
        }
    }


    const getFetchTrimMaterials = async () => {
        try {
           await dispatch(fetchTrimMaterials({ page: 0, limit: 30 })).unwrap();
          
        } catch (error) {
            toast.error('Error fetching trim materials');

        }
    }   


    return (
        null
    )
}

export default MaterialData