// components/AnalyzedDataModal.tsx
import React, {  useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import { Loader } from "@/pages/projectPage/ProjectsPage";
import { updateProjectAnalysis } from "@/redux/slices/projectSlice";

const backdropVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

const modalVariants = {
  hidden: { y: "100%" },
  visible: { y: "0%" }, // appears from bottom to half screen
  exit: { y: "100%" },
};

export default function AnalyzedDataModal({ isOpen, onClose, projectId }: any) {
  const { isUpdating, list: projects } = useSelector(
    (state: RootState) => state.projects
  );

  const dispatch = useDispatch<AppDispatch>();
  const filter = projects.find((d) => d.id == projectId);
  const url = filter?.jobData?.[0].full_image ?? "";
  const analysed_data = filter?.analysed_data;
  const [updatingid, setUpdatingid] = useState<number | null>(null);

  const handleReset = async (id: number) => {
    const filter = projects.find((d) => d.id == id);
    if (filter) {
      const url: string = filter.jobData?.[0].full_image ?? "";
      const projectId = filter.id!;
      setUpdatingid(projectId);
      await dispatch(updateProjectAnalysis({ url: url, id: projectId }));
      setUpdatingid(null);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-40 z-40"
            initial="hidden"
            animate="visible"
            exit="hidden"
            variants={backdropVariants}
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            className="fixed bottom-0 left-0 w-full h-[70vh] bg-white z-50 rounded-t-xl shadow-lg flex flex-col"
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={modalVariants}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            {isUpdating && updatingid == projectId && <Loader />}
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-2 border-b">
              <h2 className="text-lg font-semibold">Analysed Data</h2>
              <div className="flex gap-2">
                <Button
                  onClick={() => {
                    handleReset(projectId);
                  }}
                  variant="outline"
                  size="sm"
                >
                  Reset
                </Button>
                <Button variant="destructive" size="sm" onClick={onClose}>
                  Close
                </Button>
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-auto p-4 flex flex-col md:flex-row gap-4">
              {/* Image */}
              <div className="flex-1 min-h-[150px]">
                <img
                  src={url}
                  alt="Analyzed"
                  className="w-full h-full object-contain rounded-lg border"
                />
              </div>

              {/* JSON Viewer */}
              <div className="flex-1 overflow-auto bg-gray-100 p-4 rounded-lg border text-sm">
                <pre className="whitespace-pre-wrap break-words">
                  {JSON.stringify(analysed_data, null, 2)}
                </pre>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
