import VisualToolHome from '@/components/workSpace/visualTool/VisualToolHome';

type Props = {
    isCreateDialogOpen: boolean;
    handleResetProjectCreated: () => void;
}
const CreateProjectHome = ({ isCreateDialogOpen, handleResetProjectCreated }: Props) => {
  return (
    
    <>
          {/* open  model */}
         {isCreateDialogOpen && (
        <VisualToolHome resetProjectCreated={handleResetProjectCreated} />
      )}
    </>
  )
}

export default CreateProjectHome