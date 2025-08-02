import App from '@/App';
import { AppDispatch, RootState } from '@/redux/store';
import React from 'react';
import { useEffect, useRef } from 'react';

import { useDispatch, useSelector } from 'react-redux'
import Call_task_id from '../Call_task_id';
import { GenAiChat, TaskApiModel } from '@/models/genAiModel/GenAiModel';
import { insertGenAiChatData, resetRequest, setCurrentGenAiImage } from '@/redux/slices/visualizerSlice/genAiSlice';
import { setIsGenerated, updateIsGenLoading } from '@/redux/slices/visualizerSlice/workspaceSlice';
import { toast } from 'sonner';
import { setCurrentTabContent } from '@/redux/slices/studioSlice';

const GenAiImageGeneration = () => {
    const dispatch = useDispatch<AppDispatch>();
    const isApi = useRef<boolean>(true);
    const [taskId, setTaskId] = React.useState<string>("");
    const [isTask, setIsTask] = React.useState<boolean>(false);

    const { genAiRequestSubmit } = useSelector((state: RootState) => state.genAi);
    const { profile } = useSelector((state: RootState) => state.userProfile);
    const { list: jobList } = useSelector((state: RootState) => state.jobs);
    const { currentProject: ProjectList } = useSelector(
        (state: RootState) => state.projects
    );
    const { requests} = useSelector(
        (state: RootState) => state.genAi
    );

    useEffect(() => {
        if (genAiRequestSubmit && isApi.current) {
            isApi.current = false;
            setTaskId(genAiRequestSubmit.task_id);
            setIsTask(true);
        }
    }, [genAiRequestSubmit]);


    const handleResetStartApiCall = async (data: TaskApiModel) => {
        setTaskId("");
        setIsTask(false);

        const genChat: GenAiChat = {
            // Remove the id field to let Supabase generate a UUID automatically

            project_id: ProjectList?.id || 0,
            // Fix for user_id - convert to number if string, and handle null profile
            user_id: profile?.id,
            job_id: jobList[0]?.id || 0,
            master_image_path:
                requests.houseUrl && requests.houseUrl[0] ? requests.houseUrl[0] : "",
            palette_image_path:
                requests.paletteUrl && requests.paletteUrl[0]
                    ? requests.paletteUrl[0]
                    : "",
            reference_img:
                requests.referenceImageUrl && requests.referenceImageUrl[0]
                    ? requests.referenceImageUrl[0]
                    : "",
            user_input_text:
                requests.prompt && requests.prompt[0] ? requests.prompt[0] : "",
            output_image: data.outputImage,
            is_completed: true,
            is_show: true,
            prompt: data.prompt,
            task_id: data.taskId,
            created: new Date().toISOString(),
            updated: new Date().toISOString(),
            // Fix openai_metadata type issue - convert null to undefined
            openai_metadata: data.openai_metadata
                ? JSON.stringify(data.openai_metadata)
                : undefined,
        } as GenAiChat;

        console.log("genChat--->", genChat);
        dispatch(setCurrentGenAiImage(genChat));

        try {
            const result = await dispatch(insertGenAiChatData(genChat));

            if (result.meta.requestStatus === "fulfilled") {
                dispatch(resetRequest());
                dispatch(updateIsGenLoading(false));
                 dispatch(setCurrentTabContent("compare"))
                dispatch(setIsGenerated(true));
            }
        } catch (error) {
            toast.error("Error in reset start API call: " + (error as Error).message);
            console.error("Error in reset start API call:", error);
        }

        // setIsTask(false);
        // isApiCall.current = true;
        // dispatch(resetChatMarking())
        // resetStartApiCall(data); // Reset the parent component's state
    };

    const handleResetFaiApiCall = (errorMessage: string) => {
        toast.error("Task failed: " + errorMessage);
        setTaskId(""); // Reset task ID on error
        setIsTask(false); // Reset task status
      };
    return (
        <>
            {/* Only render Call_task_id when there's an active task */}
            {taskId && taskId !== "" && isTask && (
                <Call_task_id
                    taskId={taskId}
                    resetChatTask={handleResetStartApiCall}
                    resetChatTaskFail={handleResetFaiApiCall}
                />
            )}
        </>
    )
}

export default GenAiImageGeneration