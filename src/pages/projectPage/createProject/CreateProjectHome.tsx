import VisualToolHome from '@/components/workSpace/visualTool/VisualToolHome';
import UploadImageModel from './UploadImageModel';

type Props = {
    isCreateDialogOpen: boolean;
    handleResetProjectCreated: () => void;
}
const CreateProjectHome = ({ isCreateDialogOpen, handleResetProjectCreated }: Props) => {
  return (
    
    <>
          {/* open  model */}
         {isCreateDialogOpen && (
        <UploadImageModel 
          resetProjectCreated={handleResetProjectCreated}
        />
      )}
    </>
  )
}

export default CreateProjectHome