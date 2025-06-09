// src/types/index.ts
// Defines the core data structures for the application.

export interface Track {
    id: string;
    name: string;
    artist: string;
    album: string;
    tags: string[];
    bpm: string;
    duration: string;
}

export interface Playlist {
    id:string;
    name: string;
    tracks: string[]; // Array of track IDs
    imageUrl: string;
}
