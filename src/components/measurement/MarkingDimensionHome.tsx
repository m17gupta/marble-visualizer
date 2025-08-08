import React, { useEffect } from 'react'
import DimensionRefModal from './DimensionRefModal'
import { AppDispatch, RootState } from '@/redux/store';
import { useDispatch, useSelector } from 'react-redux';
import { updateIsDistanceRef, updateJobDistanceRef } from '@/redux/slices/jobSlice';
import { setCanvasType } from '@/redux/slices/canvasSlice';
import { DistanceRefModal } from '@/models/jobModel/JobModel';
import { toast } from 'sonner';

const MarkingDimensionHome = () => {

    const { list: joblist, isMarkDistanceRef } = useSelector((state: RootState) => state.jobs);
    const dispatch = useDispatch<AppDispatch>();
    const [isOpenModal, setIsOpenModal] = React.useState(false);
    useEffect(() => {
        if (isMarkDistanceRef) {
            setIsOpenModal(true);
        } else {
            setIsOpenModal(false);
        }
    }, [isMarkDistanceRef]);

    const handleCloseModal = () => {
        dispatch(updateIsDistanceRef(false));
        setIsOpenModal(false);
    };

    const handleMark = () => {
        // Handle save logic here
        dispatch(updateIsDistanceRef(false));
        dispatch(setCanvasType("dimension"));
    }

    const handleSaveData = async (data: DistanceRefModal) => {
        // Handle save logic here
        console.log("Saved Data:", data);
        dispatch(updateIsDistanceRef(false));
        dispatch(setCanvasType("hover"));
        setIsOpenModal(false);
        if (!joblist || joblist.length === 0 || !data) return
        try {
            const response = await dispatch(updateJobDistanceRef({
                id: joblist[0].id ?? 0,
                distanceRef: data,
            })).unwrap();

           
            if (response.success) {
                toast.success("Reference distance updated successfully");
            }
        } catch (error) {
            toast.error("Error saving reference distance");
            console.error("Error saving data:", error);
        }
    };

    return (
        <DimensionRefModal
            open={isOpenModal}
            onClose={handleCloseModal}
            onMark={handleMark}
            onSave={handleSaveData}
        />
    )
}

export default MarkingDimensionHome