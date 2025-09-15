import React from 'react'
import WorkflowSection from './WorkflowSection'
import HeroSection from './HeroSection'
import DemoSection from './DemoSection'
import Navigation from '@/components/homepage/new/Navigation'

const VizualizerTemplate = () => {
  return (
    <>
      <Navigation />
      <HeroSection />
        <WorkflowSection />
        <DemoSection />
    </>
  )
}

export default VizualizerTemplate