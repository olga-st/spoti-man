// src/context/AuthContext.tsx
import React, { createContext, useContext, useState, type ReactNode, useEffect } from 'react';
import pkceChallenge from 'pkce-challenge';

interface AuthContextType {
    accessToken: string | null;
    loading: boolean;
    login: () => void;
    logout: () => void;
    setAccessToken: (token: string | null) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [accessToken, setAccessToken] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        try {
            const token = window.localStorage.getItem('spotify_access_token');
            const expiryTime = window.localStorage.getItem('spotify_token_expiry');

            if (token && expiryTime && new Date().getTime() < parseInt(expiryTime, 10)) {
                setAccessToken(token);
            }
        } catch (e) {
            console.error("Error reading auth token from storage", e);
        } finally {
            setLoading(false);
        }
    }, []);

    const login = async () => {
        const challenge = await pkceChallenge();
        const { code_verifier, code_challenge } = challenge;

        window.localStorage.setItem('spotify_code_verifier', code_verifier);

        const clientId = import.meta.env.VITE_SPOTIFY_CLIENT_ID;
        const redirectUri = import.meta.env.VITE_SPOTIFY_REDIRECT_URI;
        const scopes = [
            'playlist-read-private',
            'playlist-modify-public',
            'playlist-modify-private',
        ];
        const authUrl = `https://accounts.spotify.com/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scopes.join('%20')}&response_type=code&code_challenge=${code_challenge}&code_challenge_method=S256&show_dialog=true`;
        
        window.location.href = authUrl;
    };

    const logout = () => {
        setAccessToken(null);
        window.localStorage.removeItem('spotify_access_token');
        window.localStorage.removeItem('spotify_token_expiry');
        window.localStorage.removeItem('spotify_code_verifier');
    };

    const value = { accessToken, loading, login, logout, setAccessToken };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}; 