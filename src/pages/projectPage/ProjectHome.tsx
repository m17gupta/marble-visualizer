import GetUserSubscription from '@/components/userSubscription/GetUserSubscription'
import React from 'react'
import { ProjectsPage } from './ProjectsPage'
import SwatchBookDataHome from '@/components/swatchBookData/SwatchBookDataHome'
import MaterialData from '@/components/swatchBookData/materialData/MaterialData'
import ProjectAnalyseSegmentApiCall from './analyseProjectImage/ProjectAnalyseSegmentApiCall'
import GetHouseSegments from './analyseProjectImage/GetHouseSegments'

const ProjectHome = () => {
  return (
    <>
    <ProjectsPage/>
    <GetUserSubscription/>

      <SwatchBookDataHome />

      <MaterialData />

      <ProjectAnalyseSegmentApiCall />

      <GetHouseSegments />
    </>
  )
}

export default ProjectHome