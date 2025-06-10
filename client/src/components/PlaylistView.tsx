// src/components/PlaylistView.tsx
// The component for the detailed table view of a single playlist.

import React, { useEffect, useState } from 'react';
import type { Playlist, Track } from '../types';
import { ArrowLeftIcon, ArrowDownIcon, ArrowUpIcon, CopyIcon, TrashIcon } from './Icons';
import { Button } from './common/Button';
import { Spinner } from './common/Spinner';
import { Table, TableRow, TableCell } from './common/Table';
import { Input } from './common/Input';
import { Tag } from './common/Tag';
import { TagInput } from './common/TagInput';
import { Modal } from './common/Modal';
import { usePlaylistManager } from '../hooks/usePlaylistManager';

interface PlaylistViewProps { 
    playlist: Playlist; 
    onBack: () => void;
    otherPlaylists: Playlist[];
}

export const PlaylistView: React.FC<PlaylistViewProps> = ({
    playlist,
    onBack,
    otherPlaylists
}) => {
    const { tracks, isLoading, error, loadTracks, handleReorder, handleRemoveTrack, handleMoveTracks, handleUpdateTrack } = usePlaylistManager();
    const [editingTrackId, setEditingTrackId] = useState<string | null>(null);
    const [editingField, setEditingField] = useState<'bpm' | 'tags' | null>(null);
    const [isMovingTracks, setIsMovingTracks] = useState(false);
    const [tracksToMove, setTracksToMove] = useState<Track[]>([]);

    useEffect(() => {
        loadTracks(playlist.id);
    }, [loadTracks, playlist.id]);

    const handleBpmChange = (trackId: string, value: string) => {
        const bpm = parseInt(value);
        if (!isNaN(bpm) && bpm >= 0) {
            handleUpdateTrack(playlist.id, trackId, { bpm: value });
        }
    };

    const handleTagsChange = (trackId: string, tags: string[]) => {
        handleUpdateTrack(playlist.id, trackId, { tags });
    };

    const handleReorderTrack = (trackIndex: number, direction: 'up' | 'down') => {
        const track = tracks[trackIndex];
        const newIndex = direction === 'up' ? trackIndex - 1 : trackIndex + 1;
        handleReorder(playlist.id, track.id, newIndex);
    };

    const handleRemoveTrackFromPlaylist = (trackId: string) => {
        handleRemoveTrack(playlist.id, trackId);
    };

    const handleMoveTracksToPlaylist = async (destinationPlaylistId: string) => {
        await handleMoveTracks(playlist.id, destinationPlaylistId, tracksToMove.map(track => track.id));
        setIsMovingTracks(false);
        setTracksToMove([]);
    };

    if (isLoading) {
        return (
            <div>
                <div className="flex items-center gap-4 mb-6">
                    <Button
                        variant="secondary"
                        icon={<ArrowLeftIcon />}
                        onClick={onBack}
                    >
                        Back to Playlists
                    </Button>
                    <h2 className="text-2xl font-bold">{playlist.name}</h2>
                </div>
                <div className="bg-gray-800 rounded-lg p-4">
                    <p className="text-gray-400">Loading playlist tracks...</p>
                    <Spinner size="md" className="mt-4" />
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div>
                <div className="flex items-center gap-4 mb-6">
                    <Button
                        variant="secondary"
                        icon={<ArrowLeftIcon />}
                        onClick={onBack}
                    >
                        Back to Playlists
                    </Button>
                    <h2 className="text-2xl font-bold">{playlist.name}</h2>
                </div>
                <div className="bg-gray-800 rounded-lg p-4">
                    <p className="text-red-500">Error: {error}</p>
                    <Button
                        variant="primary"
                        onClick={() => loadTracks(playlist.id)}
                        className="mt-4"
                    >
                        Retry
                    </Button>
                </div>
            </div>
        );
    }

    const headers = ['#', 'Title', 'Artist', 'Duration', 'BPM', 'Tags', ''];

    return (
        <div>
            <div className="flex items-center gap-4 mb-6">
                <Button
                    variant="secondary"
                    icon={<ArrowLeftIcon />}
                    onClick={onBack}
                >
                    Back to Playlists
                </Button>
                <h2 className="text-2xl font-bold">{playlist.name}</h2>
            </div>
            <div className="overflow-x-auto">
                <Table headers={headers}>
                    {tracks.map((track, index) => (
                        <TableRow key={track.id}>
                            <TableCell className="text-center text-gray-400 w-12">{index + 1}</TableCell>
                            <TableCell className="font-semibold min-w-[200px] max-w-[300px] truncate" title={track.name}>{track.name}</TableCell>
                            <TableCell className="text-gray-300 min-w-[150px] max-w-[200px] truncate" title={track.artist}>{track.artist}</TableCell>
                            <TableCell className="text-gray-300 w-20 text-center">{track.duration}</TableCell>
                            <TableCell 
                                className="text-gray-300 cursor-pointer hover:bg-gray-700/50 w-20 text-center"
                                onClick={() => {
                                    setEditingTrackId(track.id);
                                    setEditingField('bpm');
                                }}
                            >
                                {editingTrackId === track.id && editingField === 'bpm' ? (
                                    <Input
                                        type="number"
                                        value={track.bpm}
                                        onChange={(value) => handleBpmChange(track.id, value)}
                                        onBlur={() => {
                                            setEditingTrackId(null);
                                            setEditingField(null);
                                        }}
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter') {
                                                setEditingTrackId(null);
                                                setEditingField(null);
                                            }
                                        }}
                                        autoFocus
                                        min="0"
                                        className="w-16"
                                    />
                                ) : (
                                    track.bpm || '-'
                                )}
                            </TableCell>
                            <TableCell 
                                className="cursor-pointer hover:bg-gray-700/50 min-w-[150px] max-w-[200px]"
                                onClick={() => {
                                    setEditingTrackId(track.id);
                                    setEditingField('tags');
                                }}
                            >
                                {editingTrackId === track.id && editingField === 'tags' ? (
                                    <TagInput
                                        tags={track.tags}
                                        onChange={(tags) => handleTagsChange(track.id, tags)}
                                        maxTags={10}
                                        onClose={() => {
                                            setEditingTrackId(null);
                                            setEditingField(null);
                                        }}
                                    />
                                ) : (
                                    <div className="flex flex-wrap gap-2">
                                        {track.tags.map(tag => (
                                            <Tag key={tag} label={tag} />
                                        ))}
                                    </div>
                                )}
                            </TableCell>
                            <TableCell className="w-32">
                                <div className="flex items-center justify-end gap-2">
                                    <Button
                                        variant="secondary"
                                        size="sm"
                                        icon={<CopyIcon />}
                                        onClick={() => {
                                            setTracksToMove([track]);
                                            setIsMovingTracks(true);
                                        }}
                                        aria-label="Move track"
                                    />
                                    <Button
                                        variant="secondary"
                                        size="sm"
                                        icon={<ArrowUpIcon />}
                                        onClick={() => handleReorderTrack(index, 'up')}
                                        disabled={index === 0}
                                        aria-label="Move track up"
                                    />
                                    <Button
                                        variant="secondary"
                                        size="sm"
                                        icon={<ArrowDownIcon />}
                                        onClick={() => handleReorderTrack(index, 'down')}
                                        disabled={index === tracks.length - 1}
                                        aria-label="Move track down"
                                    />
                                    <Button
                                        variant="danger"
                                        size="sm"
                                        icon={<TrashIcon />}
                                        onClick={() => handleRemoveTrackFromPlaylist(track.id)}
                                        aria-label="Remove track"
                                    />
                                </div>
                            </TableCell>
                        </TableRow>
                    ))}
                </Table>
            </div>

            <Modal
                isOpen={isMovingTracks}
                onClose={() => {
                    setIsMovingTracks(false);
                    setTracksToMove([]);
                }}
                title="Move Tracks"
            >
                <div className="space-y-4">
                    <p className="text-gray-300">
                        Select a playlist to move {tracksToMove.length} track{tracksToMove.length > 1 ? 's' : ''} to:
                    </p>
                    <div className="space-y-2">
                        {otherPlaylists.map(otherPlaylist => (
                            <Button
                                key={otherPlaylist.id}
                                variant="secondary"
                                className="w-full justify-start"
                                onClick={() => handleMoveTracksToPlaylist(otherPlaylist.id)}
                            >
                                {otherPlaylist.name}
                            </Button>
                        ))}
                    </div>
                </div>
            </Modal>
        </div>
    );
};
