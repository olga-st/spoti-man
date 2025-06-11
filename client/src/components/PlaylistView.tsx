// src/components/PlaylistView.tsx
// The component for the detailed table view of a single playlist.

import React, { useState, useEffect, useRef } from 'react';
import type { Playlist, Track } from '../types';
import { ArrowDownIcon, ArrowUpIcon, CopyIcon, TrashIcon } from './Icons';
import { TagInput } from './TagInput';

interface PlaylistViewProps { 
    playlist: Playlist; 
    tracks: Track[]; 
    onReorder: (playlistId: string, trackIndex: number, direction: 'up' | 'down') => void;
    onRemoveFromPlaylist: (playlistId: string, trackId: string) => void;
    onStartMoveTrack: (trackId: string) => void;
    onUpdateTrackBpm: (trackId: string, newBpm: string) => void;
    onUpdateTrackTags: (trackId: string, newTags: string[]) => void;
}

export const PlaylistView: React.FC<PlaylistViewProps> = ({ playlist, tracks, onReorder, onRemoveFromPlaylist, onStartMoveTrack, onUpdateTrackBpm, onUpdateTrackTags }) => {
    const playlistTracks = playlist.tracks.map(trackId => tracks.find(t => t.id === trackId)).filter((t): t is Track => !!t);
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

    const handleBpmClick = (track: Track) => {
        setEditingBpmTrackId(track.id);
        setBpmValue(track.bpm);
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

    const handleTagsClick = (track: Track) => {
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
                        <th className="p-4">Title</th>
                        <th className="p-4">Artist</th>
                        <th className="p-4">Duration</th>
                        <th className="p-4 w-24">BPM</th>
                        <th className="p-4 w-1/3">Tags</th>
                        <th className="p-4"></th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-700 md:divide-y-0">
                    {playlistTracks.map((track, index) => (
                        <tr key={track.id} className="block md:table-row">
                            <td className="p-4 text-center text-gray-400 block md:table-cell" data-label="#"><span className="md:hidden font-bold mr-2">#</span>{index + 1}</td>
                            <td className="p-4 font-semibold block md:table-cell" data-label="Title"><span className="md:hidden font-bold mr-2">Title</span>{track.name}</td>
                            <td className="p-4 text-gray-300 block md:table-cell" data-label="Artist"><span className="md:hidden font-bold mr-2">Artist</span>{track.artist}</td>
                            <td className="p-4 text-gray-300 block md:table-cell" data-label="Duration"><span className="md:hidden font-bold mr-2">Duration</span>{track.duration}</td>
                            <td className="relative p-4 text-gray-300 block md:table-cell w-24" data-label="BPM" onClick={() => handleBpmClick(track)}>
                                <span className="md:hidden font-bold mr-2">BPM</span>
                                <span className={`${editingBpmTrackId === track.id ? 'invisible' : ''}`}>{track.bpm}</span>
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
                                            initialTags={track.tags}
                                            onTagsChange={handleTagsUpdate}
                                        />
                                    </div>
                                ) : (
                                    <div className="p-1 border border-transparent min-h-[38px] flex items-center">
                                        <div className="inline-flex flex-wrap gap-2">
                                            {track.tags.map(tag => <span key={tag} className="bg-blue-600 text-white px-2 py-1 rounded-full text-xs">{tag}</span>)}
                                        </div>
                                    </div>
                                )}
                            </td>
                            <td className="p-4 block md:table-cell">
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
