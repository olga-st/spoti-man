// src/hooks/usePlaylistManager.ts
// A custom hook to encapsulate playlist fetching logic.

import { useState, useEffect } from 'react';
import { getPlaylists } from '../api/spotify';
import type { Playlist } from '../types';
import { useAuth } from '../context/AuthContext';

export const usePlaylistManager = () => {
    const { accessToken } = useAuth();
    const [playlists, setPlaylists] = useState<Playlist[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        if (!accessToken) {
            setLoading(false);
            return;
        };

        const fetchPlaylists = async () => {
            try {
                setLoading(true);
                const playlistsData = await getPlaylists(accessToken);
                setPlaylists(playlistsData);
            } catch (error) {
                console.error('Failed to fetch playlists:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchPlaylists();
    }, [accessToken]);

    // Note: All track-specific logic like reordering, moving, and editing
    // will be handled in the component responsible for a single playlist,
    // as we now fetch tracks on a per-playlist basis.

    return {
        playlists,
        loading,
    };
};
