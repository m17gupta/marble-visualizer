
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
            const materialsWall = await dispatch(fetchWallMaterials({ page: 0, limit: 30 })).unwrap();
            console.log('Fetched wall materials:', materialsWall);
        } catch (error) {
            toast.error('Error fetching wall materials');

            console.error('Error fetching wall materials:', error);
        }
    }
    const getFetchDoorMaterials = async () => {
        try {
            const materialsDoor = await dispatch(fetchDoorMaterials({ page: 0, limit: 30 })).unwrap();
            console.log('Fetched door materials:', materialsDoor);
        } catch (error) {
            toast.error('Error fetching door materials');

            console.error('Error fetching door materials:', error);
        }
    }

    const getFetchRoofMaterials = async () => {
        try {
            const materialsRoof = await dispatch(fetchRoofMaterials({ page: 0, limit: 30 })).unwrap();
            console.log('Fetched roof materials:', materialsRoof);
        } catch (error) {
            toast.error('Error fetching roof materials');

            console.error('Error fetching roof materials:', error);
        }
    }

    const getFetchWindowMaterials = async () => {
        try {
            const materialsWindow = await dispatch(fetchWindowMaterials({ page: 0, limit: 30 })).unwrap();
            console.log('Fetched window materials:', materialsWindow);
        } catch (error) {
            toast.error('Error fetching window materials');

            console.error('Error fetching window materials:', error);
        }
    }


    const getFetchTrimMaterials = async () => {
        try {
            const materialsTrim = await dispatch(fetchTrimMaterials({ page: 0, limit: 30 })).unwrap();
            console.log('Fetched trim materials:', materialsTrim);
        } catch (error:unknown) {
            toast.error('Error fetching trim materials');

        }
    }   


    return (
        null
    )
}

export default MaterialData