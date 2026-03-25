import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Upload } from "lucide-react";
import TrackItem from "../features/track/components/TrackItem";
import PlaylistHeader from "../features/track/components/PlaylistHeader";
import PlayerControls from "../features/track/components/PlayerControls";
import ProgressBar from "../features/track/components/ProgressBar";
import { getPlaylist, removeSongByPosition, moveSong } from "../services/api";

interface Track {
  id: string;
  title: string;
  artist: string;
  duration: string;
  position: number;
  filename?: string;
}

const formatTime = (time: number) => {
  if (isNaN(time)) return "0:00";
  const minutes = Math.floor(time / 60);
  const seconds = Math.floor(time % 60);
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
};

export default function HomePage() {
  const navigate = useNavigate();
  const [tracks, setTracks] = useState<Track[]>([]);
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentTimeStr, setCurrentTimeStr] = useState("0:00");
  const [durationStr, setDurationStr] = useState("0:00");
  const [volume, setVolume] = useState(1);

  const audioRef = useRef<HTMLAudioElement | null>(null);

  const loadPlaylistData = async (): Promise<Track[] | null> => {
    try {
      const data = await getPlaylist();
      return data.map((item: { position: number; title: string; artist?: string; filename?: string; duration?: string }) => ({
        id: item.position.toString() + "-" + item.title,
        title: item.title,
        artist: item.artist || "Unknown Artist",
        duration: item.duration || "0:00",
        position: item.position,
        filename: item.filename,
      }));
    } catch (error) {
      console.error("Failed to fetch playlist", error);
      return null;
    }
  };

  const refreshPlaylist = async () => {
    const mappedTracks = await loadPlaylistData();
    if (mappedTracks) {
      setTracks(mappedTracks);
    }
  };

  useEffect(() => {
    let isMounted = true;

    const fetchInitial = async () => {
      const mappedTracks = await loadPlaylistData();
      if (isMounted && mappedTracks) {
        setTracks(mappedTracks);
        setCurrentTrack((prev) => {
          if (!prev && mappedTracks.length > 0) {
            return mappedTracks[0];
          }
          return prev;
        });
      }
    };

    void fetchInitial();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current
          .play()
          .catch((e) => console.error("Error playing audio:", e));
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, currentTrack]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      const currentTime = audioRef.current.currentTime;
      const duration = audioRef.current.duration;
      setCurrentTimeStr(formatTime(currentTime));
      if (duration) {
        setProgress((currentTime / duration) * 100);
      }
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDurationStr(formatTime(audioRef.current.duration));
    }
  };

  const handleProgressChange = (newProgress: number) => {
    if (audioRef.current && audioRef.current.duration) {
      const newTime = (newProgress / 100) * audioRef.current.duration;
      audioRef.current.currentTime = newTime;
      setProgress(newProgress);
    }
  };

  const handleDeleteTrack = async (id: string) => {
    try {
      const trackToDelete = tracks.find((t) => t.id === id);
      if (trackToDelete) {
        await removeSongByPosition(trackToDelete.position);
        await refreshPlaylist();

        if (currentTrack?.id === id) {
          setCurrentTrack(null);
          setIsPlaying(false);
          setProgress(0);
          setCurrentTimeStr("0:00");
          setDurationStr("0:00");
        }
      }
    } catch (error) {
      console.error("Failed to delete track", error);
    }
  };

  const handleSelectTrack = (track: Track) => {
    setCurrentTrack(track);
    setIsPlaying(true);
  };

  const handleDragStart = (e: React.DragEvent, index: number) => {
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/plain", index.toString());
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleDrop = async (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();
    const dragIndex = parseInt(e.dataTransfer.getData("text/plain"), 10);

    if (dragIndex !== dropIndex) {
      const newTracks = [...tracks];
      const [draggedItem] = newTracks.splice(dragIndex, 1);
      newTracks.splice(dropIndex, 0, draggedItem);
      setTracks(newTracks);

      try {
        await moveSong(dragIndex + 1, dropIndex + 1);
        await refreshPlaylist();
      } catch (error) {
        console.error("Failed to move track", error);
        await refreshPlaylist();
      }
    }
  };

  const handlePrintPlaylist = () => {
    window.print();
  };

  const handleNextTrack = () => {
    if (currentTrack) {
      const currentIndex = tracks.findIndex((t) => t.id === currentTrack.id);
      if (currentIndex !== -1) {
        const nextIndex = currentIndex === tracks.length - 1 ? 0 : currentIndex + 1;
        handleSelectTrack(tracks[nextIndex]);
      }
    }
  };

  const handlePrevTrack = () => {
    if (currentTrack) {
      const currentIndex = tracks.findIndex((t) => t.id === currentTrack.id);
      if (currentIndex !== -1) {
        const prevIndex = currentIndex === 0 ? tracks.length - 1 : currentIndex - 1;
        handleSelectTrack(tracks[prevIndex]);
      }
    }
  };

  const handleEnded = () => {
    setIsPlaying(false);
    setProgress(0);
    setCurrentTimeStr("0:00");
    handleNextTrack();
  };

  return (
    <div className="h-screen w-full flex justify-center overflow-hidden">
      <div className="w-full h-full flex flex-col p-8 gap-6 overflow-hidden">
        {currentTrack?.filename && (
          <audio
            ref={audioRef}
            src={`http://localhost:3000/api/v1/tracks/stream/${currentTrack.filename}`}
            onTimeUpdate={handleTimeUpdate}
            onLoadedMetadata={handleLoadedMetadata}
            onEnded={handleEnded}
          />
        )}

        {/* Header */}
        <header className="flex items-center justify-between pb-6 w-full">
          <h1 className="font-primary text-sm font-semibold tracking-[3px] text-white">
            MUSIC PLAYER
          </h1>
          <div className="flex gap-4">
            <button
              onClick={() => navigate("/upload")}
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
                  onSelect={handleSelectTrack}
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
                {currentTrack
                  ? `${currentTrack.position}. ${currentTrack.title}`
                  : "No track selected"}
              </h3>
              <p className="font-secondary text-sm text-text-secondary">
                {currentTrack?.artist || "Select a track to play"}
              </p>
            </div>

            <ProgressBar
              currentTime={currentTimeStr}
              duration={durationStr}
              progress={progress}
              onProgressChange={handleProgressChange}
            />

            <PlayerControls
              isPlaying={isPlaying}
              onPlayPauseClick={() => {
                if (currentTrack) {
                  setIsPlaying(!isPlaying);
                }
              }}
              onSkipBackClick={handlePrevTrack}
              onSkipForwardClick={handleNextTrack}
              volume={volume}
              onVolumeChange={setVolume}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
