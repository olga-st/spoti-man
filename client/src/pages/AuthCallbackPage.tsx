import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const AuthCallbackPage = () => {
    const navigate = useNavigate();
    const { setAccessToken } = useAuth();
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const exchangeCode = async (code: string) => {
            const codeVerifier = window.localStorage.getItem('spotify_code_verifier');
            if (!codeVerifier) {
                setError('Code verifier not found. Please try logging in again.');
                return;
            }

            const clientId = import.meta.env.VITE_SPOTIFY_CLIENT_ID;
            const redirectUri = import.meta.env.VITE_SPOTIFY_REDIRECT_URI;

            const response = await fetch('https://accounts.spotify.com/api/token', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: new URLSearchParams({
                    client_id: clientId,
                    grant_type: 'authorization_code',
                    code,
                    redirect_uri: redirectUri,
                    code_verifier: codeVerifier,
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                setError(`Failed to get token: ${errorData.error_description}`);
                return;
            }

            const data = await response.json();
            const { access_token, expires_in } = data;

            const expiryTime = new Date().getTime() + expires_in * 1000;
            window.localStorage.setItem('spotify_access_token', access_token);
            window.localStorage.setItem('spotify_token_expiry', expiryTime.toString());
            
            setAccessToken(access_token);
            navigate('/');
        };

        const params = new URLSearchParams(window.location.search);
        const code = params.get('code');
        const errorParam = params.get('error');

        if (errorParam) {
            setError(`Spotify login failed: ${errorParam}`);
        } else if (code) {
            exchangeCode(code);
        } else {
            // No code and no error, redirect to home
            navigate('/');
        }
    }, [navigate, setAccessToken]);

    if (error) {
        return (
            <div className="flex flex-col justify-center items-center h-screen text-red-400">
                <h2 className="text-2xl font-bold mb-4">Authentication Error</h2>
                <p>{error}</p>
                <button onClick={() => navigate('/')} className="mt-4 bg-gray-700 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded">
                    Go to Homepage
                </button>
            </div>
        );
    }

    return (
        <div className="flex justify-center items-center h-screen">
            <div>Authenticating...</div>
        </div>
    );
}; 