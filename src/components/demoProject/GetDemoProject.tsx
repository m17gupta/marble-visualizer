import {  useAppSelector } from '@/redux/hooks'
import { fetchProjects } from '@/redux/slices/projectSlice'
import { AppDispatch, RootState } from '@/redux/store'
import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux'

const GetDemoProject = () => {
    const dispatch = useDispatch<AppDispatch>();
    const {demoUserId, isLoading, list:projectList} = useAppSelector((state:RootState) => state.projects)
    useEffect(() => {
        if(!isLoading && 
            demoUserId && 
            projectList.length === 0){
           dispatch(fetchProjects(demoUserId));
        }
    },[demoUserId, isLoading, projectList])
  return (
null
  )
}

export default GetDemoProject