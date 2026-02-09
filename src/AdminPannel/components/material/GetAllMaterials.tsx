import { FetchProductMaterial } from '@/AdminPannel/reduxslices/adminMaterialLibSlice'
import { AppDispatch, RootState } from '@/redux/store'
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'

const GetAllMaterials = () => {
    const dispatch=useDispatch<AppDispatch>()

    const {isFetchedProductMaterial, product_material}=useSelector((state:RootState)=>state.materialsdetails)
  
  
    useEffect(()=>{
        if(!isFetchedProductMaterial){
            dispatch(FetchProductMaterial())
        }
    },[isFetchedProductMaterial])
    return (
   null
  )
}

export default GetAllMaterials