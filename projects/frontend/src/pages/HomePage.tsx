import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload } from 'lucide-react';
import TrackItem from '../features/track/components/TrackItem';
import PlaylistHeader from '../features/track/components/PlaylistHeader';
import PlayerControls from '../features/track/components/PlayerControls';
import ProgressBar from '../features/track/components/ProgressBar';
import { getPlaylist, removeSongByPosition, moveSong } from '../services/api';

interface Track {
  id: string;
  title: string;
  artist: string;
  duration: string;
  position: number;
}

export default function HomePage() {
  const navigate = useNavigate();
  const [tracks, setTracks] = useState<Track[]>([]);
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);

  const fetchPlaylist = React.useCallback(async () => {
    try {
      const data = await getPlaylist();
      const mappedTracks = data.map((item: { position: number, title: string }) => ({
        id: item.position.toString() + '-' + item.title,
        title: item.title,
        artist: 'Unknown Artist',
        duration: '0:00',
        position: item.position
      }));
      setTracks(mappedTracks);
      // Wait to set currentTrack until we have mappedTracks
      setCurrentTrack(prev => {
        if (!prev && mappedTracks.length > 0) {
          return mappedTracks[0];
        }
        return prev;
      });
    } catch (error) {
      console.error('Failed to fetch playlist', error);
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void fetchPlaylist();
  }, [fetchPlaylist]);

  const handleDeleteTrack = async (id: string) => {
    try {
      const trackToDelete = tracks.find(t => t.id === id);
      if (trackToDelete) {
        await removeSongByPosition(trackToDelete.position);
        await fetchPlaylist();
        
        if (currentTrack?.id === id) {
          setCurrentTrack(null);
        }
      }
    } catch (error) {
      console.error('Failed to delete track', error);
    }
  };

  const handleDragStart = (e: React.DragEvent, index: number) => {
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', index.toString());
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = async (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();
    const dragIndex = parseInt(e.dataTransfer.getData('text/plain'), 10);
    
    if (dragIndex !== dropIndex) {
      // Optimistic UI update
      const newTracks = [...tracks];
      const [draggedItem] = newTracks.splice(dragIndex, 1);
      newTracks.splice(dropIndex, 0, draggedItem);
      setTracks(newTracks);

      try {
        // Backend DLL is 1-indexed
        await moveSong(dragIndex + 1, dropIndex + 1);
        await fetchPlaylist();
      } catch (error) {
        console.error('Failed to move track', error);
        await fetchPlaylist(); // Revert on failure
      }
    }
  };

  const handlePrintPlaylist = () => {
    // We could call the API to just console.log, but window.print() is good for UI
    window.print();
  };

  return (
    <div className="h-screen w-full flex justify-center overflow-hidden">
      <div className="w-full h-full flex flex-col p-8 gap-6 overflow-hidden">
        {/* Header */}
        <header className="flex items-center justify-between pb-6 w-full">
          <h1 className="font-primary text-sm font-semibold tracking-[3px] text-white">MUSIC PLAYER</h1>
          <div className="flex gap-4">
            <button 
              onClick={() => navigate('/upload')}
              className="flex items-center gap-2 px-4 py-2.5 bg-primary text-black rounded-lg font-secondary font-medium text-sm hover:bg-primary-dark transition-colors shadow-lg shadow-primary/30"
            >
              <Upload className="w-4 h-4" />
              Upload Music
            </button>
          </div>
        </header>

        {/* Main content area */}
        <div className="flex-1 flex flex-col gap-6 overflow-hidden w-full">
          {/* Playlist Section */}
          <div className="flex-1 flex flex-col gap-4 bg-surface rounded-2xl p-6 border border-border overflow-hidden">
            <PlaylistHeader onPrint={handlePrintPlaylist} />

            {/* Songs List */}
            <div className="flex-1 overflow-y-auto">
              {tracks.map((track, index) => (
                <TrackItem
                  key={track.id}
                  track={track}
                  index={index}
                  isSelected={currentTrack?.id === track.id}
                  onSelect={setCurrentTrack}
                  onDelete={handleDeleteTrack}
                  onDragStart={handleDragStart}
                  onDragOver={handleDragOver}
                  onDrop={handleDrop}
                />
              ))}
              {tracks.length === 0 && (
                <div className="text-center text-text-secondary py-8 font-secondary">
                  Playlist is empty. Upload some music!
                </div>
              )}
            </div>
          </div>

          {/* Player Section */}
          <div className="bg-surface rounded-2xl p-6 border border-border flex flex-col gap-3">
            {/* Song Info */}
            <div className="flex flex-col items-center gap-1">
              <h3 className="font-primary text-sm font-semibold text-white">
                {currentTrack ? `${currentTrack.position}. ${currentTrack.title}` : 'No track selected'}
              </h3>
              <p className="font-secondary text-sm text-text-secondary">
                {currentTrack?.artist || 'Select a track to play'}
              </p>
            </div>

            <ProgressBar
              currentTime="0:00"
              duration={currentTrack?.duration || '0:00'}
              progress={progress}
              onProgressChange={setProgress}
            />

            <PlayerControls
              isPlaying={isPlaying}
              onPlayPauseClick={() => setIsPlaying(!isPlaying)}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
