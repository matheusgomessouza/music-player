import { Play, Pause, Rewind, FastForward } from 'lucide-react';

interface PlayerControlsProps {
  isPlaying: boolean;
  onPlayPauseClick: () => void;
  onSkipBackClick?: () => void;
  onSkipForwardClick?: () => void;
}

export default function PlayerControls({
  isPlaying,
  onPlayPauseClick,
  onSkipBackClick,
  onSkipForwardClick,
}: PlayerControlsProps) {
  return (
    <div className="flex items-center justify-center gap-6">
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
  );
}
