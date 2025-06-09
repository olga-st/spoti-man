// src/App.tsx
// The main component, now much cleaner. It handles which screen to show
// and passes data from our custom hook to the UI components.

import React, { useState, useMemo } from 'react';
import { usePlaylistManager } from './hooks/usePlaylistManager';
import { PlaylistListScreen } from './components/PlaylistListScreen';
import { PlaylistView } from './components/PlaylistView';
import { AddToPlaylistModal } from './components/AddToPlaylistModal';
import { ArrowLeftIcon } from './components/Icons';

export default function App() {
    // This custom hook now contains all the logic for managing playlists.
    const {
        tracks,
        playlists,
        handleReorderTrack,
        handleRemoveFromPlaylist,
        handleMoveToPlaylist,
    } = usePlaylistManager();

    // The App component still manages UI state, like which screens are visible.
    const [activePlaylistId, setActivePlaylistId] = useState<string | null>(null);
    const [trackToMove, setTrackToMove] = useState<string | null>(null);

    // useMemo helps to avoid re-calculating these values on every render.
    const activePlaylist = useMemo(() => playlists.find(p => p.id === activePlaylistId), [playlists, activePlaylistId]);
    const otherPlaylists = useMemo(() => playlists.filter(p => p.id !== activePlaylistId), [playlists, activePlaylistId]);
    
    // This function is defined here because it needs to manage state from this component (trackToMove).
    const onMoveSelected = (destinationPlaylistId: string) => {
        if(trackToMove) {
            handleMoveToPlaylist(trackToMove, destinationPlaylistId);
        }
        setTrackToMove(null); // Close the modal after selection.
    }

    return (
        <div className="bg-gray-900 text-white min-h-screen font-sans">
            <div className="container mx-auto p-4 md:p-8">
                <header className="text-center mb-8">
                    <h1 className="text-5xl font-bold text-green-400">Spotify Playlist Manager</h1>
                    <p className="text-gray-300">Your music, your rules.</p>
                </header>

                <main>
                    {activePlaylist ? (
                        // --- If a playlist is selected, show the detail view ---
                        <div>
                             <button onClick={() => setActivePlaylistId(null)} className="flex items-center gap-2 text-gray-300 hover:text-white mb-6 p-2 rounded-md bg-gray-800 hover:bg-gray-700 transition-colors">
                                <ArrowLeftIcon />
                                Back to Playlists
                            </button>
                            <h2 className="text-3xl font-bold mb-4">{activePlaylist.name}</h2>
                            <PlaylistView 
                                playlist={activePlaylist} 
                                tracks={tracks}
                                onReorder={handleReorderTrack}
                                onRemoveFromPlaylist={handleRemoveFromPlaylist} 
                                onStartMoveTrack={setTrackToMove}
                            />
                        </div>
                    ) : (
                        // --- Otherwise, show the list of all playlists ---
                        <PlaylistListScreen playlists={playlists} onSelectPlaylist={setActivePlaylistId} />
                    )}
                </main>

                <AddToPlaylistModal 
                    isOpen={!!trackToMove}
                    playlists={otherPlaylists}
                    onClose={() => setTrackToMove(null)}
                    onSelectPlaylist={onMoveSelected}
                />
            </div>
        </div>
    );
}
