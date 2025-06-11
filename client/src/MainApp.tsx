import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { PlaylistListPage } from './pages/PlaylistListPage';
import { PlaylistPage } from './pages/PlaylistPage';
import { NotFoundPage } from './pages/NotFoundPage';
import { useAuth } from './context/AuthContext';

export const MainApp = () => {
    const { logout } = useAuth();

    return (
        <div className="bg-gray-900 text-white min-h-screen font-sans">
            <header className="text-center p-4 md:p-8 flex justify-between items-center">
                <div>
                    <h1 className="text-5xl font-bold text-green-400">Spotify Playlist Manager</h1>
                    <p className="text-gray-300">Your music, your rules.</p>
                </div>
                <button onClick={logout} className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded transition-colors">
                    Logout
                </button>
            </header>
            <div className="p-4 md:p-8">
                <main>
                    <Routes>
                        <Route path="/playlists" element={<PlaylistListPage />} />
                        <Route path="/playlist/:playlistId" element={<PlaylistPage />} />
                        <Route path="/" element={<Navigate to="/playlists" replace />} />
                        <Route path="*" element={<NotFoundPage />} />
                    </Routes>
                </main>
            </div>
        </div>
    );
}; 