// src/components/Protected.js

import React, { useEffect, useState } from 'react';
import {  Navigate, useNavigate } from 'react-router-dom';
import AdminDashboard from '../pages/AdminDashboard';
import UserDashboard from '../pages/Dashboard';

const Protected = () => {
    const [loading, setLoading] = useState(true);
    const [role, setRole] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        const userRole = localStorage.getItem('role');

        if (!token) {
            navigate('/login');
            return;
        }

        setRole(userRole);
        setLoading(false);
    }, [navigate]);

    
    if (loading) {
        return <div>Loading...</div>;
    }

    
    if (role === '1') {
        return <AdminDashboard />;
    } else if (role === '0') {
        return <UserDashboard />;
    } else {
        return <Navigate to="/login" />;
    }
};

export default Protected;
