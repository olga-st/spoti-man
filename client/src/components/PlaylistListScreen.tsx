// src/components/PlaylistListScreen.tsx
// The component for displaying the grid of all playlists.

import React, { useEffect } from 'react';
import { Table, TableRow, TableCell } from './common/Table';
import { Button } from './common/Button';
import { PlusIcon } from './Icons';
import { usePlaylistManager } from '../hooks/usePlaylistManager';
import { Spinner } from './common/Spinner';

interface PlaylistListScreenProps {
    onSelectPlaylist: (playlistId: string) => void;
}

export const PlaylistListScreen = ({ onSelectPlaylist }: PlaylistListScreenProps) => {
    const { playlists, isLoading, error, loadPlaylists, getPlaylistTrackCount } = usePlaylistManager();

    useEffect(() => {
        loadPlaylists();
    }, [loadPlaylists]);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-full">
                <Spinner size="lg" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-center text-red-500">
                <p>Error loading playlists: {error}</p>
                <Button onClick={loadPlaylists} className="mt-4">
                    Retry
                </Button>
            </div>
        );
    }

    return (
        <div>
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold">Your Playlists</h2>
                <Button icon={<PlusIcon />}>
                    Create Playlist
                </Button>
            </div>
            <Table headers={['Name', 'Tracks', '']}>
                {playlists.map(playlist => (
                    <TableRow 
                        key={playlist.id}
                        onClick={() => onSelectPlaylist(playlist.id)}
                        className="cursor-pointer hover:bg-gray-700/50"
                    >
                        <TableCell className="font-semibold">{playlist.name}</TableCell>
                        <TableCell className="text-gray-300">{getPlaylistTrackCount(playlist.id)} tracks</TableCell>
                        <TableCell>
                            <div className="flex justify-end">
                                <Button
                                    variant="secondary"
                                    size="sm"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        onSelectPlaylist(playlist.id);
                                    }}
                                >
                                    View
                                </Button>
                            </div>
                        </TableCell>
                    </TableRow>
                ))}
            </Table>
        </div>
    );
};
