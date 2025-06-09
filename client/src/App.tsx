import React, { useState, FormEvent, useMemo } from 'react';

// --- TYPE DEFINITIONS ---
interface Track {
    id: string;
    name: string;
    artist: string;
    album: string;
    tags: string[];
    bpm: string;
    duration: string; // Added duration
}

interface Playlist {
    id:string;
    name: string;
    tracks: string[]; // Array of track IDs
    imageUrl: string; // Added for playlist cover art
}

// --- MOCK DATA ---
const mockTracks: Track[] = [
    { id: '1', name: 'Bohemian Rhapsody', artist: 'Queen', album: 'A Night at the Opera', tags: ['rock', 'classic'], bpm: '72', duration: '5:55' },
    { id: '2', name: 'Stairway to Heaven', artist: 'Led Zeppelin', album: 'Led Zeppelin IV', tags: ['rock', '70s'], bpm: '82', duration: '8:02' },
    { id: '3', name: 'Hotel California', artist: 'Eagles', album: 'Hotel California', tags: ['rock', 'soft rock'], bpm: '74', duration: '6:30' },
    { id: '4', name: 'Smells Like Teen Spirit', artist: 'Nirvana', album: 'Nevermind', tags: ['grunge', '90s'], bpm: '117', duration: '5:01' },
    { id: '5', name: 'Billie Jean', artist: 'Michael Jackson', album: 'Thriller', tags: ['pop', '80s'], bpm: '117', duration: '4:54' },
];

const mockPlaylists: Playlist[] = [
    { id: 'p1', name: 'Classic Rock Anthems', tracks: ['1', '2', '3'], imageUrl: 'https://placehold.co/300x300/1DB954/FFFFFF?text=Rock' },
    { id: 'p2', name: '90s Alternative', tracks: ['4'], imageUrl: 'https://placehold.co/300x300/4a4a4a/FFFFFF?text=90s' },
    { id: 'p3', name: 'Driving Mix', tracks: ['5', '4'], imageUrl: 'https://placehold.co/300x300/f56a00/FFFFFF?text=Drive' },
];

