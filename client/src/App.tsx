// src/App.tsx
// The main component, now much cleaner. It handles which screen to show
// and passes data from our custom hook to the UI components.

import React, { useState, useMemo, useEffect } from 'react';
import { usePlaylistManager } from './hooks/usePlaylistManager';
import { PlaylistListScreen } from './components/PlaylistListScreen';
import { PlaylistView } from './components/PlaylistView';
import { AddToPlaylistModal } from './components/AddToPlaylistModal';
import { LoginPage } from './components/LoginPage';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ArrowLeftIcon } from './components/Icons';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { Callback } from './components/Callback';
import type { Playlist, Track } from './types';
import { Spinner } from './components/common/Spinner';

function AppContent() {
    const { accessToken, logout } = useAuth();
    const [error, setError] = useState<string | null>(null);
    const { playlists, activePlaylist, setActivePlaylist, isLoading, error: playlistError } = usePlaylistManager(accessToken);

    const otherPlaylists = useMemo(() => {
        if (!activePlaylist) return playlists;
        return playlists.filter(p => p.id !== activePlaylist.id);
    }, [playlists, activePlaylist]);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <Spinner size="lg" />
            </div>
        );
    }

    if (error || playlistError) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <h2 className="text-2xl font-bold mb-4 text-red-500">Error</h2>
                    <p className="mb-4">{error || playlistError}</p>
                    <button
                        onClick={() => {
                            setError(null);
                            window.location.reload();
                        }}
                        className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                    >
                        Retry
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-900 text-white">
            <header className="bg-gray-800 p-4">
                <div className="container mx-auto flex justify-between items-center">
                    <h1 className="text-2xl font-bold">Spotify Playlist Manager</h1>
                    <button
                        onClick={logout}
                        className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                    >
                        Logout
                    </button>
                </div>
            </header>
            <main className="container mx-auto p-4">
                {activePlaylist ? (
                    <PlaylistView
                        playlist={activePlaylist}
                        onBack={() => setActivePlaylist(null)}
                        otherPlaylists={otherPlaylists}
                    />
                ) : (
                    <PlaylistListScreen
                        playlists={playlists}
                        onSelectPlaylist={setActivePlaylist}
                    />
                )}
            </main>
        </div>
    );
}

function App() {
    const { isAuthenticated } = useAuth();

    if (!isAuthenticated) {
        return <LoginPage />;
    }

    return <AppContent />;
}

export default App;
