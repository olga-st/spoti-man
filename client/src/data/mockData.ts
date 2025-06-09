// src/data/mockData.ts
// Contains mock data for initial state. Will be replaced by API calls.
import type { Track, Playlist } from '../types/index';

export const mockTracks: Track[] = [
    { id: '1', name: 'Bohemian Rhapsody', artist: 'Queen', album: 'A Night at the Opera', tags: ['rock', 'classic'], bpm: '72', duration: '5:55' },
    { id: '2', name: 'Stairway to Heaven', artist: 'Led Zeppelin', album: 'Led Zeppelin IV', tags: ['rock', '70s'], bpm: '82', duration: '8:02' },
    { id: '3', name: 'Hotel California', artist: 'Eagles', album: 'Hotel California', tags: ['rock', 'soft rock'], bpm: '74', duration: '6:30' },
    { id: '4', name: 'Smells Like Teen Spirit', artist: 'Nirvana', album: 'Nevermind', tags: ['grunge', '90s'], bpm: '117', duration: '5:01' },
    { id: '5', name: 'Billie Jean', artist: 'Michael Jackson', album: 'Thriller', tags: ['pop', '80s'], bpm: '117', duration: '4:54' },
];

export const mockPlaylists: Playlist[] = [
    { id: 'p1', name: 'Classic Rock Anthems', tracks: ['1', '2', '3'], imageUrl: 'https://placehold.co/300x300/1DB954/FFFFFF?text=Rock' },
    { id: 'p2', name: '90s Alternative', tracks: ['4'], imageUrl: 'https://placehold.co/300x300/4a4a4a/FFFFFF?text=90s' },
    { id: 'p3', name: 'Driving Mix', tracks: ['5', '4'], imageUrl: 'https://placehold.co/300x300/f56a00/FFFFFF?text=Drive' },
];
