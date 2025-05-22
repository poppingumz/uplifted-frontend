import React from 'react';
import { Navigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import jwt_decode from 'jwt-decode';

const ProtectedRoute = ({ children, allowedRoles }) => {
    const cookie = Cookies.get('user');
    if (!cookie) return <Navigate to="/login" replace />;

    try {
        const { token } = JSON.parse(cookie);
        const decoded = jwt_decode(token);
        const role = decoded.role;

        if (!allowedRoles.includes(role)) {
            return <Navigate to="/error403" replace />;
        }

        return children;
    } catch (err) {
        return <Navigate to="/login" replace />;
    }
};

export default ProtectedRoute;
