import { fetchRoles } from '@/AdminPannel/reduxslices/RoleSlice';
import { AppDispatch } from '@/redux/store';
import React, { useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux';

const FetchRole = () => {
  
    const dispatch = useDispatch<AppDispatch>();
    const isApi= useRef<boolean>(true);
    const {isRoleLoading,role}= useSelector((state:any)=> state.role);
    React.useEffect(() => { 
        if (isApi.current && role.length===0 && !isRoleLoading) {
            isApi.current = false;
            dispatch(fetchRoles());
            isApi.current = true;
        }
    }, [dispatch]);

    return (
        null
    )
}

export default FetchRole