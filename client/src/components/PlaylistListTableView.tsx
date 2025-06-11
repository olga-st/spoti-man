// src/components/PlaylistListTableView.tsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import type { Playlist } from '../types';

interface PlaylistListTableViewProps {
    playlists: Playlist[];
}

export function PlaylistListTableView({ playlists }: PlaylistListTableViewProps) {
    const navigate = useNavigate();

    const handleRowClick = (playlistId: string) => {
        navigate(`/playlist/${playlistId}`);
    };

    return (
        <div className="bg-gray-800 rounded-lg overflow-hidden">
            <table className="w-full text-left">
                <thead className="bg-gray-700 text-gray-400 uppercase text-sm">
                    <tr>
                        <th className="p-4 w-20"></th>
                        <th className="p-4">Name</th>
                        <th className="p-4 w-20">Tracks</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-700">
                    {playlists.map(playlist => (
                        <tr key={playlist.id} onClick={() => handleRowClick(playlist.id)} className="hover:bg-gray-700/50 cursor-pointer">
                            <td className="p-2">
                                <img src={playlist.imageUrl} alt={playlist.name} className="w-16 h-16 object-cover rounded-md" />
                            </td>
                            <td className="p-4 font-semibold">{playlist.name}</td>
                            <td className="p-4 text-gray-300 text-center">{playlist.trackCount}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
} 