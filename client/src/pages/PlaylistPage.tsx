// src/pages/PlaylistPage.tsx
import React, { useState, useEffect, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { PlaylistView } from '../components/PlaylistView';
import { ArrowLeftIcon } from '../components/Icons';
import { useAuth } from '../context/AuthContext';
import { getPlaylistDetails } from '../api/spotify';
import type { Playlist } from '../types';
import type { SpotifyTrack } from '../api/spotify';

// The Spotify API doesn't have BPM or tags. We'll add them to the track object
// for local state management. This is our application's internal representation of a track.
export type AppTrack = SpotifyTrack & {
    bpm?: string;
    tags?: string[];
};

export function PlaylistPage() {
    const { playlistId } = useParams<{ playlistId: string }>();
    const { accessToken } = useAuth();
    
    const [playlist, setPlaylist] = useState<Playlist | null>(null);
    const [tracks, setTracks] = useState<AppTrack[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const totalDurationMs = useMemo(() => {
        return tracks.reduce((total, track) => total + track.duration_ms, 0);
    }, [tracks]);

    const formatTotalDuration = (ms: number) => {
        const totalSeconds = Math.floor(ms / 1000);
        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        
        let parts = [];
        if (hours > 0) {
            parts.push(`${hours} hr`);
        }
        if (minutes > 0) {
            parts.push(`${minutes} min`);
        }
        return parts.join(' ');
    };

    useEffect(() => {
        if (!playlistId || !accessToken) {
            return;
        }

        const fetchData = async () => {
            try {
                setLoading(true);
                setError(null);
                const { playlist: playlistData, tracks: tracksData } = await getPlaylistDetails(playlistId, accessToken);
                setPlaylist(playlistData);
                // Augment the spotify track data with our local-only fields
                const appTracks = tracksData.map(track => ({ ...track, bpm: undefined, tags: [] }));
                setTracks(appTracks);
            } catch (err) {
                setError('Failed to load playlist. It might be empty or you might not have access.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [playlistId, accessToken]);

    const handleUpdateTrackBpm = (trackId: string, newBpm: string) => {
        console.log(`(Locally) Updating track ${trackId} to BPM: ${newBpm}`);
        setTracks(currentTracks =>
            currentTracks.map(track =>
                track.id === trackId ? { ...track, bpm: newBpm } : track
            )
        );
    };

    const handleUpdateTrackTags = (trackId: string, newTags: string[]) => {
        console.log(`(Locally) Updating track ${trackId} with tags: ${newTags.join(', ')}`);
        setTracks(currentTracks =>
            currentTracks.map(track =>
                track.id === trackId ? { ...track, tags: newTags } : track
            )
        );
    };

    if (loading) {
        return <div className="text-center p-8">Loading playlist...</div>;
    }

    if (error) {
        return <div className="text-center p-8 text-red-400">{error}</div>;
    }

    if (!playlist) {
        return <div className="text-center p-8">Playlist not found.</div>;
    }

    return (
        <div className="w-full">
            <Link to="/" className="inline-flex items-center gap-2 text-gray-300 hover:text-white mb-6 p-2 rounded-md bg-gray-800 hover:bg-gray-700 transition-colors">
                <ArrowLeftIcon />
                Back to Playlists
            </Link>
            <h2 className="text-3xl font-bold mb-1">{playlist.name}</h2>
            <p className="text-gray-400 mb-4">{tracks.length} songs, {formatTotalDuration(totalDurationMs)}</p>
            <PlaylistView
                tracks={tracks}
                onUpdateTrackBpm={handleUpdateTrackBpm}
                onUpdateTrackTags={handleUpdateTrackTags}
                // NOTE: Reordering and moving tracks is disabled for now
                // as it requires more complex API calls.
            />
        </div>
    );
} 