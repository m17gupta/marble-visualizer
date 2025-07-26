import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import React from 'react'

type Props={
    createProject: () => void;
}
const ProjectHeader = ({ createProject }: Props) => {

    const handleCreateProject = () => {
        createProject()
    }
  return (
   <>
    <div className="md:flex grid justify-between items-center">
            <div className='pb-4 md:pb-0'>
              <h1 className="text-3xl font-bold tracking-tight pb-1">Projects</h1>
              <p className="text-muted-foreground text-sm">
                Manage your projects and track progress
              </p>
            </div>
            <Button

              onClick={handleCreateProject}
              className="flex items-center space-x-2"
            >
              <Plus className="h-4 w-4" />
              <span>Create Project</span>
            </Button>
          </div>
   </>
  )
}

export default ProjectHeader