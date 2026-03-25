import React from 'react';

interface ProgressBarProps {
  currentTime: string;
  duration: string;
  progress: number;
  onProgressChange?: (percentage: number) => void;
  onSeekStart?: () => void;
  onSeekEnd?: () => void;
}

export default function ProgressBar({
  currentTime,
  duration,
  progress,
  onProgressChange,
  onSeekStart,
  onSeekEnd,
}: ProgressBarProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (onProgressChange) {
      onProgressChange(parseFloat(e.target.value));
    }
  };

  const handleSeekEnd = () => {
    if (onSeekEnd) {
      onSeekEnd();
    }
  };

  return (
    <div className="flex items-center gap-3 mb-3 w-full group">
      <span className="text-xs font-secondary text-white min-w-8.75 text-right">{currentTime}</span>
      <div className="flex-1 h-4 relative flex items-center">
        <input
          type="range"
          min="0"
          max="100"
          step="0.1"
          value={isNaN(progress) ? 0 : progress}
          onChange={handleChange}
          onMouseDown={onSeekStart}
          onMouseUp={handleSeekEnd}
          onTouchStart={onSeekStart}
          onTouchEnd={handleSeekEnd}
          className="w-full h-1 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-primary transition-all outline-none 
          [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-0 [&::-webkit-slider-thumb]:h-0 
          group-hover:[&::-webkit-slider-thumb]:w-3 group-hover:[&::-webkit-slider-thumb]:h-3 
          [&::-webkit-slider-thumb]:bg-primary [&::-webkit-slider-thumb]:rounded-full 
          [&::-webkit-slider-thumb]:shadow-lg hover:[&::-webkit-slider-thumb]:scale-125"
          style={{
            background: `linear-gradient(to right, var(--color-primary) ${progress}%, #374151 ${progress}%)`
          }}
        />
      </div>
      <span className="text-xs font-secondary text-white min-w-8.75">{duration}</span>
    </div>
  );
}
