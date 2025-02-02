import React from 'react'
import { useSelector } from 'react-redux'
import { Outlet } from 'react-router-dom';

const PrivateRoute = () => {
  const {userInfo} = useSelector(state => state.auth);
  return userInfo? <Outlet/> : <Navigate to='/admin-sign-in' replace/>
}

export default PrivateRoute
