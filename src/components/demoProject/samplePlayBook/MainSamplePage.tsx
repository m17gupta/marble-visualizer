import React, { useEffect } from 'react'
import SamplePlayBookPage from './SamplePlayBookPage'
import LeftSection from './LeftSection'
import MaterialData from '@/components/swatchBookData/materialData/MaterialData'
import { useLocation } from 'react-router-dom'
import { AppDispatch, RootState } from '@/redux/store'
import { useDispatch, useSelector } from 'react-redux'
import { setCurrentJob } from '@/redux/slices/jobSlice'
import { ProjectModel } from '@/models/projectModel/ProjectModel'
import { setCurrentProject } from '@/redux/slices/projectSlice'

const MainSamplePage = () => {
  // get pathname 
  const location = useLocation();
  const pathname = location.pathname;
  const projectId = pathname.split('/').pop();
  const dispatch = useDispatch<AppDispatch>()
  const { currentProject, demoList } = useSelector((state: RootState) => state.projects)
  const { currentJob } = useSelector((state: RootState) => state.jobs)

  useEffect(() => {
    if (projectId && currentJob == null && currentProject === null && demoList.length > 0) {
      const project = demoList.find((item: ProjectModel) => item?.id?.toString() == projectId)
      if (project && project?.jobData && project?.jobData?.length > 0) {
        dispatch(setCurrentProject(project))

        dispatch(setCurrentJob(project?.jobData?.[0]))
      }
    }
  }, [projectId, currentJob, currentProject, demoList])
  return (
    <>
      <MaterialData />
      <div className="flex h-screen w-full overflow-hidden bg-zinc-100">
        <div className='relative border-r bg-white transition-[width] duration-200 ease-in-out  hidden md:block'>
          <LeftSection />
        </div>

        <SamplePlayBookPage />

      </div>


    </>
  )
}

export default MainSamplePage
