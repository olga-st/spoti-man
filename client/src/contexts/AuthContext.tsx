import React, { createContext, useContext, useState, useEffect } from 'react';
import type { AuthTokens } from '../services/auth';
import { getTokensFromCode, refreshTokens, getAuthUrl } from '../services/auth';

interface AuthContextType {
    isAuthenticated: boolean;
    accessToken: string | null;
    login: () => void;
    logout: () => void;
    handleAuthCode: (code: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [accessToken, setAccessToken] = useState<string | null>(null);
    const [refreshToken, setRefreshToken] = useState<string | null>(null);
    const [tokenExpiry, setTokenExpiry] = useState<number | null>(null);

    useEffect(() => {
        // Check for tokens in localStorage on mount
        const storedTokens = localStorage.getItem('spotify_tokens');
        if (storedTokens) {
            const tokens: AuthTokens = JSON.parse(storedTokens);
            setAccessToken(tokens.access_token);
            setRefreshToken(tokens.refresh_token);
            setTokenExpiry(Date.now() + tokens.expires_in * 1000);
        }

        // Check for auth code in URL (after redirect)
        const params = new URLSearchParams(window.location.search);
        const code = params.get('code');
        if (code) {
            handleAuthCode(code);
            // Clean up URL
            window.history.replaceState({}, document.title, window.location.pathname);
        }
    }, []);

    useEffect(() => {
        // Set up token refresh
        if (tokenExpiry) {
            const timeUntilExpiry = tokenExpiry - Date.now();
            if (timeUntilExpiry > 0) {
                const refreshTimeout = setTimeout(refreshAccessToken, timeUntilExpiry - 60000); // Refresh 1 minute before expiry
                return () => clearTimeout(refreshTimeout);
            }
        }
    }, [tokenExpiry]);

    const handleAuthCode = async (code: string) => {
        try {
            const tokens = await getTokensFromCode(code);
            saveTokens(tokens);
        } catch (error) {
            console.error('Failed to get tokens:', error);
            logout();
        }
    };

    const refreshAccessToken = async () => {
        if (!refreshToken) return;

        try {
            const tokens = await refreshTokens(refreshToken);
            saveTokens(tokens);
        } catch (error) {
            console.error('Failed to refresh tokens:', error);
            logout();
        }
    };

    const saveTokens = (tokens: AuthTokens) => {
        setAccessToken(tokens.access_token);
        setRefreshToken(tokens.refresh_token);
        setTokenExpiry(Date.now() + tokens.expires_in * 1000);
        localStorage.setItem('spotify_tokens', JSON.stringify(tokens));
    };

    const login = () => {
        const authUrl = getAuthUrl();
        console.log('Attempting to login with URL:', authUrl);
        if (authUrl) {
            window.location.href = authUrl;
        } else {
            console.error('Failed to generate auth URL');
        }
    };

    const logout = () => {
        setAccessToken(null);
        setRefreshToken(null);
        setTokenExpiry(null);
        localStorage.removeItem('spotify_tokens');
    };

    return (
        <AuthContext.Provider
            value={{
                isAuthenticated: !!accessToken,
                accessToken,
                login,
                logout,
                handleAuthCode
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}; 