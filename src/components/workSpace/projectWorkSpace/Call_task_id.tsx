// import { TaskApiModel } from "@/models/genAiModel/GenAiModel";
// import React, { useEffect, useCallback } from "react";
// import { genAiService } from "@/services/genAi/genAiService";

// type Props = {
//   taskId: string;
//   resetChatTask: (data: TaskApiModel) => void;
//   resetChatTaskFail: (data: string) => void;
// };

// const Call_task_id = ({ taskId, resetChatTask, resetChatTaskFail }: Props) => {
//   const isApi = React.useRef(true);

//   const handleTaskIdApi = useCallback(
//     async (taskId: string) => {
//       try {
//         const response = await genAiService.getChatTaskId(taskId);

//         if (response.data && response.data.status === "completed") {
//           // Task completed successfully
//           isApi.current = true;

//           const data: TaskApiModel = {
//             taskId: taskId,
//             prompt: response.data.result.enhanced_prompt,
//             outputImage: response.data.result.s3_url,
//             openai_metadata: response.data.result.openai_metadata,
//           };
//           resetChatTask(data);
//         } else {
//           // Task still processing, check again after delay
//           isApi.current = true;

//           setTimeout(() => {
//             handleTaskIdApi(taskId);
//           }, 30000);
//         }
//       } catch (err) {
//         if (err instanceof Error) {
//           console.log("Error in Mask API", err.message);
//           isApi.current = true;
//           resetChatTaskFail("fail");
//         }
//       }
//     },
//     [resetChatTask, resetChatTaskFail]
//   );

//   useEffect(() => {
//     if (isApi.current && taskId) {
//       isApi.current = false;
//       // Add a delay of 30 seconds before making the initial API call
//       setTimeout(() => {
//         console.log("Calling handleTaskIdApi with taskId:", taskId);
//         handleTaskIdApi(taskId);
//       }, 30000);
//     }
//   }, [taskId, handleTaskIdApi]);

//   return null;
// };

// export default Call_task_id;

import { TaskApiModel } from "@/models/genAiModel/GenAiModel";
import React, { useEffect, useRef, useCallback, useState } from "react";
import { genAiService } from "@/services/genAi/genAiService";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/redux/store";
import { updateIsGenLoading } from "@/redux/slices/visualizerSlice/workspaceSlice";

type Props = {
  taskId: string;
  resetChatTask: (data: TaskApiModel) => void;
  resetChatTaskFail: (data: string) => void;
};

const Call_task_id = ({ taskId, resetChatTask, resetChatTaskFail }: Props) => {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isComponentMounted = useRef(true);
  const dispatch = useDispatch<AppDispatch>();

  const pollTaskStatus = useCallback(
    async (taskId: string) => {
      try {
        const response = await genAiService.getChatTaskId(taskId);
        const status = response.data?.status;

        if (status === "completed" && isComponentMounted.current) {
          const data: TaskApiModel = {
            taskId,
            prompt: response.data.result.enhanced_prompt,
            outputImage: response.data.result.s3_url,
            openai_metadata: response.data.result.openai_metadata,
          };
          resetChatTask(data);
        } else if (status === "failed" && isComponentMounted.current) {
          // Handle failure and stop retrying
          console.error("Task failed:", response.data.error);
          resetChatTaskFail(response.data.error || "Task failed");
          dispatch(updateIsGenLoading(false));
          dispatch;
        } else if (isComponentMounted.current) {
          // Still processing, retry after 30s
          timeoutRef.current = setTimeout(() => {
            pollTaskStatus(taskId);
          }, 30000);
        }
      } catch (err) {
        if (err instanceof Error && isComponentMounted.current) {
          console.error("Error in polling API:", err.message);
          resetChatTaskFail("fail");
        }
      }
    },
    [resetChatTask, resetChatTaskFail]
  );

  useEffect(() => {
    isComponentMounted.current = true;

    if (taskId) {
      // Start polling after initial 30 sec delay
      timeoutRef.current = setTimeout(() => {
        pollTaskStatus(taskId);
      }, 30000);
    }

    const [tID, setTID] = useState<string>("");

    return () => {
      isComponentMounted.current = false;
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [taskId, pollTaskStatus]);

  return null;
};

export default Call_task_id;
