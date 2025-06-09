import React, { useState, FormEvent, useMemo } from 'react';

// --- TYPE DEFINITIONS ---
interface Track {
    id: string;
    name: string;
    artist: string;
    album: string;
    tags: string[];
    bpm: string;
}

interface Playlist {
    id: string;
    name: string;
    tracks: string[]; // Array of track IDs
    imageUrl: string; // Added for playlist cover art
}

// --- MOCK DATA ---
const mockTracks: Track[] = [
    { id: '1', name: 'Bohemian Rhapsody', artist: 'Queen', album: 'A Night at the Opera', tags: ['rock', 'classic'], bpm: '72' },
    { id: '2', name: 'Stairway to Heaven', artist: 'Led Zeppelin', album: 'Led Zeppelin IV', tags: ['rock', '70s'], bpm: '82' },
    { id: '3', name: 'Hotel California', artist: 'Eagles', album: 'Hotel California', tags: ['rock', 'soft rock'], bpm: '74' },
    { id: '4', name: 'Smells Like Teen Spirit', artist: 'Nirvana', album: 'Nevermind', tags: ['grunge', '90s'], bpm: '117' },
    { id: '5', name: 'Billie Jean', artist: 'Michael Jackson', album: 'Thriller', tags: ['pop', '80s'], bpm: '117' },
];

const mockPlaylists: Playlist[] = [
    { id: 'p1', name: 'Classic Rock Anthems', tracks: ['1', '2', '3'], imageUrl: 'https://placehold.co/300x300/1DB954/FFFFFF?text=Rock' },
    { id: 'p2', name: '90s Alternative', tracks: ['4'], imageUrl: 'https://placehold.co/300x300/4a4a4a/FFFFFF?text=90s' },
    { id: 'p3', name: 'Driving Mix', tracks: ['5', '4'], imageUrl: 'https://placehold.co/300x300/f56a00/FFFFFF?text=Drive' },
];

