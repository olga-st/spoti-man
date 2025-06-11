// src/api/spotify.ts
import { mockPlaylists, mockTracks } from '../data/mockData';
import type { Playlist, Track } from '../types';

// Simulate API calls

export const getPlaylists = async (): Promise<Playlist[]> => {
    console.log('Fetching playlists...');
    // Simulate a network delay
    await new Promise(resolve => setTimeout(resolve, 500));
    console.log('Playlists fetched:', mockPlaylists);
    return mockPlaylists;
};

export const getTracks = async (): Promise<Track[]> => {
    console.log('Fetching tracks...');
    // Simulate a network delay
    await new Promise(resolve => setTimeout(resolve, 500));
    console.log('Tracks fetched:', mockTracks);
    return mockTracks;
};

export const getPlaylistById = async (id: string): Promise<Playlist | undefined> => {
    console.log(`Fetching playlist with id: ${id}...`);
    await new Promise(resolve => setTimeout(resolve, 500));
    const playlist = mockPlaylists.find(p => p.id === id);
    console.log('Playlist fetched:', playlist);
    return playlist;
} 