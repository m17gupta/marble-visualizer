import { DemoProjectHome, GetDemoProject } from '@/components/demoProject'
import MaterialData from '@/components/swatchBookData/materialData/MaterialData'
import { ProjectsPage } from '@/pages/projectPage/ProjectsPage'
import React from 'react'

const DemoProject = () => {
  return (
   <>
  <GetDemoProject/>
   <MaterialData />
    <ProjectsPage />
   </>
  )
}

export default DemoProject