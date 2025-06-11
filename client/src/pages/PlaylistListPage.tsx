// src/pages/PlaylistListPage.tsx
import React, { useState } from 'react';
import { usePlaylistManager } from '../hooks/usePlaylistManager';
import { Link } from 'react-router-dom';
import type { Playlist } from '../types';
import { PlaylistListGridView } from '../components/PlaylistListGridView';
import { PlaylistListTableView } from '../components/PlaylistListTableView';
import { AppsIcon, ListIcon } from '../components/Icons'; // Assuming you have these icons

export function PlaylistListPage() {
    const { playlists, loading } = usePlaylistManager();
    const [view, setView] = useState<'grid' | 'table'>('grid');

    if (loading) {
        return <div>Loading playlists...</div>;
    }

    return (
        <div>
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-3xl font-bold">Your Playlists</h2>
                <div className="flex items-center gap-2">
                    <button onClick={() => setView('grid')} className={`p-2 rounded-md ${view === 'grid' ? 'bg-green-500' : 'bg-gray-700'} hover:bg-green-600 transition-colors`}>
                        <AppsIcon />
                    </button>
                    <button onClick={() => setView('table')} className={`p-2 rounded-md ${view === 'table' ? 'bg-green-500' : 'bg-gray-700'} hover:bg-green-600 transition-colors`}>
                        <ListIcon />
                    </button>
                </div>
            </div>
            
            {view === 'grid' ? (
                <PlaylistListGridView playlists={playlists} />
            ) : (
                <PlaylistListTableView playlists={playlists} />
            )}
        </div>
    );
} 