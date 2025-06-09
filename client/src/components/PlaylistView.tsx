// src/components/PlaylistView.tsx
// The component for the detailed table view of a single playlist.

import React from 'react';
import type { Playlist, Track } from '../types';
import { ArrowDownIcon, ArrowUpIcon, CopyIcon, TrashIcon } from './Icons';

interface PlaylistViewProps { 
    playlist: Playlist; 
    tracks: Track[]; 
    onReorder: (playlistId: string, trackIndex: number, direction: 'up' | 'down') => void;
    onRemoveFromPlaylist: (playlistId: string, trackId: string) => void;
    onStartMoveTrack: (trackId: string) => void;
}

export const PlaylistView: React.FC<PlaylistViewProps> = ({ playlist, tracks, onReorder, onRemoveFromPlaylist, onStartMoveTrack }) => {
    const playlistTracks = playlist.tracks.map(trackId => tracks.find(t => t.id === trackId)).filter((t): t is Track => !!t);

    return (
        <div className="bg-gray-800 rounded-lg overflow-hidden">
            <table className="w-full text-left">
                <thead className="bg-gray-700 text-gray-400 uppercase text-sm">
                    <tr>
                        <th className="p-4 w-12 text-center">#</th>
                        <th className="p-4">Title</th>
                        <th className="p-4">Artist</th>
                        <th className="p-4">Duration</th>
                        <th className="p-4">BPM</th>
                        <th className="p-4">Tags</th>
                        <th className="p-4"></th>
                    </tr>
                </thead>
                <tbody>
                    {playlistTracks.map((track, index) => (
                        <tr key={track.id} className="border-b border-gray-700 hover:bg-gray-700/50">
                            <td className="p-4 text-center text-gray-400">{index + 1}</td>
                            <td className="p-4 font-semibold">{track.name}</td>
                            <td className="p-4 text-gray-300">{track.artist}</td>
                            <td className="p-4 text-gray-300">{track.duration}</td>
                            <td className="p-4 text-gray-300">{track.bpm}</td>
                            <td className="p-4"><div className="flex flex-wrap gap-2">{track.tags.map(tag => <span key={tag} className="bg-blue-600 text-white px-2 py-1 rounded-full text-xs">{tag}</span>)}</div></td>
                            <td className="p-4">
                                <div className="flex items-center justify-end gap-3">
                                    <button onClick={() => onStartMoveTrack(track.id)} className="text-gray-400 hover:text-white"><CopyIcon /></button>
                                    <button onClick={() => onReorder(playlist.id, index, 'up')} disabled={index === 0} className="text-gray-400 hover:text-white disabled:text-gray-600 disabled:cursor-not-allowed"><ArrowUpIcon /></button>
                                    <button onClick={() => onReorder(playlist.id, index, 'down')} disabled={index === playlistTracks.length - 1} className="text-gray-400 hover:text-white disabled:text-gray-600 disabled:cursor-not-allowed"><ArrowDownIcon /></button>
                                    <button onClick={() => onRemoveFromPlaylist(playlist.id, track.id)} className="text-red-400 hover:text-red-300"><TrashIcon /></button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};
