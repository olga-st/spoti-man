// src/api/spotify.ts
import type { Playlist } from '../types';

const SPOTIFY_API_BASE = 'https://api.spotify.com/v1';

// This function will handle mapping the Spotify API response to our internal type
const mapSpotifyPlaylist = (item: any): Playlist => {
    return {
        id: item.id,
        name: item.name,
        imageUrl: item.images?.[0]?.url || 'https://placehold.co/300x300/1DB954/FFFFFF?text=Spotify',
        trackCount: item.tracks.total,
    };
};

export const getPlaylists = async (accessToken: string): Promise<Playlist[]> => {
    console.log('Fetching REAL playlists...');
    
    const response = await fetch(`${SPOTIFY_API_BASE}/me/playlists`, {
        headers: {
            Authorization: `Bearer ${accessToken}`,
        },
    });

    if (!response.ok) {
        // In a real app, you'd handle this error more gracefully
        throw new Error('Failed to fetch playlists');
    }

    const data = await response.json();
    // Filter out playlists that might not have a valid name or id.
    return data.items
        .filter((item: any) => item.id && item.name)
        .map(mapSpotifyPlaylist);
};

// We need a type for the track object from the Spotify API
// We'll only include the fields we care about for now.
export interface SpotifyTrack {
    id: string;
    name: string;
    artists: { name: string }[];
    album: {
        name: string;
        images: { url: string }[];
    };
    duration_ms: number;
}

const mapSpotifyTrack = (item: any): SpotifyTrack | null => {
    const track = item.track;
    // Some tracks, like local files or removed tracks, might not have a full track object.
    if (!track || !track.id || !track.album?.images) {
        return null;
    }
    return {
        id: track.id,
        name: track.name,
        artists: track.artists,
        album: track.album,
        duration_ms: track.duration_ms,
    };
};

export const getPlaylistDetails = async (playlistId: string, accessToken: string): Promise<{playlist: Playlist, tracks: SpotifyTrack[]}> => {
    console.log(`Fetching details for playlist ${playlistId}...`);

    const [playlistResponse, tracksResponse] = await Promise.all([
        fetch(`${SPOTIFY_API_BASE}/playlists/${playlistId}`, {
            headers: { Authorization: `Bearer ${accessToken}` },
        }),
        fetch(`${SPOTIFY_API_BASE}/playlists/${playlistId}/tracks`, {
            headers: { Authorization: `Bearer ${accessToken}` },
        }),
    ]);
    
    if (!playlistResponse.ok || !tracksResponse.ok) {
        throw new Error('Failed to fetch playlist details');
    }

    const playlistData = await playlistResponse.json();
    const tracksData = await tracksResponse.json();

    const playlist = mapSpotifyPlaylist(playlistData);
    const tracks = tracksData.items
        .map(mapSpotifyTrack)
        .filter((track: SpotifyTrack | null): track is SpotifyTrack => track !== null);

    return { playlist, tracks };
}
