// src/hooks/usePlaylistManager.ts
// A custom hook to encapsulate all playlist and track management logic.

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { spotifyApi } from '../services/spotify';
import type { Playlist, Track } from '../types';

export const usePlaylistManager = () => {
    const { accessToken } = useAuth();
    const [playlists, setPlaylists] = useState<Playlist[]>([]);
    const [tracks, setTracks] = useState<Track[]>([]);
    const [activePlaylist, setActivePlaylist] = useState<Playlist | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const loadPlaylists = useCallback(async () => {
        if (!accessToken) return;
        
        setIsLoading(true);
        setError(null);
        try {
            const response = await spotifyApi.getPlaylists(accessToken);
            setPlaylists(response);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to load playlists');
        } finally {
            setIsLoading(false);
        }
    }, [accessToken]);

    const loadTracks = useCallback(async (playlistId: string) => {
        if (!accessToken) return;
        
        setIsLoading(true);
        setError(null);
        try {
            const response = await spotifyApi.getPlaylistTracks(accessToken, playlistId);
            setTracks(response);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to load tracks');
        } finally {
            setIsLoading(false);
        }
    }, [accessToken]);

    const handleReorder = useCallback((playlistId: string, trackId: string, newPosition: number) => {
        setTracks(prevTracks => {
            const trackIndex = prevTracks.findIndex(t => t.id === trackId);
            if (trackIndex === -1) return prevTracks;

            const newTracks = [...prevTracks];
            const [movedTrack] = newTracks.splice(trackIndex, 1);
            newTracks.splice(newPosition, 0, movedTrack);

            return newTracks;
        });
    }, []);

    const handleRemoveTrack = useCallback((playlistId: string, trackId: string) => {
        setTracks(prevTracks => prevTracks.filter(track => track.id !== trackId));
    }, []);

    const handleMoveTracks = useCallback((sourcePlaylistId: string, targetPlaylistId: string, trackIds: string[]) => {
        setTracks(prevTracks => prevTracks.filter(track => !trackIds.includes(track.id)));
    }, []);

    const handleUpdateTrack = useCallback((playlistId: string, trackId: string, updates: Partial<Track>) => {
        setTracks(prevTracks => 
            prevTracks.map(track => 
                track.id === trackId 
                    ? { ...track, ...updates }
                    : track
            )
        );
    }, []);

    const getPlaylistTrackCount = useCallback((playlistId: string) => {
        const playlist = playlists.find(p => p.id === playlistId);
        return playlist?.tracks?.length || 0;
    }, [playlists]);

    const addPlaylist = async (playlist: Playlist) => {
        try {
            await spotifyApi.updatePlaylist(accessToken!, playlist.id, playlist);
            setPlaylists([...playlists, playlist]);
        } catch (err) {
            console.error('Error adding playlist:', err);
            throw err;
        }
    };

    const updatePlaylist = async (updatedPlaylist: Playlist) => {
        try {
            await spotifyApi.updatePlaylist(accessToken!, updatedPlaylist.id, updatedPlaylist);
            setPlaylists(playlists.map(p => 
                p.id === updatedPlaylist.id ? updatedPlaylist : p
            ));
        } catch (err) {
            console.error('Error updating playlist:', err);
            throw err;
        }
    };

    const deletePlaylist = async (playlistId: string) => {
        try {
            // Note: Spotify API doesn't support deleting playlists
            // We'll just remove it from our local state
            setPlaylists(playlists.filter(p => p.id !== playlistId));
        } catch (err) {
            console.error('Error deleting playlist:', err);
            throw err;
        }
    };

    const moveTracks = async (tracksToMove: Track[], destinationPlaylistId: string) => {
        try {
            const trackIds = tracksToMove.map(track => track.id);
            await spotifyApi.addTracks(accessToken!, destinationPlaylistId, trackIds);
            
            setPlaylists(playlists.map(p => {
                if (p.id === destinationPlaylistId) {
                    const newTrackIds = [...p.tracks];
                    trackIds.forEach(id => {
                        if (!newTrackIds.includes(id)) {
                            newTrackIds.push(id);
                        }
                    });
                    return { ...p, tracks: newTrackIds };
                }
                return p;
            }));
        } catch (err) {
            console.error('Error moving tracks:', err);
            throw err;
        }
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
        playlists,
        tracks,
        activePlaylist,
        setActivePlaylist,
        isLoading,
        error,
        loadPlaylists,
        loadTracks,
        handleReorder,
        handleRemoveTrack,
        handleMoveTracks,
        handleUpdateTrack,
        getPlaylistTrackCount,
        addPlaylist,
        updatePlaylist,
        deletePlaylist,
        moveTracks,
        handleMoveToPlaylist,
    };
};
