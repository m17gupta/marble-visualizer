import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import React from "react";

type Props = {
  createProject: () => void;
};
const ProjectHeader = ({ createProject }: Props) => {
  const handleCreateProject = () => {
    createProject();
  };
  return (
    <>
      <div className="pb-4 md:pb-0 block md:hidden">
        <div className="flex justify-between items-center pb-3">
          <h1 className="text-3xl font-semibold tracking-tight ">Project</h1>
          <Button
            onClick={handleCreateProject}
            className="h-8 px-3 py-1 text-sm flex items-center gap-1 bg-primary text-primary-foreground hover:bg-primary/90"
          >
            <Plus className="h-3 w-3" />
            <span>Create</span>
          </Button>
        </div>
        <p className="text-muted-foreground text-xs">
          Manage your projects and track progress
        </p>
      </div>

      <div className="md:flex grid justify-between items-center p-0 hidden md:block">
        <div className="pb-4 md:pb-0">
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
  );
};

export default ProjectHeader;
