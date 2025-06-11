import React from 'react';

interface LoginPageProps {
    onLogin: () => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
    return (
        <div className="bg-gray-900 text-white min-h-screen font-sans flex flex-col items-center justify-center">
            <header className="text-center mb-8">
                <h1 className="text-5xl font-bold text-green-400">Spotify Playlist Manager</h1>
                <p className="text-gray-300">Your music, your rules.</p>
            </header>
            <button onClick={onLogin} className="bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-6 rounded-full transition-colors text-lg">
                Login with Spotify
            </button>
        </div>
    );
}; 