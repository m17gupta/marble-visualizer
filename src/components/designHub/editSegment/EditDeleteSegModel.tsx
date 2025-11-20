import {
  Dialog,
  DialogPortal,
  DialogOverlay,
  DialogContent,
  DialogHeader,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Loader2 } from "lucide-react";
import { useState } from "react";
import { ProjectModel } from "@/models/projectModel/ProjectModel";
import { SegmentModal } from "@/models/jobSegmentsModal/JobSegmentModal";

type DeleteModalProps = {
  onCancel: () => void;
  isOpen: boolean;
  type: "project" | "segment";
  project?: ProjectModel;

  /** ✅ jis segment pe user ne Delete dabaya */
  segment?: SegmentModal;

  /** agar project delete karna ho */
  onDeleteProject?: (project: ProjectModel) => Promise<void>;

  /** ✅ sirf clicked segment delete karne ke liye */
  onDeleteSegment?: (segment: SegmentModal) => Promise<void>;
};

const EditDeleteSegModel = ({
  onCancel,
  isOpen,
  type,
  project,
  segment,
  onDeleteProject,
  onDeleteSegment,
}: DeleteModalProps) => {
  const [deleting, setDeleting] = useState(false);

  const segLabel =
    segment?.short_title ||
    segment?.title ||
    (segment?.id != null ? String(segment.id) : "");

  const handleConfirm = async () => {
    setDeleting(true);
    try {
      if (type === "project" && project && onDeleteProject) {
        await onDeleteProject(project);
      } else if (type === "segment" && segment && onDeleteSegment) {
        await onDeleteSegment(segment); // ✅ sirf clicked segment
      }
    } finally {
      setDeleting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={() => !deleting && onCancel()}>
      <DialogPortal>
        <DialogOverlay className="fixed inset-0 bg-black/70 backdrop-blur-[2px]" />
        <DialogContent
          className="sm:max-w-[440px] p-0 overflow-hidden rounded-2xl bg-white border border-slate-200 shadow-2xl"
          onPointerDownOutside={(e) => deleting && e.preventDefault()}
          onInteractOutside={(e) => deleting && e.preventDefault()}
          onEscapeKeyDown={(e) => deleting && e.preventDefault()}
        >
          <div className="flex items-start gap-3 p-5 pb-2">
            <div className="flex-1">
              <DialogHeader className="p-0">
                <div className="h-14 w-14 rounded-full bg-red-50 text-red-600 grid place-items-center mx-auto">
                  <AlertTriangle className="h-5 w-5" />
                </div>

                <DialogDescription className="mt-2 text-slate-700 text-center">
                  Are you sure you want to permanently delete{" "}
                  <span className="font-medium text-slate-900">{type}</span>
                  {type === "segment" && segLabel && (
                    <>
                      {" "}
                      <span className="px-1 rounded bg-slate-100 text-slate-900 font-medium">
                        {segLabel}
                      </span>
                    </>
                  )}
                  ?
                </DialogDescription>
              </DialogHeader>
            </div>
          </div>

          <DialogFooter className="px-5 pb-5 gap-2 mx-auto">
            <Button variant="outline" onClick={onCancel} disabled={deleting}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleConfirm}
              className="min-w-[96px]"
              disabled={deleting || (type === "segment" && !segment)}
            >
              {deleting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {deleting ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </DialogPortal>
    </Dialog>
  );
};

export default EditDeleteSegModel;
