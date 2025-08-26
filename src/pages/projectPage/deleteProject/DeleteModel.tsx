import {
  Dialog,
  DialogPortal,
  DialogOverlay,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ProjectModel } from "@/models/projectModel/ProjectModel";
import { RootState } from "@/redux/store";
import { useSelector } from "react-redux";
import { AlertTriangle, Loader2 } from "lucide-react";
import { useState } from "react";
import { SegmentModal } from "@/models/jobSegmentsModal/JobSegmentModal";

// type DeleteModalProps = {
//   onCancel: () => void;
//   onConfirm?: (currentProject: ProjectModel) => void;
//   isOpen: boolean;
//   segment?: SegmentModal;
//   handleDeleteSegment?: (segmentId: number) => Promise<void>;
// };

type DeleteModalProps = {
  onCancel: () => void;
  isOpen: boolean;
  type: "project" | "segment";
  project?: ProjectModel;
  segment?: SegmentModal;
  onDeleteProject?: (project: ProjectModel) => Promise<void>;
  onDeleteSegment?: (segmentId: number) => Promise<void>;
};

const DeleteModal = ({
  // onCancel,
  // onConfirm,
  // isOpen,
  // handleDeleteSegment,
  // segment,
  onCancel,
  isOpen,
  type,
  project,
  segment,
  onDeleteProject,
  onDeleteSegment,
}: DeleteModalProps) => {
  const { currentProject } = useSelector((state: RootState) => state.projects);
  const [deleting, setDeleting] = useState(false);
  const handleConfirm = async () => {
    setDeleting(true);
    try {
      if (type === "project" && currentProject && onDeleteProject && !segment) {
        await onDeleteProject(currentProject);
      }
      if (type === "segment" && segment && onDeleteSegment) {
        await onDeleteSegment(segment.id!);
      }
    } finally {
      setDeleting(false);
    }
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onCancel}>
        <DialogPortal>
          {/* Softer overlay + slight blur */}
          <DialogOverlay
            className="
            fixed inset-0 bg-black/40 backdrop-blur-[2px]
            data-[state=open]:animate-in data-[state=open]:fade-in-0
            data-[state=closed]:animate-out data-[state=closed]:fade-out-0
          "
          />

          <DialogContent
            className="
              sm:max-w-[440px] p-0 overflow-hidden rounded-2xl
              bg-white border border-slate-200 shadow-2xl
              data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95
              data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95
            "
            onPointerDownOutside={(e) => deleting && e.preventDefault()}
            onInteractOutside={(e) => deleting && e.preventDefault()}
            onEscapeKeyDown={(e) => deleting && e.preventDefault()}
          >
            {/* Header */}
            <div className="flex items-start gap-3 p-5 pb-2">
              <div className="flex-1 ">
                <DialogHeader className="p-0">
                  <div className="h-14 w-14 rounded-full bg-red-50 text-red-600 grid place-items-center mx-auto">
                    <AlertTriangle className="h-5 w-5 " />
                  </div>
                  <DialogDescription className="mt-1 text-slate-600 text-md text-center">
                    Are you sure you want to permanently delete
                    <span className="font-medium text-slate-900 px-1">
                      Project
                    </span>
                    ? This action cannot be undone.
                  </DialogDescription>
                </DialogHeader>
              </div>
            </div>

            {/* Footer */}
            <DialogFooter className="px-5 pb-5 gap-2 mx-auto">
              <Button
                variant="outline"
                onClick={onCancel}
                // disabled={deleting}
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={handleConfirm}
                className="min-w-[96px]"
              >
                {deleting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {deleting ? "Deleting..." : "Delete"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </DialogPortal>
      </Dialog>
    </>
  );
};

export default DeleteModal;
