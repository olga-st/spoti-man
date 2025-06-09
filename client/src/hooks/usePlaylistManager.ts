// src/hooks/usePlaylistManager.ts
// A custom hook to encapsulate all playlist and track management logic.

import { useState } from 'react';
import { mockPlaylists, mockTracks } from '../data/mockData';
import type { Playlist, Track } from '../types';

export const usePlaylistManager = () => {
    // In a real app, this data would be fetched from your backend.
    const [tracks, setTracks] = useState<Track[]>(mockTracks);
    const [playlists, setPlaylists] = useState<Playlist[]>(mockPlaylists);

    const handleRemoveFromPlaylist = (playlistId: string, trackId: string) => {
        setPlaylists(playlists.map(p => {
            if (p.id === playlistId) {
                return { ...p, tracks: p.tracks.filter(id => id !== trackId) };
            }
            return p;
        }));
    };

    const handleReorderTrack = (playlistId: string, trackIndex: number, direction: 'up' | 'down') => {
        setPlaylists(prevPlaylists => prevPlaylists.map(p => {
            if (p.id === playlistId) {
                const newTracks = [...p.tracks];
                const [movedTrack] = newTracks.splice(trackIndex, 1);
                const newIndex = direction === 'up' ? trackIndex - 1 : trackIndex + 1;
                newTracks.splice(newIndex, 0, movedTrack);
                return { ...p, tracks: newTracks };
            }
            return p;
        }));
    };

    const handleMoveToPlaylist = (trackToMove: string, destinationPlaylistId: string) => {
        if (!trackToMove) return;

        setPlaylists(prevPlaylists => prevPlaylists.map(p => {
            if (p.id === destinationPlaylistId) {
                // Avoid adding duplicates
                if (p.tracks.includes(trackToMove)) {
                    return p;
                }
                return { ...p, tracks: [...p.tracks, trackToMove] };
            }
            return p;
        }));
    };

    return {
        tracks,
        playlists,
        handleReorderTrack,
        handleRemoveFromPlaylist,
        handleMoveToPlaylist,
    };
};