// --- ICONS ---
const PlusIcon: React.FC = () => ( <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-plus"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg> );
const TrashIcon: React.FC = () => ( <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-trash-2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg> );
const EditIcon: React.FC = () => ( <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-edit-3"><path d="M12 20h9"></path><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path></svg> );
const ArrowLeftIcon: React.FC = () => ( <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-arrow-left"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg> );


// --- COMPONENT PROPS ---
interface TrackItemProps { track: Track; onTagSubmit: (trackId: string, newTags: string[], newBpm?: string) => void; }
interface PlaylistViewProps { playlist: Playlist; tracks: Track[]; onRemoveFromPlaylist: (playlistId: string, trackId: string) => void; onDeletePlaylist: (playlistId: string) => void; }
interface PlaylistListProps { playlists: Playlist[]; onSelectPlaylist: (id: string) => void; }


// --- CHILD COMPONENTS ---

const TrackItem: React.FC<TrackItemProps> = ({ track, onTagSubmit }) => {
    const [tagInput, setTagInput] = useState<string>('');
    const [bpmInput, setBpmInput] = useState<string>(track.bpm || '');
    const [isEditing, setIsEditing] = useState<boolean>(false);

    const handleTagSubmit = (e: FormEvent<HTMLFormElement>) => { e.preventDefault(); if (tagInput.trim()) { onTagSubmit(track.id, [...track.tags, tagInput.trim()]); setTagInput(''); } };
    const handleBpmSubmit = (e: FormEvent<HTMLFormElement>) => { e.preventDefault(); onTagSubmit(track.id, track.tags, bpmInput); setIsEditing(false); }

    return ( <div className="bg-gray-800 p-4 rounded-lg mb-2 flex flex-col sm:flex-row justify-between items-start sm:items-center"> <div> <p className="font-bold text-lg">{track.name}</p> <p className="text-gray-400">{track.artist} - {track.album}</p> <div className="flex flex-wrap gap-2 mt-2"> {track.tags.map(tag => ( <span key={tag} className="bg-blue-600 text-white px-2 py-1 rounded-full text-xs">{tag}</span> ))} {track.bpm && <span className="bg-green-600 text-white px-2 py-1 rounded-full text-xs">BPM: {track.bpm}</span>} </div> </div> <div className="mt-4 sm:mt-0 flex flex-col gap-2 w-full sm:w-auto"> <form onSubmit={handleTagSubmit} className="flex gap-2"> <input type="text" value={tagInput} onChange={(e) => setTagInput(e.target.value)} placeholder="Add tag" className="bg-gray-700 border border-gray-600 rounded-md px-2 py-1 w-full sm:w-auto" /> <button type="submit" className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-md"><PlusIcon /></button> </form> <div className="flex items-center gap-2"> {isEditing ? ( <form onSubmit={handleBpmSubmit} className="flex gap-2"> <input type="number" value={bpmInput} onChange={(e) => setBpmInput(e.target.value)} placeholder="Set BPM" className="bg-gray-700 border border-gray-600 rounded-md px-2 py-1 w-full" /> <button type="submit" className="bg-green-500 hover:bg-green-600 text-white p-2 rounded-md">Save</button> </form> ) : ( <button onClick={() => setIsEditing(true)} className="bg-gray-600 hover:bg-gray-700 text-white p-2 rounded-md flex items-center gap-1 text-sm"> <EditIcon /> <span>{bpmInput ? `BPM: ${bpmInput}` : 'Set BPM'}</span> </button> )} </div> </div> </div> );
};

const PlaylistView: React.FC<PlaylistViewProps> = ({ playlist, tracks, onRemoveFromPlaylist, onDeletePlaylist }) => {
    const playlistTracks = playlist.tracks.map(trackId => tracks.find(t => t.id === trackId)).filter((t): t is Track => !!t);

    return ( <div className="bg-gray-800 p-6 rounded-lg"> <div className="flex justify-between items-center mb-4"> <h3 className="text-2xl font-bold">{playlist.name}</h3> <button onClick={() => onDeletePlaylist(playlist.id)} className="bg-red-600 hover:bg-red-700 text-white p-2 rounded-md"><TrashIcon /></button> </div> <div> {playlistTracks.length > 0 ? ( playlistTracks.map((track) => ( <div key={track.id} className="flex items-center justify-between bg-gray-700 p-3 rounded-md mb-2"> <div> <p className="font-semibold">{track.name}</p> <p className="text-sm text-gray-400">{track.artist}</p> </div> <div className="flex items-center gap-2"> <button onClick={() => onRemoveFromPlaylist(playlist.id, track.id)} className="text-red-400 hover:text-red-300"> <TrashIcon /> </button> </div> </div> )) ) : ( <p className="text-gray-400">This playlist is empty.</p> )} </div> </div> );
};

// --- SCREEN COMPONENTS ---

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


// --- MAIN APP COMPONENT ---
export default function App() {
    const [tracks, setTracks] = useState<Track[]>(mockTracks);
    const [playlists, setPlaylists] = useState<Playlist[]>(mockPlaylists);
    const [activePlaylistId, setActivePlaylistId] = useState<string | null>(null);
    const [newPlaylistName, setNewPlaylistName] = useState<string>('');
    const [searchTerm, setSearchTerm] = useState<string>('');

    const handleTagUpdate = (trackId: string, newTags: string[], newBpm?: string) => { setTracks(prevTracks => prevTracks.map(t => { if (t.id === trackId) { const updatedTrack: Track = {...t}; if (newTags) updatedTrack.tags = newTags; if (newBpm !== undefined) updatedTrack.bpm = newBpm; return updatedTrack; } return t; })); };
    const handleCreatePlaylist = (e: FormEvent<HTMLFormElement>) => { e.preventDefault(); if (newPlaylistName.trim()) { const newPlaylist: Playlist = { id: `p${Date.now()}`, name: newPlaylistName.trim(), tracks: [], imageUrl: `https://placehold.co/300x300/CCCCCC/FFFFFF?text=${newPlaylistName.substring(0, 3)}` }; setPlaylists([...playlists, newPlaylist]); setNewPlaylistName(''); } };
    const handleDeletePlaylist = (playlistId: string) => { setPlaylists(playlists.filter(p => p.id !== playlistId)); setActivePlaylistId(null); }
    const handleAddToPlaylist = (trackId: string) => { if (!activePlaylistId) { console.error("Please select a playlist first!"); return; } setPlaylists(playlists.map(p => { if (p.id === activePlaylistId && !p.tracks.includes(trackId)) { return { ...p, tracks: [...p.tracks, trackId] }; } return p; })); };
    const handleRemoveFromPlaylist = (playlistId: string, trackId: string) => { setPlaylists(playlists.map(p => { if (p.id === playlistId) { return { ...p, tracks: p.tracks.filter(id => id !== trackId) }; } return p; })); };

    const filteredTracks = useMemo(() => tracks.filter(track => track.name.toLowerCase().includes(searchTerm.toLowerCase()) || track.artist.toLowerCase().includes(searchTerm.toLowerCase()) || track.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))), [tracks, searchTerm]);
    const activePlaylist = useMemo(() => playlists.find(p => p.id === activePlaylistId), [playlists, activePlaylistId]);

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
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                <div>
                                    <h2 className="text-3xl font-bold mb-4">All Tracks</h2>
                                    <input type="text" placeholder="Search tracks by name, artist, tag..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="bg-gray-800 border border-gray-700 rounded-md w-full p-3 mb-4" />
                                    <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
                                        {filteredTracks.map(track => ( <div key={track.id}> <TrackItem track={track} onTagSubmit={handleTagUpdate} /> <button onClick={() => handleAddToPlaylist(track.id)} className="mt-2 w-full bg-green-500 hover:bg-green-600 text-white py-2 rounded-md flex items-center justify-center gap-2"> <PlusIcon /> Add to "{activePlaylist.name}" </button> </div> ))}
                                    </div>
                                </div>
                                <div>
                                    <h2 className="text-3xl font-bold mb-4">Selected Playlist</h2>
                                    <PlaylistView playlist={activePlaylist} tracks={tracks} onDeletePlaylist={handleDeletePlaylist} onRemoveFromPlaylist={handleRemoveFromPlaylist} />
                                </div>
                            </div>
                        </div>
                    ) : (
                        // --- Playlist List View ---
                        <PlaylistListScreen playlists={playlists} onSelectPlaylist={setActivePlaylistId} />
                    )}
                </main>
            </div>
        </div>
    );
}
