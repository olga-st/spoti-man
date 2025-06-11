// src/hooks/usePlaylistManager.ts
// A custom hook to encapsulate all playlist and track management logic.

import { useState, useEffect } from 'react';
import { getPlaylists, getTracks } from '../api/spotify';
import type { Track, Playlist } from '../types';
import { useAuth } from '../context/AuthContext';

export const usePlaylistManager = () => {
    const { accessToken } = useAuth();
    const [playlists, setPlaylists] = useState<Playlist[]>([]);
    const [tracks, setTracks] = useState<Track[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        if (!accessToken) {
            setLoading(false);
            return;
        };

        const fetchData = async () => {
            try {
                setLoading(true);
                const [playlistsData, tracksData] = await Promise.all([
                    getPlaylists(),
                    getTracks(),
                ]);
                setPlaylists(playlistsData);
                setTracks(tracksData);
            } catch (error) {
                console.error('Failed to fetch data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [accessToken]);

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

    const handleRemoveFromPlaylist = (playlistId: string, trackId: string) => {
        setPlaylists(playlists.map(p => {
            if (p.id === playlistId) {
                return { ...p, tracks: p.tracks.filter(id => id !== trackId) };
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

    const handleUpdateTrackBpm = (trackId: string, newBpm: string) => {
        console.log(`Updating track ${trackId} to BPM: ${newBpm}`);
        setTracks(currentTracks =>
            currentTracks.map(track =>
                track.id === trackId ? { ...track, bpm: newBpm } : track
            )
        );
    };

    const handleUpdateTrackTags = (trackId: string, newTags: string[]) => {
        console.log(`Updating track ${trackId} with tags: ${newTags.join(', ')}`);
        setTracks(currentTracks =>
            currentTracks.map(track =>
                track.id === trackId ? { ...track, tags: newTags } : track
            )
        );
    };

    return {
        playlists,
        tracks,
        loading,
        handleReorderTrack,
        handleRemoveFromPlaylist,
        handleMoveToPlaylist,
        handleUpdateTrackBpm,
        handleUpdateTrackTags,
    };
};
