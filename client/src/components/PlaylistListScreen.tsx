// src/components/PlaylistListScreen.tsx
// The component for displaying the grid of all playlists.

import React from 'react';
import type { Playlist } from '../types';

interface PlaylistListProps {
    playlists: Playlist[];
    onSelectPlaylist: (id: string) => void;
}

export const PlaylistListScreen: React.FC<PlaylistListProps> = ({ playlists, onSelectPlaylist }) => {
    return (
        <div>
            <h2 className="text-3xl font-bold mb-6">Your Playlists</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                {playlists.map(playlist => (
                    <div key={playlist.id} onClick={() => onSelectPlaylist(playlist.id)} className="bg-gray-800 rounded-lg overflow-hidden cursor-pointer group transition-all duration-300 hover:bg-gray-700">
                        <img src={playlist.imageUrl} alt={playlist.name} className="w-full h-48 object-cover group-hover:opacity-80 transition-opacity" onError={(e) => { e.currentTarget.src = 'https://placehold.co/300/191414/FFFFFF?text=Error'; }} />
                        <div className="p-4">
                            <h3 className="font-bold text-lg truncate">{playlist.name}</h3>
                            <p className="text-sm text-gray-400">{playlist.tracks.length} tracks</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
