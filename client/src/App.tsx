// src/App.tsx
// The main component, now much cleaner. It handles which screen to show
// and passes data from our custom hook to the UI components.

import React from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthCallbackPage } from './pages/AuthCallbackPage';
import { LoginPage } from './pages/LoginPage';
import { useAuth } from './context/AuthContext';
import { MainApp } from './MainApp';

export default function App() {
    const { accessToken, login, loading: authLoading } = useAuth();
    const location = useLocation();

    // If we have a token and are still on the callback page, redirect to the app.
    if (accessToken && location.pathname === '/callback') {
        return <Navigate to="/" replace />;
    }
    
    if (authLoading && !accessToken) {
        return (
            <div className="bg-gray-900 text-white min-h-screen font-sans flex items-center justify-center">
                <div>Loading...</div>
            </div>
        );
    }
    
    return (
        <Routes>
            <Route path="/login" element={<LoginPage onLogin={login} />} />
            <Route path="/callback" element={<AuthCallbackPage />} />
            <Route
                path="/*"
                element={
                    accessToken ? (
                        <MainApp />
                    ) : (
                        <Navigate to="/login" replace />
                    )
                }
            />
        </Routes>
    );
}
