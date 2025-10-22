import React from 'react'
import SamplePlayBookPage from './SamplePlayBookPage'
import LeftSection from './LeftSection'
import MaterialData from '@/components/swatchBookData/materialData/MaterialData'

const MainSamplePage = () => {
  return (
    <>
    <MaterialData />
    <div className="flex h-screen w-full overflow-hidden bg-zinc-100">
         <div className='relative border-r bg-white transition-[width] duration-200 ease-in-out  hidden md:block'>
           <LeftSection />
         </div>
          
          <SamplePlayBookPage/>

    </div>


     </>
  )
}

export default MainSamplePage
