import React, { useEffect, useState, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const AuthCallbackPage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { setAccessToken } = useAuth();
    const [error, setError] = useState<string | null>(null);
    const hasRun = useRef(false);

    useEffect(() => {
        if (hasRun.current) return;

        const params = new URLSearchParams(location.search);
        const code = params.get('code');
        const errorParam = params.get('error');

        if (errorParam) {
            setError(`Spotify login failed: ${errorParam}`);
            return;
        }

        if (code) {
            hasRun.current = true;
            const exchangeCode = async (codeToExchange: string) => {
                try {
                    const response = await fetch('http://127.0.0.1:8080/token', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({ code: codeToExchange }),
                    });

                    if (!response.ok) {
                        const errorData = await response.json();
                        setError(`Failed to get token: ${errorData.error_description || 'Unknown server error'}`);
                        return;
                    }

                    const data = await response.json();
                    const { accessToken, expiresIn } = data;

                    const expiryTime = new Date().getTime() + (expiresIn || 3600) * 1000;
                    console.log('[DEBUG] Setting token and expiry:', { accessToken, expiryTime });
                    window.localStorage.setItem('spotify_access_token', accessToken);
                    window.localStorage.setItem('spotify_token_expiry', expiryTime.toString());
                    
                    setAccessToken(accessToken);
                } catch (e) {
                    setError('An unexpected error occurred during token exchange.');
                }
            };
            
            exchangeCode(code);
        }
    }, [location.search, setAccessToken]);

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