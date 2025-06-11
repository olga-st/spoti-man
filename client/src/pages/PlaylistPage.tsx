// src/pages/PlaylistPage.tsx
import React, { useState, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { PlaylistView } from '../components/PlaylistView';
import { usePlaylistManager } from '../hooks/usePlaylistManager';
import { ArrowLeftIcon } from '../components/Icons';
import { AddToPlaylistModal } from '../components/AddToPlaylistModal';

export function PlaylistPage() {
    const { playlistId } = useParams<{ playlistId: string }>();
    const { tracks, playlists, loading, handleReorderTrack, handleRemoveFromPlaylist, handleMoveToPlaylist, handleUpdateTrackBpm, handleUpdateTrackTags } = usePlaylistManager();
    const [trackToMove, setTrackToMove] = useState<string | null>(null);

    const activePlaylist = useMemo(() => playlists.find(p => p.id === playlistId), [playlists, playlistId]);
    const otherPlaylists = useMemo(() => playlists.filter(p => p.id !== playlistId), [playlists, playlistId]);

    const onMoveSelected = (destinationPlaylistId: string) => {
        if (trackToMove) {
            handleMoveToPlaylist(trackToMove, destinationPlaylistId);
        }
        setTrackToMove(null); // Close the modal after selection.
    }

    if (loading) {
        return <div>Loading playlist...</div>;
    }

    if (!activePlaylist) {
        return <div>Playlist not found</div>;
    }

    return (
        <div className="w-full">
            <Link to="/" className="flex items-center gap-2 text-gray-300 hover:text-white mb-6 p-2 rounded-md bg-gray-800 hover:bg-gray-700 transition-colors">
                <ArrowLeftIcon />
                Back to Playlists
            </Link>
            <h2 className="text-3xl font-bold mb-4">{activePlaylist.name}</h2>
            <PlaylistView
                playlist={activePlaylist}
                tracks={tracks}
                onReorder={handleReorderTrack}
                onRemoveFromPlaylist={handleRemoveFromPlaylist}
                onStartMoveTrack={setTrackToMove}
                onUpdateTrackBpm={handleUpdateTrackBpm}
                onUpdateTrackTags={handleUpdateTrackTags}
            />
            <AddToPlaylistModal
                isOpen={!!trackToMove}
                playlists={otherPlaylists}
                onClose={() => setTrackToMove(null)}
                onSelectPlaylist={onMoveSelected}
            />
        </div>
    );
} 