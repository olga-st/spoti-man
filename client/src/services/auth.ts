const SPOTIFY_AUTH_ENDPOINT = 'https://accounts.spotify.com/authorize';
const SPOTIFY_TOKEN_ENDPOINT = 'https://accounts.spotify.com/api/token';
const CLIENT_ID = import.meta.env.VITE_SPOTIFY_CLIENT_ID;
const REDIRECT_URI = import.meta.env.VITE_REDIRECT_URI || 'http://127.0.0.1:5173/callback';
const SCOPES = [
    'playlist-read-private',
    'playlist-modify-public',
    'playlist-modify-private',
    'user-read-private',
    'user-read-email'
];

export interface AuthTokens {
    access_token: string;
    refresh_token: string;
    expires_in: number;
    token_type: string;
}

export const getAuthUrl = () => {
    if (!CLIENT_ID) {
        console.error('Spotify Client ID is not set in environment variables');
        return '';
    }

    const params = new URLSearchParams({
        client_id: CLIENT_ID,
        response_type: 'code',
        redirect_uri: REDIRECT_URI,
        scope: SCOPES.join(' '),
        show_dialog: 'true'
    });

    const url = `${SPOTIFY_AUTH_ENDPOINT}?${params.toString()}`;
    console.log('Auth URL:', url);
    return url;
};

export const getTokensFromCode = async (code: string): Promise<AuthTokens> => {
    if (!CLIENT_ID || !import.meta.env.VITE_SPOTIFY_CLIENT_SECRET) {
        console.error('Missing client credentials:', {
            clientId: CLIENT_ID ? 'set' : 'missing',
            clientSecret: import.meta.env.VITE_SPOTIFY_CLIENT_SECRET ? 'set' : 'missing'
        });
        throw new Error('Missing client credentials');
    }

    const params = new URLSearchParams({
        grant_type: 'authorization_code',
        code,
        redirect_uri: REDIRECT_URI,
        client_id: CLIENT_ID,
        client_secret: import.meta.env.VITE_SPOTIFY_CLIENT_SECRET
    });

    console.log('Requesting tokens with params:', {
        grant_type: 'authorization_code',
        code: '***',
        redirect_uri: REDIRECT_URI,
        client_id: CLIENT_ID
    });

    const response = await fetch(SPOTIFY_TOKEN_ENDPOINT, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: params.toString()
    });

    if (!response.ok) {
        const errorText = await response.text();
        console.error('Token request failed:', {
            status: response.status,
            statusText: response.statusText,
            error: errorText
        });
        throw new Error(`Failed to get tokens: ${response.status} ${response.statusText}`);
    }

    const tokens = await response.json();
    console.log('Successfully received tokens');
    return tokens;
};

export const refreshTokens = async (refreshToken: string): Promise<AuthTokens> => {
    const params = new URLSearchParams({
        grant_type: 'refresh_token',
        refresh_token: refreshToken,
        client_id: CLIENT_ID,
        client_secret: import.meta.env.VITE_SPOTIFY_CLIENT_SECRET
    });

    const response = await fetch(SPOTIFY_TOKEN_ENDPOINT, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: params.toString()
    });

    if (!response.ok) {
        throw new Error('Failed to refresh tokens');
    }

    return response.json();
}; 