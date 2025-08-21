import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { ProjectModel } from "@/models/projectModel/ProjectModel";
import { RootState } from "@/redux/store";
import { useSelector } from "react-redux";

type DeleteModalProps = {
  onCancel: () => void;
  onConfirm: (currentProject: ProjectModel) => void;
  isOpen: boolean;
}
const DeleteModal = ({ onCancel, onConfirm, isOpen }: DeleteModalProps) => {
 const {currentProject} = useSelector((state: RootState) => state.projects);
  const handleConfirm = () => {
    if(!currentProject) return;
    onConfirm(currentProject);

  }
  return (
    <AlertDialog open={isOpen} onOpenChange={onCancel}>
      <AlertDialogTrigger asChild>
        <Button variant="outline">Show Dialog</Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure you want to delete this project?</AlertDialogTitle>
          {/* <AlertDialogDescription>
            This action cannot be undone. This will permanently delete this
            project and remove its data from our servers.
          </AlertDialogDescription> */}
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={onCancel}>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleConfirm}>Continue</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

export default DeleteModal;