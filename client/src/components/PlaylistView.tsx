// src/components/PlaylistView.tsx
// The component for the detailed table view of a single playlist.

import React, { useState, useEffect, useRef } from 'react';
import type { AppTrack } from '../pages/PlaylistPage'; // Import the new track type
import { TagInput } from './TagInput';

// A simple helper to format milliseconds into MM:SS format
const formatDuration = (ms: number) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = ((ms % 60000) / 1000).toFixed(0);
    return minutes + ":" + (parseInt(seconds) < 10 ? '0' : '') + seconds;
};

interface PlaylistViewProps { 
    tracks: AppTrack[]; 
    onUpdateTrackBpm: (trackId: string, newBpm: string) => void;
    onUpdateTrackTags: (trackId: string, newTags: string[]) => void;
}

export const PlaylistView: React.FC<PlaylistViewProps> = ({ tracks, onUpdateTrackBpm, onUpdateTrackTags }) => {
    const [editingBpmTrackId, setEditingBpmTrackId] = useState<string | null>(null);
    const [bpmValue, setBpmValue] = useState('');
    const [editingTagsTrackId, setEditingTagsTrackId] = useState<string | null>(null);
    const tagsEditorRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (tagsEditorRef.current && !tagsEditorRef.current.contains(event.target as Node)) {
                setEditingTagsTrackId(null);
            }
        };

        if (editingTagsTrackId) {
            document.addEventListener('mousedown', handleClickOutside);
        } else {
            document.removeEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [editingTagsTrackId]);

    const handleBpmClick = (track: AppTrack) => {
        setEditingBpmTrackId(track.id);
        setBpmValue(track.bpm || '');
    };

    const handleBpmChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setBpmValue(e.target.value);
    };

    const handleBpmBlur = () => {
        if (editingBpmTrackId) {
            onUpdateTrackBpm(editingBpmTrackId, bpmValue);
        }
        setEditingBpmTrackId(null);
    };

    const handleBpmKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            handleBpmBlur();
        }
    };

    const handleTagsClick = (track: AppTrack) => {
        setEditingTagsTrackId(track.id);
    };

    const handleTagsUpdate = (newTags: string[]) => {
        if (editingTagsTrackId) {
            onUpdateTrackTags(editingTagsTrackId, newTags);
        }
    };

    return (
        <div className="bg-gray-800 rounded-lg overflow-hidden">
            <table className="w-full text-left">
                <thead className="hidden bg-gray-700 text-gray-400 uppercase text-sm md:table-header-group">
                    <tr>
                        <th className="p-4 w-12 text-center">#</th>
                        <th className="p-4 w-16"></th>
                        <th className="p-4">Title</th>
                        <th className="p-4">Artist</th>
                        <th className="p-4">Duration</th>
                        <th className="p-4 w-24">BPM</th>
                        <th className="p-4 w-1/3">Tags</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-700 md:divide-y-0">
                    {tracks.map((track, index) => (
                        <tr key={track.id} className="block md:table-row hover:bg-gray-700/50">
                            <td className="p-4 text-center text-gray-400 block md:table-cell" data-label="#"><span className="md:hidden font-bold mr-2">#</span>{index + 1}</td>
                            <td className="p-2 text-gray-300 block md:table-cell" data-label="Album Art">
                                <img 
                                    src={track.album.images[2]?.url || track.album.images[1]?.url || 'https://placehold.co/64x64/1DB954/FFFFFF?text=Album'} 
                                    alt={track.album.name} 
                                    className="w-12 h-12 object-cover rounded-sm" 
                                />
                            </td>
                            <td className="p-4 font-semibold block md:table-cell" data-label="Title"><span className="md:hidden font-bold mr-2">Title</span>{track.name}</td>
                            <td className="p-4 text-gray-300 block md:table-cell" data-label="Artist"><span className="md:hidden font-bold mr-2">Artist</span>{track.artists.map(a => a.name).join(', ')}</td>
                            <td className="p-4 text-gray-300 block md:table-cell" data-label="Duration"><span className="md:hidden font-bold mr-2">Duration</span>{formatDuration(track.duration_ms)}</td>
                            <td className="relative p-4 text-gray-300 block md:table-cell w-24" data-label="BPM" onClick={() => editingBpmTrackId !== track.id && handleBpmClick(track)}>
                                <span className="md:hidden font-bold mr-2">BPM</span>
                                <span className={`${editingBpmTrackId === track.id ? 'invisible' : ''} cursor-pointer`}>{track.bpm || '--'}</span>
                                {editingBpmTrackId === track.id && (
                                    <input
                                        type="text"
                                        value={bpmValue}
                                        onChange={handleBpmChange}
                                        onBlur={handleBpmBlur}
                                        onKeyDown={handleBpmKeyDown}
                                        className="absolute top-1/2 left-2 transform -translate-y-1/2 bg-gray-700 text-white w-20 p-1 rounded border border-gray-600"
                                        autoFocus
                                    />
                                )}
                            </td>
                            <td className="p-4 block md:table-cell w-1/3" data-label="Tags" onClick={() => editingTagsTrackId !== track.id && handleTagsClick(track)}>
                                <span className="md:hidden font-bold mr-2">Tags</span>
                                {editingTagsTrackId === track.id ? (
                                    <div ref={tagsEditorRef}>
                                        <TagInput
                                            initialTags={track.tags || []}
                                            onTagsChange={handleTagsUpdate}
                                        />
                                    </div>
                                ) : (
                                    <div className="p-1 border border-transparent min-h-[38px] flex items-center cursor-pointer">
                                        <div className="inline-flex flex-wrap gap-2">
                                            {(track.tags || []).map(tag => <span key={tag} className="bg-blue-600 text-white px-2 py-1 rounded-full text-xs">{tag}</span>)}
                                        </div>
                                    </div>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};
