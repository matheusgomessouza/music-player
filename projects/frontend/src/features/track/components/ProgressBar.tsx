import React from 'react';

interface ProgressBarProps {
  currentTime: string;
  duration: string;
  progress: number;
  onProgressChange?: (percentage: number) => void;
}

export default function ProgressBar({
  currentTime,
  duration,
  progress,
  onProgressChange,
}: ProgressBarProps) {
  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!onProgressChange) return;
    
    const progressBar = e.currentTarget;
    const rect = progressBar.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percentage = (x / rect.width) * 100;
    
    onProgressChange(Math.max(0, Math.min(100, percentage)));
  };

  return (
    <div className="flex items-center gap-3 mb-3">
      <span className="text-xs font-secondary text-white">{currentTime}</span>
      <div
        className="flex-1 h-1 bg-gray-700 rounded-sm overflow-hidden cursor-pointer group"
        onClick={handleProgressClick}
      >
        <div
          className="h-full bg-primary rounded-sm shadow-lg shadow-primary/50 transition-all"
          style={{ width: `${progress}%` }}
        />
      </div>
      <span className="text-xs font-secondary text-white">{duration}</span>
    </div>
  );
}
