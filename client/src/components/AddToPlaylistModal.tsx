// src/components/AddToPlaylistModal.tsx
// The modal for adding a track to another playlist.

import React from 'react';
import type { Playlist } from '../types/index';

interface AddToPlaylistModalProps {
    isOpen: boolean;
    playlists: Playlist[];
    onClose: () => void;
    onSelectPlaylist: (playlistId: string) => void;
}

export const AddToPlaylistModal: React.FC<AddToPlaylistModalProps> = ({ isOpen, playlists, onClose, onSelectPlaylist }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
            <div className="bg-gray-800 rounded-lg p-6 w-full max-w-md">
                <h3 className="text-2xl font-bold mb-4">Add to another playlist</h3>
                <div className="space-y-2">
                    {playlists.map(p => (
                        <button key={p.id} onClick={() => onSelectPlaylist(p.id)} className="w-full text-left p-3 rounded-md bg-gray-700 hover:bg-gray-600 transition-colors">
                            {p.name}
                        </button>
                    ))}
                </div>
                <button onClick={onClose} className="mt-6 w-full p-2 rounded-md bg-gray-600 hover:bg-gray-500 transition-colors">
                    Cancel
                </button>
            </div>
        </div>
    );
}
