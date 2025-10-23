import { fetchRolePermissions } from '@/AdminPannel/reduxslices/Role_PermissionSlice';
import { useFormField } from '@/components/ui/form';
import { AppDispatch, RootState } from '@/redux/store';
import React, { useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux';

const FetchRolePermission = () => {
  const dispatch = useDispatch<AppDispatch>();
    const isApi = useRef(true);
   
    const {allPermissions, isPermissionLoading} =  useSelector((state: RootState) => state.role_permission);

    useEffect(() => {
      if (isApi.current) {
        isApi.current = false;
        dispatch(fetchRolePermissions());
      }
    
    }, [dispatch]);

  return (
    null
  )
}

export default FetchRolePermission