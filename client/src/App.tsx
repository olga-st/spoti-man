// src/App.tsx
// The main component, now much cleaner. It handles which screen to show
// and passes data from our custom hook to the UI components.

import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { usePlaylistManager } from './hooks/usePlaylistManager';
import { PlaylistListPage } from './pages/PlaylistListPage';
import { PlaylistPage } from './pages/PlaylistPage';
import { NotFoundPage } from './pages/NotFoundPage';
import { AuthCallbackPage } from './pages/AuthCallbackPage';
import { useAuth } from './context/AuthContext';
import { LoginPage } from './pages/LoginPage';
import { MainApp } from './MainApp';

export default function App() {
    const { playlists, loading: playlistsLoading } = usePlaylistManager();
    const { accessToken, login, logout, loading: authLoading } = useAuth();

    if (authLoading) {
        return (
            <div className="bg-gray-900 text-white min-h-screen font-sans flex items-center justify-center">
                <div>Authenticating...</div>
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
