// src/components/PlaylistListGridView.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import type { Playlist } from '../types';

interface PlaylistListGridViewProps {
    playlists: Playlist[];
}

export function PlaylistListGridView({ playlists }: PlaylistListGridViewProps) {
    return (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4">
            {playlists.map(playlist => (
                <Link to={`/playlist/${playlist.id}`} key={playlist.id} className="bg-gray-800 p-4 rounded-lg hover:bg-gray-700 transition-colors">
                    <img src={playlist.imageUrl} alt={playlist.name} className="w-full h-auto rounded-md mb-2" />
                    <h3 className="font-bold">{playlist.name}</h3>
                </Link>
            ))}
        </div>
    );
} 