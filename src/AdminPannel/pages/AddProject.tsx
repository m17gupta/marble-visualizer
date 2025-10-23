import VisualToolHome from '@/components/workSpace/visualTool/VisualToolHome'

import { AppDispatch } from '@/redux/store';
import React from 'react'
import { useDispatch } from 'react-redux';

const AddProject = () => {
    const dispatch = useDispatch<AppDispatch>();

    const handleResetProjectCreated = () => {
      // dispatch(updateIsCreateDialog(false));
      // dispatch(updateWorkspaceType("renovate"));
      // setSelectedProjectId(undefined);
    };
  return (
    <div className="p-6">
      <div className="bg-white rounded-lg shadow p-8">
        {/* <h1 className="text-2xl font-bold mb-4">Add New Project</h1>
        <p className="text-gray-600 mb-6">
          This is the Add Project page with admin sidebar and layout.
        </p>
        <div className="bg-green-100 border border-green-300 text-green-700 px-4 py-3 rounded">
          ✅ If you can see the admin sidebar on the left, the routing is working correctly!
        </div> */}

        <VisualToolHome 
                resetProjectCreated={handleResetProjectCreated} />
      </div>
    </div>
  )
}

export default AddProject