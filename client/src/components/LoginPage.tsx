import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Button } from './common/Button';

export const LoginPage: React.FC = () => {
    const { login } = useAuth();

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-900">
            <div className="text-center">
                <h1 className="text-5xl font-bold text-green-400 mb-4">
                    Spotify Playlist Manager
                </h1>
                <p className="text-gray-300 mb-8">
                    Manage your playlists with custom BPM and tags
                </p>
                <Button
                    variant="primary"
                    size="lg"
                    onClick={login}
                >
                    Login with Spotify
                </Button>
            </div>
        </div>
    );
}; 