// --- ICONS ---
const PlusIcon: React.FC = () => ( <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-plus"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg> );
const TrashIcon: React.FC = () => ( <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-trash-2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg> );
const ArrowLeftIcon: React.FC = () => ( <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-arrow-left"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg> );
const ArrowUpIcon: React.FC = () => ( <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-arrow-up"><line x1="12" y1="19" x2="12" y2="5"></line><polyline points="5 12 12 5 19 12"></polyline></svg> );
const ArrowDownIcon: React.FC = () => ( <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-arrow-down"><line x1="12" y1="5" x2="12" y2="19"></line><polyline points="19 12 12 19 5 12"></polyline></svg> );
const CopyIcon: React.FC = () => ( <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-copy"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg> );


// --- COMPONENT PROPS ---
interface PlaylistViewProps { 
    playlist: Playlist; 
    tracks: Track[]; 
    onReorder: (playlistId: string, trackIndex: number, direction: 'up' | 'down') => void;
    onRemoveFromPlaylist: (playlistId: string, trackId: string) => void;
    onStartMoveTrack: (trackId: string) => void;
}
interface PlaylistListProps { playlists: Playlist[]; onSelectPlaylist: (id: string) => void; }
interface AddToPlaylistModalProps {
    isOpen: boolean;
    playlists: Playlist[];
    onClose: () => void;
    onSelectPlaylist: (playlistId: string) => void;
}

// --- CHILD COMPONENTS ---

const PlaylistView: React.FC<PlaylistViewProps> = ({ playlist, tracks, onReorder, onRemoveFromPlaylist, onStartMoveTrack }) => {
    const playlistTracks = playlist.tracks.map(trackId => tracks.find(t => t.id === trackId)).filter((t): t is Track => !!t);

    return (
        <div className="bg-gray-800 rounded-lg overflow-hidden">
            <table className="w-full text-left">
                <thead className="bg-gray-700 text-gray-400 uppercase text-sm">
                    <tr>
                        <th className="p-4 w-12 text-center">#</th>
                        <th className="p-4">Title</th>
                        <th className="p-4">Artist</th>
                        <th className="p-4">Duration</th>
                        <th className="p-4">BPM</th>
                        <th className="p-4">Tags</th>
                        <th className="p-4"></th>
                    </tr>
                </thead>
                <tbody>
                    {playlistTracks.map((track, index) => (
                        <tr key={track.id} className="border-b border-gray-700 hover:bg-gray-700/50">
                            <td className="p-4 text-center text-gray-400">{index + 1}</td>
                            <td className="p-4 font-semibold">{track.name}</td>
                            <td className="p-4 text-gray-300">{track.artist}</td>
                            <td className="p-4 text-gray-300">{track.duration}</td>
                            <td className="p-4 text-gray-300">{track.bpm}</td>
                            <td className="p-4">
                                <div className="flex flex-wrap gap-2">
                                    {track.tags.map(tag => (
                                        <span key={tag} className="bg-blue-600 text-white px-2 py-1 rounded-full text-xs">{tag}</span>
                                    ))}
                                </div>
                            </td>
                            <td className="p-4">
                                <div className="flex items-center justify-end gap-3">
                                    <button onClick={() => onStartMoveTrack(track.id)} className="text-gray-400 hover:text-white"><CopyIcon /></button>
                                    <button onClick={() => onReorder(playlist.id, index, 'up')} disabled={index === 0} className="text-gray-400 hover:text-white disabled:text-gray-600 disabled:cursor-not-allowed"><ArrowUpIcon /></button>
                                    <button onClick={() => onReorder(playlist.id, index, 'down')} disabled={index === playlistTracks.length - 1} className="text-gray-400 hover:text-white disabled:text-gray-600 disabled:cursor-not-allowed"><ArrowDownIcon /></button>
                                    <button onClick={() => onRemoveFromPlaylist(playlist.id, track.id)} className="text-red-400 hover:text-red-300"><TrashIcon /></button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

const PlaylistListScreen: React.FC<PlaylistListProps> = ({ playlists, onSelectPlaylist }) => {
    return (
        <div>
            <h2 className="text-3xl font-bold mb-6">Your Playlists</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                {playlists.map(playlist => (
                    <div key={playlist.id} onClick={() => onSelectPlaylist(playlist.id)} className="bg-gray-800 rounded-lg overflow-hidden cursor-pointer group transition-all duration-300 hover:bg-gray-700">
                        <img src={playlist.imageUrl} alt={playlist.name} className="w-full h-48 object-cover group-hover:opacity-80 transition-opacity" />
                        <div className="p-4">
                            <h3 className="font-bold text-lg truncate">{playlist.name}</h3>
                            <p className="text-sm text-gray-400">{playlist.tracks.length} tracks</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

const AddToPlaylistModal: React.FC<AddToPlaylistModalProps> = ({ isOpen, playlists, onClose, onSelectPlaylist }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
            <div className="bg-gray-800 rounded-lg p-6 w-full max-w-md">
                <h3 className="text-2xl font-bold mb-4">Add to another playlist</h3>
                <div className="space-y-2">
                    {playlists.map(p => (
                        <button key={p.id} onClick={() => onSelectPlaylist(p.id)} className="w-full text-left p-3 rounded-md bg-gray-700 hover:bg-gray-600 transition-colors">
                            {p.name}
                        </button>
                    ))}
                </div>
                <button onClick={onClose} className="mt-6 w-full p-2 rounded-md bg-gray-600 hover:bg-gray-500 transition-colors">
                    Cancel
                </button>
            </div>
        </div>
    )
}

// --- MAIN APP COMPONENT ---
export default function App() {
    const [tracks, setTracks] = useState<Track[]>(mockTracks);
    const [playlists, setPlaylists] = useState<Playlist[]>(mockPlaylists);
    const [activePlaylistId, setActivePlaylistId] = useState<string | null>(null);
    const [trackToMove, setTrackToMove] = useState<string | null>(null);

    const handleRemoveFromPlaylist = (playlistId: string, trackId: string) => { setPlaylists(playlists.map(p => { if (p.id === playlistId) { return { ...p, tracks: p.tracks.filter(id => id !== trackId) }; } return p; })); };
    const handleReorderTrack = (playlistId: string, trackIndex: number, direction: 'up' | 'down') => {
        setPlaylists(prevPlaylists => prevPlaylists.map(p => {
            if (p.id === playlistId) {
                const newTracks = [...p.tracks];
                const [movedTrack] = newTracks.splice(trackIndex, 1);
                const newIndex = direction === 'up' ? trackIndex - 1 : trackIndex + 1;
                newTracks.splice(newIndex, 0, movedTrack);
                return { ...p, tracks: newTracks };
            }
            return p;
        }));
    };

    const handleStartMoveTrack = (trackId: string) => {
        setTrackToMove(trackId);
    };

    const handleMoveToPlaylist = (destinationPlaylistId: string) => {
        if (!trackToMove) return;

        setPlaylists(prevPlaylists => prevPlaylists.map(p => {
            if (p.id === destinationPlaylistId) {
                if (p.tracks.includes(trackToMove)) {
                    return p; // Track is already in the playlist
                }
                return { ...p, tracks: [...p.tracks, trackToMove] };
            }
            return p;
        }));

        setTrackToMove(null); // Close the modal
    };

    const activePlaylist = useMemo(() => playlists.find(p => p.id === activePlaylistId), [playlists, activePlaylistId]);
    const otherPlaylists = useMemo(() => playlists.filter(p => p.id !== activePlaylistId), [playlists, activePlaylistId]);

    return (
        <div className="bg-gray-900 text-white min-h-screen font-sans">
            <div className="container mx-auto p-4 md:p-8">
                <header className="text-center mb-8">
                    <h1 className="text-5xl font-bold text-green-400">Spotify Playlist Manager</h1>
                    <p className="text-gray-300">Your music, your rules.</p>
                </header>

                <main>
                    {activePlaylist ? (
                        // --- Playlist Detail View ---
                        <div>
                             <button onClick={() => setActivePlaylistId(null)} className="flex items-center gap-2 text-gray-300 hover:text-white mb-6 p-2 rounded-md bg-gray-800 hover:bg-gray-700 transition-colors">
                                <ArrowLeftIcon />
                                Back to Playlists
                            </button>
                            <h2 className="text-3xl font-bold mb-4">{activePlaylist.name}</h2>
                            <PlaylistView 
                                playlist={activePlaylist} 
                                tracks={tracks}
                                onReorder={handleReorderTrack}
                                onRemoveFromPlaylist={handleRemoveFromPlaylist} 
                                onStartMoveTrack={handleStartMoveTrack}
                            />
                        </div>
                    ) : (
                        // --- Playlist List View ---
                        <PlaylistListScreen playlists={playlists} onSelectPlaylist={setActivePlaylistId} />
                    )}
                </main>
                <AddToPlaylistModal 
                    isOpen={!!trackToMove}
                    playlists={otherPlaylists}
                    onClose={() => setTrackToMove(null)}
                    onSelectPlaylist={handleMoveToPlaylist}
                />
            </div>
        </div>
    );
}
