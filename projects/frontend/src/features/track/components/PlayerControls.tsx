import { Play, Pause, Rewind, FastForward, Volume2, VolumeX } from 'lucide-react';
import React, { useState } from 'react';

interface PlayerControlsProps {
  isPlaying: boolean;
  onPlayPauseClick: () => void;
  onSkipBackClick?: () => void;
  onSkipForwardClick?: () => void;
  volume: number;
  onVolumeChange: (volume: number) => void;
}

export default function PlayerControls({
  isPlaying,
  onPlayPauseClick,
  onSkipBackClick,
  onSkipForwardClick,
  volume,
  onVolumeChange,
}: PlayerControlsProps) {
  const [isMuted, setIsMuted] = useState(false);
  const [previousVolume, setPreviousVolume] = useState(volume);

  const handleMuteToggle = () => {
    if (isMuted) {
      setIsMuted(false);
      onVolumeChange(previousVolume > 0 ? previousVolume : 0.5);
    } else {
      setPreviousVolume(volume);
      setIsMuted(true);
      onVolumeChange(0);
    }
  };

  const handleVolumeSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    onVolumeChange(newVolume);
    if (newVolume === 0) {
      setIsMuted(true);
    } else if (isMuted) {
      setIsMuted(false);
    }
  };

  return (
    <div className="flex items-center justify-between w-full relative">
      {/* Spacer to keep center controls centered */}
      <div className="flex-1"></div>

      {/* Main Controls */}
      <div className="flex items-center justify-center gap-6 absolute left-1/2 -translate-x-1/2">
        <button 
          onClick={onSkipBackClick}
          className="hover:opacity-80 transition-opacity"
        >
          <Rewind className="w-6 h-6 text-white" />
        </button>
        
        <button
          onClick={onPlayPauseClick}
          className="w-12 h-12 flex items-center justify-center rounded-full bg-[var(--color-primary)] text-black hover:bg-[#a6e600] transition-colors shadow-[0_0_12px_var(--color-primary)]"
        >
          {isPlaying ? (
            <Pause className="w-6 h-6 fill-current" />
          ) : (
            <Play className="w-6 h-6 fill-current" />
          )}
        </button>
        
        <button 
          onClick={onSkipForwardClick}
          className="hover:opacity-80 transition-opacity"
        >
          <FastForward className="w-6 h-6 text-white" />
        </button>
      </div>

      {/* Volume Control */}
      <div className="flex items-center gap-3 flex-1 justify-end">
        <button 
          onClick={handleMuteToggle}
          className="hover:opacity-80 transition-opacity"
        >
          {isMuted || volume === 0 ? (
            <VolumeX className="w-5 h-5 text-text-secondary" />
          ) : (
            <Volume2 className="w-5 h-5 text-text-secondary" />
          )}
        </button>
        <div className="w-24 group flex items-center">
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={isMuted ? 0 : volume}
            onChange={handleVolumeSliderChange}
            className="w-full h-1.5 bg-neutral-700 rounded-lg appearance-none cursor-pointer accent-primary hover:accent-white transition-all outline-none [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:bg-[var(--color-primary)] [&::-webkit-slider-thumb]:rounded-full hover:[&::-webkit-slider-thumb]:scale-125 hover:[&::-webkit-slider-thumb]:bg-white"
            style={{
              background: `linear-gradient(to right, var(--color-primary) ${(isMuted ? 0 : volume) * 100}%, #404040 ${(isMuted ? 0 : volume) * 100}%)`
            }}
          />
        </div>
      </div>
    </div>
  );
}
