import type { Playlist, Track } from '../types';

const SPOTIFY_API_BASE = 'https://api.spotify.com/v1';

interface SpotifyPlaylist {
  id: string;
  name: string;
  images: { url: string }[];
  tracks: {
    total: number;
    items: {
      track: {
        id: string;
        name: string;
        artists: { name: string }[];
        album: { name: string };
        duration_ms: number;
      };
    }[];
  };
}

interface SpotifyTrack {
  id: string;
  name: string;
  artists: { name: string }[];
  album: { name: string };
  duration_ms: number;
}

export const spotifyApi = {
  async getPlaylists(accessToken: string): Promise<Playlist[]> {
    if (!accessToken) {
      throw new Error('Access token is required');
    }

    try {
      const response = await fetch(`${SPOTIFY_API_BASE}/me/playlists?limit=50`, {
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Failed to fetch playlists:', {
          status: response.status,
          statusText: response.statusText,
          error: errorText
        });
        throw new Error(`Failed to fetch playlists: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      console.log('Successfully fetched playlists:', data.items.length);
      return data.items.map((playlist: SpotifyPlaylist) => ({
        id: playlist.id,
        name: playlist.name,
        imageUrl: playlist.images?.[0]?.url || 'https://placehold.co/300/191414/FFFFFF?text=No+Image',
        tracks: [] // We'll fetch tracks separately
      }));
    } catch (error) {
      console.error('Error in getPlaylists:', error);
      throw error;
    }
  },

  async getPlaylistTracks(accessToken: string, playlistId: string): Promise<Track[]> {
    const response = await fetch(`${SPOTIFY_API_BASE}/playlists/${playlistId}/tracks`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    });

    if (!response.ok) {
      throw new Error('Failed to fetch playlist tracks');
    }

    const data = await response.json();
    return data.items.map((item: { track: SpotifyTrack }) => ({
      id: item.track.id,
      name: item.track.name,
      artist: item.track.artists.map(a => a.name).join(', '),
      album: item.track.album.name,
      duration: formatDuration(item.track.duration_ms),
      bpm: '', // We'll need to fetch this from a different API
      tags: []
    }));
  },

  async updatePlaylist(accessToken: string, playlistId: string, changes: Partial<Playlist>): Promise<void> {
    if (changes.name) {
      await fetch(`${SPOTIFY_API_BASE}/playlists/${playlistId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name: changes.name })
      });
    }
  },

  async reorderTracks(
    accessToken: string,
    playlistId: string,
    trackId: string,
    newPosition: number
  ): Promise<void> {
    await fetch(`${SPOTIFY_API_BASE}/playlists/${playlistId}/tracks`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        range_start: 0, // We'll need to find the current position
        insert_before: newPosition,
        range_length: 1
      })
    });
  },

  async removeTracks(
    accessToken: string,
    playlistId: string,
    trackIds: string[]
  ): Promise<void> {
    await fetch(`${SPOTIFY_API_BASE}/playlists/${playlistId}/tracks`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        tracks: trackIds.map(id => ({ uri: `spotify:track:${id}` }))
      })
    });
  },

  async addTracks(
    accessToken: string,
    playlistId: string,
    trackIds: string[]
  ): Promise<void> {
    await fetch(`${SPOTIFY_API_BASE}/playlists/${playlistId}/tracks`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        uris: trackIds.map(id => `spotify:track:${id}`)
      })
    });
  }
};

function formatDuration(ms: number): string {
  const minutes = Math.floor(ms / 60000);
  const seconds = Math.floor((ms % 60000) / 1000);
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
} 