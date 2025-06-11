// src/pages/PlaylistListPage.tsx
import React, { useState, useEffect } from 'react';
import { usePlaylistManager } from '../hooks/usePlaylistManager';
import { PlaylistListGridView } from '../components/PlaylistListGridView';
import { PlaylistListTableView } from '../components/PlaylistListTableView';
import { AppsIcon, ListIcon } from '../components/Icons';

type ViewMode = 'grid' | 'table';

const isViewMode = (value: string | null): value is ViewMode => {
    return value === 'grid' || value === 'table';
}

export function PlaylistListPage() {
    const { playlists, loading } = usePlaylistManager();
    const [view, setView] = useState<ViewMode>(() => {
        const savedView = localStorage.getItem('playlistViewMode');
        return isViewMode(savedView) ? savedView : 'grid';
    });

    useEffect(() => {
        localStorage.setItem('playlistViewMode', view);
    }, [view]);

    if (loading) {
        return <div className="text-center p-8">Loading playlists...</div>;
    }

    return (
        <div>
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-3xl font-bold">Your Playlists</h2>
                <div className="flex items-center gap-2">
                    <button onClick={() => setView('grid')} className={`p-2 rounded-md ${view === 'grid' ? 'bg-green-500 text-white' : 'bg-gray-700'} hover:bg-green-600 transition-colors`}>
                        <AppsIcon />
                    </button>
                    <button onClick={() => setView('table')} className={`p-2 rounded-md ${view === 'table' ? 'bg-green-500 text-white' : 'bg-gray-700'} hover:bg-green-600 transition-colors`}>
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