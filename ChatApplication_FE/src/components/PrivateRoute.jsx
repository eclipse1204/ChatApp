import React from 'react'
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router';

function PrivateRoute({children}) {
    const loggedin = useSelector(state=>state.user.loggedin);
    return loggedin ? children : <Navigate to="/login"/>
}

export default PrivateRoute